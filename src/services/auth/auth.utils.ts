import type { User } from '@/types/auth.types';

export const parseJwt = (token: string): User | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Map JWT claims to User object
        // Expecting: sub (id), email, role, exp
        return {
            id: decoded.sub || decoded.nameid,
            email: decoded.email,
            role: decoded.role,
            exp: decoded.exp
        };
    } catch (error) {
        console.error('Failed to parse JWT token', error);
        return null;
    }
};
