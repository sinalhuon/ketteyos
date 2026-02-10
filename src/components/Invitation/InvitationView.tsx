'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, MapPin, Calendar, Heart, X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import localFont from 'next/font/local';
import { motion, AnimatePresence } from 'framer-motion';
import { Great_Vibes, Playfair_Display, Lato } from 'next/font/google';
import Image from 'next/image';
import { toKhmerDateTime, getCoupleTitles, getKhmerDateTimeParts, parseAndFormatKhmerTime, toKhmerNumber } from '@/lib/khmer-utils';
import { getEventDetailTitle, type EventType } from '@/lib/event-types';
import CountdownTimer from './CountdownTimer';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400'], subsets: ['latin'] });

const koulen = localFont({
    src: '../../../public/assets/fonts/Koulen-Regular.ttf',
    variable: '--font-koulen',
});

interface InvitationViewProps {
    guestName: string;
    eventTitle: string;
    eventDate: Date;
    location: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
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
}

export default function InvitationView(props: InvitationViewProps) {
    const {
        guestName,
        eventTitle,
        eventDate,
        location,
        musicUrl,
        logoUrl,
        logoSize = 150,
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
        eventType,
    } = props;

    const [hasOpened, setHasOpened] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);
    const [showIntroVideo, setShowIntroVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSlideshow, setIsSlideshow] = useState(false);
    const [activeScheduleDate, setActiveScheduleDate] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement>(null);

    // Initial autoplay logic moved to handleVideoEnd to prevent clash

    const handleOpen = () => {
        setShowIntroVideo(true);
        // Start music immediately when opening
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
    };

    const handleVideoEnd = () => {
        setShowIntroVideo(false);
        setIntroFinished(true);

        // Delay showing content
        setTimeout(() => {
            setHasOpened(true);
        }, 2000);
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

    // Gallery functions
    const openGallery = (index: number) => {
        setCurrentImageIndex(index);
        setGalleryOpen(true);
    };

    const closeGallery = () => {
        setGalleryOpen(false);
        setIsSlideshow(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % albumPhotos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length);
    };

    const toggleSlideshow = () => {
        setIsSlideshow(!isSlideshow);
    };

    // Slideshow effect
    useEffect(() => {
        if (isSlideshow && galleryOpen) {
            const interval = setInterval(nextImage, 3000);
            return () => clearInterval(interval);
        }
    }, [isSlideshow, galleryOpen, currentImageIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!galleryOpen) return;
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeGallery();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [galleryOpen]);

    // Touch swipe support
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(eventDate));
    const khmerDateTime = toKhmerDateTime(new Date(eventDate));
    const { timePart, datePart } = getKhmerDateTimeParts(new Date(eventDate));
    const coupleTitles = getCoupleTitles();
    const eventDetailTitle = getEventDetailTitle((eventType as EventType) || 'wedding');

    let scheduleItems: any[] = [];
    try {
        if (schedule) {
            scheduleItems = JSON.parse(schedule);
        }
    } catch (e) {
        console.error('Failed to parse schedule:', e);
    }

    // Group schedule items by date
    // Handles both new nested format [{date, activities: []}] and old flat format [{date, time, activity}]
    let uniqueDates: string[] = [];
    let scheduleByDate: any = {};

    if (Array.isArray(scheduleItems) && scheduleItems.length > 0) {
        if (scheduleItems[0].activities) {
            // New nested format
            scheduleItems.forEach((day: any) => {
                const date = day.date || 'other';
                scheduleByDate[date] = day.activities;
            });
        } else {
            // Old flat format
            scheduleItems.forEach((item: any) => {
                const date = item.date || 'other';
                if (!scheduleByDate[date]) scheduleByDate[date] = [];
                scheduleByDate[date].push(item);
            });
        }
        uniqueDates = Object.keys(scheduleByDate).sort();
    }

    // Set initial active date
    useEffect(() => {
        if (uniqueDates.length > 0 && !activeScheduleDate) {
            setActiveScheduleDate(uniqueDates[0]);
        }
    }, [uniqueDates, activeScheduleDate]);

    const fadeInScale = {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, margin: "-100px" as any },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    };

    const scrollAnimation = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" as any },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    };

    // Video URLs - Use props first, then fallbacks if not provided
    const introParams = props.introVideoUrl || "/uploads/video/1770281365052-first_screen.mp4";
    const transitionParams = props.transitionVideoUrl || "/uploads/video/middle%20screen.mov";
    const backgroundParams = props.backgroundVideoUrl || "/uploads/video/1770281380424-second_screen.mp4";

    return (
        <main className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden ${lato.className}`}>

            {/* Stage 1 Video (Intro) */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${introFinished || showIntroVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={introParams} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Stage 1.5 Video (Transition) */}
            {showIntroVideo && (
                <div className="absolute inset-0 z-30 bg-black">
                    <video
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnd}
                    >
                        <source src={transitionParams} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Stage 2 Video (Main) */}
            <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={backgroundParams} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Golden Particles Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Custom Effect Layer Video */}
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

                {/* Fallback CSS Particles (only if no effect layer?) - keeping both for now as they might complement */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-[#EEC573]/60 rounded-full animate-pulse" />
                <div className="absolute top-20 right-20 w-3 h-3 bg-[#EEC573]/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-32 left-16 w-2 h-2 bg-[#EEC573]/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-20 right-32 w-3 h-3 bg-[#EEC573]/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {!introFinished && !showIntroVideo ? (
                // --- STAGE 1: INTRO ---
                <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-8 animate-fade-in-up">
                    <div className="space-y-6 max-w-md w-full">
                        {logoUrl && (
                            <div
                                className="relative mb-4 mx-auto"
                                style={{ width: logoSize || 150, height: logoSize || 150 }}
                            >
                                <img src={logoUrl} alt="Wedding Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(238,197,115,0.5)]" />
                            </div>
                        )}

                        <div className="space-y-4">
                            <p className="text-[#EEC573] text-3xl tracking-wider" style={{ fontFamily: 'Moul, serif' }}>សូមគោរពអញ្ជើញ</p>
                            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#EEC573] to-transparent mx-auto" />
                            <p className={`text-white/90 text-xl lg:text-3xl font-bold tracking-widest ${koulen.className}`} style={{ color: '#F7E7CE' }}>
                                {guestName || "លោក ហួន ស៊ីណាល់"}
                            </p>
                        </div>

                        <button
                            onClick={handleOpen}
                            className="mt-8 px-10 py-3 border-2 border-[#EEC573] text-[#EEC573] rounded-full font-bold tracking-wider hover:bg-[#EEC573] hover:text-gray-900 transition-all shadow-[0_0_20px_rgba(238,197,115,0.3)] hover:shadow-[0_0_30px_rgba(238,197,115,0.6)]"
                        >
                            បើកការអញ្ជើញ
                        </button>
                    </div>
                </div>
            ) : hasOpened ? (
                // --- STAGE 2: SCROLLABLE CONTENT ---
                <div className="relative z-20 w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
                    <div
                        className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8"
                    >

                        {/* Logo Section */}
                        {logoUrl && (
                            <motion.div {...scrollAnimation} className="text-center">
                                <div
                                    className="relative mx-auto"
                                    style={{ width: logoSize || 150, height: logoSize || 150 }}
                                >
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(238,197,115,0.5)]" />
                                </div>
                            </motion.div>
                        )}

                        {/* Main Title - Moved closer to Logo with negative margin */}
                        <motion.div {...scrollAnimation} className="text-center space-y-3 -mt-6 relative z-10">
                            <div className="inline-block px-6 py-2 border-2 border-[#EEC573]/60 rounded-lg bg-black/30 backdrop-blur-sm">
                                <p className="text-[#EEC573] text-xl md:text-2xl" style={{ fontFamily: 'Moul, serif' }}>
                                    {eventDetailTitle}
                                </p>
                            </div>
                        </motion.div>

                        {/* Parents Names */}
                        {(groomFatherName || groomMotherName || brideFatherName || brideMotherName) && (
                            <motion.div {...scrollAnimation} className="grid grid-cols-2 gap-4 md:gap-8 text-center">
                                <div className="space-y-3">
                                    {groomFatherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {groomFatherName}
                                        </p>
                                    )}
                                    {groomMotherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {groomMotherName}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {brideFatherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {brideFatherName}
                                        </p>
                                    )}
                                    {brideMotherName && (
                                        <p className="text-white/90 text-lg md:text-xl font-medium" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {brideMotherName}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Invitation Message Box */}
                        {invitationMessage && (
                            <motion.div {...scrollAnimation} className="border-2 border-[#EEC573]/40 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20">
                                <div className="text-white/90 text-center space-y-4 whitespace-pre-wrap leading-relaxed text-base md:text-lg" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                    {invitationMessage}
                                </div>
                            </motion.div>
                        )}

                        {/* Couple Names */}
                        <motion.div {...scrollAnimation} className="text-center space-y-4">
                            <div className="grid grid-cols-2 gap-4 md:gap-8">
                                {groomLastName && groomFirstName && (
                                    <div className="space-y-2">
                                        <p className="text-[#EEC573]/70 text-sm md:text-base mb-1" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {coupleTitles.groom}
                                        </p>
                                        <p className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {groomFirstName}
                                        </p>
                                        <p className="text-[#EEC573] text-2xl md:text-4xl font-bold mt-1" style={{ fontFamily: 'Moul, serif' }}>
                                            {groomLastName}
                                        </p>
                                    </div>
                                )}
                                {brideLastName && brideFirstName && (
                                    <div className="space-y-2">
                                        <p className="text-[#EEC573]/70 text-sm md:text-base mb-1" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {coupleTitles.bride}
                                        </p>
                                        <p className="text-white text-xl md:text-2xl font-bold" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                            {brideFirstName}
                                        </p>
                                        <p className="text-[#EEC573] text-2xl md:text-4xl font-bold mt-1" style={{ fontFamily: 'Moul, serif' }}>
                                            {brideLastName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Date & Time in Khmer */}
                        <motion.div {...scrollAnimation} className="text-center space-y-4">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />

                            <div className="space-y-3">
                                {/* Time part - smaller, KantumruyPro */}
                                <p className="text-white/90 text-base md:text-lg" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                    {timePart}
                                </p>
                                {/* Date part - Moul */}
                                <p className="text-[#EEC573] text-lg md:text-2xl" style={{ fontFamily: 'Moul, serif' }}>
                                    {datePart}
                                </p>
                            </div>

                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />
                        </motion.div>

                        {/* Venue */}
                        {venueDetails && (
                            <motion.div {...scrollAnimation} className="border-2 border-[#EEC573]/40 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20 text-center">
                                <p className="text-[#EEC573] text-xl md:text-2xl mb-4" style={{ fontFamily: 'Moul, serif' }}>ទីតាំង</p>
                                <div className="text-white/90 space-y-2 whitespace-pre-wrap text-base md:text-lg leading-relaxed" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
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

                        {/* Schedule */}
                        {uniqueDates.length > 0 && (
                            <motion.div {...scrollAnimation} className="border-2 border-[#EEC573]/40 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20">
                                <p className="text-[#EEC573] text-xl md:text-2xl text-center mb-6" style={{ fontFamily: 'Moul, serif' }}>កម្មវិធី</p>

                                {uniqueDates.length > 1 && (
                                    <div className="flex justify-center gap-3 mb-8 border-b border-[#EEC573]/20 pb-4">
                                        {uniqueDates.map((date, idx) => (
                                            <button
                                                key={date}
                                                onClick={() => setActiveScheduleDate(date)}
                                                className={`px-5 py-2 rounded-full text-sm md:text-base font-bold transition-all ${activeScheduleDate === date
                                                    ? 'bg-[#EEC573] text-gray-900 shadow-[0_0_15px_rgba(238,197,115,0.4)]'
                                                    : 'text-[#EEC573] border border-[#EEC573]/40 hover:bg-[#EEC573]/10'
                                                    }`}
                                                style={{ fontFamily: 'Moul, serif' }}
                                            >
                                                ថ្ងៃទី {(() => {
                                                    try {
                                                        const d = new Date(date);
                                                        return !isNaN(d.getTime()) ? toKhmerNumber(d.getDate()) : toKhmerNumber(idx + 1);
                                                    } catch {
                                                        return toKhmerNumber(idx + 1);
                                                    }
                                                })()}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeScheduleDate}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {activeScheduleDate && scheduleByDate[activeScheduleDate]?.map((item: any, index: number) => (
                                            <div key={index} className="flex gap-4 text-base md:text-lg items-start">
                                                <div className="text-[#EEC573] font-bold min-w-[110px] pt-0.5" style={{ fontFamily: 'Moul, serif', fontSize: '13px' }}>
                                                    {parseAndFormatKhmerTime(item.time)}
                                                </div>
                                                <div className="text-white/90 flex-1 leading-relaxed" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                                                    {item.activity}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Album Photos */}
                        {albumPhotos.length > 0 && (
                            <motion.div {...scrollAnimation} className="space-y-6">
                                <p className="text-[#EEC573] text-xl text-center" style={{ fontFamily: 'Moul, serif' }}>រូបភាព</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-2">
                                    {albumPhotos.map((photo: any, index: number) => (
                                        <motion.div
                                            key={photo.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="relative aspect-square rounded-lg overflow-hidden border border-[#EEC573]/30 cursor-pointer group shadow-lg"
                                            onClick={() => openGallery(index)}
                                        >
                                            <Image
                                                src={photo.imageUrl}
                                                alt="Wedding Photo"
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] md:text-xs bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                                    ចុចដើម្បីមើល
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* RSVP Button */}
                        <div className="text-center pt-6">
                            <button className="px-8 py-3 border-2 border-[#EEC573] text-[#EEC573] rounded-full font-bold hover:bg-[#EEC573] hover:text-gray-900 transition-all shadow-[0_0_20px_rgba(238,197,115,0.3)]">
                                ឆ្លើយតប
                            </button>
                        </div>

                        {/* Countdown Timer */}
                        <CountdownTimer targetDate={eventDate} />

                        {/* Thank You */}
                        <div className="text-center text-white/70 text-xs md:text-sm pb-8" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                            អរគុណសម្រាប់ការចូលរួមរបស់លោកអ្នក
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Fullscreen Gallery Modal */}
            {galleryOpen && albumPhotos.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={closeGallery}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <X size={24} />
                    </button>

                    {/* Slideshow Toggle */}
                    <button
                        onClick={toggleSlideshow}
                        className="absolute top-4 right-16 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        {isSlideshow ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    {/* Previous Button */}
                    {albumPhotos.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}

                    {/* Image Container */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-16"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="relative max-w-6xl max-h-full w-full h-full">
                            <Image
                                src={albumPhotos[currentImageIndex].imageUrl}
                                alt={`Photo ${currentImageIndex + 1}`}
                                fill
                                className="object-contain transition-opacity duration-500"
                                priority
                            />
                        </div>
                    </div>

                    {/* Next Button */}
                    {albumPhotos.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
                        {currentImageIndex + 1} / {albumPhotos.length}
                    </div>
                </div>
            )}

            {musicUrl && (
                <button
                    onClick={toggleMusic}
                    className="fixed bottom-6 right-6 z-50 bg-[#EEC573]/20 backdrop-blur-sm p-3 rounded-full text-[#EEC573] border-2 border-[#EEC573]/50 shadow-lg hover:bg-[#EEC573] hover:text-gray-900 transition-all"
                >
                    {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
            )}

            {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}

            <style>{`
                @font-face {
                    font-family: 'Moul';
                    src: url('/assets/fonts/Moul-Regular.ttf') format('truetype');
                }
                @font-face {
                    font-family: 'KantumruyPro';
                    src: url('/assets/fonts/KantumruyPro-Regular.ttf') format('truetype');
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }
            `}</style>
        </main>
    );
}
