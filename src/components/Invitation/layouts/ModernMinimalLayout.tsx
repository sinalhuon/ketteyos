'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, MapPin } from 'lucide-react';
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

interface Props {
    guestName?: string;
    eventTitle?: string;
    eventDate?: Date;
    location?: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
    invitationMessage?: string | null;
    venueDetails?: string | null;
    mapUrl?: string | null;
    schedule?: string | null;
    albumPhotos?: any[];
    introVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    transitionVideoUrl?: string | null;
    albumVideos?: string[];
    effectLayerUrl?: string | null;
    effectLayerOpacity?: number;
    introFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    guestStatus?: string;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    templateConfig?: any;
    [key: string]: any;
}

export default function ModernMinimalLayout(props: Props) {
    const {
        guestName, groomFirstName, groomLastName, brideFirstName, brideLastName,
        eventDate, location, venueDetails, mapUrl, invitationMessage,
        groomFatherName, groomMotherName, brideFatherName, brideMotherName,
        musicUrl, albumPhotos = [], albumVideos = [], onRsvp, templateConfig, schedule,
        introVideoUrl, backgroundVideoUrl, backgroundImageUrl, transitionVideoUrl,
    } = props;

    const cs = templateConfig?.colorScheme || { primary: '#6366F1', secondary: '#8B5CF6', accent: '#EC4899', background: '#0F172A', text: '#F8FAFC', textSecondary: 'rgba(248,250,252,0.7)', border: 'rgba(99,102,241,0.3)', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);

    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [showFlash, setShowFlash] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const bgVideoRef = useRef<HTMLVideoElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (musicUrl && audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [musicUrl]);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    const handleOpen = () => {
        setPhase('transition');
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        // If no transition media or it's an image, auto-advance after 4 seconds
        if (!transitionVideoUrl || !isVideoUrl(transitionVideoUrl)) {
            setTimeout(() => { handleTransitionEnd(); }, 4000);
        }
    };

    const handleTransitionEnd = () => {
        setShowFlash(true);
        setTimeout(() => {
            setPhase('details');
            if (bgVideoRef.current) bgVideoRef.current.play().catch(() => { });
        }, 300);
        setTimeout(() => {
            setShowFlash(false);
        }, 1000);
    };

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const dateStr = eventDate ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate)) : '';
    const timeStr = eventDate ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(eventDate)) : '';

    let scheduleItems: any[] = [];
    try { if (schedule) scheduleItems = JSON.parse(schedule); } catch (_) { }

    return (
        <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: cs.background, color: cs.text, fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}>
            {/* Animated background gradient blobs */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse" style={{ background: cs.gradient }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl animate-pulse" style={{ background: cs.gradient, animationDelay: '1s' }} />
                {backgroundImageUrl ? (
                    <img src={backgroundImageUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : backgroundVideoUrl ? (
                    isVideoUrl(backgroundVideoUrl)
                        ? <video ref={bgVideoRef} src={backgroundVideoUrl} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-1000 z-[-1]" />
                        : <img src={backgroundVideoUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : (
                    // Premium CSS Fallback Background
                    <div className="fixed inset-0 w-full h-full z-[-1]" style={{ background: cs.background }}>
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle at top right, ${cs.primary}15, transparent 60%)` }} />
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle at bottom left, ${cs.secondary}15, transparent 60%)` }} />
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(135deg, transparent 40%, ${cs.accent} 50%, transparent 60%)`, backgroundSize: '200% 200%', animation: 'shimmer 8s linear infinite' }} />
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                    /* INTRO SCREEN */
                    <motion.div
                        key="intro"
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center space-y-8 max-w-md w-full"
                        >
                            <div className="space-y-4">
                                <p className="text-[10px] tracking-[0.4em] uppercase opacity-60">{persona.isBirthday ? labels.eventTitle : persona.inviteEyebrow}</p>
                                <h2 className="text-2xl md:text-3xl font-thin tracking-widest uppercase" style={{ color: cs.text }}>
                                    {persona.coupleLine}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-xs font-semibold tracking-[0.5em] uppercase" style={{ color: cs.primary }}>Special Guest</p>
                                <div className="py-8 px-4 border-y" style={{ borderColor: cs.border }}>
                                    <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight" style={{ color: cs.text }}>
                                        {guestName || "Distinguished Guest"}
                                    </h1>
                                </div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                onClick={handleOpen}
                                className="px-10 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:scale-105"
                                style={{
                                    border: `1px solid ${cs.primary}`,
                                    color: cs.primary,
                                    background: 'transparent'
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = cs.primary;
                                    (e.currentTarget as HTMLElement).style.color = cs.background;
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = cs.primary;
                                }}
                            >
                                Open Invitation
                            </motion.button>
                        </motion.div>
                    </motion.div>
                ) : phase === 'transition' ? (
                    /* TRANSITION SCREEN */
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
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img src={transitionVideoUrl} className="w-full h-full object-cover" alt="transition" />
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 w-full h-full" style={{ background: cs.background }}>
                                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] opacity-30 blur-3xl rounded-full" style={{ background: `radial-gradient(circle, ${cs.primary}, transparent 70%)` }} />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] opacity-30 blur-3xl rounded-full" style={{ background: `radial-gradient(circle, ${cs.secondary}, transparent 70%)` }} />
                            </div>
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

                        {/* Modern Minimal Overlay */}
                        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none pb-12">
                            {/* Refined Minimal Gradient */}
                            <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-[2px] z-0" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center space-y-12 relative z-50 w-full max-w-lg px-8"
                            >
                                <div className="space-y-6 text-center w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-block px-6 py-2 border border-white/20"
                                    >
                                        <h2 className="text-sm md:text-base font-medium uppercase tracking-[0.5em] text-white">
                                            Save the date
                                        </h2>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white/60 font-medium"
                                    >
                                        {persona.isBirthday ? labels.celebrationLabel : 'The Wedding Celebration'}
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-center space-y-6 w-full"
                                >
                                    <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-none text-white">
                                        {persona.isBirthday ? persona.primaryFullName : (
                                            <>
                                                {groomLastName || groomFirstName} <span className="text-2xl md:text-3xl block my-4 opacity-40 font-thin">&</span> {brideLastName || brideFirstName}
                                            </>
                                        )}
                                    </h1>

                                    <div className="h-px w-12 mx-auto bg-white/20" />

                                    <div className="space-y-3">
                                        <div className="text-lg md:text-2xl font-light tracking-[0.2em] text-white/90">
                                            {dateStr}
                                        </div>
                                        {location && (
                                            <div className="flex items-center justify-center gap-2 text-xs md:text-sm tracking-widest uppercase text-white/60">
                                                <MapPin size={14} className="opacity-60" />
                                                {location}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    /* DETAILS SCREEN */
                    <motion.div
                        key="details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 min-h-screen"
                    >
                        {/* Hero Header */}
                        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                className="space-y-4 max-w-lg"
                            >
                                <div className="mb-2 h-16 flex items-center justify-center">
                                    {props.logoUrl && (
                                        <img src={props.logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-contain" />
                                    )}
                                </div>
                                <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.eventTitle : 'Wedding Ceremony'}</p>
                                <h1 className="text-4xl md:text-5xl font-extralight leading-none" style={{ color: cs.text }}>
                                    {persona.isBirthday ? persona.primaryFullName : (
                                        <>
                                            {groomLastName || groomFirstName}
                                            <span className="block text-xl font-thin my-4" style={{ color: cs.primary }}>&</span>
                                            {brideLastName || brideFirstName}
                                        </>
                                    )}
                                </h1>
                                <div className="h-px w-12 mx-auto" style={{ backgroundColor: cs.primary }} />
                                <p className="text-sm font-light tracking-widest" style={{ color: cs.textSecondary }}>{dateStr} · {timeStr}</p>
                                {location && <p className="text-xs" style={{ color: cs.textSecondary }}>{location}</p>}
                            </motion.div>
                        </div>

                        {/* Details Grid */}
                        <div className="max-w-2xl mx-auto px-6 pb-16 space-y-10">

                            {/* Invitation Message */}
                            {invitationMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="text-center space-y-3 pt-6"
                                >
                                    <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>Message</p>
                                    <p className="text-sm leading-relaxed font-light" style={{ color: cs.textSecondary }}>{invitationMessage}</p>
                                </motion.div>
                            )}

                            {/* Parents */}
                            {(groomFatherName || brideFatherName) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`grid gap-4 text-center py-4 ${persona.isBirthday ? 'grid-cols-1' : 'grid-cols-2'}`}
                                >
                                    <div className="space-y-1">
                                        <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>{persona.primaryParentsTitle}</p>
                                        {groomFatherName && <p className="text-xs font-light opacity-80">{groomFatherName}</p>}
                                        {groomMotherName && <p className="text-xs font-light opacity-80">{groomMotherName}</p>}
                                    </div>
                                    {!persona.isBirthday && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>{persona.secondaryParentsTitle}</p>
                                            {brideFatherName && <p className="text-xs font-light opacity-80">{brideFatherName}</p>}
                                            {brideMotherName && <p className="text-xs font-light opacity-80">{brideMotherName}</p>}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Gallery Section */}
                            <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} />

                            {/* Venue */}
                            {venueDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="text-center space-y-3 p-6"
                                    style={{ border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>Venue</p>
                                    <p className="text-sm font-light leading-relaxed" style={{ color: cs.text }}>{venueDetails}</p>
                                    {mapUrl && (
                                        <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-block mt-1 text-[10px] tracking-widest uppercase px-4 py-1.5 transition-all"
                                            style={{ color: cs.primary, border: `1px solid ${cs.primary}` }}>
                                            View Map
                                        </a>
                                    )}
                                </motion.div>
                            )}

                            {/* Schedule */}
                            {scheduleItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="space-y-4"
                                >
                                    <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-center" style={{ color: cs.primary }}>Schedule</p>
                                    <div className="space-y-2">
                                        {scheduleItems.map((item: any, i: number) => (
                                            <div key={i} className="flex items-start gap-4 py-2" style={{ borderBottom: `1px solid ${cs.border}` }}>
                                                <span className="text-[10px] font-mono mt-0.5 w-14 shrink-0" style={{ color: cs.primary }}>{item.time}</span>
                                                <p className="text-xs font-light" style={{ color: cs.text }}>
                                                    {language === 'en' ? (item.activityEn || item.titleEn || item.activity || item.title) : (item.activity || item.title)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Couple Section */}
                            <motion.section
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`grid gap-6 items-center text-center py-8 ${persona.isBirthday ? 'grid-cols-1' : 'grid-cols-2'}`}
                            >
                                <div className="space-y-2">
                                    <p className="text-[8px] tracking-[0.3em] uppercase font-bold opacity-50" style={{ color: cs.primary }}>{persona.isBirthday ? labels.roleTitle : 'The Groom'}</p>
                                    <div className={moul.className}>
                                        <h2 className="text-xl md:text-2xl" style={{ color: cs.primary }}>{groomLastName || groomFirstName}</h2>
                                        <p className="text-base md:text-lg opacity-60" style={{ color: cs.primary }}>{groomLastName}</p>
                                    </div>
                                </div>
                                {!persona.isBirthday && (
                                    <div className="space-y-2">
                                        <p className="text-[8px] tracking-[0.3em] uppercase font-bold opacity-50" style={{ color: cs.primary }}>The Bride</p>
                                        <div className={moul.className}>
                                            <h2 className="text-xl md:text-2xl" style={{ color: cs.primary }}>{brideLastName || brideFirstName}</h2>
                                            <p className="text-base md:text-lg opacity-60" style={{ color: cs.primary }}>{brideLastName}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.section>

                            {/* RSVP */}
                            <motion.div
                                initial={{ opacity: 0, y: 80 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.05, margin: "-10%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="text-center space-y-6"
                            >
                                <div className="h-px w-full" style={{ backgroundColor: cs.border }} />
                                <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>RSVP</p>
                                {!rsvpSent ? (
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={async () => { await onRsvp?.('ACCEPTED'); setRsvpSent(true); }}
                                            className="px-6 py-2 text-xs font-medium transition-all hover:opacity-80"
                                            style={{ backgroundColor: cs.primary, color: cs.background }}
                                        >Accept</button>
                                        <button
                                            onClick={async () => { await onRsvp?.('DECLINED'); setRsvpSent(true); }}
                                            className="px-6 py-2 text-xs font-medium transition-all hover:bg-white/10"
                                            style={{ border: `1px solid ${cs.border}`, color: cs.textSecondary }}
                                        >Decline</button>
                                    </div>
                                ) : (
                                    <p className="text-xs" style={{ color: cs.primary }}>Thank you for your response ✓</p>
                                )}
                            </motion.div>
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Music control */}
            {musicUrl && (
                <button
                    onClick={toggleMusic}
                    className="fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110"
                    style={{ background: `${cs.background}cc`, border: `1px solid ${cs.border}`, color: cs.primary }}
                >
                    {isPlaying ? <Music size={18} className="animate-spin-slow" /> : <VolumeX size={18} />}
                </button>
            )}
            {isPlaying && musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

            {/* MODERN MINIMAL FLASH TRANSITION */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        {/* Base White Flash */}
                        <div className="absolute inset-0 bg-white opacity-90" />

                        {/* Radial Expansion */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute w-full h-full"
                            style={{ background: `radial-gradient(circle, white 0%, ${cs.primary}44 50%, transparent 100%)` }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {musicUrl && <audio ref={audioRef} src={musicUrl} loop playsInline className="hidden" />}
        </main>
    );
}
