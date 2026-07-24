'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { EventEditor } from './client-editor';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

type FeatureLimits = {
    maxLanguages: number;
    smartRsvp: boolean;
    digitalWishes: boolean;
    customMusic: boolean;
    embedVideo: boolean;
    premiumAnimations: boolean;
    addToCalendar: boolean;
    customDesign: boolean;
    customDomain: boolean;
    qrCheckin: boolean;
    vipSupport: boolean;
};

const defaultFeatureLimits: FeatureLimits = {
    maxLanguages: 1,
    smartRsvp: false,
    digitalWishes: false,
    customMusic: false,
    embedVideo: false,
    premiumAnimations: false,
    addToCalendar: false,
    customDesign: false,
    customDomain: false,
    qrCheckin: false,
    vipSupport: false,
};

export default function EventEditorPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [event, setEvent] = useState<any>(null);
    const [templates, setTemplates] = useState<any[]>([]);
    const [globalMusic, setGlobalMusic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { user, loading: authLoading } = useAuth();
    const [maxLanguages, setMaxLanguages] = useState<number>(1);
    const [featureLimits, setFeatureLimits] = useState<FeatureLimits>(defaultFeatureLimits);

    const { t } = useLanguage();

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (!id) return;

        const fetchData = async () => {
            try {
                if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.isSuperAdmin) {
                    setMaxLanguages(99);
                    setFeatureLimits({
                        ...defaultFeatureLimits,
                        maxLanguages: 99,
                        smartRsvp: true,
                        digitalWishes: true,
                        customMusic: true,
                        embedVideo: true,
                        premiumAnimations: true,
                        addToCalendar: true,
                        customDesign: true,
                        customDomain: true,
                        qrCheckin: true,
                        vipSupport: true,
                    });
                } else if ((user as any)?.limits?.maxLanguages) {
                    const limits = { ...defaultFeatureLimits, ...((user as any).limits || {}) } as FeatureLimits;
                    setMaxLanguages(Number(limits.maxLanguages || 1));
                    setFeatureLimits(limits);
                } else {
                    const profileData = await apiFetch('profile.php');
                    const fetchedLimits = { ...defaultFeatureLimits, ...(profileData?.user?.limits || {}) } as FeatureLimits;
                    const fetchedMaxLanguages = Number(fetchedLimits.maxLanguages || 1);
                    setMaxLanguages(fetchedMaxLanguages);
                    setFeatureLimits(fetchedLimits);
                }

                // Fetch Event
                const eventData = await apiFetch(`events.php?id=${id}`);
                if (!eventData?.success || !eventData.event) {
                    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.isSuperAdmin) {
                        router.push('/admin/dashboard');
                    } else {
                        router.push('/dashboard');
                    }
                    return;
                }

                // Fetch Guests
                const guestsData = await apiFetch(`guests.php?eventId=${id}`);
                const guests = guestsData?.success ? guestsData.guests : [];

                // Fetch Templates
                const templatesData = await apiFetch('templates.php');
                const templates = templatesData?.success ? templatesData.templates : [];
                setTemplates(templates);

                // Fetch shared music library for client event editor
                const musicData = await apiFetch('assets.php?type=MUSIC');
                const musicAssets = musicData?.success ? musicData.assets : [];
                setGlobalMusic(musicAssets);

                setEvent({ ...eventData.event, guests });

            } catch (e) {
                console.error('Error fetching event data', e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, authLoading, id, router]);

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-black md:bg-gradient-to-br md:from-gray-50 md:via-yellow-50/30 md:to-gray-100 md:dark:bg-gradient-to-br md:dark:from-gray-950 md:dark:via-gray-900 md:dark:to-gray-950 pb-20 md:pb-0">
            <div className="mx-auto max-w-[1700px] p-3 md:p-8">
                <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4 px-1 md:px-0">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 md:mb-2">{event.title}</h1>
                        <p className="text-xs md:text-base text-gray-500 dark:text-gray-400">{t('client.dashboard.manage')}</p>
                    </div>
                    <a href={`/invite/${event.id}`} target="_blank" className="w-full md:w-auto text-center bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition">
                        {t('client.dashboard.preview')}
                    </a>
                </header>

                <EventEditor
                    event={event}
                    templates={templates}
                    globalMusic={globalMusic}
                    guests={event.guests || []}
                    canUseMultipleLanguages={maxLanguages >= 2}
                    maxLanguages={maxLanguages}
                    featureLimits={featureLimits}
                />
            </div>
        </div>
    );
}
