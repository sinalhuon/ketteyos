'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface AdminSettings {
    appName: string;
    appLogo: string | null;
    appLogoDark?: string | null;
    favicon?: string | null;
    mobileAppLogo?: string | null;
    mobileAppLogoDark?: string | null;
    facebookUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
    telegramUrl?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactTelegram?: string | null;
    contactWhatsApp?: string | null;
    contactWeChat?: string | null;
    telegramBotToken?: string | null;
    telegramChatId?: string | null;
    googleAnalyticsId?: string | null;
    bakongToken?: string | null;
    bakongAccountId?: string | null;
    bakongAccountName?: string | null;
    bakongMerchantCity?: string | null;
    landingTemplateIds?: string[] | string | null;
    landingShowcaseEventIds?: string[] | string | null;
}

interface AdminSettingsContextType {
    settings: AdminSettings;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export function AdminSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AdminSettings>({
        appName: 'Ketteyos',
        appLogo: null
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const data = await apiFetch('settings.php');
            if (data && data.success) {
                setSettings({
                    appName: data.settings.appName || 'Ketteyos',
                    appLogo: data.settings.appLogo || null,
                    appLogoDark: data.settings.appLogoDark || null,
                    favicon: data.settings.favicon || null,
                    facebookUrl: data.settings.facebookUrl || null,
                    tiktokUrl: data.settings.tiktokUrl || null,
                    youtubeUrl: data.settings.youtubeUrl || null,
                    telegramUrl: data.settings.telegramUrl || null,
                    contactEmail: data.settings.contactEmail || null,
                    contactPhone: data.settings.contactPhone || null,
                    contactTelegram: data.settings.contactTelegram || null,
                    contactWhatsApp: data.settings.contactWhatsApp || null,
                    contactWeChat: data.settings.contactWeChat || null,
                    telegramBotToken: data.settings.telegramBotToken || null,
                    telegramChatId: data.settings.telegramChatId || null,
                    googleAnalyticsId: data.settings.googleAnalyticsId || null,
                    bakongToken: data.settings.bakongToken || null,
                    bakongAccountId: data.settings.bakongAccountId || null,
                    bakongAccountName: data.settings.bakongAccountName || null,
                    bakongMerchantCity: data.settings.bakongMerchantCity || null,
                    landingTemplateIds: data.settings.landingTemplateIds || null,
                    landingShowcaseEventIds: data.settings.landingShowcaseEventIds || null,
                });
            }
        } catch (error) {
            console.error('Failed to fetch admin settings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <AdminSettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </AdminSettingsContext.Provider>
    );
}

export function useAdminSettings() {
    const context = useContext(AdminSettingsContext);
    if (context === undefined) {
        throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
    }
    return context;
}
