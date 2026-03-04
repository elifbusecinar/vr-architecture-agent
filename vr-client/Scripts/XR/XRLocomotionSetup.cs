using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

namespace VRArchitecture.XR
{
    /// <summary>
    /// Programmatic setup for standard VR Locomotion (Teleportation, Snap Turn).
    /// Used for basic movement in VR architectural previews.
    /// </summary>
    public class XRLocomotionSetup : MonoBehaviour
    {
        [ContextMenu("Add Locomotion System")]
        public void SetupLocomotion()
        {
            var origin = FindAnyObjectByType<Unity.XR.CoreUtils.XROrigin>();
            if (origin == null)
            {
                Debug.LogError("[XRLocomotionSetup] XROrigin not found in scene.");
                return;
            }

            var locomotionGo = new GameObject("Locomotion System");
            locomotionGo.transform.SetParent(origin.transform);
            
            var system = locomotionGo.AddComponent<LocomotionSystem>();
            system.xrOrigin = origin;

            // 1. Snap Turn Provider
            var snapTurn = locomotionGo.AddComponent<ActionBasedSnapTurnProvider>();
            snapTurn.system = system;
            snapTurn.turnAmount = 45f;
            
            // 2. Teleportation Provider
            locomotionGo.AddComponent<TeleportationProvider>().system = system;

            Debug.Log("[XRLocomotionSetup] Locomotion System with Snap Turn and Teleportation created successfully.");
        }

        [ContextMenu("Mark Ground as Teleport Area")]
        public void SetupGroundAsTeleport()
        {
            var interactionManager = FindAnyObjectByType<XRInteractionManager>();
            if (interactionManager == null)
            {
                interactionManager = new GameObject("XR Interaction Manager", typeof(XRInteractionManager)).GetComponent<XRInteractionManager>();
            }

            var grounds = GameObject.FindGameObjectsWithTag("Ground");
            if (grounds.Length == 0)
            {
                // Try to find object by name "Plane" or "Floor"
                var floor = GameObject.Find("Plane") ?? GameObject.Find("Floor") ?? GameObject.Find("Ground");
                if (floor != null) grounds = new[] { floor };
            }

            foreach (var g in grounds)
            {
                if (g.GetComponent<TeleportationArea>() == null)
                {
                    var teleportArea = g.AddComponent<TeleportationArea>();
                    teleportArea.interactionManager = interactionManager;
                    Debug.Log($"[XRLocomotionSetup] Marked object: {g.name} as Teleport Area.");
                }
            }
        }
    }
}
