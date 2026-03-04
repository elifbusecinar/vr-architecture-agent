import { useSessions, useSessionHistory } from '@/hooks/useSessions';
import { EmptyState, TableRowSkeleton } from '@/components/common';

const AVATAR_COLORS = [
    'linear-gradient(135deg,#2D5BE3,#7C3AED)',
    'linear-gradient(135deg,#1A7A4A,#059669)',
    'linear-gradient(135deg,#D97706,#EA580C)',
    'linear-gradient(135deg,#DB2777,#9333EA)',
];

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export default function LiveSessions() {
    const { data: activeSessions, isLoading: sessionsLoading } = useSessions();
    const { data: historyData } = useSessionHistory();

    return (
        <div className="panel">
            <div className="panel-top">
                <div className="panel-title">Live Sessions</div>
                <span className="badge badge-live" style={{ fontSize: 10 }}>
                    <span className="badge-dot" />
                    {activeSessions?.length ?? 0} active
                </span>
            </div>

            {sessionsLoading ? (
                <TableRowSkeleton rows={2} />
            ) : (
                <>
                    {activeSessions?.map(session => (
                        <div key={session.id} className="session-row">
                            <div className="session-name">
                                {session.projectTitle}
                                <span className="tag">Live</span>
                            </div>
                            <div className="session-meta">{session.hostName} · {session.participantCount} participants</div>
                            <div className="avatar-stack">
                                <div
                                    className="avatar"
                                    title={session.hostName}
                                    style={{ background: AVATAR_COLORS[0] }}
                                >
                                    {getInitials(session.hostName)}
                                </div>
                                {session.participants?.slice(0, 3).map((p, i) => (
                                    <div
                                        key={p.userId}
                                        className="avatar"
                                        title={p.username}
                                        style={{ background: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length] }}
                                    >
                                        {getInitials(p.username)}
                                    </div>
                                ))}
                                {(session.participants?.length ?? 0) > 3 && (
                                    <div
                                        className="avatar"
                                        style={{
                                            background: 'var(--bg-inset)',
                                            color: 'var(--ink-2)',
                                            border: '1px solid var(--border-md)',
                                            fontSize: 9,
                                            fontWeight: 600
                                        }}
                                    >
                                        +{session.participants.length - 3}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(!activeSessions || activeSessions.length === 0) && historyData?.slice(0, 2).map(history => (
                        <div key={history.sessionId} className="session-row" style={{ opacity: 0.5 }}>
                            <div className="session-name">
                                {history.projectTitle}
                                <span className="tag" style={{ color: 'var(--ink-3)' }}>Ended</span>
                            </div>
                            <div className="session-meta">
                                {new Date(history.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {history.totalParticipants} participants
                            </div>
                            <div className="avatar-stack">
                                <div className="avatar" style={{ background: 'var(--bg-inset)', color: 'var(--ink-3)', border: '1px solid var(--border-md)' }}>?</div>
                            </div>
                        </div>
                    ))}

                    {(!activeSessions?.length && !historyData?.length) && (
                        <EmptyState
                            size="sm"
                            icon={'\uD83E\uDD7D'}
                            dashed
                            title="No sessions yet"
                            description="Start a VR session and invite clients to walk through your model together."
                            action={<button className="btn btn-primary">Start session</button>}
                            illustration={
                                <div className="ghost-timeline">
                                    <div className="gt-row"><div className="gt-dot" /><div className="gt-line" style={{ width: '60%' }} /></div>
                                    <div className="gt-row"><div className="gt-dot" /><div className="gt-line" style={{ width: '45%' }} /></div>
                                    <div className="gt-row"><div className="gt-dot" /><div className="gt-line" style={{ width: '70%' }} /></div>
                                </div>
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
}
