import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AiInsightsPage.css";
import CrewAiPanel from "./CrewAiPanel";
import {
  MOCK_PROJECTS,
  MOCK_ACTIVITIES,
  MOCK_SESSIONS,
} from "@/services/mockData";

const AiInsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"insights" | "crew" | "history">(
    "insights",
  );
  const [period, setPeriod] = useState("month");

  const totalProjects = MOCK_PROJECTS.data.length;
  const activeProjects = MOCK_PROJECTS.data.filter(
    (p) => p.status === "VRActive",
  ).length;

  // Dynamic calculation based on period selection
  const totalSessions =
    period === "7d"
      ? 42
      : period === "month"
        ? 156
        : period === "quarter"
          ? 412
          : 1089;
  const avgSessionTime =
    period === "7d"
      ? 22
      : period === "month"
        ? 24
        : period === "quarter"
          ? 28
          : 25;

  // Dynamic storage data based on mock projects
  const totalStorage = 100; // Assuming 100GB total space
  const storageData = [
    {
      name: MOCK_PROJECTS.data[0]?.title || "Skyline Tower",
      val: 22,
      color: "#1c1c1a",
    },
    {
      name: MOCK_PROJECTS.data[1]?.title || "Villa Azura",
      val: 12,
      color: "var(--green)",
    },
    {
      name: MOCK_PROJECTS.data[2]?.title || "Metro Nexus",
      val: 8,
      color: "var(--orange)",
    },
    { name: "Other", val: 3.2, color: "#e0ddd9" },
  ];
  const storageUsed = storageData
    .reduce((acc, curr) => acc + curr.val, 0)
    .toFixed(1);

  const circumference = 2 * Math.PI * 34; // ~ 213.63

  useEffect(() => {
    // Animate bar chart
    const data = [22, 31, 38, 45, 20];
    const chart = document.getElementById("bar-chart");
    if (chart) {
      chart.innerHTML = ""; // reset on hot reload
      const maxVal = Math.max(...data);
      data.forEach((v, i) => {
        const col = document.createElement("div");
        col.className = "bar-col";
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = "4px";
        bar.style.background = i === 3 ? "#1c1c1a" : "#e0ddd9";
        bar.style.borderRadius = "4px 4px 0 0";
        bar.title = v + " sessions";
        col.appendChild(bar);
        chart.appendChild(col);
        // Animate after render
        setTimeout(
          () => {
            bar.style.height = Math.round((v / maxVal) * 80) + "px";
          },
          100 + i * 80,
        );
      });
    }
  }, []);

  return (
    <div className="ai-insights-root page">
      {/* Header */}
      <div className="page-eyebrow">— AI Insights</div>
      <h1 className="page-title">
        Your workspace,
        <br />
        <em>analysed.</em>
      </h1>
      <p className="page-sub">
        Updated just now · Based on {totalProjects} projects, {totalSessions} VR
        sessions, 4 active clients
      </p>

      {/* Main Tabs */}
      <div className="ai-main-tabs">
        <button
          className={`ai-main-tab ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2" />
          </svg>
          AI Insights
        </button>
        <button
          className={`ai-main-tab crew-tab ${activeTab === "crew" ? "active" : ""}`}
          onClick={() => setActiveTab("crew")}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="4" cy="8" r="2.5" />
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="12" cy="11" r="2.5" />
            <path d="M6.5 8h1.5M8 5l2 1.5M8 11l2-1.5" />
          </svg>
          Crew Audit
          <span className="tab-new-badge">NEW</span>
        </button>
        <button
          className={`ai-main-tab history-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 2v4l3 3M2 8a6 6 0 1012 0A6 6 0 002 8z" />
          </svg>
          Audit History
          <span className="tab-count-badge">3</span>
        </button>
      </div>

      {/* Crew AI Tab */}
      {activeTab === "crew" && <CrewAiPanel />}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="audit-history-list">
          <div className="history-header">
            <div className="h-header-left">
              <div className="h-title">
                Audit <em>Archive</em>
              </div>
              <div className="h-sub">
                Browse and compare previous Crew AI design assessments
              </div>
            </div>
            <div className="h-header-right">
              <span className="h-count">3 audits</span>
            </div>
          </div>

          <div className="history-cards">
            {MOCK_PROJECTS.data.slice(0, 3).map((p, idx) => {
              const score = Math.floor(p.progress * 0.9 + 10);

              const date = p.createdAt.slice(0, 10);
              const violations =
                idx === 0
                  ? "0 critical · 0 warnings"
                  : idx === 1
                    ? "1 critical · 2 warnings"
                    : "0 critical · 3 warnings";
              const status =
                idx === 0
                  ? "Excellent"
                  : idx === 1
                    ? "Issues Found"
                    : "Completed";
              const statusBg =
                idx === 0
                  ? "rgba(74,124,89,0.08)"
                  : idx === 1
                    ? "rgba(192,120,58,0.08)"
                    : "rgba(74,124,89,0.08)";
              const statusColor =
                idx === 0 ? "#4a7c59" : idx === 1 ? "#c0783a" : "#4a7c59";
              return (
                <div key={idx} className="h-card">
                  <div className="h-card-left">
                    <div className="h-card-score-ring">
                      <svg viewBox="0 0 40 40" width="40" height="40">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke="rgba(26,25,23,0.06)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke={statusColor}
                          strokeWidth="3"
                          strokeDasharray={`${score} ${100 - score}`}
                          strokeDashoffset="25"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="h-card-score-num">{score}</span>
                    </div>
                  </div>
                  <div className="h-card-center">
                    <div className="h-card-name">{p.title}</div>
                    <div className="h-card-meta">
                      <span className="h-card-date">{date}</span>
                      <span className="h-card-sep">·</span>
                      <span className="h-card-detail">{violations}</span>
                    </div>
                    <div className="h-card-agents-row">
                      {["🏗️", "⚖️", "💰"].map((emoji, i) => (
                        <div key={i} className="h-card-agent">
                          {emoji}
                        </div>
                      ))}
                      <span className="h-card-agent-label">3 agents</span>
                    </div>
                  </div>
                  <div className="h-card-right">
                    <span
                      className="h-status-pill"
                      style={{ background: statusBg, color: statusColor }}
                    >
                      {status}
                    </span>
                    <button
                      className="h-view-btn"
                      onClick={() =>
                        window.open("/docs/crew_ai_report.html", "_blank")
                      }
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M2 4h12M2 8h8M2 12h10" />
                      </svg>
                      View Report
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === "insights" && (
        <>
          {/* Period tabs */}
          <div className="period-tabs">
            <button
              className={`ptab ${period === "7d" ? "active" : ""}`}
              onClick={() => setPeriod("7d")}
            >
              7 days
            </button>
            <button
              className={`ptab ${period === "month" ? "active" : ""}`}
              onClick={() => setPeriod("month")}
            >
              This month
            </button>
            <button
              className={`ptab ${period === "quarter" ? "active" : ""}`}
              onClick={() => setPeriod("quarter")}
            >
              Quarter
            </button>
            <button
              className={`ptab ${period === "all" ? "active" : ""}`}
              onClick={() => setPeriod("all")}
            >
              All time
            </button>
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
              <strong>{MOCK_PROJECTS.data[0].title}</strong> is your most active
              project with{" "}
              <strong>{MOCK_PROJECTS.data[0].progress}% progress</strong> this{" "}
              {period === "month" ? "month" : "period"}— client engagement is
              high. <em>{MOCK_PROJECTS.data[1].title} is fully approved</em> and
              ready to close. <strong>{MOCK_PROJECTS.data[2].title}</strong>
              needs attention: activity is lower compared to last week.{" "}
              <em>{MOCK_PROJECTS.data[3].title}</em>
              is at {MOCK_PROJECTS.data[3].progress}% — consider scheduling a
              kickoff session soon.
            </div>
            <div className="ai-sum-footer">
              <div className="ai-sum-tag">
                <span className="dot"></span> Live · Updated 2 min ago
              </div>
              <div className="ai-sum-ask" onClick={() => navigate("/ai-chat")}>
                Ask AI Assistant
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="summary-row">
            <div
              className="sum-card"
              onClick={() => navigate("/projects")}
              style={{ cursor: "pointer" }}
            >
              <div className="sum-label">
                Active Projects <span>↗</span>
              </div>
              <div className="sum-val">{totalProjects}</div>
              <div className="sum-trend trend-up">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                +1 this month
              </div>
              <div
                className="sum-bg"
                style={{ background: "var(--green)" }}
              ></div>
            </div>
            <div
              className="sum-card"
              onClick={() => alert("VR Session analytics coming soon!")}
              style={{ cursor: "pointer" }}
            >
              <div className="sum-label">
                VR Sessions <span>↗</span>
              </div>
              <div className="sum-val">{totalSessions}</div>
              <div className="sum-trend trend-up">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                {period === "7d"
                  ? "+3 this week"
                  : period === "month"
                    ? "+12 this month"
                    : "+45 this period"}
              </div>
              <div
                className="sum-bg"
                style={{ background: "var(--blue)" }}
              ></div>
            </div>
            <div
              className="sum-card"
              onClick={() => alert("Storage management triggered.")}
              style={{ cursor: "pointer" }}
            >
              <div className="sum-label">
                Storage Used <span>↗</span>
              </div>
              <div
                className="sum-val"
                style={{ fontSize: "28px", paddingTop: "4px" }}
              >
                {storageUsed}GB
              </div>
              <div className="sum-trend trend-warn">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                45% of 100GB
              </div>
              <div
                className="sum-bg"
                style={{ background: "var(--orange)" }}
              ></div>
            </div>
            <div className="sum-card">
              <div className="sum-label">
                Avg. Session Time <span>↗</span>
              </div>
              <div
                className="sum-val"
                style={{ fontSize: "28px", paddingTop: "4px" }}
              >
                {avgSessionTime} min
              </div>
              <div className="sum-trend trend-up">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                +4 min vs last month
              </div>
              <div className="sum-bg" style={{ background: "#7b6fa0" }}></div>
            </div>
          </div>

          {/* Two col: projects + insights */}
          <div className="two-col">
            {/* Project Health */}
            <div className="card" style={{ animationDelay: ".2s" }}>
              <div className="card-header">
                <div className="card-title">
                  <svg viewBox="0 0 24 24">
                    <path d="M2 14V6l6-4 6 4v8H2Z" />
                    <rect x="5" y="10" width="3" height="4" />
                  </svg>
                  Project Health
                </div>
                <div className="card-action">
                  View all{" "}
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="project-list">
                {MOCK_PROJECTS.data.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="proj-row"
                    onClick={() => navigate(`/project/${p.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="proj-icon"
                      style={{
                        background:
                          p.status === "VRActive"
                            ? "#1c1c1a"
                            : p.status === "Approved"
                              ? "var(--green)"
                              : "var(--orange)",
                      }}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M3 21V8l9-6 9 6v13" />
                        <path d="M9 21v-6h6v6" />
                      </svg>
                    </div>
                    <div className="proj-info">
                      <div className="proj-name">{p.title}</div>
                      <div className="proj-client">
                        {p.clientName} · {p.createdAt}
                      </div>
                      <div className="proj-bar-wrap">
                        <div className="proj-bar-bg">
                          <div
                            className="proj-bar-fill"
                            style={{
                              width: `${p.progress}%`,
                              background:
                                p.status === "VRActive"
                                  ? "#1c1c1a"
                                  : "var(--green)",
                            }}
                          ></div>
                        </div>
                        <div className="proj-pct">{p.progress}%</div>
                      </div>
                    </div>
                    <div className="proj-status">
                      <div
                        className={`status-pill sp-${p.status.toLowerCase().substring(0, 2)}`}
                      >
                        <span className="sdot"></span>
                        {p.status}
                      </div>
                      <div className="proj-date">Mar 12</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: storage + sessions */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {/* Storage breakdown */}
              <div className="card" style={{ animationDelay: ".25s" }}>
                <div className="card-header">
                  <div className="card-title">
                    <svg viewBox="0 0 24 24">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
                      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                    </svg>
                    Storage
                  </div>
                  <div
                    className="card-action"
                    onClick={() => alert("Storage management panel.")}
                    style={{ cursor: "pointer" }}
                  >
                    Manage
                  </div>
                </div>
                <div className="donut-wrap">
                  <svg
                    className="donut-svg"
                    width="90"
                    height="90"
                    viewBox="0 0 90 90"
                  >
                    <circle
                      cx="45"
                      cy="45"
                      r="34"
                      fill="none"
                      stroke="#e8e5e1"
                      strokeWidth="10"
                    />
                    {storageData.map((item, index) => {
                      const prevVals = storageData
                        .slice(0, index)
                        .reduce((acc, curr) => acc + curr.val, 0);
                      const rawOffset =
                        (prevVals / totalStorage) * circumference;
                      const dashArrayLen =
                        (item.val / totalStorage) * circumference;

                      return (
                        <circle
                          key={index}
                          cx="45"
                          cy="45"
                          r="34"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="10"
                          strokeDasharray={`${dashArrayLen} ${circumference}`}
                          strokeDashoffset={-rawOffset}
                          transform="rotate(-90 45 45)"
                        />
                      );
                    })}
                    <text
                      x="45"
                      y="42"
                      textAnchor="middle"
                      fontFamily="EB Garamond,serif"
                      fontSize="15"
                      fill="#1c1c1a"
                    >
                      {storageUsed}
                    </text>
                    <text
                      x="45"
                      y="54"
                      textAnchor="middle"
                      fontFamily="Inter,sans-serif"
                      fontSize="8"
                      fill="#b8b4af"
                    >
                      GB used
                    </text>
                  </svg>
                  <div className="donut-legend">
                    {storageData.map((item, index) => (
                      <div className="legend-row" key={index}>
                        <div
                          className="legend-dot"
                          style={{ background: item.color }}
                        ></div>
                        <div className="legend-label">{item.name}</div>
                        <div className="legend-val">{item.val} GB</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* VR Sessions bar */}
              <div className="card" style={{ animationDelay: ".3s" }}>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 2px",
                  }}
                >
                  <span style={{ fontSize: "9.5px", color: "var(--light)" }}>
                    W1
                  </span>
                  <span style={{ fontSize: "9.5px", color: "var(--light)" }}>
                    W2
                  </span>
                  <span style={{ fontSize: "9.5px", color: "var(--light)" }}>
                    W3
                  </span>
                  <span style={{ fontSize: "9.5px", color: "var(--light)" }}>
                    W4
                  </span>
                  <span style={{ fontSize: "9.5px", color: "var(--light)" }}>
                    W5
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: insights + client engagement */}
          <div className="two-col">
            {/* AI Insights list */}
            <div className="card" style={{ animationDelay: ".3s" }}>
              <div className="card-header">
                <div className="card-title">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  AI Recommendations
                </div>
                <div
                  className="card-action"
                  onClick={() => alert("View all recommendations")}
                  style={{ cursor: "pointer" }}
                >
                  View all{" "}
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div className="insight-list">
                {MOCK_PROJECTS.data.slice(0, 4).map((p, idx) => {
                  let type = "Pending";
                  let bg = "#f0ede8";
                  let color = "var(--muted)";
                  let title = `${p.title} needs a kickoff`;
                  let desc = `Project is only ${p.progress}% complete. No VR session has been scheduled yet.`;
                  let action = "Schedule session";
                  let icon = (
                    <svg
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  );

                  if (p.status === "Approved") {
                    type = "Done";
                    bg = "#e8f2ec";
                    color = "var(--green)";
                    title = `${p.title}  ready to close`;
                    desc = `All milestones approved. Consider archiving the project.`;
                    action = "Archive or extend";
                    icon = (
                      <svg
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4 12 14.01l-3-3" />
                      </svg>
                    );
                  } else if (p.progress > 70) {
                    type = "Opportunity";
                    bg = "#eef4fb";
                    color = "var(--blue)";
                    title = `${p.title}  strong progress`;
                    desc = `Client is highly engaged. Good time to propose additional design revisions.`;
                    action = "Open project";
                    icon = (
                      <svg
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="2" />
                        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83" />
                      </svg>
                    );
                  } else if (p.status === "InReview" || p.progress < 40) {
                    type = "Urgent";
                    bg = "#fef3e2";
                    color = "var(--orange)";
                    title = `${p.title} approval overdue`;
                    desc = `Consider sending a follow-up or scheduling a review session.`;
                    action = "Send reminder";
                    icon = (
                      <svg
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                    );
                  }

                  return (
                    <div className="insight-item" key={p.id || idx}>
                      <div
                        className="ii-icon"
                        style={{ background: bg, color: color }}
                      >
                        {icon}
                      </div>
                      <div className="ii-body">
                        <div className="ii-title">{title}</div>
                        <div className="ii-desc">{desc}</div>
                        <div
                          className="ii-action"
                          onClick={() =>
                            action === "Open project"
                              ? navigate(`/project/${p.id}`)
                              : alert(`${action} triggered for ${p.title}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {action}{" "}
                          <svg
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            width="10"
                            height="10"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className="ii-badge"
                        style={{ background: bg, color: color }}
                      >
                        {type}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client engagement */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="card" style={{ animationDelay: ".35s" }}>
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
                  {MOCK_PROJECTS.data.slice(0, 4).map((p, idx) => {
                    const initials = p.clientName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();
                    const sessions = Math.floor(p.progress * 0.6);
                    const score = p.progress;

                    let color = "#1c1c1a";
                    if (score >= 80) color = "#1c1c1a";
                    else if (score >= 50) color = "var(--green)";
                    else if (score >= 20) color = "var(--orange)";
                    else color = "#b8b4af";

                    return (
                      <div className="client-row" key={p.id || idx}>
                        <div
                          className="client-avatar"
                          style={{ background: color }}
                        >
                          {initials}
                        </div>
                        <div className="client-info">
                          <div className="client-name">{p.clientName}</div>
                          <div className="client-project">
                            {p.title} · {sessions} sessions
                          </div>
                          <div className="client-bar-bg">
                            <div
                              className="client-bar-fill"
                              style={{ width: `${score}%`, background: color }}
                            ></div>
                          </div>
                        </div>
                        <div
                          className="client-score"
                          style={{
                            color: score < 20 ? "var(--light)" : "inherit",
                          }}
                        >
                          {score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick ask */}
              <div
                className="rec-card"
                style={{ animationDelay: ".4s", cursor: "pointer" }}
                onClick={() => navigate("/ai-chat")}
              >
                <div className="rec-icon" style={{ background: "#1c1c1a" }}>
                  <svg viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="rec-body">
                  <div className="rec-label">Ask AI Assistant</div>
                  <div className="rec-title">Dig deeper into any insight</div>
                  <div className="rec-desc">
                    Ask follow-up questions, generate reports, or draft client
                    emails based on these findings.
                  </div>
                </div>
                <div className="rec-arrow">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="var(--light)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Background Data Sync Indicator */}
          <div
            style={{
              position: "fixed",
              bottom: 10,
              right: 10,
              fontSize: 8,
              opacity: 0.3,
              color: "var(--ink-4)",
              pointerEvents: "none",
            }}
          >
            SYNC: {MOCK_PROJECTS.data.length}P · {MOCK_ACTIVITIES.length}A ·{" "}
            {MOCK_SESSIONS.length}S · {activeProjects}ACT
          </div>
        </>
      )}
    </div>
  );
};

export default AiInsightsPage;
