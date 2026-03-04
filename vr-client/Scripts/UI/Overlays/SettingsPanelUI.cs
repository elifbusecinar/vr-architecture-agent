using System;
using UnityEngine;
using UnityEngine.UIElements;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Settings Panel UI — handles comfort, audio, and display settings.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class SettingsPanelUI : MonoBehaviour
    {
        private UIDocument _doc;
        
        // Tabs
        private VisualElement _tabComfort;
        private VisualElement _tabAudio;
        private VisualElement _tabDisplay;
        private VisualElement _bodyContainer;

        // Settings Elements
        private Slider _vignetteSlider;
        private Toggle _vignetteToggle;
        private RadioButtonGroup _locomotionMode;
        private RadioButtonGroup _turnMode;

        private void Awake()
        {
            _doc = GetComponent<UIDocument>();
            BindElements();
            Hide();
        }

        private void BindElements()
        {
            var root = _doc.rootVisualElement;
            
            // Tab Buttons
            root.Q<Button>("spt-comfort").clicked += () => SwitchTab("comfort");
            root.Q<Button>("spt-audio").clicked += () => SwitchTab("audio");
            root.Q<Button>("spt-display").clicked += () => SwitchTab("display");
            
            // Comfort Controls
            _vignetteSlider = root.Q<Slider>("vignette-intensity");
            _vignetteToggle = root.Q<Toggle>("vignette-enabled");
            _locomotionMode = root.Q<RadioButtonGroup>("locomotion-mode");
            _turnMode = root.Q<RadioButtonGroup>("turn-mode");
            
            // Close Button
            root.Q<Button>("sp-close").clicked += Hide;

            // Load saved settings
            LoadSettings();
            
            // Listen for changes
            if (_vignetteSlider != null) _vignetteSlider.RegisterValueChangedCallback(evt => SaveSettings());
            if (_vignetteToggle != null) _vignetteToggle.RegisterValueChangedCallback(evt => SaveSettings());
            if (_locomotionMode != null) _locomotionMode.RegisterValueChangedCallback(evt => SaveSettings());
        }

        public void Show()
        {
            _doc.rootVisualElement.style.display = DisplayStyle.Flex;
        }

        public void Hide()
        {
            _doc.rootVisualElement.style.display = DisplayStyle.None;
        }

        private void SwitchTab(string tabKey)
        {
            Debug.Log($"[Settings] Switching to tab: {tabKey}");
            // Logic to swap body content
        }

        private void SaveSettings()
        {
            if (_vignetteSlider != null) PlayerPrefs.SetFloat("VRA_VignetteIntensity", _vignetteSlider.value);
            if (_vignetteToggle != null) PlayerPrefs.SetInt("VRA_VignetteEnabled", _vignetteToggle.value ? 1 : 0);
            if (_locomotionMode != null) PlayerPrefs.SetInt("VRA_LocomotionMode", _locomotionMode.value);
            PlayerPrefs.Save();
        }

        private void LoadSettings()
        {
            if (_vignetteSlider != null) _vignetteSlider.value = PlayerPrefs.GetFloat("VRA_VignetteIntensity", 0.6f);
            if (_vignetteToggle != null) _vignetteToggle.value = PlayerPrefs.GetInt("VRA_VignetteEnabled", 1) == 1;
            if (_locomotionMode != null) _locomotionMode.value = PlayerPrefs.GetInt("VRA_LocomotionMode", 0);
        }
    }
}
