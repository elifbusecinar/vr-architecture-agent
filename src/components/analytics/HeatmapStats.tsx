import React, { useEffect, useState } from 'react';
import './HeatmapStats.css';

interface HeatmapStatsProps {
    projectId: string;
}

interface RoomStat {
    name: string;
    seconds: number;
    points: number;
}

const HeatmapStats: React.FC<HeatmapStatsProps> = ({ projectId }) => {
    const [stats, setStats] = useState<RoomStat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Point 6: Heatmap Analysis Depth - Time-per-Room stats
                const response = await fetch(`/api/analytics/${projectId}/room-stats`);
                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to load heatmap stats:", err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchStats();
    }, [projectId]);

    if (loading) return <div>Loading analysis...</div>;

    const totalTime = stats.reduce((acc, s) => acc + s.seconds, 0);

    return (
        <div className="heatmap-stats-card">
            <h4 className="hs-title">Engagement Analysis (Heatmap Depth)</h4>
            <div className="hs-list">
                {stats.map(s => (
                    <div key={s.name} className="hs-item">
                        <div className="hs-info">
                            <span className="hs-name">{s.name}</span>
                            <span className="hs-time">{(s.seconds / 60).toFixed(1)} mins</span>
                        </div>
                        <div className="hs-bar-bg">
                            <div className="hs-bar-fill" style={{ width: `${(s.seconds / totalTime) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
            {stats.length === 0 && <div className="hs-empty">No engagement data recorded.</div>}
        </div>
    );
};

export default HeatmapStats;
