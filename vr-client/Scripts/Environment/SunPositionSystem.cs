using System;
using UnityEngine;

namespace VRArchitecture.Environment
{
    /// <summary>
    /// Calculates Sun Position (Azimuth and Elevation) based on Latitude, Day of Year, and Time.
    /// Updates a Directional Light to match.
    /// </summary>
    public class SunPositionSystem : MonoBehaviour
    {
        public static SunPositionSystem Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        [Header("Settings")]
        public Light sunLight;
        
        [Header("Location & Time")]
        [Range(-90f, 90f)] public float latitude = 41.9f; // Rome Default
        public string locationName = "Rome, IT";
        [Range(1, 365)] public int dayOfYear = 60;        // March 1st
        [Range(0f, 23.99f)] public float hourOfDay = 12f;

        [Header("Output (Read Only)")]
        public float elevation;
        public float azimuth;
        public string sunriseTime;
        public string sunsetTime;

        private void Update()
        {
            UpdateSunPosition();
        }

        private void Start()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnEnvironmentSynced += HandleRemoteEnvironmentSync;
            }
        }

        public void UpdateSunParameters(float lat, int day, float hour, string location = "Current Project", bool fromNetwork = false)
        {
            latitude = lat;
            dayOfYear = day;
            hourOfDay = hour;
            locationName = location;
            UpdateSunPosition();

            if (!fromNetwork && VRSignalRService.Instance != null)
            {
                var data = new EnvironmentSyncData { lat = lat, day = day, hour = hour, loc = location };
                VRSignalRService.Instance.BroadcastEnvironment(JsonUtility.ToJson(data));
            }
        }

        private void HandleRemoteEnvironmentSync(string json)
        {
            var data = JsonUtility.FromJson<EnvironmentSyncData>(json);
            UpdateSunParameters(data.lat, data.day, data.hour, data.loc, true);
        }

        [Serializable]
        private class EnvironmentSyncData 
        { 
            public float lat; 
            public int day; 
            public float hour; 
            public string loc; 
        }

        private void UpdateSunPosition()
        {
            // 1. Calculate Declination (tilt of earth)
            // -23.44 * cos(360/365 * (N + 10))
            float declination = -23.44f * Mathf.Cos((360f / 365f) * (dayOfYear + 10) * Mathf.Deg2Rad);

            // 2. Calculate Hour Angle (H)
            // Solar noon is 0. Each hour is 15 degrees.
            float hourAngle = (hourOfDay - 12f) * 15f;

            // 3. Calculate Elevation (Alt)
            // sin(Alt) = sin(Lat)sin(Dec) + cos(Lat)cos(Dec)cos(H)
            float latRad = latitude * Mathf.Deg2Rad;
            float decRad = declination * Mathf.Deg2Rad;
            float hRad = hourAngle * Mathf.Deg2Rad;

            float sinAlt = Mathf.Sin(latRad) * Mathf.Sin(decRad) + Mathf.Cos(latRad) * Mathf.Cos(decRad) * Mathf.Cos(hRad);
            elevation = Mathf.Asin(sinAlt) * Mathf.Rad2Deg;

            // 4. Calculate Azimuth (Az)
            // cos(Az) = (sin(Dec) - sin(Lat)sin(Alt)) / (cos(Lat)cos(Alt))
            float cosAz = (Mathf.Sin(decRad) - Mathf.Sin(latRad) * sinAlt) / (Mathf.Cos(latRad) * Mathf.Cos(elevation * Mathf.Deg2Rad));
            cosAz = Mathf.Clamp(cosAz, -1f, 1f);
            azimuth = Mathf.Acos(cosAz) * Mathf.Rad2Deg;

            if (hourAngle > 0) azimuth = 360f - azimuth; // Morning vs Afternoon

            // 5. Update Light Rotation
            if (sunLight != null)
            {
                // Unity rotation: X = Elevation, Y = Azimuth
                // We offset X because 0 elevation is horizon, 90 is zenith.
                sunLight.transform.rotation = Quaternion.Euler(elevation, azimuth, 0);
                
                // Dim light if below horizon
                sunLight.intensity = elevation > 0 ? 1.0f : 0.05f;
            }

            // 6. Calculate Sunrise/Sunset approximate
            CalculateSunriseSunset(latRad, decRad);
        }

        private void CalculateSunriseSunset(float latRad, float decRad)
        {
            // Hour angle at sunrise: cos(H) = -tan(Lat)tan(Dec)
            float cosH = -Mathf.Tan(latRad) * Mathf.Tan(decRad);
            if (cosH < -1) { sunriseTime = "All Day"; sunsetTime = "All Day"; return; }
            if (cosH > 1) { sunriseTime = "No Sun"; sunsetTime = "No Sun"; return; }

            float h = Mathf.Acos(cosH) * Mathf.Rad2Deg;
            float sunriseHour = 12f - (h / 15f);
            float sunsetHour = 12f + (h / 15f);

            sunriseTime = FormatHour(sunriseHour);
            sunsetTime = FormatHour(sunsetHour);
        }

        private string FormatHour(float h)
        {
            int displayH = Mathf.FloorToInt(h);
            int displayM = Mathf.FloorToInt((h - displayH) * 60);
            return $"{displayH:D2}:{displayM:D2}";
        }
    }
}
