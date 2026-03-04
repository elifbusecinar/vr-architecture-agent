import type { WorkspaceUsage } from '../../types/analytics.types';

export interface HeatmapPoint {
    x: number;
    y: number;
    z: number;
}

export interface ProcessedHeatmapCell {
    x: number;
    z: number;
    avgY: number;
    intensity: number;
}

export interface RoomStat {
    name: string;
    points: number;
    seconds: number;
    percentage: number;
}

const getWorkspaceUsage = async (workspaceId: string): Promise<WorkspaceUsage> => {
    return {
        workspaceId,
        storageUsedBytes: 45.2 * 1024 * 1024 * 1024,
        storageLimitBytes: 100 * 1024 * 1024 * 1024,
        storageUsedPercentage: 45.2,
        totalModelsCount: 24,
        totalModelsDelta: 3,
        totalSessionsCount: 156,
        totalSessionsDelta: 12,
        totalVRDurationHours: 84,
        totalVRDurationDelta: 8,
        totalProjectsCount: 5,
        totalProjectsDelta: 1,
        monthlyRevenue: 1250,
        revenueDelta: 200,
        lastUpdated: new Date().toISOString()
    };
};

const recalculateUsage = async (_workspaceId: string): Promise<void> => {
    console.log('Recalculated usage');
};

const getHeatmapPoints = async (_projectId: string): Promise<HeatmapPoint[]> => {
    return [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 1 },
        { x: -1, y: 0, z: 2 },
        { x: 2, y: 0, z: -1 }
    ];
};

const getProcessedHeatmap = async (_projectId: string, _gridSize = 1.0): Promise<ProcessedHeatmapCell[]> => {
    return [
        { x: 0, z: 0, avgY: 0, intensity: 0.8 },
        { x: 1, z: 1, avgY: 0, intensity: 0.5 },
        { x: -1, z: 2, avgY: 0, intensity: 0.3 },
        { x: 2, z: -1, avgY: 0, intensity: 0.9 }
    ];
};

const getRoomStats = async (_projectId: string): Promise<RoomStat[]> => {
    return [
        { name: 'Grand Lobby', points: 1500, seconds: 4500, percentage: 35 },
        { name: 'Showroom Alpha', points: 1200, seconds: 3600, percentage: 28 },
        { name: 'Executive Suite', points: 800, seconds: 2400, percentage: 19 },
        { name: 'Common Area', points: 760, seconds: 2280, percentage: 18 }
    ];
};

export const analyticsService = {
    getWorkspaceUsage,
    recalculateUsage,
    getHeatmapPoints,
    getProcessedHeatmap,
    getRoomStats,
};
