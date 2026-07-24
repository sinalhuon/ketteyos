'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth as apiAuth } from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    console.log('AuthContext: AuthProvider initializing...');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Initialize from localStorage
        const storedUser = apiAuth.getUser();
        console.log('AuthContext: Initial user from localStorage:', storedUser);
        if (storedUser) {
            setUser(storedUser);
            // Verify session with backend immediately on load
            refreshUser().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Also handle cross-tab logout/login events and user refresh events
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_token' || e.key === 'user') {
                const storedUser = apiAuth.getUser();
                setUser(storedUser);
                if (!storedUser) {
                    // if logged out in another tab
                    if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) {
                        router.push('/');
                    }
                }
            }
        };

        const handleUserRefresh = () => {
            refreshUser();
        };

        const handleUserSuspended = (event: Event) => {
            const customEvent = event as CustomEvent;
            // Check if current user is the one who was suspended
            if (user && customEvent.detail?.userId === user.id) {
                logout();
            } else {
                // Otherwise, refresh to get updated data
                refreshUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userDataUpdated', handleUserRefresh);
        window.addEventListener('userSuspended', handleUserSuspended);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userDataUpdated', handleUserRefresh);
            window.removeEventListener('userSuspended', handleUserSuspended);
        };
    }, [pathname, router]);

    const refreshUser = async () => {
        try {
            console.log('AuthContext: Refreshing user data...');
            const refreshedUser = await apiAuth.refreshUser();
            if (refreshedUser) {
                console.log('AuthContext: Got refreshed user:', refreshedUser);
                setUser(refreshedUser);
                
                // Check if user is suspended and logout immediately
                if (refreshedUser.status === 'SUSPENDED') {
                    console.log('AuthContext: User is SUSPENDED, logging out...');
                    logout();
                    return;
                }
            } else {
                console.log('AuthContext: Refresh attempt returned no data, checking storage...');
                const storedUser = apiAuth.getUser();
                if (!storedUser) {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('AuthContext: Failed to refresh user data:', error);
            // Don't logout or clear user on temporary network or 500 error
        }
    };

    // Periodic suspension check with a longer interval to reduce request pressure.
    useEffect(() => {
        console.log('AuthContext: Setting up periodic check, user:', user);
        if (!user) return;
        
        console.log('AuthContext: Starting 5-minute interval for suspension checks');
        const interval = setInterval(() => {
            console.log('AuthContext: Interval triggered - calling refreshUser');
            refreshUser();
        }, 300000); // Check every 5 minutes
        
        return () => {
            console.log('AuthContext: Cleaning up interval');
            clearInterval(interval);
        };
    }, [user]);

    // Check on page visibility change (when user switches back to tab)
    useEffect(() => {
        console.log('AuthContext: Setting up visibility/focus events, user:', user);
        if (!user) return;
        
        const handleVisibilityChange = () => {
            console.log('AuthContext: Visibility changed, hidden:', document.hidden);
            if (!document.hidden) {
                console.log('AuthContext: Page became visible - calling refreshUser');
                refreshUser();
            }
        };
        
        const handleWindowFocus = () => {
            console.log('AuthContext: Window focused - calling refreshUser');
            refreshUser();
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleWindowFocus);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [user]);

    const login = (token: string, userData: User) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `session=${token}; path=/; max-age=86400; SameSite=Strict`;
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Clear all possible cookie variants
        document.cookie = 'session=; path=/; max-age=0; SameSite=Strict';
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        // Hard redirect so React fully unmounts and reinitializes — prevents stale state
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
