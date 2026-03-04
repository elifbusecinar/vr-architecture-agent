using UnityEngine;
using UnityEngine.XR;
using VRArchitecture.DTOs.VR;
using System.Collections;
using System.Collections.Generic;

namespace VRArchitecture.Services.Networking
{
    /// <summary>
    /// Synchronizes the local VR user transforms with the remote server.
    /// Also handles instantiating and updating remote user avatars.
    /// </summary>
    public class VRSynchronizer : MonoBehaviour
    {
        [Header("Local VR Refs")]
        [SerializeField] private Transform _headTransform;
        [SerializeField] private Transform _leftHandTransform;
        [SerializeField] private Transform _rightHandTransform;
        
        [Header("Sync Settings")]
        [SerializeField] private float _syncRate = 0.05f; // ~20fps sync
        [SerializeField] private GameObject _remoteAvatarPrefab;

        [Header("Laser Sync")]
        [SerializeField] private LineRenderer _localLaser;
        [SerializeField] private bool _isLaserActive;

        private Dictionary<string, GameObject> _remoteAvatars = new Dictionary<string, GameObject>();
        private string _currentSessionId;

        private void Start()
        {
            // Subscribe to SignalR events
            VRSignalRService.Instance.OnUserMoved += HandleRemoteUserMoved;
            VRSignalRService.Instance.OnLaserUpdated += HandleRemoteLaserUpdated;
            VRSignalRService.Instance.OnHighlightUpdated += (id, active) => HighlightLocalObject(id, active);
            VRSignalRService.Instance.OnStrokeReceived += HandleRemoteStroke;
            VRSignalRService.Instance.OnVoiceSignalReceived += HandleVoiceSignal;
            VRSignalRService.Instance.OnSummonReceived += HandleSummon;
            VRSignalRService.Instance.OnDisconnected += HandleDisconnected;
            
            StartCoroutine(SyncRoutine());
        }

        public void JoinSession(string sessionId)
        {
            _currentSessionId = sessionId;
            VRSignalRService.Instance.JoinSession(sessionId);
        }

        private IEnumerator SyncRoutine()
        {
            while (true)
            {
                if (VRSignalRService.Instance.IsConnected && !string.IsNullOrEmpty(_currentSessionId))
                {
                    SendLocalUpdate();
                    SendLaserUpdate();
                }
                yield return new WaitForSeconds(_syncRate);
            }
        }

        private void SendLocalUpdate()
        {
            var update = new AvatarUpdateDto
            {
                headPosition = new Vector3Dto(_headTransform.position),
                headRotation = new QuaternionDto(_headTransform.rotation),
                leftHandPosition = new Vector3Dto(_leftHandTransform.position),
                leftHandRotation = new QuaternionDto(_leftHandTransform.rotation),
                rightHandPosition = new Vector3Dto(_rightHandTransform.position),
                rightHandRotation = new QuaternionDto(_rightHandTransform.rotation)
            };

            VRSignalRService.Instance.SendAvatarUpdate(update);
        }

        private void SendLaserUpdate()
        {
            if (_localLaser == null) return;

            var laserUpdate = new LaserUpdateDto
            {
                isActive = _isLaserActive,
                origin = new Vector3Dto(_localLaser.GetPosition(0)),
                direction = new Vector3Dto(_localLaser.transform.forward),
                hitPoint = new Vector3Dto(_localLaser.GetPosition(1)),
                hitObjectId = GetHitObjectId(_localLaser.GetPosition(1))
            };

            VRSignalRService.Instance.SendLaserUpdate(laserUpdate);
        }

        private void HandleRemoteUserMoved(AvatarUpdateDto data)
        {
            if (!_remoteAvatars.TryGetValue(data.userId, out var avatar))
            {
                avatar = Instantiate(_remoteAvatarPrefab);
                avatar.name = $"RemoteUser_{data.userId}";
                _remoteAvatars.Add(data.userId, avatar);
            }

            UpdateRemotePart(avatar.transform, "Head", data.headPosition, data.headRotation);
            UpdateRemotePart(avatar.transform, "LeftHand", data.leftHandPosition, data.leftHandRotation);
            UpdateRemotePart(avatar.transform, "RightHand", data.rightHandPosition, data.rightHandRotation);
        }

        private void HandleRemoteLaserUpdated(LaserUpdateDto data)
        {
            if (_remoteAvatars.TryGetValue(data.userId, out var avatar))
            {
                var laserObj = avatar.transform.Find("LaserPointer");
                if (laserObj != null)
                {
                    var line = laserObj.GetComponent<LineRenderer>();
                    if (line != null)
                    {
                        line.enabled = data.isActive;
                        line.SetPosition(0, data.origin.ToVector3());
                        line.SetPosition(1, data.hitPoint.ToVector3());
                    }
                }
            }
        }

        private void HandleVoiceSignal(VoiceSignalDto data)
        {
            Debug.Log($"[Voice] Received signaling data ({data.signalType}) from {data.senderId}");
            // Handle WebRTC signaling logic here
        }

        private void UpdateRemotePart(Transform parent, string partName, Vector3Dto pos, QuaternionDto rot)
        {
            var part = parent.Find(partName);
            if (part != null)
            {
                part.position = pos.ToVector3();
                part.rotation = rot.ToQuaternion();
            }
        }

        private void HandleSummon(Vector3Dto pos, QuaternionDto rot)
        {
            Debug.Log("[Sync] Architect is summoning all participants.");
            // Move the root of the VR player
            transform.root.SetPositionAndRotation(pos.ToVector3(), rot.ToQuaternion());
        }

        private void HandleRemoteStroke(StrokeDto data)
        {
            Debug.Log($"[Sync] Rendering remote stroke from {data.userId}");
            var go = new GameObject($"RemoteStroke_{data.userId}");
            var lr = go.AddComponent<LineRenderer>();
            lr.startColor = lr.endColor = data.color;
            lr.startWidth = lr.endWidth = 0.02f;
            lr.positionCount = data.points.Length;
            
            var points = new Vector3[data.points.Length];
            for (int i = 0; i < data.points.Length; i++) points[i] = data.points[i].ToVector3();
            lr.SetPositions(points);
        }

        private string GetHitObjectId(Vector3 point)
        {
            // Simple logic: raycast again or use cached hit from local laser logic
            if (Physics.Raycast(Camera.main.transform.position, Camera.main.transform.forward, out var hit, 50f))
            {
                if (hit.point == point) return hit.collider.gameObject.name;
            }
            return null;
        }

        private void HighlightLocalObject(string objectId, bool active)
        {
            var obj = GameObject.Find(objectId);
            if (obj == null) return;

            var renderer = obj.GetComponent<MeshRenderer>();
            if (renderer != null)
            {
                if (active) renderer.material.EnableKeyword("_EMISSION");
                else renderer.material.DisableKeyword("_EMISSION");
            }
        }

        private void HandleDisconnected()
        {
            foreach (var kvp in _remoteAvatars)
            {
                Destroy(kvp.Value);
            }
            _remoteAvatars.Clear();
        }

        private void OnDestroy()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnUserMoved -= HandleRemoteUserMoved;
                VRSignalRService.Instance.OnLaserUpdated -= HandleRemoteLaserUpdated;
                VRSignalRService.Instance.OnVoiceSignalReceived -= HandleVoiceSignal;
                VRSignalRService.Instance.OnSummonReceived -= HandleSummon;
                VRSignalRService.Instance.OnDisconnected -= HandleDisconnected;
            }
        }
    }
}
