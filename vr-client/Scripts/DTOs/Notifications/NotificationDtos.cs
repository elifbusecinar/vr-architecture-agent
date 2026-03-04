using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Notifications
{
    /// <summary>
    /// Mirrors Backend → NotificationDto
    /// GET /api/notifications
    /// </summary>
    [Serializable]
    public class NotificationDto
    {
        public string id;
        public string title;
        public string message;
        public string type;
        public bool isRead;
        public string projectId;
        public string workspaceId;
        public string createdAt;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class NotificationListWrapper
    {
        public NotificationDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → NotificationPreferenceDto
    /// </summary>
    [Serializable]
    public class NotificationPreferenceDto
    {
        public string key;
        public bool enabled;
    }

    /// <summary>
    /// Mirrors Backend → UpdatePreferencesDto
    /// PUT /api/notifications/preferences
    /// </summary>
    [Serializable]
    public class UpdatePreferencesDto
    {
        public NotificationPreferenceDto[] preferences;
    }
}
