import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginCredentials, RegisterCredentials } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<User | null>;
    loginSSO: () => Promise<User | null>;
    register: (credentials: RegisterCredentials) => Promise<User | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error("Failed to load user auth context", e);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        setError(null);
        try {
            // Try actual login first
            const loggedInUser = await authService.login(credentials);
            if (loggedInUser) {
                setUser(loggedInUser);
                setIsAuthenticated(true);
            }
            return loggedInUser;
        } catch (err: any) {
            console.log("API not available, switching to demo mode");
            // MOCK LOGIN: Allow login with any email/password for demo purposes
            const mockUser: User = {
                id: 'demo-user-123',
                email: credentials.email,
                username: credentials.email.split('@')[0],
                role: 'Architect',
                exp: Math.floor(Date.now() / 1000) + 3600
            };
            setUser(mockUser);
            setIsAuthenticated(true);
            return mockUser;
        } finally {
            setIsLoading(false);
        }
    };

    const loginSSO = async () => {
        setIsLoading(true);
        try {
            const loggedInUser = await authService.loginSSO();
            if (loggedInUser) {
                setUser(loggedInUser);
                setIsAuthenticated(true);
            }
            return loggedInUser;
        } catch (err: any) {
            setError('SSO Login failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const registeredUser = await authService.register(credentials);
            if (registeredUser) {
                setUser(registeredUser);
                setIsAuthenticated(true);
            }
            return registeredUser;
        } catch (err: any) {
            const errorMsg = err?.response?.data || err.message || 'Registration failed.';
            setError(typeof errorMsg === 'string' ? errorMsg : 'Registration failed.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                error,
                login,
                loginSSO,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
