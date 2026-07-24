'use client';

import { useState, useRef, useEffect, type TouchEvent, type WheelEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Gift, Play, Pause, Maximize2, Minimize2, MousePointerClick } from 'lucide-react';
import { Playfair_Display, Inter, Cinzel } from 'next/font/google';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';
import ScrollUpGuide from '../ScrollUpGuide';
import OpenInvitationHint from '../OpenInvitationHint';
import { toKhmerTime } from '@/lib/khmer-utils';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] });

const moul = localFont({
    src: '../../../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-moul',
});

const koulen = localFont({
    src: '../../../../public/assets/fonts/Koulen-Regular.ttf',
    variable: '--font-koulen',
});

const kantumruy = localFont({
    src: '../../../../public/assets/fonts/KantumruyPro-Regular.ttf',
    variable: '--font-kantumruy',
});

type MovieCredit = {
    role: string;
    name: string;
    nameEn?: string;
};

interface Props {
    guestName?: string;
    eventDate?: Date;
    location?: string;
    musicUrl?: string | null;
    introVideoUrl?: string | null;
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
    storySlides?: Array<{
        id?: string;
        imageUrl?: string;
        title?: string;
        caption?: string;
        order?: number;
    }>;
    albumVideos?: string[];
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    transitionVideoUrl?: string | null;
    templateConfig?: any;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: any;
}

function normalizeMapUrl(value?: string | null) {
    const trimmed = value?.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('//')) return `https:${trimmed}`;
    if (/^(www\.)/i.test(trimmed)) return `https://${trimmed}`;
    return null;
}

function extractMapQuery(value?: string | null) {
    const trimmed = value?.trim();
    if (!trimmed) return null;

    const coordinateMatch = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (coordinateMatch) return `${coordinateMatch[1]},${coordinateMatch[2]}`;

    const normalizedUrl = normalizeMapUrl(trimmed);
    if (!normalizedUrl) return trimmed;

    try {
        const url = new URL(normalizedUrl);
        const params = url.searchParams;
        const coordinateParam = params.get('q') || params.get('query') || params.get('ll') || params.get('destination');
        if (coordinateParam?.trim()) return coordinateParam.trim();

        const pathCoordinateMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
        if (pathCoordinateMatch) return `${pathCoordinateMatch[1]},${pathCoordinateMatch[2]}`;

        const pathPlaceMatch = url.pathname.match(/\/place\/([^/]+)/);
        if (pathPlaceMatch?.[1]) return decodeURIComponent(pathPlaceMatch[1]).replace(/\+/g, ' ');

        return null;
    } catch {
        return trimmed;
    }
}

function GoldenDustField({ color, dense = false }: { color: string; dense?: boolean }) {
    const particles = dense
        ? [
            { left: '8%', delay: 0.2, duration: 10, size: 4 },
            { left: '16%', delay: 1.4, duration: 12, size: 6 },
            { left: '27%', delay: 0.8, duration: 9.5, size: 3 },
            { left: '39%', delay: 2.1, duration: 13, size: 5 },
            { left: '48%', delay: 1.1, duration: 11.5, size: 4 },
            { left: '57%', delay: 2.8, duration: 10.8, size: 6 },
            { left: '68%', delay: 0.5, duration: 12.4, size: 3 },
            { left: '77%', delay: 1.9, duration: 9.8, size: 5 },
            { left: '86%', delay: 0.9, duration: 11.2, size: 4 },
            { left: '93%', delay: 2.5, duration: 12.8, size: 6 },
        ]
        : [
            { left: '12%', delay: 0.6, duration: 14, size: 4 },
            { left: '31%', delay: 1.8, duration: 16, size: 5 },
            { left: '52%', delay: 0.9, duration: 13.4, size: 3 },
            { left: '71%', delay: 2.2, duration: 15.2, size: 5 },
            { left: '89%', delay: 1.3, duration: 14.8, size: 4 },
        ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((particle, index) => (
                <motion.div
                    key={`${particle.left}-${index}`}
                    className="absolute top-[-12%] rounded-full"
                    style={{
                        left: particle.left,
                        width: particle.size,
                        height: particle.size,
                        background: `radial-gradient(circle, rgba(255,255,255,0.95) 0%, ${color} 55%, rgba(255,255,255,0) 100%)`,
                        boxShadow: `0 0 12px ${color}`,
                    }}
                    animate={{
                        y: ['0vh', '118vh'],
                        x: [0, index % 2 === 0 ? 12 : -10, 0],
                        opacity: [0, 0.95, 0.55, 0],
                        scale: [0.7, 1, 0.85, 0.55],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: particle.delay,
                    }}
                />
            ))}
        </div>
    );
}

function GoldenFlareLayer({ color }: { color: string }) {
    const flares = [
        { top: '12%', left: '14%', rotate: -18, width: 180, delay: 0.4 },
        { top: '28%', left: '72%', rotate: 22, width: 220, delay: 1.1 },
        { top: '58%', left: '22%', rotate: -28, width: 210, delay: 1.8 },
        { top: '76%', left: '78%', rotate: 18, width: 170, delay: 0.9 },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {flares.map((flare, index) => (
                <motion.div
                    key={`${flare.top}-${flare.left}-${index}`}
                    className="absolute h-[2px] rounded-full opacity-70 blur-[1px]"
                    style={{
                        top: flare.top,
                        left: flare.left,
                        width: flare.width,
                        transform: `translateX(-50%) rotate(${flare.rotate}deg)`,
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.88), ${color}, transparent)`,
                        boxShadow: `0 0 16px ${color}`,
                    }}
                    animate={{ opacity: [0.1, 0.88, 0.18], scaleX: [0.7, 1, 0.78] }}
                    transition={{ duration: 4.6 + index * 0.7, repeat: Infinity, ease: 'easeInOut', delay: flare.delay }}
                />
            ))}
        </div>
    );
}

function GoldenGlowOrbs({ primary, accent }: { primary: string; accent: string }) {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute left-[-8%] top-[8%] h-52 w-52 rounded-full blur-3xl"
                style={{ backgroundColor: `${primary}22` }}
                animate={{ x: [0, 24, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute right-[-10%] top-[26%] h-64 w-64 rounded-full blur-3xl"
                style={{ backgroundColor: `${accent}15` }}
                animate={{ x: [0, -28, 0], y: [0, -12, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-[10%] left-[26%] h-44 w-44 rounded-full blur-3xl"
                style={{ backgroundColor: `${primary}18` }}
                animate={{ x: [0, 18, 0], y: [0, -16, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8.8, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

export default function GoldenGrandeurLayout(props: Props) {
    const {
        groomFirstName, groomLastName, brideFirstName, brideLastName,
        eventDate, location, venueDetails, mapUrl, invitationMessage,
        groomFatherName, groomMotherName, brideFatherName, brideMotherName,
        musicUrl, onRsvp, templateConfig, schedule, guestName,
        backgroundVideoUrl, backgroundImageUrl, transitionVideoUrl, introVideoUrl, logoUrl,
        albumPhotos = [], storySlides = [], albumVideos = [], paymentQrImageUrl
    } = props;

    const cs = templateConfig?.colorScheme || {
        primary: '#D4AF37',
        secondary: '#AA8439',
        accent: '#FFD700',
        background: '#0B0D17',
        text: '#F8F9FA',
        textSecondary: 'rgba(248, 249, 250, 0.7)',
        border: 'rgba(212, 175, 55, 0.3)',
        gradient: 'linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)'
    };
    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);

    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [showFlash, setShowFlash] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showScrollGuide, setShowScrollGuide] = useState(true);
    const [hasStartedDetailScroll, setHasStartedDetailScroll] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [transitionOverlayStage, setTransitionOverlayStage] = useState<'logoReveal' | 'countdownReveal' | 'galleryReveal'>('logoReveal');
    const [countdownValue, setCountdownValue] = useState(3);
    const [gallerySoftExit, setGallerySoftExit] = useState(false);
    const [detailFeatureIndex, setDetailFeatureIndex] = useState(0);
    const [detailFeatureDirection, setDetailFeatureDirection] = useState(0);
    const [detailFeatureAutoplay, setDetailFeatureAutoplay] = useState(false);
    const [detailFeatureFullscreen, setDetailFeatureFullscreen] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);
    const detailScrollRef = useRef<HTMLDivElement>(null);
    const detailSnapLockRef = useRef(false);
    const detailTouchStartYRef = useRef<number | null>(null);
    const locale = language === 'kh' ? 'km-KH' : 'en-US';
    const displayHeadingClass = language === 'kh' ? moul.className : playfair.className;
    const accentHeadingClass = language === 'kh' ? koulen.className : cinzel.className;
    const bodyClass = language === 'kh' ? kantumruy.className : inter.className;
    const eyebrowClass = language === 'kh' ? `${koulen.className} text-sm tracking-normal` : `${cinzel.className} text-[11px] uppercase tracking-[0.45em]`;
    const detailMetaClass = language === 'kh' ? `${kantumruy.className} tracking-normal` : `${inter.className} uppercase tracking-[0.2em]`;
    const scrollGuideLabel = language === 'kh' ? 'សូមអូសឡើងលើ' : 'Scroll Up';
    const specialGuestLabel = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Special Guest';
    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const openInvitationHintLabel = language === 'kh' ? 'ចុចត្រង់នេះ' : 'Tap Here';
    const saveTheDateLabel = language === 'kh' ? 'កត់ថ្ងៃទុកជាមុន' : 'Save the Date';
    const paymentQrTitle = language === 'kh' ? 'ស្កេនសម្រាប់ការទូទាត់' : 'Scan For Payment';
    const paymentQrHint = language === 'kh' ? 'អាចស្កេន QR នេះដើម្បីផ្ញើជូនពរជាអំណោយ' : 'Guests can scan this QR code to send a gift or payment.'; 
    const rsvpAcceptedLabel = language === 'kh' ? 'ទទួលការអញ្ជើញដោយក្តីរីករាយ' : 'Accept With Joy';
    const rsvpDeclinedLabel = language === 'kh' ? 'សូមអភ័យទោស មិនអាចចូលរួម' : 'Regretfully Decline';
    const rsvpThanksLabel = language === 'kh' ? 'សូមអរគុណសម្រាប់ការឆ្លើយតប' : 'Thank you for your gracious response';
    const eventLogoLabel = language === 'kh' ? 'សញ្ញាកម្មវិធី' : 'Event Monogram';
    const detailHeadingLabel = (() => {
        const eventType = String(props.eventType || '').toLowerCase();
        const isKnotTying = eventType.includes('knot') || eventType.includes('ចំណងដៃ');
        if (language === 'kh') {
            if (eventType.includes('birthday')) return 'រីករាយថ្ងៃកំណើត';
            if (eventType.includes('movie') || eventType.includes('film')) return 'សម្ភោធខ្សែភាពយន្ត';
            if (eventType.includes('house')) return 'ពិធីឡើងគេហដ្ឋានថ្មី';
            if (isKnotTying) return 'ពិធីកាត់ចំណងដៃ';
            if (eventType.includes('engagement')) return 'សិរីសួស្តីពិធីកាត់ចំណងដៃ';
            if (eventType.includes('wedding') || eventType.includes('មង្គលការ')) return 'សិរីសួស្តីអាពាហ៍ពិពាហ៍';
            return props.eventTitle || 'ព័ត៌មានកម្មវិធី';
        }
        if (eventType.includes('birthday')) return 'Happy Birthday';
        if (eventType.includes('movie') || eventType.includes('film')) return 'Movie Premiere';
        if (eventType.includes('house')) return 'Housewarming Ceremony';
        if (isKnotTying) return 'Knot Tying Ceremony';
        if (eventType.includes('engagement')) return 'Happy Engagement';
        if (eventType.includes('wedding')) return 'Happy Wedding';
        return 'Event Details';
    })();
    const inviteHeadingLabel = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'You Are Invited';
    const celebrationHeadingLabel = language === 'kh' ? 'កម្មវិធី' : 'The Celebration';
    const venueHeadingLabel = language === 'kh' ? 'ទីតាំង' : 'Venue';
    const openMapLabel = language === 'kh' ? 'បើកផែនទី' : 'Open Map';
    const addToCalendarLabel = language === 'kh' ? 'ដាក់ក្នុងប្រតិទិន' : 'Add To Calendar';
    const groomParentsLabel = persona.isCouple ? (language === 'kh' ? 'លោកមេបាកូនកម្លោះ' : "The Groom's Parents") : labels.familyTitle;
    const brideParentsLabel = language === 'kh' ? 'លោកមេបាកូនក្រមុំ' : "The Bride's Parents";
    const groomRoleLabel = persona.isCouple ? (language === 'kh' ? 'កូនកម្លោះនាម' : 'Groom') : labels.roleTitle;
    const brideRoleLabel = language === 'kh' ? 'កូនក្រមុំនាម' : 'Bride';
    const yourPresenceTitle = language === 'kh' ? 'ការចូលរួមរបស់អ្នក' : 'Your Presence';
    const yourPresenceHint = language === 'kh' ? 'យើងខ្ញុំមានកិត្តិយសយ៉ាងខ្លាំងប្រសិនបើបានទទួលការចូលរួមពីអ្នក' : 'We would be honored to celebrate with you';
    const khmerWeekdays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
    const toKhmerNumberString = (value: number | string) =>
        String(value)
            .split('')
            .map((char) => ('0123456789'.includes(char) ? '០១២៣៤៥៦៧៨៩'[Number(char)] : char))
            .join('');

    useEffect(() => {
        if (musicUrl && audioRef.current && phase !== 'intro') {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [musicUrl, phase]);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    useEffect(() => {
        if (phase !== 'details') {
            setShowScrollGuide(true);
            setHasStartedDetailScroll(false);
            return;
        }

        const handleScroll = () => {
            const scroller = detailScrollRef.current;
            const scrollTop = scroller ? scroller.scrollTop : window.scrollY;
            setShowScrollGuide(scrollTop <= 8);
            setHasStartedDetailScroll(scrollTop > 8);
        };

        const scroller = detailScrollRef.current;
        scroller?.addEventListener('scroll', handleScroll, { passive: true });
        if (!scroller) window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            scroller?.removeEventListener('scroll', handleScroll);
            if (!scroller) window.removeEventListener('scroll', handleScroll);
        };
    }, [phase]);

    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    const transitionDurationMs = Math.max(16000, Math.min(26000, Number(templateConfig?.transitionDurationSeconds || 19) * 1000));
    const firstAlbumPhoto = albumPhotos[0] as string | { imageUrl?: string } | undefined;
    const eventLogoUrl = logoUrl || (typeof firstAlbumPhoto === 'string' ? firstAlbumPhoto : firstAlbumPhoto?.imageUrl) || null;
    const transitionGalleryPhotos = (albumPhotos as Array<string | { imageUrl?: string }>)
        .map((photo) => (typeof photo === 'string' ? photo : photo?.imageUrl))
        .filter((value): value is string => Boolean(value))
        .slice(0, 18);
    const normalizedStorySlides = (Array.isArray(storySlides) ? storySlides : [])
        .map((slide, index) => ({
            id: String(slide?.id || `story-slide-${index}`),
            imageUrl: typeof slide?.imageUrl === 'string' ? slide.imageUrl : '',
            title: typeof slide?.title === 'string' ? slide.title : '',
            caption: typeof slide?.caption === 'string' ? slide.caption : '',
            order: typeof slide?.order === 'number' ? slide.order : index,
        }))
        .filter((slide) => slide.imageUrl)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    const fallbackFeatureSlides = (
        transitionGalleryPhotos.length > 0
            ? transitionGalleryPhotos
            : (eventLogoUrl ? [eventLogoUrl] : [])
    ).map((imageUrl, index) => ({
        id: `fallback-story-${index}`,
        imageUrl,
        title: '',
        caption: '',
        order: index,
    }));
    const detailFeatureSlides = normalizedStorySlides.length > 0 ? normalizedStorySlides : fallbackFeatureSlides;
    const detailFeaturePhoto = detailFeatureSlides[detailFeatureIndex]?.imageUrl || null;

    useEffect(() => {
        if (detailFeatureIndex > detailFeatureSlides.length - 1) {
            setDetailFeatureIndex(0);
        }
    }, [detailFeatureIndex, detailFeatureSlides.length]);

    useEffect(() => {
        if (!detailFeatureAutoplay || detailFeatureSlides.length <= 1) return;

        const autoplayTimer = window.setInterval(() => {
            setDetailFeatureDirection(1);
            setDetailFeatureIndex((prev) => (prev + 1) % detailFeatureSlides.length);
        }, 5600);

        return () => window.clearInterval(autoplayTimer);
    }, [detailFeatureAutoplay, detailFeatureSlides.length]);

    useEffect(() => {
        if (phase !== 'transition') {
            setTransitionOverlayStage('logoReveal');
            setCountdownValue(3);
            setGallerySoftExit(false);
            return;
        }

        const posterDelay = Math.min(5400, Math.max(3000, transitionDurationMs * 0.32));
        const countdownDuration = 3600;
        const galleryStartAt = posterDelay + countdownDuration;
        const galleryFadeDuration = 1800;
        const galleryFadeAt = Math.max(galleryStartAt + 5200, transitionDurationMs - galleryFadeDuration - 900);
        const countdownStartTimer = window.setTimeout(() => {
            setTransitionOverlayStage('countdownReveal');
            setCountdownValue(3);
        }, posterDelay);

        const countdownTickOne = window.setTimeout(() => {
            setCountdownValue(2);
        }, posterDelay + 1000);

        const countdownTickTwo = window.setTimeout(() => {
            setCountdownValue(1);
        }, posterDelay + 2000);

        const galleryTimer = window.setTimeout(() => {
            setTransitionOverlayStage('galleryReveal');
            setGallerySoftExit(false);
        }, galleryStartAt);

        const galleryFadeTimer = window.setTimeout(() => {
            setGallerySoftExit(true);
        }, galleryFadeAt);

        const finishTimer = window.setTimeout(() => {
            handleTransitionEnd();
        }, transitionDurationMs);

        return () => {
            window.clearTimeout(countdownStartTimer);
            window.clearTimeout(countdownTickOne);
            window.clearTimeout(countdownTickTwo);
            window.clearTimeout(galleryTimer);
            window.clearTimeout(galleryFadeTimer);
            window.clearTimeout(finishTimer);
        };
    }, [phase, transitionDurationMs]);
    const handleOpen = () => {
        setPhase('transition');
        setTransitionOverlayStage('logoReveal');
        setCountdownValue(3);
        setGallerySoftExit(false);
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    };

    const handleRsvpClick = async (status: 'ACCEPTED' | 'DECLINED') => {
        if (!onRsvp || rsvpSubmitting) return;
        try {
            setRsvpSubmitting(true);
            await onRsvp(status);
            setRsvpSent(true);
        } catch (error) {
            console.error('GoldenGrandeur RSVP failed', error);
        } finally {
            setRsvpSubmitting(false);
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

    const getDetailSections = () => {
        const scroller = detailScrollRef.current;
        if (!scroller) return [];
        return Array.from(scroller.querySelectorAll<HTMLElement>('[data-golden-detail-section]'));
    };

    const snapDetailSection = (direction: 1 | -1) => {
        const scroller = detailScrollRef.current;
        const sections = getDetailSections();
        if (!scroller || sections.length === 0 || detailSnapLockRef.current) return;

        const currentIndex = sections.reduce((closestIndex, section, index) => {
            const currentDistance = Math.abs(section.offsetTop - scroller.scrollTop);
            const closestDistance = Math.abs(sections[closestIndex].offsetTop - scroller.scrollTop);
            return currentDistance < closestDistance ? index : closestIndex;
        }, 0);
        const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
        if (nextIndex === currentIndex) return;

        detailSnapLockRef.current = true;
        scroller.scrollTo({ top: sections[nextIndex].offsetTop, behavior: 'smooth' });
        window.setTimeout(() => {
            detailSnapLockRef.current = false;
        }, 720);
    };

    const handleDetailWheel = (event: WheelEvent<HTMLDivElement>) => {
        if (phase !== 'details' || Math.abs(event.deltaY) < 24) return;
        event.preventDefault();
        snapDetailSection(event.deltaY > 0 ? 1 : -1);
    };

    const handleDetailTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        detailTouchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleDetailTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const startY = detailTouchStartYRef.current;
        detailTouchStartYRef.current = null;
        if (phase !== 'details' || startY === null) return;
        const endY = event.changedTouches[0]?.clientY ?? startY;
        const deltaY = startY - endY;
        if (Math.abs(deltaY) < 42) return;
        snapDetailSection(deltaY > 0 ? 1 : -1);
    };

    const dateStr = eventDate
        ? (() => {
            const parsedDate = new Date(eventDate);
            if (language === 'kh') {
                return `ថ្ងៃ${khmerWeekdays[parsedDate.getDay()]} ទី${toKhmerNumberString(parsedDate.getDate())} ខែ${khmerMonths[parsedDate.getMonth()]} ឆ្នាំ${toKhmerNumberString(parsedDate.getFullYear())}`;
            }
            return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parsedDate);
        })()
        : '';
    const timeStr = eventDate ? (language === 'kh'
        ? toKhmerTime(new Date(eventDate))
        : new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(eventDate))) : '';
    const calendarUrl = eventDate
        ? (() => {
            try {
                const startDate = new Date(eventDate);
                const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
                const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
                const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
                const calendarTitle = persona.isCouple
                    ? `${groomFirstName || ''} & ${brideFirstName || ''}`.trim()
                    : persona.primaryFullName || props.eventTitle || labels.eventTitle;
                return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(calendarTitle)}&dates=${start}/${end}&details=${encodeURIComponent(invitationMessage || '')}&location=${encodeURIComponent(location || '')}`;
            } catch {
                return '#';
            }
        })()
        : '#';
    const mapLinkUrl = normalizeMapUrl(mapUrl) || (location || venueDetails
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || venueDetails || '')}`
        : null);
    const groomFullName = [groomFirstName, groomLastName].filter(Boolean).join(' ') || groomLastName || groomFirstName || '';
    const brideFullName = [brideFirstName, brideLastName].filter(Boolean).join(' ') || brideLastName || brideFirstName || '';
    const coupleLastNameLine = [groomLastName || groomFirstName, brideLastName || brideFirstName].filter(Boolean).join(' & ');
    const hasPrimaryFamilyInfo = Boolean(groomFatherName || groomMotherName || groomFullName);
    const hasSecondaryFamilyInfo = Boolean(brideFatherName || brideMotherName || brideFullName);
    const shouldShowFamilySection = persona.isCouple ? (hasPrimaryFamilyInfo || hasSecondaryFamilyInfo) : hasPrimaryFamilyInfo;
    const detailDisplayName = persona.isCouple ? persona.coupleLine : persona.primaryFullName || props.eventTitle || labels.eventTitle;
    const eventDisplayTitle = props.eventTitle || labels.eventTitle || detailDisplayName;
    const uploadedBackgroundMedia = backgroundVideoUrl || backgroundImageUrl || null;
    const uploadedIntroMedia = introVideoUrl || backgroundImageUrl || backgroundVideoUrl || null;
    const renderEventLogoFrame = (sizeClass = 'h-28 w-28 md:h-32 md:w-32', roundedClass = 'rounded-full') => {
        if (!eventLogoUrl) return null;

        return (
            <div className={`relative mx-auto ${sizeClass}`}>
                <motion.div
                    className={`absolute inset-[-10%] ${roundedClass} blur-2xl`}
                    style={{ background: `radial-gradient(circle, ${cs.accent}38 0%, ${cs.primary}14 46%, transparent 78%)` }}
                    animate={{ scale: [0.98, 1.04, 1], opacity: [0.45, 0.75, 0.5] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div
                    className={`absolute inset-[-4%] ${roundedClass} border`}
                    style={{ borderColor: `${cs.primary}66`, boxShadow: `0 0 18px ${cs.primary}20` }}
                />
                <div
                    className={`relative h-full w-full overflow-hidden ${roundedClass} border p-[4px] shadow-[0_18px_40px_rgba(0,0,0,0.35)]`}
                    style={{
                        borderColor: `${cs.primary}cc`,
                        background: `linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 35%, ${cs.primary}35 100%)`,
                        boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 0 18px ${cs.primary}20`,
                    }}
                >
                    <div
                        className={`relative h-full w-full overflow-hidden ${roundedClass} bg-black/20`}
                        style={{ boxShadow: 'inset 0 0 24px rgba(0,0,0,0.25)' }}
                    >
                        <img src={eventLogoUrl} alt={eventLogoLabel} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.38),transparent_38%)]" />
                    </div>
                </div>
            </div>
        );
    };

    const renderTransitionOrnateLogoFrame = () => {
        if (!eventLogoUrl) return null;

        return (
            <div className="relative mx-auto h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-h-[58rem] max-w-[32rem] sm:h-[calc(100vh-2.5rem)] sm:w-[min(calc(100vw-1.5rem),32rem)]">
                <motion.div
                    className="absolute inset-[-6%] rounded-[28px] blur-3xl"
                    style={{ background: `radial-gradient(circle, rgba(255,245,214,0.8) 0%, ${cs.primary}25 35%, transparent 76%)` }}
                    animate={{ opacity: [0.45, 0.9, 0.55], scale: [0.96, 1.04, 0.98] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div
                    className="absolute inset-0 overflow-hidden rounded-[10px]"
                    style={{
                        border: `1.5px solid rgba(216, 184, 112, 0.85)`,
                        boxShadow: `0 16px 48px rgba(0,0,0,0.3), 0 0 24px ${cs.primary}20`,
                        background: 'linear-gradient(180deg, #fff7e8 0%, #f4e4bd 100%)',
                    }}
                />

                <div
                    className="absolute inset-x-0 top-0 h-[52%] overflow-hidden"
                    style={{
                        clipPath: 'ellipse(88% 100% at 50% 0%)',
                    }}
                >
                    <img src={eventLogoUrl} alt={eventLogoLabel} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.2),transparent_44%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_34%,rgba(255,248,230,0.22))]" />
                    <div className="absolute inset-0" style={{ boxShadow: 'inset 0 -60px 80px rgba(255,247,232,0.85)' }} />
                </div>

                <div className="pointer-events-none absolute left-6 top-6 h-24 w-24 border-l-2 border-t-2" style={{ borderColor: 'rgba(195,161,95,0.9)' }} />
                <div className="pointer-events-none absolute right-6 bottom-6 h-24 w-24 border-r-2 border-b-2" style={{ borderColor: 'rgba(195,161,95,0.9)' }} />
                <div className="absolute left-3 top-3 text-[2.8rem] leading-none opacity-80" style={{ color: 'rgba(195,161,95,0.9)' }}>❦</div>
                <div className="absolute right-3 bottom-3 rotate-180 text-[2.8rem] leading-none opacity-80" style={{ color: 'rgba(195,161,95,0.9)' }}>❦</div>

                <div
                    className="absolute inset-x-0 bottom-0 h-[54%]"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,248,235,0) 0%, #fff5df 16%, #f4e3bb 100%)',
                        clipPath: 'ellipse(120% 100% at 50% 100%)',
                    }}
                />

                <div className="absolute left-0 right-0 top-[47%] px-6 text-center md:px-8">
                    <div className="mx-auto max-w-[18rem]">
                        <div className="inline-block rounded-full bg-[#3d3a38] px-4 py-1.5 shadow-md">
                            <p className={`text-[10px] uppercase tracking-[0.22em] ${cinzel.className}`} style={{ color: '#fff8e8' }}>
                                {saveTheDateLabel}
                            </p>
                        </div>
                    </div>

                    <p className={`mt-5 text-[10px] tracking-[0.34em] uppercase ${cinzel.className}`} style={{ color: '#5f5241' }}>
                        {detailHeadingLabel}
                    </p>
                    <h2 className={`mt-4 text-[2rem] leading-none md:text-[2.7rem] ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: '#2b241d' }}>
                        {persona.isCouple ? coupleLastNameLine : detailDisplayName}
                    </h2>

                    <p className={`mx-auto mt-4 max-w-[18rem] text-sm leading-relaxed md:text-base ${bodyClass}`} style={{ color: '#5c5247' }}>
                        {invitationMessage || (language === 'kh' ? 'សូមអញ្ជើញចូលរួមអបអរសាទរក្នុងថ្ងៃពិសេសរបស់យើងខ្ញុំ។' : 'Join us as we celebrate our special day together.')}
                    </p>

                    <div className="mx-auto mt-6 max-w-[18rem] border-t border-b py-3" style={{ borderColor: 'rgba(195,161,95,0.55)' }}>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
                            <div>
                                <p className={`text-[11px] uppercase tracking-[0.18em] ${cinzel.className}`} style={{ color: '#5f5241' }}>{timeStr}</p>
                            </div>
                            <div className="h-6 w-px bg-[#c3a15f]/50" />
                            <div>
                                <p className={`text-[11px] uppercase tracking-[0.18em] ${cinzel.className}`} style={{ color: '#5f5241' }}>{dateStr}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className={`text-sm md:text-base ${bodyClass}`} style={{ color: '#2b241d' }}>
                            {location}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderTransitionGalleryFrames = () => {
        if (transitionGalleryPhotos.length === 0) return renderTransitionOrnateLogoFrame();
        const collagePhotos = [
            transitionGalleryPhotos[0],
            transitionGalleryPhotos[1] || transitionGalleryPhotos[0],
            transitionGalleryPhotos[2] || transitionGalleryPhotos[0],
        ];
        const mainGalleryImage = eventLogoUrl || transitionGalleryPhotos[0];
        const smallPhotoRotations = [-7, -5, -7];
        const smallPhotoOffsets = [
            'left-[5%] top-[12%]',
            'left-[5%] top-[35%]',
            'left-[5%] top-[58%]',
        ];

        return (
            <motion.div
                animate={gallerySoftExit ? { opacity: 0, scale: 0.985, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
                className="relative mx-auto h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-h-[58rem] max-w-[32rem] overflow-hidden sm:h-[calc(100vh-2.5rem)] sm:w-[min(calc(100vw-1.5rem),32rem)]"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                >
                    <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#ece7df] shadow-[0_24px_50px_rgba(0,0,0,0.22)]">
                        <img src={mainGalleryImage} alt={eventLogoLabel} className="absolute inset-0 h-full w-full object-cover opacity-90" />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,234,225,0.95)_0%,rgba(239,234,225,0.72)_30%,rgba(239,234,225,0.2)_58%,rgba(0,0,0,0.08)_100%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_34%)]" />

                        <div className="absolute right-[4%] top-[12%] h-[72%] w-[57%] overflow-hidden rounded-[10px] shadow-[0_22px_36px_rgba(0,0,0,0.18)]">
                            <img src={mainGalleryImage} alt="Main gallery" className="h-full w-full object-cover" />
                        </div>

                        <div className="absolute left-[40%] top-[8%] text-center text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.35)]">
                            <p
                                className="text-[1.55rem] italic md:text-[1.95rem]"
                                style={{ fontFamily: '"Snell Roundhand", "Brush Script MT", cursive', fontStyle: 'italic' }}
                            >
                                {persona.isCouple ? coupleLastNameLine : detailDisplayName}
                            </p>
                            <p className={`mt-1 text-xs italic ${bodyClass}`} style={{ fontStyle: 'italic' }}>{dateStr}</p>
                        </div>

                        {collagePhotos.map((photoUrl, index) => (
                            <motion.div
                                key={`${photoUrl}-${index}`}
                                initial={{ opacity: 0, x: -22, y: 18 }}
                                animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
                                transition={{
                                    delay: 0.8 + index * 0.8,
                                    duration: 1.15,
                                    y: { duration: 5.5 + index, repeat: Infinity, ease: 'easeInOut' }
                                }}
                                className={`absolute ${smallPhotoOffsets[index]} z-10 w-[30%] sm:w-[28%]`}
                            >
                                <div
                                    className="overflow-hidden rounded-[4px] border-[6px] border-white bg-white p-1 shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                                    style={{ transform: `rotate(${smallPhotoRotations[index]}deg)` }}
                                >
                                    <img src={photoUrl} alt={`Collage ${index + 1}`} className="aspect-[4/5] w-full object-cover" />
                                </div>
                            </motion.div>
                        ))}

                        <div className="absolute inset-x-0 bottom-[4%] text-center">
                            <div className="mx-auto mb-3 h-24 w-[88%] max-w-[24rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,248,235,0.96),rgba(255,248,235,0.78)_48%,rgba(255,248,235,0.18)_78%,transparent_100%)] blur-[2px]" />
                            <p
                                className={`relative z-10 ${language === 'kh' ? moul.className : playfair.className} text-[2rem] md:text-[2.6rem]`}
                                style={{
                                    color: cs.primary,
                                    fontFamily: language === 'kh' ? undefined : '"Snell Roundhand", "Brush Script MT", cursive',
                                    textShadow: '0 4px 14px rgba(0,0,0,0.38), 0 0 10px rgba(255,215,0,0.22)',
                                }}
                            >
                                {language === 'kh' ? 'សិរីសួស្តីអាពាហ៍ពិពាហ៍' : 'Happy Wedding'}
                            </p>
                            <p
                                className={`relative z-10 mx-auto mt-3 max-w-[17rem] text-[13px] leading-relaxed md:text-[15px] ${bodyClass}`}
                                style={{
                                    color: cs.text,
                                    textShadow: '0 3px 12px rgba(0,0,0,0.42), 0 0 6px rgba(255,255,255,0.18)',
                                }}
                            >
                                {language === 'kh'
                                    ? 'សូមអញ្ជើញទស្សនាអនុស្សាវរីយ៍ដ៏ស្រស់ស្អាតមុនពេលចូលទៅកាន់ព័ត៌មានកម្មវិធី'
                                    : 'Enjoy a few beautiful memories before entering the full event details.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    const renderTransitionCountdown = () => (
        <div className="relative flex h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] max-h-[58rem] max-w-[32rem] items-center justify-center sm:h-[calc(100vh-2.5rem)] sm:w-[min(calc(100vw-1.5rem),32rem)]">
            <div
                className="relative flex h-44 w-44 items-center justify-center rounded-full border md:h-52 md:w-52"
                style={{
                    borderColor: `${cs.primary}99`,
                    background: 'radial-gradient(circle, rgba(255,248,230,0.24) 0%, rgba(10,12,24,0.32) 62%, rgba(10,12,24,0.08) 100%)',
                    boxShadow: `0 0 30px ${cs.primary}30, inset 0 0 36px rgba(255,255,255,0.08)`,
                }}
            >
                <div className="absolute inset-[10px] rounded-full border" style={{ borderColor: `${cs.primary}55` }} />
                <div className="absolute inset-[-10%] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${cs.accent}35 0%, transparent 70%)` }} />
                <AnimatePresence mode="wait">
                    <motion.p
                        key={countdownValue}
                        initial={{ opacity: 0, scale: 0.75, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.08, y: -8 }}
                        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute text-6xl md:text-7xl ${accentHeadingClass}`}
                        style={{ color: cs.primary, textShadow: '0 10px 28px rgba(0,0,0,0.35)' }}
                    >
                        {countdownValue}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );

    const renderDetailFeaturePhoto = () => {
        if (!detailFeaturePhoto) return null;
        const activeStorySlide = detailFeatureSlides[detailFeatureIndex];

        const paginateDetailFeature = (direction: number) => {
            if (detailFeatureSlides.length <= 1) return;
            setDetailFeatureDirection(direction);
            setDetailFeatureIndex((prev) => {
                const next = prev + direction;
                if (next < 0) return detailFeatureSlides.length - 1;
                if (next >= detailFeatureSlides.length) return 0;
                return next;
            });
        };

        const renderStoryCardContent = (isFullscreen = false) => (
            <div className={`relative overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(250,242,231,0.88)_45%,rgba(242,226,208,0.64)_100%)] px-4 pb-5 pt-6 text-center md:px-10 md:pb-8 md:pt-10 ${isFullscreen ? 'min-h-[78vh] flex flex-col justify-center' : ''}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.65),transparent_34%)]" />
                <button
                    type="button"
                    onClick={() => setDetailFeatureFullscreen((prev) => !prev)}
                    className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border"
                    style={{ borderColor: '#d7b8bc', color: '#8b6670', backgroundColor: 'rgba(255,255,255,0.74)' }}
                    aria-label={isFullscreen ? 'Collapse story' : 'Expand story'}
                >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <div className="relative z-10">
                    <p
                        className="text-[clamp(1.55rem,8vw,2rem)] leading-tight md:text-[2.7rem]"
                        style={{
                            color: '#8b6670',
                            fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
                        }}
                    >
                        {activeStorySlide?.title || (language === 'kh' ? 'រឿងរ៉ាវស្នេហា' : 'Love Story')}
                    </p>
                    <p
                        className={language === 'kh' ? `mt-1 text-xs md:text-sm ${kantumruy.className}` : `mt-1 text-xs uppercase tracking-[0.26em] ${cinzel.className}`}
                        style={{ color: '#a37b84', letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase' }}
                    >
                        {activeStorySlide?.caption || (language === 'kh' ? 'អនុស្សាវរីយ៍ដ៏ស្រស់ស្អាត' : 'Two Hearts, One Promise')}
                    </p>

                    <div className={`mx-auto mt-4 md:mt-8 ${isFullscreen ? 'max-w-[520px]' : 'max-w-[320px] md:max-w-[380px]'}`}>
                        <AnimatePresence mode="wait" custom={detailFeatureDirection}>
                            <motion.div
                                key={`${detailFeaturePhoto}-${detailFeatureIndex}-${isFullscreen ? 'full' : 'normal'}`}
                                custom={detailFeatureDirection}
                                initial={{ opacity: 0, x: detailFeatureDirection >= 0 ? 46 : -46, rotateY: detailFeatureDirection >= 0 ? -10 : 10, filter: 'blur(5px)' }}
                                animate={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: detailFeatureDirection >= 0 ? -46 : 46, rotateY: detailFeatureDirection >= 0 ? 10 : -10, filter: 'blur(4px)' }}
                                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                drag={detailFeatureSlides.length > 1 ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.14}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -70) paginateDetailFeature(1);
                                    if (info.offset.x > 70) paginateDetailFeature(-1);
                                }}
                                className="rotate-[-3deg] rounded-[10px] bg-white p-3 shadow-[0_20px_40px_rgba(153,121,128,0.22)] cursor-zoom-in md:p-4"
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => !isFullscreen && setDetailFeatureFullscreen(true)}
                            >
                                <div className="overflow-hidden rounded-[4px] border border-[#efe7de] bg-[#f8f2ec]">
                                    <img
                                        src={detailFeaturePhoto}
                                        alt="Love story"
                                        className={isFullscreen ? 'h-[48vh] w-full object-cover md:h-[58vh]' : 'h-[clamp(14rem,42vh,20rem)] w-full object-cover md:h-[380px]'}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {detailFeatureSlides.length > 1 && (
                            <div className="mt-3 flex items-center justify-center gap-2 md:mt-4 md:gap-3">
                                <button
                                    type="button"
                                    onClick={() => paginateDetailFeature(-1)}
                                    className={`rounded-full border px-3 py-1 text-[11px] md:text-xs ${bodyClass}`}
                                    style={{ borderColor: '#d7b8bc', color: '#8b6670', backgroundColor: 'rgba(255,255,255,0.58)' }}
                                >
                                    {language === 'kh' ? 'មុន' : 'Prev'}
                                </button>
                                <p
                                    className={language === 'kh' ? `text-[11px] ${kantumruy.className}` : `text-[11px] tracking-[0.24em] uppercase ${cinzel.className}`}
                                    style={{ color: '#a37b84', letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase' }}
                                >
                                    {language === 'kh' ? 'អូសដើម្បីបើកទំព័រ' : 'Swipe To Turn Page'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setDetailFeatureAutoplay((prev) => !prev)}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] md:gap-2 md:text-xs ${bodyClass}`}
                                    style={{ borderColor: '#d7b8bc', color: '#8b6670', backgroundColor: 'rgba(255,255,255,0.58)' }}
                                >
                                    {detailFeatureAutoplay ? <Pause size={14} /> : <Play size={14} />}
                                    <span>{language === 'kh' ? (detailFeatureAutoplay ? 'ផ្អាក' : 'ចាក់ស្វ័យប្រវត្តិ') : (detailFeatureAutoplay ? 'Pause' : 'Play')}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => paginateDetailFeature(1)}
                                    className={`rounded-full border px-3 py-1 text-[11px] md:text-xs ${bodyClass}`}
                                    style={{ borderColor: '#d7b8bc', color: '#8b6670', backgroundColor: 'rgba(255,255,255,0.58)' }}
                                >
                                    {language === 'kh' ? 'បន្ទាប់' : 'Next'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 space-y-1.5 md:mt-8 md:space-y-2">
                        <p className={`text-[1.3rem] md:text-[1.7rem] ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: '#8b6670' }}>
                            {detailDisplayName}
                        </p>
                        <p
                            className={language === 'kh' ? `text-sm ${kantumruy.className}` : `text-xs uppercase tracking-[0.24em] ${cinzel.className}`}
                            style={{ color: '#a37b84', letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase' }}
                        >
                            {language === 'kh' ? 'ថ្ងៃពិសេសចាប់ផ្តើមពីទីនេះ' : 'Forever Starts Today'}
                        </p>
                    </div>
                </div>
            </div>
        );

        return (
            <section
                data-golden-detail-section
                className="flex min-h-screen snap-start snap-always items-start px-5 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(2rem,calc(env(safe-area-inset-top)+1.5rem))] md:items-center md:px-6 md:py-8"
            >
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.25 }}
                    className="mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border p-3 md:p-4"
                    style={{
                        borderColor: `${cs.primary}33`,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.24)',
                    }}
                >
                    {renderStoryCardContent(false)}
                </motion.div>
                <AnimatePresence>
                    {detailFeatureFullscreen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(6,9,18,0.52)] px-4 py-6 backdrop-blur-sm"
                            onClick={() => setDetailFeatureFullscreen(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 6 }}
                                transition={{ duration: 0.45, ease: 'easeOut' }}
                                className="relative w-full max-w-6xl"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div
                                    className="mx-auto max-w-5xl overflow-hidden rounded-[30px] border p-4"
                                    style={{
                                        borderColor: `${cs.primary}33`,
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                                        boxShadow: '0 24px 60px rgba(0,0,0,0.24)',
                                    }}
                                >
                                    {renderStoryCardContent(true)}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        );
    };

    const renderIntroOpenButton = () => {
        const renderInlineOpenHint = () => (
            <motion.span
                className="pointer-events-none absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-lg backdrop-blur-md md:right-4"
                style={{
                    borderColor: cs.border,
                    background: 'rgba(7,10,22,0.38)',
                    color: cs.primary,
                    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))',
                }}
                initial={{ opacity: 0, x: 8, scale: 0.96 }}
                animate={{ opacity: 1, x: [0, -4, 0], scale: [1, 1.08, 1], rotate: [-8, -3, -8] }}
                transition={{
                    opacity: { delay: 1.1, duration: 0.28 },
                    x: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                    scale: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                }}
                aria-hidden="true"
            >
                <motion.span
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: cs.primary }}
                    animate={{ scale: [1, 1.95, 2.35], opacity: [0.72, 0.26, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                    className="absolute inset-0 rounded-full border-2"
                    style={{ borderColor: cs.primary }}
                    animate={{ scale: [1, 1.95, 2.35], opacity: [0.72, 0.26, 0] }}
                    transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <MousePointerClick size={22} className="relative z-10" />
            </motion.span>
        );

        if (props.buttonImageUrl) {
            return (
                <div className="relative inline-block mt-1">
                    <img src={props.buttonImageUrl} alt="Open Invitation" className="h-16 w-auto object-contain drop-shadow-xl md:h-20" />
                    {templateConfig?.showButtonText !== false && (
                        <span
                            className={`absolute inset-0 flex items-center justify-center px-6 text-sm ${language === 'kh' ? koulen.className : cinzel.className}`}
                            style={{
                                color: templateConfig?.openButtonTextColor || '#4A3511',
                                fontWeight: language === 'kh' ? 500 : 700,
                                textTransform: language === 'kh' ? 'none' : 'uppercase',
                                letterSpacing: language === 'kh' ? '0' : '0.18em',
                                textShadow: '0 1px 2px rgba(255,255,255,0.35)',
                            }}
                        >
                            {openInvitationLabel}
                        </span>
                    )}
                </div>
            );
        }

        return (
            <div
                className={`relative rounded-full py-4 pl-10 pr-16 text-sm shadow-[0_18px_30px_rgba(0,0,0,0.35)] md:pr-[4.5rem] ${language === 'kh' ? `${koulen.className} tracking-normal` : `${cinzel.className} uppercase tracking-[0.24em] font-semibold`}`}
                style={{ background: cs.gradient, color: templateConfig?.openButtonTextColor || cs.background }}
            >
                {openInvitationLabel}
                {renderInlineOpenHint()}
            </div>
        );
    };

    const renderGoldenFallbackBackground = (variant: 'ambient' | 'transition' = 'ambient') => (
        <div className="w-full h-full bg-gradient-to-b from-black via-[#0B0D17] to-black">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: variant === 'transition'
                        ? `radial-gradient(circle at 50% 30%, ${cs.primary}22 0%, transparent 48%), linear-gradient(130deg, rgba(255,255,255,0.03) 12%, transparent 12%, transparent 38%, rgba(212,175,55,0.06) 38%, rgba(212,175,55,0.06) 42%, transparent 42%, transparent 100%)`
                        : `radial-gradient(circle at 50% 50%, ${cs.primary}30 0%, transparent 62%), linear-gradient(145deg, rgba(255,255,255,0.03) 8%, transparent 8%, transparent 34%, rgba(212,175,55,0.04) 34%, rgba(212,175,55,0.04) 38%, transparent 38%, transparent 100%)`,
                }}
            />
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: `${cs.secondary}20` }} />
            <div className="absolute -right-24 bottom-8 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: `${cs.primary}14` }} />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 180px, ${cs.text} 180px, ${cs.text} 181px)` }} />
        </div>
    );

    const renderGoldenBackgroundMedia = (media?: string | null, fallbackVariant: 'ambient' | 'transition' = 'ambient') => {
        if (!media) return renderGoldenFallbackBackground(fallbackVariant);
        if (isVideoUrl(media)) {
            return <video src={media} autoPlay loop muted playsInline className="w-full h-full object-cover" />;
        }
        return <img src={media} className="w-full h-full object-cover" alt="bg" />;
    };

    let scheduleItems: any[] = [];
    let scheduleGroups: { date: string; items: any[] }[] = [];
    try {
        if (schedule) {
            const parsedSchedule = JSON.parse(schedule);
            if (Array.isArray(parsedSchedule) && parsedSchedule.length > 0) {
                if (parsedSchedule[0]?.activities && Array.isArray(parsedSchedule[0].activities)) {
                    scheduleGroups = parsedSchedule.map((day: any) => {
                        const items = (day.activities || []).map((activity: any) => ({
                            date: day.date,
                            time: activity.time,
                            activity: activity.activity || activity.title,
                            activityEn: activity.activityEn || activity.titleEn || '',
                            title: activity.title,
                            titleEn: activity.titleEn,
                            description: activity.description,
                            descriptionEn: activity.descriptionEn,
                        }));
                        scheduleItems.push(...items);
                        return {
                            date: day.date,
                            items,
                        };
                    });
                } else {
                    scheduleItems = parsedSchedule;
                    const grouped = parsedSchedule.reduce((acc: Record<string, any[]>, item: any) => {
                        const key = item.date || 'other';
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(item);
                        return acc;
                    }, {});
                    scheduleGroups = Object.entries(grouped).map(([date, items]) => ({ date, items }));
                }
            }
        }
    } catch (_) { }

    if (scheduleItems.length > 0 && scheduleGroups.length === 0) {
        scheduleGroups = [{ date: '', items: scheduleItems }];
    }

    const formatScheduleDate = (value?: string) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        if (language === 'kh') {
            return `ថ្ងៃទី${toKhmerNumberString(parsed.getDate())} ខែ${khmerMonths[parsed.getMonth()]} ឆ្នាំ${toKhmerNumberString(parsed.getFullYear())}`;
        }
        return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
    };

    return (
        <main className={`relative min-h-screen overflow-x-hidden ${inter.className}`} style={{ backgroundColor: cs.background, color: cs.text }}>
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {renderGoldenBackgroundMedia(uploadedBackgroundMedia, 'ambient')}
            </div>
            <div
                className="fixed inset-0 z-[1] pointer-events-none"
                style={{
                    background: `
                        linear-gradient(180deg, rgba(4,6,16,0.38) 0%, rgba(8,10,22,0.52) 45%, rgba(5,7,18,0.74) 100%),
                        radial-gradient(circle at top, rgba(255,215,0,0.12), transparent 42%)
                    `
                }}
            />
            <div className="fixed inset-0 z-[2] pointer-events-none">
                <GoldenGlowOrbs primary={cs.primary} accent={cs.accent} />
                <GoldenFlareLayer color={cs.primary} />
                <GoldenDustField color={cs.accent} />
            </div>

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                    <motion.div
                        key="intro"
                        className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-[33vh] sm:pt-[36vh] md:pt-[42vh]"
                        exit={{ opacity: 0, y: -100, transition: { duration: 0.8 } }}
                    >
                        <div className="absolute inset-0">
                            {renderGoldenBackgroundMedia(uploadedIntroMedia, 'ambient')}
                        </div>
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `
                                    linear-gradient(180deg, rgba(3,5,14,0.28) 0%, rgba(7,9,20,0.44) 42%, rgba(5,7,18,0.7) 100%),
                                    radial-gradient(circle at 50% 18%, rgba(255,215,0,0.14), transparent 36%)
                                `
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none">
                            <GoldenGlowOrbs primary={cs.primary} accent={cs.accent} />
                            <GoldenFlareLayer color={cs.primary} />
                            <GoldenDustField color={cs.accent} />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 w-full max-w-lg px-8 pb-10 pt-6 text-center"
                        >
                            <div className="relative z-10 space-y-8">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${cs.primary})` }} />
                                        <p className={`${eyebrowClass} shrink-0 whitespace-nowrap ${language === 'kh' ? 'text-[clamp(1.15rem,5.2vw,1.55rem)] leading-none md:text-[1.9rem]' : 'text-sm md:text-base'}`} style={{ color: cs.primary }}>{detailHeadingLabel}</p>
                                        <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${cs.primary}, transparent)` }} />
                                    </div>
                                    {!persona.isCouple && renderEventLogoFrame()}
                                    {!persona.isCouple && (
                                        <h1
                                            className={`text-[1.75rem] leading-[1.12] md:text-[2.35rem] ${displayHeadingClass}`}
                                            style={{ color: cs.primary, textShadow: '0 8px 24px rgba(0,0,0,0.35)' }}
                                        >
                                            {detailHeadingLabel}
                                        </h1>
                                    )}
                                    {persona.isCouple && coupleLastNameLine && (
                                        <p
                                            className={`text-[1.35rem] md:text-[1.8rem] ${language === 'kh' ? moul.className : playfair.className}`}
                                            style={{ color: cs.primary, textShadow: '0 6px 20px rgba(0,0,0,0.32)' }}
                                        >
                                            {coupleLastNameLine}
                                        </p>
                                    )}
                                </div>

                                <div className="mx-auto max-w-md space-y-4 rounded-[28px] border px-6 py-7 backdrop-blur-[8px]" style={{ borderColor: cs.border, backgroundColor: 'rgba(7,10,22,0.42)', boxShadow: '0 14px 38px rgba(0,0,0,0.28)' }}>
                                    <p className={eyebrowClass} style={{ color: `${cs.textSecondary}` }}>{specialGuestLabel}</p>
                                    <h2 className={`text-[1.7rem] md:text-[2rem] ${language === 'kh' ? koulen.className : playfair.className}`} style={{ color: cs.text }}>
                                        {guestName || "Distinguished Guest"}
                                    </h2>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <div className="relative inline-flex items-center justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleOpen}
                                            className="relative cursor-pointer"
                                        >
                                            {renderIntroOpenButton()}
                                            <div className="pointer-events-none absolute right-1 top-1/2 z-20 -translate-y-1/2 scale-[0.68]">
                                                <OpenInvitationHint
                                                    label={openInvitationHintLabel}
                                                    color={cs.primary}
                                                    textColor={cs.text}
                                                    borderColor={cs.border}
                                                    background="rgba(7,10,22,0.48)"
                                                    labelClassName={inter.className}
                                                    iconOnly
                                                />
                                            </div>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
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
                                        loop
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img src={transitionVideoUrl} className="w-full h-full object-cover" alt="transition" />
                                )}
                            </div>
                        ) : (
                            <div className="absolute inset-0 w-full h-full">
                                {renderGoldenBackgroundMedia(uploadedBackgroundMedia, 'transition')}
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 pointer-events-none z-[1]">
                            <GoldenFlareLayer color={cs.accent} />
                            <GoldenDustField color={cs.primary} dense />
                        </div>
                        <div className="absolute right-5 top-20 z-[15]">
                            <button
                                onClick={handleTransitionEnd}
                                className={language === 'kh' ? 'rounded-full px-5 py-2 text-sm' : 'rounded-full px-5 py-2 text-xs uppercase tracking-[0.28em]'}
                                style={{ border: `1px solid ${cs.border}`, backgroundColor: `${cs.background}b8`, color: cs.text, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', backdropFilter: 'blur(10px)' }}
                            >
                                {language === 'kh' ? 'រំលង' : 'Skip'}
                            </button>
                        </div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative z-10 flex min-h-screen w-full items-center justify-center px-2 py-4 text-center sm:px-3"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={transitionOverlayStage}
                                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -14, scale: 1.02 }}
                                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                        className="relative space-y-6"
                                    >
                                        {transitionOverlayStage === 'logoReveal' && renderTransitionOrnateLogoFrame()}
                                        {transitionOverlayStage === 'countdownReveal' && renderTransitionCountdown()}
                                        {transitionOverlayStage === 'galleryReveal' && renderTransitionGalleryFrames()}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        ref={detailScrollRef}
                        onWheel={handleDetailWheel}
                        onTouchStart={handleDetailTouchStart}
                        onTouchEnd={handleDetailTouchEnd}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 h-screen overflow-y-auto overscroll-y-contain scroll-smooth snap-y snap-mandatory"
                    >
                        <div className="pointer-events-none absolute inset-0 z-0">
                            <GoldenDustField color={cs.primary} />
                            <GoldenFlareLayer color={cs.accent} />
                            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.16),transparent_70%)]" />
                        </div>
                        <section
                            data-golden-detail-section
                            className="relative flex min-h-screen snap-start snap-always items-start px-4 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(2rem,calc(env(safe-area-inset-top)+1.5rem))] sm:px-6 md:items-center md:py-20"
                        >
                            <div className="mx-auto w-full max-w-4xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="space-y-5 px-1 py-2 text-center sm:space-y-7 md:space-y-10 md:px-10 md:py-6"
                                >
                                    <div className="space-y-2 md:space-y-3">
                                        <div className="inline-block rounded-xl border-2 px-4 py-1.5 md:px-5 md:py-2" style={{ borderColor: `${cs.primary}88`, backgroundColor: 'rgba(0,0,0,0.22)' }}>
                                            <p className={`text-[clamp(1rem,4.8vw,1.35rem)] leading-tight md:text-2xl bg-clip-text text-transparent ${language === 'kh' ? moul.className : cinzel.className}`} style={{ backgroundImage: cs.gradient }}>
                                                {detailHeadingLabel}
                                            </p>
                                        </div>
                                        {eventLogoUrl && (
                                            <div className="pt-1 md:pt-3">
                                                <div className="mx-auto w-fit">
                                                    {renderEventLogoFrame('h-[clamp(8.5rem,34vh,11rem)] w-[clamp(8.5rem,34vh,11rem)] md:h-56 md:w-56')}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {shouldShowFamilySection && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7 }}
                                            className={`grid gap-3 md:gap-8 text-center ${persona.isCouple ? 'grid-cols-2' : 'grid-cols-1'}`}
                                        >
                                            {hasPrimaryFamilyInfo && (
                                                <div className="space-y-2 text-center md:space-y-3 md:text-left">
                                                    <p className={`text-[clamp(0.82rem,3.8vw,1rem)] leading-tight sm:text-lg ${language === 'kh' ? moul.className : cinzel.className}`} style={{ color: cs.primary }}>
                                                        {groomParentsLabel}
                                                    </p>
                                                    <div className={`space-y-0.5 text-[clamp(0.9rem,4.2vw,1.1rem)] leading-snug md:space-y-1 md:text-xl ${bodyClass}`} style={{ color: cs.text }}>
                                                        {groomFatherName && <p>{groomFatherName}</p>}
                                                        {groomMotherName && <p>{groomMotherName}</p>}
                                                    </div>
                                                    {persona.isCouple && groomFullName && (
                                                        <div className="space-y-0.5 pt-1 md:space-y-1 md:pt-2">
                                                            <p className={`text-[clamp(0.8rem,3.6vw,0.95rem)] leading-tight sm:text-lg ${language === 'kh' ? koulen.className : cinzel.className}`} style={{ color: `${cs.primary}bb` }}>
                                                                {groomRoleLabel}
                                                            </p>
                                                            <p className={`text-[clamp(1.1rem,5.2vw,1.45rem)] leading-tight md:text-3xl ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: cs.primary }}>
                                                                {groomFullName}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {persona.isCouple && hasSecondaryFamilyInfo && (
                                                <div className="space-y-2 text-center md:space-y-3 md:text-right">
                                                    <p className={`text-[clamp(0.82rem,3.8vw,1rem)] leading-tight sm:text-lg ${language === 'kh' ? moul.className : cinzel.className}`} style={{ color: cs.primary }}>
                                                        {brideParentsLabel}
                                                    </p>
                                                    <div className={`space-y-0.5 text-[clamp(0.9rem,4.2vw,1.1rem)] leading-snug md:space-y-1 md:text-xl ${bodyClass}`} style={{ color: cs.text }}>
                                                        {brideFatherName && <p>{brideFatherName}</p>}
                                                        {brideMotherName && <p>{brideMotherName}</p>}
                                                    </div>
                                                    {brideFullName && (
                                                        <div className="space-y-0.5 pt-1 md:space-y-1 md:pt-2">
                                                            <p className={`text-[clamp(0.8rem,3.6vw,0.95rem)] leading-tight sm:text-lg ${language === 'kh' ? koulen.className : cinzel.className}`} style={{ color: `${cs.primary}bb` }}>
                                                                {brideRoleLabel}
                                                            </p>
                                                            <p className={`text-[clamp(1.1rem,5.2vw,1.45rem)] leading-tight md:text-3xl ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: cs.primary }}>
                                                                {brideFullName}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {invitationMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                            className="space-y-2 md:space-y-4"
                                        >
                                            <p className={`text-[clamp(1rem,4.8vw,1.35rem)] md:text-2xl ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: cs.primary }}>
                                                {inviteHeadingLabel}
                                            </p>
                                            <div className="rounded-[18px] border px-4 py-3 md:rounded-[22px] md:px-8 md:py-7" style={{ borderColor: `${cs.primary}55`, backgroundColor: 'rgba(0,0,0,0.18)' }}>
                                                <p className={`whitespace-pre-wrap text-center text-[clamp(0.78rem,3.6vw,0.95rem)] leading-snug md:text-lg md:leading-relaxed ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                                    {invitationMessage}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={false}
                                        animate={hasStartedDetailScroll ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
                                        transition={{ duration: 0.7, delay: 0.08 }}
                                        className="space-y-3 md:space-y-5"
                                    >
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />
                                        <div className="space-y-2 md:space-y-3">
                                            <p className={`text-sm md:text-lg ${bodyClass}`} style={{ color: cs.text }}>{timeStr}</p>
                                            <p className={`text-lg md:text-3xl ${language === 'kh' ? koulen.className : playfair.className}`} style={{ color: cs.primary }}>{dateStr}</p>
                                            {location && (
                                                <div className={`flex items-start justify-center gap-2 text-sm md:gap-3 md:text-lg ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                                    <MapPin size={18} style={{ color: cs.primary }} className="mt-1 shrink-0" />
                                                    <span className="max-w-[85vw] text-center md:max-w-[700px]">{location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#EEC573]/50 to-transparent" />
                                        <div>
                                            <a
                                                href={calendarUrl === '#' ? undefined : calendarUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-block rounded-full border px-5 py-1.5 text-xs md:px-6 md:py-2 md:text-sm ${bodyClass}`}
                                                style={{ borderColor: `${cs.primary}55`, color: cs.primary, backgroundColor: 'rgba(0,0,0,0.18)' }}
                                            >
                                                {addToCalendarLabel}
                                            </a>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                            <ScrollUpGuide
                                show={showScrollGuide}
                                label={scrollGuideLabel}
                                color={cs.primary}
                                textColor={cs.textSecondary}
                                borderColor={cs.border}
                            />
                        </section>

                        {/* 4. SCHEDULE SECTION */}
                        {scheduleItems.length > 0 && (
                            <section
                                data-golden-detail-section
                                className="flex min-h-screen snap-start snap-always items-start bg-black/30 px-4 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(2rem,calc(env(safe-area-inset-top)+1.5rem))] sm:px-6 md:items-center md:py-10"
                            >
                                <div className="mx-auto w-full max-w-3xl space-y-5 md:space-y-8">
                                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} className="text-center space-y-1.5 md:space-y-2">
                                        <h3 className={`text-[clamp(1.35rem,6vw,1.9rem)] leading-tight md:text-2xl ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: cs.primary }}>{celebrationHeadingLabel}</h3>
                                        <div className="h-px w-16 mx-auto" style={{ background: cs.gradient }} />
                                    </motion.div>
                                    <div className="space-y-6 md:space-y-10">
                                        {scheduleGroups.map((group, groupIndex) => (
                                            <div key={`${group.date || 'schedule'}-${groupIndex}`} className="space-y-4 md:space-y-5">
                                                {group.date && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 18 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: false, amount: 0.2 }}
                                                        className="text-center"
                                                    >
                                                        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 md:gap-3 md:px-4 md:py-2" style={{ borderColor: `${cs.primary}55`, backgroundColor: 'rgba(0,0,0,0.22)' }}>
                                                            <div className="h-px w-5 md:w-6" style={{ background: cs.gradient }} />
                                                            <p className={`text-[clamp(0.9rem,4vw,1rem)] md:text-base ${language === 'kh' ? koulen.className : cinzel.className}`} style={{ color: cs.primary }}>
                                                                {formatScheduleDate(group.date)}
                                                            </p>
                                                            <div className="h-px w-5 md:w-6" style={{ background: cs.gradient }} />
                                                        </div>
                                                    </motion.div>
                                                )}
                                                <div className="space-y-4 md:space-y-6">
                                                    {group.items.map((item, i) => (
                                                        <motion.div
                                                            key={`${group.date || 'item'}-${i}-${item.time || ''}`}
                                                            initial={{ opacity: 0, y: 30 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: false, amount: 0.1 }}
                                                            transition={{ delay: i * 0.1 }}
                                                            className="flex items-center gap-3 group md:gap-6"
                                                        >
                                                            <div className="w-14 shrink-0 text-right md:w-20">
                                                                <p className={`text-[11px] font-bold md:text-xs ${detailMetaClass}`} style={{ color: cs.primary }}>{item.time}</p>
                                                            </div>
                                                            <div className="relative h-10 w-px bg-white/10 transition-colors group-hover:bg-primary/50 md:h-12">
                                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-primary" style={{ backgroundColor: cs.primary }} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className={`text-[clamp(0.92rem,4vw,1.08rem)] leading-snug md:text-base ${bodyClass}`}>
                                                                    {language === 'en' ? (item.activityEn || item.titleEn || item.activity || item.title) : (item.activity || item.title)}
                                                                </p>
                                                                {(language === 'en' ? (item.descriptionEn || item.description) : item.description) && (
                                                                    <p className={`text-[9px] opacity-50 md:text-[10px] ${detailMetaClass}`}>
                                                                        {language === 'en' ? (item.descriptionEn || item.description) : item.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 5. STORY SECTION */}
                        {renderDetailFeaturePhoto()}

                        {/* 6. GALLERY SECTION */}
                        <section
                            data-golden-detail-section
                            className="mx-auto flex min-h-screen w-full max-w-5xl snap-start snap-always items-start px-6 pb-[max(7rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(5rem,calc(env(safe-area-inset-top)+3rem))] md:items-center md:py-16"
                        >
                            <div className="w-full">
                                <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} layout="three-row-slider" />
                            </div>
                        </section>

                        {/* 7. RSVP SECTION */}
                        <section data-golden-detail-section className="flex min-h-screen snap-start snap-always items-center px-6 py-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                className="max-w-xl mx-auto p-12 border rounded-3xl space-y-8"
                                style={{ borderColor: `${cs.primary}55`, backgroundColor: 'rgba(0,0,0,0.22)' }}
                            >
                                <Gift className="mx-auto" size={28} style={{ color: cs.primary }} />
                                <div className="space-y-3">
                                    <h2 className={`text-[1.55rem] md:text-[2.2rem] ${language === 'kh' ? moul.className : playfair.className}`} style={{ color: cs.primary }}>{yourPresenceTitle}</h2>
                                    <p
                                        className={language === 'kh' ? `text-xs opacity-75 ${kantumruy.className}` : `text-xs md:text-sm opacity-70 ${detailMetaClass}`}
                                        style={{ letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : undefined }}
                                    >
                                        {yourPresenceHint}
                                    </p>
                                </div>
                                {!rsvpSent ? (
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            type="button"
                                            disabled={rsvpSubmitting}
                                            onClick={() => handleRsvpClick('ACCEPTED')}
                                            className={`rounded-full px-8 py-3 text-xs md:text-[10px] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${language === 'kh' ? `${koulen.className} tracking-normal` : `${cinzel.className} uppercase tracking-[0.22em] font-semibold`}`}
                                            style={{ background: cs.gradient, color: cs.background }}
                                        >
                                            {rsvpAcceptedLabel}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={rsvpSubmitting}
                                            onClick={() => handleRsvpClick('DECLINED')}
                                            className={`rounded-full border px-8 py-3 text-xs md:text-[10px] transition-all hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60 ${language === 'kh' ? `${koulen.className} tracking-normal` : `${cinzel.className} uppercase tracking-[0.22em] font-semibold`}`}
                                            style={{ borderColor: cs.border, color: cs.primary }}
                                        >
                                            {rsvpDeclinedLabel}
                                        </button>
                                    </div>
                                ) : (
                                    <p className={`text-sm ${bodyClass}`} style={{ color: cs.primary }}>
                                        {rsvpThanksLabel}
                                    </p>
                                )}
                            </motion.div>
                        </section>

                        {paymentQrImageUrl && (
                            <section data-golden-detail-section className="flex min-h-screen snap-start snap-always items-center px-6 py-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    className="mx-auto max-w-md rounded-[32px] border p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                                    style={{ borderColor: cs.border, background: 'linear-gradient(180deg, rgba(18,20,34,0.95), rgba(8,10,18,0.88))' }}
                                >
                                    <p className={eyebrowClass} style={{ color: cs.primary }}>{paymentQrTitle}</p>
                                    <p className={`mt-3 text-sm leading-7 ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                        {paymentQrHint}
                                    </p>
                                    <div className="mx-auto mt-5 w-full max-w-[260px] rounded-[28px] border bg-white p-4 shadow-[0_16px_36px_rgba(0,0,0,0.28)]" style={{ borderColor: `${cs.primary}55` }}>
                                        <img src={paymentQrImageUrl} alt="Payment QR" className="h-auto w-full rounded-[20px] object-contain" />
                                    </div>
                                </motion.div>
                            </section>
                        )}

                        {venueDetails && (
                            <section data-golden-detail-section className="flex min-h-screen snap-start snap-always items-center px-6 py-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    className="mx-auto max-w-3xl rounded-[28px] border px-6 py-8 text-center"
                                    style={{ borderColor: `${cs.primary}55`, backgroundColor: 'rgba(0,0,0,0.22)' }}
                                >
                                    <p className={`mb-4 text-2xl ${language === 'kh' ? koulen.className : playfair.className}`} style={{ color: cs.primary }}>
                                        {venueHeadingLabel}
                                    </p>
                                    <div className={`space-y-2 whitespace-pre-wrap text-lg md:text-xl ${bodyClass}`} style={{ color: cs.text }}>
                                        {venueDetails}
                                    </div>
                                    {mapLinkUrl && (
                                        <a
                                            href={mapLinkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`mt-5 inline-flex rounded-full border px-5 py-2 text-xs transition hover:bg-white/5 ${language === 'kh' ? `${koulen.className} tracking-normal` : `${cinzel.className} uppercase tracking-[0.18em] font-semibold`}`}
                                            style={{ borderColor: `${cs.primary}55`, color: cs.primary }}
                                        >
                                            {openMapLabel}
                                        </a>
                                    )}
                                </motion.div>
                            </section>
                        )}

                        <section data-golden-detail-section className="flex min-h-screen snap-start snap-always items-center px-6 py-4">
                            <DigitalWishesSection
                                eventId={
                                    props.eventId ||
                                    props.id ||
                                    props.event_id ||
                                    props.eventID ||
                                    props.invitationId ||
                                    props.invitation_id
                                }
                                enabled={props.featureLimits?.digitalWishes !== false}
                                guestName={guestName}
                                guestCode={props.code || props.shortCode}
                                language={language as 'kh' | 'en'}
                                colorScheme={cs}
                                className="mx-auto max-w-2xl"
                                headingClassName={language === 'kh' ? koulen.className : cinzel.className}
                                bodyClassName={bodyClass}
                            />
                        </section>

                        <section data-golden-detail-section className="snap-start snap-always">
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Music Control */}
            {musicUrl && (
                <button
                    onClick={() => {
                        if (isPlaying) audioRef.current?.pause();
                        else audioRef.current?.play();
                        setIsPlaying(!isPlaying);
                    }}
                    className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl"
                    style={{ backgroundColor: `${cs.background}cc`, border: `1px solid ${cs.border}`, color: cs.primary }}
                >
                    {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
                </button>
            )}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop playsInline className="hidden" />}

            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
                    >
                        <div
                            className="absolute inset-0 opacity-90"
                            style={{ background: `radial-gradient(circle, rgba(255,255,255,0.96), ${cs.primary}cc 48%, rgba(255,255,255,0.86))` }}
                        />
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="absolute inset-0 rotate-12 scale-150 bg-gradient-to-r from-transparent via-white to-transparent opacity-75"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.6, opacity: 1 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="absolute h-full w-full"
                            style={{ background: `radial-gradient(circle, rgba(255,255,255,0.98) 0%, ${cs.primary}88 46%, transparent 78%)` }}
                        />
                    </motion.div>
                )
                }
            </AnimatePresence>
        </main>
    );
}
