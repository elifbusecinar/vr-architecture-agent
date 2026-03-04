import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSessions } from '@/hooks/useSessions';
import { useWorkspaces } from '@/hooks/useWorkspaces';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useProjects } from '@/hooks/useProjects';
import { useActivities } from '@/hooks/useActivities';
import { usePolicies } from '@/hooks/usePolicies';
import OwnerDashboard from './OwnerDashboard';
import ArchitectDashboard from './ArchitectDashboard';
import type { ArchitectTab } from './ArchitectDashboard';
import '@/styles/portal-shared.css';
import '@/styles/portal-owner.css';
import '@/styles/portal-architect.css';
import '@/styles/portal-client.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname.substring(1) || 'dashboard';
  const tab = currentPath === 'dashboard' ? 'overview' : currentPath;

  const { isStudio, isOwner } = usePolicies();
  const firstName = user?.username?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const { data: workspaces = [] } = useWorkspaces();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');

  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  const currentWorkspaceId = selectedWorkspaceId || workspaces?.[0]?.id || '';
  const { data: activeSessions } = useSessions();
  const { data: analytics } = useAnalytics(currentWorkspaceId);
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects(currentWorkspaceId);
  const { data: activities } = useActivities(currentWorkspaceId);
  const projects = projectsData?.data || [];

  // Theme support
  useEffect(() => {
    if (isStudio) {
      document.body.classList.add('owner-dashboard');
      if (!isOwner) document.body.classList.add('architect-dashboard');
      document.body.classList.add('integrated-mode');
    } else {
      document.body.classList.add('client-portal');
      document.body.classList.add('integrated-mode');
    }
    return () => {
      document.body.classList.remove('owner-dashboard');
      document.body.classList.remove('architect-dashboard');
      document.body.classList.remove('client-portal');
      document.body.classList.remove('integrated-mode');
    };
  }, [isStudio, isOwner]);

  if (!isStudio) {
    return <Navigate to="/portal" replace />;
  }

  if (isOwner) {
    return <OwnerDashboard
      key={location.pathname}
      firstName={firstName}
      activeTab={tab as any}
      analytics={analytics}
      activeSessions={activeSessions}
      projects={projects}
      activities={activities}
      workspaces={workspaces}
      currentWorkspaceId={currentWorkspaceId}
      onWorkspaceChange={setSelectedWorkspaceId}
    />;
  }

  return <ArchitectDashboard
    key={location.pathname}
    firstName={firstName}
    activeTab={tab as ArchitectTab}
    projects={projects}
    analytics={analytics}
    activeSessions={activeSessions}
    activities={activities}
    isLoading={isProjectsLoading}
  />;
}
