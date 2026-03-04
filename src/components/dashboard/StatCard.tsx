interface StatCardProps {
    label: string;
    value: string | number;
    delta?: string;
    deltaType?: 'up' | 'down' | 'neutral';
    metaText?: string;
    glowColor?: string;
}

export default function StatCard({
    label,
    value,
    delta,
    deltaType = 'up',
    metaText,
    glowColor = 'var(--ink)',
}: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="stat-card-label">{label}</div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-meta">
                {delta && <span className={`delta ${deltaType}`}>{delta}</span>}
                {metaText && <span>{metaText}</span>}
            </div>
            <div className="stat-card-glow" style={{ background: glowColor }} />
        </div>
    );
}
