using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Activities
{
    /// <summary>
    /// Mirrors Backend → ActivityLogDto
    /// GET /api/activities
    /// </summary>
    [Serializable]
    public class ActivityLogDto
    {
        public string id;
        public int type;            // maps to ActivityType enum
        public string message;
        public string userId;
        public string userName;
        public string projectId;
        public string projectTitle;
        public string workspaceId;
        public string workspaceName;
        public string metadata;
        public string createdAt;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class ActivityLogListWrapper
    {
        public ActivityLogDto[] items;
    }
}
