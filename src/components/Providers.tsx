'use client';

import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/Toast';
import { LanguageProvider } from '@/context/LanguageContext';

import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="theme">
            <AuthProvider>
                <LanguageProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </LanguageProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
