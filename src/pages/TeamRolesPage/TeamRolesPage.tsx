import { useState } from 'react';

type TabId = 'members' | 'pending' | 'roles' | 'activity';

const members = [
    { initials: 'AC', name: 'Alex Carter', email: 'alex@studioarc.com', role: 'owner', projects: 8, joined: 'Jan 2025', gradient: 'linear-gradient(135deg,#2D5BE3,#7C3AED)', status: '#1A7A4A', isYou: true },
    { initials: 'MR', name: 'Michael Reed', email: 'michael@studioarc.com', role: 'admin', projects: 6, joined: 'Jan 2025', gradient: 'linear-gradient(135deg,#7C3AED,#EC4899)', status: '#1A7A4A', isYou: false },
    { initials: 'SF', name: 'Sarah Finn', email: 'sarah@studioarc.com', role: 'architect', projects: 4, joined: 'Mar 2025', gradient: 'linear-gradient(135deg,#2D5BE3,#0891B2)', status: '#1A7A4A', isYou: false },
    { initials: 'EK', name: 'Eliza Key', email: 'eliza@studioarc.com', role: 'designer', projects: 3, joined: 'May 2025', gradient: 'linear-gradient(135deg,#B45309,#D97706)', status: '#F59E0B', isYou: false },
    { initials: 'RY', name: 'Ryan Young', email: 'ryan@clientco.com', role: 'client', projects: 1, joined: 'Nov 2025', gradient: '', status: 'var(--ink-4)', isYou: false },
];

const pendingInvites = [
    { email: 'kevin@partnerarch.com', role: 'Architect', invitedBy: 'Alex Carter', when: '3 days ago' },
    { email: 'laura@designstudio.io', role: 'Designer', invitedBy: 'Michael Reed', when: '1 week ago' },
];

const permissions = [
    { name: 'Create projects', desc: 'Start a new project', owner: 'yes', admin: 'yes', architect: 'yes', designer: 'no', client: 'no', viewer: 'no' },
    { name: 'Upload 3D models', desc: 'GLB / GLTF / OBJ', owner: 'yes', admin: 'yes', architect: 'yes', designer: 'yes', client: 'no', viewer: 'no' },
    { name: 'Launch VR session', desc: 'Start or join sessions', owner: 'yes', admin: 'yes', architect: 'yes', designer: 'partial', client: 'partial', viewer: 'no' },
    { name: 'Leave annotations', desc: 'Notes & revision pins', owner: 'yes', admin: 'yes', architect: 'yes', designer: 'yes', client: 'yes', viewer: 'no' },
    { name: 'Approve project', desc: 'Digital sign-off', owner: 'yes', admin: 'partial', architect: 'no', designer: 'no', client: 'yes', viewer: 'no' },
    { name: 'Manage team', desc: 'Invite & remove members', owner: 'yes', admin: 'yes', architect: 'no', designer: 'no', client: 'no', viewer: 'no' },
    { name: 'View analytics', desc: 'Session & heatmap data', owner: 'yes', admin: 'yes', architect: 'yes', designer: 'partial', client: 'no', viewer: 'no' },
    { name: 'Billing & subscription', desc: 'Plans & invoices', owner: 'yes', admin: 'no', architect: 'no', designer: 'no', client: 'no', viewer: 'no' },
];

const activityLog = [
    { icon: '✉', msg: '<strong>Alex Carter</strong> invited <strong>kevin@partnerarch.com</strong> as Architect', time: 'Today, 10:42' },
    { icon: '⟳', msg: "<strong>Alex Carter</strong> changed <strong>Eliza Key</strong>'s role from Viewer to Designer", time: 'Yesterday, 14:20' },
    { icon: '✉', msg: '<strong>Michael Reed</strong> invited <strong>laura@designstudio.io</strong> as Designer', time: 'Feb 12, 09:15' },
    { icon: '✓', msg: '<strong>Ryan Young</strong> accepted invite and joined as Client', time: 'Nov 28, 11:03' },
    { icon: '✕', msg: '<strong>Alex Carter</strong> removed <strong>tom@oldteam.com</strong> from workspace', time: 'Nov 20, 16:55' },
    { icon: '⟳', msg: '<strong>Alex Carter</strong> promoted <strong>Michael Reed</strong> to Admin', time: 'Jan 15, 2025' },
];

const roleClassMap: Record<string, string> = {
    owner: 'role-owner',
    admin: 'role-admin',
    architect: 'role-arch',
    designer: 'role-design',
    client: 'role-client',
    viewer: 'role-viewer',
};

const roleLabelMap: Record<string, string> = {
    owner: 'Owner',
    admin: 'Admin',
    architect: 'Architect',
    designer: 'Designer',
    client: 'Client',
    viewer: 'Viewer',
};

const roleIcons: Record<string, React.ReactNode> = {
    owner: <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" /></svg>,
    admin: <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2" /></svg>,
    architect: <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1L2 7l6 6 6-6-6-6z" /></svg>,
    designer: <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 14l3-3 8-8-3-3-8 8-3 3z" /></svg>,
    client: <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="3" /><path d="M1 14c0-3 2-5 5-5M10 9l2 2 3-3" /></svg>,
    viewer: <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 5v6M5 8h6" /></svg>,
};

function PermCell({ value }: { value: string }) {
    if (value === 'yes') return <span className="perm-yes">✓</span>;
    if (value === 'no') return <span className="perm-no">✕</span>;
    return <div className="perm-partial" title="Partial access" />;
}

export default function TeamRolesPage() {
    const [activeTab, setActiveTab] = useState<TabId>('members');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMemberName, setModalMemberName] = useState('');
    const [selectedModalRole, setSelectedModalRole] = useState('admin');
    const [selectedInviteRole, setSelectedInviteRole] = useState('designer');

    const openRoleModal = (name: string) => {
        setModalMemberName(name);
        setModalOpen(true);
    };

    const modalRoles = [
        { id: 'admin', label: 'Admin', desc: 'Full access except billing. Can manage team.' },
        { id: 'architect', label: 'Architect', desc: 'Projects, models, VR sessions, analytics.' },
        { id: 'designer', label: 'Designer', desc: 'Upload models, join VR, leave annotations.' },
        { id: 'viewer', label: 'Viewer', desc: 'Read-only access. Cannot join VR sessions.' },
    ];

    const inviteRoles = [
        { id: 'architect', label: 'Architect', desc: 'Full project access' },
        { id: 'designer', label: 'Designer', desc: 'Models + VR' },
        { id: 'client', label: 'Client', desc: 'Review + approve' },
        { id: 'viewer', label: 'Viewer', desc: 'View only' },
    ];

    return (
        <>
            <div className="page">
                {/* PAGE HEADER */}
                <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <div className="page-eyebrow">Workspace — Studio Arc</div>
                        <div className="page-title">Team <em>&amp; Roles</em></div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>5 of 7 seats used</span>
                        <div style={{ width: 80, height: 4, background: 'var(--bg-inset)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{ width: '72%', height: '100%', background: 'var(--ink)', borderRadius: 100 }} />
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="tabs">
                    {([
                        { id: 'members' as TabId, label: 'Members', count: '5' },
                        { id: 'pending' as TabId, label: 'Pending invites', count: '2' },
                        { id: 'roles' as TabId, label: 'Role permissions', count: undefined },
                        { id: 'activity' as TabId, label: 'Activity log', count: undefined },
                    ]).map((t) => (
                        <button
                            key={t.id}
                            className={`tab ${activeTab === t.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.label}
                            {t.count && <span className="tab-count">{t.count}</span>}
                        </button>
                    ))}
                </div>

                {/* CONTENT GRID */}
                <div className="content-grid">
                    {/* LEFT PANEL */}
                    <div>
                        {/* MEMBERS TAB */}
                        {activeTab === 'members' && (
                            <div className="panel">
                                <div className="table-head">
                                    <div className="th" style={{ flex: 1 }}>Member</div>
                                    <div className="th" style={{ width: 130 }}>Role</div>
                                    <div className="th" style={{ width: 80, textAlign: 'center' }}>Projects</div>
                                    <div className="th" style={{ width: 90, textAlign: 'right' }}>Joined</div>
                                </div>
                                {members.map((m) => (
                                    <div className="member-row" key={m.initials}>
                                        <div
                                            className="m-avatar"
                                            style={m.gradient
                                                ? { background: m.gradient }
                                                : { background: 'var(--bg-inset)', border: '1px solid var(--border-md)', color: 'var(--ink-3)' }}
                                        >
                                            {m.initials}
                                            <div className="m-status-dot" style={{ background: m.status }} />
                                        </div>
                                        <div className="m-info">
                                            <div className="m-name">
                                                {m.name}
                                                {m.isYou && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', marginLeft: 6 }}>you</span>}
                                            </div>
                                            <div className="m-email">{m.email}</div>
                                        </div>
                                        <div className="m-role-wrap">
                                            <div
                                                className={`role-badge ${roleClassMap[m.role]}`}
                                                onClick={m.role !== 'owner' ? () => openRoleModal(m.name) : undefined}
                                            >
                                                {roleIcons[m.role]}
                                                {roleLabelMap[m.role]}
                                                {m.role !== 'owner' && (
                                                    <svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}><path d="M4 6l4 4 4-4" /></svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="m-projects">{m.projects} project{m.projects !== 1 ? 's' : ''}</div>
                                        <div className="m-joined">{m.joined}</div>
                                        <div className="member-actions">
                                            {m.role === 'owner' ? (
                                                <div className="m-action-btn" title="View profile">↗</div>
                                            ) : (
                                                <>
                                                    <div className="m-action-btn" title="Edit role" onClick={() => openRoleModal(m.name)}>✎</div>
                                                    <div className="m-action-btn danger" title="Remove">✕</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PENDING TAB */}
                        {activeTab === 'pending' && (
                            <div className="panel">
                                <div className="panel-top">
                                    <div className="panel-title">Pending Invites</div>
                                    <button className="btn btn-ghost" style={{ fontSize: 11 }}>Resend all</button>
                                </div>
                                {pendingInvites.map((inv) => (
                                    <div className="member-row" key={inv.email}>
                                        <div className="m-avatar" style={{ background: 'var(--bg-inset)', border: '2px dashed var(--border-dk)', color: 'var(--ink-3)', fontSize: 16 }}>?</div>
                                        <div className="m-info">
                                            <div className="m-name" style={{ color: 'var(--ink-2)' }}>{inv.email}</div>
                                            <div className="m-email">Invited {inv.when} by {inv.invitedBy}</div>
                                        </div>
                                        <div className="m-role-wrap">
                                            <div className={`role-badge ${roleClassMap[inv.role.toLowerCase()]}`}>{inv.role}</div>
                                        </div>
                                        <div className="m-projects" style={{ color: 'var(--ink-3)' }}>—</div>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 8px' }}>Resend</button>
                                            <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 8px' }}>Revoke</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* ROLES TAB */}
                        {activeTab === 'roles' && (
                            <div className="panel">
                                <div className="panel-top">
                                    <div className="panel-title">Permission Matrix</div>
                                    <span className="panel-meta">✓ Full &nbsp; — Partial &nbsp; ✕ None</span>
                                </div>
                                <div className="matrix-wrap">
                                    <table className="matrix">
                                        <thead>
                                            <tr>
                                                <th style={{ width: 220 }}>Permission</th>
                                                <th>Owner</th>
                                                <th>Admin</th>
                                                <th>Architect</th>
                                                <th>Designer</th>
                                                <th>Client</th>
                                                <th>Viewer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {permissions.map((p) => (
                                                <tr key={p.name}>
                                                    <td><div className="perm-name">{p.name}</div><div className="perm-desc">{p.desc}</div></td>
                                                    <td><PermCell value={p.owner} /></td>
                                                    <td><PermCell value={p.admin} /></td>
                                                    <td><PermCell value={p.architect} /></td>
                                                    <td><PermCell value={p.designer} /></td>
                                                    <td><PermCell value={p.client} /></td>
                                                    <td><PermCell value={p.viewer} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ACTIVITY TAB */}
                        {activeTab === 'activity' && (
                            <div className="panel">
                                <div className="panel-top">
                                    <div className="panel-title">Team Activity Log</div>
                                    <span className="panel-meta">Last 30 days</span>
                                </div>
                                {activityLog.map((a, i) => (
                                    <div className="act-row" key={i}>
                                        <div className="act-icon">{a.icon}</div>
                                        <div className="act-content">
                                            <div className="act-msg" dangerouslySetInnerHTML={{ __html: a.msg }} />
                                            <div className="act-time">{a.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* PLAN CARD */}
                        <div className="plan-card">
                            <div className="plan-name">Current plan</div>
                            <div className="plan-tier">Pro Architect</div>
                            <div className="plan-seats">
                                <div className="plan-used">5</div>
                                <div className="plan-total">/ 7 seats</div>
                            </div>
                            <div className="plan-track"><div className="plan-fill" style={{ width: '72%' }} /></div>
                            <div className="plan-note">2 seats remaining · renews Mar 1, 2026</div>
                        </div>

                        {/* QUICK INVITE */}
                        <div className="panel">
                            <div className="panel-top">
                                <div className="panel-title">Quick invite</div>
                            </div>
                            <div className="invite-box">
                                <div className="invite-form">
                                    <div className="form-group">
                                        <div className="form-label">Email address</div>
                                        <input className="form-input" type="email" placeholder="colleague@studio.com" />
                                    </div>
                                    <div className="form-group">
                                        <div className="form-label">Role</div>
                                        <div className="role-select-grid">
                                            {inviteRoles.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className={`role-option ${selectedInviteRole === r.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedInviteRole(r.id)}
                                                >
                                                    <div className="ro-name">{r.label}</div>
                                                    <div className="ro-desc">{r.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send invite →</button>
                                </div>

                                <div className="invite-pending">
                                    <div className="pending-label">Awaiting response (2)</div>
                                    {pendingInvites.map((inv) => (
                                        <div className="pending-row" key={inv.email}>
                                            <div className="pending-email">{inv.email}</div>
                                            <span className="chip chip-amber">{inv.role}</span>
                                            <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 10 }}>Resend</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── ROLE CHANGE MODAL ─── */}
            <div
                className={`modal-overlay ${modalOpen ? 'open' : ''}`}
                onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
            >
                <div className="modal">
                    <div className="modal-top">
                        <div className="modal-title">Change role — {modalMemberName}</div>
                        <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                        <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                            Changing a member's role will update their permissions immediately. They will be notified by email.
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {modalRoles.map((r) => (
                                <div
                                    key={r.id}
                                    className={`role-option ${selectedModalRole === r.id ? 'selected' : ''}`}
                                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
                                    onClick={() => setSelectedModalRole(r.id)}
                                >
                                    <div className={`role-badge ${roleClassMap[r.id]}`} style={{ pointerEvents: 'none', flexShrink: 0 }}>{r.label}</div>
                                    <div>
                                        <div className="ro-name">{r.label}</div>
                                        <div className="ro-desc">{r.desc}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: selectedModalRole === r.id ? 'var(--green)' : 'var(--ink-4)', fontSize: 16 }}>✓</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-foot">
                        <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={() => setModalOpen(false)}>Save changes</button>
                    </div>
                </div>
            </div>
        </>
    );
}
