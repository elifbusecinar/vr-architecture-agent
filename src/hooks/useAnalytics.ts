import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analytics/analytics.service';
import type { WorkspaceUsage } from '../types/analytics.types';

export function useAnalytics(workspaceId: string | undefined) {
    const [data, setData] = useState<WorkspaceUsage | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!workspaceId) return;
        setLoading(true);
        try {
            const usage = await analyticsService.getWorkspaceUsage(workspaceId);
            setData(usage);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [workspaceId]);

    return { data, loading, error, refresh: fetchData };
}
