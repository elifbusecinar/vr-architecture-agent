export type ActivityType =
    | 0 // ProjectCreated
    | 1 // ProjectUpdated
    | 2 // ProjectDeleted
    | 3 // AssetUploaded
    | 4 // AssetVersioned
    | 5 // SessionStarted
    | 6 // SessionEnded
    | 7 // ProjectShared
    | 8 // ProjectUnshared
    | 9 // ProjectStatusChanged
    | 10 // StoryCreated
    | 11 // StoryDeleted
    | 12; // CommentAdded

export const ActivityTypeValues = {
    ProjectCreated: 0,
    ProjectUpdated: 1,
    ProjectDeleted: 2,
    AssetUploaded: 3,
    AssetVersioned: 4,
    SessionStarted: 5,
    SessionEnded: 6,
    ProjectShared: 7,
    ProjectUnshared: 8,
    ProjectStatusChanged: 9,
    StoryCreated: 10,
    StoryDeleted: 11,
    CommentAdded: 12
} as const;

export interface ActivityLog {
    id: string;
    type: ActivityType;
    message: string;
    userId: string;
    userName: string;
    projectId?: string;
    projectTitle?: string;
    workspaceId?: string;
    workspaceName?: string;
    createdAt: string;
}
