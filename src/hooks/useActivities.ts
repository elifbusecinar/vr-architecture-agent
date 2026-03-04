import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activities/activity.service';

export const useActivities = (workspaceId?: string) => {
    return useQuery({
        queryKey: ['activities', workspaceId],
        queryFn: () => activityService.getActivities(workspaceId)
    });
};

