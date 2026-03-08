import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import '@/styles/sidebar-dark.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const username = user?.username || 'Architect';
  const role = user?.role || 'Architect';

  return (
    <aside className={`sidebar ${!isOpen ? 'mobile-closed' : ''}`}>
      <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
        <div className="logo-mark">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" fill="#1c1c1a" />
          </svg>
        </div>
        <span className="logo-name">VR Architecture</span>
      </NavLink>

      <div className="focus-bar">
        <div className="focus-label">Today's focus</div>
        <div className="focus-value">No tasks for today</div>
      </div>

      <div className="nav-section">
        <div className="nav-label">Workspace</div>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          Overview
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          My Projects
        </NavLink>
        <NavLink to="/approvals" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </span>
          Approvals
        </NavLink>
        <NavLink to="/sessions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="2" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </span>
          VR Sessions
        </NavLink>
        <NavLink to="/ai-assistant" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          AI Assistant
        </NavLink>
        <NavLink to="/annotations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="m3 11 19-9-9 19-2-8-8-2z" />
            </svg>
          </span>
          Annotations
        </NavLink>
      </div>

      <div className="nav-section" style={{ paddingTop: 10 }}>
        <div className="nav-label">Assets</div>
        <NavLink to="/models" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          3D Models
        </NavLink>
        <NavLink to="/files" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
            </svg>
          </span>
          Files
        </NavLink>
      </div>

      <div className="nav-section" style={{ paddingTop: 10 }}>
        <div className="nav-label">Clients</div>
        <NavLink to="/clients" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          My Clients
        </NavLink>
        <NavLink to="/comments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
          <span className="nav-icon">
            <svg fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          Comments
        </NavLink>
      </div>

      <div className="chat-history">
        <div className="history-label">Recent chats</div>
        <div className="history-item">Penthouse facade options</div>
        <div className="history-item">Client walkthrough prep</div>
        <div className="history-item">Material palette ideas</div>
        <div className="history-item">VR session checklist</div>
      </div>

      <div className="sidebar-footer">
        <div className="user-dot">{username[0].toUpperCase()}</div>
        <div className="user-meta">
          <div className="user-nm">{username}</div>
          <div className="user-rl">{role}</div>
        </div>
        <svg fill="none" stroke="#3a3835" strokeWidth="2" viewBox="0 0 24 24" width="12" height="12"><path d="m6 9 6 6 6-6" /></svg>
      </div>
    </aside>
  );
}
