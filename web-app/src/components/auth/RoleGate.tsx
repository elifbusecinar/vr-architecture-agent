import React, { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface RoleGateProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

/**
 * RoleGate component to conditionally render children based on user roles.
 * Example: <RoleGate allowedRoles={['Admin', 'Architect']}> <SecretButton /> </RoleGate>
 */
const RoleGate: React.FC<RoleGateProps> = ({ children, allowedRoles, fallback = null }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <>{fallback}</>;
    }

    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default RoleGate;
