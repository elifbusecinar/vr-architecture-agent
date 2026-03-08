import { useState, useEffect } from 'react';
import { subscriptionService, type WorkspacePlanDetails } from '../services/subscriptions/subscription.service';

export function useSubscription(workspaceId?: string) {
    const [plan, setPlan] = useState<WorkspacePlanDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!workspaceId) return;

        const fetchPlan = async () => {
            setLoading(true);
            try {
                const data = await subscriptionService.getWorkspacePlan(workspaceId);
                setPlan(data);
            } catch (err) {
                setError('Failed to load subscription plan');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [workspaceId]);

    const isFeatureEnabled = (featureName: string) => {
        if (!plan) return false;
        if (plan.plan === 'Enterprise') return true;

        // Basic check: Free plan has no premium features
        if (plan.plan === 'Free') {
            const premiumFeatures = ['ExportGLB', 'BulkUpload', 'AdvancedAnalytics', 'ProjectSharing'];
            return !premiumFeatures.includes(featureName);
        }

        return true;
    };

    return { plan, loading, error, isFeatureEnabled };
}
