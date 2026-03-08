import axiosInstance from '../api/axiosInstance';

export interface Project {
    id: string;
    title: string;
    description: string;
    modelUrl: string;
    thumbnailUrl?: string;
    ownerId: string;
    clientName: string;
    category: string;
    status: string;
    progress: number;
    createdAt: string;
    updatedAt?: string;
    workspaceId?: string;
}

export interface ProjectDetail extends Project {
    metadata?: Record<string, any>;
    annotationsCount: number;
    sessionsCount: number;
    lastActiveSession?: string;
}

const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Skyline Tower',
        description: 'Mixed-use skyscraper with sustainable facade.',
        modelUrl: 'https://example.com/models/skyline.glb',
        ownerId: 'u1',
        clientName: 'Global Heights Group',
        category: 'Commercial',
        status: 'In Progress',
        progress: 75,
        createdAt: new Date().toISOString()
    },
    {
        id: 'p2',
        title: 'Villa Redux',
        description: 'Modern residential complex renovation.',
        modelUrl: 'https://example.com/models/villa.glb',
        ownerId: 'u1',
        clientName: 'Private Client',
        category: 'Residential',
        status: 'Review',
        progress: 90,
        createdAt: new Date().toISOString()
    }
];

export const projectService = {
    getAll: async (workspaceId?: string, page = 1, limit = 12): Promise<{ data: Project[], total: number }> => {
        try {
            const config = workspaceId ? { params: { workspaceId, page, limit } } : { params: { page, limit } };
            const response = await axiosInstance.get('/projects', config);
            return response.data || { data: MOCK_PROJECTS, total: MOCK_PROJECTS.length };
        } catch (error) {
            console.error('Failed to fetch projects, using mocks', error);
            return { data: MOCK_PROJECTS, total: MOCK_PROJECTS.length };
        }
    },

    getById: async (id: string): Promise<Project | null> => {
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response.data;
        } catch (error) {
            return MOCK_PROJECTS.find(p => p.id === id) || null;
        }
    },

    getDetail: async (id: string): Promise<ProjectDetail | null> => {
        try {
            const response = await axiosInstance.get(`/projects/${id}/detail`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch project detail for ${id}`, error);
            return null;
        }
    }
};
