import React from 'react';

interface TimelineEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'version' | 'approval' | 'milestone' | 'session';
    status?: 'completed' | 'pending' | 'planned';
}

interface ProjectTimelineProps {
    projectId: string;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId: _projectId }) => {
    // Mock data for versioning and milestone tracking
    const events: TimelineEvent[] = [
        { id: '1', title: 'Concept Design (v1)', description: 'Initial massing study and site integration.', date: '2026-02-10', type: 'version', status: 'completed' },
        { id: '2', title: 'Client Review Session', description: 'Interactive VR walkthrough with stakeholders.', date: '2026-02-12', type: 'session', status: 'completed' },
        { id: '3', title: 'Schematic Design (v2)', description: 'Updated layout based on client feedback.', date: '2026-02-18', type: 'version', status: 'completed' },
        { id: '4', title: 'Internal Approval', description: 'Design approved by lead architect.', date: '2026-02-20', type: 'approval', status: 'completed' },
        { id: '5', title: 'Detailed Design (v3)', description: 'Material selection and lighting study.', date: '2026-02-25', type: 'version', status: 'completed' },
        { id: '6', title: 'Final Client Approval', description: 'Pending final sign-off for construction docs.', date: '2026-03-15', type: 'milestone', status: 'pending' },
    ];

    return (
        <div className="timeline-container" style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 40, fontFamily: 'var(--serif)' }}>Project Evolution</h2>
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    left: 20,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: 'var(--border)',
                    zIndex: 0
                }} />

                {events.map((event, _index) => (
                    <div key={event.id} style={{
                        display: 'flex',
                        gap: 30,
                        marginBottom: 40,
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div style={{
                            width: 42,
                            height: 42,
                            borderRadius: '50%',
                            background: event.status === 'completed' ? 'var(--blue)' : 'var(--bg-card)',
                            border: `2px solid ${event.status === 'completed' ? 'var(--blue)' : 'var(--border)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {event.type === 'version' && '📦'}
                            {event.type === 'session' && '🥽'}
                            {event.type === 'approval' && '✅'}
                            {event.type === 'milestone' && '🏁'}
                        </div>
                        <div style={{
                            padding: 24,
                            background: 'var(--bg-card)',
                            borderRadius: 16,
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-md)',
                            flex: 1
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{
                                    fontSize: 10,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontWeight: 600,
                                    color: 'var(--ink-3)'
                                }}>{event.date}</span>
                                <span style={{
                                    fontSize: 10,
                                    padding: '2px 8px',
                                    borderRadius: 100,
                                    background: event.status === 'completed' ? 'var(--green-soft)' : 'var(--amber-soft)',
                                    color: event.status === 'completed' ? 'var(--green)' : 'var(--amber)',
                                    fontWeight: 600
                                }}>{event.status?.toUpperCase()}</span>
                            </div>
                            <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{event.title}</h4>
                            <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectTimeline;
