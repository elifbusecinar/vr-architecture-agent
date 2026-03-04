export type ProjectStatus = 'Draft' | 'Processing' | 'Ready' | 'VRReady' | 'InReview' | 'Approved' | 'VRActive';

export interface Project {
    id: string;
    title: string;
    description: string;
    modelUrl: string;
    thumbnailUrl?: string;
    ownerId: string;
    clientName: string;
    category: string;
    status: ProjectStatus;
    progress: number;
    deadline?: string;
    createdAt: string;
    updatedAt?: string;
    shareToken?: string;
    isPublic?: boolean;
    workspaceId?: string;
}

export interface ProjectWaypoint {
    id: string;
    title: string;
    description?: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    yaw: number;
    pitch: number;
}

export interface ProjectAsset {
    id: string;
    fileName: string;
    url: string;
    versionNumber: number;
    createdAt: string;
}

export interface ProjectDetail extends Project {
    waypoints: ProjectWaypoint[];
    assets: ProjectAsset[];
}

export interface ProjectsResponse {
    data: Project[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateProjectDto {
    title: string;
    description: string;
    workspaceId: string;
    category: string;
    clientName: string;
    deadline?: string;
}

export interface UpdateProjectDto {
    title?: string;
    description?: string;
    status?: ProjectStatus;
    category?: string;
    clientName?: string;
    deadline?: string;
}

export interface ProjectWaypointDto {
    title: string;
    description?: string;
    positionX: number;
    positionY: number;
    positionZ: number;
    yaw: number;
    pitch: number;
}
