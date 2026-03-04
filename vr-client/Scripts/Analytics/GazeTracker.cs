using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;
using VRArchitecture.Services;

namespace VRArchitecture.Analytics
{
    /// <summary>
    /// Tracks where the VR user is looking and periodically sends data to the backend for heatmap generation.
    /// Used for T046 (Heatmap Feature).
    /// </summary>
    public class GazeTracker : MonoBehaviour
    {
        [Header("Settings")]
        [SerializeField] private float _trackInterval = 0.5f; // Every 0.5 seconds
        [SerializeField] private float _batchUploadInterval = 5f; // Every 5 seconds
        [SerializeField] private LayerMask _hitMask;
        [SerializeField] private float _maxDistance = 50f;

        private List<GazePointDto> _pendingPoints = new List<GazePointDto>();
        private string _cachedProjectId;

        private void Start()
        {
            StartCoroutine(TrackGazeRoutine());
            StartCoroutine(BatchUploadRoutine());
        }

        public void SetProjectId(string id) => _cachedProjectId = id;

        private IEnumerator TrackGazeRoutine()
        {
            while (true)
            {
                if (Camera.main != null && !string.IsNullOrEmpty(_cachedProjectId))
                {
                    Ray ray = new Ray(Camera.main.transform.position, Camera.main.transform.forward);
                    if (Physics.Raycast(ray, out var hit, _maxDistance, _hitMask))
                    {
                        var point = new GazePointDto
                        {
                            ProjectId = _cachedProjectId,
                            UserId = "me", // TODO: fetch real user id
                            ConnectionId = VRSignalRService.Instance.ConnectionId,
                            PositionX = hit.point.x,
                            PositionY = hit.point.y,
                            PositionZ = hit.point.z
                        };
                        _pendingPoints.Add(point);
                    }
                }
                yield return new WaitForSeconds(_trackInterval);
            }
        }

        private IEnumerator BatchUploadRoutine()
        {
            while (true)
            {
                yield return new WaitForSeconds(_batchUploadInterval);

                if (_pendingPoints.Count > 0)
                {
                    string json = JsonUtility.ToJson(new GazeBatch { points = _pendingPoints });
                    Debug.Log($"[GazeTracker] Uploading {_pendingPoints.Count} points...");
                    
                    APIService.Instance.PostRequest("/api/analytics/gaze-points", json, true, (success, resp) => {
                        if (success) _pendingPoints.Clear();
                    });
                }
            }
        }

        [System.Serializable]
        private class GazeBatch { public List<GazePointDto> points; }

        [System.Serializable]
        public class GazePointDto
        {
            public string ProjectId;
            public string UserId;
            public string ConnectionId;
            public float PositionX, PositionY, PositionZ;
        }
    }
}
