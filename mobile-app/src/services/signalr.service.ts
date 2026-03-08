import * as signalR from '@microsoft/signalr';
import { config } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from './notification.service';

class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private hubUrl: string;
    private presenceCallback: ((data: any) => void) | null = null;

    constructor() {
        this.hubUrl = config.api.baseURL.replace('/api', '') + '/hubs/project';
    }

    onPresenceUpdate(callback: (data: any) => void) {
        this.presenceCallback = callback;
    }

    async startConnection(projects: string[]) {
        if (this.connection) {
            await this.stopConnection();
        }

        const token = await AsyncStorage.getItem('@access_token');

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                accessTokenFactory: () => token || ''
            })
            .withAutomaticReconnect()
            .build();

        // Listen for interesting global/project events to trigger notifications
        this.connection.on('AnnotationReceived', (annotation: any) => {
            notificationService.sendLocalNotification(
                'New Annotation',
                `A comment was placed on project: ${annotation?.projectId || 'Interactive View'}`,
                { projectId: annotation?.projectId }
            );
        });

        this.connection.on('UserJoined', (data: any) => {
            notificationService.sendLocalNotification(
                'Live Session Started',
                `${data.UserName || 'An architect'} has entered the VR space.`,
                {}
            );
            if (this.presenceCallback) this.presenceCallback({ type: 'join', ...data });
        });

        this.connection.on('PresenceUpdate', (data: any) => {
            if (this.presenceCallback) this.presenceCallback(data);
        });

        this.connection.on('OnSummon', (jsonSummon: string) => {
            try {
                const data = JSON.parse(jsonSummon);
                notificationService.sendLocalNotification(
                    'Summoned!',
                    `You are being called to ${data.label || 'a specific point'}.`,
                    {}
                );
            } catch (e) { }
        });

        try {
            await this.connection.start();
            console.log('Mobile SignalR connected to ProjectHub');

            for (const pid of projects) {
                await this.connection.invoke('JoinProject', pid).catch(() => { });
            }

        } catch (err) {
            console.error('SignalR connection failed:', err);
        }
    }

    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
        }
    }
}

export const signalRService = new SignalRService();
