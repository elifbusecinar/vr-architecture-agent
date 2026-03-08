import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Behavior when notifications are received while app is running foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    async requestPermissions() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return false;
        }
        return true;
    },

    async sendLocalNotification(title: string, body: string, data: any = {}) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: null, // deliver immediately
        });
    }
};
