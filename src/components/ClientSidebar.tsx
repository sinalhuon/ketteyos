'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Plus,
    Settings,
    LogOut,
    Menu,
    Sun,
    Moon,
    Crown,
    User,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';
import { useClientTheme } from '@/contexts/ClientThemeProvider';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext'; // Added this import
import LanguageSwitcher from './LanguageSwitcher';
// Removed: import { auth } from '@/lib/api';

interface ClientSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    isMobileOpen?: boolean;
    onNavigate?: () => void;
}

export default function ClientSidebar({ isCollapsed, toggleSidebar, isMobileOpen = false, onNavigate }: ClientSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, toggleTheme } = useClientTheme();
    const { settings, loading } = useAdminSettings();
    const { t } = useLanguage();
    const { logout } = useAuth(); // Destructured logout from useAuth

    const navItems = [
        { name: t('client.sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { name: t('client.sidebar.newEvent'), href: '/dashboard/new', icon: Plus },
        { name: t('client.sidebar.myPlan'), href: '/dashboard/plan', icon: Tag },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col border-r shadow-sm",
                "bg-white dark:bg-[#111] border-gray-200 dark:border-[#222] text-gray-900 dark:text-gray-100",
                // Mobile: slide in from left when open, hide when closed
                "md:translate-x-0",
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#222]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0 hidden md:block"
                    >
                        <Menu className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </button>

                    {/* Mobile Close Button (only visible on mobile when open) */}
                    <button
                        onClick={onNavigate} // Use onNavigate to close on mobile
                        className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors shrink-0 md:hidden"
                    >
                        <Menu className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                    </button>

                    {/* Logo Only - Bigger Size as requested */}
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
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)); // Exact match for dashboard home
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
            <div className="p-4 border-t border-gray-200 dark:border-[#222] space-y-2">
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
                    title={isCollapsed ? "Toggle Theme" : undefined}
                >
                    {theme === 'dark' ? <Sun className="w-6 h-6 shrink-0" /> : <Moon className="w-6 h-6 shrink-0" />}
                    {!isCollapsed && (
                        <span className="ml-3 font-medium truncate">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
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
                    title={isCollapsed ? t('client.sidebar.logout') : undefined}
                >
                    <LogOut className="w-6 h-6 shrink-0" />
                    {!isCollapsed && (
                        <span className="ml-3 font-medium truncate">{t('client.sidebar.logout')}</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
