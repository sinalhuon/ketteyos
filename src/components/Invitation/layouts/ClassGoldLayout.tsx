'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Calendar, Heart, GraduationCap } from 'lucide-react';
import { Playfair_Display, Lato } from 'next/font/google';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import GalleryAlbum from '../components/GalleryAlbum';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';

const moul = localFont({
    src: '../../../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-moul',
});

const playfair = Playfair_Display({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'] });

interface ClassGoldLayoutProps {
    guestName: string;
    eventTitle: string;
    eventDate: Date;
    location: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    backgroundImageUrl?: string | null;
    backgroundVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    invitationMessage?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
    venueDetails?: string | null;
    mapUrl?: string | null;
    schedule?: string | null;
    albumPhotos?: string[];
    albumVideos?: string[];
    templateConfig?: any;
    featureLimits?: {
        addToCalendar?: boolean;
        digitalWishes?: boolean;
        [key: string]: any;
    };
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    previewPage?: 'intro' | 'transition' | 'details';
}

export default function ClassGoldLayout(props: ClassGoldLayoutProps) {
    const {
        guestName,
        eventTitle,
        eventDate,
        location,
        musicUrl,
        logoUrl,
        backgroundImageUrl,
        backgroundVideoUrl,
        transitionVideoUrl,
        invitationMessage,
        groomFirstName,
        groomLastName,
        brideFirstName,
        brideLastName,
        groomFatherName,
        groomMotherName,
        brideFatherName,
        brideMotherName,
        venueDetails,
        mapUrl,
        schedule,
        albumPhotos = [],
        albumVideos = [],
        templateConfig,
        onRsvp
    } = props;

    const cs = templateConfig?.colorScheme || {
        primary: '#D4AF37',
        secondary: '#AA8439',
        accent: '#FFD700',
        background: '#000000',
        text: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        border: 'rgba(212, 175, 55, 0.3)',
        gradient: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)'
    };
    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);

    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [showFlash, setShowFlash] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (musicUrl && audioRef.current && phase !== 'intro') {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [musicUrl, phase]);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    const handleOpen = () => {
        setPhase('transition');
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        if (!transitionVideoUrl || !isVideoUrl(transitionVideoUrl)) {
            // No video transition (none or image): auto-advance after 4 seconds
            setTimeout(() => { handleTransitionEnd(); }, 4000);
        }
    };

    const handleTransitionEnd = () => {
        setShowFlash(true);
        setTimeout(() => {
            setPhase('details');
        }, 300);
        setTimeout(() => {
            setShowFlash(false);
        }, 1000);
    };

    const toggleMusic = () => {
        if (isPlaying) audioRef.current?.pause();
        else audioRef.current?.play();
        setIsPlaying(!isPlaying);
    };

    const dateStr = eventDate ? new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate)) : '';
    const timeStr = eventDate ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(eventDate)) : '';

    return (
        <main className={`relative min-h-screen overflow-x-hidden ${lato.className}`} style={{ backgroundColor: cs.background, color: cs.text }}>
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-7c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm20-46c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM10 52c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm58 48c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM99 2c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm-80 0c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm66 0c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zM44 0c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2zm-24 57c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm71 12c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-41 29c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-18-35c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-53-32c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm76-26c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM42 73c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-47c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM8 81c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm59-52c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 37c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-49 17c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm26-3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-5 28c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-40-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM3 31c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm7 51c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20-46c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm32 70c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm34-31c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM69 33c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM91 69c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM28 35c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 45c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-31c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM0 37c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm26 62c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm16-86c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm6 97c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm1-30c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm24-37c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-9-53c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-58 32c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm71 52c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-14-93c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM44 55c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm27-9c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm28 26c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-74-32c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm46 72c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm7-46c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM5 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm31 34c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm57 15c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-33-31c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM75 44c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-10 8c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-66 11c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm37-39c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM11 65c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm61 17c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM19 10c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM6 44c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM44 8c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm11 44c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm24 14c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-71-33c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm46 44c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm12 30c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm18-82c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM80 94c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM51 20c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-45 48c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM54 80c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM10 29c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm85 61c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM15 90c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm81-75c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-84 24c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm44 40c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-22 17c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM31 16c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm33 49c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-33 16c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm40-76c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-8 47c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-12 19c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm28 42c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-12-20c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm-31-45c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zm35-38c0-1.105.895-2 2-2s2 .895 2 2-.895 2-2 2-2-.895-2-2zM0 0c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 .895-2 2-2z' fill='%23D4AF37' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }} />

            {/* Background Image/Video Support or Premium Fallback */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {backgroundImageUrl ? (
                    <img src={backgroundImageUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : backgroundVideoUrl ? (
                    isVideoUrl(backgroundVideoUrl)
                        ? <video src={backgroundVideoUrl} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-1000 z-[-1]" />
                        : <img src={backgroundVideoUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : (
                    // Premium CSS Fallback Background
                    <div className="fixed inset-0 w-full h-full z-[-1]">
                        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at center, ${cs.secondary}20 0%, transparent 70%)` }} />
                        <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, ${cs.background} 0%, transparent 50%, ${cs.background} 100%)` }} />
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                    <motion.div key="intro" className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8" exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8 } }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center space-y-12 max-w-md w-full"
                        >
                            <div className="space-y-4">
                                <p className="text-xs tracking-[0.6em] uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.eventTitle : persona.inviteEyebrow}</p>
                                <div className="h-px w-12 mx-auto" style={{ background: cs.gradient }} />
                                <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: 'var(--font-playfair), serif', color: cs.primary }}>
                                    {persona.isBirthday ? persona.primaryFullName : (
                                        <>
                                            {groomLastName || groomFirstName}
                                            <span className="block text-xl font-normal my-2" style={{ color: cs.text }}>&</span>
                                            {brideLastName || brideFirstName}
                                        </>
                                    )}
                                </h2>
                            </div>

                            <div className="py-8 px-4 border-y" style={{ borderColor: cs.border }}>
                                <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: cs.textSecondary }}>Special Guest</p>
                                <div className="relative inline-block px-10 py-4">
                                    <div className="absolute inset-0 border border-double w-full h-full" style={{ borderColor: cs.primary, transform: 'scale(1.05)' }} />
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-wide" style={{ color: cs.primary, fontFamily: 'var(--font-playfair), serif' }}>
                                        {guestName || "Distinguished Guest"}
                                    </h1>
                                </div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                                onClick={handleOpen}
                                className="group relative px-12 py-4 overflow-hidden"
                            >
                                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ background: cs.gradient }} />
                                <span className="relative z-10 text-sm font-bold tracking-[0.2em] uppercase" style={{ color: cs.background }}>Open Invitation</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : phase === 'transition' ? (
                    <motion.div
                        key="transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black"
                    >
                        {transitionVideoUrl ? (
                            <div className="absolute inset-0 w-full h-full">
                                {isVideoUrl(transitionVideoUrl) ? (
                                    <video
                                        ref={transitionVideoRef}
                                        src={transitionVideoUrl}
                                        autoPlay
                                        muted
                                        playsInline
                                        onEnded={handleTransitionEnd}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <img src={transitionVideoUrl} className="absolute inset-0 w-full h-full object-cover" alt="transition" />
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 w-full h-full" style={{ background: `radial-gradient(circle at center, ${cs.secondary}44 0%, ${cs.background} 100%)` }} />
                        )}
                        <div className="absolute right-5 top-20 z-[80]">
                            <button
                                onClick={handleTransitionEnd}
                                className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.28em] backdrop-blur-md"
                                style={{ border: `1px solid ${cs.border}`, backgroundColor: `${cs.background}b8`, color: cs.text }}
                            >
                                {language === 'kh' ? 'រំលង' : 'Skip'}
                            </button>
                        </div>

                        {/* Class Gold Elegant Overlay */}
                        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none pb-12">
                            {/* Rich Dark Gradient Backdrop */}
                            <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-[1px] z-0" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                className="flex flex-col items-center space-y-12 relative z-50 w-full max-w-lg px-8 py-16 border border-double border-white/10"
                            >
                                {/* Decorative Ornaments */}
                                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/20" />
                                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/20" />
                                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/20" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/20" />

                                <div className="text-center space-y-6 w-full">
                                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.4em] text-white" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                                        Save the date
                                    </h2>

                                    <div className="flex items-center justify-center gap-4 w-full opacity-60">
                                        <div className="h-px flex-1 bg-white/20" />
                                        <span className="text-[10px] uppercase tracking-[0.3em]">{persona.isBirthday ? 'For the birthday of' : 'For the wedding of'}</span>
                                        <div className="h-px flex-1 bg-white/20" />
                                    </div>
                                </div>

                                <div className="text-center space-y-6 w-full">
                                    <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                                        {persona.isBirthday ? persona.primaryFullName : (
                                            <>
                                                {groomLastName || groomFirstName}
                                                <span className="block text-xl font-normal my-4 opacity-40">&</span>
                                                {brideLastName || brideFirstName}
                                            </>
                                        )}
                                    </h1>
                                </div>

                                <div className="text-center space-y-4 w-full border-t border-white/10 pt-8">
                                    <div className="text-xl md:text-2xl font-medium tracking-widest text-white/90">
                                        {dateStr}
                                    </div>
                                    {location && (
                                        <div className="text-xs md:text-sm tracking-[0.2em] uppercase text-white/60">
                                            {location}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10">
                        {/* Hero */}
                        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-10 pb-16 pt-24 space-y-6">
                            <div className="mb-2 h-20 flex items-center justify-center">
                                {logoUrl && (
                                    <img src={logoUrl} alt="Logo" className="w-20 h-20 mx-auto object-contain" />
                                )}
                            </div>
                            <div className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? `— ${labels.celebrationLabel} —` : '— Wedding Ceremony —'}</div>
                            <h1 className={`text-4xl md:text-5xl leading-tight ${playfair.className}`} style={{ color: cs.primary }}>
                                {persona.isBirthday ? persona.primaryFullName : (
                                    <>
                                        {groomLastName || groomFirstName}
                                        <span className="block text-2xl my-1" style={{ color: cs.textSecondary }}>&</span>
                                        {brideLastName || brideFirstName}
                                    </>
                                )}
                            </h1>
                            <div className="h-px w-20 mx-auto" style={{ backgroundColor: cs.primary }} />
                            <p className="text-sm font-medium tracking-widest" style={{ color: cs.textSecondary }}>{dateStr}</p>
                            {location && <p className="text-xs italic opacity-60" style={{ color: cs.textSecondary }}>{location}</p>}
                        </div>

                        {/* Content Grid */}
                        <div className="max-w-2xl mx-auto px-6 pb-16 space-y-12">
                            {invitationMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="text-center space-y-3 p-6 rounded-2xl"
                                    style={{ background: `${cs.primary}08`, border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Our Message</p>
                                    <p className="text-sm leading-relaxed italic font-light" style={{ color: cs.textSecondary }}>{invitationMessage}</p>
                                </motion.div>
                            )}

                            {/* Gallery Section */}
                            <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} />

                            {/* Family Section */}
                            {(groomFatherName || brideFatherName) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`grid gap-4 text-center ${persona.isBirthday ? 'grid-cols-1' : 'grid-cols-2'}`}
                                >
                                    <div className="p-4 rounded-xl space-y-1" style={{ background: `${cs.primary}08`, border: `1px solid ${cs.border}` }}>
                                        <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.familyTitle : "Groom's Family"}</p>
                                        <div className={`mb-2 ${moul.className}`}>
                                            <p className="text-base" style={{ color: cs.primary }}>{groomLastName || groomFirstName}</p>
                                            <p className="text-[10px] opacity-60" style={{ color: cs.primary }}>{groomLastName}</p>
                                        </div>
                                        {groomFatherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomFatherName}</p>}
                                        {groomMotherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomMotherName}</p>}
                                    </div>
                                    {!persona.isBirthday && (
                                        <div className="p-4 rounded-xl space-y-1" style={{ background: `${cs.primary}08`, border: `1px solid ${cs.border}` }}>
                                            <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Bride's Family</p>
                                            <div className={`mb-2 ${moul.className}`}>
                                                <p className="text-base" style={{ color: cs.primary }}>{brideLastName || brideFirstName}</p>
                                                <p className="text-[10px] opacity-60" style={{ color: cs.primary }}>{brideLastName}</p>
                                            </div>
                                            {brideFatherName && <p className="text-[10px]" style={{ color: cs.text }}>{brideFatherName}</p>}
                                            {brideMotherName && <p className="text-[10px]" style={{ color: cs.text }}>{brideMotherName}</p>}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {venueDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="text-center space-y-2 p-6 rounded-2xl"
                                    style={{ background: `${cs.primary}08`, border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Where Love Awaits</p>
                                    <p className="text-base font-light leading-relaxed" style={{ color: cs.text }}>{venueDetails}</p>
                                    {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase underline" style={{ color: cs.primary }}>Find Us</a>}
                                </motion.div>
                            )}

                            {/* RSVP */}
                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="text-center space-y-6"
                            >
                                <div className="h-px w-full" style={{ background: cs.gradient }} />
                                <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>— RSVP with Love —</p>
                                {!rsvpSent ? (
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={async () => { await onRsvp?.('ACCEPTED'); setRsvpSent(true); }} className="px-6 py-1.5 rounded-full text-xs font-medium shadow-lg hover:opacity-80 transition-opacity" style={{ background: cs.gradient, color: 'white' }}>Joyfully Accept</button>
                                        <button onClick={async () => { await onRsvp?.('DECLINED'); setRsvpSent(true); }} className="px-6 py-1.5 rounded-full text-xs font-medium hover:bg-white/10 transition-colors" style={{ border: `1px solid ${cs.border}`, color: cs.textSecondary }}>Regretfully Decline</button>
                                    </div>
                                ) : (
                                    <p className="text-xs italic" style={{ color: cs.primary }}>Thank you with all our hearts 🌸</p>
                                )}
                            </motion.div>
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </div >
                    </motion.div >
                )
                }
            </AnimatePresence >

            {/* Music Control */}
            {
                musicUrl && (
                    <button
                        onClick={toggleMusic}
                        className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md p-4 rounded-full border shadow-xl transition-all hover:scale-110"
                        style={{ borderColor: cs.border }}
                    >
                        {isPlaying ? <Volume2 size={24} style={{ color: cs.primary }} /> : <VolumeX size={24} style={{ color: cs.primary }} />}
                    </button>
                )
            }
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

            {/* GOLDEN FLASH TRANSITION */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        {/* 1. Base Flash Layer (White/Gold mix) */}
                        <div className="absolute inset-0 opacity-90" style={{ backgroundImage: `radial-gradient(circle, white, ${cs.primary}, white)` }} />

                        {/* 2. Moving Sheen/Bright Sweep */}
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rotate-12 scale-150 transform"
                        />

                        {/* 3. Central Burst */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,${cs.primary}80_50%,transparent_100%)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}
