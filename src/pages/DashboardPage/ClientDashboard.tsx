import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Project } from "@/types/project.types";
import type { VRSession } from "@/types/session.types";
import { NotificationDrawer, BellIcon } from "@/components/dashboard/NotificationDrawer";
import { SettingsPage, NotificationsPage } from "@/pages";

// ─── TYPES ─────────────────────────────────────────────────────────────────

type Page = "overview" | "designs" | "approvals" | "sessions" | "files" | "timeline" | "comments" | "settings" | "notifications";
type BadgeVariant = "live" | "review" | "draft" | "vr" | "warn";

interface ClientDashboardProps {
    firstName: string;
    activeTab?: Page;
    projects?: Project[];
    sessions?: VRSession[];
}

// ─── ICONS ─────────────────────────────────────────────────────────────────

const GridIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>;
const ImageIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="12" rx="2" /><circle cx="5" cy="5" r="1.5" /><path d="M2 11l3-3 2 2 4-4 3 3" /></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const VRIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="8" rx="2" /><circle cx="5.5" cy="9" r="1.5" /><circle cx="10.5" cy="9" r="1.5" /><path d="M7 9h2" /></svg>;
const FileIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 1h7l3 3v11H3V1z" /><path d="M10 1v3h3" /></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4h4" /></svg>;
const ChatIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H3a1 1 0 00-1 1v8h4l3 2v-2h3a1 1 0 001-1V3a1 1 0 00-1-1z" /></svg>;
const BuildingIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 1h12v14H2zM5 4h2M5 7h2M5 10h2M9 4h2M9 7h2M9 10h2" /></svg>;
const ChevronDown = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4" /></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" /></svg>;
const GearIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5" /><path d="M8 2v1m0 10v1m6-7h-1M3 8H2m10.2-4.2l-.7.7M4.5 11.5l-.7.7m0-8l.7.7m7.1 7.1l.7.7" /></svg>;
const LogOutIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l3 3-3 3M13 8H6" /></svg>;
// ─── COMPONENTS ────────────────────────────────────────────────────────────

const Badge: React.FC<{ variant: BadgeVariant; children: React.ReactNode; small?: boolean }> = ({ variant, children, small }) => {
    const styles: Record<BadgeVariant, React.CSSProperties> = {
        live: { background: "var(--green-soft)", color: "var(--green)", borderColor: "rgba(26,122,74,0.12)" },
        review: { background: "var(--blue-soft)", color: "var(--blue)", borderColor: "rgba(45,91,227,0.12)" },
        draft: { background: "var(--bg-inset)", color: "var(--ink-3)", borderColor: "var(--border)" },
        vr: { background: "var(--amber-soft)", color: "var(--amber)", borderColor: "rgba(180,83,9,0.12)" },
        warn: { background: "rgba(185,28,28,0.07)", color: "#B91C1C", borderColor: "rgba(185,28,28,0.12)" },
    };
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: small ? "1px 6px" : "3px 8px", borderRadius: 20, fontFamily: "var(--mono)", fontSize: small ? 9 : 10, fontWeight: 500, letterSpacing: "0.02em", border: "1px solid", ...styles[variant] }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: styles[variant].color, flexShrink: 0 }} />
            {children}
        </span>
    );
};

const Avatar: React.FC<{ initials: string; gradient?: string; size?: number }> = ({ initials, gradient, size = 26 }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: gradient ?? "var(--bg-inset)", border: gradient ? "none" : "1px solid var(--border-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size > 30 ? 12 : 10, fontWeight: 600, color: gradient ? "white" : "var(--ink-3)", fontFamily: "var(--sans)", flexShrink: 0 }}>
        {initials}
    </div>
);

const NavLink: React.FC<{ item: any; active: boolean; onClick: () => void }> = ({ item, active, onClick }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: active ? 500 : 400, color: active ? "var(--ink)" : "var(--ink-2)", cursor: "pointer", background: active ? "var(--bg-inset)" : "transparent", transition: "all 0.12s" }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
        <div style={{ width: 14, height: 14, opacity: active ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
        {item.label}
        {item.badge && <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 9, padding: "1px 5px", borderRadius: 4, background: "var(--bg-card)", border: "1px solid var(--border-md)", color: "var(--ink-3)" }}>{item.badge}</span>}
    </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode; right?: React.ReactNode }> = ({ title, children, right }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{title}</div>
            {right}
        </div>
        <div>{children}</div>
    </div>
);

// ─── PAGES ─────────────────────────────────────────────────────────────────

const OverviewPage: React.FC<{ firstName: string; projects: Project[]; sessions: VRSession[] }> = ({ firstName, projects, sessions }) => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Client Portal — Feb 2026</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Good morning, <em style={{ fontStyle: "italic", color: "var(--ink-2)" }}>{firstName}.</em></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Panel title="Recent Updates" right={<Badge variant="live" small>{projects.length > 0 ? "Live" : "No updates"}</Badge>}>
                    {projects.slice(0, 3).map((item, i, arr) => (
                        <div key={item.id} style={{ padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "var(--radius-sm)", background: "var(--bg-inset)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--ink-3)" }}>
                                {item.status === 'Approved' ? <CheckIcon /> : <BuildingIcon />}
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{item.title}</div>
                                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Status: {item.status}</div>
                                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-4)", marginTop: 4 }}>Progress: {item.progress}%</div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)", fontSize: 13 }}>No projects found in this workspace.</div>}
                    {sessions.length > 0 && <div style={{ padding: "10px 18px", background: "var(--bg-inset)", fontSize: 11, color: "var(--blue)" }}>{sessions.length} active sessions available.</div>}
                </Panel>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "var(--ink)", borderRadius: "var(--radius)", padding: "20px", color: "white", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "var(--blue)", opacity: 0.2 }} />
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>Next session</div>
                    <div style={{ fontSize: 18, fontFamily: "var(--serif)", marginBottom: 4 }}>Project Walkthrough</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>Today at 14:00 (In 4 hours)</div>
                    <button style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-sm)", background: "var(--blue)", color: "white", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Join VR Link</button>
                </div>
            </div>
        </div>
    </div>
);

const DesignsPage: React.FC<{ projects: Project[] }> = ({ projects }) => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Portfolio</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Designs & Models</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {projects.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", border: "1px dashed var(--border-md)", borderRadius: "var(--radius)", background: "var(--bg-card)", color: "var(--ink-4)" }}>
                    <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><BuildingIcon /></div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No designs available</div>
                    <div style={{ fontSize: 12 }}>Assigned project models will appear here.</div>
                </div>
            ) : (
                projects.map((item: Project) => (
                    <div key={item.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", cursor: "pointer" }}>
                        <div style={{ height: 160, background: "var(--bg-inset)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ color: "var(--ink-4)" }}><BuildingIcon /></div>
                        </div>
                        <div style={{ padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{item.title}</div>
                                <Badge variant="review" small>{item.status}</Badge>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

const ApprovalsPage: React.FC = () => (
    <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Workflow</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>Approvals Needed</div>
        </div>
        <Panel title="Pending Approval">
            <div style={{ padding: "40px", textAlign: "center", color: "var(--ink-4)" }}>
                <div style={{ width: 32, height: 32, background: "var(--bg-inset)", border: "1px solid var(--border-md)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--ink-3)" }}><CheckIcon /></div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>No pending approvals</div>
                <div style={{ fontSize: 12 }}>Items awaiting your feedback will appear here.</div>
            </div>
        </Panel>
    </div>
);

const FilesPage: React.FC = () => <div style={{ padding: 28 }}>Files Content</div>;
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => <div style={{ padding: 28 }}>{title} Coming Soon</div>;

// ─── SIDEBAR ───────────────────────────────────────────────────────────────

const CLIENT_NAV = [
    {
        section: "Project",
        items: [
            { id: "overview", label: "Overview", icon: <GridIcon /> },
            { id: "designs", label: "Designs & Models", icon: <ImageIcon />, badge: "4" },
            { id: "approvals", label: "Approvals", icon: <CheckIcon />, badge: "2" },
        ],
    },
    {
        section: "Collaboration",
        items: [
            { id: "sessions", label: "VR Sessions", icon: <VRIcon /> },
            { id: "files", label: "Documents", icon: <FileIcon /> },
            { id: "timeline", label: "Timeline", icon: <ClockIcon /> },
            { id: "comments", label: "Comments", icon: <ChatIcon /> },
        ],
    },
];

const ClientSidebar: React.FC<{ active: Page; onNav: (p: Page) => void; projects: Project[]; firstName: string }> = ({ active, onNav, projects, firstName }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <aside style={{ width: 240, minHeight: "100vh", background: "var(--bg-card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
            <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, background: "var(--ink)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bg)"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", lineHeight: 1 }}>VR Architecture</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)", letterSpacing: "0.04em", marginTop: 2 }}>v2.4.1 — Client</div>
                </div>
            </div>

            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg,rgba(45,91,227,0.03),transparent)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Current project</div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                    <div style={{ width: 14, height: 14, color: "var(--ink-2)" }}><BuildingIcon /></div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{projects[0]?.title || "No active project"}</span>
                </div>
                <div style={{ height: 3, background: "var(--bg-inset)", borderRadius: 100, overflow: "hidden", marginBottom: 3 }}>
                    <div style={{ height: "100%", width: projects[0] ? `${projects[0].progress}%` : "0%", background: "var(--blue)", borderRadius: 100 }} />
                </div>
            </div>

            <div style={{ flex: 1 }}>
                {CLIENT_NAV.map((section, si) => (
                    <div key={section.section}>
                        {si > 0 && <div style={{ height: 1, background: "var(--border)", margin: "8px 10px" }} />}
                        <div style={{ padding: "12px 10px 6px" }}>
                            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 8px", marginBottom: 4 }}>{section.section}</div>
                            {section.items.map(item => (
                                <NavLink key={item.id} item={item} active={active === item.id} onClick={() => onNav(item.id as Page)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)", position: "relative" }}>
                {showUserMenu && (
                    <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 10, right: 10, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", padding: 4, zIndex: 1000 }}>
                        {[
                            {
                                label: "My Account",
                                icon: <UserIcon />,
                                action: (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    navigate("/settings");
                                    setShowUserMenu(false);
                                }
                            },
                            {
                                label: "Project Settings",
                                icon: <GearIcon />,
                                action: (e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    navigate("/settings");
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
                    <Avatar initials={firstName.charAt(0)} gradient="linear-gradient(135deg,#1A7A4A,#059669)" size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{firstName}</div>
                        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>Client</div>
                    </div>
                    <div style={{ transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown /></div>
                </div>
            </div>
        </aside>
    );
};

// ─── CLIENT DASHBOARD ──────────────────────────────────────────────────────

interface ClientDashboardProps {
    firstName: string;
    activeTab?: Page;
    projects?: Project[];
    sessions?: VRSession[];
}

export default function ClientDashboard({ firstName, activeTab, projects = [], sessions = [] }: ClientDashboardProps) {
    const [page, setPage] = useState<Page>(activeTab || "overview");
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    useEffect(() => {
        if (activeTab) setPage(activeTab);
    }, [activeTab]);

    const renderPage = () => {
        const p = page as string;
        switch (page) {
            case "overview": return <OverviewPage firstName={firstName} projects={projects} sessions={sessions} />;
            case "designs": return <DesignsPage projects={projects} />;
            case "approvals": return <ApprovalsPage />;
            case "sessions": return <PlaceholderPage title="VR Sessions" />;
            case "files": return <FilesPage />;
            case "timeline": return <PlaceholderPage title="Timeline" />;
            case "comments": return <PlaceholderPage title="Comments" />;
            case "settings": return <SettingsPage />;
            case "notifications": return <NotificationsPage />;
            default: return <PlaceholderPage title={p.charAt(0).toUpperCase() + p.slice(1)} />;
        }
    };

    const displayPageName = page as string;

    return (
        <div style={{ display: "flex", fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--ink)", height: "100vh", position: "relative", overflow: "hidden" }}>
            <ClientSidebar active={page} onNav={setPage} projects={projects} firstName={firstName} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
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
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--bg-card)", color: "var(--ink)", border: "1px solid var(--border-md)", fontFamily: "var(--sans)" }}>Contact architect</button>
                        <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: "var(--ink)", color: "var(--bg)", border: "none", fontFamily: "var(--sans)" }}><VRIcon /> Join session</button>
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
