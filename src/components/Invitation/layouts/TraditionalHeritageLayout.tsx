'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
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
    eventDate?: Date;
    location?: string;
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
    albumPhotos?: string[];
    albumVideos?: string[];
    introVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    templateConfig?: any;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: any;
}

export default function TraditionalHeritageLayout(props: Props) {
    const { groomFirstName, groomLastName, brideFirstName, brideLastName, eventDate, location, venueDetails, mapUrl, invitationMessage, groomFatherName, groomMotherName, brideFatherName, brideMotherName, musicUrl, onRsvp, templateConfig, schedule, guestName, backgroundVideoUrl, backgroundImageUrl, transitionVideoUrl, albumPhotos = [], albumVideos = [] } = props;

    const cs = templateConfig?.colorScheme || {
        primary: '#D4AF37', secondary: '#B8860B', accent: '#F0E68C',
        background: '#1A1A1A', text: '#FFF8DC', textSecondary: 'rgba(255,248,220,0.8)',
        border: 'rgba(212,175,55,0.4)', gradient: 'linear-gradient(to right, #D4AF37, #F0E68C, #B8860B)'
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
        const t = setTimeout(() => {
            if (musicUrl && audioRef.current) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
            }
        }, 500);
        return () => clearTimeout(t);
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
    let scheduleItems: any[] = [];
    try { if (schedule) scheduleItems = JSON.parse(schedule); } catch (_) { }

    return (
        <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: cs.background, color: cs.text }}>
            {/* Ornamental CSS background pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-5" style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${cs.primary} 0, ${cs.primary} 1px, transparent 0, transparent 50%)`,
                backgroundSize: '20px 20px'
            }} />

            {/* Background Image/Video Support */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {backgroundImageUrl ? (
                    <img src={backgroundImageUrl} className="fixed inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : backgroundVideoUrl ? (
                    isVideoUrl(backgroundVideoUrl)
                        ? <video src={backgroundVideoUrl} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-10 transition-opacity duration-1000 z-[-1]" />
                        : <img src={backgroundVideoUrl} className="fixed inset-0 w-full h-full object-cover opacity-20 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : (
                    // Premium CSS Fallback Background
                    <div className="fixed inset-0 w-full h-full z-[-1]" style={{ background: cs.background }}>
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(ellipse at center, ${cs.secondary}20 0%, transparent 80%)` }} />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(45deg, ${cs.primary} 0, ${cs.primary} 1px, transparent 1px, transparent 10px)` }} />
                    </div>
                )}
            </div>

            {/* Glow corners */}
            <div className="fixed top-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: cs.primary }} />
            <div className="fixed bottom-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: cs.primary }} />

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                    <motion.div
                        key="intro"
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8"
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    >
                        {/* Ornamental border frame */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-sm p-10 text-center bg-black/40 backdrop-blur-sm"
                            style={{ border: `2px solid ${cs.primary}`, boxShadow: `0 0 40px ${cs.primary}22, inset 0 0 40px ${cs.primary}11` }}
                        >
                            {/* Corner ornaments */}
                            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                                <div key={i} className={`absolute ${pos} w-6 h-6`}
                                    style={{
                                        borderTop: i < 2 ? `3px solid ${cs.primary}` : undefined,
                                        borderBottom: i >= 2 ? `3px solid ${cs.primary}` : undefined,
                                        borderLeft: i % 2 === 0 ? `3px solid ${cs.primary}` : undefined,
                                        borderRight: i % 2 === 1 ? `3px solid ${cs.primary}` : undefined,
                                        transform: 'translate(-4px, -4px)'
                                    }}
                                />
                            ))}

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-6">
                                <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: cs.textSecondary }}>{persona.isBirthday ? labels.eventTitle : persona.inviteEyebrow}</p>

                                <h2 className="text-2xl font-normal" style={{ color: cs.text, fontFamily: 'Georgia, serif' }}>
                                    {persona.coupleLine}
                                </h2>

                                <div className="py-6 px-2" style={{ borderTop: `1px solid ${cs.border}`, borderBottom: `1px solid ${cs.border}` }}>
                                    <p className="text-xs tracking-[0.5em] uppercase font-medium mb-4" style={{ color: cs.primary }}>Special Guest</p>
                                    <h1 className="text-2xl md:text-3xl font-bold leading-snug tracking-wider" style={{ color: cs.primary, fontFamily: 'Georgia, serif' }}>
                                        {guestName || "Distinguished Guest"}
                                    </h1>
                                </div>

                                <motion.button
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                                    onClick={handleOpen}
                                    className="w-full py-3 mt-4 text-sm font-semibold tracking-widest uppercase transition-all hover:opacity-80"
                                    style={{ background: cs.gradient, color: cs.background }}
                                >
                                    Open Invitation
                                </motion.button>
                            </motion.div>
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
                                        className="w-full h-full object-cover"
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

                        {/* Heritage Style Overlay */}
                        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none pb-12">
                            {/* Paper-like Contrast Gradient */}
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2 }}
                                className="flex flex-col items-center space-y-10 relative z-50 w-full max-w-lg px-8 py-16 border-2 border-double"
                                style={{ borderColor: `${cs.primary}44` }}
                            >
                                <div className="text-center space-y-4 w-full">
                                    <h2 className="text-4xl md:text-5xl font-serif italic" style={{ color: cs.primary }}>
                                        Save the Date
                                    </h2>
                                    <div className="flex items-center justify-center gap-4 w-full">
                                        <div className="h-px flex-1" style={{ background: cs.primary, opacity: 0.3 }} />
                                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/60">{persona.unionEyebrow}</span>
                                        <div className="h-px flex-1" style={{ background: cs.primary, opacity: 0.3 }} />
                                    </div>
                                </div>

                                <div className="text-center space-y-6 w-full">
                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif', color: cs.primary }}>
                                        {persona.coupleLine}
                                    </h1>
                                </div>

                                <div className="text-center space-y-4 w-full pt-6 border-t" style={{ borderColor: `${cs.primary}22` }}>
                                    <p className="text-2xl tracking-[0.2em] font-light text-white/90">
                                        {dateStr}
                                    </p>
                                    <div className="h-[2px] w-12 mx-auto" style={{ background: cs.primary }} />
                                    {location && (
                                        <p className="text-xs md:text-sm tracking-widest uppercase text-white/60">
                                            {location}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10">
                        {/* Hero */}
                        <div className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-10 space-y-6">
                            <div className="mb-2 h-16 flex items-center justify-center">
                                {props.logoUrl && (
                                    <img src={props.logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-contain" />
                                )}
                            </div>
                            <div className="w-12 h-0.5 mx-auto" style={{ background: cs.gradient }} />
                            <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.eventTitle : 'Wedding Ceremony'}</p>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight" style={{ fontFamily: 'Georgia, serif', color: cs.primary }}>
                                {persona.isBirthday ? persona.primaryFullName : (
                                    <>
                                        {groomLastName || groomFirstName}
                                        <span className="block text-xl font-light my-2" style={{ color: cs.text }}>and</span>
                                        {brideLastName || brideFirstName}
                                    </>
                                )}
                            </h1>
                            <p className="text-sm" style={{ color: cs.textSecondary }}>{dateStr}</p>
                            {location && <p className="text-xs italic" style={{ color: cs.textSecondary }}>{location}</p>}
                            <div className="w-12 h-0.5 mx-auto" style={{ background: cs.gradient }} />
                        </div>

                        {/* Details */}
                        <div className="max-w-xl mx-auto px-6 pb-16 space-y-10">
                            {invitationMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 1 }}
                                    className="text-center space-y-3 p-6"
                                    style={{ border: `1px solid ${cs.border}`, borderImage: `${cs.gradient} 1` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Royal Decree</p>
                                    <p className="text-sm leading-relaxed italic" style={{ color: cs.textSecondary, fontFamily: 'Georgia, serif' }}>{invitationMessage}</p>
                                </motion.div>
                            )}

                            {/* Gallery Section */}
                            <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} />

                            {(groomFatherName || brideFatherName) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    className={`grid gap-4 text-center ${persona.isBirthday ? 'grid-cols-1' : 'grid-cols-2'}`}
                                >
                                    <div className="space-y-1 p-3 border" style={{ borderColor: cs.border }}>
                                        <p className="text-[10px] tracking-widest uppercase mb-2 font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.familyTitle : "Groom's Family"}</p>
                                        <div className={`mb-2 ${moul.className}`}>
                                            <p className="text-base" style={{ color: cs.primary }}>{groomLastName || groomFirstName}</p>
                                            <p className="text-[10px] opacity-60" style={{ color: cs.primary }}>{groomLastName}</p>
                                        </div>
                                        {groomFatherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomFatherName}</p>}
                                        {groomMotherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomMotherName}</p>}
                                    </div>
                                    {!persona.isBirthday && (
                                        <div className="space-y-1 p-3 border" style={{ borderColor: cs.border }}>
                                            <p className="text-[10px] tracking-widest uppercase mb-2 font-bold" style={{ color: cs.primary }}>Bride's Family</p>
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
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    className="text-center space-y-2 p-6"
                                    style={{ background: `${cs.primary}11`, border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Ceremony Venue</p>
                                    <p className="text-base font-medium" style={{ color: cs.text, fontFamily: 'Georgia, serif' }}>{venueDetails}</p>
                                    {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase underline" style={{ color: cs.primary }}>View on Map</a>}
                                </motion.div>
                            )}

                            {/* RSVP */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                className="text-center space-y-6"
                            >
                                <div className="h-px w-full" style={{ background: cs.gradient }} />
                                <p className="text-[10px] tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>— RSVP —</p>
                                {!rsvpSent ? (
                                    <div className="flex gap-4 justify-center">
                                        <button onClick={async () => { await onRsvp?.('ACCEPTED'); setRsvpSent(true); }} className="px-6 py-1.5 text-xs font-semibold" style={{ background: cs.gradient, color: cs.background }}>Accept</button>
                                        <button onClick={async () => { await onRsvp?.('DECLINED'); setRsvpSent(true); }} className="px-6 py-1.5 text-xs font-semibold" style={{ border: `1px solid ${cs.border}`, color: cs.textSecondary }}>Decline</button>
                                    </div>
                                ) : (
                                    <p className="text-xs italic" style={{ color: cs.primary }}>Thank you for your gracious response ✦</p>
                                )}
                            </motion.div>
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {musicUrl && (
                <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-3 rounded-full" style={{ backgroundColor: `${cs.primary}22`, border: `1px solid ${cs.primary}66`, color: cs.primary }}>
                    {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            )}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

            {/* HERITAGE FLASH TRANSITION */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        {/* 1. Base Amber/Warm Flush */}
                        <div className="absolute inset-0 opacity-80" style={{ backgroundColor: '#FDF5E6' }} />

                        {/* 2. Soft Radial Burst */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute w-full h-full"
                            style={{ background: `radial-gradient(circle, #FFF8DC 0%, ${cs.primary}44 60%, transparent 100%)` }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
