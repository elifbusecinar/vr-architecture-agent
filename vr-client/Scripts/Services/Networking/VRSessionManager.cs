using UnityEngine;
using System.Collections.Generic;
using VRArchitecture.Services.Networking;
using VRArchitecture.DTOs.VR;

namespace VRArchitecture.Session
{
    /// <summary>
    /// Manages the multiplayer session lobby and room join codes.
    /// Used for Point 3: Session Isolation.
    /// </summary>
    public class VRSessionManager : MonoBehaviour
    {
        [Header("Global Access")]
        public static VRSessionManager Instance { get; private set; }

        public string CurrentRoomId { get; private set; }
        public bool IsInSession { get; private set; }

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else { Destroy(gameObject); return; }
            DontDestroyOnLoad(gameObject);
        }

        public void JoinSession(string code)
        {
            if (string.IsNullOrEmpty(code)) return;
            
            CurrentRoomId = code.ToUpper();
            IsInSession = true;
            Debug.Log($"[Multisession] Joining room: {CurrentRoomId}");
            
            // Invoke join on SignalR hub level
            VRSignalRService.Instance.JoinProjectGroup(new System.Guid(CurrentRoomId)); // Or a separate Hub method
            
            // Future: Initialize Photon Fusion to specific session room
            // NetworkRunner.StartGame(new StartGameArgs { SessionName = code });
        }

        public void LeaveSession()
        {
            IsInSession = false;
            CurrentRoomId = null;
            Debug.Log("[Multisession] Left room.");
        }
    }
}
