export interface PublicProject {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    modelUrl: string;
    clientName: string;
    category: string;
    status: string;
    workspaceId?: string;
    workspaceName?: string;
}

export interface ShareResponse {
    projectId: string;
    shareToken: string;
    isPublic: boolean;
    shareUrl: string;
}

export const clientPortalService = {
    getPublicProject: async (_token: string): Promise<PublicProject> => {
        return {
            id: 'p1',
            title: 'Skyline Tower',
            description: 'Mocked',
            thumbnailUrl: null,
            modelUrl: '/models/skyline.glb',
            clientName: 'Skyline Realty',
            category: 'Skyscraper',
            status: 'VRActive'
        };
    },

    toggleSharing: async (projectId: string, isPublic: boolean): Promise<ShareResponse> => {
        return {
            projectId,
            shareToken: 'mock-token',
            isPublic,
            shareUrl: 'http://localhost:3000/portal/mock-token'
        };
    },

    getClientProjects: async (): Promise<PublicProject[]> => {
        return [];
    }
};
