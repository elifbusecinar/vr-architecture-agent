using System.Collections.Generic;
using VRArchitecture.DTOs.Annotations;
using VRArchitecture.Services.Annotations;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Annotations
{
    /// <summary>
    /// Handles annotation creation in VR (T057, T058, T059, T061, T062).
    /// </summary>
    public class AnnotationSystem : MonoBehaviour
    {
        public GameObject pinPrefab;
        public Transform rayOriginTransform; // Controller's forward transform
        public string activeProjectId;

        [Header("Meta SDK Virtual Keyboard Integration")]
        public bool useMetaKeyboard = true;

        private Dictionary<string, GameObject> _activePins = new Dictionary<string, GameObject>();

        private void Start()
        {
            // T062: Subscribe to SignalR events for live sync
            VRSignalRService.Instance.OnAnnotationCreated += HandleRemoteAnnotationCreated;
            VRSignalRService.Instance.OnAnnotationDeleted += HandleRemoteAnnotationDeleted;
        }

        /// <summary>
        /// Logic for T057 (Raycast) and T058 (Instantiate Pin).
        /// </summary>
        public void CreateAnnotationAtHit()
        {
            if (rayOriginTransform == null)
            {
                Debug.LogError("[AnnotationSystem] Ray origin is not set.");
                return;
            }

            Ray ray = new Ray(rayOriginTransform.position, rayOriginTransform.forward);
            if (Physics.Raycast(ray, out RaycastHit hit, 10.0f))
            {
                Debug.Log($"[AnnotationSystem] Ray hit at: {hit.point}");
                ShowKeyboardForNote(hit.point);
            }
        }

        private void ShowKeyboardForNote(Vector3 position)
        {
            // T059: Virtual Keyboard Integration
            if (useMetaKeyboard)
            {
                // In a real project with Meta SDK, we'd open the keyboard directly
                // Using Meta's OVRVirtualKeyboard component
                Debug.Log("[AnnotationSystem] Meta SDK Virtual Keyboard requested for input.");
                
                // For now, mock the input completion
                CompleteAnnotation("Architectural feedback from VR session.", position);
            }
            else
            {
                Debug.Log("[AnnotationSystem] Default Unity UI keyboard requested.");
            }
        }

        public void CompleteAnnotation(string note, Vector3 position)
        {
            // Local visual feedback (spawn immediately before sync)
            GameObject localPin = null;
            if (pinPrefab != null)
            {
                localPin = Instantiate(pinPrefab, position, Quaternion.identity);
                Debug.Log($"[AnnotationSystem] Local pin instantiated at: {position}");
            }

            // T060: Post to Backend
            AnnotationApiService.Instance.CreateAnnotation(activeProjectId, note, position, (success, dto) => {
                if (success && dto != null)
                {
                    Debug.Log("[AnnotationSystem] Annotation saved to cloud and shared.");
                    // Track this pin so SignalR loopback doesn't double-spawn it
                    if (localPin != null && !_activePins.ContainsKey(dto.id))
                    {
                        _activePins.Add(dto.id, localPin);
                    }
                }
            });
        }

        private void HandleRemoteAnnotationCreated(AnnotationDto data)
        {
            // T061: Handle incoming SignalR annotation
            // Skip if it's our own pin we already spawned
            if (_activePins.ContainsKey(data.id)) return;

            Vector3 pos = new Vector3((float)data.positionX, (float)data.positionY, (float)data.positionZ);
            if (pinPrefab != null)
            {
                GameObject pin = Instantiate(pinPrefab, pos, Quaternion.identity);
                _activePins.Add(data.id, pin);
                Debug.Log($"[AnnotationSystem] Remote pin spawned from {data.authorName} at {pos}");
            }
        }

        private void HandleRemoteAnnotationDeleted(string annotationId)
        {
            // T061: Handle incoming SignalR deletion
            if (_activePins.TryGetValue(annotationId, out GameObject pin))
            {
                Destroy(pin);
                _activePins.Remove(annotationId);
                Debug.Log($"[AnnotationSystem] Pin {annotationId} removed via SignalR sync.");
            }
        }

        private void OnDestroy()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnAnnotationCreated -= HandleRemoteAnnotationCreated;
                VRSignalRService.Instance.OnAnnotationDeleted -= HandleRemoteAnnotationDeleted;
            }
        }
    }
}
