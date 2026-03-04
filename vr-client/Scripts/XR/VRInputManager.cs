using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.XR.Interaction.Toolkit;

namespace VRArchitecture.XR
{
    /// <summary>
    /// Handles VR controller inputs and provides button press events for annotation creation.
    /// Used for T056 (Controller Input Actions).
    /// </summary>
    public class VRInputManager : MonoBehaviour
    {
        public InputActionReference primaryButtonAction; // Usually X or A
        public InputActionReference secondaryButtonAction; // Usually Y or B
        
        public System.Action<bool> OnPrimaryButtonPressed;
        public System.Action<bool> OnSecondaryButtonPressed;

        private void OnEnable()
        {
            if (primaryButtonAction != null && primaryButtonAction.action != null)
            {
                primaryButtonAction.action.Enable();
                primaryButtonAction.action.performed += Context => OnPrimaryButtonPressed?.Invoke(true);
            }

            if (secondaryButtonAction != null && secondaryButtonAction.action != null)
            {
                secondaryButtonAction.action.Enable();
                secondaryButtonAction.action.performed += Context => OnSecondaryButtonPressed?.Invoke(true);
            }
        }

        private void OnDisable()
        {
            if (primaryButtonAction != null && primaryButtonAction.action != null)
                primaryButtonAction.action.performed -= Context => OnPrimaryButtonPressed?.Invoke(true);
            
            if (secondaryButtonAction != null && secondaryButtonAction.action != null)
                secondaryButtonAction.action.performed -= Context => OnSecondaryButtonPressed?.Invoke(true);
        }
        
        /// <summary>
        /// Manual raycast from the given origin.
        /// Used for T057 (Raycast Logic).
        /// </summary>
        public static bool PerformRaycast(Transform origin, out RaycastHit hit, float maxDistance = 10.0f)
        {
            Ray ray = new Ray(origin.position, origin.forward);
            return Physics.Raycast(ray, out hit, maxDistance);
        }
    }
}
