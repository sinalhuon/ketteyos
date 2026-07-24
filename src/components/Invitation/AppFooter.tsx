'use client';

import { useEffect, useState } from 'react';
import { Facebook, Youtube, Send, Mail, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AppSettings {
    appName: string;
    appLogo: string | null;
    appLogoDark?: string | null;
    mobileAppLogo?: string | null;
    mobileAppLogoDark?: string | null;
    favicon?: string | null;
    facebookUrl?: string | null;
    tiktokUrl?: string | null;
    youtubeUrl?: string | null;
    telegramUrl?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactTelegram?: string | null;
    contactWhatsApp?: string | null;
    contactWeChat?: string | null;
}

interface AppFooterProps {
    colorScheme?: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        textSecondary: string;
        border: string;
        gradient?: string;
    };
}

const DEFAULT_COLOR = '#EEC573';

export default function AppFooter({ colorScheme }: AppFooterProps = {}) {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isDark, setIsDark] = useState(false);
    const { t } = useLanguage();

    const primary = colorScheme?.primary || DEFAULT_COLOR;
    const textSec = colorScheme?.text || colorScheme?.textSecondary || 'rgba(255,255,255,0.85)';
    const textFaint = colorScheme?.text || colorScheme?.textSecondary || (colorScheme ? `${colorScheme.primary}cc` : 'rgba(255,255,255,0.75)');
    const borderColor = colorScheme ? `${colorScheme.primary}15` : 'rgba(255,255,255,0.05)';
    const iconHoverBg = colorScheme ? `${colorScheme.primary}25` : 'rgba(238,197,115,0.2)';

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
                const res = await fetch(`${API_BASE}/settings.php`);
                const data = await res.json();
                if (data.success) setSettings(data.settings);
            } catch (error) {
                console.error('Failed to fetch app settings', error);
            }
        };
        fetchSettings();

        const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    if (!settings) return null;

    const hasSocialMedia = settings.facebookUrl || settings.tiktokUrl || settings.youtubeUrl || settings.telegramUrl;
    const hasContact = settings.contactEmail || settings.contactPhone || settings.contactTelegram || settings.contactWhatsApp || settings.contactWeChat;
    const currentLogo = isDark
        ? (settings.mobileAppLogoDark || settings.appLogoDark || settings.mobileAppLogo || settings.appLogo)
        : (settings.mobileAppLogo || settings.appLogo || settings.mobileAppLogoDark || settings.appLogoDark);

    if (!currentLogo && !settings.appName && !hasSocialMedia && !hasContact) return null;

    const socialBtnStyle = {
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: `1px solid ${primary}30`,
        transition: 'all 0.2s',
    };

    return (
        <div
            className="w-full py-12 px-4 mt-16 border-t"
            style={{
                background: `linear-gradient(to bottom, transparent, ${colorScheme?.background || '#000'}cc)`,
                borderColor: `${primary}25`,
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Decorative divider */}
                <div className="flex items-center gap-3 justify-center mb-2">
                    <div className="flex-1 h-[1px]" style={{ backgroundImage: `linear-gradient(to right, transparent, ${primary}60)` }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
                    <div className="flex-1 h-[1px]" style={{ backgroundImage: `linear-gradient(to left, transparent, ${primary}60)` }} />
                </div>

                <div
                    className="mx-auto max-w-2xl rounded-[28px] border px-6 py-6 text-center"
                    style={{
                        borderColor: `${primary}25`,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                    }}
                >
                    {currentLogo && (
                        <div className="flex items-center justify-center">
                            <img src={currentLogo} alt="Logo" className="h-24 w-24 object-contain drop-shadow-lg md:h-28 md:w-28" />
                        </div>
                    )}
                    <div className="mt-3 text-center text-sm md:text-base font-medium leading-relaxed px-2" style={{ fontFamily: 'Kantumruy Pro, sans-serif', color: textSec }}>
                        <p>{t('footer.interested')}</p>
                        <p className="mt-1 font-bold" style={{ color: primary }}>{t('footer.contactUs')}</p>
                    </div>
                </div>

                {/* Contact Information */}
                {hasContact && (
                    <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-[24px] border px-5 py-5 text-sm" style={{ color: textSec, borderColor: `${primary}18`, backgroundColor: 'rgba(255,255,255,0.03)' }}>
                        {settings.contactEmail && (
                            <a href={`mailto:${settings.contactEmail}`}
                                className="flex items-center gap-2 transition-colors"
                                style={{ color: textSec }}
                                onMouseEnter={e => e.currentTarget.style.color = primary}
                                onMouseLeave={e => e.currentTarget.style.color = textSec}>
                                <Mail className="w-4 h-4" />
                                <span>{settings.contactEmail}</span>
                            </a>
                        )}
                        {settings.contactPhone && (
                            <a href={`tel:${settings.contactPhone}`}
                                className="flex items-center gap-2 transition-colors"
                                style={{ color: textSec }}
                                onMouseEnter={e => e.currentTarget.style.color = primary}
                                onMouseLeave={e => e.currentTarget.style.color = textSec}>
                                <Phone className="w-4 h-4" />
                                <span>{settings.contactPhone}</span>
                            </a>
                        )}
                        {(settings.contactTelegram || settings.contactWhatsApp || settings.contactWeChat) && (
                            <div className="flex items-center gap-4 mt-1">
                                {settings.contactTelegram && (
                                    <a href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs transition-colors"
                                        style={{ color: textSec }}
                                        onMouseEnter={e => e.currentTarget.style.color = primary}
                                        onMouseLeave={e => e.currentTarget.style.color = textSec}>
                                        <Send className="w-3 h-3" />
                                        <span>{settings.contactTelegram}</span>
                                    </a>
                                )}
                                {settings.contactWhatsApp && (
                                    <a href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs transition-colors"
                                        style={{ color: textSec }}
                                        onMouseEnter={e => e.currentTarget.style.color = primary}
                                        onMouseLeave={e => e.currentTarget.style.color = textSec}>
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WhatsApp</span>
                                    </a>
                                )}
                                {settings.contactWeChat && (
                                    <span className="flex items-center gap-1 text-xs" style={{ color: textSec }}>
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WeChat: {settings.contactWeChat}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {hasSocialMedia && (
                    <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
                        {settings.facebookUrl && (
                            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={socialBtnStyle}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = iconHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                aria-label="Facebook">
                                <Facebook className="w-5 h-5" style={{ color: primary }} />
                            </a>
                        )}
                        {settings.tiktokUrl && (
                            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={socialBtnStyle}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = iconHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                aria-label="TikTok">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: primary }}>
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        )}
                        {settings.youtubeUrl && (
                            <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={socialBtnStyle}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = iconHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                aria-label="YouTube">
                                <Youtube className="w-5 h-5" style={{ color: primary }} />
                            </a>
                        )}
                        {settings.telegramUrl && (
                            <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                                style={socialBtnStyle}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = iconHoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                aria-label="Telegram">
                                <Send className="w-5 h-5" style={{ color: primary }} />
                            </a>
                        )}
                    </div>
                )}

                {/* Copyright */}
                <div className="text-center text-sm font-semibold leading-6 pt-4 border-t" style={{ color: textFaint, borderColor }}>
                    © {new Date().getFullYear()} {settings.appName}. {t('footer.copyright')}
                </div>
            </div>
        </div>
    );
}
