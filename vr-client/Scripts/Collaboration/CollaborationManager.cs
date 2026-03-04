using UnityEngine;
using UnityEngine.XR.Interaction.Toolkit;
using VRArchitecture.Services.Networking;
using System;

namespace VRArchitecture.Collaboration
{
    /// <summary>
    /// Handles "Summon" and "Go to Host" collaboration features.
    /// Used for Point 1: Teleport Together.
    /// </summary>
    public class CollaborationManager : MonoBehaviour
    {
        public static CollaborationManager Instance { get; private set; }

        private LocomotionSystem _locomotionSystem;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            _locomotionSystem = FindAnyObjectByType<LocomotionSystem>();
        }

        private void Start()
        {
            VRSignalRService.Instance.OnSummonReceived += HandleSummon;
        }

        /// <summary>Invites all others to my current location.</summary>
        public void SummonAll()
        {
            var myPos = Camera.main.transform.position;
            var myRot = Camera.main.transform.rotation;
            
            VRSignalRService.Instance.BroadcastSummon(new DTOs.VR.Vector3Dto(myPos), new DTOs.VR.QuaternionDto(myRot));
            Debug.Log("[Collab] Summoning everyone to my position...");
        }

        /// <summary>Teleports me to a specific user.</summary>
        public void GoToUser(string userId)
        {
            // Implementation depends on finding the remote avatar for this userId
            // VRSynchronizer handles avatar map.
        }

        public bool IsModerator { get; set; } = true; // For demo
        public bool IsMovementLocked { get; private set; }

        public void ToggleMovementLock(bool locked)
        {
            if (!IsModerator) return;
            IsMovementLocked = locked;
            VRSignalRService.Instance.BroadcastLock(locked);
            Debug.Log($"[Moderator] Movement locked: {locked}");
        }

        private void HandleLock(bool locked)
        {
            var locomotion = FindAnyObjectByType<UnityEngine.XR.Interaction.Toolkit.LocomotionSystem>();
            if (locomotion != null) locomotion.enabled = !locked;
            Debug.Log($"[Client] Movement restricted by Host: {locked}");
        }

        private void HandleSummon(DTOs.VR.Vector3Dto pos, DTOs.VR.QuaternionDto rot)
        {
            if (_locomotionSystem != null)
            {
                var request = new TeleportRequest
                {
                    destinationPosition = pos.ToVector3(),
                    destinationRotation = rot.ToQuaternion()
                };
                
                var provider = _locomotionSystem.GetComponentInChildren<TeleportationProvider>();
                if (provider != null) provider.QueueTeleportRequest(request);

                Debug.Log("[Collab] I was summoned by the host.");
            }
        }
    }
}
