import { MOCK_ACTIVITIES } from '@/services/mockData';
import type { ActivityLog } from '@/types/activity.types';

export const activityService = {
    getActivities: async (_workspaceId?: string): Promise<ActivityLog[]> => {
        return MOCK_ACTIVITIES as any;
    }
};
