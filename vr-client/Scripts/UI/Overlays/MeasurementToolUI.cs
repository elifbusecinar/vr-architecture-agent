using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Controls the Measurement Tool UI (Screen 10).
    /// Handles unit selection and clear actions.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    public class MeasurementToolUI : MonoBehaviour
    {
        private VisualElement _root;
        private Label _distanceLabel;
        private Label _unitLabel;
        private Button _clearBtn;
        private Button _saveBtn;
        
        private string _activeUnit = "m";

        private void OnEnable()
        {
            _root = GetComponent<UIDocument>().rootVisualElement;
            BindElements();
            UpdateDisplay(0f);
        }

        private void BindElements()
        {
            _distanceLabel = _root.Q<Label>("mt-distance-val");
            _unitLabel = _root.Q<Label>("mt-unit-label");
            _clearBtn = _root.Q<Button>("mt-clear-btn");
            _saveBtn = _root.Q<Button>("mt-save-btn");

            if (_clearBtn != null) _clearBtn.clicked += HandleClear;
            if (_saveBtn != null) _saveBtn.clicked += HandleSave;

            // Unit Tabs
            var unitTabs = _root.Query<Button>(null, "mt-unit-tab").ToList();
            foreach (var tab in unitTabs)
            {
                tab.clicked += () => SetUnit(tab.text);
            }
        }

        private void SetUnit(string unit)
        {
            _activeUnit = unit;
            
            // UI Active State
            var tabs = _root.Query<Button>(null, "mt-unit-tab").ToList();
            foreach (var tab in tabs)
            {
                if (tab.text.Equals(unit, System.StringComparison.OrdinalIgnoreCase))
                    tab.AddToClassList("active");
                else
                    tab.RemoveFromClassList("active");
            }

            if (_unitLabel != null) _unitLabel.text = unit;
            
            // Notify Manager
            XRMeasurementManager.Instance?.SetUnit(unit);
        }

        public void UpdateDisplay(float distance)
        {
            if (_distanceLabel != null)
            {
                // Format distance based on unit
                float displayVal = distance;
                if (_activeUnit == "cm") displayVal *= 100f;
                else if (_activeUnit == "mm") displayVal *= 1000f;

                _distanceLabel.text = displayVal.ToString("F2");
            }
        }

        private void HandleClear()
        {
            XRMeasurementManager.Instance?.ClearMeasurement();
            UpdateDisplay(0f);
        }

        private void HandleSave()
        {
            XRMeasurementManager.Instance?.SaveCurrentMeasurement();
        }
    }
}
