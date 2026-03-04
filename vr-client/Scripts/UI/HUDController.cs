using System;
using System.Collections.Generic;
using Fusion;
using TMPro;
using UnityEngine;
using UnityEngine.UIElements;
using VRArchitecture.Session;

namespace VRArchitecture.UI
{
    /// <summary>
    /// Manages persistent VR HUD elements using UI Toolkit.
    /// Handles top status bar, participant list, action bar, and timer.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class HUDController : MonoBehaviour
    {
        private UIDocument _doc;
        
        // HUD Elements
        private Label _projectName;
        private Label _timerText;
        private Label _statusLabel;
        private VisualElement _participantContainer;
        private VisualElement _actionBar;
        
        // Buttons
        private Button _micBtn;
        private Button _camBtn;
        private Button _noteBtn;
        private Button _leaveBtn;

        [Header("Templates")]
        [SerializeField] private VisualTreeAsset _participantCardTemplate;

        private void Awake()
        {
            _doc = GetComponent<UIDocument>();
            BindElements();
        }

        private void Start()
        {
            if (SessionManager.Instance != null)
            {
                SessionManager.Instance.OnStateChanged.AddListener(OnSessionStateChanged);
                SessionManager.Instance.OnSessionDuration.AddListener(UpdateTimer);
                SessionManager.Instance.OnParticipantJoined.AddListener(AddParticipant);
                SessionManager.Instance.OnParticipantLeft.AddListener(RemoveParticipant);
                
                SetProjectName(SessionManager.Instance.ActiveSession?.ProjectName ?? "Untitled Project");
            }
        }

        private void BindElements()
        {
            var root = _doc.rootVisualElement;
            _projectName = root.Q<Label>("htb-project");
            _timerText = root.Q<Label>("ht-elapsed");
            _statusLabel = root.Q<Label>("htb-status-text");
            _participantContainer = root.Q<VisualElement>("hud-participants");
            _actionBar = root.Q<VisualElement>("hud-actionbar");
            
            _micBtn = root.Q<Button>("btn-mic");
            _noteBtn = root.Q<Button>("btn-note");
            _leaveBtn = root.Q<Button>("btn-leave");

            if (_micBtn != null) _micBtn.clicked += ToggleMic;
            if (_noteBtn != null) _noteBtn.clicked += () => Debug.Log("Note triggered");
            if (_leaveBtn != null) _leaveBtn.clicked += () => _ = SessionManager.Instance.LeaveSessionAsync();
        }

        public void SetProjectName(string name)
        {
            if (_projectName != null) _projectName.text = name;
        }

        public void UpdateTimer(float elapsedSeconds)
        {
            var ts = TimeSpan.FromSeconds(elapsedSeconds);
            if (_timerText != null)
                _timerText.text = ts.Hours > 0 ? $"{ts.Hours:D2}:{ts.Minutes:D2}:{ts.Seconds:D2}" : $"{ts.Minutes:D2}:{ts.Seconds:D2}";
        }

        public void AddParticipant(ParticipantData data)
        {
            if (_participantCardTemplate == null || _participantContainer == null) return;
            
            var card = _participantCardTemplate.Instantiate();
            card.name = $"part-{data.PlayerId}";
            card.Q<Label>("part-name").text = data.DisplayName;
            card.Q<Label>("part-role").text = data.Role.ToString();
            
            var av = card.Q<VisualElement>("part-av");
            if (av != null) av.style.backgroundColor = data.AuthorColor;
            
            _participantContainer.Add(card);
        }

        public void RemoveParticipant(ParticipantData data)
        {
            if (_participantContainer == null) return;
            var card = _participantContainer.Q<VisualElement>($"part-{data.PlayerId}");
            if (card != null) _participantContainer.Remove(card);
        }

        private void ToggleMic()
        {
            if (_micBtn != null)
            {
                bool isMuted = _micBtn.ClassListContains("active");
                if (isMuted) _micBtn.RemoveFromClassList("active");
                else _micBtn.AddToClassList("active");
                
                SessionManager.Instance.SetLocalMicMuted(!isMuted);
            }
        }

        private void OnSessionStateChanged(SessionState state)
        {
            if (_statusLabel != null) _statusLabel.text = state.ToString();
        }

        private void OnDestroy()
        {
            if (SessionManager.Instance != null)
            {
                SessionManager.Instance.OnStateChanged.RemoveListener(OnSessionStateChanged);
                SessionManager.Instance.OnSessionDuration.RemoveListener(UpdateTimer);
                SessionManager.Instance.OnParticipantJoined.RemoveListener(AddParticipant);
                SessionManager.Instance.OnParticipantLeft.RemoveListener(RemoveParticipant);
            }
        }
    }
}
