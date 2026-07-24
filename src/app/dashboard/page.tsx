'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    guestCount: number;
}

export default function DashboardPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading, logout } = useAuth();
    const { t } = useLanguage();

    // Limit helpers
    const limits = (user as any)?.limits || {};
    const maxEvents: number = limits.maxEvents ?? 1;
    const isUnlimited = maxEvents === -1 || maxEvents === 9999 || maxEvents === 999;

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        const fetchEvents = async () => {
            try {
                const data = await apiFetch('events.php');
                if (data && data.success) {
                    setEvents(data.events);
                }
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user, authLoading, router]);

    const handleLogout = () => {
        logout();
    };

    if (loading || authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">
                        {t('dashboard.myEvents')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            {t('dashboard.signOut')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
                {/* No plan banner */}
                {!user?.planId && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">No Active Plan</h3>
                                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                                    You need to select a plan before creating events. Please choose a package from our pricing page.
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        href="/dashboard/plan"
                                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm text-sm font-semibold"
                                    >
                                        View Plans
                                    </Link>
                                    <a
                                        href="https://t.me/ketteyos"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
                                    >
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard.allEvents')}</h2>
                    {!loading && (
                        user?.planId ? (
                            !isUnlimited && events.length >= maxEvents ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                        {events.length}/{maxEvents} events used
                                    </span>
                                    <a
                                        href="https://t.me/ketteyos"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition shadow-sm text-sm font-semibold"
                                    >
                                        Contact to Upgrade
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    {!isUnlimited && (
                                        <span className="text-sm text-gray-400 dark:text-gray-500">
                                            {events.length}/{maxEvents} events
                                        </span>
                                    )}
                                    <Link
                                        href="/dashboard/new"
                                        className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition shadow-sm"
                                    >
                                        <Plus size={18} />
                                        {t('dashboard.newEvent')}
                                    </Link>
                                </div>
                            )
                        ) : (
                            <button
                                disabled
                                className="inline-flex items-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-md cursor-not-allowed text-sm font-medium"
                            >
                                <Plus size={18} />
                                Select Plan First
                            </button>
                        )
                    )}
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{t('dashboard.noEvents')}</p>
                        {user?.planId ? (
                            <Link
                                href="/dashboard/new"
                                className="text-yellow-600 hover:underline font-medium"
                            >
                                {t('dashboard.createFirst')}
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard/plan"
                                className="text-red-600 hover:underline font-medium"
                            >
                                Select a Plan to Create Your First Event
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mt-1">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {event.guestCount} {t('dashboard.guests')}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {event.location}
                                </p>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <Link
                                        href={`/dashboard/event?id=${event.id}`}
                                        className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded"
                                    >
                                        {t('dashboard.manage')}
                                    </Link>
                                    <Link
                                        href={`/invite/${event.id}`}
                                        target="_blank"
                                        className="flex-1 text-center text-sm font-medium text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 py-2 rounded"
                                    >
                                        {t('dashboard.preview')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
