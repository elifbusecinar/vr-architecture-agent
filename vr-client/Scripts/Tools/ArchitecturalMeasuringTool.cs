using UnityEngine;
using TMPro;
using VRArchitecture.DTOs.VR;
using VRArchitecture.Services.Broadcasting;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Tools
{
    /// <summary>
    /// Measures distances between two points in 3D space.
    /// Used for T044 (Model Scale Verification).
    /// </summary>
    public class ArchitecturalMeasuringTool : MonoBehaviour
    {
        [Header("Visualization")]
        [SerializeField] private LineRenderer _lineRenderer;
        [SerializeField] private TMP_Text _distanceText;
        [SerializeField] private GameObject _markerPrefab;

        [Header("Settings")]
        [SerializeField] private LayerMask _hitMask;
        [SerializeField] private float _maxDistance = 50f;

        private Vector3? _startPoint = null;
        private GameObject _startMarker;
        private GameObject _endMarker;

        [Header("Sync Visuals")]
        [SerializeField] private GameObject _remoteMarkerPrefab;
        [SerializeField] private LineRenderer _remoteLineRenderer;
        [SerializeField] private TMP_Text _remoteDistanceText;
        private Vector3? _remoteStartPoint = null;

        private void Start()
        {
            VRSignalRService.Instance.OnMeasurementReceived += HandleRemoteMeasurement;
        }

        private void OnDestroy()
        {
            if (VRSignalRService.Instance != null)
                VRSignalRService.Instance.OnMeasurementReceived -= HandleRemoteMeasurement;
        }

        private void Update()
        {
            if (_startPoint.HasValue)
            {
                UpdateMeasurementVisuals();
            }
        }

        /// <summary>Places the next point of measurement.</summary>
        public void PerformClick(Vector3 hitPoint)
        {
            var data = new MeasurementDto
            {
                userId = "local", // Handled by SignalR Hub anyway
                startPoint = _startPoint.HasValue ? new Vector3Dto(_startPoint.Value) : new Vector3Dto(hitPoint),
                endPoint = new Vector3Dto(hitPoint),
                isFinalized = _startPoint.HasValue
            };

            SyncBroadcaster.Instance.BroadcastMeasurement(data);

            if (!_startPoint.HasValue)
            {
                _startPoint = hitPoint;
                if (_startMarker == null) _startMarker = Instantiate(_markerPrefab);
                _startMarker.transform.position = hitPoint;
                _startMarker.SetActive(true);
                
                _lineRenderer.enabled = true;
                _distanceText.gameObject.SetActive(true);
            }
            else
            {
                // Second click — complete measurement
                float finalDistance = Vector3.Distance(_startPoint.Value, hitPoint);
                Debug.Log($"[Measure] Finalized distance: {finalDistance:F2}m");
                
                // Keep markers visible for a bit or until next click
                if (_endMarker == null) _endMarker = Instantiate(_markerPrefab);
                _endMarker.transform.position = hitPoint;
                _endMarker.SetActive(true);
                
                _startPoint = null; // Reset for next measurement
            }
        }

        private void HandleRemoteMeasurement(MeasurementDto data)
        {
            Vector3 start = data.startPoint.ToVector3();
            Vector3 end = data.endPoint.ToVector3();

            if (!data.isFinalized)
            {
                // Active preview from another user
                _remoteStartPoint = start;
                _remoteLineRenderer.enabled = true;
                _remoteDistanceText.gameObject.SetActive(true);
                
                _remoteLineRenderer.SetPosition(0, start);
                _remoteLineRenderer.SetPosition(1, end);
                
                float dist = Vector3.Distance(start, end);
                _remoteDistanceText.text = $"Remote: {dist:F2} m";
                _remoteDistanceText.transform.position = (start + end) / 2 + Vector3.up * 0.1f;
                if(Camera.main) _remoteDistanceText.transform.LookAt(Camera.main.transform);
            }
            else
            {
                // Peer finalized the measurement
                _remoteLineRenderer.SetPosition(0, start);
                _remoteLineRenderer.SetPosition(1, end);
                _remoteStartPoint = null;
                // In a richer UI, we'd spawn a persistent label here
            }
        }

        private void UpdateMeasurementVisuals()
        {
            if (Camera.main == null) return;
            
            // Raycast current gaze/pointer for real-time preview
            Ray ray = new Ray(transform.position, transform.forward);
            if (Physics.Raycast(ray, out var hit, _maxDistance, _hitMask))
            {
                _lineRenderer.SetPosition(0, _startPoint.Value);
                _lineRenderer.SetPosition(1, hit.point);
                
                float currentDist = Vector3.Distance(_startPoint.Value, hit.point);
                _distanceText.text = $"{currentDist:F2} m";
                _distanceText.transform.position = (_startPoint.Value + hit.point) / 2 + Vector3.up * 0.05f;
                _distanceText.transform.LookAt(Camera.main.transform);
            }
        }

        public void Clear()
        {
            _startPoint = null;
            if (_startMarker) _startMarker.SetActive(false);
            if (_endMarker) _endMarker.SetActive(false);
            _lineRenderer.enabled = false;
            _distanceText.gameObject.SetActive(false);
        }
    }
}
