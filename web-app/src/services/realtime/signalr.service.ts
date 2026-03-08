export class SignalRService {
    async startConnection(_projectId: string, _callbacks: any) {
        console.log('Mock SignalR connection started');
    }

    async updatePresence(_projectId: string, _presenceData: any) { }
    async syncView(_projectId: string, _viewData: any) { }
    async sendUserMove(_projectId: string, _position: any, _rotation: any) { }
    async sendVoiceSignal(_projectId: string, _targetConnectionId: string, _signal: any) { }
    async summonParticipants(_projectId: string, _position: any, _label: string) { }
    async highlightObject(_projectId: string, _objectId: string, _active: boolean) { }
    async sendStroke(_projectId: string, _strokeData: any) { }
    async sendLaser(_projectId: string, _laserData: any) { }
    async sendSignal(_projectId: string, _targetConnectionId: string, _signalData: string) { }
    async stopConnection() { }
}

export const signalRService = new SignalRService();
