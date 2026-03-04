using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;
using System.Collections.Generic;
using VRArchitecture.DTOs.VR;
using VRArchitecture.Services.Networking;
using VRArchitecture.UI.Overlays;

namespace VRArchitecture.UI.Overlays
{
    /// <summary>
    /// Handles XR Measurement logic: Raycasting, line drawing, and SignalR sync.
    /// </summary>
    public class XRMeasurementManager : MonoBehaviour
    {
        public static XRMeasurementManager Instance { get; private set; }

        [Header("References")]
        [SerializeField] private XRRayInteractor _interactor;
        [SerializeField] private LineRenderer _lineRendererPrefab;
        [SerializeField] private GameObject _markerPrefab;
        [SerializeField] private MeasurementToolUI _ui;

        private LineRenderer _currentLine;
        private GameObject _startMarker;
        private GameObject _endMarker;

        private Vector3 _startPoint;
        private Vector3 _endPoint;
        private bool _isMeasuring = false;
        private string _activeUnit = "m";

        private List<LineRenderer> _allMeasurements = new List<LineRenderer>();

        private void Awake()
        {
            Instance = this;
        }

        private void Start()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnMeasurementReceived += HandleRemoteMeasurement;
            }
        }

        public void SetUnit(string unit)
        {
            _activeUnit = unit;
        }

        // Called via XR Input (e.g., Trigger Pressed)
        public void OnSelectAction()
        {
            if (_interactor.TryGetHitInfo(out Vector3 hitPos, out Vector3 hitNormal, out int hitIndex, out bool validHit))
            {
                if (!_isMeasuring)
                {
                    StartMeasurement(hitPos);
                }
                else
                {
                    FinalizeMeasurement(hitPos);
                }
            }
        }

        private void Update()
        {
            if (_isMeasuring)
            {
                if (_interactor.TryGetHitInfo(out Vector3 hitPos, out Vector3 hitNormal, out int hitIndex, out bool validHit))
                {
                    UpdateMeasurement(hitPos);
                }
            }
        }

        private void StartMeasurement(Vector3 pos)
        {
            _startPoint = pos;
            _isMeasuring = true;

            _currentLine = Instantiate(_lineRendererPrefab, transform);
            _currentLine.positionCount = 2;
            _currentLine.SetPosition(0, _startPoint);
            _currentLine.SetPosition(1, _startPoint);

            _startMarker = Instantiate(_markerPrefab, _startPoint, Quaternion.identity, transform);
            _endMarker = Instantiate(_markerPrefab, _startPoint, Quaternion.identity, transform);
            
            _allMeasurements.Add(_currentLine);
        }

        private void UpdateMeasurement(Vector3 pos)
        {
            _endPoint = pos;
            _currentLine.SetPosition(1, _endPoint);
            _endMarker.transform.position = _endPoint;

            float dist = Vector3.Distance(_startPoint, _endPoint);
            _ui.UpdateDisplay(dist);

            // Real-time sync (optional during drag, but good for "live" feel)
            SyncToRemote(false);
        }

        private void FinalizeMeasurement(Vector3 pos)
        {
            _endPoint = pos;
            _isMeasuring = false;
            
            float dist = Vector3.Distance(_startPoint, _endPoint);
            if (Common.VRToastManager.Instance != null)
                Common.VRToastManager.Instance.ShowSuccess($"Measured: {dist:F2} {_activeUnit}");
            _ui.UpdateDisplay(dist);
            
            SyncToRemote(true);
        }

        public void SaveCurrentMeasurement()
        {
            // For now, persistence is handled by SendMeasurement(isFinalized: true)
            // in the Hub. We could add more explicit save if needed.
        }

        public void ClearMeasurement()
        {
            foreach (var line in _allMeasurements) Destroy(line.gameObject);
            _allMeasurements.Clear();
            if (_startMarker) Destroy(_startMarker);
            if (_endMarker) Destroy(_endMarker);
            _isMeasuring = false;
        }

        private void SyncToRemote(bool isFinalized)
        {
            if (VRSignalRService.Instance == null) return;

            var dto = new MeasurementDto
            {
                userId = VRSignalRService.Instance.ConnectionId,
                startPoint = new Vector3Dto(_startPoint),
                endPoint = new Vector3Dto(_endPoint),
                distance = Vector3.Distance(_startPoint, _endPoint),
                unit = _activeUnit,
                isFinalized = isFinalized
            };

            VRSignalRService.Instance.BroadcastMeasurement(dto);
        }

        private void HandleRemoteMeasurement(MeasurementDto dto)
        {
            // TODO: Logic to spawn/update remote user's measurement feedback
            // For now, just logging to show the sync is working
            Debug.Log($"[Measurement] Remote update from {dto.userId}: {dto.distance}{dto.unit}");
        }
    }
}
