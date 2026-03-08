import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/services/api/axiosInstance';
import AgentLogo from '@/components/common/AgentLogo';
import '@/styles/vr-interface.css';

// ── Types ──
interface SunPreset {
    time: string;
    fill: number;
    sky: string;
    orbX: number;
    orbY: number;
    shadow: number;
}

// ── Data ──
const QR_PATTERN = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];
const PROJECTS = [
    { name: 'Skyline Tower', client: 'Jensen Developments', status: 'live', icon: '🏙️', color: '#2D5BE3', active: false, location: 'Stockholm, SE', lat: 59.3 },
    { name: 'Villa Bianca', client: 'Rossi Family', status: 'live', icon: '🏡', color: '#1A7A4A', active: true, location: 'Rome, IT', lat: 41.9 },
    { name: 'Nordic Hub', client: 'Oslo City Council', status: 'review', icon: '🏛️', color: '#7C3AED', active: false, location: 'Oslo, NO', lat: 59.9 },
    { name: 'The Granary', client: 'Heritage Trust', status: 'review', icon: '🏗️', color: '#B45309', active: false, location: 'London, UK', lat: 51.5 },
    { name: 'Aqua Marina', client: 'Coastal RE', status: 'draft', icon: '🌊', color: '#0891B2', active: false, location: 'Miami, US', lat: 25.7 },
];

const SUN_PRESETS: Record<string, SunPreset> = {
    dawn: { time: '05:45', fill: 4, sky: 'morning', orbX: 8, orbY: 75, shadow: 4.2 },
    morning: { time: '09:00', fill: 37, sky: 'morning', orbX: 25, orbY: 40, shadow: 1.8 },
    noon: { time: '12:30', fill: 52, sky: 'noon', orbX: 65, orbY: 20, shadow: 0.8 },
    afternoon: { time: '15:30', fill: 65, sky: 'afternoon', orbX: 80, orbY: 38, shadow: 1.5 },
    sunset: { time: '18:10', fill: 76, sky: 'sunset', orbX: 90, orbY: 68, shadow: 3.5 },
    night: { time: '22:00', fill: 92, sky: 'sunset', orbX: 98, orbY: 88, shadow: 0 },
};

const MATERIALS = [
    { id: 'STN-001', name: 'Calacatta Marble', type: 'Stone', class: 'sw-texture-marble', img: '/textures/calacatta_marble_texture_1772480647171.png' },
    { id: 'STN-004', name: 'Roman Travertine', type: 'Stone', class: 'sw-texture-travertine', img: '/textures/roman_travertine_texture_1772480671250.png' },
    { id: 'CER-012', name: 'Venezia Terrazzo', type: 'Stone', class: 'sw-texture-terrazzo', img: '/textures/venezia_terrazzo_texture_1772480683244.png' },
    { id: 'CON-002', name: 'Polished Concrete', type: 'Stone', class: 'sw-texture-concrete', img: '/textures/polished_concrete_texture_1772480698967.png' },
    { id: 'WD-008', name: 'Solid White Oak', type: 'Wood', class: 'sw-texture-oak', img: '/textures/white_oak_texture_1772480731784.png' },
    { id: 'MET-003', name: 'Brushed Brass', type: 'Metal', class: 'sw-texture-brass', img: '/textures/brushed_brass_texture_1772480744636.png' },
    { id: 'GLS-001', name: 'Low-Iron Glass', type: 'Glass', class: 'sw-texture-glass', img: '/textures/frosted_glass_texture_1772480759554.png' },
    { id: 'CER-032', name: 'Antique Brick', type: 'Stone', class: 'sw-texture-brick', img: '/textures/antique_brick_texture_1772480777746.png' },
];

const NAV_SECTIONS = [
    '01 Pairing', '02 Gallery', '03 HUD', '04 Inspector',
    '05 Review', '06 Minimap', '07 Collaborators', '08 Settings',
    '09 Onboarding', '10 Measurement', '11 Materials', '12 Sun simulator',
    '13 Presentation', '14 Keyboard',
    '15 Loading', '16 Notifications', '17 AI Voice', '18 Export',
    '19 Lobby', '20 Note Flow', '21 Summary', '22 Login', '23 Native Load', '24 Native Settings', '25 Invite', '26 Native HUD'
];

const LOAD_STEPS = [
    { label: 'Project metadata', pct: 15 },
    { label: 'BIM geometry (234 objects)', pct: 35 },
    { label: 'Textures & materials', pct: 62 },
    { label: 'Lighting bake', pct: 82 },
    { label: 'Collaborator sync', pct: 100 },
];

const WAVEFORM_HEIGHTS = [4, 8, 14, 22, 30, 36, 42, 38, 28, 20, 14, 8, 6, 10, 18, 28, 36, 40, 36, 26, 16, 10, 6, 8, 12, 20, 30, 38, 32, 22, 14, 8, 5];

const VOICE_COMMANDS = [
    { icon: '📏', name: 'Open measurements', desc: 'Show spatial measurement tool', shortcut: 'MEAS', matched: true },
    { icon: '🗺️', name: 'Show minimap', desc: 'Toggle floor plan overlay', shortcut: 'MAP', matched: false },
    { icon: '📸', name: 'Take snapshot', desc: 'Capture current view', shortcut: 'SNAP', matched: false },
    { icon: '🔇', name: 'Mute [name]', desc: 'Mute a collaborator', shortcut: 'MUTE', matched: false },
    { icon: '⚡', name: 'Go to [room]', desc: 'Teleport to named space', shortcut: 'GOTO', matched: false },
    { icon: '💬', name: 'Add note', desc: 'Create voice annotation', shortcut: 'NOTE', matched: false },
];

const EXPORT_OPTIONS = [
    { icon: '🖼', name: 'High-res Snapshot', desc: 'PNG · 4K · With HUD overlay', size: '~8.2 MB' },
    { icon: '🎬', name: 'Screen Recording', desc: 'MP4 · 1080p · 60fps', size: '—' },
    { icon: '📋', name: 'Measurement Report', desc: 'PDF · All saved measurements', size: '~0.4 MB' },
    { icon: '🏗', name: 'BIM Export', desc: 'IFC 4.0 · Full model', size: '~42 MB' },
];

export default function VRInterfacePage() {
    const screensRef = useRef<(HTMLElement | null)[]>([]);
    const bldRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    // ── Render ──
    const [calStep, setCalStep] = useState(3);
    const [selectedMat, setSelectedMat] = useState(MATERIALS[0]);
    const [activePreset, setActivePreset] = useState('noon');
    const [kbPressed, setKbPressed] = useState<string | null>(null);
    const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
        snap: true, vignette: true, spatial: true, grid: false,
    });

    // Vol 3 states
    const [loadStep, setLoadStep] = useState(2);
    const [loadPct, setLoadPct] = useState(35);
    const [floorCount, setFloorCount] = useState(3);
    const [toastVisible, setToastVisible] = useState<Record<string, boolean>>({ critical: true, warning: true, success: true, info: true });
    const [selectedExport, setSelectedExport] = useState(0);
    const [obScene, setObScene] = useState(1);
    const [activeFormat, setActiveFormat] = useState('PNG');
    const [activeRes, setActiveRes] = useState('4K');
    const [exportToggles, setExportToggles] = useState<Record<string, boolean>>({ hud: true, watermark: false, metadata: true });
    const [activeThumb, setActiveThumb] = useState(0);
    const [sunDay, setSunDay] = useState(60); // March 1st approx
    const [activeSettingTab, setActiveSettingTab] = useState('Movement');
    const [activeSettingTab08, setActiveSettingTab08] = useState('Movement');
    const [showCalendar, setShowCalendar] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(2026, 2, 1)); // Default to March
    const [activeMatTab, setActiveMatTab] = useState('All');
    const [showMatRequest, setShowMatRequest] = useState(false);
    const [matRequestDesc, setMatRequestDesc] = useState('');
    const [matRequestName, setMatRequestName] = useState('');



    const getDayOfYearDate = (day: number) => {
        const date = new Date(2026, 0); // Jan 1st 2026
        date.setDate(day);
        return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
    };

    const handleCalDayClick = (dayNum: number) => {
        const startOfYear = new Date(2026, 0, 1);
        const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), dayNum);
        const diff = selectedDate.getTime() - startOfYear.getTime();
        const d = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        setSunDay(d);
        setShowCalendar(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const getCalendarDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    // ── Sun Analysis Data Calculation ──
    const sunAnalysis = useMemo(() => {
        const activeProj = PROJECTS.find(p => p.active) || PROJECTS[0];
        const projLat = activeProj.lat || 41.9;

        // Simple seasonal model
        const rad = (sunDay - 80) * (2 * Math.PI / 365);
        const declination = 23.44 * Math.sin(rad); // Solar declination approx

        // Day length formula (approximate)
        const lat_rad = projLat * (Math.PI / 180);
        const d_rad = declination * (Math.PI / 180);
        const cos_ws = -Math.tan(lat_rad) * Math.tan(d_rad);
        const ws = Math.acos(Math.max(-1, Math.min(1, cos_ws)));
        const dayLengthHrs = (2 * ws * 180 / Math.PI) / 15;

        const noonVal = 12 + (sunDay < 182 ? 0.25 : -0.25); // Simple EqoTime
        const sunrise = noonVal - (dayLengthHrs / 2);
        const sunset = noonVal + (dayLengthHrs / 2);

        const formatTime = (h: number) => {
            const hrs = Math.floor(h);
            const mins = Math.floor((h % 1) * 60);
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        };

        const dayLenFmt = `${Math.floor(dayLengthHrs)}h ${Math.floor((dayLengthHrs % 1) * 60)}m`;

        return { sunrise: formatTime(sunrise), sunset: formatTime(sunset), noon: formatTime(noonVal), dayLength: dayLenFmt, declination };
    }, [sunDay]);

    // Apply seasonal shift to current sun state
    const adjustedSunState = useMemo(() => {
        const shiftY = sunAnalysis.declination * 0.8; // Move sun up/down based on season
        const shadowScale = 1.0 - (sunAnalysis.declination / 50); // Shorter shadows in summer
        const base = SUN_PRESETS[activePreset as keyof typeof SUN_PRESETS] || SUN_PRESETS.noon;

        return {
            ...base,
            orbY: base.orbY - shiftY,
            shadow: Math.max(0.2, base.shadow * shadowScale)
        };
    }, [sunAnalysis, activePreset]);

    const scrollToScreen = (idx: number) => {
        screensRef.current[idx]?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        const idx = screensRef.current.indexOf(e.target as HTMLElement);
                        if (idx >= 0) setActiveIdx(idx);
                    }
                });
            },
            { threshold: 0.3 }
        );
        screensRef.current.forEach((s) => s && observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Calibration timer demo
    useEffect(() => {
        if (activeIdx === 8 && calStep < 6) {
            const timer = setTimeout(() => setCalStep(s => s + 1), 3000);
            return () => clearTimeout(timer);
        }
    }, [activeIdx, calStep]);

    // Loading animation (Screen 15)
    useEffect(() => {
        if (activeIdx === 14 && loadStep < LOAD_STEPS.length) {
            const timer = setTimeout(() => {
                const step = LOAD_STEPS[loadStep];
                setLoadPct(step.pct);
                setFloorCount(prev => Math.min(prev + 3, 12));
                setLoadStep(s => s + 1);
            }, 2800);
            return () => clearTimeout(timer);
        }
    }, [activeIdx, loadStep]);

    const handleKbPress = (char: string) => {
        setKbPressed(char);
        setTimeout(() => setKbPressed(null), 150);
    };

    const toggleSwitch = (key: string) => {
        setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="vr-ui">
            {/* ── STYLES & FONTS ── */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />

            {/* ── NAVIGATION ── */}
            <nav className="vr-nav" style={{ position: 'fixed', width: '100%', background: 'rgba(13,12,11,0.95)', zIndex: 1000 }}>
                <Link to="/dashboard" className="vr-nav-logo">
                    <div className="vr-nav-logo-sq">
                        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    VR Architecture
                </Link>
                <div className="vr-nav-links" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                    {NAV_SECTIONS.map((label, i) => (
                        <button key={label} className={`vr-nav-link${activeIdx === i ? ' active' : ''}`} onClick={() => scrollToScreen(i)}>
                            {label}
                        </button>
                    ))}
                </div>
                <Link to="/dashboard" className="vr-nav-back" style={{ whiteSpace: 'nowrap' }}>← Dashboard</Link>
            </nav>

            <div style={{ paddingTop: 52 }}>
                {/* 01 PAIRING */}
                <section className="vr-screen" ref={el => { screensRef.current[0] = el; }} id="s01"
                    style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(45,91,227,0.08), transparent 60%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 01 / VR Pairing & Welcome</div>
                        <h2 className="vr-screen-title">Put on your headset,<br /><em>let's connect.</em></h2>
                        <div className="pairing-wrap">
                            <div className="pairing-card welcome-card">
                                <div className="welcome-avatar">SE</div>
                                <div>
                                    <div className="welcome-text-label">Welcome back</div>
                                    <div className="welcome-name">Sarah Eriksson</div>
                                    <div className="welcome-sub">Eriksson & Partners · Stockholm</div>
                                </div>
                                <div className="welcome-status"><div className="status-dot" /> Session active</div>
                            </div>
                            <div className="pairing-card">
                                <div className="pairing-section-label">Pairing code</div>
                                <div className="code-row">
                                    <div className="code-box">4</div><div className="code-box">8</div>
                                    <div className="code-box active"><div className="code-cursor" /></div>
                                    <div className="code-box" style={{ opacity: 0.2 }}>—</div>
                                    <div className="code-box" style={{ opacity: 0.2 }}>—</div>
                                    <div className="code-box" style={{ opacity: 0.2 }}>—</div>
                                </div>
                                <div className="code-hint">Enter the 6-digit code shown in your headset</div>
                            </div>
                            <div className="pairing-card">
                                <div className="qr-area">
                                    <div className="pairing-section-label" style={{ marginBottom: 12 }}>Or scan QR code</div>
                                    <div className="qr-frame" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, width: 120, height: 120, padding: 10, background: 'rgba(245,243,239,0.92)', borderRadius: 12 }}>
                                        {QR_PATTERN.slice(0, 49).map((v, i) => <div key={i} className="qr-cell" style={{ background: v ? '#1A1917' : 'white', borderRadius: 1 }} />)}
                                    </div>
                                    <div className="qr-label">Point headset browser at this code</div>
                                    <div className="qr-steps">
                                        <div className="qr-step"><div className="qr-step-num">1</div>Open browser in Meta Quest</div>
                                        <div className="qr-step"><div className="qr-step-num">2</div>Scan this QR code</div>
                                        <div className="qr-step"><div className="qr-step-num">3</div>Install & sign in</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 02 GALLERY */}
                <section className="vr-screen" ref={el => { screensRef.current[1] = el; }} id="s02"
                    style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(184,149,78,0.06), transparent 60%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 02 / Immersive Project Gallery</div>
                        <h2 className="vr-screen-title">Choose a project<br /><em>to enter.</em></h2>
                        <div className="gallery-arc">
                            {PROJECTS.map((p, i) => {
                                const arcPositions = [
                                    { left: '3%', bottom: 20, rotate: -6, z: 1 },
                                    { left: '19%', bottom: 50, rotate: -3, z: 2 },
                                    { left: '35%', bottom: 65, rotate: 0, z: 5 },
                                    { left: '51%', bottom: 50, rotate: 3, z: 2 },
                                    { left: '67%', bottom: 20, rotate: 6, z: 1 },
                                ];
                                const pos = arcPositions[i];
                                return (
                                    <div key={i} className={`project-card${p.active ? ' featured' : ''}`}
                                        style={{ left: pos.left, bottom: pos.bottom, transform: `rotate(${pos.rotate}deg)`, zIndex: pos.z }}>
                                        <div className="pc-preview" style={{ background: `linear-gradient(160deg, ${p.color}22, rgba(13,12,11,0.8))` }}>
                                            <div className="pc-3d-icon">{p.icon}</div>
                                            <div className="pc-overlay" />
                                            <div className={`pc-badge ${p.status}`}>{p.status}</div>
                                        </div>
                                        <div className="pc-body">
                                            <div className="pc-project">{p.name}</div>
                                            <div className="pc-client">{p.client}</div>
                                            <button className={`pc-join${p.active ? ' active' : ''}`}>{p.active ? '▶ Active Session' : '→ Join Project'}</button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="arc-line" />
                        </div>
                    </div>
                </section>

                {/* 03 HUD */}
                <section className="vr-screen" ref={el => { screensRef.current[2] = el; }} id="s03"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(45,91,227,0.05), transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 03 / Global HUD & Tool Palette</div>
                        <h2 className="vr-screen-title">Always at hand,<br /><em>never in the way.</em></h2>
                        <div className="hud-scene">
                            <div className="hud-float-label hfl-1">📐 Wall: 3.40m</div>
                            <div className="hud-float-label hfl-2">🪟 Window · W-04</div>
                            <div className="hud-float-label hfl-3">📏 Distance: 1.20m</div>
                            <div className="hud-bar">
                                <div className="hud-section">
                                    <div className="hud-layer-toggle">
                                        <div className="hud-layer"><div className="hud-layer-dot" style={{ background: 'rgba(45,91,227,0.7)' }} />Walls</div>
                                        <div className="hud-layer off"><div className="hud-layer-dot" style={{ background: 'rgba(184,149,78,0.7)' }} />Furniture</div>
                                        <div className="hud-layer"><div className="hud-layer-dot" style={{ background: 'rgba(26,122,74,0.7)' }} />MEP</div>
                                    </div>
                                </div>
                                <div className="hud-divider" />
                                <div className="hud-section">
                                    <div className="hud-btn active"><div className="hud-btn-icon">✏️</div><div className="hud-btn-label">Draw</div></div>
                                    <div className="hud-btn"><div className="hud-btn-icon">📏</div><div className="hud-btn-label">Measure</div></div>
                                    <div className="hud-btn"><div className="hud-btn-icon">📷</div><div className="hud-btn-label">Capture</div></div>
                                    <div className="hud-btn"><div className="hud-btn-icon">🗒️</div><div className="hud-btn-label">Note</div></div>
                                </div>
                                <div className="hud-divider" />
                                <div className="hud-section">
                                    <div className="hud-btn"><div className="hud-btn-icon">🗺️</div><div className="hud-btn-label">Map</div></div>
                                    <div className="hud-btn"><div className="hud-btn-icon">⚡</div><div className="hud-btn-label">Jump</div></div>
                                </div>
                                <div className="hud-divider" />
                                <div className="hud-section">
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)', border: '2px solid rgba(13,12,11,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: 'white' }}>SE</div>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#1A7A4A,#059669)', border: '2px solid rgba(13,12,11,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: 'white', marginLeft: -6 }}>AK</div>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#B45309,#D97706)', border: '2px solid rgba(13,12,11,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, color: 'white', marginLeft: -6 }}>MJ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 04 INSPECTOR */}
                <section className="vr-screen" ref={el => { screensRef.current[3] = el; }} id="s04"
                    style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(184,149,78,0.05), transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 04 / BIM Property Inspector</div>
                        <h2 className="vr-screen-title">Every object<br /><em>tells its story.</em></h2>
                        <div className="bim-scene">
                            <div className="bim-object-area">
                                <div className="bim-object-visual">
                                    <div className="bim-door-arch" />
                                    <div className="bim-door-handle" />
                                    <div className="bim-select-ring" />
                                    <div className="bim-pointer-line" />
                                    <div className="bim-pointer-dot" />
                                </div>
                            </div>
                            <div className="bim-panel">
                                <div className="bim-header">
                                    <div className="bim-header-icon">🚪</div>
                                    <div><div className="bim-header-title">Interior Door · Single-leaf</div><div className="bim-header-id">BIM-ID: D-104 · Level 2 · Zone A</div></div>
                                </div>
                                <div className="bim-rows">
                                    <div className="bim-row"><div className="bim-row-key">MATERIAL</div><div className="bim-row-val">Solid Oak · Grade A</div></div>
                                    <div className="bim-row"><div className="bim-row-key">MANUFACTURER</div><div className="bim-row-val">Dorma Hüppe GmbH</div></div>
                                    <div className="bim-row"><div className="bim-row-key">DIMENSIONS</div><div className="bim-row-val">900 × 2100 × 45mm</div></div>
                                    <div className="bim-row"><div className="bim-row-key">FIRE RATING</div><div className="bim-row-val tag">EI 30</div></div>
                                    <div className="bim-row"><div className="bim-row-key">UNIT COST</div><div className="bim-row-val highlight">€ 1,240</div></div>
                                    <div className="bim-row"><div className="bim-row-key">INSTALL STATUS</div><div className="bim-row-val" style={{ color: 'rgba(184,149,78,0.8)' }}>Pending</div></div>
                                    <div className="bim-row"><div className="bim-row-key">QUANTITY</div><div className="bim-row-val">14 units · Floor 2</div></div>
                                </div>
                                <div className="bim-footer">
                                    <button className="bim-btn primary">📋 Full Spec</button>
                                    <button className="bim-btn secondary">✏️ Edit</button>
                                    <button className="bim-btn secondary">🔗 Link</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 05 REVIEW */}
                <section className="vr-screen" ref={el => { screensRef.current[4] = el; }} id="s05"
                    style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(26,122,74,0.05), transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 05 / Review & Annotation Panel</div>
                        <h2 className="vr-screen-title">Leave a mark,<br /><em>move things forward.</em></h2>
                        <div className="review-layout">
                            <div className="annotation-list">
                                <div className="annotation-item critical">
                                    <div className="ai-top">
                                        <div className="ai-avatar" style={{ background: 'linear-gradient(135deg,#C0392B,#E74C3C)' }}>SE</div>
                                        <div className="ai-author">Sarah Eriksson</div>
                                        <div className="ai-tag critical">Critical</div>
                                        <div className="ai-time">2m ago</div>
                                    </div>
                                    <div className="ai-text">The kitchen island clearance is 700mm — below the 900mm minimum. This will block wheelchair access and fail the accessibility audit.</div>
                                    <div className="ai-actions">
                                        <button className="ai-action-btn approve">✓ Approve</button>
                                        <button className="ai-action-btn reject">✕ Reject</button>
                                        <button className="ai-action-btn reply">↩ Reply</button>
                                    </div>
                                </div>
                                <div className="annotation-item">
                                    <div className="ai-top">
                                        <div className="ai-avatar" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>AK</div>
                                        <div className="ai-author">Ahmet Koç</div>
                                        <div className="ai-tag review">Review</div>
                                        <div className="ai-time">15m ago</div>
                                    </div>
                                    <div className="ai-text">Skylight positioning looks great from this angle. Natural light hits the living space perfectly at noon.</div>
                                    <div className="ai-actions">
                                        <button className="ai-action-btn approve">✓ Approve</button>
                                        <button className="ai-action-btn reject">✕ Reject</button>
                                        <button className="ai-action-btn reply">↩ Reply</button>
                                    </div>
                                </div>
                                <div className="annotation-item resolved" style={{ opacity: 0.45 }}>
                                    <div className="ai-top">
                                        <div className="ai-avatar" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>MJ</div>
                                        <div className="ai-author">Maria Johansson</div>
                                        <div className="ai-tag ok">Resolved</div>
                                        <div className="ai-time">1h ago</div>
                                    </div>
                                    <div className="ai-text">Staircase railing height updated to 1050mm per client request. Structural check passed.</div>
                                    <div className="ai-actions"><button className="ai-action-btn reply">↩ Reply</button></div>
                                </div>
                            </div>
                            <div className="review-sidebar">
                                <div className="review-new-note">
                                    <div className="rnn-label">New annotation</div>
                                    <textarea className="rnn-textarea" placeholder="Describe the issue or decision…" />
                                    <div className="rnn-row">
                                        <button className="rnn-voice" title="Record voice note">🎙</button>
                                        <button className="rnn-submit">Add to review →</button>
                                    </div>
                                </div>
                                <div className="review-stats">
                                    <div className="rs-stat"><div className="rs-num" style={{ color: 'rgba(192,57,43,0.8)' }}>3</div><div className="rs-label">Critical</div></div>
                                    <div className="rs-stat"><div className="rs-num" style={{ color: 'rgba(184,149,78,0.8)' }}>7</div><div className="rs-label">In Review</div></div>
                                    <div className="rs-stat"><div className="rs-num" style={{ color: 'rgba(26,122,74,0.8)' }}>24</div><div className="rs-label">Resolved</div></div>
                                    <div className="rs-stat"><div className="rs-num">34</div><div className="rs-label">Total</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 06 MINIMAP */}
                <section className="vr-screen" ref={el => { screensRef.current[5] = el; }} id="s06"
                    style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(45,91,227,0.04), transparent 60%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 06 / Minimap & Floor Navigator</div>
                        <h2 className="vr-screen-title">Know the space,<br /><em>own the space.</em></h2>
                        <div className="minimap-wrap">
                            <div className="blueprint-map">
                                <div className="bp-floor-plan">
                                    <div className="bp-room" style={{ left: 10, top: 10, width: 180, height: 130 }}><div className="bp-room-label">Living Room</div></div>
                                    <div className="bp-room" style={{ left: 200, top: 10, width: 120, height: 80 }}><div className="bp-room-label">Kitchen</div></div>
                                    <div className="bp-room" style={{ left: 200, top: 100, width: 120, height: 40 }}><div className="bp-room-label">Dining</div></div>
                                    <div className="bp-room" style={{ left: 10, top: 150, width: 80, height: 100 }}><div className="bp-room-label">Master Bed</div></div>
                                    <div className="bp-room" style={{ left: 100, top: 150, width: 80, height: 50 }}><div className="bp-room-label">Bed 2</div></div>
                                    <div className="bp-room" style={{ left: 100, top: 210, width: 80, height: 40 }}><div className="bp-room-label">Bath</div></div>
                                    <div className="bp-room" style={{ left: 190, top: 150, width: 130, height: 100 }}><div className="bp-room-label">Terrace</div></div>
                                    <div className="bp-you" style={{ left: 90, top: 60 }}>
                                        <div className="bp-you-ring"><div className="bp-you-dot" /></div>
                                        <div className="bp-you-label">YOU</div>
                                    </div>
                                    <div className="bp-poi" style={{ left: 240, top: 35 }}><div className="bp-poi-dot" /><div className="bp-poi-label">Kitchen</div></div>
                                    <div className="bp-poi" style={{ left: 40, top: 190 }}><div className="bp-poi-dot" /><div className="bp-poi-label">Master</div></div>
                                    <div className="bp-poi" style={{ left: 250, top: 195 }}><div className="bp-poi-dot" /><div className="bp-poi-label">Terrace</div></div>
                                </div>
                            </div>
                            <div className="minimap-sidebar">
                                <div className="mm-floor-sel">
                                    <div className="mm-floor-item"><div className="mm-floor-num">B1</div>Basement<div className="mm-floor-tp">JUMP</div></div>
                                    <div className="mm-floor-item"><div className="mm-floor-num">G</div>Ground Floor<div className="mm-floor-tp">JUMP</div></div>
                                    <div className="mm-floor-item active"><div className="mm-floor-num">1F</div>First Floor<div className="mm-floor-tp">HERE</div></div>
                                    <div className="mm-floor-item"><div className="mm-floor-num">2F</div>Second Floor<div className="mm-floor-tp">JUMP</div></div>
                                    <div className="mm-floor-item"><div className="mm-floor-num">RF</div>Roof Terrace<div className="mm-floor-tp">JUMP</div></div>
                                </div>
                                <div className="mm-legend">
                                    <div className="mm-legend-title">Legend</div>
                                    <div className="mm-legend-item"><div className="mm-legend-dot" style={{ background: 'var(--vr-blue)' }} />Your position</div>
                                    <div className="mm-legend-item"><div className="mm-legend-dot" style={{ background: 'rgba(184,149,78,0.7)' }} />Jump points</div>
                                    <div className="mm-legend-item"><div className="mm-legend-dot" style={{ background: 'rgba(26,122,74,0.7)' }} />Collaborators</div>
                                    <div className="mm-legend-item"><div className="mm-legend-dot" style={{ background: 'rgba(192,57,43,0.7)' }} />Annotations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 07 COLLABORATORS */}
                <section className="vr-screen" ref={el => { screensRef.current[6] = el; }} id="s07"
                    style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(124,58,237,0.05), transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 07 / Collaborator Management</div>
                        <h2 className="vr-screen-title">Who's in the room<br /><em>with you.</em></h2>
                        <div className="collab-layout">
                            <div className="collab-list">
                                <div className="collab-item speaking">
                                    <div className="ci-avatar speaking" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>SE</div>
                                    <div className="ci-info">
                                        <div className="ci-name">Sarah Eriksson</div>
                                        <div className="ci-role">Architect · Lead</div>
                                        <div className="ci-location"><div className="ci-location-dot" />Living Room · Looking at Window W-03</div>
                                    </div>
                                    <div className="ci-actions">
                                        <div className="ci-action">👁️</div>
                                        <div className="ci-action teleport" title="Teleport to them">⚡</div>
                                    </div>
                                </div>
                                <div className="collab-item">
                                    <div className="ci-avatar" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>AK</div>
                                    <div className="ci-info">
                                        <div className="ci-name">Ahmet Koç</div>
                                        <div className="ci-role">Interior Designer</div>
                                        <div className="ci-location"><div className="ci-location-dot" />Master Bedroom · Measuring wall</div>
                                    </div>
                                    <div className="ci-actions">
                                        <div className="ci-action">👁️</div>
                                        <div className="ci-action teleport">⚡</div>
                                    </div>
                                </div>
                                <div className="collab-item">
                                    <div className="ci-avatar" style={{ background: 'linear-gradient(135deg,#B45309,#D97706)' }}>MJ</div>
                                    <div className="ci-info">
                                        <div className="ci-name">Marcus Jensen</div>
                                        <div className="ci-role">Client · Developer</div>
                                        <div className="ci-location"><div className="ci-location-dot" />Terrace · Idle</div>
                                    </div>
                                    <div className="ci-actions">
                                        <div className="ci-action muted" title="Muted">🔇</div>
                                        <div className="ci-action">👁️</div>
                                        <div className="ci-action teleport">⚡</div>
                                    </div>
                                </div>
                            </div>
                            <div className="collab-minimap">
                                <div className="cm-title">Room view · 1F</div>
                                <div className="cm-map">
                                    <div className="cm-avatar-dot cm-you" style={{ left: '35%', top: '40%' }}>You</div>
                                    <div className="cm-avatar-dot" style={{ left: '55%', top: '30%', background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>SE</div>
                                    <div className="cm-avatar-dot" style={{ left: '25%', top: '65%', background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>AK</div>
                                    <div className="cm-avatar-dot" style={{ left: '75%', top: '55%', background: 'linear-gradient(135deg,#B45309,#D97706)' }}>MJ</div>
                                </div>
                                <div style={{ marginTop: 12, fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(245,243,239,0.15)', textAlign: 'center' }}>4 people · 1 floor · 2 floors active</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 08 SETTINGS */}
                <section className="vr-screen" ref={el => { screensRef.current[7] = el; }} id="s08"
                    style={{ background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.02), transparent 60%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 08 / System & Rendering Settings</div>
                        <h2 className="vr-screen-title">Configure the<br /><em>experience.</em></h2>
                        <div className="settings-wrap">
                            <div className="settings-nav">
                                {[
                                    { id: 'Movement', icon: '🚶' },
                                    { id: 'Audio', icon: '🔊' },
                                    { id: 'Lighting', icon: '💡' },
                                    { id: 'Rendering', icon: '🖥️' },
                                    { id: 'Accessibility', icon: '♿' }
                                ].map(tab => (
                                    <div key={tab.id} className={`sn-item ${activeSettingTab08 === tab.id ? 'active' : ''}`} onClick={() => setActiveSettingTab08(tab.id)}>
                                        <div className="sn-icon">{tab.icon}</div>{tab.id}
                                    </div>
                                ))}
                            </div>
                            <div className="settings-panel">
                                {activeSettingTab08 === 'Movement' && (
                                    <div className="sp-section">
                                        <div className="sp-section-title">Movement Mode</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Snap rotation</div><div className="sp-row-desc">45° turns instead of smooth</div></div>
                                            <div className={`sp-toggle ${toggleStates.snap ? 'on' : ''}`} onClick={() => toggleSwitch('snap')} />
                                        </div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Vignette on move</div><div className="sp-row-desc">Reduces motion sickness</div></div>
                                            <div className={`sp-toggle ${toggleStates.vignette ? 'on' : ''}`} onClick={() => toggleSwitch('vignette')} />
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab08 === 'Audio' && (
                                    <div className="sp-section">
                                        <div className="sp-section-title">Audio Experience</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Spatial audio</div><div className="sp-row-desc">3D voice positioning</div></div>
                                            <div className={`sp-toggle ${toggleStates.spatial ? 'on' : ''}`} onClick={() => toggleSwitch('spatial')} />
                                        </div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Master volume</div></div>
                                            <div className="sp-slider-wrap"><div className="sp-slider"><div className="sp-slider-fill" style={{ width: '72%' }} /></div><div className="sp-slider-val">72%</div></div>
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab08 === 'Lighting' && (
                                    <div className="sp-section">
                                        <div className="sp-section-title">Environment Lighting</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Real-time Shadows</div><div className="sp-row-desc">Dynamic shadow casting</div></div>
                                            <div className="sp-toggle on"></div>
                                        </div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Global Illumination</div><div className="sp-row-desc">Realistic light bounce</div></div>
                                            <div className="sp-toggle"></div>
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab08 === 'Rendering' && (
                                    <div className="sp-section">
                                        <div className="sp-section-title">Rendering Quality</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Show grid overlay</div><div className="sp-row-desc">Blueprint grid on surfaces</div></div>
                                            <div className={`sp-toggle ${toggleStates.grid ? 'on' : ''}`} onClick={() => toggleSwitch('grid')} />
                                        </div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Shadow quality</div></div>
                                            <div className="sp-mode-group">
                                                <div className="sp-mode">Low</div>
                                                <div className="sp-mode active">Medium</div>
                                                <div className="sp-mode">High</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab08 === 'Accessibility' && (
                                    <div className="sp-section">
                                        <div className="sp-section-title">Visual Aids</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">High Contrast</div><div className="sp-row-desc">Enhances UI visibility</div></div>
                                            <div className="sp-toggle"></div>
                                        </div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Text Size</div></div>
                                            <div className="sp-mode-group">
                                                <div className="sp-mode active">Normal</div>
                                                <div className="sp-mode">Large</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 09 ONBOARDING */}
                <section className="vr-screen" ref={el => { screensRef.current[8] = el; }} id="s09"
                    style={{ background: 'radial-gradient(circle at 30% 70%, rgba(45,91,227,0.1) 0%, transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 09 / Onboarding & Global Tutorial</div>
                        <h2 className="vr-screen-title">Step into<br /><em>the experience.</em></h2>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} className={`vr-btn ${obScene === s ? 'active' : ''}`} onClick={() => setObScene(s)} style={{ fontSize: 10, padding: '4px 12px', border: '1px solid var(--vr-border)', borderRadius: 100 }}>
                                    Scene {s}
                                </button>
                            ))}
                        </div>
                        <div className="ob-scene-full">
                            {obScene === 1 && (
                                <div style={{ textAlign: 'center' }}>
                                    <h3 className="ob-scene-title">Welcome</h3>
                                    <p style={{ color: 'rgba(245,243,239,0.4)', marginTop: 8 }}>VR Architecture · Session Ready</p>
                                    <div className="mv-crosshair" style={{ marginTop: 40, position: 'relative', left: 'auto', top: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="ch-h" style={{ width: 60 }}></div><div className="ch-v" style={{ height: 60 }}></div>
                                        <div style={{ width: 80, height: 80, border: '2px solid var(--vr-blue)', borderRadius: '50%', opacity: 0.3 }}></div>
                                    </div>
                                    <div className="tag t-green" style={{ marginTop: 24 }}>GAZE TO START</div>
                                </div>
                            )}
                            {obScene === 2 && (
                                <div style={{ textAlign: 'center' }}>
                                    <div className="li-label">CURRENT PLOT</div>
                                    <h3 style={{ fontFamily: 'var(--vr-serif)', fontSize: 24, marginTop: 12 }}>Preparing Foundation...</h3>
                                    <div className="load-bar-track" style={{ width: 300, margin: '24px auto', height: 4 }}>
                                        <div className="load-bar-fill" style={{ width: '40%' }}></div>
                                    </div>
                                    <div style={{ color: 'var(--vr-blue)', fontFamily: 'var(--vr-mono)', fontSize: 12 }}>34.2 m x 22.0 m</div>
                                </div>
                            )}
                            {obScene === 3 && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--vr-border)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👤</div>
                                    <h3 style={{ fontFamily: 'var(--vr-serif)', fontSize: 24 }}>Sarah Eriksson</h3>
                                    <p className="li-label" style={{ marginTop: 4 }}>Lead Architect</p>
                                    <div className="gp" style={{ marginTop: 24, padding: '16px 24px', borderRadius: 20, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--vr-border)', maxWidth: 320, marginInline: 'auto' }}>
                                        "Welcome to the session! I'll be your guide through the Villa Bianca prototype."
                                    </div>
                                    <button className="gp" style={{ marginTop: 32, padding: '10px 24px', borderRadius: 100, background: 'rgba(110, 231, 183, 0.1)', border: '1px solid rgba(110, 231, 183, 0.3)', color: '#6ee7b7', fontSize: 11, cursor: 'pointer' }}>Handshake — Continue</button>
                                </div>
                            )}
                            {obScene === 4 && (
                                <div style={{ textAlign: 'center' }}>
                                    <div className="li-label">STEP 1 / 3</div>
                                    <h3 style={{ fontFamily: 'var(--vr-serif)', fontSize: 20, marginTop: 12 }}>Point the right controller<br />at the object</h3>
                                    <div style={{ marginTop: 40, display: 'flex', gap: 24, justifyContent: 'center', position: 'relative' }}>
                                        <div style={{ width: 44, height: 88, borderRadius: 22, border: '1px solid var(--vr-border)', background: 'rgba(255,255,255,0.02)' }}></div>
                                        <div style={{ width: 44, height: 88, borderRadius: 22, border: '1px solid var(--vr-blue)', background: 'rgba(45,91,227,0.1)', boxShadow: '0 0 20px rgba(45,91,227,0.2)' }}></div>
                                        <div style={{ position: 'absolute', top: 52, right: 34, width: 6, height: 6, borderRadius: '50%', background: 'var(--vr-blue)', boxShadow: '0 0 10px var(--vr-blue)' }}></div>
                                    </div>
                                    <div className="tag" style={{ marginTop: 32 }}>PRESS TRIGGER</div>
                                </div>
                            )}
                            {obScene === 5 && (
                                <div style={{ textAlign: 'center', width: '100%', padding: 40 }}>
                                    <h3 className="ob-scene-title">First Flight</h3>
                                    <div style={{ position: 'absolute', top: 30, right: 30, textAlign: 'right' }}>
                                        <div style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>245 m</div>
                                        <div className="li-label">ALTITUDE</div>
                                    </div>
                                    <div className="load-bar-track" style={{ marginTop: 100, maxWidth: 300, marginInline: 'auto' }}>
                                        <div className="load-bar-fill" style={{ width: '75%' }}></div>
                                    </div>
                                    <p className="li-label" style={{ marginTop: 12 }}>MOVING TO VILLA BIANCA</p>
                                    <div className="tag t-blue" style={{ marginTop: 32 }}>FLYING INITIALIZED</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 10 MEASUREMENT */}
                <section className="vr-screen" ref={el => { screensRef.current[9] = el; }} id="s10">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 10 / Spatial Measurement Tool</div>
                        <h2 className="vr-screen-title">Point. Measure.<br /><em>Know the space.</em></h2>

                        <div className="measure-scene">
                            <div className="measure-viewport">
                                <div className="mv-grid"></div>
                                <div className="mv-grid-fade"></div>

                                <div className="mv-crosshair" style={{ top: '48%', left: '48%' }}>
                                    <div style={{ position: 'relative', width: 44, height: 44 }}>
                                        <div className="ch-h"></div>
                                        <div className="ch-v"></div>
                                        <div className="ch-c"></div>
                                    </div>
                                </div>

                                <div className="measure-line-wrap" style={{ top: '44%', left: '15%', right: '15%' }}>
                                    <div className="m-point"></div>
                                    <div className="m-line"></div>
                                    <div className="dim-label" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', margin: '0 -15px', padding: '8px 18px', borderRadius: 100, zIndex: 10 }}>
                                        3.40 <span style={{ fontSize: 11, color: 'rgba(245,243,239,0.45)', marginLeft: 3 }}>m</span>
                                    </div>
                                    <div className="m-line"></div>
                                    <div className="m-point" style={{ position: 'relative' }}>
                                        <div className="angle-wrap" style={{ position: 'absolute', bottom: -12, right: -40 }}>
                                            <div className="angle-arc" style={{ width: 44, height: 44 }}>
                                                <div className="angle-label" style={{ fontSize: 9 }}>87°</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', top: '56%', left: '38%', display: 'flex', alignItems: 'center', gap: 0 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(184,149,78,0.7)', border: '1px solid rgba(184,149,78,0.5)' }}></div>
                                    <div style={{ width: 45, height: 1.5, background: 'rgba(184,149,78,0.4)' }}></div>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(184,149,78,0.7)', border: '1px solid rgba(184,149,78,0.5)' }}></div>
                                    <div style={{ marginLeft: 8, fontFamily: 'var(--vr-mono)', fontSize: 11, color: 'rgba(184,149,78,0.7)', fontWeight: 500 }}>1.20m</div>
                                </div>

                                <div style={{ position: 'absolute', top: 16, left: 16 }} className="tag tag-blue"><div className="dot-pulse" style={{ color: 'var(--vr-blue)' }}></div>Measuring</div>
                                <div style={{ position: 'absolute', top: 16, right: 16 }} className="tag tag-dim">Hold trigger to place point</div>
                            </div>

                            <div className="measure-panel">
                                <div className="gp gp-sm mp-main" style={{ padding: '20px 24px' }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Primary distance</div>
                                    <div>
                                        <span className="mp-main-value">3.40</span>
                                        <span style={{ fontFamily: 'var(--vr-mono)', fontSize: 13, color: 'rgba(245,243,239,0.4)', marginLeft: 6 }}>m</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(245,243,239,0.3)', marginTop: 8, fontFamily: 'var(--vr-mono)' }}>340.0 cm · 11′ 1.8″</div>
                                </div>

                                <div className="gp gp-sm" style={{ overflow: 'hidden' }}>
                                    <div className="mp-stats">
                                        <div className="mp-stat" style={{ padding: '16px 18px' }}>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', textTransform: 'uppercase', marginBottom: 6 }}>Angle</div>
                                            <div className="gold" style={{ fontFamily: 'var(--vr-mono)', fontSize: 18, color: 'rgba(184,149,78,0.9)', fontWeight: 600 }}>87°</div>
                                        </div>
                                        <div className="mp-stat" style={{ padding: '16px 18px' }}>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', textTransform: 'uppercase', marginBottom: 6 }}>Height Δ</div>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 18, color: 'rgba(245,243,239,0.85)', fontWeight: 600 }}>+0.05m</div>
                                        </div>
                                        <div className="mp-stat" style={{ padding: '16px 18px' }}>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', textTransform: 'uppercase', marginBottom: 6 }}>Points</div>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 18, color: 'rgba(245,243,239,0.85)', fontWeight: 600 }}>2</div>
                                        </div>
                                        <div className="mp-stat" style={{ padding: '16px 18px' }}>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', textTransform: 'uppercase', marginBottom: 6 }}>Saved</div>
                                            <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 18, color: 'rgba(245,243,239,0.85)', fontWeight: 600 }}>4</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="gp gp-sm mp-history" style={{ padding: '16px 20px', flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Saved measurements</div>
                                    <div className="mp-hist-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.35)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>WALL-N</div>
                                        <div style={{ color: 'rgba(245,243,239,0.8)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--vr-mono)' }}>4.80m</div>
                                    </div>
                                    <div className="mp-hist-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.35)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>DOOR-W</div>
                                        <div style={{ color: 'rgba(245,243,239,0.8)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--vr-mono)' }}>0.90m</div>
                                    </div>
                                    <div className="mp-hist-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.35)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>CEILING</div>
                                        <div style={{ color: 'rgba(245,243,239,0.8)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--vr-mono)' }}>2.70m</div>
                                    </div>
                                    <div className="mp-hist-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.35)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>WIN-H</div>
                                        <div style={{ color: 'rgba(245,243,239,0.8)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--vr-mono)' }}>1.40m</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                    <button className="vr-btn" style={{ flex: 1, padding: '0 20px', height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,243,239,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                                        <span style={{ fontSize: 15 }}>💾</span> Save
                                    </button>
                                    <button className="vr-btn vr-btn-blue" style={{ flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 11 MATERIALS */}
                <section className="vr-screen" ref={el => { screensRef.current[10] = el; }} id="s11">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 11 / Material Picker & Swatch Wall</div>
                        <h2 className="vr-screen-title">Reach out,<br /><em>choose a surface.</em></h2>

                        <div className="material-wrap">
                            <div className="surface-tabs">
                                {['All', 'Stone', 'Wood', 'Metal', 'Glass'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`surf-tab ${activeMatTab === tab ? 'active' : ''}`}
                                        onClick={() => setActiveMatTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="tag tag-dim">{activeMatTab === 'All' ? MATERIALS.length : MATERIALS.filter(m => m.type === activeMatTab).length} materials</div>
                                    <button
                                        className="vr-btn"
                                        style={{ height: 28, fontSize: 10, padding: '0 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 8 }}
                                        onClick={() => setShowMatRequest(true)}
                                    >
                                        + Request Custom
                                    </button>
                                </div>
                            </div>

                            <div className="swatch-wall">
                                {MATERIALS
                                    .filter(m => activeMatTab === 'All' || m.type === activeMatTab)
                                    .map(m => (
                                        <div
                                            key={m.id}
                                            className={`swatch-card ${selectedMat.id === m.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedMat(m)}
                                        >
                                            <div className="sw-preview">
                                                <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div className="sw-overlay">
                                                    <div className="sw-type">{m.type}</div>
                                                </div>
                                            </div>
                                            <div className="sw-info">
                                                <div className="sw-name">{m.name}</div>
                                                <div className="sw-code">{m.id}</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <div className="gp swatch-toolbar">
                                <div className="st-selected-preview">
                                    <img src={selectedMat.img} alt={selectedMat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="st-selected-details" style={{ flex: 1, marginLeft: 16 }}>
                                    <div className="st-selection-label">Active Selection</div>
                                    <div className="st-selection-main">
                                        <div className="st-selected-name">{selectedMat.name}</div>
                                        <div className="st-selected-sub">{selectedMat.id}</div>
                                    </div>
                                </div>
                                <div className="st-actions">
                                    <button className="vr-btn st-btn-preview">👁 Preview</button>
                                    <button className="vr-btn vr-btn-green st-btn-apply">✓ Apply to Surface</button>
                                </div>
                            </div>
                        </div>

                        {/* MODAL OVERLAY */}
                        {showMatRequest && (
                            <div className="vr-modal-overlay">
                                <div className="vr-modal-card mat-request-card gp">
                                    <div className="modal-header">
                                        <h3 className="modal-title">Request Custom Texture</h3>
                                        <p className="modal-sub">Our architect team will generate this for your next session.</p>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label>Surface Name</label>
                                            <input
                                                className="vr-input-dark"
                                                value={matRequestName}
                                                onChange={e => setMatRequestName(e.target.value)}
                                                placeholder="e.g. Polished Rosso Levanto Marble"
                                            />
                                        </div>
                                        <div className="form-group pb-12">
                                            <label>Description & Reference</label>
                                            <textarea
                                                className="vr-input-dark"
                                                value={matRequestDesc}
                                                onChange={e => setMatRequestDesc(e.target.value)}
                                                placeholder="Specify vein pattern, color tone, or gloss level..."
                                                rows={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                                        <button className="vr-btn" style={{ flex: 1 }} onClick={() => setShowMatRequest(false)}>Cancel</button>
                                        <button
                                            className="vr-btn vr-btn-blue"
                                            style={{ flex: 1 }}
                                            onClick={async () => {
                                                try {
                                                    const reqData = {
                                                        name: matRequestName || 'Unknown Material',
                                                        description: matRequestDesc
                                                    };
                                                    await axiosInstance.post('/materials/request', reqData);
                                                    alert("Request submitted! Architect notified.");
                                                    setShowMatRequest(false);
                                                    setMatRequestName('');
                                                    setMatRequestDesc('');
                                                } catch (err) {
                                                    console.error("Failed to submit custom material request", err);
                                                    alert("Failed to submit request. Check console.");
                                                }
                                            }}
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 12 SUN SIMULATOR */}
                <section className="vr-screen" ref={el => { screensRef.current[11] = el; }} id="s12">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 12 / Sun & Shadow Simulator</div>
                        <h2 className="vr-screen-title">Move through<br /><em>a whole day.</em></h2>

                        <div className="sun-wrap">
                            <div>
                                <div className="sun-scene">
                                    <div className={`sun-sky ${adjustedSunState.sky}`} />
                                    <div className="sun-ground" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'rgba(13,12,11,0.6)' }} />
                                    <div className="sun-building-sil" />

                                    <div className="sun-shadow" style={{ transform: `translateX(${adjustedSunState.shadow * 20}px) scaleX(${adjustedSunState.shadow || 0.1}) scaleY(0.3)`, opacity: adjustedSunState.shadow > 0 ? 0.35 : 0 }} />
                                    <div className="sun-orb" style={{ top: `${adjustedSunState.orbY}%`, left: `${adjustedSunState.orbX}%` }} />

                                    <div className="sun-overlay">
                                        <div className="sun-time-display" style={{ padding: '12px 20px', borderRadius: 12, background: 'rgba(13,12,11,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                            <div className="sun-time-val" style={{ fontSize: 24, fontWeight: 600 }}>{adjustedSunState.time}</div>
                                            <div className="sun-time-label" style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.35)', letterSpacing: '.12em', marginTop: 4 }}>LOCAL TIME · {getDayOfYearDate(sunDay)}</div>
                                        </div>
                                        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(13,12,11,0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(245,243,239,0.4)', display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'right' }}>
                                            <div>AZIMUTH <strong style={{ color: 'rgba(245,243,239,0.85)', marginLeft: 6 }}>182°S</strong></div>
                                            <div>ELEVATION <strong style={{ color: 'rgba(245,243,239,0.85)', marginLeft: 6 }}>44°</strong></div>
                                        </div>
                                    </div>
                                    <div className="sun-shadow-angle" style={{ position: 'absolute', bottom: '38%', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(184,149,78,0.5)', pointerEvents: 'none' }}>
                                        SHADOW: 1.2× HEIGHT
                                    </div>
                                </div>

                                <div className="sun-presets" style={{ display: 'flex', gap: 6, marginTop: 12, padding: '0 4px' }}>
                                    {[
                                        { k: 'dawn', label: 'Dawn', icon: '🌅', h: 6 },
                                        { k: 'morning', label: 'Morning', icon: '🌤️', h: 9 },
                                        { k: 'noon', label: 'Noon', icon: '☀️', h: 12 },
                                        { k: 'afternoon', label: 'Afternoon', icon: '🌇', h: 15 },
                                        { k: 'sunset', label: 'Sunset', icon: '🌆', h: 18 },
                                        { k: 'night', label: 'Night', icon: '🌙', h: 22 }
                                    ].map(({ k, label, icon }) => (
                                        <button key={k} className={`sun-preset ${activePreset === k ? 'active' : ''}`} onClick={() => {
                                            setActivePreset(k);
                                        }}
                                            style={{ flex: 1, padding: '8px 0', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 13 }}>{icon}</span> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="sun-controls">
                                <div className={`gp gp-sm sun-ctrl-group analysis-panel-root ${showCalendar ? 'active-vcal' : ''}`} style={{ padding: '20px' }}>
                                    <div className="sun-slider-wrap">
                                        <div className="sun-slider-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ fontSize: 12, color: 'rgba(245,243,239,0.6)' }}>Analysis Date</div>
                                            <div style={{ position: 'relative' }}>
                                                <div className={`sun-date-trigger ${showCalendar ? 'active' : ''}`} onClick={() => setShowCalendar(!showCalendar)}>
                                                    {getDayOfYearDate(sunDay)}
                                                    <span style={{ marginLeft: 8, opacity: 0.4 }}>📅</span>
                                                </div>

                                                {showCalendar && (
                                                    <div className="vr-calendar-popover">
                                                        <div className="vcal-head">
                                                            <button onClick={() => changeMonth(-1)}>‹</button>
                                                            <div className="vcal-title">
                                                                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                            </div>
                                                            <button onClick={() => changeMonth(1)}>›</button>
                                                        </div>
                                                        <div className="vcal-weekdays">
                                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                                        </div>
                                                        <div className="vcal-grid">
                                                            {getCalendarDays().map((d, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`vcal-day ${d === null ? 'empty' : ''} ${d === new Date(2026, 0, sunDay).getDate() && viewDate.getMonth() === new Date(2026, 0, sunDay).getMonth() ? 'active' : ''}`}
                                                                    onClick={() => d && handleCalDayClick(d)}
                                                                >
                                                                    {d}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="gp gp-sm sun-ctrl-group sun-data-panel-root" style={{ padding: '20px', flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Sun data</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>SUNRISE</div>
                                        <div style={{ color: 'rgba(245,243,239,0.85)', fontFamily: 'var(--vr-mono)', fontSize: 12, fontWeight: 500 }}>{sunAnalysis.sunrise}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>SOLAR NOON</div>
                                        <div style={{ color: 'rgba(245,243,239,0.85)', fontFamily: 'var(--vr-mono)', fontSize: 12, fontWeight: 500 }}>{sunAnalysis.noon}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>SUNSET</div>
                                        <div style={{ color: 'rgba(245,243,239,0.85)', fontFamily: 'var(--vr-mono)', fontSize: 12, fontWeight: 500 }}>{sunAnalysis.sunset}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>DAY LENGTH</div>
                                        <div style={{ color: 'rgba(245,243,239,0.85)', fontFamily: 'var(--vr-mono)', fontSize: 12, fontWeight: 500 }}>{sunAnalysis.dayLength}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                        <div style={{ color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)', fontSize: 9 }}>LOCATION</div>
                                        <div style={{ color: 'rgba(245,243,239,0.85)', fontFamily: 'var(--vr-mono)', fontSize: 12, fontWeight: 500 }}>{PROJECTS.find(p => p.active)?.location || 'Rome, IT'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 13 PRESENTATION */}
                <section className="vr-screen" ref={el => { screensRef.current[12] = el; }} id="s13">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 13 / Presentation Mode</div>
                        <h2 className="vr-screen-title">Step into<br /><em>the story.</em></h2>

                        <div className="pres-wrap">
                            <div className="pres-stage">
                                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(45,91,227,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(45,91,227,0.03) 1px,transparent 1px)', backgroundSize: '28px 28px' }}></div>
                                <div className="pres-building">
                                    <div className="pb-antenna-top" style={{ position: 'absolute', bottom: 212, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'rgba(184,149,78,0.7)', boxShadow: '0 0 8px rgba(184,149,78,0.5)', animation: 'antBlink 1.8s ease-in-out infinite' }}></div>
                                    <div className="pb-antenna" style={{ position: 'absolute', bottom: 192, left: '50%', transform: 'translateX(-50%)', width: 2, height: 20, background: 'rgba(255,255,255,0.15)' }}></div>
                                    <div className="pb-roof" style={{ position: 'absolute', bottom: 180, left: '50%', transform: 'translateX(-50%)', width: 130, height: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}></div>
                                    <div className="pb-body">
                                        {[1, 2, 3, 4, 5, 6].map(f => (
                                            <div key={f} className="pb-floor">
                                                <div className="pb-win lit" /><div className="pb-win" /><div className="pb-win lit" /><div className="pb-win" />
                                            </div>
                                        ))}
                                        <div className="pb-floor" style={{ height: 38, borderBottom: 'none', alignItems: 'flex-end', paddingBottom: 8 }}><div className="pb-win" style={{ width: 40, height: 24 }}></div></div>
                                    </div>
                                </div>

                                <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(245,243,239,0.25)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 5 }}>Slide 2 of 5 · Villa Bianca</div>
                                    <div style={{ fontFamily: 'var(--vr-serif)', fontSize: 22, color: 'rgba(245,243,239,0.9)', letterSpacing: '-.01em' }}>Ground floor — spatial concept</div>
                                </div>

                                <div className="laser-indicator">
                                    <div className="laser-dot" />
                                    Laser pointer active
                                </div>

                                <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className="tag tag-green"><div className="dot-pulse" style={{ color: 'var(--vr-green)' }}></div>3 watching</div>
                                </div>
                            </div>

                            <div className="gp pres-controls">
                                <div className="pc-slide-info" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                                    <div className="pc-slide-num" style={{ fontFamily: 'var(--vr-mono)', fontSize: 11, color: 'rgba(245,243,239,0.35)' }}>2 / 5</div>
                                    <div className="pc-slide-title" style={{ fontSize: 13, fontWeight: 500, color: 'rgba(245,243,239,0.85)' }}>Ground floor — spatial concept</div>
                                </div>
                                <div className="pc-progress" style={{ flex: 1, maxWidth: 200 }}>
                                    <div className="pc-prog-track" style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                                        <div className="pc-prog-fill" style={{ height: '100%', width: '40%', background: 'linear-gradient(90deg,var(--vr-blue),rgba(45,91,227,0.6))', borderRadius: 100 }}></div>
                                    </div>
                                </div>
                                <div className="pc-nav" style={{ display: 'flex', gap: 4 }}>
                                    <div className="pc-nav-btn">◀</div>
                                    <div className="pc-nav-btn">▶</div>
                                </div>
                                <div className="pc-mode-badge tag tag-gold">Presenter</div>
                                <button className="vr-btn vr-btn-primary" style={{ fontSize: 11 }}>End session</button>
                            </div>

                            <div className="pres-audience-row" style={{ display: 'flex', gap: 12 }}>
                                <div className="gp gp-sm audience-panel" style={{ flex: 1, padding: '18px 22px' }}>
                                    <div className="ap-title" style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Audience · 3 watching</div>
                                    {[
                                        { name: 'Marco Rossi', initials: 'MR', role: 'Client', tag: 'tag-gold', bg: 'linear-gradient(135deg,#B45309,#D97706)' },
                                        { name: 'Ahmet Koç', initials: 'AK', role: 'Designer', tag: 'tag-blue', bg: 'linear-gradient(135deg,#1A7A4A,#059669)' }
                                    ].map(a => (
                                        <div key={a.name} className="ap-attendee" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--vr-border)' }}>
                                            <div className="ap-av" style={{ width: 28, height: 28, borderRadius: '50%', fontSize: 10, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: a.bg }}>{a.initials}</div>
                                            <div className="ap-name" style={{ fontSize: 13, color: 'rgba(245,243,239,0.8)', flex: 1 }}>{a.name}</div>
                                            <div className={`ap-role-tag ${a.tag}`} style={{ fontSize: 9 }}>{a.role}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="gp gp-sm notes-panel" style={{ width: 240, padding: '18px 20px' }}>
                                    <div className="np-title" style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Presenter Notes</div>
                                    <div className="np-note" style={{ fontSize: 12, color: 'rgba(245,243,239,0.45)', lineHeight: 1.6, marginBottom: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '2px solid rgba(45,91,227,0.5)' }}>Emphasize the 9.8m² kitchen expansion.</div>
                                    <div className="np-note" style={{ fontSize: 12, color: 'rgba(245,243,239,0.45)', lineHeight: 1.6, marginBottom: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, borderLeft: '2px solid rgba(45,91,227,0.5)' }}>Budget question likely here.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 14 KEYBOARD */}
                <section className="vr-screen" ref={el => { screensRef.current[13] = el; }} id="s14">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 14 / VR Keyboard & Text Input</div>
                        <h2 className="vr-screen-title">Type in space,<br /><em>naturally.</em></h2>

                        <div className="keyboard-wrap">
                            <div className="gp kb-input-field" style={{ width: '100%', padding: '16px 20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 8, color: 'rgba(245,243,239,0.25)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>Annotation Text</div>
                                    <div className="kb-input-text">
                                        Kitchen clearance fix needed<span className="kb-cursor"></span>
                                    </div>
                                </div>
                                <div className="kb-clear-btn" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--vr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer', color: 'rgba(245,243,239,0.4)', flexShrink: 0 }}>✕</div>
                            </div>

                            <div className="kb-suggestions" style={{ display: 'flex', gap: 6, width: '100%', overflowX: 'auto', paddingBottom: 2 }}>
                                <div className="kb-suggest primary">clearance needs review</div>
                                <div className="kb-suggest">accessibility check required</div>
                                <div className="kb-suggest">900mm minimum</div>
                                <div className="kb-suggest">mark as critical</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <div className="kb-modes" style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: 3, border: '1px solid var(--vr-border)' }}>
                                    <button className="kb-mode-btn active">ABC</button>
                                    <button className="kb-mode-btn">123</button>
                                    <button className="kb-mode-btn">!@#</button>
                                </div>
                                <div className="tag tag-dim">Hover to enlarge · Pinch to type</div>
                            </div>

                            <div className="gp kb-body" style={{ width: '100%' }}>
                                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, rIdx) => (
                                    <div key={rIdx} className="kb-row">
                                        {row.split('').map(char => (
                                            <div key={char} className={`key ${kbPressed === char ? 'pressed' : ''}`} onClick={() => handleKbPress(char)}>
                                                {char}
                                                <div className="key-tooltip">{char}</div>
                                            </div>
                                        ))}
                                        {rIdx === 0 && <div className="key del wide" onClick={() => handleKbPress('⌫')}>⌫</div>}
                                        {rIdx === 1 && <div className="key enter wider" onClick={() => handleKbPress('↵')}>↵ Enter</div>}
                                    </div>
                                ))}
                                <div className="kb-row">
                                    <div className="key fn wider">123</div>
                                    <div className="key space" onClick={() => handleKbPress(' ')}><span style={{ fontSize: 11, color: 'rgba(245,243,239,0.25)', fontFamily: 'var(--vr-mono)', letterSpacing: '.06em' }}>SPACE</span></div>
                                    <div className="key fn wider" onClick={() => handleKbPress('Dismiss')}>Dismiss</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 15 LOADING */}
                <section className="vr-screen" ref={el => { screensRef.current[14] = el; }} id="s15"
                    style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(45,91,227,0.10), transparent 55%), radial-gradient(ellipse at 20% 20%, rgba(184,149,78,0.05), transparent 40%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 15 / Loading & Transition</div>
                        <h2 className="vr-screen-title">Your space is<br /><em>being built.</em></h2>
                        <div className="load-scene">
                            <div className="building-stage">
                                <div className="load-stars">
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div key={i} className="load-star" style={{
                                            width: Math.random() < 0.3 ? 2 : 1, height: Math.random() < 0.3 ? 2 : 1,
                                            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                                            '--d': `${2 + Math.random() * 3}s`, '--o': `${0.2 + Math.random() * 0.5}`,
                                            animationDelay: `${Math.random() * 4}s`,
                                        } as React.CSSProperties} />
                                    ))}
                                </div>
                                <div className="load-ground" />
                                <div style={{ position: 'relative' }}>
                                    <div className="crane" style={{ position: 'absolute', right: -36, bottom: 0 }}>
                                        <div className="crane-arm" style={{ position: 'absolute', top: 0, left: 0 }} />
                                        <div style={{ position: 'absolute', top: 0, left: 6 }}>
                                            <div className="crane-hook"><div className="crane-hook-end" /></div>
                                        </div>
                                        <div className="crane-mast" />
                                    </div>
                                    <div className="bld-wrap" ref={bldRef}>
                                        <div className="bld-antenna-tip" />
                                        <div className="bld-antenna" />
                                        <div className="bld-roof" />
                                        {Array.from({ length: floorCount }).map((_, i) => (
                                            <div key={i} className="bld-floor" style={{ animationDelay: `${i * 0.08}s` }}>
                                                {[0, 1, 2, 3].map(w => <div key={w} className={`bld-win${Math.random() > 0.45 ? ' lit' : ''}`} />)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="progress-ring-wrap">
                                <svg className="progress-ring-svg" width="80" height="80" viewBox="0 0 96 96">
                                    <circle className="ring-bg" cx="48" cy="48" r="45" />
                                    <circle className="ring-fill" ref={ringRef} cx="48" cy="48" r="45"
                                        style={{ strokeDashoffset: 283 * (1 - loadPct / 100) }} />
                                </svg>
                                <div className="ring-pct">{loadPct}%</div>
                            </div>
                            <div className="load-status">
                                <div className="ls-title">Villa Bianca — Loading</div>
                                <div className="ls-sub">PREPARING YOUR SPATIAL ENVIRONMENT</div>
                                <div className="ls-steps">
                                    {LOAD_STEPS.map((s, i) => (
                                        <div key={i} className={`ls-step ${i < loadStep ? 'done' : i === loadStep ? 'active' : 'todo'}`}>
                                            <div className="ls-step-icon">{i < loadStep ? '✓' : i === loadStep ? '◉' : ' '}</div>
                                            {s.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 16 NOTIFICATIONS */}
                <section className="vr-screen" ref={el => { screensRef.current[15] = el; }} id="s16"
                    style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(192,57,43,0.07), transparent 50%), radial-gradient(ellipse at 25% 70%, rgba(26,122,74,0.05), transparent 40%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 16 / Notification & Alert System</div>
                        <h2 className="vr-screen-title">Stay informed,<br /><em>never distracted.</em></h2>
                        <div className="notif-scene">
                            <div className="toast-stack">
                                {toastVisible.critical && (
                                    <div className="toast critical gp">
                                        <div className="toast-body">
                                            <div className="toast-icon">🚨</div>
                                            <div className="toast-content">
                                                <div className="toast-title"><span className="tag t-red">CRITICAL</span> Structural conflict detected</div>
                                                <div className="toast-msg">Load-bearing wall removed in Ground Floor — Zone A. Immediate review required.</div>
                                                <div className="toast-time">Just now · from Ahmet Koç</div>
                                            </div>
                                        </div>
                                        <div className="toast-actions">
                                            <button className="t-act danger">View conflict</button>
                                            <button className="t-act primary">Notify engineer</button>
                                            <button className="t-act" onClick={() => setToastVisible(p => ({ ...p, critical: false }))}>Dismiss</button>
                                        </div>
                                    </div>
                                )}
                                {toastVisible.warning && (
                                    <div className="toast warning gp">
                                        <div className="toast-body">
                                            <div className="toast-icon">⚠️</div>
                                            <div className="toast-content">
                                                <div className="toast-title"><span className="tag t-gold">WARNING</span> Accessibility threshold</div>
                                                <div className="toast-msg">Kitchen island clearance is 700mm — below the 900mm minimum.</div>
                                                <div className="toast-time">3m ago · Auto-detected</div>
                                            </div>
                                        </div>
                                        <div className="toast-actions">
                                            <button className="t-act primary">Open inspector</button>
                                            <button className="t-act" onClick={() => setToastVisible(p => ({ ...p, warning: false }))}>Snooze 1h</button>
                                        </div>
                                    </div>
                                )}
                                {toastVisible.success && (
                                    <div className="toast success gp">
                                        <div className="toast-body">
                                            <div className="toast-icon">✅</div>
                                            <div className="toast-content">
                                                <div className="toast-title"><span className="tag t-green">RESOLVED</span> Staircase revision approved</div>
                                                <div className="toast-msg">Railing height updated to 1050mm. Sarah Eriksson approved the change.</div>
                                                <div className="toast-time">8m ago</div>
                                            </div>
                                        </div>
                                        <button className="toast-dismiss" onClick={() => setToastVisible(p => ({ ...p, success: false }))}>✕</button>
                                    </div>
                                )}
                                {toastVisible.info && (
                                    <div className="toast info gp">
                                        <div className="toast-body">
                                            <div className="toast-icon">👋</div>
                                            <div className="toast-content">
                                                <div className="toast-title"><span className="tag t-blue">SESSION</span> Marco Rossi joined</div>
                                                <div className="toast-msg">Client is now in the Living Room. Presentation mode available.</div>
                                                <div className="toast-time">12m ago</div>
                                            </div>
                                        </div>
                                        <div className="toast-actions">
                                            <button className="t-act primary">Start presentation</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div className="critical-modal gp">
                                    <div className="cm-header">
                                        <div className="cm-icon">⛔</div>
                                        <div><div className="cm-title">Structural integrity at risk</div><div className="cm-sub">Requires immediate action</div></div>
                                    </div>
                                    <div className="cm-body">
                                        <div className="cm-detail">
                                            <strong>Element:</strong> Wall W-12 · Ground Floor<br />
                                            <strong>Change:</strong> Removed by Ahmet Koç at 14:32<br />
                                            <strong>Impact:</strong> 3 dependent elements affected. Load path compromised.
                                        </div>
                                    </div>
                                    <div className="cm-footer">
                                        <button className="t-act danger" style={{ flex: 1, padding: 9, display: 'flex', justifyContent: 'center' }}>⛔ Revert change</button>
                                        <button className="t-act primary" style={{ flex: 1, padding: 9, display: 'flex', justifyContent: 'center' }}>📋 Review</button>
                                    </div>
                                </div>
                                <div className="gp gp-sm notif-centre" style={{ overflow: 'hidden' }}>
                                    <div className="nc-header"><div className="nc-title">Notification centre</div><div className="nc-clear">Clear all</div></div>
                                    <div className="nc-item unread"><div className="nc-dot" style={{ background: 'var(--vr-red)', boxShadow: '0 0 5px var(--vr-red)' }} /><div><div className="nc-text"><strong>Conflict: Wall W-12</strong>Structural check failed.</div><div className="nc-when">Just now</div></div></div>
                                    <div className="nc-item unread"><div className="nc-dot" style={{ background: 'var(--vr-gold)' }} /><div><div className="nc-text"><strong>Clearance warning</strong>Kitchen island 700mm.</div><div className="nc-when">3m ago</div></div></div>
                                    <div className="nc-item"><div className="nc-dot" style={{ background: 'rgba(255,255,255,0.15)' }} /><div><div className="nc-text"><strong>Staircase approved</strong>Sarah approved the change.</div><div className="nc-when">8m ago</div></div></div>
                                    <div className="nc-item"><div className="nc-dot" style={{ background: 'rgba(255,255,255,0.15)' }} /><div><div className="nc-text"><strong>Marco Rossi joined</strong>Client in Living Room.</div><div className="nc-when">12m ago</div></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 17 VOICE COMMAND */}
                <section className="vr-screen" ref={el => { screensRef.current[16] = el; }} id="s17"
                    style={{ background: 'radial-gradient(ellipse at 40% 55%, rgba(124,58,237,0.07), transparent 50%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 17 / AI Voice Interface</div>
                        <h2 className="vr-screen-title">Just speak,<br /><em>the space listens.</em></h2>
                        <div className="voice-scene">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, width: '100%' }}>
                                <div className="voice-orb-wrap">
                                    <div className="orb-ring" /><div className="orb-ring" /><div className="orb-ring" />
                                    <div className="orb-core" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AgentLogo size={32} color="#F5F3EF" />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div className="waveform">
                                        {WAVEFORM_HEIGHTS.map((h, i) => (
                                            <div key={i} className="wf-bar" style={{ '--h': `${h}px`, '--d': `${0.6 + Math.random() * 0.8}s`, '--dl': `${i * 0.04}s`, height: 4 } as React.CSSProperties} />
                                        ))}
                                    </div>
                                    <div className="tag t-blue" style={{ alignSelf: 'flex-start' }}>
                                        <span className="dot" style={{ color: 'var(--vr-blue)', animation: 'vrPulse 1s infinite' }} /> Listening · EN
                                    </div>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(245,243,239,0.2)', letterSpacing: '0.06em' }}>SAY A COMMAND OR SPEAK NATURALLY</div>
                                </div>
                            </div>
                            <div className="transcript-area gp" style={{ width: '100%' }}>
                                <div className="ta-label">Transcript</div>
                                <div className="ta-text">Show me the kitchen measurements<span className="ta-cursor" /></div>
                                <div className="ta-confidence">94% confident</div>
                            </div>
                            <div className="voice-match-bar">
                                <div style={{ fontSize: 15 }}>📏</div>
                                <div>
                                    <div className="vm-label">Open Measurement Tool · Kitchen</div>
                                    <div className="vm-sub">Say "confirm" to execute, "cancel" to dismiss</div>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                                    <button className="t-act ok" style={{ padding: '6px 14px', fontSize: 10 }}>Confirm</button>
                                    <button className="t-act" style={{ padding: '6px 12px', fontSize: 10 }}>Cancel</button>
                                </div>
                            </div>
                            <div className="cmd-grid">
                                {VOICE_COMMANDS.map((c, i) => (
                                    <div key={i} className={`cmd-card ${c.matched ? 'matched' : ''}`}>
                                        <div className="cmd-icon">{c.icon}</div>
                                        <div className="cmd-text"><strong>{c.name}</strong>{c.desc}</div>
                                        <div className="cmd-shortcut">{c.shortcut}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="voice-statusbar gp gp-sm">
                                <div className="vs-state"><div className="vs-dot" />Active</div>
                                <div className="vs-sep" />
                                <div className="vs-lang">Language: English (UK)</div>
                                <div className="vs-sep" />
                                <div className="vs-lang">Model: VRA-Voice v2</div>
                                <div className="vs-dismiss">Hold grip to dismiss ✕</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 18 EXPORT */}
                <section className="vr-screen" ref={el => { screensRef.current[17] = el; }} id="s18"
                    style={{ background: 'radial-gradient(ellipse at 55% 50%, rgba(45,91,227,0.08), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(184,149,78,0.05), transparent 40%), #0D0C0B' }}>
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 18 / Export & Snapshot Panel</div>
                        <h2 className="vr-screen-title">Capture it,<br /><em>share it.</em></h2>
                        <div className="export-scene">
                            <div>
                                <div className="snapshot-preview">
                                    <div className="sp-scene-inner">
                                        <div className="sp-grid-overlay" />
                                        <div className="sp-bld">
                                            <div style={{ width: 110, height: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', marginBottom: 1, borderRadius: 1 }} />
                                            {[0, 1, 2, 3, 4].map(f => (
                                                <div key={f} className="sp-floor">
                                                    {[0, 1, 2, 3, 4].map(w => <div key={w} className={`sp-win${Math.random() > 0.4 ? ' l' : ''}`} />)}
                                                </div>
                                            ))}
                                            <div style={{ width: 52, height: 32, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1, marginTop: 1 }} />
                                        </div>
                                    </div>
                                    <div className="sp-hud-overlay">
                                        <div className="sp-hud-chip">VILLA BIANCA · GF</div>
                                        <div className="sp-hud-chip">VRA v2.3</div>
                                    </div>
                                    <div className="sp-timestamp">01 MAR 2026 · 14:32</div>
                                    <div className="sp-capture-ring" />
                                </div>
                                <div className="thumb-strip">
                                    {['🏠', '🏗', '📐', '🪟'].map((icon, i) => (
                                        <div key={i} className={`thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                                            {icon}<div className="thumb-num">{i + 1}</div>
                                        </div>
                                    ))}
                                    <div className="thumb" style={{ borderStyle: 'dashed' }}>+</div>
                                </div>
                                <div className="export-grid">
                                    {EXPORT_OPTIONS.map((opt, i) => (
                                        <div key={i} className={`export-option gp-sm ${selectedExport === i ? 'selected' : ''}`} onClick={() => setSelectedExport(i)}>
                                            <div className="eo-icon">{opt.icon}</div>
                                            <div><div className="eo-name">{opt.name}</div><div className="eo-desc">{opt.desc}</div></div>
                                            <div className="eo-size">{opt.size}</div>
                                            <div className="eo-check">{selectedExport === i ? '✓' : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="export-settings">
                                <div className="gp gp-sm es-section">
                                    <div className="es-sec-title">Image format</div>
                                    <div className="format-row">
                                        {['PNG', 'JPEG', 'WebP', 'TIFF'].map(f => (
                                            <div key={f} className={`fmt-chip ${activeFormat === f ? 'active' : ''}`} onClick={() => setActiveFormat(f)}>{f}</div>
                                        ))}
                                    </div>
                                    <div className="es-sec-title" style={{ marginTop: 12 }}>Resolution</div>
                                    <div className="format-row">
                                        {['1080p', '4K', '8K'].map(r => (
                                            <div key={r} className={`fmt-chip ${activeRes === r ? 'active' : ''}`} onClick={() => setActiveRes(r)}>{r}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="gp gp-sm es-section">
                                    <div className="es-sec-title">Export options</div>
                                    <div className="es-row">
                                        <div className="es-name">Include HUD overlay</div>
                                        <div className={`es-toggle ${exportToggles.hud ? 'on' : ''}`} onClick={() => setExportToggles(p => ({ ...p, hud: !p.hud }))} />
                                    </div>
                                    <div className="es-row">
                                        <div className="es-name">Add watermark</div>
                                        <div className={`es-toggle ${exportToggles.watermark ? 'on' : ''}`} onClick={() => setExportToggles(p => ({ ...p, watermark: !p.watermark }))} />
                                    </div>
                                    <div className="es-row">
                                        <div className="es-name">Embed metadata</div>
                                        <div className={`es-toggle ${exportToggles.metadata ? 'on' : ''}`} onClick={() => setExportToggles(p => ({ ...p, metadata: !p.metadata }))} />
                                    </div>
                                    <div className="es-row">
                                        <div className="es-name">Destination</div>
                                        <div className="es-select">Cloud ↓</div>
                                    </div>
                                </div>
                                <div className="gp gp-sm es-section">
                                    <div className="es-sec-title">Export status</div>
                                    <div className="export-progress"><div className="ep-fill" /></div>
                                    <div className="es-row"><div className="es-label">PROGRESS</div><div className="es-val">68%</div></div>
                                    <div className="es-row"><div className="es-label">SIZE</div><div className="es-val">~8.2 MB</div></div>
                                    <div className="es-row"><div className="es-label">DESTINATION</div><div className="es-val">VRA Cloud</div></div>
                                    <div className="es-row" style={{ marginTop: 10 }}>
                                        <button className="t-act primary" style={{ flex: 1, padding: 9, display: 'flex', justifyContent: 'center', fontSize: 11 }}>⬆ Export now</button>
                                    </div>
                                </div>
                                <div className="gp gp-sm es-section">
                                    <div className="es-sec-title">Share</div>
                                    <div className="es-row">
                                        <div className="es-name">Copy share link</div>
                                        <button className="t-act primary" style={{ fontSize: 10, padding: '5px 12px' }}>🔗 Copy</button>
                                    </div>
                                    <div className="es-row">
                                        <div className="es-name">Send to client</div>
                                        <button className="t-act" style={{ fontSize: 10, padding: '5px 12px' }}>✉ Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 19 LOBBY (UNITY NATIVE) */}
                <section className="vr-screen" ref={el => { screensRef.current[18] = el; }} id="s19">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 19 / Unity Native Lobby</div>
                        <h2 className="vr-screen-title">Prepare to enter<br /><em>the spatial session.</em></h2>

                        <div className="lobby-scene">
                            <div className="lobby-panel">
                                <div className="lobby-header">
                                    <div className="lobby-logo">
                                        <div className="lobby-logo-box">VR</div>
                                        <div style={{ fontFamily: 'var(--vr-serif)', color: 'rgba(245,243,239,0.8)', fontSize: 14 }}>VR Architecture</div>
                                    </div>
                                    <div className="live-badge"> <div className="status-dot" /> LIVE</div>
                                </div>

                                <div className="lobby-session-info">
                                    <div className="lsi-meta">SESSION #0 · ROOM: VILLA_WALKTHROUGH</div>
                                    <div className="lsi-title">Villa Bianca · Ground Floor</div>
                                    <div style={{ fontSize: 12, color: 'rgba(245,243,239,0.4)', marginTop: 4 }}>Jensen Developments · Stockholm, SE</div>
                                </div>

                                <div className="lobby-info-grid">
                                    <div className="li-cell">
                                        <div className="li-label">Duration</div>
                                        <div className="li-value">~60 min</div>
                                    </div>
                                    <div className="li-cell">
                                        <div className="li-label">Setup</div>
                                        <div className="li-value">Quest 3</div>
                                    </div>
                                </div>

                                <div className="lobby-model-strip">
                                    <div className="lms-icon">🏛</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(245,243,239,0.8)' }}>villa_bianca_v2.glb</div>
                                        <div style={{ fontSize: 9, color: 'rgba(245,243,239,0.3)', fontFamily: 'var(--vr-mono)' }}>Loaded · Texture LOD 2</div>
                                    </div>
                                    <div className="tag tag-dim">v1.0</div>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <div className="li-label" style={{ marginBottom: 12 }}>Joining · Participants</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {['SE', 'AK', 'MR'].map((init, i) => (
                                            <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--vr-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>{init}</div>
                                        ))}
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(45,91,227,0.1)', border: '1px dashed var(--vr-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--vr-blue)' }}>+</div>
                                    </div>
                                </div>

                                <div className="li-actions">
                                    <button className="li-btn-primary">🥽 Enter Session</button>
                                    <button className="vr-btn" style={{ flex: 0.8, borderRadius: 12, height: 48, justifyContent: 'center' }}>Reschedule</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 20 ANNOTATION FLOW (UNITY NATIVE) */}
                <section className="vr-screen" ref={el => { screensRef.current[19] = el; }} id="s20">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 20 / Spatial Annotation Flow</div>
                        <h2 className="vr-screen-title">Point. Mark.<br /><em>Describe the change.</em></h2>

                        <div className="flow-scene">
                            <div className="flow-stepper">
                                <div className="fs-label">Step 3 of 3 / Describe Issue</div>
                            </div>

                            <div className="flow-viewport">
                                <div className="mv-crosshair" style={{ opacity: 0.2 }}>
                                    <div className="ch-h"></div><div className="ch-v"></div>
                                </div>
                                <div className="flow-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 16 }}>📍</span>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>Kitchen Wall · Section B</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <div className="tag t-red" style={{ fontSize: 8 }}>HIGH</div>
                                            <div className="tag t-gold" style={{ fontSize: 8, opacity: 0.3 }}>MID</div>
                                            <div className="tag t-green" style={{ fontSize: 8, opacity: 0.3 }}>LOW</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 4, marginBottom: 12, padding: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 8, width: 'fit-content' }}>
                                        <div className="fmt-chip" style={{ background: 'none', border: 'none', opacity: 0.4 }}>🎙 Voice</div>
                                        <div className="fmt-chip active" style={{ fontSize: 10, padding: '4px 12px' }}>⌨ Type</div>
                                    </div>

                                    <div className="gp" style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, border: '1px solid var(--vr-border)', marginBottom: 16 }}>
                                        <div style={{ fontSize: 12, color: 'rgba(245,243,239,0.7)', minHeight: 40 }}>Move the cabinet base 200mm to the left to match the drainage pipe location.</div>
                                    </div>

                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="vr-btn" style={{ flex: 1, height: 40, justifyContent: 'center', fontSize: 11 }}>Cancel</button>
                                        <button className="li-btn-primary" style={{ flex: 2, height: 40, fontSize: 11 }}>Save Annotation</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 21 SESSION SUMMARY (UNITY NATIVE) */}
                <section className="vr-screen" ref={el => { screensRef.current[20] = el; }} id="s21">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 21 / Post-Session Summary</div>
                        <h2 className="vr-screen-title">Review the findings<br /><em>before exiting.</em></h2>

                        <div className="summary-panel">
                            <div className="summary-hero">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ fontFamily: 'var(--vr-mono)', fontSize: 9, color: 'rgba(245,243,239,0.3)' }}>SESSION #6 · MAR 02, 2026</div>
                                    <div className="tag t-green">✓ COMPLETE</div>
                                </div>
                                <h3 style={{ fontFamily: 'var(--vr-serif)', fontSize: 32, marginBottom: 4 }}>Villa Bianca walkthrough</h3>
                                <p style={{ fontSize: 13, color: 'rgba(245,243,239,0.4)' }}>Architectural review & kitchen layout confirmation</p>

                                <div className="summary-stats">
                                    <div className="summary-stat">
                                        <span className="ss-num">47:12</span>
                                        <span className="ss-label">Duration</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="ss-num">3</span>
                                        <span className="ss-label">Participants</span>
                                    </div>
                                    <div className="summary-stat">
                                        <span className="ss-num">4</span>
                                        <span className="ss-label">Annotations</span>
                                    </div>
                                    <div className="summary-stat" style={{ borderRight: 'none' }}>
                                        <span className="ss-num">2</span>
                                        <span className="ss-label">Approvals</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: 32 }}>
                                <div style={{ display: 'flex', gap: 24 }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="li-label" style={{ marginBottom: 16 }}>Key Annotations</div>
                                        {[
                                            { t: 'Drainage pipe alignment', p: 'High' },
                                            { t: 'Cabinet finish selection', p: 'Low' }
                                        ].map((note, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 8, border: '1px solid var(--vr-border)' }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: note.p === 'High' ? 'var(--vr-red)' : 'var(--vr-green)' }}></div>
                                                <div style={{ fontSize: 13, flex: 1 }}>{note.t}</div>
                                                <div className="tag tag-dim" style={{ fontSize: 8 }}>{note.p}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ width: 220 }}>
                                        <div className="li-label" style={{ marginBottom: 16 }}>Participants</div>
                                        {['Sarah Eriksson', 'Ahmet Koç', 'Marco Rossi'].map((name, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{name.charAt(0)}</div>
                                                <div style={{ fontSize: 12, color: 'rgba(245,243,239,0.7)' }}>{name}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                                    <button className="li-btn-primary" style={{ flex: 1 }}>View in Dashboard →</button>
                                    <button className="vr-btn" style={{ flex: 0.5, justifyContent: 'center', borderRadius: 12 }}>Download PDF</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 22 UNITY LOGIN */}
                <section className="vr-screen" ref={el => { screensRef.current[21] = el; }} id="s22">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 22 / Unity Native Login</div>
                        <h2 className="vr-screen-title">Sign in to<br /><em>your VR Workspace.</em></h2>
                        <div className="native-login-scene">
                            <div className="native-login-panel">
                                <h3 style={{ fontFamily: 'var(--vr-serif)', fontSize: 24, marginBottom: 8 }}>VR Architecture</h3>
                                <p style={{ fontSize: 13, color: 'rgba(245,243,239,0.35)', marginBottom: 24 }}>PLEASE LOG IN TO YOUR ACCOUNT</p>

                                <div style={{ marginBottom: 16 }}>
                                    <div className="li-label">Email Address</div>
                                    <input type="text" className="gp" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--vr-border)', padding: '12px 16px', borderRadius: 10, color: 'white', marginTop: 6 }} defaultValue="sarah@eriksson.com" />
                                </div>

                                <div style={{ marginBottom: 24 }}>
                                    <div className="li-label">Password</div>
                                    <input type="password" className="gp" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--vr-border)', padding: '12px 16px', borderRadius: 10, color: 'white', marginTop: 6 }} defaultValue="••••••••" />
                                </div>

                                <button className="li-btn-primary" style={{ width: '100%' }}>Sign In</button>
                                <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(245,243,239,0.2)' }}>Forgot password? · Register</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 23 NATIVE LOADING */}
                <section className="vr-screen" ref={el => { screensRef.current[22] = el; }} id="s23">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 23 / Unity Native Loading</div>
                        <h2 className="vr-screen-title">Entering the session,<br /><em>please wait.</em></h2>
                        <div className="native-load-scene">
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(245,243,239,0.8)', marginBottom: 4 }}>Loading Environment</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--vr-mono)', color: 'rgba(245,243,239,0.3)' }}>PARSING BIM GEOMETRY (42%)</div>

                                <div className="load-bar-track">
                                    <div className="load-bar-fill" style={{ width: '42%' }}></div>
                                </div>

                                <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                                    {['Connection established', 'Assets downloaded', 'Building scene...'].map((text, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: i < 2 ? 'var(--vr-green)' : 'rgba(245,243,239,0.2)' }}>
                                            <span>{i < 2 ? '✓' : '○'}</span> {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 24 NATIVE SETTINGS */}
                <section className="vr-screen" ref={el => { screensRef.current[23] = el; }} id="s24">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 24 / Unity Native Settings</div>
                        <h2 className="vr-screen-title">Adjust your preferences<br /><em>in real-time.</em></h2>
                        <div className="native-settings-grid">
                            <div className="ns-sidebar">
                                {['Movement', 'Graphics', 'Audio', 'Collaborators', 'About'].map(tab => (
                                    <div key={tab} className={`ns-tab ${activeSettingTab === tab ? 'active' : ''}`} onClick={() => setActiveSettingTab(tab)}>
                                        {tab}
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: 32, flex: 1 }}>
                                {activeSettingTab === 'Movement' && (
                                    <div className="sp-section" style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <div className="sp-section-title" style={{ fontSize: 11, marginBottom: 16 }}>Movement Controls</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Teleport Mode</div><div className="sp-row-desc">Classic parabolic beam targeting</div></div>
                                            <div className={`sp-toggle ${toggleStates.teleport ? 'on' : ''}`} onClick={() => setToggleStates(p => ({ ...p, teleport: !p.teleport }))}></div>
                                        </div>
                                        <div className="sp-row" style={{ marginTop: 12 }}>
                                            <div className="sp-row-left"><div className="sp-row-label">Smooth Locomotion</div><div className="sp-row-desc">Direct movement with left joystick</div></div>
                                            <div className={`sp-toggle ${toggleStates.smooth ? 'on' : ''}`} onClick={() => setToggleStates(p => ({ ...p, smooth: !p.smooth }))}></div>
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab === 'Graphics' && (
                                    <div className="sp-section" style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <div className="sp-section-title" style={{ fontSize: 11, marginBottom: 16 }}>Visual Performance</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Anti-Aliasing</div><div className="sp-row-desc">Smooths jagged edges (MSAA)</div></div>
                                            <div className="sp-toggle on"></div>
                                        </div>
                                        <div className="sp-row" style={{ marginTop: 12 }}>
                                            <div className="sp-row-left"><div className="sp-row-label">Shadow Quality</div></div>
                                            <div className="sp-mode-group">
                                                <div className="sp-mode">Low</div>
                                                <div className="sp-mode active">Med</div>
                                                <div className="sp-mode">High</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeSettingTab === 'Audio' && (
                                    <div className="sp-section" style={{ background: 'none', border: 'none', padding: 0 }}>
                                        <div className="sp-section-title" style={{ fontSize: 11, marginBottom: 16 }}>Audio Settings</div>
                                        <div className="sp-row">
                                            <div className="sp-row-left"><div className="sp-row-label">Voice Chat</div></div>
                                            <div className="sp-toggle on"></div>
                                        </div>
                                        <div className="sp-row" style={{ marginTop: 12 }}>
                                            <div className="sp-row-left"><div className="sp-row-label">Master Volume</div></div>
                                            <div className="sp-slider-wrap" style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 10 }}><div className="sp-slider"><div className="sp-slider-fill" style={{ width: '80%' }}></div></div></div>
                                        </div>
                                    </div>
                                )}
                                {(activeSettingTab === 'Collaborators' || activeSettingTab === 'About') && (
                                    <div style={{ color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 40, fontSize: 13 }}>
                                        This section is under development.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 25 INVITE OVERLAY */}
                <section className="vr-screen" ref={el => { screensRef.current[24] = el; }} id="s25">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 25 / Unity Native Invite Notification</div>
                        <h2 className="vr-screen-title">Collaborate instantly<br /><em>with your team.</em></h2>
                        <div style={{ height: 200, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div className="invite-overlay">
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'white', fontWeight: 700 }}>SE</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Sarah Eriksson</div>
                                    <div style={{ fontSize: 11, color: 'rgba(245,243,239,0.4)', marginTop: 2 }}>invited you to: <strong>Main Hall Walkthrough</strong></div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="li-btn-primary" style={{ height: 36, padding: '0 20px', fontSize: 11 }}>Accept</button>
                                    <button className="vr-btn" style={{ height: 36, padding: '0 16px', fontSize: 11, borderRadius: 10 }}>Decline</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 26 NATIVE HUD */}
                <section className="vr-screen" ref={el => { screensRef.current[25] = el; }} id="s26">
                    <div className="vr-screen-inner">
                        <div className="vr-screen-label">Screen 26 / Unity Native HUD Overlay</div>
                        <h2 className="vr-screen-title">Total control<br /><em>at your fingertips.</em></h2>

                        <div className="hud-overlay">
                            <div className="hud-topbar-native">
                                <div className="lobby-logo-box" style={{ width: 18, height: 18, fontSize: 6 }}>VR</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>Villa Bianca</div>
                                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className="status-dot" />
                                    <span style={{ fontSize: 9, color: 'rgba(245,243,239,0.5)' }}>CONNECTED</span>
                                </div>
                            </div>

                            <div className="hud-participants-native">
                                {['SE', 'AK', 'MR'].map((init, i) => (
                                    <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(14, 13, 12, 0.88)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{init}</div>
                                ))}
                            </div>

                            <div className="hud-timer-native">
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>42:15</div>
                                <div style={{ fontSize: 8, color: 'rgba(245,243,239,0.3)', marginTop: 2 }}>ELAPSED TIME</div>
                            </div>

                            <div className="hud-actionbar-native">
                                {['🎨', '📐', '📍', '🎤'].map((icon, i) => (
                                    <div key={i} className={`hud-btn-native ${i === 2 ? 'active' : ''}`}>{icon}</div>
                                ))}
                                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                                <div className="hud-btn-native" style={{ background: 'rgba(224, 88, 88, 0.15)', borderColor: 'rgba(224, 88, 88, 0.25)', color: '#f87171' }}>✕</div>
                            </div>
                        </div>
                    </div>
                </section>

            </div >
        </div >
    );
}