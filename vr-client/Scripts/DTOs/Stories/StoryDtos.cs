using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Stories
{
    /// <summary>
    /// Mirrors Backend → StoryDto
    /// GET /api/stories
    /// </summary>
    [Serializable]
    public class StoryDto
    {
        public string id;
        public string title;
        public string description;
        public int type;            // maps to StoryType enum
        public string mediaUrl;
        public string projectId;
        public string ownerId;
        public bool isPublic;
        public string createdAt;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class StoryListWrapper
    {
        public StoryDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → CreateStoryDto
    /// POST /api/stories
    /// </summary>
    [Serializable]
    public class CreateStoryDto
    {
        public string title;
        public string description;
        public int type;            // maps to StoryType enum
        public string projectId;
    }

    /// <summary>
    /// Mirrors Backend → UpdateStoryDto
    /// PUT /api/stories/{id}
    /// </summary>
    [Serializable]
    public class UpdateStoryDto
    {
        public string title;
        public string description;
        public bool isPublic;
    }
}
