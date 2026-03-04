export interface PlanLimit {
    name: string;
    price: number;
    projects: number | string;
    storage: string;
    features: string[];
}

export interface WorkspacePlanDetails {
    plan: 'Free' | 'Pro' | 'Enterprise';
    maxProjects: number;
    maxStorageBytes: number;
    features: string[];
}

export const subscriptionService = {
    getWorkspacePlan: async (_workspaceId: string): Promise<WorkspacePlanDetails> => {
        return {
            plan: 'Pro',
            maxProjects: 20,
            maxStorageBytes: 10 * 1024 * 1024 * 1024,
            features: ['Unlimited VR', 'Archie AI Advisor', 'Team Collaboration']
        };
    },

    upgradePlan: async (_workspaceId: string, _plan: string): Promise<any> => {
        return { success: true };
    },

    getAllPlans: async (): Promise<PlanLimit[]> => {
        return [];
    }
};

