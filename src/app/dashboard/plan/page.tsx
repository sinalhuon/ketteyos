'use client';

import { useEffect, useState } from 'react';
import { BASE_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Tag, CheckCircle, MessageCircle, Lock } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    nameEn?: string;
    price: string;
    currency: string;
    period: string;
    duration: number;
    description?: string;
    descriptionEn?: string;
    isPopular?: boolean;
    features?: { text: string; textEn?: string; included: boolean }[];
    limits?: { maxEvents?: number; maxPhotos?: number; [key: string]: any };
}

export default function PlanPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { t, language } = useLanguage();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
            router.push('/admin/dashboard');
            return;
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${BASE_URL}/public_pricing.php`);
                const data = await res.json();
                if (data?.success && Array.isArray(data.plans)) {
                    setPlans(data.plans);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
            </div>
        );
    }

    const currentPlan = user?.plan;
    const currentPlanId = user?.planId;
    const limits = user?.limits || {};

    // Contact link — adjust to your actual support channel
    const contactHref = 'https://t.me/ketteyos';

    const isUnlimited = (v?: number) => v === -1 || v === 9999 || v === 999;

    return (
        <div className="mx-auto max-w-[1400px] p-6 lg:p-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Tag className="text-yellow-500" size={28} />
                    {t('client.planPage.title')}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {t('client.planPage.subtitle')}
                </p>
            </div>

            {/* Contact-admin notice */}
            <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-sm text-blue-700 dark:text-blue-300">
                <MessageCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                    {t('client.planPage.contactNotice')}{' '}
                    <a
                        href={contactHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-semibold hover:text-blue-900 dark:hover:text-blue-100"
                    >
                        {t('client.planPage.contactSupport')}
                    </a>
                </span>
            </div>

            {currentPlan && (
                <div className="mb-8 p-6 rounded-xl border border-yellow-200 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/5">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-2">{t('client.planPage.currentPlan')}</h2>
                    <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                        {currentPlan.nameEn || currentPlan.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {isUnlimited(limits.maxEvents as number)
                            ? t('client.planPage.unlimitedEvents')
                            : `${limits.maxEvents ?? 1} ${t('client.planPage.event')}${(limits.maxEvents ?? 1) !== 1 ? t('client.planPage.events') : ''}`}
                        {' · '}
                        {isUnlimited(limits.maxPhotos as number)
                            ? t('client.planPage.unlimitedPhotos')
                            : `${limits.maxPhotos ?? 5} ${t('client.planPage.photosPerEvent')}`}
                    </p>
                </div>
            )}

            {!currentPlan && (
                <div className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111]">
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('client.planPage.noPlanYet')}
                    </p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500" />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {plans.map((plan) => {
                        const isCurrent = plan.id === currentPlanId;
                        const maxEv = plan.limits?.maxEvents;
                        const maxPh = plan.limits?.maxPhotos;
                        return (
                            <div
                                key={plan.id}
                                className={`p-6 rounded-xl border transition ${
                                    isCurrent
                                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 dark:border-yellow-500/50'
                                        : 'border-gray-200 dark:border-[#333] bg-white dark:bg-[#111] opacity-70'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {plan.nameEn || plan.name}
                                        </h3>
                                        <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400 mt-1">
                                            {plan.currency}{plan.price}
                                            {plan.period !== 'one-time' && (
                                                <span className="text-sm font-normal text-gray-500">
                                                    /{plan.duration} {plan.period}{(plan.duration ?? 1) > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {isCurrent ? (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                                            <CheckCircle size={12} /> {t('client.planPage.current')}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                                            <Lock size={11} /> {t('client.planPage.locked')}
                                        </span>
                                    )}
                                </div>

                                {/* Limit badges */}
                                {plan.limits && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            {isUnlimited(maxEv) ? '∞' : `${maxEv}`} {isUnlimited(maxEv) ? t('client.planPage.events') : `${maxEv !== 1 ? t('client.planPage.events') : t('client.planPage.event')}`}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            {isUnlimited(maxPh) ? '∞' : `${maxPh}`} {t('client.planPage.photosPerEvent')}
                                        </span>
                                    </div>
                                )}

                                {plan.features && plan.features.filter(f => f.included).length > 0 && (
                                    <ul className="space-y-2 mb-4">
                                        {plan.features.filter(f => f.included).slice(0, 4).map((f, i) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <CheckCircle size={14} className="shrink-0 text-green-500 mt-0.5" />
                                                {(language === 'kh' && f.text) || (language === 'en' && f.textEn) || f.textEn || f.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Contact to upgrade (instead of self-service upgrade button) */}
                                {!isCurrent && (
                                    <a
                                        href={contactHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 dark:border-[#444] text-gray-500 dark:text-gray-400 hover:border-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium text-sm transition"
                                    >
                                        <MessageCircle size={14} />
                                        {t('client.planPage.contactToUpgrade')}
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
