import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notifications/notification.service';

export const useNotifications = (count = 50) => {
    return useQuery({
        queryKey: ['notifications', count],
        queryFn: () => notificationService.getNotifications(count),
        refetchInterval: 10000, // Check every 10 seconds
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationService.getUnreadCount,
        refetchInterval: 10000,
    });
};

export const useNotificationActions = () => {
    const queryClient = useQueryClient();

    const markAsRead = useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllAsRead = useMutation({
        mutationFn: notificationService.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    return { markAsRead, markAllAsRead };
};
