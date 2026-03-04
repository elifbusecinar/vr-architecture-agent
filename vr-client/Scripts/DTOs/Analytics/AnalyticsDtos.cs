using System;
using UnityEngine;

namespace VRArchitecture.DTOs.Analytics
{
    /// <summary>
    /// Mirrors Backend → WorkspaceUsageDto
    /// GET /api/analytics
    /// </summary>
    [Serializable]
    public class WorkspaceUsageDto
    {
        public string workspaceId;
        public long storageUsedBytes;
        public long storageLimitBytes;
        public double storageUsedPercentage;
        public int totalModelsCount;
        public int totalModelsDelta;
        public int totalSessionsCount;
        public int totalSessionsDelta;
        public double totalVRDurationHours;
        public double totalVRDurationDelta;
        public int totalProjectsCount;
        public int totalProjectsDelta;
        public string lastUpdated;
    }
}
