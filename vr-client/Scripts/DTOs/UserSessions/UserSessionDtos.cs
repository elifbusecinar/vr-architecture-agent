using System;
using UnityEngine;

namespace VRArchitecture.DTOs.UserSessions
{
    /// <summary>
    /// Mirrors Backend → UserSessionDto
    /// GET /api/usersessions
    /// </summary>
    [Serializable]
    public class UserSessionDto
    {
        public string id;
        public string deviceName;
        public string location;
        public string lastActiveAt;
        public bool isCurrent;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class UserSessionListWrapper
    {
        public UserSessionDto[] items;
    }
}
