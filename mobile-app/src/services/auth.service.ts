import axiosInstance from '../api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export interface User {
    id: string;
    email: string;
    username: string;
    role: string;
    exp: number;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password?: string;
    role?: string;
}

interface DecodedToken {
    exp: number;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
    email?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
    name?: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<User | null> {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            const { accessToken, refreshToken } = response.data;
            if (accessToken) {
                await AsyncStorage.setItem('@access_token', accessToken);
                if (refreshToken) await AsyncStorage.setItem('@refresh_token', refreshToken);
                return this.getCurrentUser();
            }
            return null;
        } catch (error: any) {
            console.error('Login failed', error?.response?.data || error);
            throw error;
        }
    },

    async loginSSO(): Promise<User | null> {
        const mockSsoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InNzby11c2VyLTEyMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InNzby1hcmNoaXRlY3RAc3R1ZGlvLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJTU08gQXJjaGl0ZWN0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQXJjaGl0ZWN0IiwiZXhwIjo5OTk5OTk5OTk5fQ.mock_signature";
        await AsyncStorage.setItem('@access_token', mockSsoToken);
        return this.getCurrentUser();
    },

    async register(credentials: RegisterCredentials): Promise<User | null> {
        try {
            const payload = {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password,
                role: credentials.role || 'Client',
            };
            const response = await axiosInstance.post('/auth/register', payload);
            const { accessToken, refreshToken } = response.data;
            if (accessToken) {
                await AsyncStorage.setItem('@access_token', accessToken);
                if (refreshToken) await AsyncStorage.setItem('@refresh_token', refreshToken);
                return this.getCurrentUser();
            }
            return null;
        } catch (error: any) {
            console.error('Registration failed', error?.response?.data || error);
            throw error;
        }
    },

    async logout() {
        await AsyncStorage.removeItem('@access_token');
        await AsyncStorage.removeItem('@refresh_token');
    },

    async getCurrentUser(): Promise<User | null> {
        const token = await AsyncStorage.getItem('@access_token');
        if (!token) return null;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                await this.logout();
                return null;
            }

            return {
                id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
                email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || '',
                username: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || '',
                role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Guest',
                exp: decoded.exp
            };
        } catch (e) {
            return null;
        }
    }
};
