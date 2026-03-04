import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, LoginCredentials, SignupCredentials } from '@/types/auth.types';
import { authService } from '@/services/auth/auth.service';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<User | null>;
    register: (credentials: SignupCredentials) => Promise<User | null>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<User | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const loggedInUser = await authService.login(credentials);
            if (loggedInUser) {
                setUser(loggedInUser);
                setIsAuthenticated(true);
            }
            return loggedInUser;
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: SignupCredentials): Promise<User | null> => {
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
            setError(err.message || 'Registration failed. Please try again.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const logout = () => {
        authService.logout();
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
