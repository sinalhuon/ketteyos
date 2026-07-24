'use client';

import AuthGuard from '@/components/AuthGuard';
import ClientLayoutInner from '@/components/ClientLayoutInner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AdminSettingsProvider } from '@/contexts/AdminSettingsContext';
import { ClientThemeProvider } from '@/contexts/ClientThemeProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <LanguageProvider storageKey="admin_language">
                <ClientThemeProvider>
                    <AdminSettingsProvider>
                        <ClientLayoutInner>{children}</ClientLayoutInner>
                    </AdminSettingsProvider>
                </ClientThemeProvider>
            </LanguageProvider>
        </AuthGuard>
    );
}
