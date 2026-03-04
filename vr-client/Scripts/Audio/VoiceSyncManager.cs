using UnityEngine;
using System;
using VRArchitecture.Services.Networking;
using VRArchitecture.DTOs.VR;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Handles voice signal routing for basic WebRTC-like communication.
    /// Real audio streaming would require hardware bridge or WebRTC plugins (e.g. Unity WebRTC).
    /// </summary>
    public class VoiceSyncManager : MonoBehaviour
    {
        public static VoiceSyncManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            VRSignalRService.Instance.OnVoiceSignalReceived += HandleRemoteVoiceSignal;
        }

        /// <summary>Sends local voice metadata (SDP, ICE) to others.</summary>
        public void SendVoiceSignal(string targetUserId, string signalType, string data)
        {
            var signal = new VoiceSignalDto
            {
                senderId = VRSignalRService.Instance.ConnectionId,
                targetId = targetUserId,
                signalType = signalType,
                data = data
            };
            
            VRSignalRService.Instance.SendVoiceSignal(signal);
            Debug.Log($"[VoiceSync] Sent {signalType} to {targetUserId}");
        }

        private void HandleRemoteVoiceSignal(VoiceSignalDto signal)
        {
            Debug.Log($"[VoiceSync] Received {signal.signalType} from {signal.senderId}");
            
            // Logic to bridge to WebRTC Native Plugin:
            // 1. If Type == "offer", peer.SetRemoteDescription()
            // 2. If Type == "candidate", peer.AddIceCandidate()
        }
    }
}
