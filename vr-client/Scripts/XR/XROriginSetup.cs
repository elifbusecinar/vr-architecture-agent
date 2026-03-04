using UnityEngine;
using Unity.XR.CoreUtils;
using UnityEngine.XR.Interaction.Toolkit;

namespace VRArchitecture.XR
{
    /// <summary>
    /// Programmatic setup for XR Origin (VR) prefab in the scene.
    /// Ensures XRI structure is correct for architectural viewing.
    /// </summary>
    public class XROriginSetup : MonoBehaviour
    {
        [ContextMenu("Setup XR Origin")]
        public void SetupVR()
        {
            // 1. Create XROrigin
            var originGo = new GameObject("XR Origin");
            var origin = originGo.AddComponent<XROrigin>();
            
            // 2. Camera Offset
            var cameraOffsetGo = new GameObject("Camera Offset");
            cameraOffsetGo.transform.SetParent(originGo.transform);
            origin.CameraFloorOffsetObject = cameraOffsetGo;

            // 3. Main Camera
            var camGo = GameObject.FindWithTag("MainCamera");
            if (camGo == null) camGo = new GameObject("Main Camera", typeof(Camera));
            
            camGo.transform.SetParent(cameraOffsetGo.transform);
            camGo.transform.localPosition = new Vector3(0, 1.6f, 0); // Head height
            origin.Camera = camGo.GetComponent<Camera>();
            camGo.AddComponent<TrackedPoseDriver>();

            // 4. Input Action Manager (Essential for XRI)
            var actionManagerGo = new GameObject("XR Input Action Manager");
            var actionManager = actionManagerGo.AddComponent<InputActionManager>();
            // Note: actionAssets list should be populated via inspector normally, 
            // but we ensure the component exists for now.

            // 5. Interaction Manager
            if (FindAnyObjectByType<XRInteractionManager>() == null)
            {
                new GameObject("XR Interaction Manager", typeof(XRInteractionManager));
            }

            Debug.Log("[XROriginSetup] XR Origin has been programmatically setup in the scene.");
        }
    }
}
