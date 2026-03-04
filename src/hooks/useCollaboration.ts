import { useEffect, useState } from 'react';
import { signalRService } from '@/services/realtime/signalr.service';
import type { Annotation } from '@/types/annotation.types';

export type ActiveUser = { connectionId: string; userName: string; isSpeaking?: boolean };

export function useCollaboration(
    projectId: string | undefined,
    callbacks: {
        onAnnotationCreated: (annotation: Annotation) => void;
        onAnnotationDeleted: (id: string) => void;
        onUserJoined?: (connectionId: string, userName: string) => void;
        onUserLeft?: (connectionId: string) => void;
        onPresenceUpdated?: (connectionId: string, userName: string) => void;
        onViewSynced?: (view: any) => void;
        onPresenterChanged?: (id: string) => void;
        onPresenterRemoved?: (id: string) => void;
        onUserMoved?: (connectionId: string, position: any, rotation: any) => void;
        onVoiceSignal?: (connectionId: string, signal: any) => void;
        onSignal?: (senderId: string, signalData: string) => void;
    }
) {
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

    useEffect(() => {
        if (!projectId) return;

        const wrappedCallbacks = {
            ...callbacks,
            onUserJoined: (connId: string, name: string) => {
                setActiveUsers(prev => {
                    if (prev.some(u => u.connectionId === connId)) return prev;
                    return [...prev, { connectionId: connId, userName: name, isSpeaking: false }];
                });
                callbacks.onUserJoined?.(connId, name);
            },
            onUserLeft: (connId: string) => {
                setActiveUsers(prev => prev.filter(u => u.connectionId !== connId));
                callbacks.onUserLeft?.(connId);
            },
            onPresenceUpdated: (connId: string, name: string) => {
                setActiveUsers(prev => {
                    const exists = prev.find(u => u.connectionId === connId);
                    if (exists) return prev.map(u => u.connectionId === connId ? { ...u, userName: name } : u);
                    return [...prev, { connectionId: connId, userName: name, isSpeaking: false }];
                });
                callbacks.onPresenceUpdated?.(connId, name);
            },
            onVoiceSignal: (connId: string, signal: any) => {
                if (signal.type === 'speak-start' || signal.type === 'speak-end') {
                    setActiveUsers(prev => prev.map(u =>
                        u.connectionId === connId ? { ...u, isSpeaking: signal.type === 'speak-start' } : u
                    ));
                }
                callbacks.onVoiceSignal?.(connId, signal);
            }
        };

        signalRService.startConnection(projectId, wrappedCallbacks as any);

        return () => {
            signalRService.stopConnection();
        };
    }, [projectId]);

    return { activeUsers };
}

export const updatePresence = (projectId: string, presence: any) => signalRService.updatePresence(projectId, presence);
export const syncView = (projectId: string, view: any) => signalRService.syncView(projectId, view);
export const sendUserMove = (projectId: string, pos: any, rot: any) => signalRService.sendUserMove(projectId, pos, rot);
export const sendVoiceSignal = (projectId: string, targetId: string, signal: any) => signalRService.sendVoiceSignal(projectId, targetId, signal);
export const summonParticipants = (projectId: string, pos: { x: number; y: number; z: number }, label: string) => signalRService.summonParticipants(projectId, pos, label);
export const highlightObject = (projectId: string, objectId: string, active: boolean) => signalRService.highlightObject(projectId, objectId, active);
export const sendStroke = (projectId: string, strokeData: any) => signalRService.sendStroke(projectId, strokeData);
export const sendLaser = (projectId: string, laserData: any) => signalRService.sendLaser(projectId, laserData);

