export interface User {
    id: string;
    username?: string;
    email: string;
    role: string;
    workspaceId?: string;
    exp?: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiry: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
