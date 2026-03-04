import { useAuth } from '@/context/AuthContext';
import { POLICIES, type AppPolicy, type AppRole } from '@/constants/roles';

export function usePolicies() {
    const { user } = useAuth();
    const userRole = user?.role as AppRole;

    const can = (policy: AppPolicy): boolean => {
        if (!userRole) return false;
        const allowedRoles = POLICIES[policy] as readonly string[];
        return allowedRoles.includes(userRole);
    };

    return {
        can,
        isAdmin: can('ADMIN_ACCESS'),
        isStudio: can('STUDIO_ACCESS'),
        isOwner: can('OWNER_ONLY'),
        role: userRole
    };
}
