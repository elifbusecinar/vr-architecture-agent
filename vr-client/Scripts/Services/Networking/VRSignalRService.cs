using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;
using UnityEngine;
using VRArchitecture.DTOs.Annotations;
using VRArchitecture.DTOs.VR;
using VRArchitecture.Services.Common;

namespace VRArchitecture.Services.Networking
{
    /// <summary>
    /// Handles real-time SignalR communication for VR synchronization.
    /// Manages connection lifecycle and event subscription.
    /// </summary>
    public class VRSignalRService : MonoBehaviour
    {
        private static VRSignalRService _instance;
        public static VRSignalRService Instance
        {
            get
            {
                if (_instance == null)
                {
                    var go = new GameObject("[VRSignalRService]");
                    _instance = go.AddComponent<VRSignalRService>();
                    DontDestroyOnLoad(go);
                }
                return _instance;
            }
        }

        private HubConnection _hubConnection;
        private string _hubUrl;
        private string _apiUrl;
        private string _accessToken;
        private string _refreshToken;
        private DateTime _expiresAt;

        [Serializable]
        public class Participant
        {
            public string ConnectionId;
            public string UserName;
        }

        [Serializable]
        public class NotificationSyncDto
        {
            public string id;
            public string title;
            public string message;
            public string type;
        }

        public System.Collections.Generic.List<Participant> ActiveParticipants = new System.Collections.Generic.List<Participant>();
        
        // Events for the UI/Synchronizer to consume
        public event Action<AvatarUpdateDto> OnUserMoved;
        public event Action<LaserUpdateDto> OnLaserUpdated;
        public event Action<VoiceSignalDto> OnVoiceSignalReceived;
        public event Action<AnnotationDto> OnAnnotationCreated;
        public event Action<string> OnAnnotationDeleted;
        public event Action<Participant> OnParticipantJoined;
        public event Action<string, string> OnSessionInvite; // sessionId, inviterName
        public event Action<NotificationSyncDto> OnNotificationReceived;
        public event Action<string> OnParticipantLeft;
        public event Action OnConnected;
        public event Action OnDisconnected;
        public event Action<Vector3Dto, QuaternionDto> OnSummonReceived;
        public event Action<string, bool> OnHighlightUpdated;
        public event Action<bool> OnLockReceived;
        public event Action<StrokeDto> OnStrokeReceived;
        public event Action<MeasurementDto> OnMeasurementReceived;
        public event Action<string> OnPresentationStarted;
        public event Action OnPresentationEnded;
        public event Action<string> OnSlideSynced;
        public event Action<string> OnPresenterMoved;
        public event Action<string> OnEnvironmentSynced;

        public bool IsConnected => _hubConnection?.State == HubConnectionState.Connected;
        public string ConnectionId => _hubConnection?.ConnectionId;

        public async void Initialize(string apiUrl, string hubUrl, string accessToken, string refreshToken, string expiresAt)
        {
            if (_hubConnection != null)
            {
                await _hubConnection.DisposeAsync();
            }

            _apiUrl = apiUrl;
            _hubUrl = hubUrl;
            _accessToken = accessToken;
            _refreshToken = refreshToken;
            
            if (DateTime.TryParse(expiresAt, out var exp))
                _expiresAt = exp;

            _hubConnection = new HubConnectionBuilder()
                .WithUrl(_hubUrl, options => {
                    options.AccessTokenProvider = GetOrRefreshToken;
                })
                .WithAutomaticReconnect()
                .Build();

            // Register Listeners
            _hubConnection.On<string>("UserMoved", (json) => {
                var data = JsonUtility.FromJson<AvatarUpdateDto>(json);
                MainThreadDispatcher.Enqueue(() => OnUserMoved?.Invoke(data));
            });

            _hubConnection.On<string>("LaserUpdated", (json) => {
                var data = JsonUtility.FromJson<LaserUpdateDto>(json);
                MainThreadDispatcher.Enqueue(() => OnLaserUpdated?.Invoke(data));
            });

            _hubConnection.On<string>("VoiceSignal", (json) => {
                var data = JsonUtility.FromJson<VoiceSignalDto>(json);
                MainThreadDispatcher.Enqueue(() => OnVoiceSignalReceived?.Invoke(data));
            });

            _hubConnection.On<string>("OnAnnotationCreated", (json) => {
                var data = JsonUtility.FromJson<AnnotationDto>(json);
                MainThreadDispatcher.Enqueue(() => OnAnnotationCreated?.Invoke(data));
            });

            _hubConnection.On<string>("OnAnnotationDeleted", (annotationId) => {
                MainThreadDispatcher.Enqueue(() => OnAnnotationDeleted?.Invoke(annotationId));
            });

            _hubConnection.On<string>("UserJoined", (json) => {
                var participant = JsonUtility.FromJson<Participant>(json);
                ActiveParticipants.Add(participant);
                MainThreadDispatcher.Enqueue(() => OnParticipantJoined?.Invoke(participant));
            });

            _hubConnection.On<string, string>("SessionInvite", (sessionId, inviterName) => {
                MainThreadDispatcher.Enqueue(() => OnSessionInvite?.Invoke(sessionId, inviterName));
            });

            _hubConnection.On<string>("UserLeft", (connectionId) => {
                ActiveParticipants.RemoveAll(p => p.ConnectionId == connectionId);
                MainThreadDispatcher.Enqueue(() => OnParticipantLeft?.Invoke(connectionId));
            });

            _hubConnection.On<NotificationSyncDto>("NotificationReceived", (dto) => {
                MainThreadDispatcher.Enqueue(() => OnNotificationReceived?.Invoke(dto));
            });

            _hubConnection.On<string>("OnSummon", (json) => {
                var data = JsonUtility.FromJson<SummonDto>(json);
                MainThreadDispatcher.Enqueue(() => OnSummonReceived?.Invoke(data.targetPosition, data.targetRotation));
            });

            _hubConnection.On<string, bool>("OnHighlight", (objectId, active) => {
                MainThreadDispatcher.Enqueue(() => OnHighlightUpdated?.Invoke(objectId, active));
            });

            _hubConnection.On<bool>("OnLock", (locked) => {
                MainThreadDispatcher.Enqueue(() => OnLockReceived?.Invoke(locked));
            });

            _hubConnection.On<string>("OnStroke", (json) => {
                var data = JsonUtility.FromJson<StrokeDto>(json);
                MainThreadDispatcher.Enqueue(() => OnStrokeReceived?.Invoke(data));
            });

            _hubConnection.On<string>("OnMeasurement", (json) => {
                var data = JsonUtility.FromJson<MeasurementDto>(json);
                MainThreadDispatcher.Enqueue(() => OnMeasurementReceived?.Invoke(data));
            });

            _hubConnection.On<string>("OnPresentationStarted", (presenterId) => {
                MainThreadDispatcher.Enqueue(() => OnPresentationStarted?.Invoke(presenterId));
            });

            _hubConnection.On("OnPresentationEnded", () => {
                MainThreadDispatcher.Enqueue(() => OnPresentationEnded?.Invoke());
            });

            _hubConnection.On<string>("OnSlideSynced", (json) => {
                MainThreadDispatcher.Enqueue(() => OnSlideSynced?.Invoke(json));
            });

            _hubConnection.On<string>("OnPresenterMoved", (json) => {
                MainThreadDispatcher.Enqueue(() => OnPresenterMoved?.Invoke(json));
            });

            _hubConnection.On<string>("OnEnvironmentSynced", (json) => {
                MainThreadDispatcher.Enqueue(() => OnEnvironmentSynced?.Invoke(json));
            });

            await StartConnection();
        }

        private async Task<string> GetOrRefreshToken()
        {
            // Simple refresh logic: if less than 5 mins left, refresh
            if (DateTime.UtcNow.AddMinutes(5) >= _expiresAt && !string.IsNullOrEmpty(_refreshToken))
            {
                await RefreshTokenAsync();
            }
            return _accessToken;
        }

        private async Task RefreshTokenAsync()
        {
            Debug.Log("[SignalR] Refreshing token...");
            try
            {
                // Simple WWWForm POST for token refresh
                using var www = UnityEngine.Networking.UnityWebRequest.PostWwwForm($"{_apiUrl}/api/auth/refresh", "");
                string jsonBody = "{\"refreshToken\":\"" + _refreshToken + "\"}";
                byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonBody);
                www.uploadHandler = new UnityEngine.Networking.UploadHandlerRaw(bodyRaw);
                www.downloadHandler = new UnityEngine.Networking.DownloadHandlerBuffer();
                www.SetRequestHeader("Content-Type", "application/json");

                var operation = www.SendWebRequest();
                while (!operation.isDone) await Task.Yield();

                if (www.result == UnityEngine.Networking.UnityWebRequest.Result.Success)
                {
                    // Update tokens from response
                    var response = JsonUtility.FromJson<TokenRefreshResponse>(www.downloadHandler.text);
                    _accessToken = response.accessToken;
                    _refreshToken = response.refreshToken;
                    if (DateTime.TryParse(response.expiry, out var exp))
                        _expiresAt = exp;
                    Debug.Log("[SignalR] Token refreshed successfully.");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SignalR] Token refresh failed: {ex.Message}");
            }
        }

        [Serializable]
        private class TokenRefreshResponse { public string accessToken; public string refreshToken; public string expiry; }

        public async Task StartConnection()
        {
            try
            {
                if (_hubConnection == null) return;
                
                await _hubConnection.StartAsync();
                Debug.Log($"[SignalR] Connected to Hub: {_hubUrl}");
                OnConnected?.Invoke();
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SignalR] Connection Error: {ex.Message}");
            }
        }

        public string CurrentSessionId { get; private set; }

        public async Task JoinSession(string sessionId)
        {
            if (!IsConnected) return;
            CurrentSessionId = sessionId;
            await _hubConnection.InvokeAsync("JoinProject", sessionId);
            Debug.Log($"[SignalR] Joined Session: {sessionId}");
        }

        public async void SendAvatarUpdate(AvatarUpdateDto data)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            try
            {
                string json = JsonUtility.ToJson(data);
                await _hubConnection.SendAsync("UpdateUserPosition", CurrentSessionId, json);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SignalR] Failed to send avatar update: {ex.Message}");
            }
        }

        public async void SendLaserUpdate(LaserUpdateDto data)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            try
            {
                string json = JsonUtility.ToJson(data);
                await _hubConnection.SendAsync("UpdateLaser", CurrentSessionId, json);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SignalR] Failed to send laser update: {ex.Message}");
            }
        }

        public async void SendVoiceSignal(VoiceSignalDto data)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            try
            {
                string json = JsonUtility.ToJson(data);
                await _hubConnection.SendAsync("SendVoiceSignal", CurrentSessionId, json);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SignalR] Failed to send voice signal: {ex.Message}");
            }
        }

        public async void SendAnnotation(string sessionId, object annotationData)
        {
            if (!IsConnected) return;
            try
            {
                // We send the raw object which Hub expects
                await _hubConnection.SendAsync("SendAnnotation", sessionId, annotationData);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[SignalR] Failed to send annotation: {ex.Message}");
            }
        }

        public async void BroadcastSummon(Vector3Dto pos, QuaternionDto rot)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            var data = new SummonDto { targetPosition = pos, targetRotation = rot };
            await _hubConnection.SendAsync("SummonParticipants", CurrentSessionId, JsonUtility.ToJson(data));
        }

        public async void BroadcastHighlight(string objectId, bool active)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("HighlightObject", CurrentSessionId, objectId, active);
        }

        public async void BroadcastLock(bool locked)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("SetSessionLock", CurrentSessionId, locked);
        }

        public async void BroadcastStroke(System.Collections.Generic.List<Vector3Dto> points, Color color)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            var data = new StrokeDto { points = points.ToArray(), color = color };
            await _hubConnection.SendAsync("SendStroke", CurrentSessionId, JsonUtility.ToJson(data));
        }

        public async void BroadcastMeasurement(MeasurementDto data)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("SendMeasurement", CurrentSessionId, JsonUtility.ToJson(data));
        }

        public async void BroadcastPresentationStart(string presenterId)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("StartPresentation", CurrentSessionId, presenterId);
        }

        public async void BroadcastPresentationEnd()
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("EndPresentation", CurrentSessionId);
        }

        public async void BroadcastSlide(string jsonSlide)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("SyncSlide", CurrentSessionId, jsonSlide);
        }

        public async void BroadcastPresenterTransform(string jsonTransform)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("SyncPresenterTransform", CurrentSessionId, jsonTransform);
        }

        public async void BroadcastEnvironment(string jsonEnv)
        {
            if (!IsConnected || string.IsNullOrEmpty(CurrentSessionId)) return;
            await _hubConnection.SendAsync("SyncEnvironment", CurrentSessionId, jsonEnv);
        }

        private async void OnDestroy()
        {
            if (_hubConnection != null)
            {
                await _hubConnection.DisposeAsync();
            }
        }
    }
}
