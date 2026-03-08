import type { Story, CreateStoryDto, UpdateStoryDto } from '@/types/stories.types';

const MOCK_STORIES: Story[] = [
    {
        id: 'story_1',
        title: 'Lobby Walkthrough',
        description: 'Guided tour of the main lobby and reception area.',
        url: '/videos/lobby.mp4',
        type: 0,
        projectId: 'p1',
        createdAt: '2026-02-01T10:00:00'
    },
    {
        id: 'story_2',
        title: 'Lighting Study',
        description: 'Analysis of natural light at different times of the day.',
        url: '/videos/lighting.mp4',
        type: 0,
        projectId: 'p1',
        createdAt: '2026-02-15T14:00:00'
    }
] as any;

export const storiesService = {
    create: async (_dto: CreateStoryDto): Promise<Story> => {
        return {
            id: 'story_' + Date.now(),
            title: 'New Story',
            description: '',
            url: '',
            type: 0,
            projectId: '',
            createdAt: new Date().toISOString()
        } as any;
    },

    getByProject: async (projectId: string): Promise<Story[]> => {
        return MOCK_STORIES.filter(s => s.projectId === projectId);
    },

    getByUser: async (): Promise<Story[]> => {
        return MOCK_STORIES;
    },

    getById: async (id: string): Promise<Story> => {
        return MOCK_STORIES.find(s => s.id === id) || MOCK_STORIES[0];
    },

    update: async (_id: string, _dto: UpdateStoryDto): Promise<{ message: string }> => {
        return { message: 'Updated' };
    },

    delete: async (_id: string): Promise<{ message: string }> => {
        return { message: 'Deleted' };
    },
};
