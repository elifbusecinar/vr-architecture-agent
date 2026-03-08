import React, { useEffect } from 'react';
import './AiInsightsPage.css';

const AiInsightsPage: React.FC = () => {
    useEffect(() => {
        // Animate bar chart
        const data = [22, 31, 38, 45, 20];
        const chart = document.getElementById('bar-chart');
        if (chart) {
            chart.innerHTML = ''; // reset on hot reload
            const maxVal = Math.max(...data);
            data.forEach((v, i) => {
                const col = document.createElement('div');
                col.className = 'bar-col';
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = '4px';
                bar.style.background = i === 3 ? '#1c1c1a' : '#e0ddd9';
                bar.style.borderRadius = '4px 4px 0 0';
                bar.title = v + ' sessions';
                col.appendChild(bar);
                chart.appendChild(col);
                // Animate after render
                setTimeout(() => {
                    bar.style.height = Math.round((v / maxVal) * 80) + 'px';
                }, 100 + i * 80);
            });
        }
    }, []);

    return (
        <div className="ai-insights-root page">
            {/* Header */}
            <div className="page-eyebrow">— AI Insights</div>
            <h1 className="page-title">
                Your workspace,<br />
                <em>analysed.</em>
            </h1>
            <p className="page-sub">Updated just now · Based on 5 projects, 156 VR sessions, 4 active clients</p>

            {/* Period tabs */}
            <div className="period-tabs">
                <button className="ptab">7 days</button>
                <button className="ptab active">This month</button>
                <button className="ptab">Quarter</button>
                <button className="ptab">All time</button>
            </div>

            {/* AI Summary */}
            <div className="ai-summary">
                <div className="ai-sum-head">
                    <div className="ai-sum-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="ai-sum-label">AI Summary</div>
                </div>
                <div className="ai-sum-text">
                    <strong>Skyline Tower</strong> is your most active project with <strong>78 VR sessions</strong> this month
                    — client engagement is high. <em>Villa Azura is fully approved</em> and ready to close. <strong>Metro Nexus Hub</strong>
                    needs attention: approval is pending for 12 days and the client hasn't joined a session yet. <em>Nordic Cabin</em>
                    is at 15% — consider scheduling a kickoff session soon.
                </div>
                <div className="ai-sum-footer">
                    <div className="ai-sum-tag">
                        <span className="dot"></span> Live · Updated 2 min ago
                    </div>
                    <div className="ai-sum-ask">
                        Ask AI Assistant
                        <svg viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Summary cards */}
            <div className="summary-row">
                <div className="sum-card">
                    <div className="sum-label">
                        Active Projects <span>↗</span>
                    </div>
                    <div className="sum-val">5</div>
                    <div className="sum-trend trend-up">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +1 this month
                    </div>
                    <div className="sum-bg" style={{ background: 'var(--green)' }}></div>
                </div>
                <div className="sum-card">
                    <div className="sum-label">
                        VR Sessions <span>↗</span>
                    </div>
                    <div className="sum-val">156</div>
                    <div className="sum-trend trend-up">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +12 this week
                    </div>
                    <div className="sum-bg" style={{ background: 'var(--blue)' }}></div>
                </div>
                <div className="sum-card">
                    <div className="sum-label">
                        Storage Used <span>↗</span>
                    </div>
                    <div className="sum-val" style={{ fontSize: '28px', paddingTop: '4px' }}>
                        45.2GB
                    </div>
                    <div className="sum-trend trend-warn">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                        45% of 100GB
                    </div>
                    <div className="sum-bg" style={{ background: 'var(--orange)' }}></div>
                </div>
                <div className="sum-card">
                    <div className="sum-label">
                        Avg. Session Time <span>↗</span>
                    </div>
                    <div className="sum-val" style={{ fontSize: '28px', paddingTop: '4px' }}>
                        24 min
                    </div>
                    <div className="sum-trend trend-up">
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="11" height="11">
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                        +4 min vs last month
                    </div>
                    <div className="sum-bg" style={{ background: '#7b6fa0' }}></div>
                </div>
            </div>

            {/* Two col: projects + insights */}
            <div className="two-col">
                {/* Project Health */}
                <div className="card" style={{ animationDelay: '.2s' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M2 14V6l6-4 6 4v8H2Z" />
                                <rect x="5" y="10" width="3" height="4" />
                            </svg>
                            Project Health
                        </div>
                        <div className="card-action">
                            View all{' '}
                            <svg viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                    </div>
                    <div className="project-list">
                        <div className="proj-row">
                            <div className="proj-icon" style={{ background: '#1c1c1a' }}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M3 21V8l9-6 9 6v13" />
                                    <path d="M9 21v-6h6v6" />
                                </svg>
                            </div>
                            <div className="proj-info">
                                <div className="proj-name">Skyline Tower</div>
                                <div className="proj-client">Skyline Realty · 10.01.2026</div>
                                <div className="proj-bar-wrap">
                                    <div className="proj-bar-bg">
                                        <div className="proj-bar-fill" style={{ width: '78%', background: '#1c1c1a' }}></div>
                                    </div>
                                    <div className="proj-pct">78%</div>
                                </div>
                            </div>
                            <div className="proj-status">
                                <div className="status-pill sp-vr">
                                    <span className="sdot"></span>VR Active
                                </div>
                                <div className="proj-date">Mar 12</div>
                            </div>
                        </div>
                        <div className="proj-row">
                            <div className="proj-icon" style={{ background: 'var(--green)' }}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M3 21V8l9-6 9 6v13" />
                                    <path d="M9 21v-6h6v6" />
                                </svg>
                            </div>
                            <div className="proj-info">
                                <div className="proj-name">Villa Azura</div>
                                <div className="proj-client">Azura Holdings · 05.11.2025</div>
                                <div className="proj-bar-wrap">
                                    <div className="proj-bar-bg">
                                        <div className="proj-bar-fill" style={{ width: '100%', background: 'var(--green)' }}></div>
                                    </div>
                                    <div className="proj-pct">100%</div>
                                </div>
                            </div>
                            <div className="proj-status">
                                <div className="status-pill sp-ap">
                                    <span className="sdot"></span>Approved
                                </div>
                                <div className="proj-date">Mar 8</div>
                            </div>
                        </div>
                        <div className="proj-row">
                            <div className="proj-icon" style={{ background: 'var(--orange)' }}>
                                <svg viewBox="0 0 24 24">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <path d="M8 21h8M12 17v4" />
                                </svg>
                            </div>
                            <div className="proj-info">
                                <div className="proj-name">Metro Nexus Hub</div>
                                <div className="proj-client">City Transport Authority · 15.02.2026</div>
                                <div className="proj-bar-wrap">
                                    <div className="proj-bar-bg">
                                        <div className="proj-bar-fill" style={{ width: '45%', background: 'var(--orange)' }}></div>
                                    </div>
                                    <div className="proj-pct">45%</div>
                                </div>
                            </div>
                            <div className="proj-status">
                                <div className="status-pill sp-rv">
                                    <span className="sdot"></span>In Review
                                </div>
                                <div className="proj-date">Feb 15</div>
                            </div>
                        </div>
                        <div className="proj-row">
                            <div className="proj-icon" style={{ background: '#8a8783' }}>
                                <svg viewBox="0 0 24 24">
                                    <path d="M3 21V8l9-6 9 6v13" />
                                    <path d="M9 21v-6h6v6" />
                                </svg>
                            </div>
                            <div className="proj-info">
                                <div className="proj-name">Nordic Cabin</div>
                                <div className="proj-client">Private Client · 01.03.2026</div>
                                <div className="proj-bar-wrap">
                                    <div className="proj-bar-bg">
                                        <div className="proj-bar-fill" style={{ width: '15%', background: '#b8b4af' }}></div>
                                    </div>
                                    <div className="proj-pct">15%</div>
                                </div>
                            </div>
                            <div className="proj-status">
                                <div className="status-pill sp-dr">
                                    <span className="sdot"></span>Draft
                                </div>
                                <div className="proj-date">Mar 1</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: storage + sessions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Storage breakdown */}
                    <div className="card" style={{ animationDelay: '.25s' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <svg viewBox="0 0 24 24">
                                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                                    <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
                                    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                                </svg>
                                Storage
                            </div>
                            <div className="card-action">Manage</div>
                        </div>
                        <div className="donut-wrap">
                            <svg className="donut-svg" width="90" height="90" viewBox="0 0 90 90">
                                <circle cx="45" cy="45" r="34" fill="none" stroke="#e8e5e1" strokeWidth="10" />
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="34"
                                    fill="none"
                                    stroke="#1c1c1a"
                                    strokeWidth="10"
                                    strokeDasharray="93 120"
                                    strokeDashoffset="30"
                                    transform="rotate(-90 45 45)"
                                />
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="34"
                                    fill="none"
                                    stroke="var(--green)"
                                    strokeWidth="10"
                                    strokeDasharray="51 162"
                                    strokeDashoffset="-63"
                                    transform="rotate(-90 45 45)"
                                />
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="34"
                                    fill="none"
                                    stroke="var(--orange)"
                                    strokeWidth="10"
                                    strokeDasharray="34 179"
                                    strokeDashoffset="-114"
                                    transform="rotate(-90 45 45)"
                                />
                                <circle
                                    cx="45"
                                    cy="45"
                                    r="34"
                                    fill="none"
                                    stroke="#e0ddd9"
                                    strokeWidth="10"
                                    strokeDasharray="20 193"
                                    strokeDashoffset="-148"
                                    transform="rotate(-90 45 45)"
                                />
                                <text x="45" y="42" textAnchor="middle" fontFamily="EB Garamond,serif" fontSize="15" fill="#1c1c1a">
                                    45.2
                                </text>
                                <text x="45" y="54" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="8" fill="#b8b4af">
                                    GB used
                                </text>
                            </svg>
                            <div className="donut-legend">
                                <div className="legend-row">
                                    <div className="legend-dot" style={{ background: '#1c1c1a' }}></div>
                                    <div className="legend-label">Skyline Tower</div>
                                    <div className="legend-val">22 GB</div>
                                </div>
                                <div className="legend-row">
                                    <div className="legend-dot" style={{ background: 'var(--green)' }}></div>
                                    <div className="legend-label">Villa Azura</div>
                                    <div className="legend-val">12 GB</div>
                                </div>
                                <div className="legend-row">
                                    <div className="legend-dot" style={{ background: 'var(--orange)' }}></div>
                                    <div className="legend-label">Metro Nexus</div>
                                    <div className="legend-val">8 GB</div>
                                </div>
                                <div className="legend-row">
                                    <div className="legend-dot" style={{ background: '#e0ddd9' }}></div>
                                    <div className="legend-label">Other</div>
                                    <div className="legend-val">3.2 GB</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VR Sessions bar */}
                    <div className="card" style={{ animationDelay: '.3s' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="2" />
                                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4" />
                                </svg>
                                VR Sessions / Week
                            </div>
                        </div>
                        <div className="bar-chart" id="bar-chart"></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                            <span style={{ fontSize: '9.5px', color: 'var(--light)' }}>W1</span>
                            <span style={{ fontSize: '9.5px', color: 'var(--light)' }}>W2</span>
                            <span style={{ fontSize: '9.5px', color: 'var(--light)' }}>W3</span>
                            <span style={{ fontSize: '9.5px', color: 'var(--light)' }}>W4</span>
                            <span style={{ fontSize: '9.5px', color: 'var(--light)' }}>W5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom row: insights + client engagement */}
            <div className="two-col">
                {/* AI Insights list */}
                <div className="card" style={{ animationDelay: '.3s' }}>
                    <div className="card-header">
                        <div className="card-title">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            AI Recommendations
                        </div>
                        <div className="card-action">
                            View all{' '}
                            <svg viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                    </div>
                    <div className="insight-list">
                        <div className="insight-item">
                            <div className="ii-icon" style={{ background: '#fff3e8', stroke: 'var(--orange)' }}>
                                <svg viewBox="0 0 24 24" stroke="var(--orange)" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                            </div>
                            <div className="ii-body">
                                <div className="ii-title">Metro Nexus approval overdue</div>
                                <div className="ii-desc">
                                    Client hasn't responded in 12 days. Consider sending a follow-up or scheduling a review session.
                                </div>
                                <div className="ii-action">
                                    Send reminder{' '}
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="10" height="10">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ii-badge" style={{ background: '#fef3e2', color: 'var(--orange)' }}>
                                Urgent
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="ii-icon" style={{ background: '#eef4fb' }}>
                                <svg viewBox="0 0 24 24" stroke="var(--blue)" strokeWidth="2">
                                    <circle cx="12" cy="12" r="2" />
                                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83" />
                                </svg>
                            </div>
                            <div className="ii-body">
                                <div className="ii-title">Skyline Tower — 78 sessions strong</div>
                                <div className="ii-desc">
                                    Client John is highly engaged. Good time to propose additional design revisions or upsell premium
                                    materials.
                                </div>
                                <div className="ii-action">
                                    Open project{' '}
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="10" height="10">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ii-badge" style={{ background: '#eef4fb', color: 'var(--blue)' }}>
                                Opportunity
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="ii-icon" style={{ background: '#e8f2ec' }}>
                                <svg viewBox="0 0 24 24" stroke="var(--green)" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <path d="M22 4 12 14.01l-3-3" />
                                </svg>
                            </div>
                            <div className="ii-body">
                                <div className="ii-title">Villa Azura — ready to close</div>
                                <div className="ii-desc">
                                    All milestones approved. Consider archiving the project or starting a new phase with Azura Holdings.
                                </div>
                                <div className="ii-action">
                                    Archive or extend{' '}
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="10" height="10">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ii-badge" style={{ background: '#e8f2ec', color: 'var(--green)' }}>
                                Done
                            </div>
                        </div>
                        <div className="insight-item">
                            <div className="ii-icon" style={{ background: '#f4f1ee' }}>
                                <svg viewBox="0 0 24 24" stroke="var(--muted)" strokeWidth="2">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                            <div className="ii-body">
                                <div className="ii-title">Nordic Cabin needs a kickoff</div>
                                <div className="ii-desc">
                                    Project is only 15% complete. No VR session has been scheduled yet with the private client.
                                </div>
                                <div className="ii-action">
                                    Schedule session{' '}
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" width="10" height="10">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ii-badge" style={{ background: '#f0ede8', color: 'var(--muted)' }}>
                                Pending
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client engagement */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="card" style={{ animationDelay: '.35s' }}>
                        <div className="card-header">
                            <div className="card-title">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Client Engagement
                            </div>
                        </div>
                        <div className="client-list">
                            <div className="client-row">
                                <div className="client-avatar" style={{ background: '#1c1c1a' }}>
                                    JO
                                </div>
                                <div className="client-info">
                                    <div className="client-name">Client John</div>
                                    <div className="client-project">Skyline Tower · 42 sessions</div>
                                    <div className="client-bar-bg">
                                        <div className="client-bar-fill" style={{ width: '92%', background: '#1c1c1a' }}></div>
                                    </div>
                                </div>
                                <div className="client-score">92</div>
                            </div>
                            <div className="client-row">
                                <div className="client-avatar" style={{ background: 'var(--green)' }}>
                                    AH
                                </div>
                                <div className="client-info">
                                    <div className="client-name">Azura Holdings</div>
                                    <div className="client-project">Villa Azura · 28 sessions</div>
                                    <div className="client-bar-bg">
                                        <div className="client-bar-fill" style={{ width: '78%', background: 'var(--green)' }}></div>
                                    </div>
                                </div>
                                <div className="client-score">78</div>
                            </div>
                            <div className="client-row">
                                <div className="client-avatar" style={{ background: 'var(--orange)' }}>
                                    CT
                                </div>
                                <div className="client-info">
                                    <div className="client-name">City Transport Auth.</div>
                                    <div className="client-project">Metro Nexus · 8 sessions</div>
                                    <div className="client-bar-bg">
                                        <div className="client-bar-fill" style={{ width: '31%', background: 'var(--orange)' }}></div>
                                    </div>
                                </div>
                                <div className="client-score">31</div>
                            </div>
                            <div className="client-row">
                                <div className="client-avatar" style={{ background: '#b8b4af' }}>
                                    PC
                                </div>
                                <div className="client-info">
                                    <div className="client-name">Private Client</div>
                                    <div className="client-project">Nordic Cabin · 0 sessions</div>
                                    <div className="client-bar-bg">
                                        <div className="client-bar-fill" style={{ width: '5%', background: '#b8b4af' }}></div>
                                    </div>
                                </div>
                                <div className="client-score" style={{ color: 'var(--light)' }}>
                                    5
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick ask */}
                    <div className="rec-card" style={{ animationDelay: '.4s' }}>
                        <div className="rec-icon" style={{ background: '#1c1c1a' }}>
                            <svg viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <div className="rec-body">
                            <div className="rec-label">Ask AI Assistant</div>
                            <div className="rec-title">Dig deeper into any insight</div>
                            <div className="rec-desc">
                                Ask follow-up questions, generate reports, or draft client emails based on these findings.
                            </div>
                        </div>
                        <div className="rec-arrow">
                            <svg viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="var(--light)" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiInsightsPage;
