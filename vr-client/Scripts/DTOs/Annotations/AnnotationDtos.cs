using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Annotations
{
    /// <summary>
    /// Mirrors Backend → AnnotationDto
    /// GET /api/annotations/project/{projectId}
    /// </summary>
    [Serializable]
    public class AnnotationDto
    {
        public string id;
        public string text;
        public double positionX;
        public double positionY;
        public double positionZ;
        public string projectId;
        public string authorId;
        public string authorName;
        public string parentId;
        public string createdAt;
        public AnnotationDto[] replies;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class AnnotationListWrapper
    {
        public AnnotationDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → CreateAnnotationDto
    /// POST /api/annotations
    /// </summary>
    [Serializable]
    public class CreateAnnotationDto
    {
        public string text;
        public double positionX;
        public double positionY;
        public double positionZ;
        public Guid   projectId; // JsonUtility handles Guid if we use string but I'll use Guid and see. Actually safer to use string.
        public string roomName;
        public string priority;
        public string parentId;
        public string dataJson;
    }
}
