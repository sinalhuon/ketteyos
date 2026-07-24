'use client';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { apiFetch } from '@/lib/api';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';
import { useToast } from '@/components/Toast';
import { Eye, Image as ImageIcon, Save, Settings as SettingsIcon, Crown } from 'lucide-react';

type LandingTemplateOption = {
    id: string;
    name: string;
    category?: string | null;
    previewUrl?: string | null;
    codeKey?: string | null;
};

type LandingEventOption = {
    id: string;
    title: string;
    slug?: string | null;
    shareImageUrl?: string | null;
    templateId?: string | null;
    date?: string | null;
};

const parseSelectedIds = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
    }
    if (typeof value !== 'string' || !value.trim()) {
        return [];
    }
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed.filter((item): item is string => typeof item === 'string' && item.length > 0)
            : [];
    } catch {
        return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
};

export default function LandingShowcaseManager() {
    const { toast } = useToast();
    const { settings, refreshSettings } = useAdminSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [landingTemplates, setLandingTemplates] = useState<LandingTemplateOption[]>([]);
    const [landingEvents, setLandingEvents] = useState<LandingEventOption[]>([]);
    const [selectedLandingTemplateIds, setSelectedLandingTemplateIds] = useState<string[]>([]);
    const [selectedLandingEventIds, setSelectedLandingEventIds] = useState<string[]>([]);

    useEffect(() => {
        setSelectedLandingTemplateIds(parseSelectedIds(settings.landingTemplateIds));
        setSelectedLandingEventIds(parseSelectedIds(settings.landingShowcaseEventIds));
    }, [settings.landingTemplateIds, settings.landingShowcaseEventIds]);

    useEffect(() => {
        const fetchLandingShowcaseOptions = async () => {
            try {
                const res = await apiFetch('admin.php?action=landing_showcase_options');
                if (res?.success) {
                    setLandingTemplates(Array.isArray(res.templates) ? res.templates : []);
                    setLandingEvents(Array.isArray(res.events) ? res.events : []);
                } else {
                    toast.error(res?.error || 'Failed to load landing showcase options');
                }
            } catch (error) {
                console.error('Failed to load landing showcase options', error);
                toast.error('Failed to load landing showcase options');
            } finally {
                setLoading(false);
            }
        };

        fetchLandingShowcaseOptions();
    }, [toast]);

    const toggleSelectedId = (
        id: string,
        setSelectedIds: Dispatch<SetStateAction<string[]>>
    ) => {
        setSelectedIds((prev) => (
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await apiFetch('admin.php?action=settings', {
                method: 'POST',
                body: JSON.stringify({
                    appName: settings.appName || 'Ketteyos',
                    appLogo: settings.appLogo || '',
                    appLogoDark: settings.appLogoDark || '',
                    mobileAppLogo: settings.mobileAppLogo || '',
                    mobileAppLogoDark: settings.mobileAppLogoDark || '',
                    favicon: settings.favicon || '',
                    facebookUrl: settings.facebookUrl || '',
                    tiktokUrl: settings.tiktokUrl || '',
                    youtubeUrl: settings.youtubeUrl || '',
                    telegramUrl: settings.telegramUrl || '',
                    contactEmail: settings.contactEmail || '',
                    contactPhone: settings.contactPhone || '',
                    contactTelegram: settings.contactTelegram || '',
                    contactWhatsApp: settings.contactWhatsApp || '',
                    contactWeChat: settings.contactWeChat || '',
                    telegramBotToken: settings.telegramBotToken || '',
                    telegramChatId: settings.telegramChatId || '',
                    googleAnalyticsId: settings.googleAnalyticsId || '',
                    bakongToken: settings.bakongToken || '',
                    bakongAccountId: settings.bakongAccountId || '',
                    bakongAccountName: settings.bakongAccountName || '',
                    bakongMerchantCity: settings.bakongMerchantCity || 'PHNOM PENH',
                    landingTemplateIds: selectedLandingTemplateIds,
                    landingShowcaseEventIds: selectedLandingEventIds,
                }),
            });

            if (res?.success) {
                await refreshSettings();
                toast.success('Landing showcase updated');
            } else {
                toast.error(res?.error || 'Failed to save landing showcase');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to save landing showcase');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Landing Showcase</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Choose exactly which templates and events appear on the public landing page.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-3 rounded-xl bg-[#d97706] text-white hover:bg-[#b45309] font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Showcase'}
                </button>
            </header>

            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                    <SettingsIcon size={20} className="text-[#FFD700]" /> Landing Page Showcase
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select only the templates and events you want to show on the landing page. If you uncheck everything in a section, that section will be hidden.
                </p>

                {loading ? (
                    <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading showcase options...</div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Landing Templates</h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedLandingTemplateIds.length} selected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {landingTemplates.map((template) => {
                                    const checked = selectedLandingTemplateIds.includes(template.id);
                                    return (
                                        <label
                                            key={template.id}
                                            className={`cursor-pointer rounded-xl border p-4 transition ${checked ? 'border-[#FFD700] bg-yellow-50 dark:bg-[#1a1400]' : 'border-gray-200 dark:border-[#2a2a2a] bg-gray-50/60 dark:bg-[#0a0a0a]'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleSelectedId(template.id, setSelectedLandingTemplateIds)}
                                                    className="mt-1 h-4 w-4 accent-[#FFD700]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/40 border border-gray-200 dark:border-[#222] mb-3">
                                                        {template.previewUrl ? (
                                                            <img src={template.previewUrl} alt={template.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{template.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {(template.category || 'Universal').toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Landing Events</h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {selectedLandingEventIds.length} selected
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {landingEvents.map((event) => {
                                    const checked = selectedLandingEventIds.includes(event.id);
                                    return (
                                        <label
                                            key={event.id}
                                            className={`cursor-pointer rounded-xl border p-4 transition ${checked ? 'border-[#FFD700] bg-yellow-50 dark:bg-[#1a1400]' : 'border-gray-200 dark:border-[#2a2a2a] bg-gray-50/60 dark:bg-[#0a0a0a]'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleSelectedId(event.id, setSelectedLandingEventIds)}
                                                    className="mt-1 h-4 w-4 accent-[#FFD700]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/40 border border-gray-200 dark:border-[#222] mb-3">
                                                        {event.shareImageUrl ? (
                                                            <img src={event.shareImageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                                <Crown size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                        {event.slug || event.date || 'Event'}
                                                    </p>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-dashed border-gray-200 dark:border-[#2a2a2a] p-4 text-sm text-gray-500 dark:text-gray-400 flex items-start gap-3">
                    <Eye className="w-4 h-4 mt-0.5 text-[#FFD700]" />
                    The landing page will now only show the items selected here. Unselected templates and events stay active in the system, but won’t appear on the public homepage.
                </div>
            </div>
        </div>
    );
}
