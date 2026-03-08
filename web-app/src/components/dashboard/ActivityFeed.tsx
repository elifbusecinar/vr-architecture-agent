import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useActivities } from '@/hooks/useActivities';
import { type ActivityType, ActivityTypeValues } from '@/types/activity.types';
import { EmptyState, TableRowSkeleton } from '@/components/common';

const getActivityIcon = (type: ActivityType) => {
    switch (type) {
        case ActivityTypeValues.AssetUploaded: return '\uD83D\uDCE6';
        case ActivityTypeValues.SessionStarted: return '\uD83E\uDD7D';
        case ActivityTypeValues.ProjectShared: return '\uD83D\uDD17';
        case ActivityTypeValues.ProjectDeleted: return '\uD83D\uDDD1\uFE0F';
        case ActivityTypeValues.StoryCreated: return '\uD83D\uDCF8';
        default: return '\u2728';
    }
};

export default function ActivityFeed() {
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { data: activityLogs, isLoading } = useActivities(currentWorkspaceId);

    return (
        <div className="panel">
            <div className="panel-top">
                <div className="panel-title">Workspace Activity</div>
                <span className="panel-meta">Live</span>
            </div>

            {isLoading ? (
                <TableRowSkeleton rows={3} />
            ) : (!activityLogs || activityLogs.length === 0) ? (
                <EmptyState
                    size="sm"
                    icon={'\u2728'}
                    title="No activity yet"
                    description="Actions like uploads, sessions, and shares will appear here."
                />
            ) : (
                activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="activity-row">
                        <div className="activity-icon-wrap">{getActivityIcon(log.type)}</div>
                        <div style={{ flex: 1 }}>
                            <div className="activity-msg">
                                {log.message} {log.projectTitle && <span>on <strong>{log.projectTitle}</strong></span>}
                            </div>
                            <div className="activity-time">
                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {log.userName}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
