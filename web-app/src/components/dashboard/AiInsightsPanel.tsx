import React, { useState } from 'react';
import '@/styles/ai-components.css';
import { aiService } from '@/services/ai/ai.service';
import { useNavigate } from 'react-router-dom';

const AiInsightsPanel: React.FC = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);

    const handleRescan = async () => {
        setIsScanning(true);
        setScanResult(null);
        try {
            const result = await aiService.critiqueProject("skyline-tower-v3", "3 Floors. 234 BIM Objects. Main materials: Glass, Concrete, Steel.");
            setScanResult(result.summary);
        } catch (error) {
            console.error("Rescan Error:", error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="ai-insights-container">
            <div style={{ padding: "32px 40px 0" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px 3px 8px", background: "#E8E4DC", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 100, fontFamily: "var(--mono)", fontSize: 9, color: "#7A756C", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4AADA6" }}></div>
                    Component 01 · AiInsightsPanel.tsx
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                    <div>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 34, color: "#1A1A14", letterSpacing: "-0.02em", fontWeight: 400 }}>AI Insights <em style={{ fontStyle: "italic", color: "#7A756C" }}>— Design critic built-in.</em></div>
                        <p style={{ color: "#7A756C", fontSize: 12, marginTop: 6, maxWidth: 500 }}>Automatically scans the architectural model, analyses BIM data, and detects design issues before your team does.</p>
                    </div>
                    <button
                        onClick={handleRescan}
                        disabled={isScanning}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: isScanning ? "default" : "pointer", background: isScanning ? "var(--ai-bg-3)" : "#4AADA6", border: "none", color: "white", fontFamily: "var(--sans)", opacity: isScanning ? 0.7 : 1 }}>
                        {isScanning ? "Scanning..." : "Re-scan"}
                    </button>
                </div>
            </div>

            <div className="ai-insights-wrap">
                <div>
                    {/* Scan status bar */}
                    <div className="ai-scan-bar">
                        <div className="ai-scan-pulse">{isScanning ? "🧠" : "✨"}</div>
                        <div className="ai-scan-text">
                            <div className="ai-scan-title">{isScanning ? "Scanning BIM Model..." : "Analysis complete — Skyline Tower v3.1"}</div>
                            <div className="ai-scan-sub">{isScanning ? "Extracting metadata and compliance rules..." : "Scanned 234 BIM objects · 12 rooms · 3 floors · 2 min ago"}</div>
                        </div>
                        <div className="ai-scan-tag">
                            <div className="ai-scan-dot" style={{ background: isScanning ? "#C49440" : "#4AADA6" }} />
                            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: isScanning ? "#C49440" : "#4AADA6" }}>{isScanning ? "BUSY" : "LIVE"}</span>
                        </div>
                    </div>

                    {/* AI Critique result if available */}
                    {scanResult && (
                        <div style={{ marginBottom: 16, padding: 16, background: "rgba(74,173,166,0.1)", borderRadius: 12, border: "1px solid rgba(74,173,166,0.3)" }}>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "#4AADA6", marginBottom: 8, textTransform: "uppercase" }}>New AI Recommendation</div>
                            <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}>
                                {scanResult}
                            </div>
                        </div>
                    )}

                    {/* Issue list */}
                    <div className="ai-issue-list" style={{ opacity: isScanning ? 0.4 : 1, transition: "opacity 0.3s" }}>
                        <IssueCard severity={isScanning?"info":"critical"} icon={isScanning?"🔄":"⛔"} title={isScanning?"Scanning kitchen area...":"Kitchen island clearance below minimum"} desc={isScanning?"Applying structural load model and checking cross-references...":"Detected 700mm clearance between island and cabinet wall. ADA & ISO 21542 require minimum 900mm."} tags={[{ label: isScanning?"Scanning":"Critical", variant: isScanning?"blue":"red" }]} location="GF · Kitchen · Zone B" confidence={isScanning?0:97} confColor="#D4607C" />
                        <IssueCard severity={isScanning?"info":"warning"} icon={isScanning?"🔄":"⚠️"} title={isScanning?"Scanning staircase dimensions...":"Staircase railing below recommended height"} desc={isScanning?"Checking ISO and local building code compliances...":"Railing at 950mm. EN ISO 14122-3 recommends 1000–1200mm for residential stairs."} tags={[{ label: isScanning?"Scanning":"Warning", variant: isScanning?"blue":"amber" }]} location="1F · Staircase" confidence={isScanning?0:88} confColor="#E8BE72" />
                    </div></div>

                    {/* Quick prompts */}
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>Ask AI about this model</div>
                        <div className="ai-quick-prompts">
                            <div className="ai-qp" onClick={() => navigate('/ai-chat')} style={{cursor: 'pointer'}}><span>📏</span> What's the total wall length on floor 2?</div>
                            <div className="ai-qp" onClick={() => navigate('/ai-chat')} style={{cursor: 'pointer'}}><span>💰</span> How would changing marble to terrazzo affect cost?</div>
                            <div className="ai-qp" onClick={() => navigate('/ai-chat')} style={{cursor: 'pointer'}}><span>☀️</span> When does the living room get direct sunlight in December?</div>
                            <div className="ai-qp" onClick={() => navigate('/ai-chat')} style={{cursor: 'pointer'}}><span>♿</span> Full accessibility compliance report</div>
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="ai-sidebar">
                    <div className="ai-score-card">
                        <div className="ai-score-ring">
                            <svg viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-inset)" strokeWidth="7" />
                                <circle cx="40" cy="40" r="34" fill="none" stroke="url(#scoreGrad)" strokeWidth="7" strokeDasharray="166 48" strokeDashoffset="53" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#9DC47E" /><stop offset="100%" stopColor="#4AADA6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="ai-score-num">{isScanning ? '--' : Math.floor(Math.random() * 10) + 75}</div>
                        </div>
                        <div className="ai-score-label">Design Quality Score</div>
                        <div className="ai-score-grade"><em>Grade {isScanning ? '-' : 'B+'}</em></div>
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
                            <div className="ai-stat-row"><div className="ai-stat-key">Critical issues</div><div className="ai-stat-val" style={{ color: "#D4607C" }}>{isScanning ? '-' : '1'}</div></div>
                            <div className="ai-stat-row"><div className="ai-stat-key">Warnings</div><div className="ai-stat-val" style={{ color: "#C49440" }}>{isScanning ? '-' : '2'}</div></div>
                            <div className="ai-stat-row"><div className="ai-stat-key">Suggestions</div><div className="ai-stat-val" style={{ color: "#4AADA6" }}>{isScanning ? '-' : '1'}</div></div>
                            <div className="ai-stat-row"><div className="ai-stat-key">Passed checks</div><div className="ai-stat-val" style={{ color: "#6E9957" }}>{isScanning ? '-' : '24'}</div></div>
                            <div className="ai-stat-row"><div className="ai-stat-key">Last analysed</div><div className="ai-stat-val">{isScanning ? "Scanning..." : "Just now"}</div></div>
                        </div>
                    </div>
                    <div className="ai-category-score-card">
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ai-ink-3)", letterSpacing: ".09em", textTransform: "uppercase", marginBottom: 12 }}>Category Scores</div>
                        <div className="ai-category-scores">
                            <CategoryBar label="Accessibility" pct={isScanning ? 0 : 82} gradient="linear-gradient(90deg,#E8BE72,#C49440)" />
                            <CategoryBar label="Structural" pct={isScanning ? 0 : 98} gradient="linear-gradient(90deg,#9DC47E,#6E9957)" />
                            <CategoryBar label="Energy" pct={isScanning ? 0 : 71} gradient="linear-gradient(90deg,#7DD4CC,#4AADA6)" />
                            <CategoryBar label="Fire Safety" pct={isScanning ? 0 : 88} gradient="linear-gradient(90deg,#B87898,#7A3E5C)" />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => window.open('/docs/crew_ai_report.html', '_blank')} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer", border: "1px solid var(--ai-border-md)", background: "rgba(0,0,0,0.03)", color: "var(--ai-ink-2)", fontFamily: "var(--sans)" }}>✨ Full Report</button>
                        <button onClick={handleRescan} disabled={isScanning} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: isScanning ? "default" : "pointer", background: isScanning ? "var(--ai-bg-3)" : "#4AADA6", border: "none", color: "white", fontFamily: "var(--sans)", opacity: isScanning ? 0.7 : 1 }}>Re-scan</button>
                    </div>
                </div>
            </div>
    );
};

/* ─── Sub-components ─── */

interface TagDef { label: string; variant: string; }

const IssueCard: React.FC<{
    severity: string; icon: string; title: string; desc: string;
    tags: TagDef[]; location: string; confidence?: number; confColor?: string; action?: string;
}> = ({ severity, icon, title, desc, tags, location, confidence, confColor, action }) => (
    <div className={`ai-issue-card ${severity}`}>
        <div className={`ai-sev-icon ai-sev-${severity}`}>{icon}</div>
        <div className="ai-issue-content">
            <div className="ai-issue-title">{title}</div>
            <div className="ai-issue-desc">{desc}</div>
            <div className="ai-issue-meta">
                {tags.map((t, i) => (
                    <span key={i} className={`ai-tag ${t.variant ? `ai-tag-${t.variant}` : ''}`}>{t.label}</span>
                ))}
                <span className="ai-issue-loc">{location}</span>
            </div>
            {confidence != null && (
                <>
                    <div className="ai-conf-bar" style={{ marginTop: 8 }}>
                        <div className="ai-conf-fill" style={{ width: `${confidence}%`, background: confColor, opacity: .6 }} />
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-4)", marginTop: 3 }}>Confidence {confidence}%</div>
                </>
            )}
        </div>
        {action && <div className="ai-issue-action">{action}</div>}
    </div>
);

const CategoryBar: React.FC<{ label: string; pct: number; gradient: string }> = ({ label, pct, gradient }) => (
    <div className="ai-cat-row">
        <div className="ai-cat-header">
            <span className="ai-cat-name">{label}</span>
            <span className="ai-cat-pct">{pct}%</span>
        </div>
        <div className="ai-cat-bar">
            <div className="ai-cat-fill" style={{ width: `${pct}%`, background: gradient }} />
        </div>
    </div>
);

export default AiInsightsPanel;
