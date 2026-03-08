import { MOCK_APPROVALS } from '@/services/mockData';
import type { Approval, CreateApprovalDto, ReviewApprovalDto } from '@/types/approval.types';

export const approvalService = {
    getProjectApprovals: async (projectId: string): Promise<Approval[]> => {
        return MOCK_APPROVALS.filter(a => a.projectId === projectId) as any;
    },

    createApproval: async (data: CreateApprovalDto): Promise<Approval> => {
        return {
            ...data,
            id: 'ap_' + Date.now(),
            projectId: 'p1',
            status: 'pending',
            createdAt: new Date().toISOString()
        } as any;
    },

    reviewApproval: async (id: string, data: ReviewApprovalDto): Promise<Approval> => {
        return {
            ...data,
            id,
            projectId: 'p1',
            status: data.status,
            createdAt: new Date().toISOString(),
            reviewedAt: new Date().toISOString(),
            reviewedByName: 'Demo User'
        } as any;
    }
};
