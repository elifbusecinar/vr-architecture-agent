using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Projects
{
    /// <summary>
    /// Mirrors Backend → ProjectListDto
    /// GET /api/projects, GET /api/projects/{id}
    /// </summary>
    [Serializable]
    public class ProjectListDto
    {
        public string id;
        public string title;
        public string description;
        public string modelUrl;
        public string thumbnailUrl;
        public string ownerId;
        public string clientName;
        public string category;
        public int status;          // maps to ProjectStatus enum
        public int progress;
        public string createdAt;
        public string updatedAt;
        public bool isPublic;
        public string shareToken;
        public string workspaceId;
        public float latitude;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// Usage: JsonUtility.FromJson&lt;ProjectListWrapper&gt;("{\"items\":" + json + "}")
    /// </summary>
    [Serializable]
    public class ProjectListWrapper
    {
        public ProjectListDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → CreateProjectDto
    /// POST /api/projects (multipart — metadata portion)
    /// </summary>
    [Serializable]
    public class CreateProjectDto
    {
        public string title;
        public string description;
        public string clientName;
        public string category;
        public string workspaceId;
    }

    /// <summary>
    /// Mirrors Backend → UpdateProjectDto
    /// PATCH /api/projects/{id}
    /// </summary>
    [Serializable]
    public class UpdateProjectDto
    {
        public string title;
        public string description;
        public string clientName;
        public string category;
    }

    /// <summary>
    /// Mirrors Backend → ModelLodDto
    /// </summary>
    [Serializable]
    public class ModelLodDto
    {
        public int level;
        public string url;
        public long size;
    }

    /// <summary>
    /// Mirrors Backend → ProjectDetailDto
    /// GET /api/projects/{id}/detail
    /// </summary>
    [Serializable]
    public class ProjectDetailDto : ProjectListDto
    {
        public ModelLodDto[] lods;
        // Other ProjectDetailDto specific fields (waypoints etc) can be added as needed.
    }
}
