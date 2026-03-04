using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Sessions
{
    /// <summary>
    /// Mirrors Backend → SessionParticipantInfo
    /// </summary>
    [Serializable]
    public class SessionParticipantInfo
    {
        public string userId;
        public string username;
    }

    /// <summary>
    /// Mirrors Backend → VRSessionDto
    /// POST /api/sessions/start/{projectId}, GET /api/sessions/active
    /// </summary>
    [Serializable]
    public class VRSessionDto
    {
        public string id;
        public string projectId;
        public string projectTitle;
        public string hostId;
        public string hostName;
        public string startTime;
        public bool isActive;
        public int participantCount;
        public SessionParticipantInfo[] participants;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class VRSessionListWrapper
    {
        public VRSessionDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → SessionHistoryDto
    /// GET /api/sessions/history
    /// </summary>
    [Serializable]
    public class SessionHistoryDto
    {
        public string sessionId;
        public string projectTitle;
        public string startTime;
        public float durationMinutes;
        public int totalParticipants;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class SessionHistoryListWrapper
    {
        public SessionHistoryDto[] items;
    }
}
