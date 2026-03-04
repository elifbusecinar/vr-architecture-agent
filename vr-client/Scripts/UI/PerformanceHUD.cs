using UnityEngine;
using TMPro;

namespace VRArchitecture.UI
{
    /// <summary>
    /// Displays FPS, Draw Calls, and Poly Count in-VR for dev monitoring.
    /// Point 4: Performance Monitor HUD.
    /// </summary>
    public class PerformanceHUD : MonoBehaviour
    {
        [Header("Display")]
        [SerializeField] private TMP_Text _displayText;
        [SerializeField] private float _updateInterval = 0.5f;

        private float _fps;
        private int _drawCalls;
        private int _triangles;
        private float _timer;

        private void Update()
        {
            _timer += Time.deltaTime;
            _fps = 1.0f / Time.smoothDeltaTime;

            if (_timer >= _updateInterval)
            {
                UpdateStats();
                _timer = 0;
            }
        }

        private void UpdateStats()
        {
            // Simple logic for draw-calls and polycount if Unity's ProfilerRecorder isn't available
            // In a better version, we would use: 
            // ProfilerRecorder.StartNew(ProfilerCategory.Render, "Triangles Count");
            
            _triangles = UnityEditor.UnityStats.triangles;
            _drawCalls = UnityEditor.UnityStats.drawCalls;

            _displayText.text = $"<b>PERF MONITOR</b>\n" +
                                $"FPS: <color={(_fps < 45 ? "red" : "green")}>{_fps:F0}</color>\n" +
                                $"DrawCalls: {_drawCalls}\n" +
                                $"Polys: {_triangles/1000:F1}k\n" +
                                $"<size=80%>Comfort: {(_fps > 72 ? "Ideal" : "Low")}</size>";
        }
    }
}
