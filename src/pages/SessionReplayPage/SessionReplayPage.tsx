import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useWorkspaces } from '@/hooks/useWorkspaces';

export default function SessionReplayPage() {
    const { data: workspaces } = useWorkspaces();
    const currentWorkspaceId = workspaces?.[0]?.id;
    const { isFeatureEnabled } = useSubscription(currentWorkspaceId);
    const canShare = isFeatureEnabled('ProjectSharing');
    const canExport = isFeatureEnabled('AdvancedAnalytics'); // PDF report is advanced

    const [playing, setPlaying] = useState(false);
    const [activeSpeed, setActiveSpeed] = useState('1×');
    const [activeUserFilter, setActiveUserFilter] = useState('All users');

    const speeds = ['0.5×', '1×', '2×', '4×'];

    const userFilters = [
        { name: 'All users', color: '#60A5FA' },
        { name: 'Ahmet K. (Architect)', color: '#60A5FA' },
        { name: 'Martin & Co. (Client)', color: '#34D399' },
        { name: 'Elif K. (Designer)', color: '#F472B6' },
    ];

    return (
        <div className="page">
            {/* ─── SESSION SELECTOR ─── */}
            <div className="session-selector">
                <div className="ss-item active">
                    <div className="ss-dot" style={{ background: '#2D5BE3' }} />
                    <div>
                        <div className="ss-name">Session #3 — Skyline Tower</div>
                        <div className="ss-date">Feb 19, 2026 · 14:30</div>
                    </div>
                    <span className="chip chip-blue">Current</span>
                </div>
                <div className="ss-item">
                    <div className="ss-dot" style={{ background: 'var(--ink-3)' }} />
                    <div>
                        <div className="ss-name">Session #2 — Skyline Tower</div>
                        <div className="ss-date">Feb 12, 2026 · 10:15</div>
                    </div>
                </div>
                <div className="ss-item">
                    <div className="ss-dot" style={{ background: 'var(--ink-3)' }} />
                    <div>
                        <div className="ss-name">Session #1 — Skyline Tower</div>
                        <div className="ss-date">Feb 5, 2026 · 16:00</div>
                    </div>
                </div>
                <div className="ss-item" style={{ borderStyle: 'dashed' }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>⊕ Compare sessions</span>
                </div>
            </div>

            {/* ─── SESSION HEADER ─── */}
            <div className="session-header">
                <div>
                    <div className="sh-eyebrow">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                            Session completed
                        </span>
                        <span style={{ color: 'var(--border-md)' }}>·</span>
                        <span>Feb 19, 2026 at 14:30</span>
                    </div>
                    <h1 className="sh-title">Skyline Tower — <em>Client Review #3</em></h1>
                    <div className="sh-meta">
                        <div className="sh-meta-item">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" /></svg>
                            47 min 12 sec
                        </div>
                        <div className="sh-meta-item">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="3" /><path d="M1 14c0-3 2-5 5-5M11 11l2 2 3-3" /></svg>
                            3 participants
                        </div>
                        <div className="sh-meta-item">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12M8 2l6 6-6 6" /></svg>
                            Meta Quest 3
                        </div>
                        <span className="chip chip-green">✓ Client approved</span>
                    </div>
                </div>
                <div className="sh-actions">
                    <button className="btn btn-secondary">⊞ View model</button>
                    <button
                        className={`btn btn-secondary ${!canShare ? 'locked' : ''}`}
                        disabled={!canShare}
                        onClick={canShare ? () => alert('Sending to client...') : undefined}
                    >
                        {!canShare && <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 6 }}><path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3zM6 4a2 2 0 1 1 4 0v2H6V4z" /></svg>}
                        ✉ Send to client {!canShare && '(PRO)'}
                    </button>
                </div>
            </div>

            {/* ─── KPI ROW ─── */}
            <div className="kpi-row">
                <div className="kpi">
                    <div className="kpi-label">Total duration</div>
                    <div className="kpi-val">47:12</div>
                    <div className="kpi-sub"><span className="chip chip-green">↑ +8 min</span> vs session #2</div>
                    <div className="kpi-accent" style={{ background: 'var(--green)' }} />
                </div>
                <div className="kpi">
                    <div className="kpi-label">Zones visited</div>
                    <div className="kpi-val">7/8</div>
                    <div className="kpi-sub"><span className="chip chip-amber">Rooftop</span> not visited</div>
                    <div className="kpi-accent" style={{ background: 'var(--amber)' }} />
                </div>
                <div className="kpi">
                    <div className="kpi-label">Annotations left</div>
                    <div className="kpi-val">9</div>
                    <div className="kpi-sub"><span className="chip chip-red">3 revision</span> <span className="chip chip-blue">6 note</span></div>
                    <div className="kpi-accent" style={{ background: 'var(--blue)' }} />
                </div>
                <div className="kpi">
                    <div className="kpi-label">Peak engagement</div>
                    <div className="kpi-val">Living</div>
                    <div className="kpi-sub" style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>14:07 of 47:12 spent</div>
                    <div className="kpi-accent" style={{ background: 'var(--purple)' }} />
                </div>
                <div className="kpi">
                    <div className="kpi-label">Outcome</div>
                    <div className="kpi-val" style={{ fontSize: 24, fontFamily: 'var(--sans)', fontWeight: 600, color: 'var(--green)' }}>Approved</div>
                    <div className="kpi-sub"><span className="chip chip-green">Digital signature</span></div>
                    <div className="kpi-accent" style={{ background: 'var(--green)' }} />
                </div>
            </div>

            {/* ─── COMPARE BANNER ─── */}
            <div className="compare-banner">
                <div className="compare-icon">⟳</div>
                <div className="compare-text">
                    <div className="compare-title">Session improved vs last time</div>
                    <div className="compare-sub">Client spent 34% longer in the Living Room and left 2 fewer revision notes than Session #2 — a sign the design addressed their concerns.</div>
                </div>
                <button className="btn btn-secondary">Compare sessions →</button>
            </div>

            {/* ─── CONTENT GRID ─── */}
            <div className="content-grid">
                {/* LEFT: Heatmap + Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* HEATMAP */}
                    <div className="panel">
                        <div className="panel-top">
                            <div className="panel-title">Presence Heatmap — Floor Plan View</div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span className="panel-meta">Hover zones to inspect</span>
                                <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}>3D view</button>
                            </div>
                        </div>
                        <div className="heatmap-wrap">
                            <div className="heatmap-canvas">
                                {/* Heat blobs */}
                                <div className="heat-blob" style={{ width: 280, height: 220, background: 'rgba(220,38,38,0.55)', left: '18%', top: '15%' }} />
                                <div className="heat-blob" style={{ width: 200, height: 160, background: 'rgba(234,88,12,0.50)', left: '50%', top: '40%' }} />
                                <div className="heat-blob" style={{ width: 160, height: 130, background: 'rgba(245,158,11,0.40)', left: '5%', top: '50%' }} />
                                <div className="heat-blob" style={{ width: 120, height: 100, background: 'rgba(59,130,246,0.30)', left: '72%', top: '10%' }} />
                                <div className="heat-blob" style={{ width: 90, height: 80, background: 'rgba(59,130,246,0.20)', left: '80%', top: '60%' }} />

                                {/* Zones */}
                                <div className="zone" style={{ left: '8%', top: '8%', width: '36%', height: '38%', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="zone-label">Living Room</div>
                                    <div className="zone-pct">29.8%</div>
                                </div>
                                <div className="zone" style={{ left: '48%', top: '8%', width: '26%', height: '28%', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="zone-label">Master Bed</div>
                                    <div className="zone-pct">8.1%</div>
                                </div>
                                <div className="zone" style={{ left: '76%', top: '8%', width: '20%', height: '28%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="zone-label">Bedroom 2</div>
                                    <div className="zone-pct">5.4%</div>
                                </div>
                                <div className="zone" style={{ left: '8%', top: '50%', width: '20%', height: '38%', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="zone-label">Kitchen</div>
                                    <div className="zone-pct">18.2%</div>
                                </div>
                                <div className="zone" style={{ left: '32%', top: '50%', width: '30%', height: '38%', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="zone-label">Dining</div>
                                    <div className="zone-pct">21.3%</div>
                                </div>
                                <div className="zone" style={{ left: '65%', top: '40%', width: '16%', height: '22%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="zone-label">Bathroom</div>
                                    <div className="zone-pct">7.1%</div>
                                </div>
                                <div className="zone" style={{ left: '65%', top: '65%', width: '31%', height: '24%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                                    <div className="zone-label">Office</div>
                                    <div className="zone-pct">10.1%</div>
                                </div>

                                {/* Path dots */}
                                <div className="path-dot" style={{ left: '26%', top: '27%', background: '#60A5FA' }} />
                                <div className="path-dot" style={{ left: '34%', top: '32%', background: '#60A5FA' }} />
                                <div className="path-dot" style={{ left: '45%', top: '59%', background: '#60A5FA' }} />
                                <div className="path-dot" style={{ left: '20%', top: '64%', background: '#60A5FA' }} />
                                <div className="path-dot" style={{ left: '30%', top: '27%', background: '#34D399' }} />
                                <div className="path-dot" style={{ left: '50%', top: '55%', background: '#34D399' }} />
                                <div className="path-dot" style={{ left: '71%', top: '49%', background: '#34D399' }} />

                                {/* Annotation pins */}
                                <div className="ann-pin" style={{ left: '22%', top: '24%' }} title="Revision: Window placement">
                                    <div className="ann-pin-dot" style={{ background: '#DC2626', width: 20, height: 20 }}>
                                        <div className="ann-pin-icon" style={{ fontSize: 9, color: 'white' }}>✎</div>
                                    </div>
                                </div>
                                <div className="ann-pin" style={{ left: '42%', top: '58%' }} title="Note: Love the open plan">
                                    <div className="ann-pin-dot" style={{ background: '#2D5BE3', width: 20, height: 20 }}>
                                        <div className="ann-pin-icon" style={{ fontSize: 9, color: 'white' }}>💬</div>
                                    </div>
                                </div>
                                <div className="ann-pin" style={{ left: '18%', top: '60%' }} title="Revision: Counter height">
                                    <div className="ann-pin-dot" style={{ background: '#DC2626', width: 20, height: 20 }}>
                                        <div className="ann-pin-icon" style={{ fontSize: 9, color: 'white' }}>✎</div>
                                    </div>
                                </div>
                                <div className="ann-pin" style={{ left: '68%', top: '46%' }} title="Note: Great tile choice">
                                    <div className="ann-pin-dot" style={{ background: '#2D5BE3', width: 20, height: 20 }}>
                                        <div className="ann-pin-icon" style={{ fontSize: 9, color: 'white' }}>💬</div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="heatmap-legend">
                                <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(220,38,38,0.8)' }} />High presence</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(245,158,11,0.7)' }} />Medium presence</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(59,130,246,0.6)' }} />Low presence</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#DC2626' }} />Revision pin</div>
                                <div className="legend-item"><div className="legend-dot" style={{ background: '#2D5BE3' }} />Note pin</div>
                            </div>

                            {/* User filter */}
                            <div className="heatmap-users">
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', display: 'flex', alignItems: 'center' }}>Filter by user:</span>
                                {userFilters.map((u) => (
                                    <div
                                        key={u.name}
                                        className={`heatmap-user-tag ${activeUserFilter === u.name ? 'active' : ''}`}
                                        onClick={() => setActiveUserFilter(u.name)}
                                    >
                                        <div className="hut-dot" style={{ background: u.color }} />
                                        {u.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE */}
                    <div className="panel">
                        <div className="panel-top">
                            <div className="panel-title">Session Timeline</div>
                            <span className="panel-meta">Total · 47:12</span>
                        </div>
                        <div className="timeline-wrap">
                            {/* Swim lane labels */}
                            <div style={{ display: 'flex', gap: 0, marginBottom: 6 }}>
                                {['Ahmet K.', 'Martin & Co.', 'Elif K.'].map((name) => (
                                    <div key={name} style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)', flex: 1, paddingLeft: 2, letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>{name}</div>
                                ))}
                            </div>

                            <div className="tl-track">
                                {/* Lanes */}
                                <div className="tl-lane" style={{ top: 4, background: 'rgba(96,165,250,0.12)', left: '0%', width: '100%' }} />
                                <div className="tl-lane" style={{ top: 22, background: 'rgba(52,211,153,0.12)', left: '5%', width: '90%' }} />
                                <div className="tl-lane" style={{ top: 40, background: 'rgba(244,114,182,0.12)', left: '12%', width: '72%' }} />

                                {/* Lane 1 segments */}
                                <div style={{ position: 'absolute', top: 4, left: '0%', width: '30%', height: 14, borderRadius: 3, background: 'rgba(220,38,38,0.35)' }} />
                                <div style={{ position: 'absolute', top: 4, left: '30%', width: '20%', height: 14, borderRadius: 3, background: 'rgba(59,130,246,0.30)' }} />
                                <div style={{ position: 'absolute', top: 4, left: '50%', width: '22%', height: 14, borderRadius: 3, background: 'rgba(234,88,12,0.30)' }} />
                                <div style={{ position: 'absolute', top: 4, left: '72%', width: '28%', height: 14, borderRadius: 3, background: 'rgba(220,38,38,0.25)' }} />

                                {/* Lane 2 segments */}
                                <div style={{ position: 'absolute', top: 22, left: '5%', width: '25%', height: 14, borderRadius: 3, background: 'rgba(52,211,153,0.40)' }} />
                                <div style={{ position: 'absolute', top: 22, left: '32%', width: '35%', height: 14, borderRadius: 3, background: 'rgba(52,211,153,0.30)' }} />
                                <div style={{ position: 'absolute', top: 22, left: '70%', width: '25%', height: 14, borderRadius: 3, background: 'rgba(52,211,153,0.35)' }} />

                                {/* Lane 3 segments */}
                                <div style={{ position: 'absolute', top: 40, left: '12%', width: '20%', height: 14, borderRadius: 3, background: 'rgba(244,114,182,0.40)' }} />
                                <div style={{ position: 'absolute', top: 40, left: '35%', width: '30%', height: 14, borderRadius: 3, background: 'rgba(244,114,182,0.30)' }} />
                                <div style={{ position: 'absolute', top: 40, left: '68%', width: '16%', height: 14, borderRadius: 3, background: 'rgba(244,114,182,0.25)' }} />

                                {/* Events */}
                                <div className="tl-event" style={{ left: '5%', top: 11 }} title="Session started">
                                    <div className="tl-event-dot" style={{ background: '#1A7A4A', width: 12, height: 12 }} />
                                </div>
                                <div className="tl-event" style={{ left: '22%', top: 11 }} title="Annotation: Window placement">
                                    <div className="tl-event-dot" style={{ background: '#DC2626' }} />
                                </div>
                                <div className="tl-event" style={{ left: '42%', top: 11 }} title="Note: Open plan">
                                    <div className="tl-event-dot" style={{ background: '#2D5BE3' }} />
                                </div>
                                <div className="tl-event" style={{ left: '58%', top: 11 }} title="Annotation: Counter height">
                                    <div className="tl-event-dot" style={{ background: '#DC2626' }} />
                                </div>
                                <div className="tl-event" style={{ left: '85%', top: 11 }} title="Client approved">
                                    <div className="tl-event-dot" style={{ background: '#1A7A4A', width: 16, height: 16 }} />
                                </div>

                                {/* Axis ticks */}
                                <div className="tl-axis">
                                    {[
                                        { pos: '0%', label: '0:00' },
                                        { pos: '20%', label: '9:26' },
                                        { pos: '40%', label: '18:53' },
                                        { pos: '60%', label: '28:19' },
                                        { pos: '80%', label: '37:46' },
                                        { pos: '100%', label: '47:12' },
                                    ].map((tick) => (
                                        <div key={tick.pos} className="tl-tick" style={{ left: tick.pos }}>
                                            <div className="tl-tick-label">{tick.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Playhead */}
                                <div className="tl-playhead" />
                            </div>

                            {/* Controls */}
                            <div className="tl-controls">
                                <button className="tl-play-btn" onClick={() => setPlaying(!playing)}>
                                    {playing ? '⏸' : '▶'}
                                </button>
                                <div className="tl-time">24:08 / 47:12</div>

                                {/* Zone legend mini */}
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, padding: '0 8px' }}>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(220,38,38,0.5)' }} /><span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Living Rm</span></div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(234,88,12,0.5)' }} /><span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Dining</span></div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(59,130,246,0.5)' }} /><span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Kitchen</span></div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#DC2626' }} /><span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Revision</span></div>
                                    <div className="legend-item"><div className="legend-dot" style={{ background: '#1A7A4A' }} /><span style={{ fontSize: 10, color: 'var(--ink-3)' }}>Milestone</span></div>
                                </div>

                                <div className="tl-speed">
                                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', marginRight: 4 }}>Speed:</span>
                                    {speeds.map((s) => (
                                        <button key={s} className={`speed-btn ${activeSpeed === s ? 'active' : ''}`} onClick={() => setActiveSpeed(s)}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL */}
                <div className="right-col">
                    {/* ZONE BREAKDOWN */}
                    <div className="panel">
                        <div className="panel-top">
                            <div className="panel-title">Time by Zone</div>
                            <span className="panel-meta">47:12 total</span>
                        </div>
                        <div className="zone-list">
                            {[
                                { name: 'Living Room', time: '14 min 07 sec', pct: 29.8, width: 100, color: '#DC2626' },
                                { name: 'Dining Room', time: '10 min 03 sec', pct: 21.3, width: 71, color: '#EA580C' },
                                { name: 'Kitchen', time: '8 min 35 sec', pct: 18.2, width: 61, color: '#F59E0B' },
                                { name: 'Home Office', time: '4 min 46 sec', pct: 10.1, width: 34, color: '#7C3AED' },
                                { name: 'Master Bedroom', time: '3 min 49 sec', pct: 8.1, width: 27, color: '#3B82F6' },
                                { name: 'Bathroom', time: '3 min 20 sec', pct: 7.1, width: 24, color: '#6B7280' },
                            ].map((z) => (
                                <div className="zone-row" key={z.name}>
                                    <div className="zone-color" style={{ background: z.color }} />
                                    <div className="zone-info">
                                        <div className="zone-name">{z.name}</div>
                                        <div className="zone-time">{z.time}</div>
                                    </div>
                                    <div className="zone-bar-wrap">
                                        <div className="zone-bar-track">
                                            <div className="zone-bar-fill" style={{ width: `${z.width}%`, background: z.color, opacity: 0.7 }} />
                                        </div>
                                        <div className="zone-pct-label">{z.pct}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ANNOTATIONS */}
                    <div className="panel">
                        <div className="panel-top">
                            <div className="panel-title">Annotations</div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <span className="chip chip-red">3 revision</span>
                                <span className="chip chip-blue">6 note</span>
                            </div>
                        </div>
                        <div className="ann-list">
                            {[
                                { type: 'revision', user: 'Martin & Co.', text: 'Window too low — sill height feels uncomfortable standing', ts: '22:14', zone: 'Living Room' },
                                { type: 'note', user: 'Martin & Co.', text: 'Love how the kitchen flows into dining. Keep this.', ts: '31:07', zone: 'Kitchen' },
                                { type: 'revision', user: 'Martin & Co.', text: "Counter height seems high for my partner's reach", ts: '33:45', zone: 'Kitchen' },
                                { type: 'note', user: 'Ahmet K.', text: 'Note: recessed lighting achieves correct lux levels', ts: '38:20', zone: 'Dining Room' },
                            ].map((a, i) => (
                                <div className="ann-row" key={i}>
                                    <div className="ann-type-icon" style={{ background: a.type === 'revision' ? 'var(--red-soft)' : 'var(--blue-soft)' }}>
                                        {a.type === 'revision' ? '✎' : '💬'}
                                    </div>
                                    <div className="ann-content">
                                        <div className="ann-user">{a.user}</div>
                                        <div className="ann-text">{a.text}</div>
                                        <div className="ann-meta">
                                            <span className="ann-ts">{a.ts}</span>
                                            <span className="ann-zone-tag">{a.zone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM GRID ─── */}
            <div className="bottom-grid">
                {/* PARTICIPANTS */}
                <div className="panel">
                    <div className="panel-top">
                        <div className="panel-title">Participants</div>
                        <span className="panel-meta">3 total</span>
                    </div>
                    {[
                        { initials: 'AK', name: 'Ahmet Koç', role: 'Lead Architect · Host', gradient: 'linear-gradient(135deg,#2D5BE3,#7C3AED)', time: '47:12', timePct: 100, ann: 3, annPct: 33, color: '#2D5BE3' },
                        { initials: 'MC', name: 'Martin & Co.', role: 'Client · Reviewer', gradient: 'linear-gradient(135deg,#1A7A4A,#059669)', time: '41:33', timePct: 88, ann: 6, annPct: 66, color: '#1A7A4A' },
                        { initials: 'EK', name: 'Elif Kaya', role: 'Interior Designer', gradient: 'linear-gradient(135deg,#B45309,#D97706)', time: '34:10', timePct: 72, ann: 0, annPct: 0, color: '#B45309' },
                    ].map((p) => (
                        <div className="participant-card" key={p.initials}>
                            <div className="pc-avatar" style={{ background: p.gradient }}>{p.initials}</div>
                            <div className="pc-info">
                                <div className="pc-name">{p.name}</div>
                                <div className="pc-role">{p.role}</div>
                                <div className="pc-stats">
                                    <div className="pc-stat-row">
                                        Time
                                        <div className="pc-stat-bar"><div className="pc-stat-fill" style={{ width: `${p.timePct}%`, background: p.color, opacity: 0.6 }} /></div>
                                        <span className="pc-stat-val">{p.time}</span>
                                    </div>
                                    <div className="pc-stat-row">
                                        Annotations
                                        <div className="pc-stat-bar"><div className="pc-stat-fill" style={{ width: `${p.annPct}%`, background: p.color, opacity: 0.6 }} /></div>
                                        <span className="pc-stat-val">{p.ann}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ENGAGEMENT CHART */}
                <div className="panel">
                    <div className="panel-top">
                        <div className="panel-title">Engagement Over Time</div>
                        <span className="panel-meta">Movement + gaze activity</span>
                    </div>
                    <div className="engagement-chart">
                        <div className="ec-bars">
                            {[35, 52, 68, 100, 94, 78, 88, 72, 60, 45].map((h, i) => (
                                <div className="ec-bar-wrap" key={i}>
                                    <div className={`ec-bar ${h >= 88 ? 'peak' : ''}`} style={{ height: `${h}%` }} />
                                    <div className="ec-label">{i * 5}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', textAlign: 'center', marginTop: 16 }}>Minutes into session</div>
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                                Peak engagement at <strong>14–20 min</strong> (Living Room walkthrough).
                                Second peak at <strong>28–32 min</strong> when client discovered the dining space.
                            </div>
                        </div>
                    </div>
                </div>

                {/* SESSION OUTCOME */}
                <div className="panel">
                    <div className="panel-top">
                        <div className="panel-title">Session Outcome</div>
                        <span className="chip chip-green">✓ Approved</span>
                    </div>
                    <div style={{ padding: 18 }}>
                        <div style={{ background: 'var(--green-soft)', border: '1px solid rgba(26,122,74,0.15)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>Client approved this session</div>
                            <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>Digital signature received · Feb 19, 2026 at 15:17</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Open revisions</span>
                                <span className="chip chip-red">3 items</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Next session</span>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>Not scheduled</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Sessions this project</span>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)' }}>3 of 3</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Schedule next session →</button>
                            <button
                                className={`btn btn-secondary ${!canExport ? 'locked' : ''}`}
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={!canExport}
                                onClick={canExport ? () => alert('Exporting PDF...') : undefined}
                            >
                                {!canExport && <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: 6 }}><path d="M8 1a3 3 0 0 0-3 3v2H4.5A1.5 1.5 0 0 0 3 7.5v6A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 11.5 6H11V4a3 3 0 0 0-3-3zM6 4a2 2 0 1 1 4 0v2H6V4z" /></svg>}
                                Export full report PDF {!canExport && '(PRO)'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
