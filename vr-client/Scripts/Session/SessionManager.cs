using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fusion;
using Fusion.Sockets;
using UnityEngine;
using UnityEngine.Events;
using VRArchitecture.Core;
using VRArchitecture.Models;
using VRArchitecture.UI;

namespace VRArchitecture.Session
{
    /// <summary>
    /// Central authority for VR session lifecycle.
    /// Owns: connection, participant tracking, model handoff, session state machine.
    /// Attach to a persistent GameObject in the Bootstrap scene.
    /// </summary>
    public class SessionManager : MonoBehaviour, INetworkRunnerCallbacks
    {
        // ─── Singleton ───────────────────────────────────────────────
        public static SessionManager Instance { get; private set; }

        // ─── Inspector ───────────────────────────────────────────────
        [Header("Fusion")]
        [SerializeField] private NetworkRunner _runnerPrefab;
        [SerializeField] private NetworkObject  _playerAvatarPrefab;

        [Header("References")]
        [SerializeField] private HUDController        _hud;
        [SerializeField] private ModelStreamLoader    _modelLoader;
        [SerializeField] private Annotation.AnnotationController _annotationController;

        [Header("Config")]
        [SerializeField] private int   _maxParticipants = 8;
        [SerializeField] private float _pingInterval    = 5f;   // seconds

        // ─── Events ──────────────────────────────────────────────────
        public UnityEvent<SessionState>           OnStateChanged      = new();
        public UnityEvent<ParticipantData>        OnParticipantJoined = new();
        public UnityEvent<ParticipantData>        OnParticipantLeft   = new();
        public UnityEvent<string>                 OnSessionError      = new();
        public UnityEvent<float>                  OnSessionDuration   = new();  // fires every second

        // ─── State ───────────────────────────────────────────────────
        public SessionState   CurrentState    { get; private set; } = SessionState.Idle;
        public SessionData    ActiveSession   { get; private set; }
        public NetworkRunner  Runner          { get; private set; }
        public bool           IsHost          => Runner != null && Runner.IsServer;
        public float          SessionDuration { get; private set; }

        private readonly Dictionary<PlayerRef, ParticipantData> _participants = new();
        private Coroutine _timerCoroutine;
        private Coroutine _pingCoroutine;

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        // ─── Public API ──────────────────────────────────────────────

        /// <summary>
        /// Called by the dashboard web layer via deep-link or in-app button.
        /// </summary>
        public async Task JoinSessionAsync(string sessionToken)
        {
            if (CurrentState != SessionState.Idle)
            {
                Debug.LogWarning("[SessionManager] Cannot join: already in a session.");
                return;
            }

            SetState(SessionState.Connecting);

            try
            {
                // 1. Exchange token → session data (mocking the API exchange for now)
                // In a real project, this would call ApiClient.Instance.GetSessionDataAsync(sessionToken)
                ActiveSession = new SessionData
                {
                    SessionId = Guid.NewGuid().ToString(),
                    RoomName = "vr-arch-" + sessionToken,
                    ModelUrl = "https://vrarch-cdn.azureedge.net/models/6/v1/model.glb",
                    ModelVersion = 1,
                    IsHost = true,
                    ProjectId = Guid.NewGuid(),
                    ProjectName = "Skyline Tower — Unit 14B",
                    Latitude = 59.3f, // Mock default
                    StartsAt = DateTime.UtcNow
                };

                // 2. Spin up Photon Fusion runner
                Runner = Instantiate(_runnerPrefab);
                Runner.AddCallbacks(this);

                var startArgs = new StartGameArgs
                {
                    GameMode    = ActiveSession.IsHost ? GameMode.Host : GameMode.Client,
                    SessionName = ActiveSession.RoomName,
                    Scene       = SceneRef.FromIndex(1),   // VR scene index
                    PlayerCount = _maxParticipants,
                    CustomLobbyName = "vra-global"
                };

                var result = await Runner.StartGame(startArgs);

                if (!result.Ok)
                {
                    throw new Exception($"Fusion start failed: {result.ShutdownReason}");
                }

                // 3. Kick off model loading
                if (_modelLoader != null)
                {
                    _ = _modelLoader.LoadAsync(ActiveSession.ModelUrl, ActiveSession.ModelVersion);
                }

                if (SunPositionSystem.Instance != null && ActiveSession.Latitude != 0)
                {
                    SunPositionSystem.Instance.latitude = ActiveSession.Latitude;
                }

                SetState(SessionState.Active);
                _timerCoroutine = StartCoroutine(SessionTimerRoutine());
                _pingCoroutine  = StartCoroutine(PingBackendRoutine());
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SessionManager] JoinSession failed: {ex.Message}");
                OnSessionError.Invoke(ex.Message);
                await CleanupAsync();
                SetState(SessionState.Error);
            }
        }

        public async Task LeaveSessionAsync()
        {
            if (CurrentState == SessionState.Idle) return;
            SetState(SessionState.Leaving);

            // Flush any pending annotations before disconnect
            if (_annotationController != null)
            {
                await _annotationController.FlushPendingAsync();
            }

            // Post session summary to backend would go here
            // await ApiClient.Instance.EndSessionAsync(ActiveSession.SessionId, SessionDuration);

            await CleanupAsync();
            SetState(SessionState.Idle);
        }

        public void EndSession()
        {
            SetState(SessionState.Ended);
            // This would trigger Summary UI from SessionSummaryUI listener
        }

        public void SetLocalMicMuted(bool muted)
        {
            if (Runner == null) return;
            // Photon Voice integration would go here
            Debug.Log($"[SessionManager] Mic muted: {muted}");
        }

        public IReadOnlyDictionary<PlayerRef, ParticipantData> GetParticipants()
            => _participants;

        // ─── INetworkRunnerCallbacks ─────────────────────────────────

        public void OnPlayerJoined(NetworkRunner runner, PlayerRef player)
        {
            if (!runner.IsServer) return;

            var avatarObj = runner.Spawn(
                _playerAvatarPrefab,
                Vector3.zero,
                Quaternion.identity,
                player
            );

            var data = new ParticipantData
            {
                PlayerId  = player,
                NetworkId = avatarObj.Id,
                JoinedAt  = DateTime.UtcNow,
            };

            _participants[player] = data;
            if (_hud != null) _hud.AddParticipant(data);
            OnParticipantJoined.Invoke(data);

            Debug.Log($"[SessionManager] Player joined: {player}");
        }

        public void OnPlayerLeft(NetworkRunner runner, PlayerRef player)
        {
            if (_participants.TryGetValue(player, out var data))
            {
                _participants.Remove(player);
                if (_hud != null) _hud.RemoveParticipant(data);
                OnParticipantLeft.Invoke(data);
            }
        }

        public void OnConnectedToServer(NetworkRunner runner)
            => Debug.Log("[SessionManager] Connected to Photon.");

        public void OnDisconnectedFromServer(NetworkRunner runner, NetDisconnectReason reason)
        {
            Debug.LogWarning($"[SessionManager] Disconnected: {reason}");
            if (CurrentState == SessionState.Active)
            {
                OnSessionError.Invoke($"Disconnected: {reason}");
                SetState(SessionState.Error);
            }
        }

        public void OnShutdown(NetworkRunner runner, ShutdownReason reason)
            => Debug.Log($"[SessionManager] Runner shutdown: {reason}");

        // Required empty implementations
        public void OnInput(NetworkRunner runner, NetworkInput input) { }
        public void OnInputMissing(NetworkRunner runner, PlayerRef player, NetworkInput input) { }
        public void OnUserSimulationMessage(NetworkRunner runner, SimulationMessage message) { }
        public void OnSessionListUpdated(NetworkRunner runner, List<SessionInfo> sessionList) { }
        public void OnCustomAuthenticationResponse(NetworkRunner runner, Dictionary<string, object> data) { }
        public void OnHostMigration(NetworkRunner runner, HostMigrationToken hostMigrationToken) { }
        public void OnReliableDataReceived(NetworkRunner runner, PlayerRef player, ReliableKey key, ArraySegment<byte> data) { }
        public void OnReliableDataProgress(NetworkRunner runner, PlayerRef player, ReliableKey key, float progress) { }
        public void OnSceneLoadDone(NetworkRunner runner) { }
        public void OnSceneLoadStart(NetworkRunner runner) { }
        public void OnObjectExitAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }
        public void OnObjectEnterAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }

        // ─── Private ─────────────────────────────────────────────────

        private void SetState(SessionState next)
        {
            if (CurrentState == next) return;
            CurrentState = next;
            Debug.Log($"[SessionManager] State → {next}");
            OnStateChanged.Invoke(next);
        }

        private IEnumerator SessionTimerRoutine()
        {
            while (CurrentState == SessionState.Active)
            {
                yield return new WaitForSeconds(1f);
                SessionDuration += 1f;
                OnSessionDuration.Invoke(SessionDuration);
                if (_hud != null) _hud.UpdateTimer(SessionDuration);
            }
        }

        private IEnumerator PingBackendRoutine()
        {
            while (CurrentState == SessionState.Active)
            {
                yield return new WaitForSeconds(_pingInterval);
                // ApiClient.Instance.PingSessionAsync(...)
            }
        }

        private async Task CleanupAsync()
        {
            if (_timerCoroutine != null) { StopCoroutine(_timerCoroutine); _timerCoroutine = null; }
            if (_pingCoroutine  != null) { StopCoroutine(_pingCoroutine);  _pingCoroutine  = null; }

            _participants.Clear();
            ActiveSession = null;
            SessionDuration = 0f;

            if (Runner != null)
            {
                await Runner.Shutdown();
                if (Runner != null && Runner.gameObject != null)
                {
                    Destroy(Runner.gameObject);
                }
                Runner = null;
            }
        }

        private void OnApplicationQuit()
        {
            if (CurrentState == SessionState.Active)
                _ = LeaveSessionAsync();
        }
    }
}
