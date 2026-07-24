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
    albumVideos?: string[];
    templateConfig?: any;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    transitionVideoUrl?: string | null;
    logoUrl?: string | null;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: any;
}

// Floating petal component
function Petal({ delay, x, color }: { delay: number, x: number, color: string }) {
    return (
        <motion.div
            className="absolute top-0 rounded-full opacity-60 pointer-events-none"
            style={{ left: `${x}%`, width: 8, height: 12, backgroundColor: color }}
            animate={{
                y: ['0vh', '110vh'],
                x: [0, Math.random() * 40 - 20],
                rotate: [0, 360],
                opacity: [0, 0.7, 0]
            }}
            transition={{
                duration: 6 + Math.random() * 4,
                delay,
                repeat: Infinity,
                ease: 'linear'
            }}
        />
    );
}

export default function RomanticDreamsLayout(props: Props) {
    const { groomFirstName, groomLastName, brideFirstName, brideLastName, eventDate, location, venueDetails, mapUrl, invitationMessage, groomFatherName, groomMotherName, brideFatherName, brideMotherName, musicUrl, onRsvp, templateConfig, guestName, backgroundVideoUrl, backgroundImageUrl, transitionVideoUrl, logoUrl, albumPhotos = [], albumVideos = [] } = props;

    const cs = templateConfig?.colorScheme || {
        primary: '#FF69B4', secondary: '#FFB6C1', accent: '#FFC0CB',
        background: '#2D1B3D', text: '#FFF0F5', textSecondary: 'rgba(255,240,245,0.85)',
        border: 'rgba(255,105,180,0.3)', gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)'
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
    const bgVideoRef = useRef<HTMLVideoElement>(null);

    const petals = Array.from({ length: 12 }, (_, i) => ({ id: i, delay: i * 0.5, x: Math.random() * 100 }));

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
            if (bgVideoRef.current) bgVideoRef.current.play().catch(() => { });
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

    return (
        <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: cs.background, color: cs.text }}>
            {/* Soft bg gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${cs.primary}22 0%, transparent 70%), radial-gradient(ellipse at bottom, ${cs.secondary}22 0%, transparent 70%)` }} />

            {/* Background Image/Video Support */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {backgroundImageUrl ? (
                    <img src={backgroundImageUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : backgroundVideoUrl ? (
                    isVideoUrl(backgroundVideoUrl)
                        ? <video ref={bgVideoRef} src={backgroundVideoUrl} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-10 transition-opacity duration-1000 z-[-1]" />
                        : <img src={backgroundVideoUrl} className="fixed inset-0 w-full h-full object-cover opacity-30 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : (
                    // Premium CSS Fallback Background
                    <div className="fixed inset-0 w-full h-full z-[-1]" style={{ background: cs.background }}>
                        <div className="absolute inset-0 opacity-40 blur-[100px]" style={{ backgroundImage: `conic-gradient(from 90deg, ${cs.secondary}40, ${cs.accent}20, ${cs.primary}40)` }} />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 80% 20%, ${cs.primary}40 0%, transparent 50%)` }} />
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 20% 80%, ${cs.accent}40 0%, transparent 50%)` }} />
                    </div>
                )}
            </div>

            {/* Floating petals */}
            <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
                {petals.map(p => <Petal key={p.id} delay={p.delay} x={p.x} color={cs.primary} />)}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                    <motion.div key="intro" className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8" exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8 } }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center space-y-8 max-w-sm w-full"
                        >
                            <p className="text-[10px] tracking-[0.4em] uppercase opacity-60">{persona.isBirthday ? 'To Celebrate The Birthday Of' : 'To Celebrate The Union Of'}</p>
                            <h2 className="text-2xl font-light italic" style={{ color: cs.primary }}>
                                {persona.coupleLine}
                            </h2>

                            <div className="space-y-4">
                                <p className="text-xs tracking-[0.5em] uppercase font-medium" style={{ color: cs.primary }}>Special Guest</p>
                                <div className="py-8 px-4 rounded-3xl border border-pink-200/30 bg-white/5 backdrop-blur-sm shadow-xl">
                                    <h1 className="text-3xl md:text-4xl font-light leading-tight" style={{ fontFamily: "'Georgia', 'Palatino', serif", color: cs.text }}>
                                        {guestName || "Dearest Guest"}
                                    </h1>
                                </div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                onClick={handleOpen}
                                className="px-12 py-3 rounded-full text-sm tracking-widest uppercase font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105"
                                style={{ background: cs.gradient, color: 'white' }}
                            >
                                Open Invitation
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
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img src={transitionVideoUrl} className="w-full h-full object-cover" alt="transition" />
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 w-full h-full" style={{ background: `radial-gradient(circle at center, ${cs.secondary}33 0%, ${cs.background} 100%)` }} />
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

                        {/* Romantic Overlay */}
                        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center pointer-events-none pb-12">
                            {/* Soft Blur Backdrop */}
                            <div className="absolute inset-0 bg-pink-950/40 backdrop-blur-[2px] z-0" />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="flex flex-col items-center space-y-10 relative z-50 w-full max-w-lg px-8 py-20 rounded-[4rem] border border-white/10 overflow-hidden"
                            >
                                {/* Decorative Glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                <div className="text-center space-y-4 w-full">
                                    <h2 className="text-4xl md:text-5xl font-light italic" style={{ color: cs.primary, fontFamily: 'serif' }}>
                                        Save the Date
                                    </h2>
                                    <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50">{persona.isBirthday ? labels.celebrationLabel : 'To Celebrate Our Love'}</p>
                                </div>

                                <div className="text-center space-y-6 w-full">
                                    <h1 className="text-3xl md:text-5xl font-light tracking-wide text-white leading-relaxed" style={{ fontFamily: 'serif' }}>
                                        {persona.isBirthday ? persona.primaryFullName : (
                                            <>
                                                {groomLastName || groomFirstName}
                                                <span className="block text-xl opacity-40 italic my-2">&</span>
                                                {brideLastName || brideFirstName}
                                            </>
                                        )}
                                    </h1>
                                </div>

                                <div className="text-center space-y-4 w-full">
                                    <div className="h-px w-12 mx-auto bg-white/20 mb-6" />
                                    <p className="text-xl md:text-2xl font-extralight tracking-[0.2em] text-white/90">
                                        {dateStr}
                                    </p>
                                    {location && (
                                        <p className="text-xs md:text-sm tracking-widest uppercase text-white/40 font-light">
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
                        <div className="min-h-screen flex flex-col items-center justify-center text-center px-10 pb-12 pt-20 space-y-6">
                            <div className="mb-2 h-16 flex items-center justify-center">
                                {logoUrl && (
                                    <img src={logoUrl} alt="Logo" className="w-16 h-16 mx-auto object-contain" />
                                )}
                            </div>
                            <svg className="w-8 h-8 opacity-60" viewBox="0 0 100 100" fill="none">
                                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                                    <ellipse key={i} cx={50 + 18 * Math.cos(angle * Math.PI / 180)} cy={50 + 18 * Math.sin(angle * Math.PI / 180)} rx="12" ry="20" fill={cs.primary} opacity="0.8" transform={`rotate(${angle} ${50 + 18 * Math.cos(angle * Math.PI / 180)} ${50 + 18 * Math.sin(angle * Math.PI / 180)})`} />
                                ))}
                                <circle cx="50" cy="50" r="12" fill={cs.accent} />
                            </svg>
                            <h1 className="text-4xl md:text-5xl font-light leading-snug" style={{ fontFamily: 'Georgia, Palatino, serif', color: cs.text }}>
                                {persona.isBirthday ? (
                                    <span style={{ color: cs.primary }}>{persona.primaryFullName}</span>
                                ) : (
                                    <>
                                        <span style={{ color: cs.primary }}>{groomLastName || groomFirstName}</span>
                                        <span className="block text-xl my-1" style={{ color: cs.textSecondary }}>and</span>
                                        <span style={{ color: cs.primary }}>{brideLastName || brideFirstName}</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xs font-light tracking-[0.3em] uppercase" style={{ color: cs.textSecondary }}>{dateStr}</p>
                            {location && <p className="text-xs italic" style={{ color: cs.textSecondary }}>{location}</p>}
                        </div>

                        {/* Details */}
                        <div className="max-w-xl mx-auto px-6 pb-16 space-y-10">
                            {invitationMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 1 }}
                                    className="text-center space-y-3 p-6 rounded-2xl"
                                    style={{ background: `${cs.primary}11`, border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Our Message</p>
                                    <p className="text-sm leading-relaxed italic font-light" style={{ color: cs.textSecondary, fontFamily: 'Georgia, serif' }}>{invitationMessage}</p>
                                </motion.div>
                            )}

                            {(groomFatherName || brideFatherName) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    className={`grid gap-4 text-center ${persona.isBirthday ? 'grid-cols-1' : 'grid-cols-2'}`}
                                >
                                    <div className="p-3 rounded-xl space-y-1" style={{ background: `${cs.primary}11`, border: `1px solid ${cs.border}` }}>
                                        <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>{persona.isBirthday ? labels.familyTitle : "Groom's Side"}</p>
                                        <div className={`mb-2 ${moul.className}`}>
                                            <p className="text-base" style={{ color: cs.primary }}>{groomLastName || groomFirstName}</p>
                                            <p className="text-[10px] opacity-60" style={{ color: cs.primary }}>{groomLastName}</p>
                                        </div>
                                        {groomFatherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomFatherName}</p>}
                                        {groomMotherName && <p className="text-[10px]" style={{ color: cs.text }}>{groomMotherName}</p>}
                                    </div>
                                    {!persona.isBirthday && (
                                        <div className="p-3 rounded-xl space-y-1" style={{ background: `${cs.primary}11`, border: `1px solid ${cs.border}` }}>
                                            <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Bride's Side</p>
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
                                    className="text-center space-y-2 p-6 rounded-2xl"
                                    style={{ background: `${cs.primary}11`, border: `1px solid ${cs.border}` }}
                                >
                                    <p className="text-[10px] tracking-widest uppercase font-bold" style={{ color: cs.primary }}>Where Love Awaits</p>
                                    <p className="text-base font-light leading-relaxed" style={{ color: cs.text, fontFamily: 'Georgia, serif' }}>{venueDetails}</p>
                                    {mapUrl && <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-widest uppercase underline" style={{ color: cs.primary }}>Find Us</a>}
                                </motion.div>
                            )}

                            {/* Gallery Section */}
                            <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} />

                            {/* RSVP */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {musicUrl && (
                <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-3 rounded-full" style={{ backgroundColor: `${cs.primary}33`, border: `1px solid ${cs.primary}66`, color: cs.primary }}>
                    {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            )}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

            {/* ROMANTIC FLASH TRANSITION */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        {/* 1. Base Soft Pink/White Flush */}
                        <div className="absolute inset-0 opacity-80" style={{ backgroundColor: '#FFF0F5' }} />

                        {/* 2. Ethereal Radial Burst */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute w-full h-full"
                            style={{ background: `radial-gradient(circle, white 0%, ${cs.primary}33 60%, transparent 100%)` }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
