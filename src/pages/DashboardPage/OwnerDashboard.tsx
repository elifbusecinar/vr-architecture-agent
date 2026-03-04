import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Project } from "@/types/project.types";
import type { WorkspaceUsage } from "@/types/analytics.types";
import type { VRSession } from "@/types/session.types";
import type { ActivityLog } from "@/types/activity.types";
import { NotificationDrawer, BellIcon } from "@/components/dashboard/NotificationDrawer";

// ─── TYPES ─────────────────────────────────────────────────────────────────

import { useNavigate } from "react-router-dom";
import { SettingsPage, NotificationsPage } from "@/pages";

// ─── TYPES ─────────────────────────────────────────────────────────────────

type Page =
    | "overview"
    | "projects"
    | "sessions"
    | "models"
    | "portal"
    | "team"
    | "analytics"
    | "storage"
    | "audit"
    | "settings"
    | "notifications";

type BadgeVariant = "live" | "review" | "draft" | "vr" | "warn";

interface NavItem {
    id: Page;
    label: string;
    badge?: string;
    badgeVariant?: BadgeVariant;
    icon: React.ReactNode;
}

interface Workspace {
    id: string;
    name: string;
    description?: string;
}

interface OwnerDashboardProps {
    firstName: string;
    activeTab?: Page;
    analytics: WorkspaceUsage | null;
    activeSessions: VRSession[] | undefined;
    projects?: Project[];
    activities?: ActivityLog[];
    isLoading?: boolean;
    workspaces: Workspace[];
    currentWorkspaceId: string;
    onWorkspaceChange: (id: string) => void;
}

// ─── ICONS ─────────────────────────────────────────────────────────────────

const GridIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
);
const ListIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3h12M2 8h12M2 13h8" />
    </svg>
);
const VRIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="5" width="14" height="8" rx="2" />
        <circle cx="5.5" cy="9" r="1.5" />
        <circle cx="10.5" cy="9" r="1.5" />
        <path d="M7 9h2" />
    </svg>
);
const ModelIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 2L2 5.5v5L8 14l6-3.5v-5L8 2z" />
        <path d="M2 5.5L8 9l6-3.5M8 9v5" />
    </svg>
);
const UserCheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="3" />
        <path d="M1 14c0-3 2-5 5-5M10 9l2 2 3-3" />
    </svg>
);
const TeamIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="5" cy="5" r="2.5" />
        <circle cx="11" cy="5" r="2.5" />
        <path d="M0 14c0-2.5 2-4 5-4M16 14c0-2.5-2-4-5-4M8 14c0-2-1.5-3.5-3-3.5" />
    </svg>
);
const ChartIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12l3-4 3 2 3-5 3 3" />
        <path d="M2 14h12" />
    </svg>
);
const StorageIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="4" width="14" height="4" rx="1" />
        <rect x="1" y="9" width="14" height="4" rx="1" />
        <circle cx="12" cy="6" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="12" cy="11" r="0.8" fill="currentColor" stroke="none" />
    </svg>
);
const AuditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h8M4 8h6M4 12h4" />
        <rect x="1" y="1" width="14" height="14" rx="2" />
    </svg>
);
const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6l4 4 4-4" />
    </svg>
);
const UploadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 11V1M4 4l4-3 4 3M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" />
    </svg>
);
const LogOutIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l3 3-3 3M13 8H6" />
    </svg>
);
const GearIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path d="M9.4 1.6l.3 1.3c.4.1.8.3 1.1.5l1.2-.6 1 .9-.6 1.2c.2.3.4.7.5 1.1l1.3.3v1.4l-1.3.3c-.1.4-.3.8-.5 1.1l.6 1.2-1 .9-1.2-.6c-.3.2-.7.4-1.1.5l-.3 1.3H8.3l-.3-1.3c-.4-.1-.8-.3-1.1-.5l-1.2.6-1-.9.6-1.2c-.2-.3-.4-.7-.5-1.1l-1.3-.3V7.3l1.3-.3c.1-.4.3-.8.5-1.1l-.6-1.2 1-.9 1.2.6c.3-.2.7-.4 1.1-.5l.3-1.3h1.4z" />
    </svg>
);
const BillingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="3" width="14" height="10" rx="2" /><path d="M1 7h14M4 10h2" />
    </svg>
);
const PlusIcon = ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 1v14M1 8h14" />
    </svg>
);
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const PackageIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1L2 4.5v7L8 15l6-3.5v-7L8 1z" /><path d="M2 4.5L8 8l6-3.5M8 8v7" /></svg>;
const PlayIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z" /></svg>;
const ExternalIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 3l-7 7M13 3v4M13 3H9" /></svg>;
const ArrowUpIcon = () => <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 14V2M3 7l5-5 5 5" /></svg>;
const ArrowDownIcon = () => <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v12m5-5l-5 5-5-5" /></svg>;
const WarningIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l7 12H1L8 2z" /><path d="M8 6v4m0 2h.01" /></svg>;
const TrashIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M4 4l1 10a1 1 0 001 1h4a1 1 0 001-1l1-10" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;

// ─── BADGE ─────────────────────────────────────────────────────────────────

const Badge: React.FC<{ variant: BadgeVariant; children: React.ReactNode; small?: boolean }> = ({
    variant, children, small
}) => {
    const styles: Record<BadgeVariant, React.CSSProperties> = {
        live: { background: "var(--green-soft)", color: "var(--green)", borderColor: "rgba(26,122,74,0.12)" },
        review: { background: "var(--blue-soft)", color: "var(--blue)", borderColor: "rgba(45,91,227,0.12)" },
        draft: { background: "var(--bg-inset)", color: "var(--ink-3)", borderColor: "var(--border)" },
        vr: { background: "var(--amber-soft)", color: "var(--amber)", borderColor: "rgba(180,83,9,0.12)" },
        warn: { background: "rgba(185,28,28,0.07)", color: "#B91C1C", borderColor: "rgba(185,28,28,0.12)" },
    };
    const dotColors: Record<BadgeVariant, string> = {
        live: "var(--green)", review: "var(--blue)", draft: "var(--ink-3)",
        vr: "var(--amber)", warn: "#B91C1C",
    };
    const animated = variant === "live" || variant === "vr";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: small ? "1px 6px" : "3px 8px",
            borderRadius: 20, fontFamily: "var(--mono)",
            fontSize: small ? 9 : 10, fontWeight: 500,
            letterSpacing: "0.02em", border: "1px solid transparent",
            ...styles[variant],
        }}>
            <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: dotColors[variant], flexShrink: 0,
                animation: animated ? "livepulse 2s infinite" : undefined,
            }} />
            {children}
        </span>
    );
};

// Progress removed (unused)

// ─── STAT CARD ─────────────────────────────────────────────────────────────

const StatCard: React.FC<{
    label: string; value: string | number;
    meta: string; deltaLabel: string;
    deltaType: "up" | "down" | "neutral";
    deltaIcon?: React.ReactNode;
    glowColor?: string;
}> = ({ label, value, meta, deltaLabel, deltaType, deltaIcon, glowColor }) => {
    const deltaStyle: React.CSSProperties =
        deltaType === "up"
            ? { background: "var(--green-soft)", color: "var(--green)" }
            : deltaType === "down"
                ? { background: "var(--amber-soft)", color: "var(--amber)" }
                : { background: "var(--blue-soft)", color: "var(--blue)" };

    return (
        <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: "18px 20px",
            boxShadow: "var(--shadow-sm)", cursor: "default",
            transition: "box-shadow 0.2s, transform 0.2s", position: "relative", overflow: "hidden",
        }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
            }}
        >
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
                {label}
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 38, lineHeight: 1, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                {value}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "var(--mono)", fontSize: 10, padding: "1px 5px", borderRadius: 4, ...deltaStyle }}>
                    {deltaIcon && <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{deltaIcon}</div>}
                    {deltaLabel}
                </span>
                {meta}
            </div>
            {glowColor && (
                <div style={{
                    position: "absolute", bottom: -20, right: -20,
                    width: 80, height: 80, borderRadius: "50%",
                    background: glowColor, opacity: 0.06, pointerEvents: "none",
                }} />
            )}
        </div>
    );
};

// ─── PANEL ─────────────────────────────────────────────────────────────────

const Panel: React.FC<{
    title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties;
}> = ({ title, right, children, style }) => (
    <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden", ...style,
    }}>
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
        }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{title}</div>
            {right}
        </div>
        {children}
    </div>
);

// ─── NAV LINK ──────────────────────────────────────────────────────────────

const NavLink: React.FC<{
    item: NavItem; active: boolean; onClick: () => void;
}> = ({ item, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            display: "flex", alignItems: "center", gap: 9, padding: "7px 8px",
            borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: active ? 500 : 400,
            color: active ? "var(--ink)" : "var(--ink-2)", cursor: "pointer",
            background: active ? "var(--bg-inset)" : "transparent",
            transition: "background 0.12s, color 0.12s",
        }}
        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; } }}
        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; } }}
    >
        <div style={{ width: 16, height: 16, opacity: active ? 1 : 0.5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.icon}
        </div>
        {item.label}
        {item.badge && (
            <span style={{
                marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10,
                padding: "1px 6px", borderRadius: 20, fontWeight: 500,
                ...(item.badgeVariant === "live"
                    ? { background: "var(--green-soft)", color: "var(--green)", border: "1px solid rgba(26,122,74,0.15)" }
                    : item.badgeVariant === "warn"
                        ? { background: "rgba(185,28,28,0.07)", color: "#B91C1C", border: "1px solid rgba(185,28,28,0.12)" }
                        : { background: "var(--bg-inset)", border: "1px solid var(--border-md)", color: "var(--ink-2)" })
            }}>
                {item.badge}
            </span>
        )}
    </div>
);

// ─── AVATAR ────────────────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string; gradient?: string; size?: number; style?: React.CSSProperties }> = ({
    initials, gradient, size = 26, style
}) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: gradient ?? "var(--bg-inset)", border: gradient ? "none" : "1px solid var(--border-md)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size > 30 ? 12 : 10, fontWeight: 600, color: gradient ? "white" : "var(--ink-3)",
        fontFamily: "var(--sans)", flexShrink: 0,
        ...style
    }}>
        {initials}
    </div>
);

const WorkspaceSwitcher: React.FC<{
    currentId: string; workspaces: Workspace[]; onChange: (id: string) => void;
}> = ({ currentId, workspaces, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const current = workspaces.find(w => w.id === currentId) || workspaces[0];

    return (
        <div style={{ position: "relative", margin: "12px 10px" }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "all 0.15s",
                    boxShadow: isOpen ? "var(--shadow-md)" : "none"
                }}
            >
                <div style={{
                    width: 24, height: 24, borderRadius: 5, background: "var(--bg-inset)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                    fontWeight: 600, color: "var(--ink-2)", border: "1px solid var(--border)"
                }}>
                    {current?.name?.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {current?.name}
                    </div>
                </div>
                <div style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }}>
                    <ChevronDown />
                </div>
            </div>

            {isOpen && (
                <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)", boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    zIndex: 1000, overflow: "hidden", animation: "fadeUp 0.15s ease"
                }}>
                    <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", background: "var(--bg-inset)" }}>
                        <div style={{ fontSize: 10, color: "var(--ink-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Switch Workspace
                        </div>
                    </div>
                    {workspaces.map(w => (
                        <div
                            key={w.id}
                            onClick={() => { onChange(w.id); setIsOpen(false); }}
                            style={{
                                padding: "10px 12px", cursor: "pointer", borderBottom: "1px solid var(--border-light)",
                                background: w.id === currentId ? "var(--bg-inset)" : "transparent",
                                transition: "background 0.1s"
                            }}
                            onMouseEnter={e => { if (w.id !== currentId) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)"; }}
                            onMouseLeave={e => { if (w.id !== currentId) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                        >
                            <div style={{ fontSize: 12, fontWeight: 500, color: w.id === currentId ? "var(--ink)" : "var(--ink-2)" }}>{w.name}</div>
                            {w.description && <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 2 }}>{w.description}</div>}
                        </div>
                    ))}
                    <div style={{ padding: "8px 12px", cursor: "pointer", background: "var(--bg)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
                        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-2)" }}>+ Create Workspace</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── PAGES ─────────────────────────────────────────────────────────────────

const OverviewPage: React.FC<{
    firstName: string;
    analytics?: WorkspaceUsage | null;
    activeSessions: VRSession[];
    projects: Project[];
    activities?: ActivityLog[];
    isLoading?: boolean;
}> = ({ firstName, analytics, activeSessions, projects, activities, isLoading }) => {
    const getActivityIcon = (type: number) => {
        switch (type) {
            case 3: return <PackageIcon />; // AssetUploaded
            case 5: return <VRIcon />; // SessionStarted
            case 7: return <ExternalIcon />; // ProjectShared
            default: return <ChartIcon />;
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
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Executive View — Feb 2026</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                    Good morning, <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>{firstName}.</em>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                <StatCard label="Active Projects" value={analytics?.totalProjectsCount || projects.length} deltaLabel={analytics?.totalProjectsDelta ? `+${analytics.totalProjectsDelta}` : "+0"} deltaIcon={<ArrowUpIcon />} deltaType="up" meta="this month" glowColor="var(--ink)" />
                <StatCard label="Monthly Revenue" value={analytics?.monthlyRevenue ? `€${(analytics.monthlyRevenue / 1000).toFixed(1)}k` : "€0.0k"} deltaLabel={analytics?.revenueDelta ? `+€${analytics.revenueDelta.toFixed(1)}k` : "+€0.0k"} deltaIcon={<ArrowUpIcon />} deltaType="up" meta="vs last month" glowColor="var(--green)" />
                <StatCard label="Pending Approvals" value={projects.filter(p => p.status === 'InReview').length} deltaLabel="Action needed" deltaIcon={<ArrowDownIcon />} deltaType="down" meta="from team" glowColor="var(--amber)" />
                <StatCard label="VR Sessions" value={analytics?.totalSessionsCount || (activeSessions ? activeSessions.length : 0)} deltaLabel={analytics?.totalSessionsDelta ? `+${analytics.totalSessionsDelta}` : "+0"} deltaIcon={<ArrowUpIcon />} deltaType="up" meta="total active" glowColor="var(--blue)" />
            </div>

            {/* Content grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
                {/* Projects table */}
                <Panel title="Active Projects" right={
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{projects.length} total</span>
                        <button style={{ padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 500, cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", color: "var(--ink)", fontFamily: "var(--sans)" }}>
                            View all →
                        </button>
                    </div>
                }>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Project", "Status", "Progress", "Team", ""].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", background: "var(--bg)", fontWeight: 400 }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [1, 2, 3].map(sk => (
                                    <tr key={sk} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div className="skeleton sk-title" style={{ width: "60%", height: 16, marginBottom: 4 }}></div>
                                            <div className="skeleton sk-line" style={{ width: "40%", height: 10 }}></div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div className="skeleton sk-btn" style={{ width: 60, height: 20 }}></div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle", minWidth: 120 }}>
                                            <div className="skeleton sk-line" style={{ width: "100%", height: 8 }}></div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div className="skeleton sk-av" style={{ width: 24, height: 24 }}></div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div style={{ display: "flex", gap: 4 }}>
                                                <div className="skeleton sk-btn" style={{ width: 26, height: 26 }}></div>
                                                <div className="skeleton sk-btn" style={{ width: 26, height: 26 }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : projects.slice(0, 5).map((row) => {
                                const { variant, label } = mapStatus(row.status);
                                return (
                                    <tr key={row.id} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    >
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{row.title}</div>
                                            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{row.clientName}</div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <Badge variant={variant} small>{label}</Badge>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle", minWidth: 120 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-2)" }}>{row.progress}%</span>
                                            </div>
                                            <div style={{ height: 3, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${row.progress}%`, background: "var(--ink)", borderRadius: 100 }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Avatar initials="SF" size={24} style={{ border: "1.5px solid var(--bg-card)" }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: "13px 18px", verticalAlign: "middle" }}>
                                            <div style={{ display: "flex", gap: 4 }}>
                                                <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", color: "var(--ink-2)", transition: "all 0.1s" }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; }}
                                                ><PlayIcon /></div>
                                                <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", color: "var(--ink-2)", transition: "all 0.1s" }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; }}
                                                ><ExternalIcon /></div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Panel>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Team status */}
                    <Panel title="Team Status" right={<Badge variant="live" small>{activeSessions?.length || 0} active in VR</Badge>}>
                        {activeSessions && activeSessions.length > 0 ? (
                            activeSessions.map(s => (
                                <div key={s.id} style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", cursor: "pointer" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <Avatar initials={(s.hostName || "U").substring(0, 2).toUpperCase()} gradient="linear-gradient(135deg,#2D5BE3,#7C3AED)" size={26} />
                                            <div>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{s.hostName}</div>
                                                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>VR Session Host</div>
                                            </div>
                                        </div>
                                        <Badge variant="live" small>Online</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)", fontSize: "11px" }}>No team members active in VR</div>
                        )}
                    </Panel>
                    {/* Recent Activity */}
                    <Panel title="Recent Activity">
                        {(!activities || activities.length === 0) ? (
                            <div style={{ padding: "24px", textAlign: "center", color: "var(--ink-3)", fontSize: "11px" }}>No recent activity</div>
                        ) : (
                            activities.slice(0, 5).map((a, i, arr) => (
                                <div key={a.id} style={{ padding: "12px 18px", display: "flex", gap: 10, borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
                                    <div style={{ width: 22, height: 22, borderRadius: "4px", background: "var(--bg-inset)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px" }}>
                                        {getActivityIcon(a.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.3 }}>{a.message}</div>
                                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 2 }}>{new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {a.userName}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Panel>

                    {/* Billing alert - Placeholder for now, can be hidden if no invoice */}
                    <div style={{
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius)", padding: "14px 18px", boxShadow: "var(--shadow-sm)",
                        opacity: 0.6
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <div style={{ color: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center" }}><WarningIcon /></div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>No invoices due</span>
                        </div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-4)", marginBottom: 12 }}>All payments are up to date.</div>
                    </div>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <Panel title="Activity" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>Last 24h</span>}>
                    {[
                        { icon: <CheckIcon />, msg: "New approval on Skyline Tower", time: "2h ago" },
                        { icon: <PackageIcon />, msg: "Architect uploaded v4.2 model", time: "4h ago" },
                    ].map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 18px", borderBottom: i < 1 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
                            <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", background: "var(--bg-inset)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--ink-2)" }}>{a.icon}</div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.4 }}>{a.msg}</div>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 3 }}>{a.time}</div>
                            </div>
                        </div>
                    ))}
                </Panel>
            </div>
        </div>
    );
};

// ─── TEAM PAGE ─────────────────────────────────────────────────────────────

const TeamPage: React.FC = () => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Owner · People</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Team</div>
            </div>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--ink)", color: "var(--bg)", border: "none", fontFamily: "var(--sans)" }}>
                <PlusIcon /> Invite member
            </button>
        </div>
        <Panel title="Members" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>4 / 10 seats</span>}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {["Member", "Role", "Projects", "Workload", "Status", ""].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", background: "var(--bg)", fontWeight: 400 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                        { initials: "AC", name: "Alex Carter", email: "alex@arcstudio.com", gradient: "linear-gradient(135deg,#2D5BE3,#7C3AED)", role: "Owner", projects: 8, workload: 95, workloadColor: "#B91C1C", status: "live" as BadgeVariant, statusLabel: "Online" },
                        { initials: "SF", name: "Sarah Finn", email: "sarah@arcstudio.com", gradient: "linear-gradient(135deg,#B45309,#E07000)", role: "Architect", projects: 3, workload: 80, workloadColor: "var(--amber)", status: "live" as BadgeVariant, statusLabel: "Online" },
                        { initials: "TC", name: "Tom Chen", email: "tom@arcstudio.com", gradient: "linear-gradient(135deg,#1A7A4A,#059669)", role: "Visualiser", projects: 2, workload: 55, workloadColor: "var(--blue)", status: "vr" as BadgeVariant, statusLabel: "In VR" },
                        { initials: "JM", name: "Julia May", email: "julia@arcstudio.com", gradient: undefined, role: "Architect", projects: 1, workload: 30, workloadColor: "var(--green)", status: "draft" as BadgeVariant, statusLabel: "Offline" },
                    ].map(m => (
                        <tr key={m.name} style={{ borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.1s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <td style={{ padding: "13px 18px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                    <Avatar initials={m.initials} gradient={m.gradient} size={30} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: m.gradient ? "var(--ink)" : "var(--ink-2)" }}>{m.name}</div>
                                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{m.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: "13px 18px" }}>
                                <span style={{
                                    fontFamily: "var(--mono)", fontSize: 10, padding: "2px 7px", borderRadius: 20,
                                    background: m.role === "Owner" ? "rgba(109,40,217,0.08)" : "var(--blue-soft)",
                                    color: m.role === "Owner" ? "#6D28D9" : "var(--blue)",
                                    border: `1px solid ${m.role === "Owner" ? "rgba(109,40,217,0.15)" : "rgba(45,91,227,0.15)"}`,
                                }}>{m.role}</span>
                            </td>
                            <td style={{ padding: "13px 18px", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-2)" }}>{m.projects}</td>
                            <td style={{ padding: "13px 18px" }}>
                                <div style={{ height: 3, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden", width: 80 }}>
                                    <div style={{ height: "100%", width: `${m.workload}%`, background: m.workloadColor, borderRadius: 100, transition: "width 0.6s ease" }} />
                                </div>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", marginTop: 3 }}>{m.workload}%</div>
                            </td>
                            <td style={{ padding: "13px 18px" }}><Badge variant={m.status} small>{m.statusLabel}</Badge></td>
                            <td style={{ padding: "13px 18px" }}>
                                {m.role !== "Owner" && (
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", color: "var(--ink-2)", transition: "all 0.1s" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; }}
                                        ><EditIcon /></div>
                                        <div style={{ width: 26, height: 26, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", border: "1px solid var(--border-md)", background: "var(--bg-card)", color: "var(--ink-2)", transition: "all 0.1s" }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink)"; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLDivElement).style.color = "var(--ink-2)"; }}
                                        ><TrashIcon /></div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Panel>
    </div>
);

// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────

const AnalyticsPage: React.FC<{ projects: Project[] }> = ({ projects }) => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Owner · Analytics</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Workspace Analytics — {projects.length} Projects</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total VR Sessions" value="142" deltaLabel="↑ +34" deltaType="up" meta="this month" glowColor="var(--blue)" />
            <StatCard label="Avg Session Length" value="41m" deltaLabel="↑ +6m" deltaType="up" meta="vs last month" glowColor="var(--ink)" />
            <StatCard label="Approval Rate" value="84%" deltaLabel="↑ +4%" deltaType="up" meta="first-time" glowColor="var(--green)" />
            <StatCard label="Avg Revisions" value="2.3" deltaLabel="↓ improving" deltaType="neutral" meta="per item" glowColor="var(--amber)" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel title="Sessions / Week" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>last 8 weeks</span>}>
                <div style={{ padding: "20px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                        {[4, 6, 3, 8, 5, 9, 7, 11].map((v, i) => (
                            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                <div style={{ width: "100%", background: i === 7 ? "var(--ink)" : "var(--bg-inset)", borderRadius: "3px 3px 0 0", height: `${(v / 11) * 100}%`, transition: "all 0.2s", cursor: "pointer", border: "1px solid var(--border)" }}
                                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "var(--ink-2)"}
                                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = i === 7 ? "var(--ink)" : "var(--bg-inset)"}
                                />
                                <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-4)", whiteSpace: "nowrap" }}>
                                    {["Jan 6", "Jan 13", "Jan 20", "Jan 27", "Feb 3", "Feb 10", "Feb 17", "Feb 24"][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Panel>
            <Panel title="Projects by Activity" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>VR sessions</span>}>
                <div style={{ padding: "14px 18px" }}>
                    {[
                        { name: "Skyline Duplex", sessions: 12, pct: 100 },
                        { name: "Skyline Tower 14B", sessions: 9, pct: 75 },
                        { name: "Riverside Villa", sessions: 5, pct: 42 },
                        { name: "Soho Office", sessions: 2, pct: 17 },
                    ].map(p => (
                        <div key={p.name} style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontSize: 12, color: "var(--ink)" }}>{p.name}</span>
                                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)" }}>{p.sessions} sessions</span>
                            </div>
                            <div style={{ height: 4, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${p.pct}%`, background: "var(--ink)", borderRadius: 100, transition: "width 0.6s ease" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>
        </div>
    </div>
);

// ─── AUDIT PAGE ────────────────────────────────────────────────────────────

const AuditPage: React.FC = () => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Owner · Admin</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Audit Log</div>
        </div>
        <Panel title="Security & Access Events" right={<span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>last 30 days</span>}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        {["Event", "User", "IP Address", "Project", "Date"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", background: "var(--bg)", fontWeight: 400 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[
                        { event: "Login", user: "Alex Carter", ip: "88.234.71.12", project: "—", date: "Feb 24 · 09:14" },
                        { event: "File uploaded", user: "Sarah Finn", ip: "195.21.4.88", project: "Skyline Tower", date: "Feb 24 · 09:31" },
                        { event: "Approval sent", user: "Alex Carter", ip: "88.234.71.12", project: "Skyline Tower", date: "Feb 22 · 16:40" },
                        { event: "Client login", user: "Martin Koch", ip: "85.97.200.44", project: "Skyline Tower", date: "Feb 22 · 14:05" },
                        { event: "Session started", user: "Alex Carter", ip: "88.234.71.12", project: "Skyline Tower", date: "Feb 19 · 14:02" },
                        { event: "Member invited", user: "Alex Carter", ip: "88.234.71.12", project: "—", date: "Feb 18 · 11:22" },
                        { event: "Role changed", user: "Alex Carter", ip: "88.234.71.12", project: "—", date: "Feb 15 · 15:07" },
                        { event: "Invoice paid", user: "Alex Carter", ip: "88.234.71.12", project: "—", date: "Jan 27 · 09:00" },
                    ].map((row, i, arr) => (
                        <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s", cursor: "pointer" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            <td style={{ padding: "11px 18px", fontWeight: 500, fontSize: 12, color: "var(--ink)" }}>{row.event}</td>
                            <td style={{ padding: "11px 18px", fontSize: 12, color: "var(--ink-2)" }}>{row.user}</td>
                            <td style={{ padding: "11px 18px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{row.ip}</td>
                            <td style={{ padding: "11px 18px", fontSize: 12, color: "var(--ink-2)" }}>{row.project}</td>
                            <td style={{ padding: "11px 18px", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)" }}>{row.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Panel>
    </div>
);

// ─── PLACEHOLDER PAGE ──────────────────────────────────────────────────────

const PlaceholderPage: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
    <div style={{ padding: 28 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Owner</div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 24 }}>{title}</div>
        <div style={{ background: "var(--bg-card)", border: "1.5px dashed var(--border-dk)", borderRadius: "var(--radius)", padding: 48, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink-3)", marginBottom: 8 }}>{sub}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-4)" }}>Content loads here</div>
        </div>
    </div>
);

// ─── SIDEBAR ───────────────────────────────────────────────────────────────

const OWNER_NAV: { section: string; items: NavItem[] }[] = [
    {
        section: "Workspace",
        items: [
            { id: "overview", label: "Overview", icon: <GridIcon /> },
            { id: "projects", label: "Projects", badge: "8", icon: <ListIcon /> },
            { id: "sessions", label: "VR Sessions", badge: "3 live", badgeVariant: "live", icon: <VRIcon /> },
            { id: "models", label: "3D Models", icon: <ModelIcon /> },
        ],
    },
    {
        section: "People",
        items: [
            { id: "portal", label: "Client Portal", icon: <UserCheckIcon /> },
            { id: "team", label: "Team", badge: "4", icon: <TeamIcon /> },
        ],
    },
    {
        section: "Admin",
        items: [
            { id: "analytics", label: "Analytics", icon: <ChartIcon /> },
            { id: "storage", label: "Storage", icon: <StorageIcon /> },
            { id: "audit", label: "Audit Log", icon: <AuditIcon /> },
        ],
    },
];

// ─── OWNER DASHBOARD ───────────────────────────────────────────────────────

export default function OwnerDashboard({ firstName, activeTab, analytics, activeSessions = [], projects = [], activities = [], isLoading, workspaces, currentWorkspaceId, onWorkspaceChange }: OwnerDashboardProps) {
    const [page, setPage] = useState<Page>(activeTab || "overview");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (activeTab) setPage(activeTab);
    }, [activeTab]);

    const renderPage = () => {
        const p = page as string;
        switch (page) {
            case "overview": return <OverviewPage firstName={firstName} analytics={analytics} activeSessions={activeSessions || []} projects={projects || []} activities={activities} isLoading={isLoading} />;
            case "team": return <TeamPage />;
            case "analytics": return <AnalyticsPage projects={projects || []} />;
            case "audit": return <AuditPage />;
            case "settings": return <SettingsPage />;
            case "notifications": return <NotificationsPage />;
            default: return <PlaceholderPage title={p.charAt(0).toUpperCase() + p.slice(1)} sub="Coming soon" />;
        }
    };

    const displayPageName = page as string;

    return (
        <div style={{ display: "flex", fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--ink)", height: "100vh", position: "relative", overflow: "hidden" }}>
            <aside style={{
                width: 240, minHeight: "100vh", background: "var(--bg-card)",
                borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
                flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto",
            }}>
                {/* Logo */}
                <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: "var(--ink)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bg)">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>VR Architecture</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 2 }}>v2.4.1 — Owner</div>
                    </div>
                </div>

                <WorkspaceSwitcher currentId={currentWorkspaceId} workspaces={workspaces} onChange={onWorkspaceChange} />

                {/* Nav */}
                <div style={{ flex: 1 }}>
                    {OWNER_NAV.map((section, si) => (
                        <div key={section.section}>
                            {si > 0 && <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />}
                            <div style={{ padding: "16px 10px 8px" }}>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>
                                    {section.section}
                                </div>
                                {section.items.map(item => (
                                    <NavLink key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User */}
                <div style={{ marginTop: "auto", padding: "12px 10px", borderTop: "1px solid var(--border)", position: "relative" }}>
                    {showUserMenu && (
                        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 10, right: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", padding: 4, zIndex: 1000, animation: "fadeUp 0.15s ease" }}>
                            {[
                                {
                                    label: "Studio Settings",
                                    icon: <GearIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        navigate("/settings");
                                        setShowUserMenu(false);
                                    }
                                },
                                { label: "Billing & Plans", icon: <BillingIcon />, action: () => alert("Billing") },
                                {
                                    label: "Team Access",
                                    icon: <TeamIcon />,
                                    action: (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setPage("team");
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
                        <Avatar initials="AC" gradient="linear-gradient(135deg,#2D5BE3,#7C3AED)" size={26} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>Alex Carter</div>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>Owner</div>
                        </div>
                        <div style={{ transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown /></div>
                    </div>
                </div>
            </aside>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
                {/* Topbar */}
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
                            <UploadIcon /> Import GLB
                        </button>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--ink)", color: "var(--bg)", border: "none", fontFamily: "var(--sans)" }}>
                            <PlusIcon /> New Project
                        </button>
                    </div>
                </header>
                <main style={{ flex: 1, overflowY: "auto" }}>
                    {renderPage()}
                </main>
            </div>
            <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>
    );
}
