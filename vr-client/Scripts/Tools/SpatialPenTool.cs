using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Tools
{
    /// <summary>
    /// Allows users to draw 3D lines in spatial air.
    /// Used for Point 5: Spatial 3D Pen.
    /// </summary>
    public class SpatialPenTool : MonoBehaviour
    {
        [Header("Settings")]
        [SerializeField] private GameObject _linePrefab;
        [SerializeField] private Color _drawColor = Color.cyan;
        [SerializeField] private float _minDistance = 0.05f;

        private LineRenderer _currentLine;
        private List<Vector3> _points = new List<Vector3>();
        private bool _isDrawing = false;
        private Stack<GameObject> _strokeStack = new Stack<GameObject>();

        public void StartDrawing()
        {
            _isDrawing = true;
            _points.Clear();
            var go = Instantiate(_linePrefab, transform.parent);
            _currentLine = go.GetComponent<LineRenderer>();
            _currentLine.startColor = _currentLine.endColor = _drawColor;
            _strokeStack.Push(go);
        }

        public void StopDrawing()
        {
            _isDrawing = false;
            if (_points.Count > 1)
            {
                // POINT 3: Sync Stroke with persistence attempt
                var dtoList = new List<VRArchitecture.DTOs.VR.Vector3Dto>();
                
                // Simplified Downsampling for performance on large strokes
                for (int i = 0; i < _points.Count; i += (_points.Count > 100 ? 2 : 1))
                {
                    dtoList.Add(new VRArchitecture.DTOs.VR.Vector3Dto(_points[i]));
                }

                VRSignalRService.Instance.BroadcastStroke(dtoList, _drawColor);
                Debug.Log($"[SpatialPen] Broadcasted optimized stroke with {dtoList.Count} points.");
                
                // Attempt to persist stroke to backend as a specialized annotation if current session exists
                if (!string.IsNullOrEmpty(VRSignalRService.Instance.CurrentSessionId))
                {
                    PersistStrokeToBackend(dtoList);
                }
            }
            else if (_currentLine != null)
            {
                // Single point stroke, remove it
                if (_strokeStack.Count > 0 && _strokeStack.Peek() == _currentLine.gameObject)
                {
                    var go = _strokeStack.Pop();
                    Destroy(go);
                }
            }
        }

        public void UndoLastStroke()
        {
            if (_strokeStack.Count == 0) return;
            var last = _strokeStack.Pop();
            Destroy(last);
            
            // Potential: Broadcast deletion signal if using persistent IDs
            Debug.Log("[SpatialPen] Undo performed locally.");
        }

        private void PersistStrokeToBackend(List<VRArchitecture.DTOs.VR.Vector3Dto> points)
        {
             if (!APIService.Instance.IsAuthenticated) return;

             // Convert stroke to a JSON data blob for persistence
             var strokeData = new StrokeDataJson {
                 points = points.ToArray(),
                 colorHex = ColorUtility.ToHtmlStringRGBA(_drawColor)
             };

             var dto = new VRArchitecture.DTOs.Annotations.CreateAnnotationDto {
                 text = "3D Private Sketch",
                 positionX = (double)points[0].x,
                 positionY = (double)points[0].y,
                 positionZ = (double)points[0].z,
                 projectId = new Guid(APIService.Instance.BaseUrl.Split('/').Length > 0 ? "00000000-0000-0000-0000-000000000000" : ""), // Needs real ID
                 priority = "low",
                 dataJson = JsonUtility.ToJson(strokeData)
             };
             
             // In a real session, we get ProjectId from SessionManager
             if (VRArchitecture.Session.SessionManager.Instance != null && VRArchitecture.Session.SessionManager.Instance.ActiveSession != null)
             {
                 // Mocking Guid parse for now as SessionId might be a string Guid
                 if(Guid.TryParse(VRArchitecture.Session.SessionManager.Instance.ActiveSession.SessionId, out var projId))
                     dto.projectId = projId;
             }

             APIService.Instance.CreateAnnotation(JsonUtility.ToJson(dto), (success, res) => {
                 if(success) Debug.Log("[SpatialPen] Stroke persisted to database as annotation.");
             });
        }

        [System.Serializable]
        private class StrokeDataJson { public VRArchitecture.DTOs.VR.Vector3Dto[] points; public string colorHex; }

        private void Update()
        {
            if (!_isDrawing) return;

            Vector3 tipPos = transform.position;
            if (_points.Count == 0 || Vector3.Distance(_points[_points.Count - 1], tipPos) > _minDistance)
            {
                _points.Add(tipPos);
                _currentLine.positionCount = _points.Count;
                _currentLine.SetPositions(_points.ToArray());
            }
        }
    }
}
