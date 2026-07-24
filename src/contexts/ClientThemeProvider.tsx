'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ClientThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ClientThemeContext = createContext<ClientThemeContextType | undefined>(undefined);

export function ClientThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load theme from localStorage
        const stored = localStorage.getItem('client-theme') as Theme | null;
        if (stored) {
            setThemeState(stored);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Save to localStorage
        localStorage.setItem('client-theme', theme);

        // Apply theme class to document (only for client pages)
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ClientThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ClientThemeContext.Provider>
    );
}

export function useClientTheme() {
    const context = useContext(ClientThemeContext);
    if (context === undefined) {
        throw new Error('useClientTheme must be used within ClientThemeProvider');
    }
    return context;
}
