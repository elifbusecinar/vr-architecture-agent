using UnityEngine;
using Fusion;
using VRArchitecture.DTOs.VR;
using VRArchitecture.Models;
using VRArchitecture.Services.Networking;
using System;

namespace VRArchitecture.Services.Broadcasting
{
    /// <summary>
    /// Centralized broadcaster for hybrid networking (Fusion for VR, SignalR for Web).
    /// </summary>
    public class SyncBroadcaster : MonoBehaviour
    {
        public static SyncBroadcaster Instance { get; private set; }

        private void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>Broadcasts avatar movement to both SignalR (Web) and handles local VR sync.</summary>
        public void BroadcastAvatarUpdate(AvatarUpdateDto data)
        {
            // 1. SignalR for Web Dashboard & other VR clients (if not using Fusion for movement)
            if (VRSignalRService.Instance.IsConnected)
            {
                VRSignalRService.Instance.SendAvatarUpdate(data);
            }

            // 2. Fusion (if we were using Fusion for movement, we'd update networked properties here)
            // Currently, movemement is only through SignalR as per VRSynchronizer.cs
        }

        /// <summary>Broadcasts laser pointer state to both SignalR (Web) and other VR clients.</summary>
        public void BroadcastLaserUpdate(LaserUpdateDto data)
        {
            if (VRSignalRService.Instance.IsConnected)
            {
                VRSignalRService.Instance.SendLaserUpdate(data);
            }
        }

        /// <summary>Broadcasts a new annotation to both VR (Fusion) and Web (SignalR).</summary>
        /// <param name="data">The annotation data.</param>
        /// <param name="fusionController">The controller that handles Fusion RPCs.</param>
        public void BroadcastAnnotation(AnnotationData data, Annotation.AnnotationController fusionController)
        {
            // 1. VR-to-VR via Fusion RPC
            // This is handled by the Controller calling SpawnPin or RPC_RequestPinSpawn
            // We delegate the Fusion specific part back to the controller.

            // 2. VR-to-Web via SignalR
            if (VRSignalRService.Instance.IsConnected)
            {
                var sessionId = VRSignalRService.Instance.CurrentSessionId;
                if (!string.IsNullOrEmpty(sessionId))
                {
                    VRSignalRService.Instance.SendAnnotation(sessionId, data);
                }
            }
        }

        /// <summary>Broadcasts voice signal for WebRTC.</summary>
        public void BroadcastVoiceSignal(VoiceSignalDto data)
        {
            if (VRSignalRService.Instance.IsConnected)
            {
                VRSignalRService.Instance.SendVoiceSignal(data);
            }
        }

        public void BroadcastMeasurement(MeasurementDto data)
        {
            if (VRSignalRService.Instance.IsConnected)
            {
                VRSignalRService.Instance.BroadcastMeasurement(data);
            }
        }

        public void BroadcastSummon(Vector3 position, Quaternion rotation)
        {
            if (VRSignalRService.Instance.IsConnected)
            {
                VRSignalRService.Instance.BroadcastSummon(new Vector3Dto(position), new QuaternionDto(rotation));
            }
        }
    }
}
