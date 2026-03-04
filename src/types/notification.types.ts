export interface NotificationDto {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    projectId?: string;
    workspaceId?: string;
    createdAt: string;
}

export interface NotificationPreferenceDto {
    key: string;
    enabled: boolean;
}

export interface UpdatePreferencesDto {
    preferences: NotificationPreferenceDto[];
}
