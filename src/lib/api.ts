
// Helper for PHP API requests
// Helper for PHP API requests
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'; // Relative path to public/api 

// If we are in cutting edge or production environments where the API is hosted on the same domain
// we should prefer using the relative path to avoid CORS issues and mixed content errors.
// However, during local dev (Nextjs on 3000, PHP on 8000), we need the full URL.
const getApiBase = () => {
    if (typeof window !== 'undefined') {
        // If running on localhost:3000, keep using the env var (localhost:8000)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        }
        // In production (same domain), use /api
        return '/api';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

const BASE_URL = getApiBase();
export { BASE_URL };

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    profileImage?: string;
    isSuperAdmin?: boolean;
    planId?: string | null;
    plan?: { id: string; name: string; nameEn?: string } | null;
    limits?: Record<string, number | boolean>;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    userId?: string;
    error?: string;
    message?: string;
}

export const auth = {
    // Login
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${BASE_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (data.success && data.token) {
                // Save to LocalStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    // Also set cookie for middleware compatibility if any (though static export assumes no middleware)
                    document.cookie = `session=${data.token}; path=/; max-age=86400; SameSite=Strict`;
                }
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error occurred' };
        }
    },

    // Register
    register: async (name: string, email: string, password: string, phoneNumber: string, telegram?: string, planId?: string | null): Promise<AuthResponse> => {
        try {
            const res = await fetch(`${BASE_URL}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, phoneNumber, telegram, planId: planId || undefined }),
            });
            const data = await res.json();

            if (data.success && data.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    document.cookie = `session=${data.token}; path=/; max-age=86400; SameSite=Strict`;
                }
            }
            return data;
        } catch (error) {
            return { success: false, error: 'Network error occurred' };
        }
    },

    // Logout
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            document.cookie = 'session=; path=/; max-age=0';
            window.location.href = '/';
        }
    },

    // Get Current User (from Storage)
    getUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Refresh Current User Data from Server
    refreshUser: async (): Promise<User | null> => {
        try {
            const token = auth.getToken();
            if (!token) return null;

            const res = await fetch(`${BASE_URL}/profile.php`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                    // Update localStorage with fresh data
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    return data.user;
                }
            } else if (res.status === 401 || res.status === 404) {
                // Token is explicitly expired/unauthorized or user was deleted
                auth.logout();
            }
            return null;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    },

    // Get Token
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }
};

// Generic Fetch Wrapper
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = auth.getToken();

    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
        ...options,
        headers
    });

    // Handle 401 Unauthorized globally
    if (res.status === 401) {
        auth.logout();
        return null;
    }

    const data = await res.json();

    // Check for suspension status in response
    if (data && data.user && data.user.status === 'SUSPENDED') {
        auth.logout();
        return null;
    }

    return data;
}
