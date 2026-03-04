using UnityEngine;
using VRArchitecture.Services.Networking;
using System;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Handles WebRTC signaling for peer-to-peer voice chat in VR.
    /// Logic follows the SignalR signaling pattern.
    /// </summary>
    public class VRVoiceChat : MonoBehaviour
    {
        public static VRVoiceChat Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        private void Start()
        {
            if (VRSignalRService.Instance != null)
            {
                VRSignalRService.Instance.OnSignalReceived += HandleVoiceSignal;
            }
        }

        private void HandleVoiceSignal(string senderId, string signalData)
        {
            // WebRTC Signaling Logic: Offer, Answer, ICE Candidates
            if (signalData.Contains("offer"))
            {
                Debug.Log($"[VoiceChat] Received RTC Offer from {senderId}");
                // Process offer and send answer
            }
            else if (signalData.Contains("answer"))
            {
                Debug.Log($"[VoiceChat] Received RTC Answer from {senderId}");
            }
        }

        public void SendSignal(string targetId, string data)
        {
            VRSignalRService.Instance?.SendSignalToUser(targetId, data);
        }

        public void ToggleMic(bool active)
        {
            Debug.Log($"[VoiceChat] Microphone {(active ? "Enabled" : "Disabled")}");
            // Connect to Unity Microphone and stream via WebRTC
        }
    }
}
