import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import './index.css';
import './styles/dashboard.css';
import './styles/command-palette.css';
import './styles/session-replay.css';
import './styles/team-roles.css';
import './styles/pricing.css';
import './styles/changelog.css';
import './styles/client-portal.css';
import './styles/portal-shared.css';
import './styles/portal-client.css';
import './styles/portal-owner.css';
import './styles/portal-architect.css';
import './styles/about.css';
import './styles/landing.css';
import './styles/settings.css';
import './styles/notifications.css';
import './styles/states.css';
import './styles/technical-improvements.css';
import App from './App.tsx';
import ErrorBoundary from '@/components/common/ErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
