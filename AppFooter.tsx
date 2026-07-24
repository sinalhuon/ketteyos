'use client';

import { useEffect, useState } from 'react';
import { Facebook, Youtube, Send, Mail, Phone, MessageCircle } from 'lucide-react';

interface AppSettings {
    appName: string;
    appLogo: string | null;
    appLogoDark?: string | null;
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

export default function AppFooter() {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
                const res = await fetch(`${API_BASE}/settings.php`);
                const data = await res.json();
                if (data.success) {
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch app settings', error);
            }
        };
        fetchSettings();

        // Detect theme
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();

        // Watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    if (!settings) return null;

    const hasSocialMedia = settings.facebookUrl || settings.tiktokUrl || settings.youtubeUrl || settings.telegramUrl;
    const hasContact = settings.contactEmail || settings.contactPhone || settings.contactTelegram || settings.contactWhatsApp || settings.contactWeChat;

    if (!hasSocialMedia && !hasContact) return null;

    // Choose logo based on theme
    const currentLogo = isDark && settings.appLogoDark ? settings.appLogoDark : settings.appLogo;

    return (
        <div className="w-full bg-gradient-to-b from-transparent via-black/40 to-black/60 backdrop-blur-sm py-12 px-4 mt-16 border-t border-white/10">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* App Logo Only - Bigger Size */}
                {currentLogo && (
                    <div className="flex items-center justify-center">
                        <img
                            src={currentLogo}
                            alt="Logo"
                            className="w-32 h-32 object-contain"
                        />
                    </div>
                )}

                {/* CTA Text */}
                <div className="text-center text-white/90 text-sm md:text-base font-medium leading-relaxed px-4" style={{ fontFamily: 'Kantumruy Pro, sans-serif' }}>
                    <p>តើលោកអ្នកចាប់អារម្មណ៍ លិខិតអញ្ជើញអេឡិចត្រូនិច សម្រាប់កម្មវិធីរបស់លោកអ្នកដែរឬទេ?</p>
                    <p className="mt-1 font-bold text-[#EEC573]">ទាក់ទងមកកាន់ពួកយើងឥឡូវនេះ</p>
                </div>

                {/* Social Media Links */}
                {hasSocialMedia && (
                    <div className="flex items-center justify-center gap-4 flex-wrap pt-2">
                        {settings.facebookUrl && (
                            <a
                                href={settings.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#EEC573]/20 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-6 h-6 text-[#EEC573]" />
                            </a>
                        )}
                        {settings.tiktokUrl && (
                            <a
                                href={settings.tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#EEC573]/20 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="TikTok"
                            >
                                <svg className="w-6 h-6 text-[#EEC573]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        )}
                        {settings.youtubeUrl && (
                            <a
                                href={settings.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#EEC573]/20 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-6 h-6 text-[#EEC573]" />
                            </a>
                        )}
                        {settings.telegramUrl && (
                            <a
                                href={settings.telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#EEC573]/20 flex items-center justify-center transition-all hover:scale-110"
                                aria-label="Telegram"
                            >
                                <Send className="w-6 h-6 text-[#EEC573]" />
                            </a>
                        )}
                    </div>
                )}

                {/* Contact Information */}
                {hasContact && (
                    <div className="flex flex-col items-center gap-3 text-sm text-white/70">
                        {settings.contactEmail && (
                            <a
                                href={`mailto:${settings.contactEmail}`}
                                className="flex items-center gap-2 hover:text-[#EEC573] transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span>{settings.contactEmail}</span>
                            </a>
                        )}
                        {settings.contactPhone && (
                            <a
                                href={`tel:${settings.contactPhone}`}
                                className="flex items-center gap-2 hover:text-[#EEC573] transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                <span>{settings.contactPhone}</span>
                            </a>
                        )}
                        {(settings.contactTelegram || settings.contactWhatsApp || settings.contactWeChat) && (
                            <div className="flex items-center gap-4 mt-2">
                                {settings.contactTelegram && (
                                    <a
                                        href={`https://t.me/${settings.contactTelegram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs hover:text-[#EEC573] transition-colors"
                                    >
                                        <Send className="w-3 h-3" />
                                        <span>{settings.contactTelegram}</span>
                                    </a>
                                )}
                                {settings.contactWhatsApp && (
                                    <a
                                        href={`https://wa.me/${settings.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs hover:text-[#EEC573] transition-colors"
                                    >
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WhatsApp</span>
                                    </a>
                                )}
                                {settings.contactWeChat && (
                                    <span className="flex items-center gap-1 text-xs">
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WeChat: {settings.contactWeChat}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Copyright */}
                <div className="text-center text-xs text-white/50 pt-4 border-t border-white/5">
                    © {new Date().getFullYear()} {settings.appName}. All rights reserved.
                </div>
            </div>
        </div>
    );
}
