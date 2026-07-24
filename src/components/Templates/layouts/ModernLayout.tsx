'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import localFont from 'next/font/local';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { toKhmerDateTime, getKhmerDateTimeParts } from '@/lib/khmer-utils';
import { getEventDetailTitle, type EventType } from '@/lib/event-types';
import { TemplateConfig } from '../types';
import RSVPButton from '../components/shared/RSVPButton';
import MusicControl from '../components/shared/MusicControl';
import CountdownTimer from '../components/shared/CountdownTimer';

const inter = Inter({ subsets: ['latin'] });

const kantumruy = localFont({
    src: '../../../../public/assets/fonts/KantumruyPro-Regular.ttf',
    variable: '--font-kantumruy',
});

interface ModernLayoutProps {
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

export default function ModernLayout(props: ModernLayoutProps) {
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
        logoSize = 120,
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
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);

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
        setHasOpened(true);
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
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
    const eventDetailTitle = getEventDetailTitle((eventType as EventType) || 'wedding');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as any }
        }
    };

    if (!hasOpened) {
        return (
            <main className={`relative min-h-screen flex items-center justify-center overflow-hidden ${inter.className}`}>
                {/* Modern gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Geometric patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white/20 rounded-full" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white/10 rounded-lg rotate-45" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white/15 rotate-12" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-6 max-w-2xl mx-auto"
                >
                    {/* Modern logo */}
                    {logoUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <div
                                className="mx-auto"
                                style={{ width: Number(logoSize) || 120, height: Number(logoSize) || 120 }}
                            >
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        </motion.div>
                    )}

                    {/* Modern title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6 mb-12"
                    >
                        <h1 
                            className="text-4xl md:text-6xl font-bold tracking-tight"
                            style={{ 
                                color: config.colorScheme.text,
                                fontFamily: config.typography.headingFont
                            }}
                        >
                            We're Getting Married
                        </h1>
                        
                        <div className="flex items-center justify-center gap-2 text-white/80">
                            <Calendar size={16} />
                            <span className="text-sm md:text-base" style={{ fontFamily: config.typography.bodyFont }}>
                                {khmerDateTime}
                            </span>
                        </div>
                    </motion.div>

                    {/* Guest name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <p className="text-white/90 text-lg md:text-xl" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                {guestName || "លោក ហួន ស៊ីណាល់"}
                            </p>
                        </div>
                    </motion.div>

                    {/* Modern open button */}
                    <motion.button
                        onClick={handleOpen}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
                        style={{ fontFamily: config.typography.bodyFont }}
                    >
                        <span className="flex items-center gap-2">
                            View Invitation
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        
                        {/* Animated gradient border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    </motion.button>
                </motion.div>

                {/* Music Control */}
                <MusicControl config={config} isPlaying={isPlaying} onToggle={toggleMusic} />
                {musicUrl && <audio ref={audioRef} src={musicUrl} loop autoPlay />}
            </main>
        );
    }

    return (
        <main className={`relative min-h-screen overflow-hidden ${inter.className}`}>
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
            <div className="fixed inset-0 bg-black/20" />
            
            {/* Geometric patterns */}
            <div className="fixed inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white/20 rounded-full animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white/10 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-white/15 rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-16"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="text-center space-y-8">
                        {logoUrl && (
                            <div className="mx-auto" style={{ width: Number(logoSize) || 120, height: Number(logoSize) || 120 }}>
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <h1 
                                className="text-5xl md:text-7xl font-bold tracking-tight"
                                style={{ 
                                    color: config.colorScheme.text,
                                    fontFamily: config.typography.headingFont
                                }}
                            >
                                {groomLastName || groomFirstName} & {brideLastName || brideFirstName}
                            </h1>
                            <p 
                                className="text-xl md:text-2xl text-white/80"
                                style={{ fontFamily: config.typography.bodyFont }}
                            >
                                {eventDetailTitle}
                            </p>
                        </div>
                    </motion.div>

                    {/* Countdown Timer */}
                    <motion.div variants={itemVariants}>
                        <CountdownTimer config={config} eventDate={eventDate} />
                    </motion.div>

                    {/* Couple Section */}
                    <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-12">
                        <div className="text-center space-y-4 p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">G</span>
                            </div>
                            <div>
                                <h3 
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: config.colorScheme.text }}
                                >
                                    {groomFirstName} {groomLastName}
                                </h3>
                                <p className="text-white/70" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                    {groomFatherName && groomMotherName && (
                                        <>កូនរបស់ {groomFatherName} និង {groomMotherName}</>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="text-center space-y-4 p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">B</span>
                            </div>
                            <div>
                                <h3 
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: config.colorScheme.text }}
                                >
                                    {brideFirstName} {brideLastName}
                                </h3>
                                <p className="text-white/70" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                    {brideFatherName && brideMotherName && (
                                        <>កូនរបស់ {brideFatherName} និង {brideMotherName}</>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Event Details */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div className="text-center">
                            <h2 
                                className="text-3xl font-bold mb-8"
                                style={{ color: config.colorScheme.text }}
                            >
                                Event Details
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar size={20} style={{ color: config.colorScheme.primary }} />
                                    <h3 className="font-semibold" style={{ color: config.colorScheme.text }}>
                                        Date & Time
                                    </h3>
                                </div>
                                <p className="text-white/80" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                    {datePart}
                                </p>
                                <p className="text-white/60 text-sm mt-1">
                                    {timePart}
                                </p>
                            </div>

                            <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <MapPin size={20} style={{ color: config.colorScheme.primary }} />
                                    <h3 className="font-semibold" style={{ color: config.colorScheme.text }}>
                                        Location
                                    </h3>
                                </div>
                                <p className="text-white/80">
                                    {venueDetails || location}
                                </p>
                                {mapUrl && (
                                    <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        View Map →
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Message */}
                    {invitationMessage && (
                        <motion.div variants={itemVariants} className="text-center">
                            <div className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                <h3 
                                    className="text-2xl font-bold mb-4"
                                    style={{ color: config.colorScheme.text }}
                                >
                                    Message
                                </h3>
                                <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: kantumruy.style.fontFamily }}>
                                    {invitationMessage}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* RSVP */}
                    <motion.div variants={itemVariants} className="text-center">
                        <RSVPButton config={config} onRsvp={onRsvp} />
                    </motion.div>

                    {/* Calendar Link */}
                    <motion.div variants={itemVariants} className="text-center">
                        <a
                            href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                            style={{ fontFamily: config.typography.bodyFont }}
                        >
                            <Calendar size={16} />
                            Add to Calendar
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Music Control */}
            <MusicControl config={config} isPlaying={isPlaying} onToggle={toggleMusic} />
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop autoPlay />}
        </main>
    );
}
