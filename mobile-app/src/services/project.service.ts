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

export const projectService = {
    getAll: async (workspaceId?: string, page = 1, limit = 12): Promise<{ data: Project[], total: number }> => {
        try {
            const config = workspaceId ? { params: { workspaceId, page, limit } } : { params: { page, limit } };
            const response = await axiosInstance.get('/projects', config);
            return response.data || { data: [], total: 0 };
        } catch (error) {
            console.error('Failed to fetch projects', error);
            // In a better architecture, we could throw custom errors for the UI to handle (e.g., offline)
            return { data: [], total: 0 };
        }
    },

    getById: async (id: string): Promise<Project | null> => {
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch project ${id}`, error);
            return null;
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
