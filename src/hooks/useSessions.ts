import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/sessions/session.service';

export const useSessions = () => {
    return useQuery({
        queryKey: ['sessions', 'active'],
        queryFn: () => sessionService.getActive(),
        refetchInterval: 10000, // Refetch every 10 seconds for "Live" feel
    });
};

export const useSessionHistory = () => {
    return useQuery({
        queryKey: ['sessions', 'history'],
        queryFn: () => sessionService.getHistory(),
    });
};

export const useSessionActions = () => {
    const queryClient = useQueryClient();

    const startSession = useMutation({
        mutationFn: (projectId: string) => sessionService.startSession(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    const endSession = useMutation({
        mutationFn: (sessionId: string) => sessionService.endSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    const joinSession = useMutation({
        mutationFn: (sessionId: string) => sessionService.joinSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    return { startSession, endSession, joinSession };
};
