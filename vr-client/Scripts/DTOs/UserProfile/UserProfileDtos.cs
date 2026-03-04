using System;
using UnityEngine;

namespace VRArchitecture.DTOs.UserProfile
{
    /// <summary>
    /// Mirrors Backend → UserProfileDto
    /// GET /api/userprofile
    /// </summary>
    [Serializable]
    public class UserProfileDto
    {
        public string id;
        public string username;
        public string email;
        public string firstName;
        public string lastName;
        public string jobTitle;
        public string language;
        public string avatarUrl;
        public string role;
        public string createdAt;
    }

    /// <summary>
    /// Mirrors Backend → UpdateProfileDto
    /// PUT /api/userprofile
    /// </summary>
    [Serializable]
    public class UpdateProfileDto
    {
        public string firstName;
        public string lastName;
        public string email;
        public string jobTitle;
        public string language;
    }

    /// <summary>
    /// Mirrors Backend → ChangePasswordDto
    /// PUT /api/userprofile/password
    /// </summary>
    [Serializable]
    public class ChangePasswordDto
    {
        public string currentPassword;
        public string newPassword;
    }
}
