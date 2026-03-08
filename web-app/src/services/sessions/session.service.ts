import type { VRSession, SessionHistory } from '@/types/session.types';
import { MOCK_SESSIONS } from '@/services/mockData';

export const sessionService = {
    getActive: async (): Promise<VRSession[]> => {
        // Convert mock history to active session format if needed, but for demo we just return them
        return MOCK_SESSIONS as any;
    },

    getHistory: async (): Promise<SessionHistory[]> => {
        return MOCK_SESSIONS as any;
    },

    getProjectSessions: async (projectId: string): Promise<SessionHistory[]> => {
        return MOCK_SESSIONS.filter(s => s.projectId === projectId) as any;
    },

    startSession: async (projectId: string): Promise<VRSession> => {
        return {
            id: 's' + Date.now(),
            projectId,
            hostName: 'Architect Alex',
            startTime: new Date().toISOString(),
            participantCount: 1
        } as any;
    },

    endSession: async (sessionId: string): Promise<void> => {
        console.log('Ended session:', sessionId);
    },

    joinSession: async (sessionId: string, _isSpectator = false): Promise<void> => {
        console.log('Joined session:', sessionId);
    },

    requestVRStart: async (projectId: string): Promise<void> => {
        console.log('Requested VR start for:', projectId);
    }
};

