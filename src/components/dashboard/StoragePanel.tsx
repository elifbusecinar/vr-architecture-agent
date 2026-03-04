import { useAnalytics } from '@/hooks/useAnalytics';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useSubscription } from '@/hooks/useSubscription';
import { Banner } from '@/components/common';
import { StatCardSkeleton } from '@/components/common';

export default function StoragePanel() {
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { data: analytics, loading: analyticsLoading } = useAnalytics(currentWorkspaceId);
    const { plan, loading: planLoading } = useSubscription(currentWorkspaceId);

    if (analyticsLoading || planLoading) {
        return (
            <div className="panel">
                <div className="panel-top">
                    <div className="panel-title">Storage & Quotas</div>
                </div>
                <div style={{ padding: 16 }}>
                    <StatCardSkeleton />
                </div>
            </div>
        );
    }

    const usedGB = analytics ? (analytics.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1) : '0';
    const limitGB = analytics ? (analytics.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(1) : '1';
    const percentage = analytics?.storageUsedPercentage ?? 0;

    const circumference = 301.6;
    const offset = circumference - (percentage / 100) * circumference;

    const storageItems = [
        { label: 'Total Used', amount: `${usedGB} GB`, color: '#1A1917' },
        { label: 'Free Space', amount: `${(Number(limitGB) - Number(usedGB)).toFixed(1)} GB`, color: '#1A7A4A', isGreen: true },
        { label: 'SaaS Limit', amount: `${limitGB} GB`, color: '#ECEAE4', isGray: true },
    ];

    return (
        <div className="panel">
            {percentage >= 80 && (
                <Banner variant="warning" actionLabel="Upgrade plan">
                    Storage at {percentage}% capacity. You have {(Number(limitGB) - Number(usedGB)).toFixed(1)} GB remaining.
                </Banner>
            )}
            <div className="panel-top">
                <div className="panel-title">Storage & Quotas</div>
                <span className="tag">Plan: {plan?.plan ?? 'Free'}</span>
            </div>
            <div className="storage-donut-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#ECEAE4" strokeWidth="10" />
                    <circle
                        cx="60" cy="60" r="48"
                        fill="none" stroke="#1A1917" strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="donut-center">
                    <div className="donut-pct">{percentage}%</div>
                    <div className="donut-label">Used</div>
                </div>
            </div>
            <div style={{ padding: '0 18px 14px' }}>
                {storageItems.map((item) => (
                    <div key={item.label} className="storage-row">
                        <span className="storage-type">
                            <span className="storage-type-dot" style={{ background: item.color }} />
                            {item.label}
                        </span>
                        <span className="storage-amt" style={item.isGreen ? { color: 'var(--green)' } : item.isGray ? { color: 'var(--ink-light)' } : undefined}>
                            {item.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
