using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Assets
{
    /// <summary>
    /// Mirrors Backend → AssetDto
    /// GET /api/assets
    /// </summary>
    [Serializable]
    public class AssetDto
    {
        public string id;
        public string fileName;
        public string url;
        public string extension;
        public long sizeInBytes;
        public int type;            // maps to AssetType enum
        public int versionNumber;
        public bool isCurrentVersion;
        public string projectId;
        public string projectTitle;
        public string createdAt;
    }

    /// <summary>
    /// Wrapper to deserialize JSON arrays via JsonUtility.
    /// </summary>
    [Serializable]
    public class AssetListWrapper
    {
        public AssetDto[] items;
    }

    /// <summary>
    /// Mirrors Backend → AssetSearchDto
    /// Used as query parameters for searching assets.
    /// </summary>
    [Serializable]
    public class AssetSearchDto
    {
        public string query;
        public int type;            // maps to AssetType enum (-1 = no filter)
        public string projectId;
        public string workspaceId;
    }
}
