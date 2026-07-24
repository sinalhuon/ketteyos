'use client';

import { useEffect, useState, useRef } from 'react';
import { apiFetch, auth } from '@/lib/api';
import { Upload, Save, Building, Image as ImageIcon, Info, MessageCircle, CheckCircle2, ExternalLink, RefreshCw, QrCode } from 'lucide-react';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';

export default function Settings() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const { settings: globalSettings, refreshSettings } = useAdminSettings();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const darkLogoInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [appName, setAppName] = useState('');
    const [appLogo, setAppLogo] = useState('');
    const [appLogoDark, setAppLogoDark] = useState('');
    const [mobileAppLogo, setMobileAppLogo] = useState('');
    const [mobileAppLogoDark, setMobileAppLogoDark] = useState('');
    const [favicon, setFavicon] = useState('');
    const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');

    // Refs
    const mobileLogoInputRef = useRef<HTMLInputElement>(null);
    const mobileDarkLogoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    // Social Media Links
    const [facebookUrl, setFacebookUrl] = useState('');
    const [tiktokUrl, setTiktokUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [telegramUrl, setTelegramUrl] = useState('');

    // Contact Information
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactTelegram, setContactTelegram] = useState('');
    const [contactWhatsApp, setContactWhatsApp] = useState('');
    const [contactWeChat, setContactWeChat] = useState('');

    // Telegram Notification Settings
    const [telegramBotToken, setTelegramBotToken] = useState('');
    const [telegramChatId, setTelegramChatId] = useState('');
    const [telegramBotUsername, setTelegramBotUsername] = useState('');
    const [connectingTelegram, setConnectingTelegram] = useState(false);
    const [telegramStatus, setTelegramStatus] = useState<'disconnected' | 'waiting' | 'connected'>('disconnected');

    // Bakong KHQR Payment Settings
    const [bakongToken, setBakongToken] = useState('');
    const [bakongAccountId, setBakongAccountId] = useState('');
    const [bakongAccountName, setBakongAccountName] = useState('');
    const [bakongMerchantCity, setBakongMerchantCity] = useState('PHNOM PENH');

    useEffect(() => {
        if (globalSettings) {
            setAppName(globalSettings.appName || 'KETTEYOS');
            setAppLogo(globalSettings.appLogo || '');
            setAppLogoDark(globalSettings.appLogoDark || '');
            setMobileAppLogo(globalSettings.mobileAppLogo || '');
            setMobileAppLogoDark(globalSettings.mobileAppLogoDark || '');
            setFavicon(globalSettings.favicon || '');
            setFacebookUrl(globalSettings.facebookUrl || '');
            setTiktokUrl(globalSettings.tiktokUrl || '');
            setYoutubeUrl(globalSettings.youtubeUrl || '');
            setTelegramUrl(globalSettings.telegramUrl || '');
            setContactEmail(globalSettings.contactEmail || '');
            setContactPhone(globalSettings.contactPhone || '');
            setContactTelegram(globalSettings.contactTelegram || '');
            setContactWhatsApp(globalSettings.contactWhatsApp || '');
            setContactWeChat(globalSettings.contactWeChat || '');
            setTelegramBotToken(globalSettings.telegramBotToken || '');
            setTelegramChatId(globalSettings.telegramChatId || '');
            if (globalSettings.telegramChatId) {
                setTelegramStatus('connected');
            }
            setGoogleAnalyticsId(globalSettings.googleAnalyticsId || '');
            setBakongToken(globalSettings.bakongToken || '');
            setBakongAccountId(globalSettings.bakongAccountId || '');
            setBakongAccountName(globalSettings.bakongAccountName || '');
            setBakongMerchantCity(globalSettings.bakongMerchantCity || 'PHNOM PENH');
            setLoading(false);
        }
    }, [globalSettings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await apiFetch('admin.php?action=settings', {
                method: 'POST',
                body: JSON.stringify({
                    appName,
                    appLogo,
                    appLogoDark,
                    mobileAppLogo,
                    mobileAppLogoDark,
                    favicon,
                    facebookUrl,
                    tiktokUrl,
                    youtubeUrl,
                    telegramUrl,
                    contactEmail,
                    contactPhone,
                    contactTelegram,
                    contactWhatsApp,
                    contactWeChat,
                    telegramBotToken,
                    telegramChatId,
                    googleAnalyticsId,
                    bakongToken,
                    bakongAccountId,
                    bakongAccountName,
                    bakongMerchantCity,
                })
            });

            if (res.success) {
                await refreshSettings();
                toast.success(t('admin.settingsPage.saving'));
            } else {
                toast.error('Failed to save');
            }
        } catch (e) {
            toast.error('Error saving settings');
        }
        setSaving(false);
    };

    // --- Upload Handlers ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const genericUpload = async (file: File, onSuccess: (url: string) => void) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'image');

        try {
            const token = auth.getToken();
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
            const res = await fetch(`${API_BASE}/upload.php`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                onSuccess(data.url);
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(e);
            toast.error('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = (file: File) => genericUpload(file, (url) => setAppLogo(url));
    const handleDarkLogoUpload = (file: File) => genericUpload(file, (url) => setAppLogoDark(url));
    const handleMobileLogoUpload = (file: File) => genericUpload(file, (url) => setMobileAppLogo(url));
    const handleMobileDarkLogoUpload = (file: File) => genericUpload(file, (url) => setMobileAppLogoDark(url));
    const handleFaviconUpload = (file: File) => genericUpload(file, (url) => setFavicon(url));

    // --- Telegram Connect ---
    const handleConnectTelegram = async () => {
        setConnectingTelegram(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
            // Step 1: Setup the webhook and get bot username
            const res = await fetch(`${API_BASE}/telegram_webhook.php?action=setup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ botToken: telegramBotToken })
            });
            const data = await res.json();

            if (data.success && data.botUsername) {
                setTelegramBotUsername(data.botUsername);
                setTelegramStatus('waiting');
                // Step 2: Open the bot in Telegram
                window.open(`https://t.me/${data.botUsername}?start=connect`, '_blank');
            } else {
                toast.error('Failed to connect: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            console.error(e);
            toast.error('Error connecting to Telegram');
        } finally {
            setConnectingTelegram(false);
        }
    };

    const handleCheckConnection = async () => {
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
            const res = await fetch(`${API_BASE}/telegram_webhook.php?action=check`);
            const data = await res.json();

            if (data.connected && data.chatId) {
                setTelegramChatId(data.chatId);
                setTelegramStatus('connected');
                // Auto-save settings with new chat ID
                await apiFetch('admin.php?action=settings', {
                    method: 'POST',
                    body: JSON.stringify({
                        appName, appLogo, appLogoDark, mobileAppLogo, mobileAppLogoDark,
                        favicon, facebookUrl, tiktokUrl, youtubeUrl, telegramUrl,
                        contactEmail, contactPhone, contactTelegram, contactWhatsApp, contactWeChat,
                        telegramBotToken, telegramChatId: data.chatId,
                        googleAnalyticsId,
                        bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity,
                    })
                });
                await refreshSettings();
            } else {
                toast.warning('Not connected yet. Please send /start to the bot first.');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error checking connection');
        }
    };

    const handleDisconnectTelegram = async () => {
        setTelegramChatId('');
        setTelegramStatus('disconnected');
        // Save with empty chat ID
        await apiFetch('admin.php?action=settings', {
            method: 'POST',
            body: JSON.stringify({
                appName, appLogo, appLogoDark, mobileAppLogo, mobileAppLogoDark,
                favicon, facebookUrl, tiktokUrl, youtubeUrl, telegramUrl,
                contactEmail, contactPhone, contactTelegram, contactWhatsApp, contactWeChat,
                telegramBotToken, telegramChatId: '',
                googleAnalyticsId,
                bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity,
            })
        });
        await refreshSettings();
    };

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.settingsPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.settingsPage.subtitle')}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <Building size={20} className="text-gray-400" /> {t('admin.settingsPage.appInfo')}
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.appName')}</label>
                        <input
                            type="text"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                            placeholder={t('admin.settingsPage.appNamePlaceholder')}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">{t('admin.settingsPage.appNameDesc')}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 font-mono">{t('admin.settingsPage.googleAnalytics')}</label>
                        <input
                            type="text"
                            value={googleAnalyticsId}
                            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition font-mono text-sm"
                            placeholder={t('admin.settingsPage.googleAnalyticsPlaceholder')}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">{t('admin.settingsPage.googleAnalyticsDesc')}</p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-[#d97706] text-white hover:bg-[#b45309] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {saving ? t('admin.settingsPage.saving') : <><Save size={18} /> {t('admin.settingsPage.saveChanges')}</>}
                    </button>
                </div>

                {/* Logo Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <ImageIcon size={20} className="text-gray-400" /> {t('admin.settingsPage.appLogo')}
                    </h3>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gray-400 dark:hover:border-[#444] transition-colors cursor-pointer group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <div className="w-16 h-16 flex items-center justify-center mb-4">
                                <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                <Upload size={24} />
                            </div>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                            {uploading ? t('admin.settingsPage.uploading') : <>{t('admin.settingsPage.dragDrop')}</>}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">{t('admin.settingsPage.maxSize')}</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-[#1a1a1a]/50 p-4 rounded-lg border border-blue-100 dark:border-[#333]/50">
                        <div className="flex gap-3">
                            <div className="mt-0.5 text-blue-500 dark:text-blue-400"><Info size={16} /></div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                <p className="font-semibold">{t('admin.settingsPage.recommendedSize')}</p>
                                <p>{t('admin.settingsPage.sizeDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dark Mode Logo Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <ImageIcon size={20} className="text-gray-400" /> {t('admin.settingsPage.darkModeLogo')}
                    </h3>

                    <div
                        onClick={() => darkLogoInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gray-400 dark:hover:border-[#444] transition-colors cursor-pointer group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <div className="w-16 h-16 flex items-center justify-center mb-4">
                                <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                <Upload size={24} />
                            </div>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                            {uploading ? t('admin.settingsPage.uploading') : <>{t('admin.settingsPage.dragDrop')}</>}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">{t('admin.settingsPage.maxSize')}</p>
                    </div>

                    <input
                        ref={darkLogoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleDarkLogoUpload(file);
                        }}
                    />

                    {appLogoDark && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
                            <img src={appLogoDark} alt="Dark Logo Preview" className="w-12 h-12 object-contain" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{t('admin.settingsPage.currentDarkLogo')}</span>
                        </div>
                    )}

                    <div className="bg-blue-50 dark:bg-[#1a1a1a]/50 p-4 rounded-lg border border-blue-100 dark:border-[#333]/50">
                        <div className="flex gap-3">
                            <div className="mt-0.5 text-blue-500 dark:text-blue-400"><Info size={16} /></div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                <p className="font-semibold">{t('admin.settingsPage.darkModeDesc')}</p>
                                <p>{t('admin.settingsPage.sizeDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favicon Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <ImageIcon size={20} className="text-gray-400" /> {t('admin.settingsPage.favicon')}
                    </h3>

                    <div
                        onClick={() => faviconInputRef.current?.click()}
                        className={`border-2 border-dashed border-gray-300 dark:border-[#333] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-gray-400 dark:hover:border-[#444] transition-colors cursor-pointer group relative overflow-hidden h-48 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {favicon ? (
                            <div className="relative w-full h-full flex items-center justify-center group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors rounded-lg">
                                <img src={favicon} alt="Favicon" className="w-16 h-16 object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-lg">
                                    <div className="bg-white dark:bg-black p-2 rounded-full shadow-lg">
                                        <Upload size={20} className="text-gray-700 dark:text-gray-300" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {uploading ? (
                                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                                        <div className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                        <Upload size={24} />
                                    </div>
                                )}
                                <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                                    {uploading ? t('admin.settingsPage.uploading') : <>{t('admin.settingsPage.dragDrop')}</>}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-600">{t('admin.settingsPage.faviconSize')}</p>
                            </>
                        )}
                    </div>

                    <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFaviconUpload(file);
                        }}
                    />

                    <div className="bg-blue-50 dark:bg-[#1a1a1a]/50 p-4 rounded-lg border border-blue-100 dark:border-[#333]/50">
                        <div className="flex gap-3">
                            <div className="mt-0.5 text-blue-500 dark:text-blue-400"><Info size={16} /></div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                <p className="font-semibold">Recommended size:</p>
                                <p>32x32px or 64x64px. Supports ICO, PNG (max 1MB)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 lg:col-span-2 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <Info size={20} className="text-gray-400" /> {t('admin.settingsPage.socialMedia')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.facebook')}</label>
                            <input type="url" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="https://facebook.com/yourpage" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.tiktok')}</label>
                            <input type="url" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="https://tiktok.com/@yourprofile" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.youtube')}</label>
                            <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="https://youtube.com/@yourchannel" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.telegram')}</label>
                            <input type="url" value={telegramUrl} onChange={(e) => setTelegramUrl(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="https://t.me/yourchannel" />
                        </div>
                    </div>
                </div>

                {/* Telegram Notification Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 lg:col-span-2 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <MessageCircle size={20} className="text-[#0088cc]" /> {t('admin.settingsPage.telegramNotifications')}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('admin.settingsPage.telegramDesc')}
                    </p>

                    {telegramStatus === 'connected' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                                <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-green-700 dark:text-green-400">{t('admin.settingsPage.connected')}</p>
                                    <p className="text-sm text-green-600 dark:text-green-500">{t('admin.settingsPage.chatId')} {telegramChatId}</p>
                                </div>
                                <button
                                    onClick={handleDisconnectTelegram}
                                    className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    {t('admin.settingsPage.disconnect')}
                                </button>
                            </div>
                        </div>
                    ) : telegramStatus === 'waiting' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                                <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-amber-700 dark:text-amber-400">{t('admin.settingsPage.waitingConnection')}</p>
                                    <p className="text-sm text-amber-600 dark:text-amber-500">{t('admin.settingsPage.openBot')} <span className="font-mono bg-amber-100 dark:bg-amber-800/40 px-1.5 py-0.5 rounded">/start</span></p>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckConnection}
                                className="w-full bg-[#0088cc] text-white hover:bg-[#006699] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <RefreshCw size={18} /> {t('admin.settingsPage.checkConnection')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.botToken')}</label>
                                <input
                                    type="password"
                                    value={telegramBotToken}
                                    onChange={(e) => setTelegramBotToken(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] transition font-mono text-sm"
                                    placeholder={t('admin.settingsPage.botTokenPlaceholder')}
                                />
                                <p className="text-xs text-gray-500 mt-2">{t('admin.settingsPage.createBot')}</p>
                            </div>

                            <button
                                onClick={handleConnectTelegram}
                                disabled={!telegramBotToken || connectingTelegram}
                                className="w-full bg-[#0088cc] text-white hover:bg-[#006699] disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                {connectingTelegram ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        {t('admin.settingsPage.connecting')}
                                    </>
                                ) : (
                                    <>
                                        <MessageCircle size={18} />
                                        {t('admin.settingsPage.connectTelegram')}
                                        <ExternalLink size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Bakong KHQR Payment Settings */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 lg:col-span-2 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <QrCode size={20} className="text-red-500" /> Bakong KHQR Payment
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure Bakong KHQR so clients can pay for their plan automatically upon registration.
                        Get your API token from <a href="https://api-bakong.nbc.gov.kh" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">api-bakong.nbc.gov.kh</a>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bakong API Token</label>
                            <input
                                type="password"
                                value={bakongToken}
                                onChange={(e) => setBakongToken(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition font-mono text-sm"
                                placeholder="Bearer token from Bakong developer portal"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">Used to verify transactions via the Bakong API. Leave empty to disable auto-verification.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bakong Account ID</label>
                            <input
                                type="text"
                                value={bakongAccountId}
                                onChange={(e) => setBakongAccountId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition font-mono text-sm"
                                placeholder="e.g. yourname@wing or 012345678@aclb"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">Your Bakong account ID (appears in the QR code)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Merchant / Bank Name</label>
                            <input
                                type="text"
                                value={bakongAccountName}
                                onChange={(e) => setBakongAccountName(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition"
                                placeholder="e.g. KETTEYOS or your business name"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-600 mt-1">Shown to the payer on the QR screen (max 25 chars)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Merchant City</label>
                            <input
                                type="text"
                                value={bakongMerchantCity}
                                onChange={(e) => setBakongMerchantCity(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition"
                                placeholder="PHNOM PENH"
                            />
                        </div>
                    </div>

                    {bakongAccountId && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm text-green-700 dark:text-green-400">
                            <QrCode size={16} className="shrink-0" />
                            <span>KHQR configured — clients will see a payment QR when selecting a paid plan during registration.</span>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-red-600 text-white hover:bg-red-700 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {saving ? 'Saving...' : <><Save size={18} /> Save KHQR Settings</>}
                    </button>
                </div>

                {/* Contact Information */}
                <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 space-y-6 lg:col-span-2 shadow-sm dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-[#222] pb-4">
                        <Info size={20} className="text-gray-400" /> {t('admin.settingsPage.contactInfo')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.email')}</label>
                            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="contact@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.phone')}</label>
                            <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="+855 12 345 678" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.telegramUser')}</label>
                            <input type="text" value={contactTelegram} onChange={(e) => setContactTelegram(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="@yourusername" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.whatsapp')}</label>
                            <input type="tel" value={contactWhatsApp} onChange={(e) => setContactWhatsApp(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="+855 12 345 678" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('admin.settingsPage.wechat')}</label>
                            <input type="text" value={contactWeChat} onChange={(e) => setContactWeChat(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                                placeholder="your_wechat_id" />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-[#d97706] text-white hover:bg-[#b45309] font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {saving ? t('admin.settingsPage.saving') : <><Save size={18} /> {t('admin.settingsPage.saveAll')}</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
