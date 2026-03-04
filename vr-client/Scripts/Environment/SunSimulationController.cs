using UnityEngine;

namespace VRArchitecture.Environment
{
    /// <summary>
    /// Controls the sun's position and intensity to simulate different times of day.
    /// Used for architectural light studies in VR.
    /// </summary>
    public class SunSimulationController : MonoBehaviour
    {
        [Header("References")]
        [SerializeField] private Light _sunLight;
        [SerializeField] private Gradient _skyColor;
        [SerializeField] private Gradient _sunIntensity;

        [Range(0, 24)]
        [SerializeField] private float _timeOfDay = 12.0f; // 12 PM default

        private void Update()
        {
            UpdateSunPosition();
        }

        public void SetTimeOfDay(float time)
        {
            _timeOfDay = Mathf.Clamp(time, 0, 24);
            UpdateSunPosition();
        }

        private void UpdateSunPosition()
        {
            if (_sunLight == null) return;

            // Simple rotation logic: 0 = midnight, 12 = high noon, 24 = midnight
            float rotationX = (_timeOfDay / 24.0f) * 360.0f - 90.0f;
            _sunLight.transform.rotation = Quaternion.Euler(rotationX, -30f, 0);

            // Intensity and color adjustments
            float t = _timeOfDay / 24.0f;
            _sunLight.intensity = _sunIntensity.Evaluate(t).a;
            _sunLight.color = _skyColor.Evaluate(t);

            // Toggle shadows if too low
            _sunLight.shadows = (_timeOfDay > 6 && _timeOfDay < 18) ? LightShadows.Soft : LightShadows.None;
        }
    }
}
