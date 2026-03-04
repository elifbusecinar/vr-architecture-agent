using System;
using Fusion;
using UnityEngine;

namespace VRArchitecture.Session
{
    [Serializable]
    public class ParticipantData
    {
        public PlayerRef  PlayerId;
        public NetworkId  NetworkId;
        public string     DisplayName;
        public string     Role;           // "Architect" | "Client" | "Owner"
        public DateTime   JoinedAt;
        public bool       IsMuted;
        public float      VoiceLevel;     // 0–1, updated each 50ms
    }
}
