export interface SessionParticipantInfo {
    userId: string;
    username: string;
}

export interface VRSession {
    id: string;
    projectId: string;
    projectTitle: string;
    hostId: string;
    hostName: string;
    startTime: string;
    isActive: boolean;
    participantCount: number;
    participants: SessionParticipantInfo[];
}

export interface SessionHistory {
    sessionId: string;
    projectTitle: string;
    startTime: string;
    durationMinutes?: number;
    totalParticipants: number;
}
