import AdminGuard from '@/components/AdminGuard';
import AdminLayoutInner from '@/components/AdminLayoutInner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AdminSettingsProvider } from '@/contexts/AdminSettingsContext';
import { AdminThemeProvider } from '@/contexts/AdminThemeProvider';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Session check handled by AdminGuard client-side for static export compatibility


    return (
        <AdminGuard>
            <LanguageProvider>
                <AdminThemeProvider>
                    <AdminSettingsProvider>
                        <AdminLayoutInner>{children}</AdminLayoutInner>
                    </AdminSettingsProvider>
                </AdminThemeProvider>
            </LanguageProvider>
        </AdminGuard>
    );
}
