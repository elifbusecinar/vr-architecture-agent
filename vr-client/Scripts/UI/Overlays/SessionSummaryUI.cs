using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UIElements;
using VRArchitecture.Session;
using VRArchitecture.Annotation;
using VRArchitecture.Models;

namespace VRArchitecture.UI.Overlays
{
    [RequireComponent(typeof(UIDocument))]
    public class SessionSummaryUI : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private UIDocument _doc;
        [SerializeField] private AnnotationController _annotationController;

        [Header("Row Templates")]
        [SerializeField] private VisualTreeAsset _participantRowTemplate;
        [SerializeField] private VisualTreeAsset _annotationRowTemplate;
        [SerializeField] private VisualTreeAsset _approvalRowTemplate;

        [Header("Config")]
        [SerializeField] private string _dashboardBaseUrl = "https://app.vrarchitecture.io";

        private Label _sessionNumber;
        private Label _sessionTitle;
        private Label _sessionProject;
        private Label _statDuration;
        private Label _statParticipants;
        private Label _statAnnotations;
        private Label _statApprovals;
        private VisualElement _participantsContainer;
        private VisualElement _annotationsContainer;
        private VisualElement _approvalsContainer;
        private Button _btnDashboard;
        private Button _btnDownload;

        private SessionData _summaryData;

        private void Awake()
        {
            if (_doc == null) _doc = GetComponent<UIDocument>();
        }

        private void OnEnable()
        {
            BindElements();
            BindButtons();
            _doc.rootVisualElement.style.display = DisplayStyle.None;

            if (SessionManager.Instance != null)
                SessionManager.Instance.OnStateChanged.AddListener(HandleSessionState);
        }

        private void OnDisable()
        {
            if (SessionManager.Instance != null)
                SessionManager.Instance.OnStateChanged.RemoveListener(HandleSessionState);
        }

        private void HandleSessionState(SessionState state)
        {
            if (state == SessionState.Ended)
                _ = BuildAndShowAsync();
        }

        private async Task BuildAndShowAsync()
        {
            var mgr = SessionManager.Instance;
            if (mgr?.ActiveSession == null) return;

            if (_annotationController != null)
                await _annotationController.FlushPendingAsync();

            _summaryData = mgr.ActiveSession;
            var annotations = _annotationController?.GetSessionAnnotations() ?? new List<AnnotationData>();

            PopulateStats(_summaryData, annotations.Count);
            PopulateParticipants(_summaryData.ParticipantSummaries);
            PopulateAnnotations(annotations);
            PopulateApprovals(_summaryData.ApprovalRequests);

            Show();
        }

        private void PopulateStats(SessionData d, int annotationCount)
        {
            if (_sessionNumber != null) _sessionNumber.text = $"Session #{d.SessionNumber}";
            if (_sessionTitle != null) _sessionTitle.text = d.Title;
            if (_sessionProject != null) _sessionProject.text = d.ProjectName;
            if (_statDuration != null) _statDuration.text = FormatDuration(d.Duration);
            if (_statParticipants != null) _statParticipants.text = d.ParticipantSummaries.Count.ToString();
            if (_statAnnotations != null) _statAnnotations.text = annotationCount.ToString();
            if (_statApprovals != null) _statApprovals.text = d.ApprovalRequests.Count.ToString();
        }

        private void PopulateParticipants(List<ParticipantSummary> participants)
        {
            if (_participantsContainer == null || _participantRowTemplate == null) return;
            _participantsContainer.Clear();

            foreach (var p in participants)
            {
                var row = _participantRowTemplate.Instantiate();
                var avatar = row.Q<VisualElement>("participant-avatar");
                var name = row.Q<Label>("participant-name");
                var duration = row.Q<Label>("participant-duration");

                if (avatar != null) avatar.AddToClassList($"avatar--{p.Role.ToString().ToLower()}");
                if (name != null) name.text = p.DisplayName;
                if (duration != null) duration.text = $"{p.Role} · {FormatDuration(p.TimeInSession)}";

                _participantsContainer.Add(row);
            }
        }

        private void PopulateAnnotations(List<AnnotationData> annotations)
        {
            if (_annotationsContainer == null || _annotationRowTemplate == null) return;
            _annotationsContainer.Clear();

            foreach (var a in annotations)
            {
                var row = _annotationRowTemplate.Instantiate();
                var pin = row.Q<VisualElement>("ann-pin");
                var text = row.Q<Label>("ann-text");
                var meta = row.Q<Label>("ann-meta");
                var priority = row.Q<Label>("ann-priority");

                if (text != null) text.text = a.Text;
                if (meta != null) meta.text = $"{a.Room} · {a.CreatedBy}";
                if (priority != null)
                {
                    priority.text = a.Priority.ToString().ToLower();
                    priority.AddToClassList($"priority--{a.Priority.ToString().ToLower()}");
                }
                if (pin != null) pin.AddToClassList($"ann-pin--{a.Priority.ToString().ToLower()}");

                _annotationsContainer.Add(row);
            }
        }

        private void PopulateApprovals(List<ApprovalSummary> approvals)
        {
            if (_approvalsContainer == null || _approvalRowTemplate == null) return;
            _approvalsContainer.Clear();

            foreach (var a in approvals)
            {
                var row = _approvalRowTemplate.Instantiate();
                var icon = row.Q<VisualElement>("approval-icon");
                var text = row.Q<Label>("approval-text");
                var status = row.Q<Label>("approval-status");

                if (text != null) text.text = a.Title;
                if (status != null)
                {
                    status.text = a.Decision.ToString();
                    status.AddToClassList($"status--{a.Decision.ToString().ToLower()}");
                }
                if (icon != null) icon.AddToClassList($"icon--{a.Decision.ToString().ToLower()}");

                _approvalsContainer.Add(row);
            }
        }

        private void Show()
        {
            _doc.rootVisualElement.style.display = DisplayStyle.Flex;
            _doc.rootVisualElement.AddToClassList("summary--visible");
        }

        private void BindElements()
        {
            var root = _doc.rootVisualElement;
            _sessionNumber = root.Q<Label>("session-number");
            _sessionTitle = root.Q<Label>("session-title");
            _sessionProject = root.Q<Label>("session-project");
            _statDuration = root.Q<Label>("stat-duration");
            _statParticipants = root.Q<Label>("stat-participants");
            _statAnnotations = root.Q<Label>("stat-annotations");
            _statApprovals = root.Q<Label>("stat-approvals");
            _participantsContainer = root.Q<VisualElement>("participants-container");
            _annotationsContainer = root.Q<VisualElement>("annotations-container");
            _approvalsContainer = root.Q<VisualElement>("approvals-container");
            _btnDashboard = root.Q<Button>("btn-dashboard");
            _btnDownload = root.Q<Button>("btn-download");
        }

        private void BindButtons()
        {
            _btnDashboard?.RegisterCallback<ClickEvent>(_ => OpenDashboard());
            _btnDownload?.RegisterCallback<ClickEvent>(_ => _ = DownloadReportAsync());
        }

        private void OpenDashboard()
        {
            if (_summaryData == null) return;
            Application.OpenURL($"{_dashboardBaseUrl}/sessions/{_summaryData.SessionId}");
        }

        private async Task DownloadReportAsync()
        {
            _btnDownload?.SetEnabled(false);
            await Task.Delay(1000);
            _btnDownload?.SetEnabled(true);
        }

        private static string FormatDuration(float seconds)
        {
            var ts = TimeSpan.FromSeconds(seconds);
            return ts.TotalHours >= 1 ? $"{(int)ts.TotalHours}h {ts.Minutes}m" : $"{ts.Minutes:D2}:{ts.Seconds:D2}";
        }
    }
}
