export class WebRTCService {
    public onStreamAdded?: (connectionId: string, stream: MediaStream) => void;
    public onStreamRemoved?: (connectionId: string) => void;

    async startLocalAudio(): Promise<MediaStream> {
        return new MediaStream();
    }

    stopLocalAudio() { }
    setMuted(_muted: boolean) { }
    async initiateCall(_projectId: string, _targetConnectionId: string) { }
    async handleSignalingData(_projectId: string, _senderConnectionId: string, _dataStr: string) { }
    public removePeer(_connectionId: string) { }
}

export const webrtcService = new WebRTCService();
