export type WorkspaceRole = 'Owner' | 'Editor' | 'Viewer';

export interface Workspace {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    projectCount: number;
}

export interface WorkspaceMember {
    userId: string;
    username: string;
    email: string;
    role: WorkspaceRole;
}

export interface Invitation {
    id: string;
    email: string;
    workspaceId: string;
    workspaceName: string;
    targetRole: WorkspaceRole;
    token: string;
    expiryDate: string;
    isAccepted: boolean;
}
