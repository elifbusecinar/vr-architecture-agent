using System;
using UnityEngine;
using UnityEngine.UIElements;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Loading Screen UI — handles visualization of model streaming progress.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class LoadingScreenUI : MonoBehaviour
    {
        private UIDocument _doc;
        
        private Label _modelName;
        private Label _modelSize;
        private Label _progressText;
        private Label _stepDetail;
        private VisualElement _progressBarFill;
        
        // Steps
        private VisualElement _stepAuth;
        private VisualElement _stepCdn;
        private VisualElement _stepStream;
        private VisualElement _stepParse;
        private VisualElement _stepReady;

        private void Awake()
        {
            _doc = GetComponent<UIDocument>();
            BindElements();
            Hide();
        }

        private void BindElements()
        {
            var root = _doc.rootVisualElement;
            _modelName = root.Q<Label>("model-name");
            _modelSize = root.Q<Label>("model-size");
            _progressText = root.Q<Label>("loading-pct");
            _stepDetail = root.Q<Label>("loading-detail");
            _progressBarFill = root.Q<VisualElement>("loading-bar-fill");
            
            _stepAuth = root.Q<VisualElement>("lstep-auth");
            _stepCdn = root.Q<VisualElement>("lstep-cdn");
            _stepStream = root.Q<VisualElement>("lstep-stream");
            _stepParse = root.Q<VisualElement>("lstep-parse");
            _stepReady = root.Q<VisualElement>("lstep-ready");
        }

        public void Show(string fileName)
        {
            _doc.rootVisualElement.style.display = DisplayStyle.Flex;
            if (_modelName != null) _modelName.text = fileName;
            SetProgress(0, "Starting...");
        }

        public void Hide()
        {
            _doc.rootVisualElement.style.display = DisplayStyle.None;
        }

        public void SetProgress(float progress, string detail = "")
        {
            if (_progressBarFill != null) _progressBarFill.style.width = Length.Percent(progress * 100f);
            if (_progressText != null) _progressText.text = $"{(int)(progress * 100f)}%";
            if (_stepDetail != null) _stepDetail.text = detail;
        }

        public void SetStep(string stepKey)
        {
            // Reset styles
            ResetStep(_stepAuth);
            ResetStep(_stepCdn);
            ResetStep(_stepStream);
            ResetStep(_stepParse);
            ResetStep(_stepReady);

            switch (stepKey.ToLower())
            {
                case "authenticating": MarkDoing(_stepAuth); break;
                case "cdn": MarkDone(_stepAuth); MarkDoing(_stepCdn); break;
                case "streaming": MarkDone(_stepAuth); MarkDone(_stepCdn); MarkDoing(_stepStream); break;
                case "parsing": MarkDone(_stepAuth); MarkDone(_stepCdn); MarkDone(_stepStream); MarkDoing(_stepParse); break;
                case "ready": MarkDone(_stepAuth); MarkDone(_stepCdn); MarkDone(_stepStream); MarkDone(_stepParse); MarkDoing(_stepReady); break;
            }
        }

        public void ShowError(string message)
        {
            if (_stepDetail != null)
            {
                _stepDetail.text = message;
                _stepDetail.style.color = new Color(0.88f, 0.35f, 0.35f); // vr-red
            }
        }

        private void MarkDone(VisualElement el) { if (el != null) { el.RemoveFromClassList("lstep-doing"); el.AddToClassList("lstep-done"); } }
        private void MarkDoing(VisualElement el) { if (el != null) el.AddToClassList("lstep-doing"); }
        private void ResetStep(VisualElement el) { if (el != null) { el.RemoveFromClassList("lstep-done"); el.RemoveFromClassList("lstep-doing"); } }
    }
}
