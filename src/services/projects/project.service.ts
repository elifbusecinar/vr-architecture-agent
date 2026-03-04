import { MOCK_PROJECTS, MOCK_PROJECT_DETAIL } from '@/services/mockData';
import type {
    Project,
    ProjectsResponse,
    ProjectDetail,
    CreateProjectDto,
    UpdateProjectDto,
    ProjectWaypoint,
    ProjectWaypointDto
} from '@/types/project.types';

export const projectService = {
    getAll: async (_workspaceId?: string, _page = 1, _limit = 12): Promise<ProjectsResponse> => {
        return MOCK_PROJECTS;
    },

    getById: async (id: string): Promise<Project> => {
        const found = MOCK_PROJECTS.data.find(p => p.id === id);
        return found || MOCK_PROJECTS.data[0];
    },

    getDetail: async (id: string): Promise<ProjectDetail> => {
        if (id === 'p1') {
            return MOCK_PROJECT_DETAIL;
        }
        return { ...MOCK_PROJECTS.data[0], waypoints: [], assets: [] };
    },

    upload: async (_dto: CreateProjectDto, _file: File, _onProgress?: (percent: number) => void): Promise<Project> => {
        return MOCK_PROJECTS.data[0];
    },

    update: async (id: string, dto: UpdateProjectDto): Promise<void> => {
        console.log('Update project:', id, dto);
    },

    delete: async (id: string): Promise<void> => {
        console.log('Delete project:', id);
    },

    toggleSharing: async (_id: string, isPublic: boolean): Promise<{ shareToken: string; isPublic: boolean }> => {
        return { shareToken: 'mock-share-token', isPublic };
    },

    // Waypoint Management
    addWaypoint: async (_projectId: string, dto: ProjectWaypointDto): Promise<ProjectWaypoint> => {
        return { id: 'new-wp', ...dto };
    },

    deleteWaypoint: async (waypointId: string): Promise<void> => {
        console.log('Delete waypoint:', waypointId);
    }
};

