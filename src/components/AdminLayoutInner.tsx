'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';
import { useAdminTheme } from '@/contexts/AdminThemeProvider';

export default function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { settings } = useAdminSettings();
    const { theme } = useAdminTheme();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans transition-colors duration-300">
            <AdminSidebar
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isSidebarOpen}
                onNavigate={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 z-30 md:hidden h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-2">
                    {/* Logo */}
                    {(settings.mobileAppLogo || settings.appLogo) && (
                        <div className="h-10 w-auto max-w-24 relative flex items-center">
                            <img
                                src={theme === 'dark' ? (settings.mobileAppLogoDark || settings.appLogoDark || settings.appLogo || '') : (settings.mobileAppLogo || settings.appLogo || '')}
                                alt="Logo"
                                className="h-full w-auto object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isSidebarOpen ? (
                            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className={`flex-1 overflow-y-auto h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300 pt-16 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                {children}
            </main>
        </div>
    );
}
