import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import CommandPalette from '@/components/common/CommandPalette';
import CreateProjectModal from '@/components/dashboard/CreateProjectModal';
import { useAuth } from '@/context/AuthContext';
import { isStudioRole, ROLES } from '@/constants/roles';

import VrAssistantChat from '@/components/dashboard/VrAssistantChat';

export default function MainLayout() {
  const { user } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Role detection & Conditionals
  const role = user?.role || ROLES.CLIENT;
  const isStudio = isStudioRole(role);

  // Dashboard paths that should use the integrated (premium) view
  const isDashboardPath = location.pathname.startsWith('/dashboard') ||
    location.pathname === '/' ||
    ['/workboard', '/approvals', '/sessions', '/models', '/projects', '/files', '/clients', '/comments', '/annotations', '/settings', '/notifications', '/ai-chat'].includes(location.pathname);

  const isArchitect = (role === ROLES.ARCHITECT) || (isStudio && isDashboardPath);
  const isIntegrated = (role === ROLES.ARCHITECT || role === ROLES.ADMIN) && isDashboardPath;

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on wider viewports
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handler = () => {
      if (mq.matches) setIsSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Prevent body scroll while mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };

    const handleOpenPalette = () => setIsPaletteOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenPalette);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenPalette);
    };
  }, []);

  const getTitle = () => {
    const path = location.pathname.substring(1);
    if (!path || path === 'dashboard') return 'Workboard';
    if (path === 'ai-chat') return 'AI Chat';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className={`vr-app portal-container ${isArchitect ? 'architect-dashboard' : ''} ${isStudio ? 'studio-layout' : 'client-layout'} ${isIntegrated ? 'integrated-mode' : ''}`}>
      {/* Default Sidebar — hidden in integrated-mode via CSS */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Backdrop — visible only on mobile when sidebar is open */}
      <div
        className={`sidebar-backdrop${isSidebarOpen ? ' visible' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className={`main ${isPaletteOpen ? 'dimmed' : ''}`}>
        {/* Default Topbar — hidden in integrated-mode via CSS */}
        <Topbar
          onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
          onSearchClick={() => setIsPaletteOpen(true)}
          title={getTitle()}
        />
        <div className="content-area">
          <Outlet />
        </div>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      <CreateProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      {/* Floating AI Assistant — Accessible everywhere in MainLayout */}
      <VrAssistantChat />
    </div>
  );
}
