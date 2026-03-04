using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;

namespace VRArchitecture.XR
{
    /// <summary>
    /// Swaps between Different Locomotion Modes: Continuous (Joystick Move) and Teleport.
    /// Used for Point 5: Comfort/Navigation Control.
    /// </summary>
    public class LocomotionController : MonoBehaviour
    {
        [Header("Providers")]
        [SerializeField] private ActionBasedTeleportationProvider _teleportProvider;
        [SerializeField] private ActionBasedContinuousMoveProvider _continuousMoveProvider;
        [SerializeField] private ActionBasedContinuousTurnProvider _continuousTurnProvider;
        [SerializeField] private ActionBasedSnapTurnProvider       _snapTurnProvider;

        public enum MoveMode { Teleport = 0, Continuous = 1 }
        public enum TurnMode { Snap = 0, Continuous = 1 }

        private void Start() => SetMoveMode(MoveMode.Teleport);

        public void SetMoveMode(MoveMode mode)
        {
            if (mode == MoveMode.Teleport)
            {
                _teleportProvider.enabled = true;
                _continuousMoveProvider.enabled = false;
                Debug.Log("[Locomotion] Swapped to Teleport.");
            }
            else
            {
                _teleportProvider.enabled = false;
                _continuousMoveProvider.enabled = true;
                Debug.Log("[Locomotion] Swapped to Continuous Move.");
            }
        }

        public void SetTurnMode(TurnMode mode)
        {
            if (mode == TurnMode.Snap)
            {
                _snapTurnProvider.enabled = true;
                _continuousTurnProvider.enabled = false;
            }
            else
            {
                _snapTurnProvider.enabled = false;
                _continuousTurnProvider.enabled = true;
            }
        }
    }
}
