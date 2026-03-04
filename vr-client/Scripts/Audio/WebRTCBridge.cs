using UnityEngine;
using System.Collections;
using VRArchitecture.Services.Networking;

namespace VRArchitecture.Audio
{
    /// <summary>
    /// Bridge between VRSignalRService and Unity WebRTC plugin.
    /// Handles Point 5: WebRTC Native Bridge.
    /// </summary>
    public class WebRTCBridge : MonoBehaviour
    {
        [Header("Audio Refs")]
        [SerializeField] private MicrophoneCapturer _micCapturer;
        [SerializeField] private SpatialAudioManager _spatialAudio;

        private void Start()
        {
            VRSignalRService.Instance.OnVoiceSignalReceived += HandleSignaling;
            
            if (_micCapturer == null) _micCapturer = MicrophoneCapturer.Instance;
            
            // Start capturing if we're in a session
            if (VRSignalRService.Instance != null && VRSignalRService.Instance.IsConnected)
            {
                _micCapturer.OnAudioChunkCaptured += HandleLocalAudioChunk;
                _micCapturer.StartCapture();
            }
        }

        private void HandleLocalAudioChunk(float[] samples)
        {
            // Point 5: Native Audio Bridge
            // This is where real-time chunks would be fed into the RTCAudioSource of com.unity.webrtc
        }

        private void HandleSignaling(DTOs.VR.VoiceSignalDto signal)
        {
            Debug.Log($"[WebRTC-Native] Processing {signal.signalType} from {signal.senderId}");
            
            switch (signal.signalType.ToLower())
            {
                case "offer":
                    Debug.Log($"[WebRTC] Creating Answer for peer {signal.senderId}...");
                    InitiateAnswer(signal.senderId);
                    break;
                case "answer":
                    Debug.Log($"[WebRTC] Setting Remote Stream for peer {signal.senderId}.");
                    break;
                case "candidate":
                    Debug.Log($"[WebRTC] Adding ICE Candidate from {signal.senderId}.");
                    break;
            }
        }

        private void InitiateAnswer(string targetId)
        {
            var answerData = new DTOs.VR.VoiceSignalDto { 
                senderId = VRSignalRService.Instance.ConnectionId, 
                targetId = targetId,
                signalType = "answer", 
                data = "sdp_answer_placeholder_data" 
            };
            VRSignalRService.Instance.SendVoiceSignal(answerData);
        }

        public void InitiateCall(string targetId)
        {
            Debug.Log($"[WebRTC-Native] Initiating call to {targetId}");
            
            var offerData = new DTOs.VR.VoiceSignalDto { 
                senderId = VRSignalRService.Instance.ConnectionId, 
                targetId = targetId, 
                signalType = "offer", 
                data = "sdp_offer_placeholder_data" 
            };
            VRSignalRService.Instance.SendVoiceSignal(offerData);
        }
    }
}
