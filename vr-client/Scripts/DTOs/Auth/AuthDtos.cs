using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Auth
{
    /// <summary>
    /// Mirrors Backend → LoginDto
    /// POST /api/auth/login
    /// </summary>
    [Serializable]
    public class LoginDto
    {
        public string email;
        public string password;
    }

    /// <summary>
    /// Mirrors Backend → RegisterDto
    /// POST /api/auth/register
    /// </summary>
    [Serializable]
    public class RegisterDto
    {
        public string username;
        public string email;
        public string password;
        public string role;
    }

    /// <summary>
    /// Response from Login / Register endpoints
    /// </summary>
    [Serializable]
    public class AuthResponseDto
    {
        public string token;
        public string message;
    }
}
