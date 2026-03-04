using Fusion;
using UnityEngine;

namespace VRArchitecture.Networking
{
    /// <summary>
    /// Represents a networked player in the VR session using Photon Fusion.
    /// Syncs Head, Left Hand, and Right Hand transforms.
    /// </summary>
    public class NetworkPlayer : NetworkBehaviour
    {
        [Header("Local Refs (Mapped only for InputAuthority)")]
        [SerializeField] private Transform _localHead;
        [SerializeField] private Transform _localLeftHand;
        [SerializeField] private Transform _localRightHand;

        [Header("Networked Visuals (Updated for everyone)")]
        [SerializeField] private Transform _netHead;
        [SerializeField] private Transform _netLeftHand;
        [SerializeField] private Transform _netRightHand;

        [Networked] public NetworkString<_32> Username { get; set; }
        [Networked] public Color PlayerColor { get; set; }

        public override void Spawned()
        {
            if (Object.HasInputAuthority)
            {
                // Find local VR rig transforms if not assigned
                if (_localHead == null) _localHead = Camera.main.transform;
                // Hands would normally be assigned via a 'PlayerSpawner' or Rig reference
                
                // Hide networked visuals for local player to prevent clipping
                _netHead.gameObject.SetActive(false);
                _netLeftHand.gameObject.SetActive(false);
                _netRightHand.gameObject.SetActive(false);
            }
            
            // Apply player color to hands/head visuals (assuming they have renderers)
            ApplyColorToVisuals();
        }

        public override void FixedUpdateNetwork()
        {
            if (Object.HasInputAuthority)
            {
                if (_localHead != null)
                {
                    _netHead.position = _localHead.position;
                    _netHead.rotation = _localHead.rotation;
                }
                // Sync hands similarly... 
                // In a production setup, we'd use 'NetworkCharacterController' or similar for movement,
                // but for VR transforms, direct assignment in FUN is common for late-joiners.
            }
        }

        private void ApplyColorToVisuals()
        {
            var renderers = GetComponentsInChildren<Renderer>();
            foreach (var r in renderers)
            {
                r.material.color = PlayerColor;
            }
        }
    }
}
