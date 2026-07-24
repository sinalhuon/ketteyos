'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Calendar, Edit, Trash2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';

interface AdminEvent {
    id: string;
    title?: string | null;
    userEmail?: string | null;
    location?: string | null;
    date?: string | null;
    startDate?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    guestCount?: number | null;
}

export default function AdminEventsPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await apiFetch('events.php');
            if (data.success) {
                setEvents(data.events);
            }
        } catch (e) {
            console.error('Failed to fetch events', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.eventsPage.deleteConfirm'))) return;
        try {
            const res = await apiFetch(`events.php?id=${id}`, { method: 'DELETE' });
            if (res.success) {
                setEvents(events.filter(e => e.id !== id));
            } else {
                toast.error(res.error || t('common.error'));
            }
        } catch {
            toast.error(t('common.error'));
        }
    };

    const handleToggleActive = async (eventItem: AdminEvent) => {
        const newStatus = (eventItem as any).is_active !== 0 && (eventItem as any).is_active !== false ? 0 : 1;
        try {
            const res = await apiFetch('events.php', {
                method: 'PUT',
                body: JSON.stringify({ id: eventItem.id, is_active: newStatus })
            });
            if (res.success) {
                toast.success(newStatus === 1 ? 'បានបើកដំណើការកម្មវិធី' : 'បានផ្អាកដំណើការកម្មវិធី');
                setEvents(prev => prev.map(e => e.id === eventItem.id ? { ...e, is_active: newStatus } : e));
            } else {
                toast.error(res.error || t('common.error'));
            }
        } catch {
            toast.error(t('common.error'));
        }
    };

    const filteredEvents = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase();
        const filtered = events.filter(event =>
            event.title?.toLowerCase().includes(normalizedSearch) ||
            event.userEmail?.toLowerCase().includes(normalizedSearch)
        );

        const getEventTime = (event: AdminEvent) => {
            const rawDate = event.date || event.startDate || event.createdAt || event.updatedAt;
            const timestamp = rawDate ? new Date(rawDate).getTime() : 0;
            return Number.isNaN(timestamp) ? 0 : timestamp;
        };

        return [...filtered].sort((a, b) => (
            sortOrder === 'newest'
                ? getEventTime(b) - getEventTime(a)
                : getEventTime(a) - getEventTime(b)
        ));
    }, [events, searchTerm, sortOrder]);

    return (
        <div className="space-y-6 mx-auto max-w-[1600px] p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t('admin.eventsPage.title')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.eventsPage.subtitle')}
                    </p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('admin.eventsPage.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#222] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sort</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                        className="px-3 py-2 text-sm bg-white dark:bg-[#161616] border border-gray-200 dark:border-[#222] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] dark:text-white font-medium"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
            </div>

            {/* Content Table & Mobile Cards */}
            <div className="bg-white dark:bg-[#161616] border border-gray-100 dark:border-[#222] rounded-2xl overflow-hidden shadow-sm">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-[#161616] text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium">{t('admin.table.eventName')}</th>
                                <th className="px-6 py-4 text-left font-medium">{t('admin.table.client')}</th>
                                <th className="px-6 py-4 text-left font-medium">{t('admin.table.date')}</th>
                                <th className="px-6 py-4 text-left font-medium">{t('admin.table.guests')}</th>
                                <th className="px-6 py-4 text-left font-medium">ស្ថានភាព (Status)</th>
                                <th className="px-6 py-4 text-right font-medium">{t('admin.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{t('common.loading')}</td>
                                </tr>
                            ) : filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{t('admin.eventsPage.noEvents')}</td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{event.title}</div>
                                            <div className="text-xs text-gray-500">{event.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {event.userEmail || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                                {event.guestCount || 0} {t('admin.table.guests')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleActive(event)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                    (event as any).is_active !== 0 && (event as any).is_active !== false
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                                        : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                                                }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${(event as any).is_active !== 0 && (event as any).is_active !== false ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                                {(event as any).is_active !== 0 && (event as any).is_active !== false ? 'Active (ដំណើការ)' : 'Inactive (ផ្អាក)'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link
                                                href={`/invite/${event.id}`}
                                                target="_blank"
                                                className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                                                title={t('admin.table.preview')}
                                            >
                                                <ExternalLink size={16} />
                                            </Link>
                                            <Link
                                                href={`/dashboard/event?id=${event.id}`}
                                                className="text-gray-400 hover:text-[#FFD700] dark:hover:text-yellow-400 transition p-2 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 rounded-lg"
                                                title={t('common.edit')}
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden divide-y divide-gray-100 dark:divide-[#222]">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">{t('admin.eventsPage.noEvents')}</div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div key={event.id} className="p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                        {event.guestCount || 0} {t('admin.table.guests')}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        <span>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <span className="text-xs">{event.userEmail || 'Unknown'}</span>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                    <Link
                                        href={`/invite/${event.id}`}
                                        target="_blank"
                                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <ExternalLink size={14} /> {t('admin.table.preview')}
                                    </Link>
                                    <Link
                                        href={`/dashboard/event?id=${event.id}`}
                                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#FFD700] dark:hover:text-yellow-400 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Edit size={14} /> {t('common.edit')}
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-500 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} /> {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
