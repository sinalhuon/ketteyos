'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Globe2, ImageIcon, Languages, MapPin, Music4, Sparkles } from 'lucide-react';

type Lang = 'kh' | 'en' | 'zh';

const copy: Record<Lang, any> = {
    kh: {
        navLabel: 'គេហទំព័រថ្មី',
        heroPill: 'ធៀបឌីជីថលទាន់សម័យ ស្អាត និងងាយប្រើ',
        title1: 'បង្កើតធៀបអញ្ជើញ',
        title2: 'ឌីជីថលដែលស្អាត សាមញ្ញ និងទំនើប',
        subtitle: 'សម្រាប់មង្គលការ ខួបកំណើត ពិធីកាត់ចំណងដៃ និងកម្មវិធីផ្សេងៗ។ ចែករំលែកបានលឿន គ្រប់គ្រងភ្ញៀវបានងាយ និងមើលស្អាតលើទូរស័ព្ទ។',
        primaryCta: 'ចាប់ផ្តើម',
        secondaryCta: 'មើលគំរូ',
        featuresBadge: 'មុខងារសំខាន់',
        featuresTitle: 'អ្វីដែលកម្មវិធីយើងផ្តល់ជូន',
        featuresSubtitle: 'ផ្តោតលើអ្វីដែលមានប្រយោជន៍ពិតៗ សម្រាប់ម្ចាស់កម្មវិធី និងភ្ញៀវ',
        feature1Title: 'គំរូស្អាតៗ',
        feature1Desc: 'ជ្រើសរើស layout ទំនើប និងអាចប្រើបានច្រើនប្រភេទកម្មវិធី',
        feature2Title: 'គ្រប់គ្រងភ្ញៀវ',
        feature2Desc: 'មាន RSVP, guest list, QR និង digital wishes',
        feature3Title: 'មេឌៀពេញលេញ',
        feature3Desc: 'គាំទ្ររូបភាព វីដេអូ តន្ត្រី ផែនទី និង story telling',
        feature4Title: 'ចែករំលែកងាយ',
        feature4Desc: 'បើកល្អលើទូរស័ព្ទ និងចែកតាម Messenger, Telegram, Facebook បានរហ័ស',
        stepsBadge: 'លំហូរការងារ',
        stepsTitle: 'សាមញ្ញ តែមានប្រសិទ្ធភាព',
        step1: 'បង្កើតកម្មវិធី និងបំពេញព័ត៌មានសំខាន់ៗ',
        step2: 'ជ្រើស template, media និងកែសម្រួលរចនា',
        step3: 'ចែក link ទៅភ្ញៀវ ហើយតាមដានការឆ្លើយតប',
        langLabel: 'ភាសា',
        footerTitle: 'Landing ថ្មីសម្រាប់សាកល្បង',
        footerDesc: 'ទំព័រនេះជាទំព័រថ្មី ដាច់ដោយឡែកពី landing page ចាស់',
    },
    en: {
        navLabel: 'New Landing',
        heroPill: 'Modern digital invitations that feel premium and easy to use',
        title1: 'Create invitations',
        title2: 'that are clean, modern, and useful',
        subtitle: 'For weddings, birthdays, engagements, and more. Share instantly, manage guests easily, and deliver a polished mobile-first experience.',
        primaryCta: 'Get Started',
        secondaryCta: 'View Templates',
        featuresBadge: 'Core Features',
        featuresTitle: 'Built for real event workflows',
        featuresSubtitle: 'Only the parts that matter most for hosts and guests',
        feature1Title: 'Beautiful Templates',
        feature1Desc: 'Modern layouts that can work across multiple event types',
        feature2Title: 'Guest Management',
        feature2Desc: 'RSVP, guest list, QR, and digital wishes in one place',
        feature3Title: 'Rich Media',
        feature3Desc: 'Photos, videos, music, maps, and story telling support',
        feature4Title: 'Easy Sharing',
        feature4Desc: 'Fast to open on mobile and easy to send through social apps',
        stepsBadge: 'Simple Flow',
        stepsTitle: 'Minimal, but practical',
        step1: 'Create your event and fill in the important details',
        step2: 'Choose a template, media, and customize the look',
        step3: 'Share the link and track guest responses',
        langLabel: 'Language',
        footerTitle: 'New demo landing page',
        footerDesc: 'This page is separate from the current main landing page',
    },
    zh: {
        navLabel: '新主页',
        heroPill: '现代、简洁、实用的电子邀请函体验',
        title1: '创建邀请函',
        title2: '更简洁、更现代、更好用',
        subtitle: '适用于婚礼、生日、订婚和更多活动。可快速分享、轻松管理宾客，并在手机上拥有出色体验。',
        primaryCta: '开始使用',
        secondaryCta: '查看模板',
        featuresBadge: '核心功能',
        featuresTitle: '为真实活动流程而设计',
        featuresSubtitle: '只保留真正有用的信息与功能',
        feature1Title: '精美模板',
        feature1Desc: '现代布局，可适用于多种活动类型',
        feature2Title: '宾客管理',
        feature2Desc: '集成 RSVP、宾客名单、二维码和祝福留言',
        feature3Title: '丰富媒体',
        feature3Desc: '支持图片、视频、音乐、地图和故事展示',
        feature4Title: '轻松分享',
        feature4Desc: '手机打开快速，方便通过社交软件分享',
        stepsBadge: '使用流程',
        stepsTitle: '简洁，但很实用',
        step1: '创建活动并填写重要信息',
        step2: '选择模板、媒体内容并调整设计',
        step3: '分享链接并跟踪宾客回复',
        langLabel: '语言',
        footerTitle: '新的演示着陆页',
        footerDesc: '这个页面与当前主着陆页分开保留',
    },
};

export default function MinimalLandingPage() {
    const [language, setLanguage] = useState<Lang>('kh');
    const [appLogo, setAppLogo] = useState<string | null>(null);
    const text = copy[language];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
                const res = await fetch(`${API_BASE}/settings.php`);
                const data = await res.json();
                if (data?.success?.toString() && data.settings?.appLogo) {
                    setAppLogo(data.settings.appLogo);
                }
            } catch {
                // keep fallback
            }
        };
        fetchSettings();
    }, []);

    const features = useMemo(() => ([
        { icon: ImageIcon, title: text.feature1Title, desc: text.feature1Desc },
        { icon: CalendarDays, title: text.feature2Title, desc: text.feature2Desc },
        { icon: Music4, title: text.feature3Title, desc: text.feature3Desc },
        { icon: Globe2, title: text.feature4Title, desc: text.feature4Desc },
    ]), [text]);

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_70%_30%,rgba(250,204,21,0.08),transparent_22%)]" />

            <div className="relative z-10 mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
                <header className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/25 bg-black/40 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
                            {appLogo ? (
                                <img src={appLogo} alt="Ketteyos" className="h-9 w-9 object-contain" />
                            ) : (
                                <Sparkles className="h-5 w-5 text-yellow-400" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-lg font-semibold tracking-[0.04em] text-yellow-400">KETTEYOS</p>
                            <p className="text-xs text-white/50">{text.navLabel}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                        {(['kh', 'en', 'zh'] as Lang[]).map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setLanguage(lang)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === lang ? 'bg-yellow-400 text-black' : 'text-white/70 hover:text-white'}`}
                            >
                                {lang === 'kh' ? 'KH' : lang === 'en' ? 'EN' : '中'}
                            </button>
                        ))}
                    </div>
                </header>

                <section className="mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center py-16 text-center sm:py-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/8 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-yellow-400">
                        <Languages className="h-3.5 w-3.5" />
                        <span>{text.heroPill}</span>
                    </div>

                    <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-[30px] border border-yellow-500/20 bg-black/35 shadow-[0_0_80px_rgba(234,179,8,0.12)]">
                        {appLogo ? (
                            <img src={appLogo} alt="Ketteyos logo" className="h-20 w-20 object-contain" />
                        ) : (
                            <Sparkles className="h-8 w-8 text-yellow-400" />
                        )}
                    </div>

                    <h1 className="mt-10 max-w-4xl text-4xl font-semibold leading-[1.25] sm:text-5xl lg:text-6xl">
                        <span className="text-white">{text.title1} </span>
                        <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent">{text.title2}</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                        {text.subtitle}
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-7 py-4 text-base font-bold text-black shadow-[0_10px_40px_rgba(234,179,8,0.24)] transition hover:translate-y-[-1px]"
                        >
                            <span>{text.primaryCta}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/#templates-demo"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-base font-medium text-white/85 transition hover:bg-white/[0.08]"
                        >
                            <span>{text.secondaryCta}</span>
                        </Link>
                    </div>
                </section>

                <section className="mx-auto max-w-5xl py-8">
                    <div className="mb-8 text-center">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">{text.featuresBadge}</p>
                        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{text.featuresTitle}</h2>
                        <p className="mt-3 text-white/60">{text.featuresSubtitle}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {features.map((feature) => (
                            <div key={feature.title} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                                    <feature.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-white/60">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mx-auto grid max-w-5xl gap-4 py-10 md:grid-cols-3">
                    {[text.step1, text.step2, text.step3].map((step, index) => (
                        <div key={step} className="rounded-[26px] border border-white/10 bg-black/30 p-6">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                                {index + 1}
                            </div>
                            <p className="text-sm leading-7 text-white/75">{step}</p>
                        </div>
                    ))}
                </section>

                <section className="mx-auto max-w-5xl py-10">
                    <div className="rounded-[32px] border border-yellow-500/18 bg-gradient-to-br from-yellow-500/10 to-white/[0.03] px-6 py-8 text-center sm:px-10 sm:py-10">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/12 text-yellow-400">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-semibold sm:text-3xl">{text.footerTitle}</h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                            {text.footerDesc}
                        </p>
                        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Link href="/" className="rounded-2xl border border-white/12 px-6 py-3 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]">
                                Current Landing
                            </Link>
                            <Link href="/contact" className="rounded-2xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-yellow-300">
                                {text.primaryCta}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
