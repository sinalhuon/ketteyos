'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Briefcase,
    Settings,
    LogOut,
    Menu,
    Image as ImageIcon,
    Sun,
    Moon,
    Crown,
    Calendar,
    Tag,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';
import { useAdminTheme } from '@/contexts/AdminThemeProvider';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileOpen?: boolean;
    onNavigate?: () => void;
}

export default function AdminSidebar({ isCollapsed, toggleSidebar, isMobileOpen = false, onNavigate }: AdminSidebarProps) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useAdminTheme();
    const { settings, loading } = useAdminSettings();
    const { t } = useLanguage();
    const { logout } = useAuth();

    const navItems = [
        { name: t('admin.dashboard'), href: '/admin/dashboard', icon: LayoutDashboard },
        { name: t('admin.users'), href: '/admin/users', icon: Users },
        { name: t('admin.events'), href: '/admin/events', icon: Calendar },
        { name: t('admin.templates'), href: '/admin/templates', icon: FileText },
        { name: t('admin.clients'), href: '/admin/clients', icon: Briefcase },
        { name: t('admin.assets'), href: '/admin/assets', icon: ImageIcon },
        { name: 'Landing Showcase', href: '/admin/landing-showcase', icon: Eye },
        { name: 'Pricing', href: '/admin/pricing', icon: Tag },
        { name: t('admin.settings'), href: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        // Use AuthContext logout — clears localStorage, session cookie, and redirects
        logout();
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col border-r shadow-sm",
                "bg-background border-gray-200 dark:border-white/10 text-foreground",
                // Mobile: slide in from left when open, hide when closed
                "md:translate-x-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0"
                    >
                        <Menu className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </button>

                    {/* Logo Only - Bigger Size with Theme Switching */}
                    <div className="flex items-center justify-center">
                        {loading ? (
                            <div className={`bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse ${isCollapsed ? 'w-16 h-16' : 'w-24 h-24'}`} />
                        ) : (settings.appLogo || settings.appLogoDark) ? (
                            <>
                                {/* Desktop Logo */}
                                <div className={`relative shrink-0 hidden md:flex ${(!settings.mobileAppLogo && !settings.mobileAppLogoDark) ? '!flex' : ''
                                    } ${isCollapsed ? 'w-16 h-16' : 'w-24 h-24'}`}>
                                    <img
                                        src={theme === 'dark' && settings.appLogoDark ? settings.appLogoDark : settings.appLogo || ''}
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>

                                {/* Mobile Logo */}
                                {(settings.mobileAppLogo || settings.mobileAppLogoDark) && (
                                    <div className={`relative shrink-0 flex md:hidden ${isCollapsed ? 'w-16 h-16' : 'w-24 h-24'}`}>
                                        <img
                                            src={theme === 'dark' && settings.mobileAppLogoDark ? settings.mobileAppLogoDark : settings.mobileAppLogo || settings.appLogo || ''}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={`bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 ${isCollapsed ? 'w-14 h-14' : 'w-20 h-20'}`}>
                                <Crown className="text-white" size={isCollapsed ? 32 : 40} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => onNavigate?.()}
                            className={cn(
                                "flex items-center px-3 py-3 rounded-lg transition-all group relative",
                                isActive
                                    ? "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-500 font-medium"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <Icon className={cn("w-6 h-6 shrink-0", isActive && "text-yellow-600 dark:text-yellow-500")} />

                            {!isCollapsed && (
                                <span className="ml-3 truncate">
                                    {item.name}
                                </span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-14 bg-gray-900 dark:bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 ml-2 shadow-lg">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer actions */}
            <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
                {/* Language Switcher */}
                <div className={cn("flex justify-center", isCollapsed ? "mb-2" : "mb-0")}>
                    <LanguageSwitcher className={isCollapsed ? "w-10 h-10 p-0 justify-center" : "w-full justify-start"} />
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "flex items-center w-full px-3 py-3 rounded-lg transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
                        isCollapsed ? "justify-center" : ""
                    )}
                    title={isCollapsed ? t('admin.toggleTheme') : undefined}
                >
                    {theme === 'dark' ? <Sun className="w-6 h-6 shrink-0" /> : <Moon className="w-6 h-6 shrink-0" />}
                    {!isCollapsed && (
                        <span className="ml-3 font-medium truncate">
                            {theme === 'dark' ? t('admin.lightMode') : t('admin.darkMode')}
                        </span>
                    )}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center w-full px-3 py-3 rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300",
                        isCollapsed ? "justify-center" : ""
                    )}
                    title={isCollapsed ? t('admin.logout') : undefined}
                >
                    <LogOut className="w-6 h-6 shrink-0" />
                    {!isCollapsed && (
                        <span className="ml-3 font-medium truncate">{t('admin.logout')}</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
