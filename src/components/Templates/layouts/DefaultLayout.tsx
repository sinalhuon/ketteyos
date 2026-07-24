'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import localFont from 'next/font/local';
import { motion, AnimatePresence } from 'framer-motion';
import { Playfair_Display, Lato } from 'next/font/google';
import Image from 'next/image';
import { toKhmerDateTime, getKhmerDateTimeParts } from '@/lib/khmer-utils';
import { getEventDetailTitle, type EventType } from '@/lib/event-types';
import GoldParticles from '@/components/Invitation/GoldParticles';
import FancyFrame from '@/components/Invitation/FancyFrame';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { TemplateConfig } from '../types';
import RSVPButton from '../components/shared/RSVPButton';
import MusicControl from '../components/shared/MusicControl';

const playfair = Playfair_Display({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400'], subsets: ['latin'] });

const koulen = localFont({
    src: '../../../../public/assets/fonts/Koulen-Regular.ttf',
    variable: '--font-koulen',
});

const moul = localFont({
    src: '../../../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-moul',
});

const kantumruy = localFont({
    src: '../../../../public/assets/fonts/KantumruyPro-Regular.ttf',
    variable: '--font-kantumruy',
});

interface DefaultLayoutProps {
    config: TemplateConfig;
    guestName: string;
    eventTitle: string;
    eventDate: Date;
    location: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    secondLogoUrl?: string | null;
    logoSize?: number | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    invitationMessage?: string | null;
    eventTime?: string | null;
    venueDetails?: string | null;
    mapUrl?: string | null;
    schedule?: string | null;
    albumPhotos?: any[];
    introVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    effectLayerUrl?: string | null;
    effectLayerOpacity?: number;
    effectLayerBlendMode?: string;
    guestStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    scheduleItems?: any[];
    coupleTitles?: { groom: string; bride: string };
}

const FrameOverlay = ({ url, className = "" }: { url?: string | null, className?: string }) => {
    if (!url) return null;
    const isVideo = url.match(/\.(mp4|mov|webm)$/i);
    return (
        <div className={`absolute inset-0 pointer-events-none z-[60] ${className}`}>
            {isVideo ? (
                <video
                    src={url}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-fill"
                    style={{ mixBlendMode: 'screen' }}
                />
            ) : (
                <img src={url} alt="Frame" className="w-full h-full object-fill" />
            )}
        </div>
    );
};

export default function DefaultLayout(props: DefaultLayoutProps) {
    const {
        config,
        guestName,
        eventTitle,
        eventDate,
        location,
        eventType,
        musicUrl,
        logoUrl,
        secondLogoUrl,
        logoSize = 150,
        backgroundVideoUrl,
        groomFatherName,
        groomMotherName,
        brideFatherName,
        brideMotherName,
        groomFirstName,
        groomLastName,
        brideFirstName,
        brideLastName,
        invitationMessage,
        eventTime,
        venueDetails,
        mapUrl,
        schedule,
        albumPhotos = [],
        introFrameUrl,
        transitionFrameUrl,
        detailFrameUrl,
        onRsvp,
    } = props;

    // Generate Google Calendar URL
    const googleCalendarUrl = useMemo(() => {
        try {
            const startDate = new Date(eventDate);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
            const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(eventTitle)}&dates=${start}/${end}&details=${encodeURIComponent(invitationMessage || '')}&location=${encodeURIComponent(location)}`;
        } catch {
            return '#';
        }
    }, [eventDate, eventTitle, invitationMessage, location]);

    const [hasOpened, setHasOpened] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);
    const [showIntroVideo, setShowIntroVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showTransitionFlash, setShowTransitionFlash] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);
    const backgroundVideoRef = useRef<HTMLVideoElement>(null);

    // Video URLs
    const introParams = props.introVideoUrl || "/uploads/video/1770281365052-first_screen.mp4";
    const transitionParams = props.transitionVideoUrl || "/uploads/video/middle%20screen.mov";
    const backgroundParams = props.backgroundVideoUrl || "/uploads/video/1770281380424-second_screen.mp4";

    // Transition Variants
    const transitionOverlayVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.4,
                delayChildren: 0.5,
                duration: 1
            } as any
        }
    };

    const transitionItemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1.2, ease: "easeOut" } as any
        }
    };

    const lineVariants = {
        hidden: { opacity: 0, scaleX: 0 },
        show: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 1, ease: "easeOut" } as any
        }
    };

    useEffect(() => {
        const playAudio = () => {
            if (musicUrl && audioRef.current && audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch((error) => {
                        console.log("Autoplay prevented:", error);
                    });
            }
        };

        playAudio();

        const handleInteraction = () => {
            playAudio();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [musicUrl]);

    const handleOpen = () => {
        setShowIntroVideo(true);

        if (transitionVideoRef.current) {
            transitionVideoRef.current.currentTime = 0;
            transitionVideoRef.current.play().catch(e => console.error("Video play failed", e));
        }

        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
    };

    const handleVideoEnd = () => {
        setShowTransitionFlash(true);

        setTimeout(() => {
            setShowIntroVideo(false);
            setIntroFinished(true);
            setHasOpened(true);

            if (backgroundVideoRef.current) {
                backgroundVideoRef.current.play().catch(e => console.log("Background video play delayed:", e));
            }

            setTimeout(() => {
                setShowTransitionFlash(false);
            }, 800);
        }, 200);
    };

    const toggleMusic = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const khmerDateTime = toKhmerDateTime(new Date(eventDate));
    const { timePart, datePart } = getKhmerDateTimeParts(new Date(eventDate));
    const coupleTitlesData = { groom: 'កូនប្រុស', bride: 'កូនស្រី' };
    const eventDetailTitle = getEventDetailTitle((eventType as EventType) || 'wedding');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 30 },
        show: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: (i % 2) * 0.1,
                duration: 0.8,
                ease: "easeOut"
            } as any
        }),
        hover: {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3 }
        }
    }), []);

    return (
        <main className={`relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden ${lato.className}`}>
            {/* Stage 1 Video (Intro) */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${introFinished || showIntroVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={introParams} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40" />
                <FrameOverlay url={introFrameUrl} />
            </div>

            {/* Stage 1.5 Video (Transition) */}
            <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${showIntroVideo ? 'z-30 opacity-100' : 'z-[-1] opacity-0'}`}>
                <video
                    ref={transitionVideoRef}
                    preload="auto"
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onEnded={handleVideoEnd}
                >
                    <source src={transitionParams} type="video/mp4" />
                </video>

                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none pb-10">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 opacity-90 z-0" />
                    <div className="absolute inset-0 opacity-70 z-10">
                        <GoldParticles />
                    </div>

                    <motion.div
                        variants={transitionOverlayVariants}
                        initial="hidden"
                        animate={showIntroVideo ? "show" : "hidden"}
                        className="flex flex-col items-center space-y-8 relative z-50 w-full max-w-lg px-6"
                    >
                        <div className="text-center flex flex-col items-center space-y-4 w-full">
                            <motion.h2
                                variants={transitionItemVariants}
                                className="text-2xl md:text-3xl font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{
                                    fontFamily: 'Playfair Display, serif',
                                    letterSpacing: "0.4em"
                                }}
                            >
                                Save the date
                            </motion.h2>

                            <motion.div
                                variants={lineVariants}
                                className="flex items-center justify-center gap-4 w-full"
                            >
                                <div className="h-[1px] w-8 md:w-12 bg-white/40" />
                                <span className="text-white/90 text-[10px] md:text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Lato, sans-serif' }}>
                                    For the wedding of
                                </span>
                                <div className="h-[1px] w-8 md:w-12 bg-white/40" />
                            </motion.div>
                        </div>

                        {(secondLogoUrl || logoUrl) && (
                            <motion.div
                                variants={transitionItemVariants}
                                className="relative drop-shadow-[0_0_25px_rgba(238,197,115,0.6)]"
                                style={{ width: (Number(logoSize) || 150), height: (Number(logoSize) || 150) }}
                            >
                                <img
                                    src={secondLogoUrl || logoUrl || ''}
                                    alt="Wedding Graphic"
                                    className="w-full h-full object-contain filter brightness-110 contrast-110"
                                />
                            </motion.div>
                        )}

                        <div className="text-center flex flex-col items-center space-y-4 w-full">
                            <motion.h1
                                variants={transitionItemVariants}
                                className="text-3xl md:text-5xl font-bold leading-tight py-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{
                                    fontFamily: 'Moul, "Great Vibes", cursive',
                                    letterSpacing: 0,
                                }}
                            >
                                {groomLastName || 'Groom'}
                                <span className="text-2xl align-middle px-3 text-[#eec573]/80 font-serif">&</span>
                                {brideLastName || 'Bride'}
                            </motion.h1>

                            <motion.div
                                variants={transitionItemVariants}
                                className="flex items-start justify-center gap-2 text-lg md:text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{ fontFamily: kantumruy.style.fontFamily }}
                            >
                                <span className="text-[#bf953f] shrink-0 mt-0.5"><MapPin size={18} /></span>
                                {location || 'Phnom Penh'}
                            </motion.div>
                        </div>
                    </motion.div>
                    <FrameOverlay url={transitionFrameUrl} />
                </div>
            </div>

            {/* Stage 2 Video (Main) */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
                <video
                    ref={backgroundVideoRef}
                    preload="auto"
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={backgroundParams} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* GOLDEN GLOW FLASH TRANSITION */}
            <AnimatePresence>
                {showTransitionFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#EEC573] to-white opacity-90" />
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rotate-12 scale-150 transform"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,1)_0%,rgba(238,197,115,0.5)_50%,transparent_100%)]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Golden Particles Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {props.effectLayerUrl && (
                    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: props.effectLayerOpacity ?? 1 }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ mixBlendMode: (props.effectLayerBlendMode as any) || 'screen' }}
                        >
                            <source src={props.effectLayerUrl} type="video/mp4" />
                        </video>
                    </div>
                )}

                <div className="absolute top-10 left-10 w-2 h-2 bg-[#EEC573]/60 rounded-full animate-pulse" />
                <div className="absolute top-20 right-20 w-3 h-3 bg-[#EEC573]/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-32 left-16 w-2 h-2 bg-[#EEC573]/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#EEC573]/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {!introFinished && !showIntroVideo ? (
                // --- STAGE 1: INTRO ---
                <>
                    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-6 md:p-6 space-y-8 animate-fade-in-up">
                        <div className="space-y-6 max-w-md w-full">
                            {logoUrl && (
                                <div
                                    className="relative mb-4 mx-auto"
                                    style={{ width: Number(logoSize) || 150, height: Number(logoSize) || 150 }}
                                >
                                    <img src={logoUrl} alt="Wedding Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(238,197,115,0.5)]" />
                                </div>
                            )}

                            <div className="space-y-6">
                                <p className={`text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]`} style={{ fontFamily: koulen.style.fontFamily }}>
                                    សូមគោរពអញ្ជើញ
                                </p>

                                <div className="flex flex-col items-center space-y-10">
                                    <FancyFrame padding="px-10 py-1">
                                        {(() => {
                                            const nameLength = (guestName || "លោក ហួន ស៊ីណាល់").length;
                                            let fontSizeClass = "text-2xl md:text-4xl";
                                            if (nameLength > 40) fontSizeClass = "text-base md:text-xl";
                                            else if (nameLength > 25) fontSizeClass = "text-lg md:text-2xl";
                                            else if (nameLength > 15) fontSizeClass = "text-xl md:text-3xl";

                                            return (
                                                <p className={`${fontSizeClass} font-bold tracking-normal leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] max-w-[85vw] md:max-w-xl text-center break-words whitespace-normal`} style={{ fontFamily: koulen.style.fontFamily }}>
                                                    {guestName || "លោក ហួន ស៊ីណាល់"}
                                                </p>
                                            );
                                        })()}
                                    </FancyFrame>

                                    <div className="relative group">
                                        <button
                                            onClick={handleOpen}
                                            className="px-20 py-4 w-[400px] md:w-[650px] min-h-[100px] relative overflow-hidden group transition-all duration-300"
                                            style={{
                                                fontFamily: 'Moul, serif',
                                                backgroundImage: 'url(/open-inviation-button-1.png)',
                                                backgroundSize: '100% 100%',
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                            }}
                                        >
                                            <span className="relative z-10 text-base md:text-lg text-[#3E2723] font-bold tracking-normal drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] whitespace-nowrap group-hover:text-black transition-colors duration-300" style={{letterSpacing: 0}}>
                                                បើកការអញ្ជើញ
                                            </span>

                                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                        </button>

                                        <motion.div
                                            className="absolute bottom-[-25px] right-10 md:bottom-[-15px] md:right-24 pointer-events-none z-50"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 2.5, duration: 0.8 }}
                                        >
                                            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
                                                <DotLottiePlayer
                                                    src="https://lottie.host/6e66ed1b-a12d-41ae-adab-7a4e08e61212/BRimP6bQ7c.lottie"
                                                    loop
                                                    autoplay
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FrameOverlay url={introFrameUrl} />
                </>
            ) : hasOpened ? (
                // --- STAGE 2: SCROLLABLE CONTENT ---
                <div className="relative z-20 w-full min-h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8"
                    >
                        {/* Logo Section */}
                        {logoUrl && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="text-center"
                            >
                                <div
                                    className="relative mx-auto"
                                    style={{ width: Number(logoSize) || 150, height: Number(logoSize) || 150 }}
                                >
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(238,197,115,0.5)]" />
                                </div>
                            </motion.div>
                        )}

                        {/* Main Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-center space-y-3 -mt-12 relative z-10"
                        >
                            <div className="inline-block px-6 py-2 border-2 border-[#EEC573]/60 rounded-lg bg-black/30 backdrop-blur-sm">
                                <p className="text-xl md:text-2xl font-bold tracking-normal leading-normal bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]" style={{ fontFamily: moul.style.fontFamily, letterSpacing: 0 }}>
                                    {eventDetailTitle}
                                </p>
                            </div>
                        </motion.div>

                        {/* Parents Names */}
                        {(groomFatherName || groomMotherName || brideFatherName || brideMotherName) && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="grid grid-cols-2 gap-4 md:gap-8 text-center"
                            >
                                <div className="space-y-3">
                                    <p className="text-[#EEC573] text-base md:text-lg mb-2" style={{ fontFamily: moul.style.fontFamily, letterSpacing: 0 }}>
                                        លោកមេបាកូនកម្លោះ
                                    </p>
                                    {groomFatherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                            {groomFatherName}
                                        </p>
                                    )}
                                    {groomMotherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                            {groomMotherName}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[#EEC573] text-base md:text-lg mb-2" style={{ fontFamily: moul.style.fontFamily, letterSpacing: 0 }}>
                                        លោកមេបាកូនក្រមុំ
                                    </p>
                                    {brideFatherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                            {brideFatherName}
                                        </p>
                                    )}
                                    {brideMotherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                            {brideMotherName}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Invitation Message */}
                        {invitationMessage && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="text-center">
                                    <p className="text-[#EEC573] text-xl md:text-2xl" style={{ fontFamily: moul.style.fontFamily, letterSpacing: 0 }}>
                                        សូមគោរពអញ្ជើញ
                                    </p>
                                </div>
                                <div className="border-2 border-[#EEC573]/40 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20">
                                    <div className="text-white/90 text-center space-y-4 whitespace-pre-wrap leading-relaxed text-base md:text-lg" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                        {invitationMessage}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Couple Names */}
                        <motion.div variants={itemVariants} className="text-center space-y-4">
                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                {groomLastName && groomFirstName && (
                                    <div className="space-y-2">
                                        <p className="text-[#EEC573]/70 text-lg md:text-xl mb-1" style={{ fontFamily: koulen.style.fontFamily }}>
                                            {coupleTitlesData.groom}
                                        </p>
                                        <p className="text-xl md:text-2xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" style={{ fontFamily: koulen.style.fontFamily }}>
                                            {groomLastName || groomFirstName}
                                        </p>
                                        <p className="text-2xl md:text-4xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mt-1" style={{ fontFamily: moul.style.fontFamily }}>
                                            {groomLastName}
                                        </p>
                                    </div>
                                )}
                                {brideLastName && brideFirstName && (
                                    <div className="space-y-2">
                                        <p className="text-[#EEC573]/70 text-lg md:text-xl mb-1" style={{ fontFamily: koulen.style.fontFamily }}>
                                            {coupleTitlesData.bride}
                                        </p>
                                        <p className="text-xl md:text-2xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" style={{ fontFamily: koulen.style.fontFamily }}>
                                            {brideLastName || brideFirstName}
                                        </p>
                                        <p className="text-2xl md:text-4xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mt-1" style={{ fontFamily: moul.style.fontFamily }}>
                                            {brideLastName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Date & Time */}
                        <motion.div variants={itemVariants} className="text-center space-y-4">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />

                            <div className="space-y-3">
                                <p className="text-white/90 text-base md:text-lg" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                    {timePart}
                                </p>
                                <p className="text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" style={{ fontFamily: koulen.style.fontFamily }}>
                                    {datePart}
                                </p>
                            </div>

                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />

                            <div className="pt-4">
                                <a
                                    href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-6 py-2 bg-transparent text-[#EEC573] border border-[#EEC573]/40 rounded-full text-sm font-bold tracking-wider hover:bg-[#EEC573]/10 transition-colors"
                                    style={{ fontFamily: kantumruy.style.fontFamily }}
                                >
                                    ដាក់ក្នុងប្រតិទិន 📅 (Add to Calendar)
                                </a>
                            </div>
                        </motion.div>

                        {/* Venue */}
                        {venueDetails && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="border-2 border-[#EEC573]/40 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20 text-center"
                            >
                                <p className="text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mb-4" style={{ fontFamily: koulen.style.fontFamily }}>ទីតាំង</p>
                                <div className="text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] space-y-2 whitespace-pre-wrap" style={{ fontFamily: koulen.style.fontFamily }}>
                                    {venueDetails}
                                </div>
                                {mapUrl && (
                                    <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-6 text-[#EEC573] hover:text-white transition-colors border-2 border-[#EEC573] px-6 py-2 rounded-full text-sm md:text-base font-bold"
                                    >
                                        បើកផែនទី 📍
                                    </a>
                                )}
                            </motion.div>
                        )}

                        {/* RSVP Button */}
                        <div className="text-center">
                            <RSVPButton config={config} onRsvp={onRsvp} />
                        </div>
                    </motion.div>
                </div>
            ) : null}

            {/* Music Control */}
            <MusicControl config={config} isPlaying={isPlaying} onToggle={toggleMusic} />
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop autoPlay />}
        </main>
    );
}
