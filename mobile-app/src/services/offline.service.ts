import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SyncItem {
    id: string;
    url: string;
    method: string;
    data: any;
    timestamp: number;
}

class OfflineService {
    private isConnected: boolean = true;
    private syncQueue: SyncItem[] = [];
    private listeners: ((isConnected: boolean) => void)[] = [];

    constructor() {
        this.init();
    }

    private async init() {
        // Load existing queue
        const savedQueue = await AsyncStorage.getItem('@sync_queue');
        if (savedQueue) {
            this.syncQueue = JSON.parse(savedQueue);
        }

        // Subscribe to network changes
        NetInfo.addEventListener((state: NetInfoState) => {
            this.handleConnectivityChange(state.isConnected ?? false);
        });
    }

    private handleConnectivityChange(isConnected: boolean) {
        const wasDisconnected = !this.isConnected;
        this.isConnected = isConnected;

        this.listeners.forEach(l => l(isConnected));

        if (isConnected && wasDisconnected) {
            this.processQueue();
        }
    }

    public subscribe(listener: (isConnected: boolean) => void) {
        this.listeners.push(listener);
        listener(this.isConnected);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getIsConnected() {
        return this.isConnected;
    }

    public async addToQueue(item: Omit<SyncItem, 'id' | 'timestamp'>) {
        const newItem: SyncItem = {
            ...item,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
        };
        this.syncQueue.push(newItem);
        await this.saveQueue();
    }

    private async saveQueue() {
        await AsyncStorage.setItem('@sync_queue', JSON.stringify(this.syncQueue));
    }

    private async processQueue() {
        if (this.syncQueue.length === 0) return;

        console.log(`Processing sync queue: ${this.syncQueue.length} items`);
        // In a real implementation, we would loop through and retry these requests
        // For now, we just clear it to simulate successful sync
        this.syncQueue = [];
        await this.saveQueue();
    }

    public getQueue() {
        return this.syncQueue;
    }
}

export const offlineService = new OfflineService();
