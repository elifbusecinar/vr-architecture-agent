import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getHomeForRole } from '@/constants/roles';

interface RoleRouteProps {
  allowedRoles: string[];
  children?: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeForRole(user.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
