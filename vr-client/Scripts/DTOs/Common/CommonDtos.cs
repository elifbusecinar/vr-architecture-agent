using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Common
{
    /// <summary>
    /// Generic API error response
    /// </summary>
    [Serializable]
    public class ApiErrorResponse
    {
        public string message;
        public string error;
        public string details;
    }

    /// <summary>
    /// Generic API message response
    /// </summary>
    [Serializable]
    public class ApiMessageResponse
    {
        public string message;
    }
}
