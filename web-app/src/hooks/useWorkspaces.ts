import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '@/services/workspaces/workspace.service';
import type { WorkspaceRole } from '@/types/workspace.types';

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: workspaceService.getUserWorkspaces,
    });
};

export const useWorkspaceMembers = (workspaceId: string | undefined) => {
    return useQuery({
        queryKey: ['workspace', workspaceId, 'members'],
        queryFn: () => workspaceService.getMembers(workspaceId!),
        enabled: !!workspaceId,
    });
};

export const useWorkspaceActions = () => {
    const queryClient = useQueryClient();

    const createWorkspace = useMutation({
        mutationFn: ({ name, description }: { name: string; description: string }) =>
            workspaceService.createWorkspace(name, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
        },
    });

    const inviteMember = useMutation({
        mutationFn: ({ email, workspaceId, role }: { email: string; workspaceId: string; role: WorkspaceRole }) =>
            workspaceService.inviteMember(email, workspaceId, role),
        onSuccess: (_, variables) => {
            // Invalidate members list although invitation is pending, logic might differ later
            queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId, 'members'] });
        },
    });

    return { createWorkspace, inviteMember };
};
