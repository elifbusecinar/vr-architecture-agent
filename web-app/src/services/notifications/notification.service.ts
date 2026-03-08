import type { NotificationDto, NotificationPreferenceDto } from '@/types/notification.types';
import { MOCK_NOTIFICATIONS } from '@/services/mockData';

export const notificationService = {
    getNotifications: async (_count = 50): Promise<NotificationDto[]> => {
        return MOCK_NOTIFICATIONS as any;
    },

    getUnreadCount: async (): Promise<number> => {
        return MOCK_NOTIFICATIONS.filter(n => !n.read).length;
    },

    markAsRead: async (_id: string): Promise<void> => {
        console.log('Marked as read');
    },

    markAllAsRead: async (): Promise<void> => {
        console.log('Marked all as read');
    },

    getPreferences: async (): Promise<NotificationPreferenceDto[]> => {
        return [
            { type: 'SessionStarts', email: true, push: true },
            { type: 'NewComment', email: true, push: false },
            { type: 'ApprovalRequest', email: true, push: true }
        ] as any;
    },

    updatePreferences: async (_preferences: NotificationPreferenceDto[]): Promise<void> => {
        console.log('Updated preferences');
    }
};
