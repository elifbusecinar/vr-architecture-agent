import { createBrowserRouter } from 'react-router-dom';
import {
  LoginPage,
  SignupPage,
  DashboardPage,
  ProjectPage,
  LandingPage,
  SessionReplayPage,
  TeamRolesPage,
  PricingPage,
  ChangelogPage,
  ClientPortalPage,
  AboutPage,
  ProjectsListPage,
  SessionPreviewPage,
  VRInterfacePage
} from '@/pages';

import { MainLayout, ProtectedRoute } from '@/components';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/changelog', element: <ChangelogPage /> },
  { path: '/portal/:token?', element: <ClientPortalPage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/vr-interface', element: <VRInterfacePage /> },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/approvals', element: <DashboardPage /> },
      { path: '/annotations', element: <DashboardPage /> },
      { path: '/models', element: <DashboardPage /> },
      { path: '/files', element: <DashboardPage /> },
      { path: '/clients', element: <DashboardPage /> },
      { path: '/comments', element: <DashboardPage /> },
      { path: '/project/:id', element: <ProjectPage /> },
      { path: '/ai-chat', element: <DashboardPage /> },
      { path: '/ai-insights', element: <DashboardPage /> },
      { path: '/projects', element: <ProjectsListPage /> },

      { path: '/session/:id/replay', element: <SessionReplayPage /> },
      { path: '/session/:id/preview', element: <SessionPreviewPage /> },
      { path: '/sessions', element: <SessionReplayPage /> },
      { path: '/team', element: <TeamRolesPage /> },
      { path: '/settings', element: <DashboardPage /> },
      { path: '/notifications', element: <DashboardPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
