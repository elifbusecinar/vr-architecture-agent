export interface WorkspaceUsage {
    workspaceId: string;
    storageUsedBytes: number;
    storageLimitBytes: number;
    storageUsedPercentage: number;
    totalModelsCount: number;
    totalModelsDelta: number;
    totalSessionsCount: number;
    totalSessionsDelta: number;
    totalVRDurationHours: number;
    totalVRDurationDelta: number;
    totalProjectsCount: number;
    totalProjectsDelta: number;
    monthlyRevenue: number;
    revenueDelta: number;
    lastUpdated: string;
}
