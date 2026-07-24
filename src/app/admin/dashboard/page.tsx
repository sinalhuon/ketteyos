'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import AdminGuard from '@/components/AdminGuard';
import { Users, Calendar, Music, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

// ... imports
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState<any>({ database: 'Unknown', storage: 'Unknown' });
    const [growth, setGrowth] = useState<any>({ rate: 0, label: 'Loading...', trend: 'flat' });
    const [latency, setLatency] = useState<number>(0);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and recent events in one call
                const startTime = Date.now();
                const data = await apiFetch('admin.php?action=stats');
                const endTime = Date.now();
                setLatency(endTime - startTime);

                if (data && data.success) {
                    setStats(data.stats);
                    setRecentEvents(data.recentEvents || []);
                    if (data.health) {
                        setHealth(data.health);
                    } else {
                        setHealth({ database: 'Connected', storage: 'Optimal' });
                    }
                    if (data.growth) {
                        setGrowth(data.growth);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        // ... loading state
        return (
            <AdminGuard>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
            </AdminGuard>
        );
    }

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.dashboard')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.welcome')}, Super Owner. Here's what's happening today.</p>
                </div>
                <div className="hidden md:block">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 dark:text-[#FFD700] dark:bg-[#FFD700]/10 dark:text-yellow-400 dark:border-[#FFD700]/20">
                        Ketteyos System v1.1
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={t('admin.totalGuests')}
                    value={stats?.users || 0}
                    icon={<Users size={24} className="text-blue-500" />}
                    borderColor="border-blue-100 dark:border-blue-500/30"
                    glowColor="shadow-blue-500/5 dark:shadow-blue-500/20"
                    badge="+2.5%"
                />
                <StatCard
                    title={t('admin.totalEvents')}
                    value={stats?.events || 0}
                    icon={<Calendar size={24} className="text-purple-500" />}
                    borderColor="border-purple-100 dark:border-purple-500/30"
                    glowColor="shadow-purple-500/5 dark:shadow-purple-500/20"
                    badge="+2.5%"
                />
                <StatCard
                    title={t('admin.assets')}
                    value={stats?.assets || 0}
                    icon={<Music size={24} className="text-[#FFD700] dark:text-[#FFD700]" />}
                    borderColor="border-yellow-100 dark:border-[#FFD700]/30"
                    glowColor="shadow-yellow-500/5 dark:shadow-[#FFD700]/20"
                    badge="+2.5%"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] shadow-sm dark:shadow-none">
                    <div className="p-6 border-b border-gray-100 dark:border-[#222] flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock size={18} className="text-gray-400" /> {t('admin.recentActivity')}
                        </h3>
                        <Link href="/admin/events" className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition">{t('common.actions')}</Link>
                    </div>
                    {/* ... table content remains mostly same, can translate headers if needed ... */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-[#161616] text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium">{t('admin.events')}</th>
                                    <th className="px-6 py-4 text-left font-medium">{t('admin.clients')}</th>
                                    <th className="px-6 py-4 text-left font-medium">Date</th>
                                    <th className="px-6 py-4 text-left font-medium">Status</th>
                                    <th className="px-6 py-4 text-left font-medium">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                                {recentEvents.map((event: any) => (
                                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{event.title}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{event.userName || event.userEmail}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/event?id=${event.id}`}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                            >
                                                {t('common.edit')}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No events found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Widget - Keep generic text or translate if critical */}
                <div className="bg-gradient-to-br from-white to-yellow-50/50 dark:from-gray-900 dark:to-black rounded-2xl p-6 border border-yellow-100/50 dark:border-gray-800 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow dark:shadow-lg">
                    {/* ... content ... */}
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('admin.systemHealth')}</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.database')}</span>
                                <span className={`flex items-center text-sm font-medium ${health.database === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${health.database === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {health.database === 'Connected' ? t('admin.connected') : t('admin.disconnected')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.storage')}</span>
                                <span className={`flex items-center text-sm font-medium ${health.storage === 'Optimal' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${health.storage === 'Optimal' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                    {health.storage === 'Optimal' ? t('admin.optimal') : t('admin.degraded')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.apiLatency')}</span>
                                <span className={`flex items-center text-sm font-medium ${latency < 200 ? 'text-green-500' : latency < 500 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {latency}ms
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${growth.trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500'}`}>
                                    <TrendingUp size={20} className={growth.trend === 'down' ? 'rotate-180' : ''} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {growth.rate > 0 ? '+' : ''}{growth.rate}%
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{growth.label}</div>
                                </div>
                            </div>
                        </div>
                        {/* ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}

// StatCard component ...
function StatCard({ title, value, icon, badge, glowColor, borderColor }: any) {
    return (
        <div className={`bg-white/80 dark:bg-[#111] backdrop-blur-sm p-6 rounded-2xl border ${borderColor} shadow-sm hover:shadow-md dark:shadow-lg ${glowColor} relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
            {/* Background Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-current opacity-5 blur-[60px] rounded-full point-events-none pointer-events-none`}></div>

            {/* Subtle Gradient Overlay for Light Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-transparent dark:to-transparent pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#222] shadow-sm">
                        {icon}
                    </div>
                    {badge && (
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#222] px-2 py-1 rounded-md backdrop-blur-sm">
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{value}</h3>
                <p className="text-sm text-gray-500 font-medium tracking-wide">{title}</p>
            </div>
        </div>
    );
}
