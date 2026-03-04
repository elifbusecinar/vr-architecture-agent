import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { clientPortalService, type PublicProject } from '@/services/client-portal/client-portal.service';
import '@/styles/portal-shared.css';
import '@/styles/portal-client.css';

// ─── ICONS ─────────────────────────────────────────────────────────────────
const GridIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const VRIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="5" width="14" height="8" rx="2" /><circle cx="5.5" cy="9" r="1.5" /><circle cx="10.5" cy="9" r="1.5" /><path d="M7 9h2" /></svg>;
const FolderIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4z" /></svg>;
const EditIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4h4" /></svg>;
const GearIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5" /><path d="M8 2v1m0 10v1m6-7h-1" /></svg>;
const LogOutIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 5l3 3-3 3M13 8H6" /></svg>;
const BellIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1a3 3 0 00-3 3v4.5l-1.5 2h9l-1.5-2V4a3 3 0 00-3-3zM3 13.5h10M8 15a2 2 0 01-2-2h4a2 2 0 01-2 2z" /></svg>;
const BuildingIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 1h12v14H2zM5 4h2M5 7h2M5 10h2M9 4h2M9 7h2M9 10h2" /></svg>;
const UsersIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="2.5" /><path d="M1 13c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" /><circle cx="11" cy="6" r="2" /><path d="M8 13c0-1.5 1-2.5 2.5-2.5S13 11.5 13 13" /></svg>;
const HelpIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="7" /><path d="M8 11v.01M8 5a2 2 0 11-2 2" /></svg>;
const MilestoneIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1v14M4 4l4-3 4 3M4 12l4 3 4-3" /></svg>;

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<PublicProject | null>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const [activePage, setActivePage] = useState('dashboard');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const [pendingCount] = useState(0);

  // Theme support
  useEffect(() => {
    document.body.classList.add('client-portal');
    return () => document.body.classList.remove('client-portal');
  }, []);

  useEffect(() => {
    const loadPortalData = async () => {
      setLoading(true);
      try {
        if (token) {
          const data = await clientPortalService.getPublicProject(token);
          setProject(data);
          setProjects([data]);
        } else if (isAuthenticated && user?.role === 'Client') {
          const data = await clientPortalService.getClientProjects();
          setProjects(data);
          if (data.length > 0) {
            setProject(data[0]);
          } else {
            setError('No projects assigned to your account yet.');
          }
        } else if (!token && !isAuthenticated) {
          setError('Please login to access the client portal.');
        }
      } catch (err) {
        console.error('Portal load error:', err);
        setError('Failed to load portal data.');
      } finally {
        setLoading(false);
      }
    };

    loadPortalData();
  }, [token, isAuthenticated, user?.role]);

  const selectProject = (p: PublicProject) => {
    setProject(p);
    setIsProjectDropdownOpen(false);
    setActivePage('dashboard');
  };

  if (loading) return <div className="portal-container" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading portal...</div>;
  if (error) return <div className="portal-container" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--red)' }}>{error}</div>;

  const displayTitle = project?.title || 'Project Preview';
  const displayClient = project?.clientName || user?.username || 'Client';
  const displayFirm = project?.workspaceName || 'Architecture Studio';
  const displayClientInitials = displayClient.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="portal-container client-portal">
      {/* SIDEBAR */}
      <nav className="sidebar">
        <div className="sb-firm">
          <div className="sb-logo" style={{ background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BuildingIcon /></div>
          <div>
            <div className="sb-firm-name">{displayFirm}</div>
            <div className="sb-firm-sub">{displayFirm.toLowerCase().replace(/\s+/g, '')}.vr-architecture.com</div>
          </div>
        </div>

        <div className="sb-client">
          <div className="sb-av">{displayClientInitials}</div>
          <div>
            <div className="sb-client-name">{displayClient}</div>
            <div className="sb-client-badge">● Client access</div>
          </div>
        </div>

        <div className="sb-nav">
          <div className="nav-group-label">My projects</div>
          <NavItem id="dashboard" active={activePage} onClick={setActivePage} icon={<GridIcon />} label="Overview" />
          <NavItem id="approvals" active={activePage} onClick={setActivePage} icon={<CheckIcon />} label="Approvals" badge={pendingCount > 0 ? pendingCount : undefined} badgeType="nb-amber" />
          <NavItem id="sessions" active={activePage} onClick={setActivePage} icon={<VRIcon />} label="VR Sessions" />
          <NavItem id="files" active={activePage} onClick={setActivePage} icon={<FolderIcon />} label="Files & Models" />
          <NavItem id="comments" active={activePage} onClick={setActivePage} icon={<EditIcon />} label="Comments" />

          <div className="nav-group-label" style={{ marginTop: 8 }}>Project</div>
          <NavItem id="timeline" active={activePage} onClick={setActivePage} icon={<ClockIcon />} label="Timeline" />
          <NavItem id="milestones" active={activePage} onClick={setActivePage} icon={<MilestoneIcon />} label="Milestones" />
          <NavItem id="team" active={activePage} onClick={setActivePage} icon={<UsersIcon />} label="My team" />

          <div className="nav-group-label" style={{ marginTop: 8 }}>Account</div>
          <NavItem id="settings" active={activePage} onClick={setActivePage} icon={<GearIcon />} label="Preferences" />
          <NavItem id="help" active={activePage} onClick={setActivePage} icon={<HelpIcon />} label="Help & support" />
        </div>

        <div className="sb-project">
          <div className="sp-label">Active project</div>
          <div className="sp-current" onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}>
            <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', color: 'var(--ink-2)' }}><BuildingIcon /></span>
            <span className="sp-name">{displayTitle}</span>
            <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>⌄</span>
          </div>
          {isProjectDropdownOpen && (
            <div className="sp-dropdown open" style={{ bottom: '100%', left: 8, right: 8, position: 'absolute' }}>
              {projects.map((p: PublicProject) => (
                <div
                  key={p.id}
                  className={`sp-option ${project?.id === p.id ? 'selected' : ''}`}
                  onClick={() => selectProject(p)}
                >
                  {p.title}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sb-bottom">
          <div className="logout-btn" onClick={() => setIsLogoutModalOpen(true)}>
            <span style={{ fontSize: 14, display: 'flex', alignItems: 'center' }}><LogOutIcon /></span>
            <span>Sign out</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-4)', marginLeft: 'auto' }}>{displayClient}</span>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <div className="tb-page-title">{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</div>
          <div className="tb-right">
            <div className="tb-notif-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <BellIcon />
            </div>
            <div className="tb-help-btn" onClick={() => setActivePage('help')}>Help</div>
          </div>
        </header>

        <div className="page">
          {activePage === 'dashboard' && <DashboardContent displayTitle={displayTitle} totalApprovals={pendingCount} />}
          {activePage !== 'dashboard' && (
            <div style={{ textAlign: 'center', marginTop: 100 }}>
              <h2 className="section-title"><em>{activePage.charAt(0).toUpperCase() + activePage.slice(1)}</em> coming soon</h2>
              <p className="section-sub">We are integrating this section for you.</p>
            </div>
          )}
        </div>
      </div>

      {/* NOTIF PANEL */}
      <div className={`notif-panel ${isNotifOpen ? 'open' : ''}`}>
        <div className="np-header"><div className="np-title">Notifications</div><div className="np-close" onClick={() => setIsNotifOpen(false)}>✕</div></div>
        <div className="np-body">
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-4)', fontSize: 12 }}>No new notifications</div>
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && setIsLogoutModalOpen(false)}>
          <div className="modal">
            <div className="modal-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOutIcon /></div>
            <div className="modal-title">Sign out?</div>
            <div className="modal-sub">You'll be returned to the login screen. All your project data is safely saved.</div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setIsLogoutModalOpen(false)}>Stay signed in</button>
              <button className="modal-confirm" onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ id, active, onClick, icon, label, badge, badgeType }: any) {
  return (
    <div className={`nav-item ${active === id ? 'active' : ''}`} onClick={() => onClick(id)}>
      <span className="nav-icon">{icon}</span>
      {label}
      {badge && <span className={`nav-badge ${badgeType}`}>{badge}</span>}
    </div>
  );
}

function DashboardContent({ displayTitle, totalApprovals }: any) {
  return (
    <div style={{ maxWidth: 980 }}>
      <div className="hero-strip">
        <div className="hs-left">
          <div className="hs-eyebrow">Client portal</div>
          <div className="hs-title">{displayTitle.split(' — ')[0]}<br /><em>{displayTitle.split(' — ')[1] || 'Unit 14B'}</em></div>
          <div className="hs-meta">
            <div className="hs-tag">📍 London, Canary Wharf</div>
            <div className="hs-tag">🏠 Residential</div>
            <div className="hs-tag" style={{ color: 'rgba(166,124,58,0.7)' }}>⏳ 20 days remaining</div>
          </div>
        </div>
        <div className="hs-right">
          <div className="progress-ring">
            <svg className="pr-svg" width="88" height="88" viewBox="0 0 88 88">
              <circle className="pr-track" cx="44" cy="44" r="39" />
              <circle className="pr-fill" cx="44" cy="44" r="39" />
            </svg>
            <div className="pr-center">
              <div className="pr-val">70%</div>
              <div className="pr-sub">complete</div>
            </div>
          </div>
          <div className="deadline-badge">📅 Due Mar 15, 2026</div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Pending approvals" val={totalApprovals} sub="awaiting your review" delta="0 needs action" deltaType="delta-neutral" color="var(--amber)" />
        <StatCard label="VR sessions" val="0" sub="total this project" delta="0 this week" deltaType="delta-neutral" />
        <StatCard label="Your comments" val="0" sub="0 replied by team" delta="0 resolved" deltaType="delta-neutral" />
        <StatCard label="Latest model" val="N/A" sub="No models uploaded" delta="pending" deltaType="delta-neutral" isModel />
      </div>

      <div className="grid-2" style={{ gap: 18 }}>
        <div className="card">
          {/* Simple content placeholder for brevity, full logic can follow */}
          <div className="card-header"><div className="card-title">Pending Approvals</div><span className="tag tag-amber">{totalApprovals} awaiting</span></div>
          <div className="card-body">
            <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Individual approval items will appear here.</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Activity</div><span className="tag tag-green">Live</span></div>
          <div className="card-body">
            <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Latest project updates and messages.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, sub, delta, deltaType, color, isModel }: any) {
  return (
    <div className="stat-card">
      <div className="sc-label">{label}</div>
      <div className="sc-val" style={{ color, fontSize: isModel ? 20 : undefined, marginTop: isModel ? 4 : undefined }}>{val}</div>
      <div className="sc-sub">{sub}</div>
      <div className={`sc-delta ${deltaType}`}>{delta}</div>
    </div>
  );
}


