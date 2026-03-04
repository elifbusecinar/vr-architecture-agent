import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Project } from "@/types/project.types";
import type { WorkspaceUsage } from "@/types/analytics.types";
import type { VRSession } from "@/types/session.types";
import type { ActivityLog } from "@/types/activity.types";
import { ActivityTypeValues } from "@/types/activity.types";
import { useProjectActions } from "@/hooks/useProjects";
import { NotificationDrawer, BellIcon } from "@/components/dashboard/NotificationDrawer";
import ThreeDViewer from "@/components/project/ThreeDViewer/ThreeDViewer";

import { useNavigate } from "react-router-dom";
import { SettingsPage, NotificationsPage } from "@/pages";
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import AiInsightsPanel from '@/components/dashboard/AiInsightsPanel';
import VrAssistantChat from '@/components/dashboard/VrAssistantChat';

// ─── TYPES ─────────────────────────────────────────────────────────────────

export type ArchitectTab =
    | "overview"
    | "projects"
    | "approvals"
    | "sessions"
    | "annotations"
    | "models"
    | "files"
    | "clients"
    | "comments"
    | "settings"
    | "notifications"
    | "ai-insights";

type Page = ArchitectTab;

type BadgeVariant = "live" | "review" | "draft" | "vr" | "warn";

interface ArchitectDashboardProps {
    firstName: string;
    activeTab: ArchitectTab;
    projects?: Project[];
    analytics?: WorkspaceUsage | null;
    activeSessions?: VRSession[];
    activities?: ActivityLog[];
    isLoading?: boolean;
}

// ─── SHARED ICONS ──────────────────────────────────────────────────────────

const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
);
const ListIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h12M2 8h12M2 13h8" /></svg>
);
const VRIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="5" width="14" height="8" rx="2" />
        <circle cx="5.5" cy="9" r="1.5" /><circle cx="10.5" cy="9" r="1.5" />
        <path d="M7 9h2" />
    </svg>
);
const ModelIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2L2 5.5v5L8 14l6-3.5v-5L8 2z" /><path d="M2 5.5L8 9l6-3.5M8 9v5" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8l3.5 4L13 4" />
    </svg>
);
const PinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2l4 4-2 2-1.5-.5-4 4 .5 1.5-2 2-4-4 2-2 1.5.5 4-4L8 4l2-2z" />
        <path d="M2 14l3-3" />
    </svg>
);
const FolderIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" />
    </svg>
);
const UserIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" />
    </svg>
);
const ChatIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2H3a1 1 0 00-1 1v8a1 1 0 001 1h4l3 2v-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" />
    </svg>
);
const PlusIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 1v14M1 8h14" /></svg>
);
const UploadIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 11V1M4 4l4-3 4 3M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
);
const LogOutIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l3 3-3 3M13 8H6" />
    </svg>
);
const UsersIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="2.5" /><path d="M1 13c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
        <circle cx="11" cy="6" r="2" /><path d="M8 13c0-1.5 1-2.5 2.5-2.5S13 11.5 13 13" />
    </svg>
);
const PackageIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1L2 4.5v7L8 15l6-3.5v-7L8 1z" /><path d="M2 4.5L8 8l6-3.5M8 8v7" /></svg>;
const PlayIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z" /></svg>;
const WarningIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l7 12H1L8 2z" /><path d="M8 6v4m0 2h.01" /></svg>;
const HomeIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 7l7-6 7 6v7a1 1 0 01-1 1h-3v-4H6v4H3a1 1 0 01-1-1V7z" /></svg>;
const BuildingIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 1h12v14H2zM5 4h2M5 7h2M5 10h2M9 4h2M9 7h2M9 10h2" /></svg>;
const ChevronDown = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;
const ExternalIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 3l-7 7M13 3v4M13 3H9" /></svg>;
const ChartIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 13V8h3v5H2zm4 0V4h3v9H6zm4 0V9h3v4h-3z" /></svg>;
const TrashIcon = () => (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M4 4l1 10a1 1 0 001 1h4a1 1 0 001-1l1-10" />
    </svg>
);

// ─── BADGE ─────────────────────────────────────────────────────────────────

const Badge: React.FC<{ variant: BadgeVariant; children: React.ReactNode; small?: boolean }> = ({ variant, children, small }) => {
    const map: Record<BadgeVariant, React.CSSProperties> = {
        live: { background: "var(--green-soft)", color: "var(--green)", borderColor: "rgba(26,122,74,0.12)" },
        review: { background: "var(--blue-soft)", color: "var(--blue)", borderColor: "rgba(45,91,227,0.12)" },
        draft: { background: "var(--bg-inset)", color: "var(--ink-3)", borderColor: "var(--border)" },
        vr: { background: "var(--amber-soft)", color: "var(--amber)", borderColor: "rgba(180,83,9,0.12)" },
        warn: { background: "rgba(185,28,28,0.07)", color: "#B91C1C", borderColor: "rgba(185,28,28,0.12)" },
    };
    const dots: Record<BadgeVariant, string> = { live: "var(--green)", review: "var(--blue)", draft: "var(--ink-3)", vr: "var(--amber)", warn: "#B91C1C" };
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: small ? "1px 6px" : "3px 8px", borderRadius: 20, fontFamily: "var(--mono)", fontSize: small ? 9 : 10, fontWeight: 500, letterSpacing: "0.02em", border: "1px solid transparent", ...map[variant] }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: dots[variant], flexShrink: 0, animation: (variant === "live" || variant === "vr") ? "livepulse 2s infinite" : undefined }} />
            {children}
        </span>
    );
};

// ─── PROGRESS ──────────────────────────────────────────────────────────────

const Progress: React.FC<{ value: number; color?: string; width?: number }> = ({ value, color, width = 90 }) => (
    <div>
        <div style={{ height: 3, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden", width }}>
            <div style={{ height: "100%", borderRadius: 100, width: `${value}%`, transition: "width 0.6s ease", background: color ?? (value >= 80 ? "var(--green)" : value > 40 ? "var(--blue)" : "var(--ink-3)") }} />
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 4 }}>{value}%</div>
    </div>
);

// ─── AVATAR ────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string; gradient?: string; size?: number }> = ({ initials, gradient, size = 26 }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: gradient ?? "var(--bg-inset)", border: gradient ? "none" : "1px solid var(--border-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size > 30 ? 12 : 10, fontWeight: 600, color: gradient ? "white" : "var(--ink-3)", fontFamily: "var(--sans)", flexShrink: 0 }}>
        {initials}
    </div>
);

// ─── PANEL ─────────────────────────────────────────────────────────────────

const Panel: React.FC<{ title: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({ title, right, children, style }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden", ...style }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{title}</div>
            {right}
        </div>
        {children}
    </div>
);

// ─── BTN ───────────────────────────────────────────────────────────────────

const Btn: React.FC<{ variant?: "primary" | "secondary" | "ghost"; onClick?: () => void; children: React.ReactNode; style?: React.CSSProperties; small?: boolean; type?: "button" | "submit" }> = ({ variant = "primary", onClick, children, style, small, type = "button" }) => {
    const base: React.CSSProperties = {
        display: "flex", alignItems: "center", gap: 6, padding: small ? "4px 10px" : "8px 16px", borderRadius: 6, fontSize: small ? 11 : 13, fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.12s", whiteSpace: "nowrap"
    };
    const variants: Record<string, React.CSSProperties> = {
        primary: { background: "var(--ink)", color: "var(--bg)" },
        secondary: { background: "var(--bg-card)", color: "var(--ink-2)", border: "1px solid var(--border-md)" },
        ghost: { background: "transparent", color: "var(--ink-3)", border: "1px solid var(--border)" },
    };
    return <button type={type} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
};

// ─── NAV LINK ──────────────────────────────────────────────────────────────

interface NavItemDef { id: Page; label: string; badge?: string; badgeVariant?: BadgeVariant; icon: React.ReactNode }

const NavLink: React.FC<{ item: NavItemDef; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: active ? 500 : 400, color: active ? "var(--ink)" : "var(--ink-2)", cursor: "pointer", background: active ? "var(--bg-inset)" : "transparent", transition: "background 0.12s, color 0.12s" }}
        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; } }}
        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; } }}
    >
        <div style={{ width: 16, height: 16, opacity: active ? 1 : 0.5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
        {item.label}
        {item.badge && (
            <span style={{
                marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, padding: "1px 6px", borderRadius: 20, fontWeight: 500,
                ...(item.badgeVariant === "live" ? { background: "var(--green-soft)", color: "var(--green)", border: "1px solid rgba(26,122,74,0.15)" }
                    : item.badgeVariant === "warn" ? { background: "rgba(185,28,28,0.07)", color: "#B91C1C", border: "1px solid rgba(185,28,28,0.12)" }
                        : item.badgeVariant === "vr" ? { background: "var(--amber-soft)", color: "var(--amber)", border: "1px solid rgba(180,83,9,0.12)" }
                            : { background: "var(--bg-inset)", border: "1px solid var(--border-md)", color: "var(--ink-2)" })
            }}>{item.badge}</span>
        )}
    </div>
);

// ─── PROJECT PILL (sidebar) ────────────────────────────────────────────────

const ProjectPill: React.FC<{ icon: React.ReactNode; name: string; client: string; progress: number; active?: boolean; onClick: () => void }> = ({ icon, name, client, progress, active, onClick }) => (
    <div onClick={onClick} style={{ margin: "0 10px 4px", padding: "8px 10px", borderRadius: "var(--radius-sm)", border: `1px solid ${active ? "rgba(45,91,227,0.2)" : "var(--border)"}`, background: active ? "var(--blue-soft)" : "var(--bg)", cursor: "pointer", transition: "all 0.12s" }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
            <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)" }}>{icon}</div>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginBottom: 5 }}>{client}</div>
        <div style={{ height: 2, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: active ? "var(--blue)" : "var(--ink-3)", borderRadius: 100, transition: "width 0.6s ease" }} />
        </div>
    </div>
);

// ─── NAV CONFIG ────────────────────────────────────────────────────────────

const ARCH_NAV: { section: string; items: NavItemDef[] }[] = [
    {
        section: "Workspace",
        items: [
            { id: "overview", label: "Overview", icon: <GridIcon /> },
            { id: "projects", label: "My Projects", icon: <ListIcon /> },
            { id: "approvals", label: "Approvals", icon: <CheckIcon /> },
            { id: "sessions", label: "VR Sessions", icon: <VRIcon /> },
            { id: "annotations", label: "Annotations", icon: <PinIcon /> },
            { id: "ai-insights", label: "AI Insights", icon: <WarningIcon /> },
        ],
    },
    {
        section: "Assets",
        items: [
            { id: "models", label: "3D Models", icon: <ModelIcon /> },
            { id: "files", label: "Files", icon: <FolderIcon /> },
        ],
    },
    {
        section: "Clients",
        items: [
            { id: "clients", label: "My Clients", icon: <UserIcon /> },
            { id: "comments", label: "Comments", icon: <ChatIcon /> },
        ],
    },
];

// ─── OVERVIEW PAGE ─────────────────────────────────────────────────────────

const OverviewPage: React.FC<{
    firstName: string;
    projects: Project[];
    analytics?: WorkspaceUsage | null;
    activeSessions: VRSession[];
    activities?: ActivityLog[];
    isLoading?: boolean;
    onViewProject: (id: string, modelUrl: string) => void;
}> = ({ firstName, projects, analytics, activeSessions, activities, isLoading, onViewProject }) => {
    const { deleteProject, toggleSharing } = useProjectActions();

    const getActivityIcon = (type: number) => {
        switch (type) {
            case ActivityTypeValues.AssetUploaded: return <PackageIcon />;
            case ActivityTypeValues.SessionStarted: return <VRIcon />;
            case ActivityTypeValues.ProjectShared: return <ExternalIcon />;
            case ActivityTypeValues.CommentAdded: return <ChatIcon />;
            default: return <ChartIcon />;
        }
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
            deleteProject.mutate(id);
        }
    };
    const mapStatus = (status: string): { variant: BadgeVariant; label: string } => {
        switch (status) {
            case 'Draft': return { variant: 'draft', label: 'Draft' };
            case 'InReview': return { variant: 'review', label: 'In Review' };
            case 'Approved': return { variant: 'live', label: 'Approved' };
            case 'VRActive':
            case 'VRReady': return { variant: 'vr', label: 'VR Active' };
            case 'Error': return { variant: 'warn', label: 'Error' };
            default: return { variant: 'draft', label: status };
        }
    };

    const stats = [
        {
            label: "Active Projects",
            value: analytics?.totalProjectsCount ?? projects.length,
            delta: analytics?.totalProjectsDelta ? `+${analytics.totalProjectsDelta}` : "0",
            deltaType: (analytics?.totalProjectsDelta ?? 0) >= 0 ? "up" : "down",
            meta: "this month",
            glow: "var(--ink)"
        },
        {
            label: "Storage Used",
            value: analytics?.storageUsedBytes ? `${(analytics.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(1)}GB` : "0.0GB",
            delta: analytics?.storageUsedPercentage ? `${analytics.storageUsedPercentage.toFixed(0)}%` : "0%",
            deltaType: (analytics?.storageUsedPercentage ?? 0) > 80 ? "down" : "up",
            meta: analytics?.storageLimitBytes ? `of ${(analytics.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(0)}GB` : "available",
            glow: "var(--green)"
        },
        {
            label: "In Review",
            value: projects.filter(p => p.status === 'InReview').length,
            delta: "0",
            deltaType: "up",
            meta: "awaiting",
            glow: "var(--amber)"
        },
        {
            label: "VR Sessions",
            value: analytics?.totalSessionsCount ?? activeSessions.length,
            delta: analytics?.totalSessionsDelta ? `+${analytics.totalSessionsDelta}` : "0",
            deltaType: "up",
            meta: "active",
            glow: "var(--blue)"
        },
    ];

    return (
        <div style={{ padding: 28 }}>
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect Dashboard — Feb 2026</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    Good morning, <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>{firstName}.</em>
                </div>
            </div>

            {/* Today strip */}
            <div style={{ background: "var(--ink)", borderRadius: "var(--radius)", padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "rgba(245,243,239,.3)", textTransform: "uppercase", letterSpacing: ".08em", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B91C1C" }} />Today
                </div>
                <div style={{ display: "flex", gap: 8, overflow: "hidden", flex: 1, position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 11px", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(245,243,239,.4)", fontSize: 10 }}>
                        No pending events for today
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {stats.map(s => (
                    <div key={s.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px 20px", position: "relative", overflow: "hidden" }}>
                        <div style={{ fontSize: 11, borderBottom: "1px solid var(--border)", paddingBottom: 8, marginBottom: 12, color: "var(--ink-3)", display: "flex", justifyContent: "space-between" }}>
                            {s.label}
                            <Btn variant="ghost" small><ExternalIcon /></Btn>
                        </div>
                        <div style={{ fontFamily: "var(--serif)", fontSize: 36, lineHeight: 1, color: "var(--ink)", letterSpacing: "-0.02em" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "var(--mono)", fontSize: 10, padding: "1px 5px", borderRadius: 4, background: s.deltaType === "up" ? "var(--green-soft)" : s.deltaType === "down" ? "var(--amber-soft)" : "var(--blue-soft)", color: s.deltaType === "up" ? "var(--green)" : s.deltaType === "down" ? "var(--amber)" : "var(--blue)" }}>
                                {s.deltaType === "down" && <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><WarningIcon /></div>}
                                {s.delta}
                            </span>
                            {s.meta}
                        </div>
                        <div style={{ position: "absolute", bottom: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: s.glow, opacity: 0.06, pointerEvents: "none" }} />
                    </div>
                ))}
            </div>

            {/* Main grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
                {/* Projects */}
                <Panel title="My Projects" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{projects.length} assigned</span>}>
                    {isLoading ? (
                        <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 16 }}>
                            {[1, 2, 3].map(sk => (
                                <div key={sk} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <div className="skeleton sk-title" style={{ width: "40%", height: 16 }} />
                                    <div className="skeleton sk-line" style={{ width: "100%", height: 6 }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        projects.slice(0, 4).map((p, i, arr) => {
                            const { variant, label } = mapStatus(p.status);
                            return (
                                <div key={p.id} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.1s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <div style={{ width: 14, height: 14, color: "var(--ink-3)" }}>{p.category === 'Commercial' ? <BuildingIcon /> : <HomeIcon />}</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{p.title}</div>
                                        </div>
                                        <Badge variant={variant}>{label}</Badge>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.clientName} · {new Date(p.createdAt).toLocaleDateString()}</div>
                                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); toggleSharing.mutate({ id: p.id, isPublic: !p.isPublic }); }}
                                                style={{ width: 14, height: 14, color: p.isPublic ? "var(--green)" : "var(--ink-4)", cursor: "pointer" }}
                                                title={p.isPublic ? "Public" : "Private"}
                                            >
                                                <ExternalIcon />
                                            </div>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.title); }}
                                                style={{ width: 14, height: 14, color: "var(--amber)", cursor: "pointer" }}
                                                title="Delete"
                                            >
                                                <TrashIcon />
                                            </div>
                                            <div onClick={(e) => { e.stopPropagation(); onViewProject(p.id, p.modelUrl); }} style={{ width: 14, height: 14, color: "var(--ink-4)", cursor: "pointer" }}><EditIcon /></div>
                                            <div onClick={(e) => { e.stopPropagation(); onViewProject(p.id, p.modelUrl); }} style={{ width: 14, height: 14, color: "var(--ink-4)", cursor: "pointer" }}><PlayIcon /></div>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <Progress value={p.progress} />
                                    </div>
                                </div>
                            );
                        }))}
                </Panel>

                {/* Feed */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <Panel title="Recent Activity" right={<Btn variant="ghost" small>Clear</Btn>}>
                        {(!activities || activities.length === 0) ? (
                            <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)", fontSize: "12px" }}>No recent activity</div>
                        ) : (
                            activities.slice(0, 5).map((a, i, arr) => (
                                <div key={a.id} title={a.userName} style={{ padding: "12px 18px", display: "flex", gap: 12, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                                    <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--bg-inset)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--ink-2)" }}>
                                        {getActivityIcon(a.type)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>{a.message} {a.projectTitle && <span>on <strong>{a.projectTitle}</strong></span>}</div>
                                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 3 }}>
                                            {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {a.userName.split(' ')[0]}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Panel>

                    {/* Workload */}
                    <Panel title="This Week" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>capacity</span>}>
                        <div style={{ padding: "14px 18px" }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                {[{ v: "-", l: "hours" }, { v: projects.length, l: "projects" }, { v: (activeSessions || []).length, l: "sessions" }].map(s => (
                                    <div key={s.l} style={{ flex: 1, padding: "9px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", textAlign: "center" }}>
                                        <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--ink)" }}>{s.v}</div>
                                        <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-3)", marginTop: 2 }}>{s.l}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 4, borderRadius: 100, background: "var(--bg-inset)", overflow: "hidden", marginBottom: 4 }}>
                                <div style={{ height: "100%", width: "0%", background: "var(--ink-3)", borderRadius: 100 }} />
                            </div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)" }}>Capacity data not available</div>
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

const ProjectsPage: React.FC<{
    projects: Project[];
    isLoading?: boolean;
    onViewProject: (id: string, modelUrl: string) => void;
    onCreateProject: () => void;
}> = ({ projects, isLoading, onViewProject, onCreateProject }) => {
    const { deleteProject, toggleSharing } = useProjectActions();

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
            deleteProject.mutate(id);
        }
    };

    const mapStatus = (status: string): { variant: BadgeVariant; label: string } => {
        switch (status) {
            case 'Draft': return { variant: 'draft', label: 'Draft' };
            case 'InReview': return { variant: 'review', label: 'In Review' };
            case 'Approved': return { variant: 'live', label: 'Approved' };
            case 'VRActive':
            case 'VRReady': return { variant: 'vr', label: 'VR Active' };
            case 'Error': return { variant: 'warn', label: 'Error' };
            default: return { variant: 'draft', label: status };
        }
    };

    return (
        <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect · Management</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>My Projects</div>
                </div>
                <Btn variant="primary" onClick={onCreateProject}><PlusIcon /> Create Project</Btn>
            </div>

            {isLoading ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    {[1, 2, 3, 4, 5, 6].map(sk => (
                        <Panel key={sk} title={<span className="skeleton sk-title" style={{ width: "30%", height: 14, display: "inline-block" }}></span>}>
                            <div style={{ padding: "16px 18px" }}>
                                <div className="skeleton sk-line" style={{ width: "60%", height: 10, marginBottom: 12 }} />
                                <div className="skeleton sk-line" style={{ width: "100%", height: 6, marginBottom: 16 }} />
                                <div style={{ display: "flex", gap: 10 }}>
                                    <div className="skeleton sk-btn" style={{ width: 60, height: 26 }} />
                                    <div className="skeleton sk-btn" style={{ width: 60, height: 26 }} />
                                </div>
                            </div>
                        </Panel>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--border-md)", borderRadius: "var(--radius)", background: "var(--bg-card)", color: "var(--ink-4)" }}>
                    <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><FolderIcon /></div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No projects active</div>
                    <div style={{ fontSize: 12 }}>You haven't been assigned to any projects yet.</div>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    {projects.map(p => {
                        const { variant, label } = mapStatus(p.status);
                        return (
                            <Panel key={p.id} title={p.title} style={{ cursor: "pointer" }}>
                                <div style={{ padding: "16px 18px" }} onClick={(e) => {
                                    // Do not navigate if clicking buttons/icons
                                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('svg')) return;
                                    window.location.href = `/project/${p.id}`;
                                }}>
                                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginBottom: 12 }}>{p.clientName} · {new Date(p.createdAt).toLocaleDateString()}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 12, color: "var(--ink)" }}>Progress</span>
                                        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{p.progress}%</span>
                                    </div>
                                    <Progress value={p.progress} />
                                    <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <Badge variant={variant}>{label}</Badge>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); toggleSharing.mutate({ id: p.id, isPublic: !p.isPublic }); }}
                                                style={{ color: p.isPublic ? "var(--green)" : "var(--ink-2)", cursor: "pointer" }}
                                                title={p.isPublic ? "Public" : "Private"}
                                            >
                                                <ExternalIcon />
                                            </div>
                                            <div
                                                onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.title); }}
                                                style={{ color: "var(--amber)", cursor: "pointer" }}
                                                title="Delete"
                                            >
                                                <TrashIcon />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <Btn variant="ghost" small onClick={() => onViewProject(p.id, p.modelUrl)}>VR</Btn>
                                            <Btn variant="ghost" small onClick={() => { window.location.href = `/project/${p.id}`; }}>Details</Btn>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── APPROVALS PAGE ────────────────────────────────────────────────────────

const ApprovalsPage: React.FC = () => {
    return (
        <div style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect · Workflow</div>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Approvals</div>
                </div>
                <Btn variant="primary"><PlusIcon /> Send for approval</Btn>
            </div>

            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--border-md)", borderRadius: "var(--radius)", background: "var(--bg-card)", color: "var(--ink-4)" }}>
                <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><CheckIcon /></div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No pending approvals</div>
                <div style={{ fontSize: 12 }}>Items awaiting client feedback will appear here.</div>
            </div>
        </div>
    );
};

// ─── SESSIONS PAGE ─────────────────────────────────────────────────────────

const SessionsPage: React.FC<{ activeSessions: VRSession[] }> = ({ activeSessions }) => (
    <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect · VR</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>VR Sessions</div>
            </div>
            <Btn variant="primary"><PlusIcon /> Schedule session</Btn>
        </div>

        {activeSessions.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {activeSessions.map((s, i) => (
                    <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow-sm)", cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ height: 80, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <div style={{ width: 14, height: 14, color: "white" }}><PlayIcon /></div>
                        </div>
                        <div style={{ padding: "10px 12px" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>Session on {s.projectId}</div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)" }}>{new Date(s.startTime).toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--border-md)", borderRadius: "var(--radius)", background: "var(--bg-card)", color: "var(--ink-4)" }}>
                <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><VRIcon /></div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No sessions found</div>
                <div style={{ fontSize: 12 }}>Your past and upcoming VR sessions will show up here.</div>
            </div>
        )}
    </div>
);

// ─── MODELS PAGE ───────────────────────────────────────────────────────────

const ModelsPage: React.FC = () => (
    <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect · Assets</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>3D Models</div>
            </div>
            <Btn variant="primary"><UploadIcon /> Upload model</Btn>
        </div>

        <div style={{ border: "1.5px dashed var(--border-dk)", borderRadius: "var(--radius)", padding: "28px 20px", textAlign: "center", background: "var(--bg)", marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "var(--ink-3)" }}><PackageIcon /></div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>No models available</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>Upload GLB / GLTF files to start visualizing.</div>
        </div>
    </div>
);

// ─── PLACEHOLDER ───────────────────────────────────────────────────────────

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div style={{ padding: 28 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 24 }}>{title}</div>
        <div style={{ background: "var(--bg-card)", border: "1.5px dashed var(--border-dk)", borderRadius: "var(--radius)", padding: 48, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-3)" }}>Detailed view for {title} coming soon.</div>
        </div>
    </div>
);


// ─── CLIENTS PAGE ──────────────────────────────────────────────────────────

const ClientsPage: React.FC = () => (
    <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Architect · Relationships</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>My Clients</div>
            </div>
            <Btn variant="primary"><PlusIcon /> New Client</Btn>
        </div>

        <div style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--border-md)", borderRadius: "var(--radius)", background: "var(--bg-card)", color: "var(--ink-4)" }}>
            <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><UsersIcon /></div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No clients registered</div>
            <div style={{ fontSize: 12 }}>Invite clients to collaborate on your projects.</div>
        </div>
    </div>
);

// ─── ARCHITECT DASHBOARD ───────────────────────────────────────────────────

export default function ArchitectDashboard({ firstName, activeTab, projects = [], analytics, activeSessions = [], activities = [], isLoading }: ArchitectDashboardProps) {
    const [page, setPage] = useState<Page>(activeTab);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [viewerProjectId, setViewerProjectId] = useState<string | null>(null);
    const [viewerModelUrl, setViewerModelUrl] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleViewProject = (id: string, modelUrl: string) => {
        setViewerProjectId(id);
        setViewerModelUrl(modelUrl);
    };

    // Sync internal page with prop
    useEffect(() => {
        if (activeTab) setPage(activeTab);
    }, [activeTab]);

    const renderPage = () => {
        const p = page as string;
        switch (page) {
            case "overview": return (
                <OverviewPage
                    firstName={firstName}
                    projects={projects || []}
                    analytics={analytics}
                    activeSessions={activeSessions || []}
                    activities={activities}
                    onViewProject={handleViewProject}
                    isLoading={isLoading}
                />
            );
            case "projects": return (
                <ProjectsPage
                    projects={projects || []}
                    onViewProject={handleViewProject}
                    onCreateProject={() => setIsCreateModalOpen(true)}
                    isLoading={isLoading}
                />
            );
            case "approvals": return <ApprovalsPage />;
            case "sessions": return <SessionsPage activeSessions={activeSessions || []} />;
            case "models": return <ModelsPage />;
            case "clients": return <ClientsPage />;
            case "ai-insights": return <AiInsightsPanel />;
            case "settings": return <SettingsPage />;
            case "notifications": return <NotificationsPage />;
            default: return <PlaceholderPage title={p.charAt(0).toUpperCase() + p.slice(1)} />;
        }
    };

    const displayPageName = page as string;

    return (
        <div style={{ display: "flex", fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--ink)", height: "100vh", position: "relative", overflow: "hidden" }}>
            <aside style={{ width: 240, minHeight: "100vh", background: "var(--bg-card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
                {/* Logo */}
                <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: "var(--ink)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bg)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>VR Architecture</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 2 }}>Architect Portal</div>
                    </div>
                </div>

                {/* Today focus */}
                <div style={{ margin: "8px 10px", padding: "9px 11px", borderRadius: "var(--radius-sm)", background: "var(--bg-inset)", border: "1px solid var(--border-md)" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Today's focus</div>
                    <div style={{ fontSize: 11, color: "var(--ink-4)", fontStyle: "italic" }}>No tasks for today</div>
                </div>

                {/* Nav */}
                <div style={{ flex: 1 }}>
                    {ARCH_NAV.map((section, si) => (
                        <div key={section.section}>
                            {si > 0 && <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />}
                            <div style={{ padding: "12px 10px 6px" }}>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>{section.section}</div>
                                {section.items.map(item => (
                                    <NavLink key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 18px 4px" }}>Active projects</div>
                    {projects.length > 0 ? (
                        projects.slice(0, 3).map(p => (
                            <ProjectPill
                                key={p.id}
                                icon={p.category === 'Commercial' ? <BuildingIcon /> : <HomeIcon />}
                                name={p.title}
                                client={`${p.clientName} · ${new Date(p.createdAt).toLocaleDateString()}`}
                                progress={p.progress}
                                active={page === 'projects'}
                                onClick={() => setPage("projects")}
                            />
                        ))
                    ) : (
                        <div style={{ padding: "8px 18px", fontSize: 11, color: "var(--ink-4)", fontStyle: "italic" }}>No active projects</div>
                    )}
                </div>

                {/* User */}
                <div style={{ marginTop: "auto", padding: "12px 10px", borderTop: "1px solid var(--border)", position: "relative" }}>
                    {showUserMenu && (
                        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 10, right: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", padding: 4, zIndex: 1000, animation: "fadeUp 0.15s ease" }}>
                            {[
                                {
                                    label: "Profile Settings",
                                    icon: <UserIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        navigate("/settings");
                                        setShowUserMenu(false);
                                    }
                                },
                                {
                                    label: "Notifications",
                                    icon: <BellIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        navigate("/notifications");
                                        setShowUserMenu(false);
                                    }
                                },
                                {
                                    label: "Workspace Team",
                                    icon: <UsersIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setPage("clients");
                                        setShowUserMenu(false);
                                    }
                                },
                                {
                                    label: "Sign Out",
                                    icon: <LogOutIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        logout();
                                        window.location.href = "/login";
                                    },
                                    color: "#B91C1C"
                                },
                            ].map(item => (
                                <div key={item.label} onClick={item.action} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 6, cursor: "pointer", transition: "all 0.1s", fontSize: 12, color: item.color || "var(--ink-2)" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <div style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>{item.icon}</div>
                                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background 0.12s" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                        <Avatar initials={firstName.charAt(0)} gradient="linear-gradient(135deg,#B45309,#E07000)" size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{firstName}</div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>Architect</div>
                        </div>
                        <div style={{ transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown /></div>
                    </div>
                </div>
            </aside>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>
                <header style={{ height: 52, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 28px", gap: 12, background: "var(--bg-card)", position: "sticky", top: 0, zIndex: 100 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, fontSize: 13, color: "var(--ink-3)" }}>
                        VR Architecture &nbsp;/&nbsp; <span style={{ color: "var(--ink)", fontWeight: 500 }}>{displayPageName.charAt(0).toUpperCase() + displayPageName.slice(1)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                            className="search-trigger"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                        >
                            <span className="st-icon">⌕</span>
                            <span className="st-placeholder">Search or jump to…</span>
                            <div className="st-kbd">
                                <span className="kbd">⌘</span>
                                <span className="kbd">K</span>
                            </div>
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); setIsNotifOpen(!isNotifOpen); }}
                            style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", position: "relative", color: isNotifOpen ? "var(--ink)" : "var(--ink-2)", transition: "all 0.2s" }}
                        >
                            <BellIcon /><div style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, background: "var(--red)", borderRadius: "50%", border: "1.5px solid var(--bg-card)" }} />
                        </div>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--bg-card)", color: "var(--ink)", border: "1px solid var(--border-md)", fontFamily: "var(--sans)" }}>
                            <UploadIcon /> Upload GLB
                        </button>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--ink)", color: "var(--bg)", border: "none", fontFamily: "var(--sans)" }}>
                            <PlusIcon /> New Session
                        </button>
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto" }}>
                    {renderPage()}
                </main>
            </div>
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            {viewerProjectId && (
                <div style={{ position: "fixed", inset: 0, zIndex: 3000, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: 48, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
                        <div style={{ fontWeight: 600 }}>Project Preview</div>
                        <Btn variant="ghost" small onClick={() => setViewerProjectId(null)}>Close Viewer</Btn>
                    </div>
                    <div style={{ flex: 1, position: "relative" }}>
                        <ThreeDViewer projectId={viewerProjectId} modelUrl={viewerModelUrl || undefined} />
                    </div>
                </div>
            )}
            <VrAssistantChat />
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
