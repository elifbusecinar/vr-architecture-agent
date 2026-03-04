import React, { useEffect, useRef } from 'react';
import '@/styles/ai-components.css';

const WAVEFORM_BARS = [
    { min: 4, max: 12, dur: .55, delay: .00 },
    { min: 6, max: 22, dur: .70, delay: .08 },
    { min: 8, max: 36, dur: .60, delay: .04 },
    { min: 10, max: 42, dur: .50, delay: .12 },
    { min: 12, max: 44, dur: .65, delay: .02 },
    { min: 10, max: 38, dur: .75, delay: .10 },
    { min: 8, max: 32, dur: .55, delay: .06 },
    { min: 6, max: 26, dur: .68, delay: .14 },
    { min: 4, max: 18, dur: .60, delay: .03 },
    { min: 6, max: 28, dur: .72, delay: .09 },
    { min: 8, max: 36, dur: .58, delay: .05 },
    { min: 10, max: 40, dur: .62, delay: .11 },
    { min: 8, max: 34, dur: .70, delay: .07 },
    { min: 6, max: 24, dur: .54, delay: .13 },
    { min: 4, max: 14, dur: .66, delay: .01 },
];

const VoiceOpsPanel: React.FC = () => {
    const barsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const intervals: ReturnType<typeof setInterval>[] = [];
        barsRef.current.forEach(bar => {
            if (!bar) return;
            const id = setInterval(() => {
                const maxVal = 8 + Math.random() * 38;
                bar.style.setProperty('--max', maxVal + 'px');
            }, 400 + Math.random() * 400);
            intervals.push(id);
        });
        return () => intervals.forEach(clearInterval);
    }, []);

    return (
        <div className="voice-ops-container">
            <div className="voice-ops-wrap">
                {/* LEFT — Orb + Waveform + Transcript */}
                <div className="vo-orb-stage">
                    <div className="vo-orb-container">
                        <div className="vo-orb-ring" />
                        <div className="vo-orb-ring" />
                        <div className="vo-orb-ring" />
                        <div className="vo-orb-core">🎙</div>
                    </div>

                    <div className="vo-voice-state">
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7DD4CC', animation: 'ai-blink 1.5s infinite' }} />
                        Listening · EN-UK · VRA-Voice v2
                    </div>

                    <div className="vo-waveform">
                        {WAVEFORM_BARS.map((b, i) => (
                            <div
                                key={i}
                                ref={el => { barsRef.current[i] = el; }}
                                className="vo-wf-bar"
                                style={{
                                    '--min': `${b.min}px`,
                                    '--max': `${b.max}px`,
                                    '--dur': `${b.dur}s`,
                                    '--delay': `${b.delay}s`,
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>

                    <div className="vo-orb-controls-wrap">
                        <div className="vo-transcript-card">
                            <div className="vo-tc-label">Transcript</div>
                            <div className="vo-tc-text">Paint the kitchen walls white<span className="vo-tc-cursor" /></div>
                            <div className="vo-tc-conf">94% confidence · 0.3s latency</div>
                        </div>

                        <div className="vo-match-bar">
                            <div className="vo-mb-icon">🎨</div>
                            <div className="vo-mb-text">
                                <div className="vo-mb-title">Apply material: RAL 9016 White · Kitchen Walls</div>
                                <div className="vo-mb-sub">Say "confirm" to apply · "undo" to revert</div>
                            </div>
                            <div className="vo-mb-actions">
                                <div className="mb-confirm" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(110,153,87,0.3)', border: '1px solid rgba(110,153,87,0.5)', color: '#9DC47E', cursor: 'pointer', transition: 'all .2s' }}>Confirm</div>
                                <div className="mb-dismiss" style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#706A60', cursor: 'pointer', transition: 'all .2s' }}>✕</div>
                            </div>
                        </div>

                        <div className="vo-statusbar">
                            <div className="vo-vsb-live">
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#9DC47E', animation: 'ai-blink 1.8s infinite' }} />Active
                            </div>
                            <div className="vo-vsb-sep" />
                            <span>EN-UK</span>
                            <div className="vo-vsb-sep" />
                            <span>VRA-Voice v2.1</span>
                            <div className="vo-vsb-sep" />
                            <span>Villa Bianca · Kitchen</span>
                            <div className="vo-vsb-end">✕ End Session</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Command History + Suggested */}
                <div className="vo-right">
                    <div className="vo-history-card">
                        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ai-ink-3)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Command history</div>
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#3E3B34', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.05em' }}>Clear history</span>
                        </div>
                        <div className="vo-history">
                            <HistoryItem icon="🎨" cmd="Paint the kitchen walls white" result="Awaiting confirmation…" time="Now" status="#7DD4CC" active pulse />
                            <HistoryItem icon="📏" cmd="Show me the kitchen measurements" result="Measurement tool opened" time="2 min ago" status="#9DC47E" />
                            <HistoryItem icon="🏃" cmd="Go to the master bedroom" result="Teleported to Master Bed · 1F" time="5 min ago" status="#9DC47E" />
                            <HistoryItem icon="📍" cmd="Add a note here" result="Voice annotation created" time="12 min ago" status="#9DC47E" />
                            <HistoryItem icon="🔇" cmd="Mute Marcus" result="Marcus Jensen muted" time="18 min ago" status="#9DC47E" />
                        </div>
                    </div>

                    <div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ai-ink-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12, paddingLeft: 4 }}>Suggested commands</div>
                        <div className="vo-cmd-grid">
                            <CmdCard icon="🛠" name="Change material" desc="Swap surface texture instantly." shortcut="MAT" suggested />
                            <CmdCard icon="📸" name="Take snapshot" desc="High-resolution current view." shortcut="SNAP" />
                            <CmdCard icon="⚡" name="Go to [room]" desc="Instant teleportation by name." shortcut="GOTO" />
                            <CmdCard icon="☀️" name="Set time of day" desc="Dynamic solar positioning." shortcut="SUN" />
                            <CmdCard icon="💬" name="Add voice note" desc="Create spatial annotations." shortcut="NOTE" />
                            <CmdCard icon="🗺" name="Show minimap" desc="Toggle 2D floor plan overlay." shortcut="MAP" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Sub-components ─── */

const HistoryItem: React.FC<{ icon: string; cmd: string; result: string; time: string; status: string; active?: boolean; pulse?: boolean }> = ({
    icon, cmd, result, time, status, active, pulse
}) => (
    <div className={`vo-vh-item${active ? ' active' : ''}`}>
        <div className="vo-vh-icon">{icon}</div>
        <div className="vo-vh-content">
            <div className="vo-vh-cmd">"{cmd}"</div>
            <div className="vo-vh-result">{result}</div>
            <div className="vo-vh-time">{time}</div>
        </div>
        <div className="vo-vh-status" style={{ background: status, animation: pulse ? 'ai-blink 1.5s infinite' : undefined }} />
    </div>
);

const CmdCard: React.FC<{ icon: string; name: string; desc: string; shortcut: string; suggested?: boolean }> = ({
    icon, name, desc, shortcut, suggested
}) => (
    <div className={`vo-cmd-card${suggested ? ' suggested' : ''}`}>
        <div className="vo-cmd-card-icon">{icon}</div>
        <div className="vo-cmd-card-name">{name}</div>
        <div className="vo-cmd-card-desc">{desc}</div>
        <div className="vo-cmd-card-shortcut">{shortcut}</div>
    </div>
);

export default VoiceOpsPanel;
