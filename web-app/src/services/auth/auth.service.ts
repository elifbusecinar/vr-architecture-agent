import type { LoginCredentials, SignupCredentials, User } from '@/types/auth.types';

const MOCK_USER: User = {
    id: 'u1',
    username: 'demo_architect',
    email: 'architect@studio.com',
    role: 'Architect',
    workspaceId: 'w1'
};

class AuthService {
    async login(_credentials: LoginCredentials): Promise<User | null> {
        // Any login attempt succeeds for the demo
        localStorage.setItem('auth_token', 'mock_token');
        localStorage.setItem('token', 'mock_token'); // For SignalR and other services
        localStorage.setItem('auth_user', JSON.stringify(MOCK_USER));
        return MOCK_USER;
    }

    async register(_credentials: SignupCredentials): Promise<User | null> {
        localStorage.setItem('auth_token', 'mock_token');
        localStorage.setItem('token', 'mock_token');
        localStorage.setItem('auth_user', JSON.stringify(MOCK_USER));
        return MOCK_USER;
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
    }

    getCurrentUser(): User | null {
        // In Disconnected Mock Mode, we ensure a user is always returned
        // to prevent redirect loops.
        return MOCK_USER;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('auth_token') || !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token') || 'mock_token';
    }
}


export const authService = new AuthService();

