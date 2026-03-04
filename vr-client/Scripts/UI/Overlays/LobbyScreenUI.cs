using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UIElements;
using VRArchitecture.Session;
using VRArchitecture.Models;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Session Lobby / Start screen — shown in the VR space before the model loads.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class LobbyScreenUI : MonoBehaviour
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("UI Document")]
        [SerializeField] private UIDocument _doc;
        [SerializeField] private VisualTreeAsset _participantRowTemplate;

        [Header("Join Config")]
        [SerializeField] private float _stepDuration = 0.9f;

        // ─── State ───────────────────────────────────────────────────
        private VisualElement _root;
        private VisualElement _participantList;
        private VisualElement _loadingOverlay;
        private VisualElement _loadingStepContainer;
        private Button        _btnJoin;
        private Button        _btnDecline;
        private Label         _sessionTitle;
        private Label         _sessionMeta;
        private Label         _modelName;
        private Label         _modelVersion;

        private SessionData   _pendingSession;
        private bool          _isConnecting;

        // ─── Load step labels ─────────────────────────────────────────
        private static readonly string[] LoadSteps =
        {
            "Authenticating…",
            "Joining Fusion room…",
            "Streaming model…",
            "Calibrating XR rig…",
        };

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Awake()
        {
            if (_doc == null) _doc = GetComponent<UIDocument>();
        }

        private void OnEnable()
        {
            _root = _doc.rootVisualElement;
            BindElements();
            BindButtons();
            HideImmediately();                          // hidden until ShowForSession() is called

            // Listen for incoming session invitations
            if (SessionManager.Instance != null)
                SessionManager.Instance.OnStateChanged.AddListener(HandleSessionState);
        }

        private void OnDisable()
        {
            if (SessionManager.Instance != null)
                SessionManager.Instance.OnStateChanged.RemoveListener(HandleSessionState);
        }

        // ─── Public API ──────────────────────────────────────────────

        public void ShowForSession(SessionData session)
        {
            _pendingSession = session ?? throw new ArgumentNullException(nameof(session));

            PopulateSessionInfo(session);
            PopulateParticipants(session.Participants);
            PopulateModelInfo(session.ModelInfo);

            _root.style.display = DisplayStyle.Flex;
            _root.AddToClassList("panel--visible");     // triggers CSS transition in USS
        }

        public void Hide()
        {
            _root.RemoveFromClassList("panel--visible");
            // After transition, set display:none so it doesn't intercept raycasts
            _root.schedule.Execute(() => _root.style.display = DisplayStyle.None)
                 .StartingIn(400);                       // match USS transition duration
        }

        // ─── Private helpers ─────────────────────────────────────────

        private void BindElements()
        {
            _sessionTitle        = _root.Q<Label>("session-title");
            _sessionMeta         = _root.Q<Label>("session-meta");
            _participantList     = _root.Q<VisualElement>("participant-list");
            _modelName           = _root.Q<Label>("model-name");
            _modelVersion        = _root.Q<Label>("model-version");
            _loadingOverlay      = _root.Q<VisualElement>("loading-overlay");
            _loadingStepContainer= _root.Q<VisualElement>("loading-step-container");
            _btnJoin             = _root.Q<Button>("btn-join");
            _btnDecline          = _root.Q<Button>("btn-decline");
        }

        private void BindButtons()
        {
            _btnJoin?.RegisterCallback<ClickEvent>(_ => OnJoinPressed());
            _btnDecline?.RegisterCallback<ClickEvent>(_ => OnDeclinePressed());
        }

        private void HideImmediately()
        {
            _root.style.display = DisplayStyle.None;
            _loadingOverlay.style.display = DisplayStyle.None;
        }

        private void PopulateSessionInfo(SessionData s)
        {
            if (_sessionTitle != null)
                _sessionTitle.text = s.Title;

            if (_sessionMeta != null)
                _sessionMeta.text = $"Session #{s.SessionNumber} · {s.ScheduledAt:MMM d, yyyy · HH:mm}";
        }

        private void PopulateParticipants(List<ParticipantData> participants)
        {
            if (_participantList == null || _participantRowTemplate == null) return;
            _participantList.Clear();

            foreach (var p in participants)
            {
                var row = _participantRowTemplate.Instantiate();

                var avatar = row.Q<VisualElement>("participant-avatar");
                var name   = row.Q<Label>("participant-name");
                var role   = row.Q<Label>("participant-role");
                var status = row.Q<VisualElement>("participant-status");

                if (name   != null) name.text  = p.DisplayName;
                if (role   != null) role.text  = p.Role.ToString();
                if (avatar != null)
                {
                    avatar.AddToClassList($"avatar--{p.Role.ToString().ToLower()}");
                    var initialsLabel = avatar.Q<Label>();
                    if (initialsLabel != null) initialsLabel.text = GetInitials(p.DisplayName);
                }
                if (status != null)
                    status.AddToClassList(p.IsOnline ? "status--online" : "status--offline");

                _participantList.Add(row);
            }
        }

        private void PopulateModelInfo(ModelInfo model)
        {
            if (model == null) return;
            if (_modelName    != null) _modelName.text    = model.FileName;
            if (_modelVersion != null) _modelVersion.text = model.Version;
        }

        private string GetInitials(string displayName)
        {
            if (string.IsNullOrEmpty(displayName)) return "??";
            var parts = displayName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return parts.Length >= 2
                ? $"{parts[0][0]}{parts[1][0]}"
                : displayName.Length >= 2 ? displayName.Substring(0, 2).ToUpper() : displayName.ToUpper();
        }

        private void OnJoinPressed()
        {
            if (_isConnecting || _pendingSession == null) return;
            _ = RunJoinSequenceAsync();
        }

        private void OnDeclinePressed()
        {
            _pendingSession = null;
            Hide();
        }

        private async Task RunJoinSequenceAsync()
        {
            _isConnecting = true;
            _btnJoin.SetEnabled(false);
            _btnJoin.AddToClassList("btn--loading");

            // Show loading overlay
            _loadingOverlay.style.display = DisplayStyle.Flex;
            _loadingStepContainer.Clear();

            var stepLabels = new List<Label>();
            foreach (var step in LoadSteps)
            {
                var lbl = new Label(step);
                lbl.AddToClassList("loading-step");
                _loadingStepContainer.Add(lbl);
                stepLabels.Add(lbl);
            }

            // Animate through steps
            for (int i = 0; i < stepLabels.Count; i++)
            {
                if (i > 0) stepLabels[i - 1].RemoveFromClassList("loading-step--active");
                if (i > 0) stepLabels[i - 1].AddToClassList("loading-step--done");

                stepLabels[i].AddToClassList("loading-step--active");
                await Task.Delay(TimeSpan.FromSeconds(_stepDuration));
            }
            stepLabels[stepLabels.Count - 1].RemoveFromClassList("loading-step--active");
            stepLabels[stepLabels.Count - 1].AddToClassList("loading-step--done");

            // Kick off actual join
            if (SessionManager.Instance != null)
                await SessionManager.Instance.JoinSessionAsync(_pendingSession.JoinToken);
            else
                Debug.LogWarning("[LobbyScreenUI] SessionManager not found — skipping join.");

            _isConnecting = false;
        }

        private void HandleSessionState(SessionState state)
        {
            switch (state)
            {
                case SessionState.Active:
                    _loadingOverlay.style.display = DisplayStyle.None;
                    Hide();
                    break;

                case SessionState.Idle:
                    _btnJoin.SetEnabled(true);
                    _btnJoin.RemoveFromClassList("btn--loading");
                    _loadingOverlay.style.display = DisplayStyle.None;
                    _isConnecting = false;
                    break;
            }
        }
    }
}
