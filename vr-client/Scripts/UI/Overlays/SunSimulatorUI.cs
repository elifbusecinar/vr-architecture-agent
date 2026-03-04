using System;
using UnityEngine;
using UnityEngine.UIElements;
using VRArchitecture.Environment;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Connects the Sun Simulator UI (Sliders/Buttons) to the SunPositionSystem.
    /// Handles drag/click interactions and real-time UI updates.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class SunSimulatorUI : MonoBehaviour
    {
        [SerializeField] private SunPositionSystem sunSystem;
        
        private VisualElement _root;
        
        // UI Elements
        private Label _timeVal;
        private Label _sunDateLabel;
        private VisualElement _datePickerTrigger;
        private Label _dateValLabel;
        
        private Label _azimuthLabel;
        private Label _elevationLabel;
        private Label _sunriseLabel;
        private Label _sunsetLabel;
        private Label _locationLabel;

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
        }

        private void BindElements()
        {
            // Main Display
            _timeVal = _root.Q<Label>(null, "sun-time-text");
            _sunDateLabel = _root.Q<Label>(null, "sun-date-text");
            _azimuthLabel = _root.Q<Label>(null, "sun-pill"); 
            _elevationLabel = _root.Query<Label>(null, "sun-pill").AtIndex(1);
            
            // Date Selection
            _datePickerTrigger = _root.Q<VisualElement>("date-picker-trigger");
            _dateValLabel = _root.Q<Label>("date-val-label");

            if (_datePickerTrigger != null)
            {
                _datePickerTrigger.RegisterCallback<ClickEvent>(evt => HandleCalendarOpen());
            }

            // Data Rows
            _sunriseLabel = _root.Query<Label>(null, "sun-data-val").AtIndex(0);
            _sunsetLabel = _root.Query<Label>(null, "sun-data-val").AtIndex(2);
            _locationLabel = _root.Query<Label>(null, "sun-data-val").AtIndex(4);

            // Presets
            var btns = _root.Query<Button>(null, "sun-pre-chip").ToList();
            foreach (var btn in btns)
            {
                btn.clicked += () => HandlePreset(btn.text);
            }
        }

        private void Update()
        {
            if (sunSystem == null) return;

            // Sync UI
            UpdateDisplay();
            UpdateDataDisplay();
        }

        private void HandleCalendarOpen()
        {
            Debug.Log("[SunSimulator] Opening VR Calendar Overlay...");
            // In a real scenario, this would trigger a custom VR DatePicker popup.
        }

        private void UpdateDisplay()
        {
            _timeVal.text = $"{Mathf.FloorToInt(sunSystem.hourOfDay):D2}:{Mathf.FloorToInt((sunSystem.hourOfDay % 1) * 60):D2}";

            DateTime dt = new DateTime(2026, 1, 1).AddDays(sunSystem.dayOfYear - 1);
            string dateStr = dt.ToString("MMM dd").ToUpper();
            
            if (_dateValLabel != null) _dateValLabel.text = dateStr;
            if (_sunDateLabel != null) _sunDateLabel.text = dt.ToString("MMMM dd, yyyy").ToUpper();
        }

        private void UpdateDataDisplay()
        {
            _elevationLabel.text = $"ELEVATION {sunSystem.elevation:F1}°";
            _azimuthLabel.text = $"AZIMUTH {sunSystem.azimuth:F1}°";
            _sunriseLabel.text = sunSystem.sunriseTime;
            _sunsetLabel.text = sunSystem.sunsetTime;
            if (_locationLabel != null) _locationLabel.text = sunSystem.locationName;
        }

        private void HandlePreset(string label)
        {
            float hour = sunSystem.hourOfDay;
            if (label.Contains("Dawn")) hour = 6.0f;
            else if (label.Contains("Morning")) hour = 9.0f;
            else if (label.Contains("Noon")) hour = 12.0f;
            else if (label.Contains("Afternoon")) hour = 15.5f;
            else if (label.Contains("Sunset")) hour = 18.5f;
            else if (label.Contains("Night")) hour = 22.0f;

            sunSystem.UpdateSunParameters(sunSystem.latitude, sunSystem.dayOfYear, hour, sunSystem.locationName);
        }
    }
}
