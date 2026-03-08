import type { Workspace, WorkspaceMember, Invitation, WorkspaceRole } from '@/types/workspace.types';

const MOCK_WORKSPACES: Workspace[] = [
    { id: 'w1', name: 'Elite Architectural Studio', description: 'Core team workspace for premium VR projects.', memberCount: 8, projectCount: 5 },
    { id: 'w2', name: 'Innovation Hub', description: 'R&D workspace for experimental designs.', memberCount: 3, projectCount: 2 }
];

const MOCK_MEMBERS: WorkspaceMember[] = [
    { userId: 'u1', username: 'Architect Alex', email: 'architect@studio.com', role: 'Owner' },
    { userId: 'u2', username: 'Designer Mia', email: 'mia@studio.com', role: 'Editor' },
    { userId: 'u3', username: 'Structural Sam', email: 'sam@studio.com', role: 'Editor' },
    { userId: 'u4', username: 'Client John', email: 'john@client.com', role: 'Viewer' }
];

export const workspaceService = {
    getUserWorkspaces: async (): Promise<Workspace[]> => {
        return MOCK_WORKSPACES;
    },

    getById: async (id: string): Promise<Workspace> => {
        return MOCK_WORKSPACES.find(w => w.id === id) || MOCK_WORKSPACES[0];
    },

    getMembers: async (_workspaceId: string): Promise<WorkspaceMember[]> => {
        return MOCK_MEMBERS;
    },

    createWorkspace: async (name: string, description: string): Promise<Workspace> => {
        return { id: 'w' + Date.now(), name, description, memberCount: 1, projectCount: 0 };
    },

    inviteMember: async (email: string, workspaceId: string, targetRole: WorkspaceRole): Promise<Invitation> => {
        return {
            id: 'inv_' + Date.now(),
            email,
            workspaceId,
            workspaceName: 'Elite Studio',
            targetRole,
            token: 'mock-invite-token',
            expiryDate: new Date(Date.now() + 86400000).toISOString(),
            isAccepted: false
        };
    },

    acceptInvitation: async (_token: string): Promise<void> => {
        console.log('Accepted invitation');
    }
};
