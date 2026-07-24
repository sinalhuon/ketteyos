'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock, Gift, MapPin, Volume2, VolumeX } from 'lucide-react';
import { Cormorant_Garamond, Hanuman, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import { parseAndFormatKhmerTime, toKhmerDate, toKhmerTime } from '@/lib/khmer-utils';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import InvitationCountdownSection from '../InvitationCountdownSection';
import AppFooter from '../AppFooter';
import ScrollUpGuide from '../ScrollUpGuide';
import OpenInvitationHint from '../OpenInvitationHint';

type BlueArchColorScheme = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    gradient?: string;
};

type MediaItem = string | { id?: string; imageUrl?: string; videoUrl?: string; url?: string };
type StorySlide = {
    id?: string;
    imageUrl: string;
    title?: string;
    caption?: string;
    order?: number;
};
type ScheduleItem = {
    date?: string;
    time?: string;
    activity?: string;
    activityEn?: string;
    title?: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
};
type ScheduleGroup = {
    date: string;
    items: ScheduleItem[];
};
type MovieCredit = {
    role: string;
    name: string;
    nameEn?: string;
};

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['500', '600', '700'] });
const hanuman = Hanuman({ subsets: ['khmer', 'latin'], weight: ['400', '700', '900'] });
const koulen = localFont({ src: '../../../../public/assets/fonts/Koulen-Regular.ttf', variable: '--font-koulen' });
const kantumruy = localFont({ src: '../../../../public/assets/fonts/KantumruyPro-Regular.ttf', variable: '--font-kantumruy' });

function BlueArchFallingField({ color }: { color: string }) {
    const petals = [
        { left: '9%', delay: 0.2, duration: 12, size: 9, drift: 28 },
        { left: '19%', delay: 2.4, duration: 14, size: 7, drift: -18 },
        { left: '32%', delay: 1.1, duration: 13, size: 10, drift: 22 },
        { left: '46%', delay: 3.1, duration: 15, size: 6, drift: -24 },
        { left: '58%', delay: 0.8, duration: 12.8, size: 8, drift: 20 },
        { left: '71%', delay: 2.0, duration: 14.4, size: 10, drift: -20 },
        { left: '84%', delay: 1.5, duration: 13.8, size: 7, drift: 18 },
        { left: '93%', delay: 3.7, duration: 15.2, size: 9, drift: -16 },
    ];

    return (
        <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
            {petals.map((petal, index) => (
                <motion.div
                    key={`${petal.left}-${index}`}
                    className="absolute top-[-10%] rounded-[999px_999px_999px_0]"
                    style={{
                        left: petal.left,
                        width: petal.size,
                        height: petal.size * 1.45,
                        background: `linear-gradient(140deg, rgba(255,255,255,0.92), ${color}66)`,
                        boxShadow: `0 0 12px ${color}4d`,
                    }}
                    animate={{
                        y: ['0vh', '114vh'],
                        x: [0, petal.drift, petal.drift * -0.35, 0],
                        rotate: [0, index % 2 === 0 ? 80 : -80, index % 2 === 0 ? 160 : -160],
                        opacity: [0, 0.78, 0.55, 0],
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: petal.delay,
                    }}
                />
            ))}
        </div>
    );
}

function BlueArchPageFlash({ show, primary, accent }: { show: boolean; primary: string; accent: string }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0.85, scale: 0.9 }}
                        animate={{ opacity: 0, scale: 1.22 }}
                        transition={{ duration: 0.86, ease: 'easeOut' }}
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 50% 44%, rgba(255,255,255,0.78), ${accent}55 34%, ${primary}30 58%, transparent 76%)`,
                        }}
                    />
                    <motion.div
                        initial={{ x: '-120%', opacity: 0 }}
                        animate={{ x: '120%', opacity: [0, 0.9, 0] }}
                        transition={{ duration: 0.76, ease: 'easeOut' }}
                        className="absolute inset-y-[-20%] w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface Props {
    id?: string;
    eventId?: string;
    event_id?: string;
    eventID?: string;
    invitationId?: string;
    invitation_id?: string;
    code?: string;
    shortCode?: string;
    guestName?: string;
    eventTitle?: string | null;
    eventType?: string | null;
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
    albumPhotos?: MediaItem[];
    albumVideos?: string[];
    storySlides?: StorySlide[];
    introVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    buttonImageUrl?: string | null;
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    templateConfig?: { colorScheme?: BlueArchColorScheme; showButtonText?: boolean; openButtonTextColor?: string; storySlides?: StorySlide[]; movieCredits?: MovieCredit[] };
    paymentQrImageUrl?: string | null;
    featureLimits?: { digitalWishes?: boolean; [key: string]: unknown };
    previewPage?: 'intro' | 'transition' | 'details';
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: unknown;
}

export default function BlueArchLayout(props: Props) {
    const {
        id,
        code,
        shortCode,
        guestName,
        eventDate,
        location,
        musicUrl,
        invitationMessage,
        venueDetails,
        mapUrl,
        schedule,
        introVideoUrl,
        transitionVideoUrl,
        backgroundVideoUrl,
        backgroundImageUrl,
        albumPhotos = [],
        albumVideos = [],
        storySlides = [],
        paymentQrImageUrl,
        featureLimits,
        templateConfig,
        onRsvp,
    } = props;

    const cs = templateConfig?.colorScheme || {
        primary: '#D3A56F',
        secondary: '#9CBBC9',
        accent: '#EEF7F8',
        background: '#EAF1F1',
        text: '#5F6870',
        textSecondary: 'rgba(95,104,112,0.72)',
        border: 'rgba(211,165,111,0.72)',
        gradient: 'linear-gradient(135deg, #f6d5a6 0%, #d3a56f 100%)',
    };

    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);
    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [isPlaying, setIsPlaying] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const [storyIndex, setStoryIndex] = useState(0);
    const [storyDirection, setStoryDirection] = useState(1);
    const [showScrollGuide, setShowScrollGuide] = useState(true);
    const [showPageFlash, setShowPageFlash] = useState(false);
    const [transitionRemaining, setTransitionRemaining] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const detailScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    useEffect(() => {
        if (!musicUrl || !audioRef.current) return;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
        });
    }, [musicUrl]);

    useEffect(() => {
        if (phase !== 'details') {
            setShowScrollGuide(true);
            return;
        }

        const scroller = detailScrollRef.current;
        if (!scroller) return;

        const handleScroll = () => setShowScrollGuide(scroller.scrollTop < 12);
        handleScroll();
        scroller.addEventListener('scroll', handleScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', handleScroll);
    }, [phase]);

    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);
    const headingClass = language === 'kh' ? koulen.className : cormorant.className;
    const bodyClass = language === 'kh' ? kantumruy.className : montserrat.className;
    const isKhmer = language === 'kh';

    const dateLabel = eventDate
        ? language === 'kh'
            ? toKhmerDate(eventDate)
            : new Intl.DateTimeFormat('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(eventDate))
        : '';
    const timeLabel = eventDate
        ? language === 'kh'
            ? toKhmerTime(new Date(eventDate))
            : new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(eventDate))
        : '';

    const mainNames = useMemo(() => {
        if (!persona.isCouple) return persona.primaryFullName || props.eventTitle || labels.eventTitle;
        const first = [props.groomFirstName, props.groomLastName].filter(Boolean).join(' ') || persona.primaryFullName;
        const second = [props.brideFirstName, props.brideLastName].filter(Boolean).join(' ') || [persona.secondaryFirstName, persona.secondaryLastName].filter(Boolean).join(' ');
        return { first, second };
    }, [labels.eventTitle, persona, props.brideFirstName, props.brideLastName, props.eventTitle, props.groomFirstName, props.groomLastName]);

    const normalizedStorySlides = useMemo(() => {
        const source = storySlides.length > 0 ? storySlides : (Array.isArray(templateConfig?.storySlides) ? templateConfig.storySlides : []);
        return source
            .map((slide, index) => ({
                id: String(slide.id || `blue-arch-story-${index}`),
                imageUrl: slide.imageUrl,
                title: slide.title || '',
                caption: slide.caption || '',
                order: typeof slide.order === 'number' ? slide.order : index,
            }))
            .filter((slide) => slide.imageUrl)
            .sort((a, b) => a.order - b.order);
    }, [storySlides, templateConfig?.storySlides]);

    const { scheduleItems, scheduleGroups } = useMemo(() => {
        const items: ScheduleItem[] = [];
        let groups: ScheduleGroup[] = [];

        try {
            if (!schedule) return { scheduleItems: items, scheduleGroups: groups };
            const parsedSchedule = JSON.parse(schedule);
            if (!Array.isArray(parsedSchedule) || parsedSchedule.length === 0) {
                return { scheduleItems: items, scheduleGroups: groups };
            }

            if (parsedSchedule[0]?.activities && Array.isArray(parsedSchedule[0].activities)) {
                groups = parsedSchedule.map((day: { date?: string; activities?: ScheduleItem[] }) => {
                    const dayItems = (day.activities || []).map((activity) => ({
                        date: day.date,
                        time: activity.time,
                        activity: activity.activity || activity.title,
                        title: activity.title,
                        description: activity.description,
                    }));
                    items.push(...dayItems);
                    return { date: day.date || '', items: dayItems };
                });
            } else {
                items.push(...parsedSchedule);
                const grouped = parsedSchedule.reduce((acc: Record<string, ScheduleItem[]>, item: ScheduleItem) => {
                    const key = item.date || '';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                }, {});
                groups = Object.entries(grouped).map(([date, groupedItems]) => ({ date, items: groupedItems as ScheduleItem[] }));
            }
        } catch {
            return { scheduleItems: items, scheduleGroups: groups };
        }

        if (items.length > 0 && groups.length === 0) {
            groups = [{ date: '', items }];
        }

        return { scheduleItems: items, scheduleGroups: groups.filter((group) => group.items.length > 0) };
    }, [schedule]);

    useEffect(() => {
        if (storyIndex > normalizedStorySlides.length - 1) {
            setStoryIndex(0);
        }
    }, [normalizedStorySlides.length, storyIndex]);

    const paginateStory = (direction: -1 | 1) => {
        if (normalizedStorySlides.length <= 1) return;
        setStoryDirection(direction);
        setStoryIndex((prev) => {
            const next = prev + direction;
            if (next < 0) return normalizedStorySlides.length - 1;
            if (next >= normalizedStorySlides.length) return 0;
            return next;
        });
    };

    const changePhase = useCallback((nextPhase: 'intro' | 'transition' | 'details') => {
        if (nextPhase !== phase) {
            setShowPageFlash(true);
            window.setTimeout(() => setShowPageFlash(false), 900);
        }
        setPhase(nextPhase);
    }, [phase]);

    useEffect(() => {
        if (phase !== 'details' || normalizedStorySlides.length <= 1) return;
        const timer = window.setInterval(() => {
            setStoryDirection(1);
            setStoryIndex((prev) => (prev + 1) % normalizedStorySlides.length);
        }, 4200);

        return () => window.clearInterval(timer);
    }, [phase, normalizedStorySlides.length, storyIndex]);

    useEffect(() => {
        if (phase !== 'transition') return;
        setTransitionRemaining(5);

        const countdownTimer = window.setInterval(() => {
            setTransitionRemaining((remaining) => Math.max(remaining - 1, 0));
        }, 1000);
        const pageTimer = window.setTimeout(() => changePhase('details'), 5000);

        return () => {
            window.clearInterval(countdownTimer);
            window.clearTimeout(pageTimer);
        };
    }, [changePhase, phase]);

    const handleOpen = () => {
        changePhase(transitionVideoUrl ? 'transition' : 'details');
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
    };

    const handleRsvp = async (status: 'ACCEPTED' | 'DECLINED') => {
        if (!onRsvp || rsvpSubmitting || rsvpSent) return;
        try {
            setRsvpSubmitting(true);
            await onRsvp(status);
            setRsvpSent(true);
            window.setTimeout(() => {
                document.querySelector('[data-blue-arch-after-rsvp="true"]')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 250);
        } finally {
            setRsvpSubmitting(false);
        }
    };

    const renderBackground = (
        mediaUrl?: string | null,
        fallbackImageUrl?: string | null,
        onEnded?: () => void,
        onVideoProgress?: (video: HTMLVideoElement) => void,
    ) => (
        <div className="fixed inset-0 z-0 overflow-hidden" style={{ backgroundColor: cs.background }}>
            {mediaUrl && isVideoUrl(mediaUrl) ? (
                <video
                    key={mediaUrl}
                    src={mediaUrl}
                    autoPlay
                    loop={!onEnded}
                    muted
                    playsInline
                    onEnded={onEnded}
                    onLoadedMetadata={(event) => onVideoProgress?.(event.currentTarget)}
                    onTimeUpdate={(event) => onVideoProgress?.(event.currentTarget)}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : mediaUrl ? (
                <img src={mediaUrl} alt="background" className="absolute inset-0 h-full w-full object-cover" />
            ) : fallbackImageUrl ? (
                <img src={fallbackImageUrl} alt="background" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef7f8_0%,#dfeaec_100%)]" />
            )}
        </div>
    );

    const renderFrameOverlay = (url?: string | null) => {
        if (!url) return null;
        return (
            <div className="pointer-events-none fixed inset-0 z-20">
                {isVideoUrl(url) ? (
                    <video src={url} autoPlay loop muted playsInline className="h-full w-full object-fill" />
                ) : (
                    <img src={url} alt="Frame" className="h-full w-full object-fill" />
                )}
            </div>
        );
    };

    const KbachDivider = ({ color = '#B4975A' }: { color?: string }) => (
        <div className="flex items-center justify-center gap-3 opacity-60 mt-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B4975A]" />
            <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0L20 6L16 12L12 6L16 0Z" fill={color} />
                <path d="M8 3L10 6L8 9L6 6L8 3Z" fill={color} opacity="0.7" />
                <path d="M24 3L26 6L24 9L22 6L24 3Z" fill={color} opacity="0.7" />
                <path d="M2 5L3 6L2 7L1 6L2 5Z" fill={color} opacity="0.4" />
                <path d="M30 5L31 6L30 7L29 6L30 5Z" fill={color} opacity="0.4" />
            </svg>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B4975A]" />
        </div>
    );

    const iconStyle = { color: cs.textSecondary, strokeWidth: 1.55 };
    const smallTextClass = isKhmer
        ? `${hanuman.className} text-[17px] font-bold leading-[1.75] tracking-normal`
        : `${bodyClass} text-[10px] font-bold uppercase leading-[1.45] tracking-[0.28em]`;
    const introLabelClass = isKhmer
        ? `${hanuman.className} text-[19px] font-bold leading-[1.65] tracking-normal`
        : `${bodyClass} text-[12px] font-bold uppercase leading-[1.45] tracking-[0.34em]`;
    const introInviteLabelClass = isKhmer
        ? `${hanuman.className} text-[18px] font-bold leading-[1.55] tracking-normal`
        : `${bodyClass} text-[12px] font-bold uppercase tracking-[0.22em]`;
    const openButtonTextClass = isKhmer
        ? `${koulen.className} text-[19px] font-bold leading-none tracking-normal`
        : `${montserrat.className} text-[12px] font-bold uppercase tracking-[0.32em]`;
    const openInvitationTextColor = cs.text;
    const detailSnapSectionClass = isKhmer
        ? 'relative mx-auto flex min-h-[100svh] w-full max-w-[430px] snap-start snap-always items-center overflow-hidden px-9 py-8 min-[760px]:py-14'
        : 'relative mx-auto flex min-h-[100svh] w-full max-w-[430px] snap-start snap-always items-center overflow-hidden px-8 py-7 min-[760px]:py-12';
    const detailPageMotion = {
        initial: { opacity: 0.72, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { amount: 0.62 },
        transition: { duration: 0.78, ease: 'easeOut' as const },
    };

    const formatScheduleDate = (value?: string) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        return language === 'kh'
            ? toKhmerDate(parsed)
            : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
    };

    const formatScheduleTime = (value?: string) => {
        if (!value) return '';
        return language === 'kh' ? parseAndFormatKhmerTime(value) : value;
    };

    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const openInvitationHintLabel = language === 'kh' ? 'ចុចត្រង់នេះ' : 'Tap Here';
    const eventTypeLabel = labels.eventTitle;
    const displayNames = typeof mainNames === 'string' ? mainNames : `${mainNames.first} & ${mainNames.second}`;
    
    const renderStackedNames = (names: string | { first: string; second: string }, sizeClasses: string, gap: string = 'gap-3') => {
        const firstSize = sizeClasses.split(' ')[0];
        const labelClass = `${hanuman.className} text-[13px] font-bold opacity-60 mb-1`;
        
        const renderNameWithLabel = (name: string, label: string, align: 'text-right' | 'text-left') => (
            <div className={`flex flex-col items-center`}>
                {language === 'kh' && <span className={labelClass}>{label}</span>}
                <p className={`${firstSize} ${align} whitespace-nowrap`}>{name}</p>
            </div>
        );

        const renderEnglishNames = (first: string, second: string) => (
            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                <p className="whitespace-normal leading-[1.05]">{first}</p>
                <span className={`${cormorant.className} text-[1.2rem] leading-none opacity-70`}>&</span>
                <p className="whitespace-normal leading-[1.05]">{second}</p>
            </div>
        );

        if (typeof names === 'object') {
            if (!isKhmer) return renderEnglishNames(names.first, names.second);
            return (
                <div className={`flex flex-row items-center justify-center ${gap}`}>
                    {renderNameWithLabel(names.first, 'កូនកម្លោះនាម', 'text-right')}
                    <span className={`${hanuman.className} text-[14px] font-bold leading-none opacity-60 shrink-0 self-end pb-1`}>&</span>
                    {renderNameWithLabel(names.second, 'កូនក្រមុំនាម', 'text-left')}
                </div>
            );
        }
        
        if (names.includes('&')) {
            const parts = names.split(/[&＆]/).map(s => s.trim());
            if (!isKhmer) return renderEnglishNames(parts[0], parts[1]);
            return (
                <div className={`flex flex-row items-center justify-center ${gap}`}>
                    {renderNameWithLabel(parts[0], 'កូនកម្លោះនាម', 'text-right')}
                    <span className={`${hanuman.className} text-[14px] font-bold leading-none opacity-60 shrink-0 self-end pb-1`}>&</span>
                    {renderNameWithLabel(parts[1], 'កូនក្រមុំនាម', 'text-left')}
                </div>
            );
        }

        return <h1 className={`${sizeClasses} ${headingClass}`} style={{ color: cs.text }}>{names}</h1>;
    };
    const wishesEventId = String(props.eventId || id || props.event_id || props.eventID || props.invitationId || props.invitation_id || '');
    const wishesGuestCode = code || shortCode;
    const isMovieEvent = String(props.eventType || '').toLowerCase().includes('movie') || String(props.eventType || '').toLowerCase().includes('film');
    const movieCredits = Array.isArray(templateConfig?.movieCredits)
        ? templateConfig.movieCredits.filter((credit) => credit.role && (credit.name || credit.nameEn))
        : [];
    const familyRows = useMemo(() => {
        if (!persona.isCouple) {
            const hostFamily = persona.primaryParents.filter(Boolean);
            return hostFamily.length > 0 ? [{ label: labels.familyTitle, names: hostFamily }] : [];
        }

        const rows: Array<{ label: string; names: string[] }> = [];
        if (persona.primaryParents.length > 0) {
            rows.push({
                label: language === 'kh' ? 'លោកមេបាកូនកម្លោះ' : "The Groom's Parents",
                names: persona.primaryParents,
            });
        }
        if (persona.secondaryParents.length > 0) {
            rows.push({
                label: language === 'kh' ? 'លោកមេបាកូនក្រមុំ' : "The Bride's Parents",
                names: persona.secondaryParents,
            });
        }
        return rows;
    }, [labels.familyTitle, language, persona.isCouple, persona.primaryParents, persona.secondaryParents]);
    const defaultInvitationMessage = language === 'kh'
        ? 'សូមគោរពអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីដ៏ពិសេសនេះ ដើម្បីចូលរួមអបអរសាទរ និងផ្តល់ពរជ័យជាមួយយើង។'
        : 'We would be honored by your presence as we celebrate this special occasion together.';

    const renderIntroOpenButton = () => {
        if (props.buttonImageUrl) {
            return (
                <div className="relative inline-block">
                    <img src={props.buttonImageUrl} alt="Open Invitation" className="h-16 w-auto object-contain drop-shadow-xl" />
                    {templateConfig?.showButtonText !== false && (
                        <span
                            className={`absolute inset-0 flex items-center justify-center px-5 text-center ${openButtonTextClass}`}
                            style={{
                                color: openInvitationTextColor,
                                textTransform: isKhmer ? 'none' : 'uppercase',
                                letterSpacing: isKhmer ? '0' : '0.18em',
                                textShadow: '0 1px 0 rgba(255,255,255,0.75), 0 8px 18px rgba(255,255,255,0.4)',
                            }}
                        >
                            {openInvitationLabel}
                        </span>
                    )}
                </div>
            );
        }

        return (
            <span
                className={`inline-flex rounded-full px-9 py-3.5 shadow-lg ${openButtonTextClass}`}
                style={{
                    background: cs.gradient,
                    color: openInvitationTextColor,
                    textTransform: isKhmer ? 'none' : 'uppercase',
                    letterSpacing: isKhmer ? 0 : undefined,
                    textShadow: '0 1px 0 rgba(255,255,255,0.75)',
                }}
            >
                {openInvitationLabel}
            </span>
        );
    };

    const renderTransitionPreview = () => (
        <div className="relative z-10 flex min-h-screen w-full justify-start px-10 py-14">
            <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full max-w-[230px] flex-col text-left"
                style={{ color: cs.text }}
            >
                <div className="pt-[15svh] text-left">
                    <p
                        className={isKhmer ? `${hanuman.className} text-[13px] font-bold leading-6` : `${montserrat.className} text-[9px] font-bold uppercase leading-[1.55] tracking-[0.34em]`}
                        style={{ color: cs.textSecondary, letterSpacing: isKhmer ? 0 : undefined, textTransform: isKhmer ? 'none' : 'uppercase' }}
                    >
                        {eventTypeLabel}
                    </p>

                    {typeof mainNames === 'string' ? (
                        <p className={`${headingClass} mt-6 ${isKhmer ? 'text-[34px] leading-[1.25]' : 'text-[46px] leading-none'}`} style={{ color: cs.text }}>
                            {mainNames}
                        </p>
                    ) : (
                        <div className="mt-6">
                            <p className={`${headingClass} ${isKhmer ? 'text-[33px] leading-[1.22]' : 'text-[46px] leading-none'}`} style={{ color: cs.text }}>
                                {mainNames.first}
                            </p>
                            <p className={`${isKhmer ? hanuman.className : cormorant.className} my-1 text-[18px] font-bold italic leading-none`} style={{ color: cs.textSecondary }}>
                                &
                            </p>
                            <p className={`${headingClass} ${isKhmer ? 'text-[33px] leading-[1.22]' : 'text-[46px] leading-none'}`} style={{ color: cs.text }}>
                                {mainNames.second}
                            </p>
                        </div>
                    )}

                    <p
                        className={isKhmer ? `${hanuman.className} mt-8 text-[13px] font-bold leading-6` : `${montserrat.className} mt-8 text-[9px] font-bold uppercase leading-[1.55] tracking-[0.34em]`}
                        style={{ color: cs.textSecondary, letterSpacing: isKhmer ? 0 : undefined, textTransform: isKhmer ? 'none' : 'uppercase' }}
                    >
                        {language === 'kh' ? 'សូមគោរពអញ្ជើញចូលរួមពិធី' : 'Invite You To Their Celebration'}
                    </p>
                </div>

                <div className="mt-[7svh] space-y-7 text-left">
                    <div className="space-y-2">
                        <CalendarDays size={30} style={iconStyle} />
                        <p className={`${bodyClass} text-[13px] font-bold leading-6`} style={{ color: cs.text }}>
                            {dateLabel}
                            {timeLabel && <span className="block">{timeLabel}</span>}
                        </p>
                    </div>
                    {(venueDetails || location) && (
                        <div className="space-y-2">
                            <MapPin size={32} style={iconStyle} />
                            <p className={`${bodyClass} text-[13px] font-bold leading-6`} style={{ color: cs.text }}>
                                {venueDetails || location}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );

    const renderStoryAlbum = () => {
        if (normalizedStorySlides.length === 0) return null;
        const activeStory = normalizedStorySlides[storyIndex] || normalizedStorySlides[0];

        return (
            <div className="pb-1">
                <div className="overflow-hidden px-2 py-4 text-center">
                    <p className={`${headingClass} text-center ${isKhmer ? 'text-[24px]' : 'text-[28px]'}`} style={{ color: cs.text }}>
                        {language === 'kh' ? 'អនុស្សាវរីយ៍' : 'Story Album'}
                    </p>
                    <p className={`${bodyClass} mt-1 text-[12px] font-semibold`} style={{ color: cs.textSecondary }}>
                        {language === 'kh' ? 'អូសដើម្បីបើកទំព័រ' : 'Swipe to view'}
                    </p>

                    <div className="mx-auto mt-5 max-w-[300px]">
                        <AnimatePresence mode="wait" custom={storyDirection}>
                            <motion.div
                                key={activeStory.id}
                                custom={storyDirection}
                                initial={{ opacity: 0, x: storyDirection > 0 ? 44 : -44, rotate: storyDirection > 0 ? -2 : 2 }}
                                animate={{ opacity: 1, x: 0, rotate: -2 }}
                                exit={{ opacity: 0, x: storyDirection > 0 ? -44 : 44, rotate: storyDirection > 0 ? 2 : -2 }}
                                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                drag={normalizedStorySlides.length > 1 ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.16}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -60) paginateStory(1);
                                    if (info.offset.x > 60) paginateStory(-1);
                                }}
                                className="rounded-[14px] bg-white/75 p-3 shadow-[0_18px_36px_rgba(84,103,112,0.18)]"
                            >
                                <div className="relative overflow-hidden rounded-[8px] bg-[#eef7f8]">
                                    {normalizedStorySlides.length > 1 && (
                                        <div className="absolute left-3 right-3 top-3 z-10 flex gap-1.5">
                                            {normalizedStorySlides.map((slide, index) => (
                                                <div key={slide.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/45 shadow-[0_1px_3px_rgba(58,73,82,0.18)]">
                                                    <motion.div
                                                        key={`${slide.id}-${storyIndex}`}
                                                        initial={{ width: index < storyIndex ? '100%' : '0%' }}
                                                        animate={{ width: index < storyIndex ? '100%' : index === storyIndex ? '100%' : '0%' }}
                                                        transition={{ duration: index === storyIndex ? 4.2 : 0.18, ease: 'linear' }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: index <= storyIndex ? cs.text : 'transparent' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <img src={activeStory.imageUrl} alt={activeStory.title || 'Story'} className="aspect-[4/5] w-full object-cover" />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {(activeStory.title || activeStory.caption) && (
                        <div className="mx-auto mt-5 max-w-[300px] space-y-1">
                            {activeStory.title && <p className={`${headingClass} text-[22px]`} style={{ color: cs.text }}>{activeStory.title}</p>}
                            {activeStory.caption && <p className={`${bodyClass} text-[14px] leading-6`} style={{ color: cs.textSecondary }}>{activeStory.caption}</p>}
                        </div>
                    )}

                    {normalizedStorySlides.length > 1 && (
                        <div className="mt-5 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => paginateStory(-1)}
                                className={`${bodyClass} rounded-full border bg-white/45 px-3 py-1.5 text-[12px] font-bold`}
                                style={{ borderColor: cs.border, color: cs.text }}
                            >
                                {language === 'kh' ? 'មុន' : 'Prev'}
                            </button>
                            <div className="flex items-center gap-1.5">
                                {normalizedStorySlides.map((slide, index) => (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        onClick={() => {
                                            setStoryDirection(index > storyIndex ? 1 : -1);
                                            setStoryIndex(index);
                                        }}
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: index === storyIndex ? 18 : 8,
                                            backgroundColor: index === storyIndex ? cs.text : `${cs.textSecondary}66`,
                                        }}
                                        aria-label={`Go to story ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => paginateStory(1)}
                                className={`${bodyClass} rounded-full border bg-white/45 px-3 py-1.5 text-[12px] font-bold`}
                                style={{ borderColor: cs.border, color: cs.text }}
                            >
                                {language === 'kh' ? 'បន្ទាប់' : 'Next'}
                            </button>
                        </div>
                    )}

                    <div className="mt-4 text-[12px] font-semibold" style={{ color: cs.textSecondary }}>
                        {storyIndex + 1} / {normalizedStorySlides.length}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <main lang={language === 'kh' ? 'km' : 'en'} className={`relative min-h-screen overflow-x-hidden ${bodyClass}`} style={{ color: cs.text }}>
            {phase === 'intro' && renderBackground(introVideoUrl || backgroundVideoUrl, backgroundImageUrl)}
            {phase === 'transition' && renderBackground(
                transitionVideoUrl || backgroundVideoUrl,
                backgroundImageUrl,
            )}
            {phase === 'details' && renderBackground(backgroundVideoUrl, backgroundImageUrl)}
            <BlueArchFallingField color={cs.secondary} />
            <BlueArchPageFlash show={showPageFlash} primary={cs.primary} accent={cs.accent} />
            {phase === 'intro' && renderFrameOverlay(props.introFrameUrl)}
            {phase === 'transition' && renderFrameOverlay(props.transitionFrameUrl)}
            {phase === 'details' && renderFrameOverlay(props.detailFrameUrl)}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

            {musicUrl && (
                <button
                    type="button"
                    onClick={() => {
                        if (!audioRef.current) return;
                        if (isPlaying) {
                            audioRef.current.pause();
                            setIsPlaying(false);
                        } else {
                            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
                        }
                    }}
                    className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border bg-white/35 shadow-lg backdrop-blur-md"
                    style={{ borderColor: cs.border, color: cs.text }}
                    aria-label="Toggle background music"
                >
                    {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            )}

            <AnimatePresence mode="wait">
                {phase === 'intro' ? (
                <motion.section
                    key="intro"
                    initial={{ opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, scale: 1.015, filter: 'blur(8px)' }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 flex min-h-screen items-start justify-center px-6 pt-[18svh]"
                >
                    <div className="w-full max-w-sm text-center">
                        <p
                            className={introLabelClass}
                            style={{
                                color: cs.textSecondary,
                                textTransform: isKhmer ? 'none' : 'uppercase',
                                letterSpacing: isKhmer ? 0 : undefined,
                            }}
                        >
                            {eventTypeLabel}
                        </p>
                        <div className={`mx-auto mt-5 max-w-[22rem] ${headingClass}`} style={{ color: cs.text }}>
                            {renderStackedNames(
                                mainNames,
                                isKhmer ? 'text-[22px] leading-tight' : 'text-[26px] leading-tight'
                            )}
                        </div>
                        <div className="mx-auto mt-7 max-w-[18rem] px-5 py-4 text-center">
                            <div className="mx-auto mb-4 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${cs.textSecondary}80, transparent)` }} />
                            <p
                                className={introInviteLabelClass}
                                style={{
                                    color: cs.textSecondary,
                                    textTransform: isKhmer ? 'none' : 'uppercase',
                                    letterSpacing: isKhmer ? 0 : undefined,
                                }}
                            >
                                {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Special Guest'}
                            </p>
                            <p className={`${headingClass} mt-2 ${isKhmer ? 'text-[18px] font-bold leading-[1.45]' : 'text-[22px] leading-tight'}`} style={{ color: '#B4975A' }}>
                                {guestName || (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest')}
                            </p>
                            <KbachDivider />
                            <div className="mx-auto mt-4 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${cs.textSecondary}80, transparent)` }} />
                        </div>
                        <div className="relative mx-auto mt-11 h-20 w-full">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <button
                                    type="button"
                                    onClick={handleOpen}
                                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                >
                                    {renderIntroOpenButton()}
                                </button>
                                <div className="absolute left-[calc(100%-1.4rem)] top-1/2 z-[100] -translate-y-1/2">
                                    <OpenInvitationHint
                                        label={openInvitationHintLabel}
                                        color={cs.primary}
                                        textColor={cs.text}
                                        borderColor={cs.border}
                                        background="rgba(255,255,255,0.36)"
                                        iconOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            ) : phase === 'transition' ? (
                <motion.section
                    key="transition"
                    initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -24, scale: 1.02, filter: 'blur(10px)' }}
                    transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 min-h-screen"
                >
                    {renderTransitionPreview()}
                    <div className="absolute bottom-28 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
                        <motion.div
                            key={transitionRemaining}
                            initial={{ opacity: 0, scale: 0.82 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.12 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className={`${bodyClass} flex h-9 min-w-9 items-center justify-center rounded-full border bg-white/45 px-3 text-[13px] font-bold shadow-lg backdrop-blur-md`}
                            style={{ borderColor: cs.border, color: cs.text }}
                        >
                            {transitionRemaining > 0 ? transitionRemaining : '...'}
                        </motion.div>
                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2].map((dot) => (
                                <motion.span
                                    key={dot}
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: cs.text }}
                                    animate={{ opacity: [0.28, 0.9, 0.28], y: [0, -3, 0] }}
                                    transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.16, ease: 'easeInOut' }}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => changePhase('details')}
                        className={`${isKhmer ? 'text-[15px] tracking-normal' : 'text-[12px] uppercase tracking-[0.26em]'} absolute bottom-10 left-1/2 z-40 -translate-x-1/2 rounded-full border bg-white/45 px-7 py-3 font-bold shadow-lg backdrop-blur-md`}
                        style={{
                            borderColor: cs.border,
                            color: cs.text,
                            textTransform: isKhmer ? 'none' : 'uppercase',
                            letterSpacing: isKhmer ? 0 : undefined,
                        }}
                    >
                        {language === 'kh' ? 'រំលង' : 'Skip'}
                    </button>
                </motion.section>
            ) : (
                <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 26, scale: 0.985, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -18, scale: 1.01, filter: 'blur(8px)' }}
                    transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
                    ref={detailScrollRef}
                    className="relative z-10 h-[100svh] overflow-y-auto overscroll-y-contain scroll-smooth snap-y snap-mandatory"
                >
                    <motion.section {...detailPageMotion} className={detailSnapSectionClass}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className={`w-full px-3 py-2 text-center min-[760px]:px-5 min-[760px]:py-8 ${isKhmer ? 'space-y-3 min-[760px]:space-y-6' : 'space-y-4 min-[760px]:space-y-6'}`}
                        >
                            <div className="space-y-2 min-[760px]:space-y-4">
                                <p className={smallTextClass} style={{ color: cs.textSecondary }}>
                                    {eventTypeLabel}
                                </p>
                                <div className={`${headingClass} ${isKhmer ? 'text-[24px] leading-[1.24]' : 'text-[1.95rem] leading-[1.02]'} min-[760px]:text-[34px]`} style={{ color: cs.text }}>
                                    {renderStackedNames(mainNames, isKhmer ? 'text-[24px]' : 'text-[28px]', 'gap-4')}
                                </div>
                            </div>

                            {isMovieEvent && movieCredits.length > 0 && (
                                <div className="mx-auto grid max-w-[20rem] grid-cols-2 gap-x-4 gap-y-2 text-center">
                                    {movieCredits.slice(0, 12).map((credit, index) => (
                                        <div key={`${credit.role}-${index}`} className="space-y-0.5">
                                            <p className={`${hanuman.className} text-[11px] font-bold leading-5`} style={{ color: cs.textSecondary }}>
                                                {credit.role}
                                            </p>
                                            <p className={`${bodyClass} text-[13px] font-bold leading-5`} style={{ color: cs.text }}>
                                                {language === 'en' && credit.nameEn ? credit.nameEn : credit.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isMovieEvent && familyRows.length > 0 && (
                                <div className={`grid ${isKhmer ? 'gap-2 min-[760px]:gap-4' : 'gap-x-5 gap-y-3'} ${familyRows.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} text-center`}>
                                    {familyRows.map((row) => (
                                        <div key={row.label} className="space-y-1">
                                            <p className={`${isKhmer ? hanuman.className : bodyClass} ${isKhmer ? 'text-[12px] leading-5 min-[760px]:text-[13px] min-[760px]:leading-6' : 'text-[12px] leading-5'} font-bold`} style={{ color: cs.textSecondary }}>
                                                {row.label}
                                            </p>
                                            <div className={`${bodyClass} space-y-0.5 ${isKhmer ? 'text-[13px] leading-5 min-[760px]:text-[14px] min-[760px]:leading-6' : 'text-[13px] leading-6'} font-semibold`} style={{ color: cs.text }}>
                                                {row.names.map((name) => (
                                                    <p key={name}>{name}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

	                             <div className={`${isKhmer ? 'space-y-2' : 'space-y-2.5'} px-1 py-1 text-center min-[760px]:py-2`}>
                                <p className={smallTextClass} style={{ color: cs.textSecondary }}>
                                    {language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Invite You To The Celebration'}
                                </p>
                                <p className={`${bodyClass} ${isKhmer ? 'text-[13px] leading-6 min-[760px]:text-[15px] min-[760px]:leading-8' : 'text-[13px] leading-6'}`} style={{ color: cs.text }}>
                                    {invitationMessage || defaultInvitationMessage}
                                </p>
                            </div>

                            <div className="mx-auto h-px w-28" style={{ background: `${cs.textSecondary}55` }} />

                            <div className={`grid text-center ${isKhmer ? 'gap-3 min-[760px]:gap-5' : 'gap-2.5 min-[760px]:gap-4'}`}>
                                <div className="grid justify-items-center gap-1.5 min-[760px]:gap-2">
                                    <CalendarDays size={22} style={iconStyle} />
                                    <div>
                                        <p className={`${bodyClass} text-[11px] font-bold uppercase tracking-[0.18em] min-[760px]:text-[12px]`} style={{ color: cs.textSecondary }}>
                                            {language === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}
                                        </p>
                                        <p className={`${bodyClass} mt-0.5 text-[13px] font-semibold leading-6 min-[760px]:mt-1 min-[760px]:text-[15px] min-[760px]:leading-7`} style={{ color: cs.text }}>
                                            {dateLabel}{timeLabel ? `, ${timeLabel}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid justify-items-center gap-1.5 min-[760px]:gap-2">
                                    <MapPin size={22} style={iconStyle} />
                                    <div>
                                        <p className={`${bodyClass} text-[11px] font-bold uppercase tracking-[0.18em] min-[760px]:text-[12px]`} style={{ color: cs.textSecondary }}>
                                            {language === 'kh' ? 'ទីតាំង' : 'Venue'}
                                        </p>
                                        <p className={`${bodyClass} mt-0.5 text-[13px] font-semibold leading-6 min-[760px]:mt-1 min-[760px]:text-[15px] min-[760px]:leading-7`} style={{ color: cs.text }}>
                                            {venueDetails || location}
                                        </p>
                                        {mapUrl && (
                                            <a href={mapUrl} target="_blank" rel="noreferrer" className={`${bodyClass} mt-2 inline-flex items-center justify-center gap-1 text-[12px] font-bold`} style={{ color: cs.text }}>
                                                <MapPin size={13} /> {language === 'kh' ? 'បើកផែនទី' : 'Open Map'}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <ScrollUpGuide
                            show={showScrollGuide}
                            label={language === 'kh' ? 'សូមអូសឡើងលើ ដើម្បីមើលបន្ថែម' : 'Swipe Up For More'}
                            color={cs.primary}
                            textColor={cs.textSecondary}
                            borderColor={cs.border}
                            className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
                            lineClassName="h-8 w-px"
                            labelClassName={`${bodyClass} text-[11px] font-bold`}
                            iconSize={13}
                        />
                    </motion.section>

                    {scheduleItems.length > 0 && (
                        <motion.section {...detailPageMotion} className={detailSnapSectionClass}>
                            <div className="w-full space-y-5 px-3 py-5 text-center">
                                <div className="space-y-2">
                                    <Clock className="mx-auto" size={26} style={{ color: cs.text }} />
                                    <p className={`${headingClass} ${isKhmer ? 'text-[30px] leading-tight' : 'text-[34px] leading-tight'}`} style={{ color: cs.text }}>
                                        {language === 'kh' ? 'កម្មវិធី' : 'Event Schedule'}
                                    </p>
                                    <div className="mx-auto h-px w-20" style={{ background: `linear-gradient(90deg, transparent, ${cs.border}, transparent)` }} />
                                </div>

                                <div className="mx-auto max-h-[68svh] w-full max-w-[22rem] overflow-y-auto pr-1 text-left">
                                    <div className="space-y-6">
                                        {scheduleGroups.map((group, groupIndex) => (
                                            <div key={`${group.date || 'schedule'}-${groupIndex}`} className="space-y-3">
                                                {group.date && (
                                                    <p className={`${bodyClass} text-center text-[13px] font-bold leading-6`} style={{ color: cs.textSecondary }}>
                                                        {formatScheduleDate(group.date)}
                                                    </p>
                                                )}
                                                <div className="relative space-y-0 before:absolute before:bottom-3 before:left-[4.35rem] before:top-3 before:w-px before:bg-current before:opacity-20" style={{ color: cs.textSecondary }}>
                                                    {group.items.map((item, index) => (
                                                        <motion.div
                                                            key={`${group.date || 'schedule'}-${index}-${item.time || ''}`}
                                                            initial={{ opacity: 0, y: 16 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            viewport={{ once: false, amount: 0.2 }}
                                                            transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
                                                            className="grid grid-cols-[4rem_1rem_1fr] gap-3 py-2"
                                                        >
                                                            <p className={`${bodyClass} pt-0.5 text-right text-[12px] font-bold leading-5`} style={{ color: cs.text }}>
                                                                {formatScheduleTime(item.time)}
                                                            </p>
                                                            <div className="relative z-10 mt-2 h-2.5 w-2.5 rounded-full border-2 bg-white/80" style={{ borderColor: cs.border }} />
                                                            <div className="space-y-1">
                                                                <p className={`${bodyClass} text-[14px] font-bold leading-6`} style={{ color: cs.text }}>
                                                                    {language === 'en' ? (item.activityEn || item.titleEn || item.activity || item.title) : (item.activity || item.title)}
                                                                </p>
                                                                {(language === 'en' ? (item.descriptionEn || item.description) : item.description) && (
                                                                    <p className={`${bodyClass} text-[12px] font-semibold leading-5`} style={{ color: cs.textSecondary }}>
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
                            </div>
                        </motion.section>
                    )}

                    {normalizedStorySlides.length > 0 && (
                        <motion.section {...detailPageMotion} className={detailSnapSectionClass}>
                            <div className="w-full">
                                {renderStoryAlbum()}
                            </div>
                        </motion.section>
                    )}

                        {(albumPhotos.length > 0 || albumVideos.length > 0) && (
                        <motion.section {...detailPageMotion} className="relative mx-auto min-h-[100svh] w-full max-w-[430px] snap-start snap-always overflow-hidden px-9 py-12">
                            <div className="py-2">
                                <GalleryAlbum
                                    photos={albumPhotos}
                                    videos={albumVideos}
                                    colorScheme={cs}
                                    previewCount={3}
                                    showSeeMore
                                    seeMoreLabel={language === 'kh' ? 'មើលបន្ថែម' : 'See More'}
                                />
                            </div>
                        </motion.section>
                        )}

                        {onRsvp && (
                        <motion.section {...detailPageMotion} className={detailSnapSectionClass}>
                            <div className="w-full px-3 py-8 text-center">
                                <Gift className="mx-auto" size={26} style={{ color: cs.text }} />
                                <p className={`mt-3 text-3xl ${headingClass}`} style={{ color: cs.text }}>{language === 'kh' ? 'ការឆ្លើយតប' : 'Your Presence'}</p>
                                <p className={`${bodyClass} mt-2 text-[13px] leading-6`} style={{ color: cs.textSecondary }}>
                                    {language === 'kh' ? 'សូមជួយជម្រាបការចូលរួមរបស់អ្នក' : 'Please let us know if you can join us.'}
                                </p>
                                <div className="mt-5 grid gap-3">
                                    <button disabled={rsvpSubmitting || rsvpSent} onClick={() => handleRsvp('ACCEPTED')} className={`${bodyClass} rounded-full px-5 py-3 text-sm font-bold`} style={{ background: cs.gradient, color: '#FFFFFF' }}>
                                        {rsvpSent ? (language === 'kh' ? 'អរគុណ' : 'Thank You') : (language === 'kh' ? 'ចូលរួម' : 'Accept')}
                                    </button>
                                    <button disabled={rsvpSubmitting || rsvpSent} onClick={() => handleRsvp('DECLINED')} className={`${bodyClass} rounded-full border px-5 py-3 text-sm font-bold`} style={{ borderColor: cs.border, color: cs.text }}>
                                        {language === 'kh' ? 'មិនអាចចូលរួម' : 'Decline'}
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                        )}

                        {paymentQrImageUrl && (
                        <motion.section {...detailPageMotion} className={detailSnapSectionClass} data-blue-arch-after-rsvp="true">
                            <div className="w-full space-y-5 py-5 text-center">
                                <div className="space-y-2">
                                    <Gift className="mx-auto" size={28} style={{ color: cs.text }} />
                                    <p className={`${headingClass} ${isKhmer ? 'text-[30px] leading-tight' : 'text-[34px] leading-tight'}`} style={{ color: cs.text }}>
                                        {language === 'kh' ? 'ចំណងដៃតាម QR' : 'QR Gift'}
                                    </p>
                                    <p className={`${bodyClass} mx-auto max-w-[18rem] text-[14px] font-semibold leading-7`} style={{ color: cs.textSecondary }}>
                                        {language === 'kh'
                                            ? 'សម្រាប់ភ្ញៀវដែលចង់ផ្ញើចំណងដៃ ឬអំណោយជូនម្ចាស់កម្មវិធី សូមស្កេន QR ខាងក្រោម។'
                                            : 'Scan this QR to send a gift or blessing to the host.'}
                                    </p>
                                </div>
                                <div className="mx-auto w-fit rounded-[18px] bg-white/70 p-3 shadow-[0_18px_36px_rgba(84,103,112,0.16)] backdrop-blur-sm">
                                    <img src={paymentQrImageUrl} alt={language === 'kh' ? 'QR សម្រាប់ផ្ញើចំណងដៃ' : 'Gift payment QR'} className="h-60 w-60 object-contain" />
                                </div>
                                <p className={`${bodyClass} text-[12px] font-bold`} style={{ color: cs.textSecondary }}>
                                    {language === 'kh' ? 'អរគុណសម្រាប់ការជូនពរ និងចំណងដៃ' : 'Thank you for your wishes and gift'}
                                </p>
                            </div>
                        </motion.section>
                        )}

                    {featureLimits?.digitalWishes !== false && (wishesEventId || wishesGuestCode) && (
                        <motion.section {...detailPageMotion} className="relative mx-auto flex min-h-[100svh] w-full max-w-[430px] snap-start snap-always flex-col items-center justify-start overflow-hidden px-9 py-12 pt-32" data-blue-arch-after-rsvp="true">
                        <DigitalWishesSection
                            eventId={wishesEventId}
                            enabled={true}
                            guestCode={wishesGuestCode}
                            guestName={guestName}
                            colorScheme={cs}
                            language={language}
                        />
                        </motion.section>
                    )}
                    {(eventDate && featureLimits?.addToCalendar) ? (
                        <motion.section {...detailPageMotion} className="relative mx-auto min-h-[100svh] w-full max-w-[430px] snap-start snap-always overflow-hidden px-9 py-12" data-blue-arch-after-rsvp="true">
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </motion.section>
                    ) : (
                        <section className="relative mx-auto min-h-[45svh] w-full max-w-[430px] snap-start overflow-hidden px-9 py-12">
                            <AppFooter colorScheme={cs} />
                        </section>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </main>
    );
}
