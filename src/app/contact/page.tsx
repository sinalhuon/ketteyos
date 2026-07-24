'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import {
    Mail, Phone, Send, MessageCircle,
    Facebook, Youtube, ChevronLeft,
    MessageSquare, ExternalLink, Globe
} from 'lucide-react';

// Simple TikTok Icon since Lucide doesn't have it
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export default function ContactPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await apiFetch('settings.php');
                if (data && data.success) {
                    setSettings(data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch settings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const socialLinks = [
        { id: 'facebook', icon: <Facebook size={24} />, label: 'Facebook', url: settings?.facebookUrl, color: 'bg-blue-600 hover:bg-blue-700' },
        { id: 'tiktok', icon: <TikTokIcon size={24} />, label: 'TikTok', url: settings?.tiktokUrl, color: 'bg-black hover:bg-gray-900' },
        { id: 'youtube', icon: <Youtube size={24} />, label: 'YouTube', url: settings?.youtubeUrl, color: 'bg-red-600 hover:bg-red-700' },
        { id: 'telegram', icon: <Send size={24} />, label: 'Telegram', url: settings?.telegramUrl, color: 'bg-sky-500 hover:bg-sky-600' },
    ].filter(link => link.url);

    const contactMethods = [
        { icon: <Mail className="text-yellow-600" />, label: 'Email', value: settings?.contactEmail, href: `mailto:${settings?.contactEmail}` },
        { icon: <Phone className="text-yellow-600" />, label: 'Phone', value: settings?.contactPhone, href: `tel:${settings?.contactPhone}` },
        { icon: <Send className="text-sky-500" />, label: 'Telegram', value: settings?.contactTelegram, href: `https://t.me/${settings?.contactTelegram?.replace('@', '')}` },
        { icon: <MessageCircle className="text-green-500" />, label: 'WhatsApp', value: settings?.contactWhatsApp, href: `https://wa.me/${settings?.contactWhatsApp?.replace(/[^0-9]/g, '')}` },
        { icon: <MessageSquare className="text-emerald-500" />, label: 'WeChat', value: settings?.contactWeChat, href: null },
    ].filter(method => method.value);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-yellow-200 dark:selection:bg-yellow-900/40">
            {/* Header */}
            <header className="border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-10 font-geist">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <ChevronLeft size={16} />
                        Back
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                        <Globe size={18} className="text-yellow-600 dark:text-yellow-500" />
                        Contact Us
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Left Side: Info */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Get in touch</h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-geist">
                                Have questions about our digital invitations? We're here to help you create the perfect experience for your special day.
                            </p>
                        </div>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-20 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {contactMethods.map((method, idx) => (
                                    method.href ? (
                                        <a
                                            key={idx}
                                            href={method.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                                                    {method.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{method.label}</p>
                                                    <p className="font-semibold group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors font-geist text-sm sm:text-base truncate break-all">{method.value}</p>
                                                </div>
                                            </div>
                                        </a>
                                    ) : (
                                        <div
                                            key={idx}
                                            className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-gray-100 dark:bg-white/5 rounded-xl">
                                                    {method.icon}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">{method.label}</p>
                                                    <p className="font-semibold font-geist text-sm sm:text-base truncate break-all">{method.value}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Social Media */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                            <h2 className="text-2xl font-bold mb-8">Follow Our Journey</h2>

                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-14 bg-gray-200 dark:bg-white/10 rounded-xl" />
                                    ))}
                                </div>
                            ) : socialLinks.length > 0 ? (
                                <div className="space-y-4">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.id}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-between p-4 ${social.color} text-white rounded-2xl transition-all duration-300 font-geist hover:shadow-lg active:scale-95`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {social.icon}
                                                <span className="font-bold tracking-wide uppercase">{social.label}</span>
                                            </div>
                                            <ExternalLink size={18} className="opacity-50" />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No social media links configured yet.</p>
                            )}

                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                                <p className="text-sm text-gray-400 mb-4">Want to partner with us?</p>
                                <a
                                    href={`mailto:${settings?.contactEmail || 'hello@ketteyos.com'}`}
                                    className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold hover:underline"
                                >
                                    Work with Ketteyos
                                    <ChevronLeft size={16} className="rotate-180" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                <footer className="mt-32 pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:justify-between items-center gap-6 text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} Ketteyos. Crafted with passion.</p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
