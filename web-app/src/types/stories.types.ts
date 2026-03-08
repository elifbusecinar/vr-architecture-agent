export const StoryType = {
    Recording: 0,
    Screenshot: 1,
    Panorama: 2,
    VoiceNote: 3
} as const;

export type StoryType = (typeof StoryType)[keyof typeof StoryType];

export interface Story {
    id: string;
    title: string;
    description?: string;
    type: StoryType;
    mediaUrl: string;
    projectId: string;
    ownerId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface CreateStoryDto {
    title: string;
    description?: string;
    type: StoryType;
    projectId: string;
    file: File;
}

export interface UpdateStoryDto {
    title: string;
    description?: string;
    isPublic: boolean;
}
