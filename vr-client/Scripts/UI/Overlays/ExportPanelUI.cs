using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using UnityEngine.Networking;
using System.Threading.Tasks;
using VRArchitecture.Services.Common;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Implementation of the Export & Reporting Panel (Screen 12).
    /// Handles triggered exports and report downloading from the backend.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class ExportPanelUI : MonoBehaviour
    {
        private VisualElement _root;
        private Button _exportBtn;
        private Button _cancelBtn;
        private List<VisualElement> _formatOptions;
        
        private string _selectedFormat = "Pdf";
        private string _apiUrl = "http://localhost:5031"; // Sync with global config if possible

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
        }

        private void BindElements()
        {
            _exportBtn = _root.Q<Button>(null, "exp-btn-primary");
            _cancelBtn = _root.Q<Button>(null, "exp-btn-secondary");

            if (_exportBtn != null) _exportBtn.clicked += async () => await HandleExport();
            if (_cancelBtn != null) _cancelBtn.clicked += () => gameObject.SetActive(false);

            // Format Selection
            _formatOptions = _root.Query<VisualElement>(null, "exp-option").ToList();
            foreach (var opt in _formatOptions)
            {
                opt.RegisterCallback<ClickEvent>(evt => SelectFormat(opt));
            }

            // Sync with tabs (PNG, WebP etc - for simplicity we map to PDF/CSV)
            var tabs = _root.Query<Button>(null, "exp-tab").ToList();
            foreach (var tab in tabs)
            {
                tab.clicked += () => Debug.Log($"[Export] Detail setting: {tab.text}");
            }
        }

        private void SelectFormat(VisualElement opt)
        {
            foreach (var o in _formatOptions) o.RemoveFromClassList("selected");
            opt.AddToClassList("selected");

            var name = opt.Q<Label>(null, "exp-option-name")?.text;
            if (name != null && name.Contains("Capture")) _selectedFormat = "Pdf";
            else _selectedFormat = "Csv";
        }

        private async Task HandleExport()
        {
            _exportBtn.SetEnabled(false);
            _exportBtn.text = "SAVING TO CLOUD...";

            // Find project ID from session manager
            string projectId = "00000000-0000-0000-0000-000000000000"; // Placeholder
            if (Session.SessionManager.Instance?.ActiveSession != null)
                projectId = Session.SessionManager.Instance.ActiveSession.ProjectId.ToString();

            // Point to the Persistence endpoint
            string endpoint = $"{_apiUrl}/api/Report/{projectId}/save-export?format={_selectedFormat}";

            Debug.Log($"[Export] Triggering cloud report generation: {endpoint}");

            using (UnityWebRequest www = UnityWebRequest.PostWwwForm(endpoint, ""))
            {
                // Attach JWT
                string token = PlayerPrefs.GetString("jwt_token", "");
                if (!string.IsNullOrEmpty(token)) www.SetRequestHeader("Authorization", $"Bearer {token}");

                var operation = www.SendWebRequest();
                while (!operation.isDone) await Task.Yield();

                if (www.result == UnityWebRequest.Result.Success)
                {
                    Debug.Log($"[Export] Report saved to project history! Result: {www.downloadHandler.text}");
                    _exportBtn.text = "SUCCESS!";
                    await Task.Delay(2000);
                }
                else
                {
                    Debug.LogError($"[Export] Failed: {www.error}");
                    _exportBtn.text = "FAILED";
                    await Task.Delay(2000);
                }
            }

            _exportBtn.text = "EXPORT & UPLOAD";
            _exportBtn.SetEnabled(true);
        }
    }
}
