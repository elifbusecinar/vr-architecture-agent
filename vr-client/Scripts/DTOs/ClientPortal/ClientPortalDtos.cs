using System;
using UnityEngine;

namespace VRArchitecture.DTOs.ClientPortal
{
    /// <summary>
    /// Mirrors Backend → PublicProjectDto
    /// GET /api/clientportal/{shareToken}
    /// </summary>
    [Serializable]
    public class PublicProjectDto
    {
        public string id;
        public string title;
        public string description;
        public string thumbnailUrl;
        public string modelUrl;
        public string clientName;
        public string category;
        public string status;
        public string workspaceId;
    }

    /// <summary>
    /// Mirrors Backend → ShareResponseDto
    /// POST /api/projects/{id}/share
    /// </summary>
    [Serializable]
    public class ShareResponseDto
    {
        public string projectId;
        public string shareToken;
        public bool isPublic;
        public string shareUrl;
    }
}
