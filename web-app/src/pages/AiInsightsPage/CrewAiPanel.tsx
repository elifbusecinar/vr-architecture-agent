import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CrewAiPanel.css';
import { aiService } from '@/services/ai/ai.service';

/* ── Types ── */
interface LogEntry {
  ts: string;
  agentClass: string;
  agentLabel: string;
  msgClass: string;
  msg: string;
}

type AgentStatus = 'idle' | 'waiting' | 'running' | 'done' | 'error';

interface AgentState {
  status: AgentStatus;
  progress: number;
}

const INITIAL_AGENTS: Record<string, AgentState> = {
  bim:  { status: 'idle', progress: 0 },
  comp: { status: 'idle', progress: 0 },
  cost: { status: 'idle', progress: 0 },
  rep:  { status: 'idle', progress: 0 },
};

const INITIAL_STATS = {
  agents: '—', cost: '—', time: 'Never', crit: '1', warn: '2', pass: '24', iterations: '0'
};

/* ── Helpers ── */
const getTimestamp = () => new Date().toTimeString().slice(0, 8);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/* ════════════════════════════════════════════════════════════
   CREW AI PANEL — Full multi-agent audit dashboard
════════════════════════════════════════════════════════════ */
const CrewAiPanel: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { ts: '--:--:--', agentClass: 'crew', agentLabel: '[CREW]', msgClass: 'system', msg: 'Waiting for kickoff… press "Multi-Agent Audit" to start.' }
  ]);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [showResults, setShowResults] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [stats, setStats] = useState(INITIAL_STATS);
  const logRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = useCallback((agentClass: string, agentLabel: string, msgClass: string, msg: string) => {
    if (!mountedRef.current) return;
    setLogs(prev => [...prev, { ts: getTimestamp(), agentClass, agentLabel, msgClass, msg }]);
  }, []);

  const setAgent = useCallback((id: string, status: AgentStatus, progress: number) => {
    if (!mountedRef.current) return;
    setAgents(prev => ({ ...prev, [id]: { status, progress } }));
  }, []);

  /* ── MAIN CREW RUNNER ── */
  const startCrew = async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setShowResults(false);
    setShowLive(true);
    setAgents(INITIAL_AGENTS);
    setStats(prev => ({ ...prev, agents: '—', cost: '—', time: 'Running…' }));

    /* KICKOFF */
    addLog('crew', '[CREW]', 'system', 'Initialising crew — Process.sequential');
    await sleep(400);
    addLog('crew', '[CREW]', 'system', 'LLM: gemini/gemini-1.5-pro · Memory: enabled · Agents: 4');
    await sleep(500);
    addLog('crew', '[CREW]', 'action', 'kickoff(inputs={"project_id": "skyline-tower-v3", "bim_file": "data/skyline.json"})');

    /* AGENT 1: BIM ANALYST */
    await sleep(600);
    setAgent('bim', 'running', 0);
    addLog('bim', '[BIM Analyst]', 'action', 'Starting task: parse_bim_data');
    await sleep(400);
    addLog('bim', '[BIM Analyst]', 'thought', 'I need to read the BIM JSON file and extract spatial data…');
    await sleep(300);
    setAgent('bim', 'running', 35);
    addLog('bim', '[BIM Analyst]', 'action', 'Using tool: FileReadTool → data/skyline.json');
    await sleep(700);
    setAgent('bim', 'running', 65);
    addLog('bim', '[BIM Analyst]', 'thought', 'Found 12 rooms, 234 BIM objects, 4 material types across 3 floors.');
    await sleep(500);
    setAgent('bim', 'running', 85);
    addLog('bim', '[BIM Analyst]', 'action', 'Using tool: spatial_reader → extracting room dimensions…');
    await sleep(600);
    setAgent('bim', 'done', 100);
    addLog('bim', '[BIM Analyst]', 'result', 'Task complete: 12 rooms parsed · 234 objects · 4 materials · 3 floors');

    /* AGENT 2: COMPLIANCE */
    await sleep(500);
    setAgent('comp', 'running', 0);
    addLog('compliance', '[Compliance]', 'action', 'Starting task: check_compliance (context from BIM Analyst)');
    await sleep(400);
    addLog('compliance', '[Compliance]', 'thought', 'Checking ADA §4.3.3 door width ≥ 0.9m, corridors ≥ 1.2m…');
    await sleep(500);
    setAgent('comp', 'running', 40);
    addLog('compliance', '[Compliance]', 'warn', '⚠ Kitchen Zone B: clearance 0.70m — BELOW ADA minimum 0.90m (HIGH)');
    await sleep(400);
    addLog('compliance', '[Compliance]', 'warn', '⚠ Staircase N-Wing: railing 0.95m — below EN ISO 14122 (MEDIUM)');
    await sleep(400);
    setAgent('comp', 'running', 75);
    addLog('compliance', '[Compliance]', 'thought', 'North facade glazing 34% — checking energy optimisation…');
    await sleep(500);
    addLog('compliance', '[Compliance]', 'warn', 'ℹ North facade: glazing ratio 34% — recommend 18–22% (LOW)');
    await sleep(400);
    setAgent('comp', 'done', 100);
    addLog('compliance', '[Compliance]', 'result', 'Task complete: 3 violations (1 HIGH, 1 MED, 1 LOW) · 24 checks passed');

    /* AGENT 3: COST ESTIMATOR */
    await sleep(500);
    setAgent('cost', 'running', 0);
    addLog('cost', '[Cost Estimator]', 'action', 'Starting task: estimate_costs (context from BIM Analyst)');
    await sleep(400);
    addLog('cost', '[Cost Estimator]', 'thought', 'Materials: Italian Marble (142m²), White Oak (89m²), Concrete (210m²), Glass (67m²)');
    await sleep(400);
    setAgent('cost', 'running', 30);
    addLog('cost', '[Cost Estimator]', 'action', 'Using tool: price_api_tool → fetching live prices…');
    await sleep(700);
    setAgent('cost', 'running', 60);
    addLog('cost', '[Cost Estimator]', 'thought', 'Italian Marble $185/m² × 142 = $26,270');
    await sleep(300);
    addLog('cost', '[Cost Estimator]', 'thought', 'White Oak $94/m² × 89 = $8,366  |  Concrete $48/m² × 210 = $10,080');
    await sleep(400);
    addLog('cost', '[Cost Estimator]', 'thought', 'Structural Glass $220/m² × 67 = $14,740');
    await sleep(400);
    setAgent('cost', 'done', 100);
    addLog('cost', '[Cost Estimator]', 'result', 'Task complete: Grand Total $59,456 USD across 4 material types');

    /* AGENT 4: REPORTER */
    await sleep(500);
    setAgent('rep', 'running', 0);
    addLog('reporter', '[Reporter]', 'action', 'Starting task: write_review_report (context from all 3 agents)');
    
    // START RE-SYNC WITH ACTUAL BACKEND (CrewAI)
    addLog('crew', '[CREW]', 'system', 'Finalizing and synchronizing with CrewAI backend...');
    try {
        const backendResult = await aiService.triggerCrewAudit("Project Skyline v3.1 Metadata");
        console.log("CrewAI Backend Result:", backendResult);
        
        if (backendResult.status === 'success' || backendResult.status === 'simulated_success') {
            const report = backendResult.audit_report;
            const iterations = backendResult.iterations || 1;
            
            addLog('langgraph', '[LANGGRAPH]', 'system', `Stateful orchestration complete. Total iterations: ${iterations}`);
            
            if (typeof report === 'object') {
                setStats({
                    agents: '4', 
                    cost: report.stats?.cost || '$59,456', 
                    time: 'Just now', 
                    crit: report.stats?.crit?.toString() || '1', 
                    warn: report.stats?.warn?.toString() || '2', 
                    pass: report.stats?.pass?.toString() || '24',
                    iterations: iterations.toString()
                });
            } else {
                // If it's a string (which the real backend returns now)
                setStats(prev => ({ ...prev, iterations: iterations.toString(), time: 'Just now' }));
            }
        }
    } catch (e) {
        addLog('crew', '[CREW]', 'warn', 'Backend re-sync failed, using local simulation cache.');
    }

    await sleep(600);
    setAgent('rep', 'running', 50);
    addLog('reporter', '[Reporter]', 'action', 'Using tool: FileWriterTool → output/review_skyline-tower-v3.json');
    await sleep(600);
    setAgent('rep', 'done', 100);
    addLog('reporter', '[Reporter]', 'result', 'Task complete: report written to output/review_skyline-tower-v3.json');

    /* CREW DONE */
    await sleep(400);
    addLog('crew', '[CREW]', 'done', '✓ Crew finished — 4/4 tasks complete · Duration: ~18s');

    setShowLive(false);
    await sleep(300);
    setShowResults(true);
    setRunning(false);
  };

  const resetCrew = () => {
    setRunning(false);
    setLogs([{ ts: '--:--:--', agentClass: 'crew', agentLabel: '[CREW]', msgClass: 'system', msg: 'Waiting for kickoff… press "Multi-Agent Audit" to start.' }]);
    setAgents(INITIAL_AGENTS);
    setShowResults(false);
    setShowLive(false);
    setStats(INITIAL_STATS);
  };

  const agentMeta: Record<string, { emoji: string; name: string; role: string; color: string }> = {
    bim:  { emoji: '🏗️', name: 'BIM Analyst',     role: 'bim_analyst',        color: 'rgba(58,111,168,0.12)' },
    comp: { emoji: '⚖️', name: 'Compliance',      role: 'compliance_checker', color: 'rgba(74,124,89,0.12)' },
    cost: { emoji: '💰', name: 'Cost Estimator', role: 'cost_estimator',     color: 'rgba(192,120,58,0.12)' },
    rep:  { emoji: '📋', name: 'Reporter',         role: 'report_writer',      color: 'rgba(140,137,131,0.12)' },
  };

  return (
    <div className="crewai-wrap">
      {/* ── LEFT: MAIN CONTENT ── */}
      <div className="crewai-main">

        {/* TRIGGER BUTTON */}
        <button
          className={`crewai-trigger ${running ? 'is-running' : ''}`}
          onClick={startCrew}
          disabled={running}
        >
          <div className="crewai-trigger-icon">🤖</div>
          <div className="crewai-trigger-text">
            <div className="crewai-trigger-title">
              {running ? 'Crew is running…' : showResults ? 'Audit Complete — Run Again' : 'Run Multi-Agent Design Audit'}
            </div>
            <div className="crewai-trigger-sub">4 agents · BIM Analysis → Compliance → Cost → Report</div>
          </div>
          <span className="crewai-trigger-badge">
            {running ? '⟳ sequential' : showResults ? '✓ complete' : 'Process.sequential'}
          </span>
        </button>

        {/* AGENT CHIPS */}
        <div className="crewai-chips">
          {Object.entries(agents).map(([id, state]) => {
            const meta = agentMeta[id];
            return (
              <div key={id} className={`crewai-chip ${state.status}`}>
                <div className="crewai-chip-dot" />
                <div className="crewai-chip-progress">
                  <div className="crewai-chip-fill" style={{ width: `${state.progress}%` }} />
                </div>
                <div className="crewai-chip-icon" style={{ background: meta.color }}>{meta.emoji}</div>
                <div className="crewai-chip-name">{meta.name}</div>
                <div className="crewai-chip-role">{meta.role}</div>
              </div>
            );
          })}
        </div>

        {/* LIVE LOG */}
        <div className="crewai-log-wrap">
          <div className="crewai-log-header">
            <div className="crewai-log-title">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
              Agent Log
            </div>
            {showLive && (
              <div className="crewai-log-live">
                <div className="crewai-log-live-dot" /> LIVE
              </div>
            )}
          </div>
          <div className="crewai-log-body" ref={logRef}>
            {logs.map((l, i) => (
              <div key={i} className="crewai-log-line">
                <span className="log-ts">{l.ts}</span>
                <span className={`log-agent ${l.agentClass}`}>{l.agentLabel}</span>
                <span className={`log-msg ${l.msgClass}`}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        {showResults && (
          <div className="crewai-results">
            {/* Compliance */}
            <div className="crewai-result-card">
              <div className="crewai-result-head">
                <div className="crewai-result-icon" style={{ background: 'rgba(74,124,89,0.12)' }}>⚖️</div>
                <span className="crewai-result-title">Compliance Report</span>
                <span className="crewai-result-agent">compliance_checker</span>
              </div>
              <div className="crewai-result-body">
                <div className="viol-item">
                  <span className="viol-sev sev-high">HIGH</span>
                  <div>
                    <div className="viol-text">Kitchen island clearance 700mm — below ADA minimum 900mm.</div>
                    <div className="viol-room">GF · Kitchen · Zone B · ADA §4.3.3</div>
                  </div>
                </div>
                <div className="viol-item">
                  <span className="viol-sev sev-medium">MED</span>
                  <div>
                    <div className="viol-text">Staircase railing at 950mm — EN ISO 14122 recommends 1000–1200mm.</div>
                    <div className="viol-room">1F · Staircase · N-Wing · EN ISO 14122-3</div>
                  </div>
                </div>
                <div className="viol-item">
                  <span className="viol-sev sev-low">LOW</span>
                  <div>
                    <div className="viol-text">North facade glazing ratio 34% — recommend 18–22% for energy optimisation.</div>
                    <div className="viol-room">All floors · North elevation · Energy</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className="crewai-result-card">
              <div className="crewai-result-head">
                <div className="crewai-result-icon" style={{ background: 'rgba(192,120,58,0.12)' }}>💰</div>
                <span className="crewai-result-title">Material Cost Breakdown</span>
                <span className="crewai-result-agent">cost_estimator</span>
              </div>
              <div className="crewai-result-body">
                <table className="cost-tbl">
                  <thead>
                    <tr><th>Material</th><th>Area (m²)</th><th>$/m²</th><th>Subtotal</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="cost-mat">Italian Marble</td><td className="cost-num">142</td><td className="cost-num">$185</td><td className="cost-num">$26,270</td></tr>
                    <tr><td className="cost-mat">White Oak Flooring</td><td className="cost-num">89</td><td className="cost-num">$94</td><td className="cost-num">$8,366</td></tr>
                    <tr><td className="cost-mat">Polished Concrete</td><td className="cost-num">210</td><td className="cost-num">$48</td><td className="cost-num">$10,080</td></tr>
                    <tr><td className="cost-mat">Structural Glass</td><td className="cost-num">67</td><td className="cost-num">$220</td><td className="cost-num">$14,740</td></tr>
                    <tr className="cost-row-total"><td colSpan={3} className="cost-mat" style={{ fontWeight: 700 }}>Grand Total</td><td className="cost-total">$59,456</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report JSON */}
            <div className="crewai-result-card">
              <div className="crewai-result-head">
                <div className="crewai-result-icon" style={{ background: 'rgba(140,137,131,0.12)' }}>📋</div>
                <span className="crewai-result-title">output/review_skyline-tower-v3.json</span>
                <span className="crewai-result-agent">report_writer</span>
              </div>
              <div className="crewai-result-body">
                <pre className="output-json">{`{
  "project_id": "skyline-tower-v3",
  "generated_at": "${new Date().toISOString().slice(0, 19)}Z",
  "orchestrator": "LangGraph (Stateful)",
  "iterations": ${stats.iterations},
  "crew_process": "sequential",
  "agents_used": 4,
  "status": "complete"
}`}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div className="crewai-sidebar">
        {/* Design Score */}
        <div className="crewai-score-card">
          <div className="crewai-score-ring">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(26,25,23,0.08)" strokeWidth="7" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#scoreGrad)" strokeWidth="7"
                strokeDasharray="166 48" strokeDashoffset="53" strokeLinecap="round" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4a7c59" />
                  <stop offset="100%" stopColor="#3a6fa8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="crewai-score-num">78</div>
          </div>
          <div className="crewai-score-label">Design Score</div>
          <div className="crewai-score-grade"><em>Grade B+</em></div>
          <div className="crewai-stat-rows">
            <div className="crewai-stat-row"><span className="crewai-sk">Critical issues</span><span className="crewai-sv" style={{ color: '#c0783a' }}>{stats.crit}</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Warnings</span><span className="crewai-sv" style={{ color: '#c0783a' }}>{stats.warn}</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Passed checks</span><span className="crewai-sv" style={{ color: '#4a7c59' }}>{stats.pass}</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Iterations</span><span className="crewai-sv" style={{ color: '#3a6fa8', fontWeight: 'bold' }}>{stats.iterations} (LangGraph)</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Agents run</span><span className="crewai-sv">{stats.agents}</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Cost estimate</span><span className="crewai-sv">{stats.cost}</span></div>
            <div className="crewai-stat-row"><span className="crewai-sk">Last audit</span><span className="crewai-sv">{stats.time}</span></div>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="crewai-pipeline-card">
          <div className="crewai-pipeline-title">Agent Pipeline Status</div>
          {Object.entries(agents).map(([id, state]) => {
            const meta = agentMeta[id];
            const dotColor = state.status === 'done' ? '#4a7c59' : state.status === 'running' ? '#3a6fa8' : state.status === 'waiting' ? '#c0783a' : '#b8b4af';
            const badgeBg = state.status === 'done' ? 'rgba(74,124,89,0.1)' : state.status === 'running' ? 'rgba(58,111,168,0.1)' : 'rgba(26,25,23,0.06)';
            const badgeColor = state.status === 'done' ? '#4a7c59' : state.status === 'running' ? '#3a6fa8' : '#8c8983';
            return (
              <div key={id} className="crewai-pipeline-item">
                <span className="crewai-pipeline-name">
                  <span className="crewai-pipeline-dot" style={{ background: dotColor }} />
                  {meta.name}
                </span>
                <span className="crewai-pipeline-badge" style={{ background: badgeBg, color: badgeColor }}>
                  {state.status === 'done' ? 'done ✓' : state.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="crewai-actions">
          <button className="crewai-action-btn primary" onClick={startCrew} disabled={running}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="4,3 13,8 4,13"/></svg>
            Run Crew Audit
          </button>
          <button className="crewai-action-btn" onClick={resetCrew}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8a6 6 0 1011.3-2.8M2 8V4m0 4H6"/></svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewAiPanel;
