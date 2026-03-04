using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fusion;
using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;
using VRArchitecture.Session;
using VRArchitecture.Models;

namespace VRArchitecture.Annotation
{
    /// <summary>
    /// Handles the full annotation lifecycle using Photon Fusion.
    /// </summary>
    public class AnnotationController : NetworkBehaviour
    {
        // ─── Inspector ───────────────────────────────────────────────
        [Header("Prefabs")]
        [SerializeField] private NetworkObject _annotationPinPrefab;
        [SerializeField] private GameObject    _crosshairPrefab;

        [Header("XR References")]
        [SerializeField] private XRRayInteractor _rightRayInteractor;
        [SerializeField] private XRRayInteractor _leftRayInteractor;
        [SerializeField] private ActionBasedController _rightController;

        [Header("Config")]
        [SerializeField] private float   _maxAnnotationDistance = 50f;
        [SerializeField] private LayerMask _architectureLayerMask;
        [SerializeField] private int     _maxAnnotationsPerSession = 200;
        [SerializeField] private float   _autoFlushInterval = 30f;  
        [SerializeField] private Transform _modelRoot; // Added root for local space
        [SerializeField] private GameObject _locomotionSystem; // XR Locomotion to disable

        // ─── State ───────────────────────────────────────────────────
        public bool IsAnnotationModeActive { get; private set; }

        private readonly List<AnnotationData>        _localAnnotations  = new();
        private readonly List<AnnotationData>        _pendingFlush      = new();
        private readonly Dictionary<Guid, AnnotationPin> _activePins    = new();

        private GameObject _crosshairInstance;
        private float      _lastFlushTime;
        private bool       _isRecordingVoice;

        // ─── Events ──────────────────────────────────────────────────
        public event Action<AnnotationData> OnAnnotationCreated;
        public event Action<AnnotationData> OnAnnotationReceived;
        public event Action<Guid>           OnAnnotationDeleted;

        // ─── Lifecycle ───────────────────────────────────────────────
        private void Start()
        {
            if (_crosshairPrefab != null)
            {
                _crosshairInstance = Instantiate(_crosshairPrefab);
                _crosshairInstance.SetActive(false);
            }
        }

        public override void FixedUpdateNetwork()
        {
            if (!IsAnnotationModeActive) return;
            UpdateCrosshair();
            HandleTriggerInput();
        }

        private void Update()
        {
            if (Time.time - _lastFlushTime > _autoFlushInterval && _pendingFlush.Count > 0)
                _ = FlushPendingAsync();
        }

        // ─── Public API ──────────────────────────────────────────────

        public void SetAnnotationMode(bool active)
        {
            IsAnnotationModeActive = active;
            if (_crosshairInstance != null) _crosshairInstance.SetActive(active);
            if (_rightRayInteractor != null) _rightRayInteractor.gameObject.SetActive(!active);

            // Point 4: Disable locomotion while annotating to prevent accidental teleportation
            if (_locomotionSystem != null) _locomotionSystem.SetActive(!active);
        }

        public void SetModelRoot(Transform root) => _modelRoot = root;

        public void PlaceAnnotationAtGaze(string text, string room = "", AnnotationPriority priority = AnnotationPriority.Mid)
        {
            if (_localAnnotations.Count >= _maxAnnotationsPerSession) return;

            var localPos = hitInfo.point;
            var localNormal = hitInfo.normal;

            if (_modelRoot != null)
            {
                localPos = _modelRoot.InverseTransformPoint(hitInfo.point);
                localNormal = _modelRoot.InverseTransformDirection(hitInfo.normal);
            }

            var annotation = new AnnotationData
            {
                Id          = Guid.NewGuid(),
                SessionId   = SessionManager.Instance.ActiveSession?.SessionId.ToString() ?? "local",
                Text        = text,
                Room        = room,
                Priority    = priority,
                WorldPos    = hitInfo.point,
                WorldNormal = hitInfo.normal,
                LocalPos    = localPos,
                LocalNormal = localNormal,
                CreatedBy   = "User", 
                CreatedAt   = DateTime.UtcNow,
                AuthorColor = Color.cyan,
            };

            // Spawn pin for everyone (Fusion host spawn)
            if (Runner.IsServer)
                SpawnPin(annotation);
            else
                RPC_RequestPinSpawn(annotation.Id, annotation.WorldPos, annotation.WorldNormal, annotation.LocalPos, annotation.LocalNormal,
                    annotation.Text, annotation.Room, (int)annotation.Priority, annotation.CreatedBy, annotation.AuthorColor);

            _localAnnotations.Add(annotation);
            _pendingFlush.Add(annotation);
            OnAnnotationCreated?.Invoke(annotation);
            
            PersistToBackend(annotation);
            Services.Broadcasting.SyncBroadcaster.Instance.BroadcastAnnotation(annotation, this);
        }

        private void PersistToBackend(AnnotationData data)
        {
            var projectId = SessionManager.Instance.ActiveSession?.ProjectId ?? Guid.Empty;
            if (projectId == Guid.Empty || !APIService.Instance.IsAuthenticated) return;

            var dto = new DTOs.Annotations.CreateAnnotationDto
            {
                Text = data.Text.ToString(),
                PositionX = (double)data.WorldPos.x,
                PositionY = (double)data.WorldPos.y,
                PositionZ = (double)data.WorldPos.z,
                ProjectId = projectId,
                RoomName = data.Room.ToString(),
                Priority = data.Priority.ToString().ToLower()
            };

            string json = JsonUtility.ToJson(dto);
            APIService.Instance.CreateAnnotation(json, (success, res) => {
                if (success) Debug.Log($"[AnnotationController] Persisted to backend: {data.Id}");
            });
        }

        public async Task FlushPendingAsync()
        {
            if (_pendingFlush.Count == 0) return;
            // Since we persist in realtime now, flush just clears the list
            _pendingFlush.Clear();
            _lastFlushTime = Time.time;
            await Task.Yield();
        }

        public List<AnnotationData> GetSessionAnnotations() => _localAnnotations;

        public void DeleteAnnotation(Guid id)
        {
            if (_activePins.TryGetValue(id, out var pin))
            {
                Runner.Despawn(pin.Object);
                _activePins.Remove(id);
            }
            
            _localAnnotations.RemoveAll(a => a.Id == id);
            _pendingFlush.RemoveAll(a => a.Id == id);
            
            RPC_RequestDelete(id.ToString());
            OnAnnotationDeleted?.Invoke(id);
            
            // Backend delete? (If backend has DELETE /api/annotations/{id})
            APIService.Instance.DeleteAnnotation(id.ToString(), (s, r) => {
                if(s) Debug.Log("[AnnotationController] Deleted from backend.");
            });
        }

        public void ReplyToAnnotation(Guid parentId, string replyText)
        {
            // For now, we just create a new annotation at the same spot but linked?
            // Or just a fresh annotation with modified text
            if (_activePins.TryGetValue(parentId, out var pin))
            {
                string text = $"Re: {replyText}";
                PlaceAnnotationAtGaze(text, pin.Annotation.Room, pin.Annotation.Priority);
            }
        }

        // ─── Private ─────────────────────────────────────────────────

        private void UpdateCrosshair()
        {
            if (_crosshairInstance == null) return;
            if (TryRaycastArchitecture(out var hit))
            {
                _crosshairInstance.SetActive(true);
                _crosshairInstance.transform.position = hit.point + hit.normal * 0.005f;
                _crosshairInstance.transform.rotation = Quaternion.LookRotation(-hit.normal);
            }
            else
            {
                _crosshairInstance.SetActive(false);
            }
        }

        private void HandleTriggerInput()
        {
            if (_rightController == null) return;
            if (_rightController.activateAction.action.WasPressedThisFrame())
            {
                // Placeholder for keyboard/flow trigger
                Debug.Log("[AnnotationController] Trigger pressed in annotation mode.");
            }
        }

        private bool TryRaycastArchitecture(out RaycastHit hit)
        {
            if (_rightController == null) { hit = default; return false; }
            var origin    = _rightController.transform.position;
            var direction = _rightController.transform.forward;
            return Physics.Raycast(origin, direction, out hit, _maxAnnotationDistance, _architectureLayerMask);
        }

        private void SpawnPin(AnnotationData data)
        {
            Vector3 spawnPos = data.WorldPos;
            Vector3 spawnNormal = data.WorldNormal;

            // If we have a model root, use local space to avoid drift
            if (_modelRoot != null)
            {
                spawnPos = _modelRoot.TransformPoint(data.LocalPos);
                spawnNormal = _modelRoot.TransformDirection(data.LocalNormal);
            }

            var pinObj = Runner.Spawn(
                _annotationPinPrefab,
                spawnPos + spawnNormal * 0.01f,
                Quaternion.LookRotation(-spawnNormal),
                Runner.LocalPlayer
            );

            var pin = pinObj.GetComponent<AnnotationPin>();
            if (pin != null)
            {
                pin.Initialise(data);
                _activePins[data.Id] = pin;
            }
        }

        // ─── Photon RPCs ─────────────────────────────────────────────

        [Rpc(RpcSources.InputAuthority, RpcTargets.StateAuthority)]
        private void RPC_RequestPinSpawn(
            Guid annotId, Vector3 worldPos, Vector3 worldNormal, Vector3 localPos, Vector3 localNormal,
            string text, string room, int priority, string author, Color color)
        {
            var data = new AnnotationData
            {
                Id          = annotId,
                WorldPos    = worldPos,
                WorldNormal = worldNormal,
                LocalPos    = localPos,
                LocalNormal = localNormal,
                Text        = text,
                Room        = room,
                Priority    = (AnnotationPriority)priority,
                CreatedBy   = author,
                AuthorColor = color,
                CreatedAt   = DateTime.UtcNow,
            };
            SpawnPin(data);
        }

        [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
        public void RPC_BroadcastAnnotation(AnnotationData data)
        {
            if (Runner.IsServer) return;
            _localAnnotations.Add(data);
            OnAnnotationReceived?.Invoke(data);
        }

        [Rpc(RpcSources.All, RpcTargets.StateAuthority)]
        public void RPC_RequestDelete(string annotationIdStr)
        {
            RPC_BroadcastDelete(annotationIdStr);
        }

        [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
        private void RPC_BroadcastDelete(string annotationIdStr)
        {
            if (Guid.TryParse(annotationIdStr, out var id))
            {
                if (_activePins.TryGetValue(id, out var pin))
                {
                    if(Runner.IsServer) Runner.Despawn(pin.Object);
                    _activePins.Remove(id);
                }
                _localAnnotations.RemoveAll(a => a.Id == id);
                OnAnnotationDeleted?.Invoke(id);
            }
        }

        // Bridge to existing AnnotationSystem if needed
        [SerializeField] private Annotations.AnnotationSystem _annotationSystem;
        public void CompleteAnnotation(string note, Vector3 position)
        {
            PlaceAnnotationAtGaze(note);
        }
    }
}
