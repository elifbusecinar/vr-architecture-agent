import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projects/project.service';
import type { UpdateProjectDto } from '@/types/project.types';

export const useProjects = (workspaceId?: string, page = 1, limit = 12) => {
    return useQuery({
        queryKey: ['projects', workspaceId, page, limit],
        queryFn: () => projectService.getAll(workspaceId, page, limit),
        refetchInterval: 5000,
        enabled: !!workspaceId,
    });
};

export const useProjectDetail = (projectId: string) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => projectService.getDetail(projectId),
        enabled: !!projectId,
    });
};

export const useProjectActions = () => {
    const queryClient = useQueryClient();

    const updateProject = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateProjectDto }) =>
            projectService.update(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const deleteProject = useMutation({
        mutationFn: (id: string) => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const toggleSharing = useMutation({
        mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
            projectService.toggleSharing(id, isPublic),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });

    return { updateProject, deleteProject, toggleSharing };
};
