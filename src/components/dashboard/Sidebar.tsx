import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isStudioRole, ROLES } from '@/constants/roles';
import { useWorkspaces } from '@/hooks/useWorkspaces';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { data: workspaces } = useWorkspaces();
  console.log('Sidebar workspaces count:', workspaces?.length);

  const role = user?.role || ROLES.CLIENT;

  if (!isStudioRole(role) || role === ROLES.ADMIN) {
    return (
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-logo">🏛</div>
          <div>
            <div className="sb-brand-name">VR Architecture</div>
            <div className="sb-brand-sub">workspace</div>
          </div>
        </div>
        <nav className="sb-nav">
          <NavLink to="/dashboard" className="nav-item" onClick={onClose}>
            <span className="nav-icon">⊞</span>Overview
          </NavLink>
        </nav>
        <div className="sb-bottom" style={{ marginTop: 'auto' }}>
          <div className="logout-btn" onClick={logout}>Sign out</div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sb-brand">
        <div className="sb-logo">🏛</div>
        <div>
          <div className="sb-brand-name">Koç Architects</div>
          <div className="sb-brand-sub">architect workspace</div>
        </div>
      </div>

      <div className="sb-user">
        <div className="sb-av">{user?.username?.[0] || 'U'}</div>
        <div>
          <div className="sb-user-name">{user?.username || 'Architect'}</div>
          <div className="sb-role-badge">◑ Architect</div>
        </div>
      </div>

      <div className="sb-nav">
        <div className="nav-group-label">Workspace</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">⊞</span>Workboard
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">📁</span>My Projects<span className="nav-badge nb-blue">3</span>
        </NavLink>
        <NavLink to="/approvals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">✓</span>Approvals<span className="nav-badge nb-amber">4</span>
        </NavLink>
        <NavLink to="/sessions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">🥽</span>VR Sessions<span className="nav-badge nb-blue">1 today</span>
        </NavLink>
        <NavLink to="/annotations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">📍</span>Annotations<span className="nav-badge nb-red">6</span>
        </NavLink>
        <NavLink to="/models" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">📦</span>Models<span className="nav-badge nb-amber">1</span>
        </NavLink>
        <NavLink to="/files" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">📂</span>Files
        </NavLink>
        <NavLink to="/clients" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">◉</span>Clients
        </NavLink>
        <NavLink to="/comments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">✎</span>Comments<span className="nav-badge nb-blue">3</span>
        </NavLink>
      </div>

      <div style={{ flex: 1 }}></div>

      <div className="sb-bottom">
        <div style={{ display: 'flex', gap: 5, padding: '0 0 6px' }}>
          <NavLink to="/settings" className="nav-item" style={{ flex: 1, margin: 0, justifyContent: 'center' }} onClick={onClose}>
            <span className="nav-icon">⚙</span>
          </NavLink>
          <NavLink to="/help" className="nav-item" style={{ flex: 1, margin: 0, justifyContent: 'center' }} onClick={onClose}>
            <span className="nav-icon">?</span>
          </NavLink>
        </div>
        <div className="logout-btn" onClick={logout}>
          <span style={{ fontSize: 14 }}>⎋</span><span>Sign out</span>
          <span style={{ fontFamily: 'var(--arch-mono)', fontSize: 9, color: 'var(--arch-ink-4)', marginLeft: 'auto' }}>{user?.username}</span>
        </div>
      </div>
    </aside>
  );
}
