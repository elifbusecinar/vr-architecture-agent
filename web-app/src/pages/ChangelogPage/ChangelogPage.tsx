import { useState, useEffect, useCallback } from 'react';

/* ─── DATA ────────────────────────────────────────── */
interface ChangeEntry {
    icon: string;
    iconBg: string;
    tags: { label: string; cls: string }[];
    title: string;
    desc: React.ReactNode;
    media?: 'vr-stream' | 'heatmap';
}

interface VersionGroup {
    id: string;
    version: string;
    date: string;
    badge: { label: string; cls: string };
    latest?: boolean;
    entries: ChangeEntry[];
}

const versions: VersionGroup[] = [
    {
        id: 'v241', version: 'v2.4.1', date: 'Feb 19, 2026',
        badge: { label: 'Latest', cls: 'badge-latest' }, latest: true,
        entries: [
            {
                icon: '🥽', iconBg: 'var(--green-s)',
                tags: [{ label: 'New', cls: 'etag-new' }, { label: 'VR Core', cls: 'etag-perf' }],
                title: 'Runtime GLTF streaming — models load without app updates',
                desc: <>The most-requested feature since launch. Upload a new model version to Azure Blob Storage and it streams directly into your running Meta Quest 3 session — <strong>no headset update, no re-download.</strong> Supports GLB, GLTF 2.0, and embedded textures up to 4K.</>,
                media: 'vr-stream',
            },
            {
                icon: '📊', iconBg: 'var(--blue-s)',
                tags: [{ label: 'New', cls: 'etag-new' }, { label: 'Analytics', cls: 'etag-improved' }],
                title: 'Session Replay with presence heatmaps',
                desc: <>After every VR session, see exactly where each participant walked, how long they spent per room, and where they left annotations — all on an interactive floor plan. Exportable as PDF for client reports.</>,
                media: 'heatmap',
            },
            {
                icon: '⚡', iconBg: 'var(--amber-s)',
                tags: [{ label: 'Performance', cls: 'etag-perf' }],
                title: 'Backend cold-start reduced by 68%',
                desc: <>Azure App Service configuration tuned — API cold start from <strong>2.4s → 0.77s</strong>. Connection pooling for PostgreSQL also improved throughput by ~3× under concurrent session load.</>,
            },
        ],
    },
    {
        id: 'v240', version: 'v2.4.0', date: 'Feb 5, 2026',
        badge: { label: 'Major', cls: 'badge-major' },
        entries: [
            {
                icon: '👥', iconBg: 'var(--green-s)',
                tags: [{ label: 'New', cls: 'etag-new' }],
                title: 'Real-time multi-user VR sessions',
                desc: <>Multiple headsets in the same session, simultaneously. Architect, engineer, and client can walk through a project together from different physical locations. Supports up to <strong>8 concurrent participants</strong>.</>,
            },
            {
                icon: '🔐', iconBg: 'var(--blue-s)',
                tags: [{ label: 'New', cls: 'etag-new' }],
                title: 'Role-based access control (RBAC)',
                desc: <>Six roles: Owner, Admin, Architect, Designer, Client, Viewer. Granular per-role permissions for project creation, model uploads, VR sessions, annotations, and approvals. Manage your full team from the new Team & Roles page.</>,
            },
            {
                icon: '✎', iconBg: 'var(--amber-s)',
                tags: [{ label: 'New', cls: 'etag-new' }],
                title: 'Spatial annotation pins in VR',
                desc: <>Leave revision requests and notes <strong>anchored to exact 3D positions</strong> inside the model. Annotations persist across sessions and sync to the web dashboard in real time.</>,
            },
            {
                icon: '🔧', iconBg: 'var(--amber-s)',
                tags: [{ label: 'Fixed', cls: 'etag-fixed' }],
                title: 'Model orientation flipping on load resolved',
                desc: <>GLB files exported from Rhino and ArchiCAD were loading with inverted Y-axis. Normalization now applied at upload time via GLTFast pre-processing pipeline.</>,
            },
        ],
    },
    {
        id: 'v230', version: 'v2.3.0', date: 'Jan 14, 2026',
        badge: { label: 'Major', cls: 'badge-major' },
        entries: [
            {
                icon: '✅', iconBg: 'var(--green-s)',
                tags: [{ label: 'New', cls: 'etag-new' }],
                title: 'Client approval workflow with digital signature',
                desc: <>Send a review link to your client, they join VR or the Client Portal, leave feedback, and sign off with a digital signature — all tracked with a full audit trail.</>,
            },
            {
                icon: '📱', iconBg: 'var(--blue-s)',
                tags: [{ label: 'Improved', cls: 'etag-improved' }],
                title: 'Dashboard fully responsive on mobile & tablet',
                desc: <>The management dashboard now works flawlessly on iOS Safari and Android Chrome. Clients can review models and leave annotations without a desktop.</>,
            },
            {
                icon: '🗑', iconBg: 'var(--red-s)',
                tags: [{ label: 'Removed', cls: 'etag-removed' }],
                title: 'Legacy FBX import pipeline deprecated',
                desc: <>FBX support removed. GLTF 2.0 / GLB is now the only supported format. Existing FBX models should be converted using the Blender exporter or our new conversion tool.</>,
            },
        ],
    },
];

interface RoadmapItem {
    title: string;
    desc: string;
    tags: string[];
    progress?: number;
    votes?: number;
}

interface RoadmapLane {
    name: string;
    color: string;
    dotColor: string;
    items: RoadmapItem[];
}

const roadmapLanes: RoadmapLane[] = [
    {
        name: 'In Progress', color: 'var(--blue)', dotColor: '#5B8DEF',
        items: [
            { title: 'Unity 6 migration (URP)', desc: 'Upgrading VR client to Unity 6 for improved rendering performance and XR toolkit.', tags: ['VR Client', 'Unity'], progress: 65 },
            { title: 'In-VR measurement tools', desc: 'Tap two points in VR to measure real distance. Essential for space planning.', tags: ['VR', 'Tools'], progress: 40 },
            { title: 'PDF report auto-generation', desc: 'Automatically compile session heatmaps, annotations, and approval history into a branded client report.', tags: ['Analytics'], progress: 20 },
        ],
    },
    {
        name: 'Planned', color: 'var(--gold)', dotColor: '#C8A96E',
        items: [
            { title: 'Day/night lighting controls in VR', desc: 'Switch between time-of-day presets to show sunlight at different hours.', tags: ['VR', 'Lighting'], votes: 142 },
            { title: 'Figma plugin for model handoff', desc: 'Export 3D model references directly from Figma design files to VR Architecture.', tags: ['Integrations'], votes: 98 },
            { title: 'Material swapping in VR', desc: 'Switch finishes, colors, and textures live during a client walkthrough.', tags: ['VR', 'Design'], votes: 87 },
            { title: 'SSO / SAML enterprise login', desc: "Connect your company's identity provider for seamless enterprise onboarding.", tags: ['Enterprise', 'Auth'], votes: 64 },
        ],
    },
    {
        name: 'Considering', color: 'var(--ink-3)', dotColor: '#5A5750',
        items: [
            { title: 'Apple Vision Pro support', desc: 'Exploring spatial computing integration for AVP alongside existing Quest 3 support.', tags: ['Platform'], votes: 211 },
            { title: 'BIM / IFC file import', desc: 'Direct import from Revit and ArchiCAD BIM workflows without manual GLB conversion.', tags: ['Import', 'BIM'], votes: 176 },
            { title: 'AI-generated walkthrough narration', desc: 'Auto-generate architectural commentary for client self-guided sessions.', tags: ['AI'], votes: 55 },
        ],
    },
];

const filterItems = [
    { name: 'All changes', dot: 'var(--ink-2)', count: 38 },
    { name: 'New features', dot: 'var(--green)', count: 18 },
    { name: 'Improvements', dot: 'var(--blue)', count: 12 },
    { name: 'Bug fixes', dot: 'var(--amber)', count: 6 },
    { name: 'Performance', dot: 'var(--gold)', count: 2 },
];

const topRequested = [
    { votes: 211, title: 'Apple Vision Pro support' },
    { votes: 176, title: 'BIM / IFC file import' },
    { votes: 142, title: 'Day/night lighting controls' },
];

const releaseHistory = [
    { ver: 'v2.4.1', name: 'GLTF streaming', date: 'Feb 19' },
    { ver: 'v2.4.0', name: 'Multi-user VR', date: 'Feb 5' },
    { ver: 'v2.3.0', name: 'Approval flow', date: 'Jan 14' },
    { ver: 'v2.2.0', name: 'Azure migration', date: 'Dec 3' },
    { ver: 'v2.1.0', name: 'Dashboard v2', date: 'Nov 11' },
];

const sectionIds = ['v241', 'v240', 'v230', 'roadmap'];

import { PublicNavbar } from '@/components/Layout';

/* ─── COMPONENT ───────────────────────────────────── */
export default function ChangelogPage() {
    // navRef removed as it is handled in PublicNavbar
    const [activeFilter, setActiveFilter] = useState(0);
    const [activeSection, setActiveSection] = useState('v241');
    const [votedItems, setVotedItems] = useState<Record<string, boolean>>({});
    const [voteCountOverrides, setVoteCountOverrides] = useState<Record<string, number>>({});

    // Nav scroll effect removed (handled in PublicNavbar)

    // Scroll reveal for version groups
    useEffect(() => {
        const groups = document.querySelectorAll('.changelog-page .version-group');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 80);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        groups.forEach(g => obs.observe(g));
        return () => obs.disconnect();
    }, []);

    // Left nav active on scroll
    useEffect(() => {
        const handleScroll = () => {
            let current = 'v241';
            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el && window.scrollY >= el.offsetTop - 120) current = id;
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleVote = useCallback((key: string, baseVotes: number) => {
        setVotedItems(prev => {
            const wasVoted = prev[key];
            const newState = { ...prev, [key]: !wasVoted };
            setVoteCountOverrides(prevCounts => ({
                ...prevCounts,
                [key]: wasVoted ? (prevCounts[key] ?? baseVotes) - 1 : (prevCounts[key] ?? baseVotes) + 1,
            }));
            return newState;
        });
    }, []);

    const scrollToRoadmap = () => {
        document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="changelog-page">
            <PublicNavbar />

            {/* ─── HERO ─── */}

            {/* ─── HERO ─── */}
            <div className="cl-hero">
                <div className="hero-rule">
                    <div className="hero-rule-line" />
                    <div className="hero-rule-label">What's new</div>
                </div>

                <h1 className="hero-title">
                    Changelog<br /><em>&amp; Roadmap</em>
                </h1>

                <p className="hero-sub">
                    Every release, every decision — documented publicly. We build in the open so you know exactly where VR Architecture is headed.
                </p>

                <div className="hero-stats">
                    <div className="hs">
                        <div className="hs-val">38</div>
                        <div className="hs-label">Releases this year</div>
                    </div>
                    <div className="hs-sep" />
                    <div className="hs">
                        <div className="hs-val">214</div>
                        <div className="hs-label">Issues shipped</div>
                    </div>
                    <div className="hs-sep" />
                    <div className="hs">
                        <div className="hs-val">12</div>
                        <div className="hs-label">Days avg. cycle time</div>
                    </div>
                    <div className="hs-sep" />
                    <div className="hs">
                        <div className="hs-val">v2.4</div>
                        <div className="hs-label">Latest stable</div>
                    </div>
                </div>
            </div>

            {/* ─── MAIN LAYOUT ─── */}
            <div className="cl-layout">

                {/* LEFT NAV */}
                <aside className="left-nav">
                    <div className="ln-section">
                        <div className="ln-label">Releases</div>
                        {['v241', 'v240', 'v230', 'v220', 'v210'].map(id => (
                            <a className={`ln-link${activeSection === id ? ' active' : ''}`} href={`#${id}`} key={id}>
                                <div className="ln-dot" />
                                {id.replace('v', 'v').replace(/(\d)(\d)(\d)/, '$1.$2.$3')}
                            </a>
                        ))}
                    </div>
                    <div className="ln-section">
                        <div className="ln-label">Navigate</div>
                        <a className={`ln-link${activeSection === 'roadmap' ? ' active' : ''}`} href="#roadmap">
                            <div className="ln-dot" /> Roadmap
                        </a>
                        <a className="ln-link" href="#roadmap">
                            <div className="ln-dot" /> Vote on features
                        </a>
                    </div>
                    <div className="ln-section" style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 8 }}>Subscribe to updates</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <input className="ln-subscribe-input" placeholder="your@email.com" />
                            <button className="ln-subscribe-btn">Notify me</button>
                        </div>
                    </div>
                </aside>

                {/* CENTER FEED */}
                <div className="feed">
                    {versions.map(vg => (
                        <div className={`version-group${vg.latest ? ' latest' : ''}`} id={vg.id} key={vg.id}>
                            <div className="vg-header">
                                <div className="vg-version">{vg.version}</div>
                                <div className="vg-date">{vg.date}</div>
                                <div className={`vg-badge ${vg.badge.cls}`}>{vg.badge.label}</div>
                            </div>

                            {vg.entries.map((entry, idx) => (
                                <div className="entry" key={idx}>
                                    <div className="entry-top">
                                        <div className="entry-type-icon" style={{ background: entry.iconBg }}>{entry.icon}</div>
                                        <div className="entry-body">
                                            <div className="entry-tag-row">
                                                {entry.tags.map((tag, ti) => (
                                                    <span className={`etag ${tag.cls}`} key={ti}>{tag.label}</span>
                                                ))}
                                            </div>
                                            <div className="entry-title">{entry.title}</div>
                                            <div className="entry-desc">{entry.desc}</div>
                                        </div>
                                    </div>

                                    {entry.media === 'vr-stream' && (
                                        <div className="entry-media">
                                            <div className="vr-mini">
                                                <div className="vr-mini-grid" />
                                                <div className="vr-mini-glow" />
                                                <div className="vr-mini-label">
                                                    <div className="vr-mini-dot" />
                                                    streaming skyline_v4.glb — 142 MB
                                                </div>
                                                <div className="stream-track">
                                                    <div className="stream-bar">
                                                        <div className="stream-fill" />
                                                    </div>
                                                    <div className="stream-label">72% loaded · 0.8s remaining</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {entry.media === 'heatmap' && (
                                        <div className="entry-media">
                                            <div className="hm-mini">
                                                <div className="hm-blob" style={{ width: 180, height: 140, background: 'rgba(220,38,38,0.45)', left: '10%', top: '5%' }} />
                                                <div className="hm-blob" style={{ width: 120, height: 100, background: 'rgba(234,88,12,0.40)', left: '45%', top: '30%' }} />
                                                <div className="hm-blob" style={{ width: 90, height: 80, background: 'rgba(91,141,239,0.30)', left: '65%', top: '10%' }} />
                                                <div className="hm-floor">
                                                    <div className="hm-label">FLOOR PLAN · SESSION REPLAY</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* ─── ROADMAP ─── */}
                    <div id="roadmap" style={{ marginTop: 64 }}>
                        <div className="roadmap-header">
                            <div className="roadmap-title">What's <em>next</em></div>
                        </div>
                        <div className="roadmap-desc">
                            Our public roadmap. Vote on items to influence priority — the most upvoted features move forward first.
                        </div>

                        <div className="roadmap-lanes">
                            {roadmapLanes.map(lane => (
                                <div className="lane" key={lane.name}>
                                    <div className="lane-header">
                                        <div className="lane-dot" style={{ background: lane.dotColor }} />
                                        <div className="lane-name" style={{ color: lane.color }}>{lane.name}</div>
                                        <div className="lane-count">{lane.items.length} items</div>
                                    </div>

                                    {lane.items.map(item => {
                                        const voteKey = `${lane.name}-${item.title}`;
                                        const currentVotes = voteCountOverrides[voteKey] ?? item.votes;
                                        return (
                                            <div className="road-item" key={item.title}>
                                                <div className="ri-title">{item.title}</div>
                                                <div className="ri-desc">{item.desc}</div>

                                                {item.progress !== undefined && (
                                                    <div className="ri-progress">
                                                        <div className="ri-prog-track">
                                                            <div className="ri-prog-fill" style={{ width: `${item.progress}%` }} />
                                                        </div>
                                                        <div className="ri-prog-label">{item.progress}% complete</div>
                                                    </div>
                                                )}

                                                <div className="ri-tags">
                                                    {item.tags.map(t => <span className="ri-tag" key={t}>{t}</span>)}
                                                </div>

                                                {item.votes !== undefined && (
                                                    <button
                                                        className={`ri-votes${votedItems[voteKey] ? ' voted' : ''}`}
                                                        onClick={() => toggleVote(voteKey, item.votes!)}
                                                    >
                                                        ▲ <span>{currentVotes}</span> upvotes
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="right-col">
                    {/* Filter */}
                    <div className="rc-panel">
                        <div className="rc-top"><div className="rc-title">Filter by category</div></div>
                        <div className="rc-body" style={{ padding: 8 }}>
                            <div className="filter-list">
                                {filterItems.map((fi, i) => (
                                    <button
                                        className={`filter-item${activeFilter === i ? ' active' : ''}`}
                                        key={fi.name}
                                        onClick={() => setActiveFilter(i)}
                                    >
                                        <div className="fi-left">
                                            <div className="fi-dot" style={{ background: fi.dot }} />
                                            <div className="fi-name">{fi.name}</div>
                                        </div>
                                        <div className="fi-count">{fi.count}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top requested */}
                    <div className="rc-panel">
                        <div className="rc-top"><div className="rc-title">Top requested</div></div>
                        <div className="rc-body">
                            <div className="top-upvote">
                                {topRequested.map(tr => (
                                    <div className="tu-item" key={tr.title} onClick={scrollToRoadmap}>
                                        <div className="tu-votes-val">{tr.votes}</div>
                                        <div className="tu-title">{tr.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Release history */}
                    <div className="rc-panel">
                        <div className="rc-top"><div className="rc-title">Release history</div></div>
                        <div className="rc-body" style={{ padding: '10px 16px' }}>
                            <div className="release-mini">
                                {releaseHistory.map(r => (
                                    <div className="rm-item" key={r.ver}>
                                        <div className="rm-ver">{r.ver}</div>
                                        <div className="rm-name">{r.name}</div>
                                        <div className="rm-date">{r.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Subscribe */}
                    <div className="rc-panel">
                        <div className="rc-top"><div className="rc-title">Get release notes</div></div>
                        <div className="rc-body">
                            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginBottom: 10, lineHeight: 1.5 }}>
                                New release email every 2–3 weeks. No spam.
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <input className="subscribe-input" type="email" placeholder="you@studio.com" />
                                <button className="subscribe-btn">Subscribe →</button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
