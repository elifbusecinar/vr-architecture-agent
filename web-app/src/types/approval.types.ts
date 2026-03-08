export type ApprovalStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'revision';

export interface Approval {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: ApprovalStatus;
    createdBy: string;
    createdByName: string;
    reviewedBy?: string;
    reviewedByName?: string;
    createdAt: string;
    reviewedAt?: string;
    comment?: string;
}

export interface CreateApprovalDto {
    projectId: string;
    title: string;
    description?: string;
}

export interface ReviewApprovalDto {
    status: 'approved' | 'rejected' | 'revision';
    comment?: string;
}
