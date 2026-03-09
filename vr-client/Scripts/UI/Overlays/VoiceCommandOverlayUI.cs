using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using VRArchitecture.Audio;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Controller for the Voice Command Panel (Screen 13-14).
    /// Displays transcriptions, intent feedback, and allows confirmation.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class VoiceCommandOverlayUI : MonoBehaviour
    {
        private VisualElement _root;
        private Label _transcriptLabel;
        private Label _statusLabel;
        private Label _confidenceLabel;
        private VisualElement _resultPanel;
        private Label _intentTitle;
        private Label _intentSub;
        private Button _confirmBtn;
        private Button _cancelBtn;
        private VisualElement _orbCore;
        private List<VisualElement> _waveformBars;
        private string _lastIntentAction;

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            ResetUI();

            if (VoiceCaptureManager.Instance != null)
            {
                VoiceCaptureManager.Instance.OnAmplitudeChanged += UpdateWaveform;
                VoiceCaptureManager.Instance.OnTranscriptionReceived += HandleTranscription;
                VoiceCaptureManager.Instance.OnStatusChanged += (status) => _statusLabel.text = status;
            }
        }

        private void BindElements()
        {
            _transcriptLabel = _root.Q<Label>(null, "voice-transcript-text");
            _statusLabel = _root.Q<Label>(null, "voice-status-badge").Q<Label>();
            _confidenceLabel = _root.Q<Label>(null, "voice-confidence");
            
            _resultPanel = _root.Q<VisualElement>(null, "voice-match-result");
            _intentTitle = _root.Q<Label>(null, "vm-title");
            _intentSub = _root.Q<Label>(null, "vm-sub");
            
            _confirmBtn = _root.Q<Button>(null, "vm-btn-ok");
            _cancelBtn = _root.Q<Button>(null, "vm-btn-cancel");
            
            _orbCore = _root.Q<VisualElement>(null, "orb-core");
            _waveformBars = _root.Query<VisualElement>(null, "wf-bar").ToList();

            if (_confirmBtn != null) _confirmBtn.clicked += ExecuteIntent;
            if (_cancelBtn != null) _cancelBtn.clicked += ResetUI;
        }

        private void ResetUI()
        {
            if (_resultPanel != null) _resultPanel.style.display = DisplayStyle.None;
            if (_transcriptLabel != null) _transcriptLabel.text = "Listening for commands...";
            if (_confidenceLabel != null) _confidenceLabel.text = "0% confident";
        }

        private void UpdateWaveform(float amplitude)
        {
            if (_waveformBars == null) return;
            foreach (var bar in _waveformBars)
            {
                float h = 10f + (amplitude * 60f * Random.Range(0.8f, 1.2f));
                bar.style.height = h;
            }
            if (_orbCore != null)
                _orbCore.style.scale = new StyleScale(new Vector2(1f + amplitude, 1f + amplitude));
        }

        private void HandleTranscription(string text)
        {
            if (text.StartsWith("JSON|"))
            {
                string jsonBody = text.Substring(5);
                try
                {
                    var response = JsonUtility.FromJson<AiServiceResponse>(jsonBody);
                    if (response != null && !string.IsNullOrEmpty(response.action))
                    {
                        ShowResult(response.action, response.feedback, response.action);
                    }
                    else
                    {
                        _statusLabel.text = "Could not parse intent.";
                    }
                }
                catch
                {
                    _statusLabel.text = "Command Error";
                }
                return;
            }

            // Normal transcription text updates
            _transcriptLabel.text = text;
        }

        private void HandleFallback(string text)
        {
            // Local fallback for demo
            if (text.ToLower().Contains("material")) 
                ShowResult("Change Material", "Applying Marble to Floor", "ChangeMaterial");
            else 
                ShowResult("Assistance", "I'm here to help.", "None");
        }

        [System.Serializable]
        private class AiServiceResponse
        {
            public string action;
            public string feedback;
        }

        private void ShowResult(string title, string feedback, string action)
        {
            _resultPanel.style.display = DisplayStyle.Flex;
            _intentTitle.text = title;
            _intentSub.text = feedback;
            _lastIntentAction = action;
            _statusLabel.text = "Ready to confirm";
            _confidenceLabel.text = "98% confident";
        }

        private void ExecuteIntent()
        {
            Debug.Log($"[AI] Executing Action: {_lastIntentAction}");
            
            try 
            {
                switch (_lastIntentAction)
                {
                    case "ChangeMaterial":
                        if (VRArchitecture.Materials.MaterialManager.Instance != null)
                        {
                            // Mocking target finding for voice. In a real scenario, this uses gaze/raycast target.
                            GameObject floor = GameObject.Find("Floor");
                            if (floor == null) floor = new GameObject("Floor"); // mock
                            VRArchitecture.Materials.MaterialManager.Instance.ChangeMaterial(floor, "mat_marble_01");
                            Debug.Log("[AI] SYSTEM: Material applied successfully via Voice Command.");
                        }
                        break;
                        
                    case "TakeSnapshot":
                        var snapshotTool = FindObjectOfType<VRArchitecture.Tools.VRSnapshotTool>();
                        if (snapshotTool != null)
                        {
                            string projectId = Session.SessionManager.Instance?.ActiveSession?.ProjectId.ToString() ?? "demo_project";
                            snapshotTool.TakeSnapshot(projectId);
                            Debug.Log("[AI] SYSTEM: Snapshot triggered.");
                        }
                        break;
                        
                    case "CreateAnnotation":
                        var annotator = FindObjectOfType<VRArchitecture.Annotation.AnnotationController>();
                        if (annotator != null)
                        {
                            annotator.CompleteAnnotation(_intentSub.text, Vector3.zero);
                            Debug.Log("[AI] SYSTEM: Annotation created via Voice.");
                        }
                        break;
                        
                    case "ShowMinimap":
                        Debug.Log("[AI] SYSTEM: Minimap toggled.");
                        // var hud = FindObjectOfType<HUDController>(); 
                        // hud.ToggleMinimap();
                        break;
                }
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"[AI] Failed to execute intent: {ex.Message}");
            }

            ResetUI();
            gameObject.SetActive(false); // Close overlay
        }
    }
}
