'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock3, Gift, MapPin, Volume2, VolumeX } from 'lucide-react';
import { Playfair_Display, Cormorant_Garamond, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';
import ScrollUpGuide from '../ScrollUpGuide';
import OpenInvitationHint from '../OpenInvitationHint';
import { toKhmerDate, toKhmerTime } from '@/lib/khmer-utils';

const playfair = Playfair_Display({ subsets: ['latin'] });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

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

interface Props {
    id?: string;
    code?: string;
    guestName?: string;
    eventTitle?: string | null;
    eventType?: string | null;
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
    albumPhotos?: string[];
    albumVideos?: string[];
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    templateConfig?: any;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    paymentQrImageUrl?: string | null;
    featureLimits?: {
        digitalWishes?: boolean;
        [key: string]: any;
    };
    previewPage?: 'intro' | 'transition' | 'details';
    [key: string]: any;
}

function FloatingPetals({ primary, accent }: { primary: string; accent: string }) {
    const petals = [
        { left: '10%', top: '12%', delay: 0.2, duration: 8, rotate: -18, scale: 0.95 },
        { left: '82%', top: '10%', delay: 1.1, duration: 9.4, rotate: 16, scale: 1.1 },
        { left: '8%', top: '48%', delay: 0.8, duration: 8.8, rotate: -24, scale: 0.9 },
        { left: '85%', top: '44%', delay: 1.6, duration: 10.2, rotate: 20, scale: 1.06 },
        { left: '14%', top: '78%', delay: 0.5, duration: 9.6, rotate: -12, scale: 1 },
        { left: '80%', top: '75%', delay: 1.8, duration: 10.8, rotate: 18, scale: 1.05 },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {petals.map((petal, index) => (
                <motion.div
                    key={`${petal.left}-${petal.top}-${index}`}
                    className="absolute"
                    style={{ left: petal.left, top: petal.top }}
                    animate={{
                        y: [0, -8, 0, 10, 0],
                        x: [0, index % 2 === 0 ? 6 : -7, 0],
                        rotate: [petal.rotate, petal.rotate + 6, petal.rotate - 5, petal.rotate],
                    }}
                    transition={{
                        duration: petal.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: petal.delay,
                    }}
                >
                    <div
                        className="relative h-24 w-12 rounded-full blur-[0.3px]"
                        style={{
                            transform: `scale(${petal.scale})`,
                            background: `linear-gradient(180deg, ${accent}95 0%, ${primary}75 45%, transparent 100%)`,
                            clipPath: 'ellipse(42% 50% at 50% 50%)',
                            opacity: 0.85,
                        }}
                    >
                        <div
                            className="absolute left-1/2 top-2 h-20 w-px -translate-x-1/2"
                            style={{ background: `linear-gradient(180deg, ${primary}99 0%, transparent 100%)` }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function FloralSprigs({ side, primary, secondary }: { side: 'left' | 'right'; primary: string; secondary: string }) {
    const alignClass = side === 'left' ? 'left-0 items-start' : 'right-0 items-end';
    const stemRotate = side === 'left' ? '-rotate-6' : 'rotate-6';
    const leafDirection = side === 'left' ? 1 : -1;

    return (
        <div className={`pointer-events-none absolute inset-y-0 ${alignClass} flex w-28 justify-center overflow-hidden sm:w-36`}>
            <motion.div
                className={`relative h-full w-full ${stemRotate}`}
                animate={{ y: [0, -6, 0], rotate: side === 'left' ? [-6, -4, -6] : [6, 4, 6] }}
                transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div
                    className="absolute top-0 h-full w-px"
                    style={{
                        left: side === 'left' ? '28%' : '72%',
                        background: `linear-gradient(180deg, transparent 0%, ${secondary}70 10%, ${primary}55 85%, transparent 100%)`,
                    }}
                />
                {Array.from({ length: 8 }).map((_, index) => {
                    const top = 10 + index * 11;
                    const leafSize = 20 + (index % 3) * 5;
                    const offset = side === 'left' ? 22 + (index % 2) * 18 : 50 - (index % 2) * 18;
                    return (
                        <motion.div
                            key={`${side}-leaf-${index}`}
                            className="absolute"
                            style={{ top: `${top}%`, left: `${offset}%` }}
                            animate={{ rotate: [leafDirection * -10, leafDirection * 6, leafDirection * -10], x: [0, leafDirection * 3, 0] }}
                            transition={{ duration: 5.5 + index * 0.35, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                        >
                            <div
                                style={{
                                    width: leafSize,
                                    height: leafSize * 1.6,
                                    background: `linear-gradient(180deg, ${secondary}95 0%, ${primary}80 100%)`,
                                    borderRadius: '100% 0 100% 0',
                                    transform: `rotate(${leafDirection * (index % 2 === 0 ? -30 : 28)}deg)`,
                                    opacity: 0.82,
                                    boxShadow: `0 8px 20px ${primary}26`,
                                }}
                            />
                        </motion.div>
                    );
                })}
                {Array.from({ length: 6 }).map((_, index) => {
                    const top = 8 + index * 14;
                    const left = side === 'left' ? '36%' : '58%';
                    return (
                        <motion.div
                            key={`${side}-flower-${index}`}
                            className="absolute"
                            style={{ top: `${top}%`, left }}
                            animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.72, 1, 0.72], y: [0, -3, 0] }}
                            transition={{ duration: 4.8 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 }}
                        >
                            <div className="relative h-6 w-6">
                                {Array.from({ length: 5 }).map((__, petalIndex) => (
                                    <span
                                        key={petalIndex}
                                        className="absolute left-1/2 top-1/2 block h-3 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                        style={{
                                            background: secondary,
                                            transform: `translate(-50%, -50%) rotate(${petalIndex * 72}deg) translateY(-7px)`,
                                            opacity: 0.95,
                                        }}
                                    />
                                ))}
                                <span
                                    className="absolute left-1/2 top-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                    style={{ background: '#F3E7A3', boxShadow: `0 0 12px ${secondary}` }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}

function ArchFlowerOverlay({ side, primary, secondary, accent }: { side: 'left' | 'right'; primary: string; secondary: string; accent: string }) {
    const sideClass = side === 'left' ? 'left-[-18px]' : 'right-[-18px]';
    const stemClass = side === 'left' ? '-rotate-12' : 'rotate-12';
    const petalTranslate = side === 'left' ? '-translate-x-3' : 'translate-x-3';

    return (
        <motion.div
            className={`pointer-events-none absolute top-24 z-20 ${sideClass}`}
            animate={{ y: [0, -5, 0], rotate: side === 'left' ? [-2, 2, -2] : [2, -2, 2] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className={`relative h-44 w-24 ${stemClass}`}>
                <div
                    className="absolute left-1/2 top-6 h-36 w-px -translate-x-1/2"
                    style={{ background: `linear-gradient(180deg, ${primary}00 0%, ${primary}88 18%, ${secondary}66 100%)` }}
                />
                {[0, 1, 2].map((cluster) => (
                    <div
                        key={cluster}
                        className={`absolute left-1/2 top-[${22 + cluster * 24}%] -translate-x-1/2`}
                        style={{ top: `${18 + cluster * 22}%` }}
                    >
                        <motion.div
                            animate={{ scale: [0.96, 1.05, 0.96] }}
                            transition={{ duration: 4 + cluster * 0.6, repeat: Infinity, ease: 'easeInOut', delay: cluster * 0.2 }}
                            className="relative h-14 w-14"
                        >
                            {Array.from({ length: 5 }).map((_, petalIndex) => (
                                <span
                                    key={petalIndex}
                                    className={`absolute left-1/2 top-1/2 block h-6 w-3 rounded-full ${petalTranslate}`}
                                    style={{
                                        background: `linear-gradient(180deg, ${accent} 0%, ${secondary} 100%)`,
                                        transform: `translate(-50%, -50%) rotate(${petalIndex * 72}deg) translateY(-13px)`,
                                        boxShadow: `0 0 12px ${secondary}55`,
                                    }}
                                />
                            ))}
                            <span
                                className="absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={{ background: '#F4E9A8', boxShadow: `0 0 14px ${accent}` }}
                            />
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function ArchPanel({
    children,
    primary,
    secondary,
    className = '',
}: {
    children: React.ReactNode;
    primary: string;
    secondary: string;
    className?: string;
}) {
    return (
        <div className={`relative mx-auto w-full max-w-md overflow-visible px-7 pb-10 pt-12 ${className}`}>
            <ArchFlowerOverlay side="left" primary={primary} secondary={secondary} accent="#FFF9FF" />
            <ArchFlowerOverlay side="right" primary={primary} secondary={secondary} accent="#FFF9FF" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

export default function BotanicalArchLayout(props: Props) {
    const {
        id,
        code,
        guestName,
        eventTitle,
        eventDate,
        location,
        venueDetails,
        invitationMessage,
        groomFirstName,
        groomMotherName,
        groomFatherName,
        groomLastName,
        brideFirstName,
        brideFatherName,
        brideMotherName,
        musicUrl,
        onRsvp,
        templateConfig,
        albumPhotos = [],
        albumVideos = [],
        backgroundVideoUrl,
        backgroundImageUrl,
        paymentQrImageUrl,
        featureLimits,
        logoUrl,
    } = props;

    const fallbackColors = {
        primary: '#A889C3',
        secondary: '#C9B1E8',
        accent: '#F7E7FF',
        background: '#F5EFFB',
        text: '#FFF9FF',
        textSecondary: 'rgba(255,249,255,0.8)',
        border: 'rgba(255,255,255,0.5)',
        gradient: 'linear-gradient(135deg, #d9c5f5 0%, #a889c3 48%, #8e739f 100%)',
    };
    const cs = templateConfig?.colorScheme || fallbackColors;
    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);

    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [isSwitching, setIsSwitching] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showScrollGuide, setShowScrollGuide] = useState(true);
    const [hasStartedDetailScroll, setHasStartedDetailScroll] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionTimeoutRef = useRef<number | null>(null);

    const introPageConfig = templateConfig?.pages?.intro || {};
    const transitionPageConfig = templateConfig?.pages?.transition || {};
    const transitionDurationMs = Math.max(
        1200,
        Math.min(
            20000,
            Number(transitionPageConfig.autoAdvanceSeconds || templateConfig?.transitionDurationSeconds || 3.5) * 1000
        )
    );
    const pageSwitchMs = 750;

    useEffect(() => {
        if (musicUrl && audioRef.current && phase !== 'intro') {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    }, [musicUrl, phase]);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    useEffect(() => {
        return () => {
            if (transitionTimeoutRef.current) {
                window.clearTimeout(transitionTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (phase !== 'details') {
            setShowScrollGuide(true);
            setHasStartedDetailScroll(false);
            return;
        }

        const onScroll = () => {
            if (window.scrollY > 8) {
                setShowScrollGuide(false);
                setHasStartedDetailScroll(true);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, [phase]);

    const namesLine = persona.isBirthday
        ? persona.primaryFullName || [groomFirstName, groomLastName].filter(Boolean).join(' ') || eventTitle || ''
        : [
            [groomFirstName, groomLastName].filter(Boolean).join(' '),
            [brideFirstName, props.brideLastName].filter(Boolean).join(' '),
        ].filter(Boolean).join(' & ');

    const detailHeadline = persona.isBirthday
        ? persona.primaryFullName || [groomFirstName, groomLastName].filter(Boolean).join(' ') || eventTitle || labels.eventTitle
        : [
            [groomFirstName, groomLastName].filter(Boolean).join(' '),
            [brideFirstName, props.brideLastName].filter(Boolean).join(' '),
        ].filter(Boolean).join(' & ');

    const familyRows = useMemo(() => {
        if (persona.isBirthday) {
            const birthdayFamily = [groomFatherName, groomMotherName, brideFatherName, brideMotherName].filter(Boolean);
            return birthdayFamily.length > 0 ? [{ label: labels.familyTitle, value: birthdayFamily.join(language === 'kh' ? ' • ' : ' • ') }] : [];
        }

        const rows = [];
        const primaryParents = [groomFatherName, groomMotherName].filter(Boolean).join(language === 'kh' ? ' • ' : ' • ');
        const secondaryParents = [brideFatherName, brideMotherName].filter(Boolean).join(language === 'kh' ? ' • ' : ' • ');

        if (primaryParents) rows.push({ label: language === 'kh' ? 'ក្រុមគ្រួសារខាងប្រុស' : 'Groom Family', value: primaryParents });
        if (secondaryParents) rows.push({ label: language === 'kh' ? 'ក្រុមគ្រួសារខាងស្រី' : 'Bride Family', value: secondaryParents });
        return rows;
    }, [persona.isBirthday, groomFatherName, groomMotherName, brideFatherName, brideMotherName, labels.familyTitle, language]);

    const dateLabel = eventDate
        ? language === 'kh'
            ? toKhmerDate(eventDate)
            : new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate))
        : '';
    const timeLabel = eventDate
        ? language === 'kh'
            ? toKhmerTime(new Date(eventDate))
            : new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(eventDate))
        : '';
    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const openInvitationHintLabel = language === 'kh' ? 'ចុចត្រង់នេះ' : 'Tap Here';
    const guestLabel = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Invite You As Our Honored Guest';
    const introEventTypeLabel = language === 'kh'
        ? (persona.isBirthday ? 'កម្មវិធីខួបកំណើត' : 'សិរីសួស្តីអាពាហ៍ពិពាហ៍')
        : (persona.isBirthday ? 'Birthday Celebration' : 'Wedding Celebration');
    const togetherLabel = persona.isBirthday
        ? language === 'kh' ? 'សូមអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយស' : 'Join Us To Celebrate'
        : language === 'kh' ? 'ជាមួយក្រុមគ្រួសាររបស់ពួកយើង' : 'Together With Their Families';
    const saveTheDateLabel = 'Save The Date';
    const forTheWeddingLabel = persona.isBirthday ? 'For the birthday of' : 'For the wedding of';
    const detailMessage = invitationMessage || (language === 'kh'
        ? 'ដោយក្តីស្រឡាញ់ និងសេចក្តីរីករាយ សូមអញ្ជើញចូលរួមក្នុងពិធីដ៏ពិសេសនេះជាមួយយើង។'
        : 'With heartfelt joy, we would be honored to celebrate this beautiful occasion together with you.');
    const rsvpTitle = language === 'kh' ? 'ការឆ្លើយតប' : 'Your Presence';
    const rsvpSubtitle = language === 'kh' ? 'សូមជួយជម្រាបការចូលរួមរបស់អ្នក' : 'We would be honored to celebrate with you';
    const rsvpAcceptedLabel = language === 'kh' ? 'ចូលរួមដោយក្តីរីករាយ' : 'Accept With Joy';
    const rsvpDeclinedLabel = language === 'kh' ? 'សូមអភ័យទោស មិនអាចចូលរួម' : 'Regretfully Decline';
    const rsvpThanksLabel = language === 'kh' ? 'សូមអរគុណសម្រាប់ការឆ្លើយតប' : 'Thank you for your kind response';
    const paymentQrTitle = language === 'kh' ? 'ស្កេនសម្រាប់ការទូទាត់' : 'Scan For Payment';
    const paymentQrHint = language === 'kh' ? 'ភ្ញៀវអាចស្កេន QR នេះសម្រាប់ការជូនអំណោយ ឬទូទាត់' : 'Guests can scan this QR code for gifts or payment.';
    const scrollGuideLabel = language === 'kh' ? 'សូមអូសឡើងលើ' : 'Scroll Up';

    const displayHeadingClass = language === 'kh' ? moul.className : cormorant.className;
    const supportingHeadingClass = language === 'kh' ? koulen.className : playfair.className;
    const bodyClass = language === 'kh' ? kantumruy.className : montserrat.className;

    const switchPhase = (nextPhase: 'intro' | 'transition' | 'details') => {
        if (props.previewPage) {
            setPhase(nextPhase);
            return;
        }

        setIsSwitching(true);
        window.setTimeout(() => {
            setPhase(nextPhase);
        }, pageSwitchMs * 0.42);
        window.setTimeout(() => {
            setIsSwitching(false);
        }, pageSwitchMs);
    };

    const handleOpen = () => {
        switchPhase('transition');
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        if (!props.previewPage) {
            if (transitionTimeoutRef.current) {
                window.clearTimeout(transitionTimeoutRef.current);
            }
            if ((transitionPageConfig.transitionMode || 'auto') === 'auto') {
                transitionTimeoutRef.current = window.setTimeout(() => {
                    switchPhase('details');
                }, transitionDurationMs);
            }
        }
    };

    const handleRsvp = async (status: 'ACCEPTED' | 'DECLINED') => {
        if (!onRsvp || rsvpSubmitting) return;
        try {
            setRsvpSubmitting(true);
            await onRsvp(status);
            setRsvpSent(true);
        } finally {
            setRsvpSubmitting(false);
        }
    };

    const renderBackground = () => (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {backgroundVideoUrl ? (
                isVideoUrl(backgroundVideoUrl) ? (
                    <video src={backgroundVideoUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <img src={backgroundVideoUrl} alt="background" className="absolute inset-0 h-full w-full object-cover" />
                )
            ) : backgroundImageUrl ? (
                <img src={backgroundImageUrl} alt="background" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at top, rgba(255,255,255,0.85) 0%, rgba(238,230,248,0.88) 24%, rgba(219,207,236,0.96) 50%, rgba(245,239,251,1) 100%)',
                    }}
                />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.52),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(112,84,137,0.18))]" />
            <FloatingPetals primary={cs.primary} accent={cs.accent} />
            <FloralSprigs side="left" primary={cs.primary} secondary={cs.secondary} />
            <FloralSprigs side="right" primary={cs.primary} secondary={cs.secondary} />
        </div>
    );

    return (
        <main className="relative min-h-screen overflow-x-hidden" style={{ color: cs.text }}>
            {renderBackground()}

            {musicUrl && <audio ref={audioRef} src={musicUrl} loop preload="auto" />}

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
                className="fixed bottom-6 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full border bg-black/35 backdrop-blur-md transition hover:scale-[1.03]"
                style={{ borderColor: `${cs.primary}90`, color: cs.accent }}
                aria-label="Toggle background music"
            >
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.section
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex min-h-screen items-center px-5 py-20"
                    >
                        <div className="mx-auto w-full max-w-md">
                            <ArchPanel primary={cs.primary} secondary={cs.secondary}>
                                <div className="text-center">
                                    <p
                                        className={`${language === 'kh' ? supportingHeadingClass : `uppercase tracking-[0.35em] ${bodyClass}`}`}
                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '22px' : '11px', lineHeight: language === 'kh' ? 1.45 : 1.4 }}
                                    >
                                        {introEventTypeLabel}
                                    </p>
                                    <div className="mt-8">
                                        <h1
                                            className={`mx-auto max-w-[15rem] text-[34px] leading-[1.08] sm:max-w-[17rem] sm:text-[40px] ${displayHeadingClass}`}
                                            style={{ color: cs.accent }}
                                        >
                                            {persona.isBirthday ? (persona.primaryFullName || [groomFirstName, groomLastName].filter(Boolean).join(' ') || eventTitle || labels.eventTitle) : [groomLastName || groomFirstName, groomLastName].filter(Boolean).join(' ')}
                                            {!persona.isBirthday && (
                                                <>
                                                    <span className={`my-2 block text-[20px] ${supportingHeadingClass}`} style={{ color: '#F5EBFF' }}>&amp;</span>
                                                    {[props.brideLastName || brideFirstName, props.brideLastName].filter(Boolean).join(' ')}
                                                </>
                                            )}
                                        </h1>
                                    </div>

                                    {logoUrl && (
                                        <div className="mt-6 flex justify-center">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                                                className="overflow-hidden rounded-[1.6rem] border border-white/45 bg-white/20 p-2 shadow-[0_18px_40px_rgba(125,92,145,0.26)]"
                                            >
                                                <img src={logoUrl} alt="Celebration mark" className="h-24 w-24 rounded-[1rem] object-cover" />
                                            </motion.div>
                                        </div>
                                    )}

                                    <div className="mt-7 space-y-2">
                                        <p
                                            className={`mx-auto max-w-[16rem] ${language === 'kh' ? supportingHeadingClass : `uppercase tracking-[0.45em] ${bodyClass}`}`}
                                            style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '18px' : '10px', lineHeight: 1.45 }}
                                        >
                                            {guestLabel}
                                        </p>
                                        <p className={`text-[23px] sm:text-[26px] ${supportingHeadingClass}`} style={{ color: '#FFFFFF' }}>
                                            {guestName || (language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Distinguished Guest')}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex flex-col items-center gap-3">
                                        <OpenInvitationHint
                                            label={openInvitationHintLabel}
                                            color={cs.accent}
                                            textColor="#FFFFFF"
                                            borderColor={`${cs.accent}66`}
                                            background="rgba(90,69,105,0.42)"
                                            labelClassName={bodyClass}
                                            iconOnly
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={handleOpen}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`relative inline-flex items-center justify-center rounded-full px-10 py-4 ${language === 'kh' ? `text-[22px] ${supportingHeadingClass}` : `text-sm uppercase tracking-[0.26em] ${bodyClass}`}`}
                                            style={{
                                                background: `linear-gradient(135deg, ${cs.accent} 0%, ${cs.secondary} 100%)`,
                                                color: '#5A4569',
                                                boxShadow: `0 16px 30px ${cs.primary}40`,
                                            }}
                                        >
                                            {openInvitationLabel}
                                        </motion.button>
                                    </div>
                                </div>
                            </ArchPanel>
                        </div>
                    </motion.section>
                )}

                {phase === 'transition' && (
                    <motion.section
                        key="transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 flex min-h-screen items-center px-5 py-20"
                    >
                        <div className="mx-auto w-full max-w-md">
                            <ArchPanel primary={cs.primary} secondary={cs.secondary} className="pb-12 pt-14">
                                {!props.previewPage && (
                                    <div className="absolute right-5 top-5 z-20">
                                        <button
                                            type="button"
                                            onClick={() => switchPhase('details')}
                                            className={language === 'kh'
                                                ? `rounded-full border px-5 py-2 text-[15px] ${bodyClass}`
                                                : `rounded-full border px-5 py-2 text-xs uppercase tracking-[0.28em] ${bodyClass}`}
                                            style={{ borderColor: `${cs.accent}85`, backgroundColor: 'rgba(5, 24, 17, 0.55)', color: '#FFFFFF' }}
                                        >
                                            {language === 'kh' ? 'រំលង' : 'Skip'}
                                        </button>
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="space-y-3">
                                        <p
                                            className={language === 'kh' ? `${supportingHeadingClass}` : `text-[11px] uppercase tracking-[0.42em] ${bodyClass}`}
                                            style={{ color: cs.accent, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                        >
                                            {saveTheDateLabel}
                                        </p>
                                        <p
                                            className={language === 'kh' ? `${bodyClass}` : `text-[10px] uppercase tracking-[0.35em] ${bodyClass}`}
                                            style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.5 : undefined }}
                                        >
                                            {forTheWeddingLabel}
                                        </p>
                                    </div>

                                    <div className="mt-9">
                                        <h2 className={`text-[52px] leading-[0.95] sm:text-[60px] ${displayHeadingClass}`} style={{ color: '#FFFFFF' }}>
                                            {namesLine}
                                        </h2>
                                    </div>

                                    <div
                                        className={language === 'kh' ? `${bodyClass}` : `mt-7 text-xs uppercase tracking-[0.35em] ${bodyClass}`}
                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '15px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                    >
                                        {persona.isBirthday ? labels.celebrationLabel : 'Invite you to their wedding celebration'}
                                    </div>

                                    <div className="mt-10 grid grid-cols-2 gap-4 rounded-[1.8rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                                        <div className="space-y-2">
                                            <CalendarDays className="mx-auto" size={18} style={{ color: cs.accent }} />
                                            <p
                                                className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.3em] ${bodyClass}`}
                                                style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                            >
                                                {language === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}
                                            </p>
                                            <p className={`text-sm ${bodyClass}`} style={{ color: '#FFFFFF' }}>{dateLabel}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <MapPin className="mx-auto" size={18} style={{ color: cs.accent }} />
                                            <p
                                                className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.3em] ${bodyClass}`}
                                                style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                            >
                                                {language === 'kh' ? 'ទីតាំង' : 'Venue'}
                                            </p>
                                            <p className={`text-sm ${bodyClass}`} style={{ color: '#FFFFFF' }}>{location || venueDetails}</p>
                                        </div>
                                    </div>

                                    {!props.previewPage && (
                                        <motion.button
                                            type="button"
                                            onClick={() => switchPhase('details')}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={language === 'kh'
                                                ? `mt-10 rounded-full border px-7 py-3 text-[18px] ${bodyClass}`
                                                : `mt-10 rounded-full border px-7 py-3 text-xs uppercase tracking-[0.32em] ${bodyClass}`}
                                            style={{ borderColor: `${cs.accent}85`, color: cs.accent }}
                                        >
                                            {language === 'kh' ? 'បន្ត' : 'Continue'}
                                        </motion.button>
                                    )}
                                </div>
                            </ArchPanel>
                        </div>
                    </motion.section>
                )}

                {phase === 'details' && (
                    <motion.section
                        key="details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 px-5 pb-32 pt-16"
                    >
                        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
                            <ArchPanel primary={cs.primary} secondary={cs.secondary} className="pb-12 pt-14">
                                <div className="text-center">
                                    <p
                                        className={language === 'kh' ? `${supportingHeadingClass}` : `text-[10px] uppercase tracking-[0.38em] ${bodyClass}`}
                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                    >
                                        {persona.isBirthday ? labels.eventTitle : 'Together With Their Families'}
                                    </p>
                                    <h2 className={`mx-auto mt-6 max-w-[15rem] text-[34px] leading-[1.08] sm:max-w-[17rem] sm:text-[40px] ${displayHeadingClass}`} style={{ color: '#FFFFFF' }}>
                                        {detailHeadline}
                                    </h2>
                                    {logoUrl && (
                                        <div className="mt-7 flex justify-center">
                                            <motion.div
                                                animate={{ rotate: [-1, 1, -1], y: [0, -4, 0] }}
                                                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                                                className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/15 p-2 shadow-[0_18px_40px_rgba(110,76,133,0.24)]"
                                            >
                                                <img src={logoUrl} alt="Celebration portrait" className="h-32 w-32 rounded-[1.4rem] object-cover" />
                                            </motion.div>
                                        </div>
                                    )}
                                    <div className="mt-8 rounded-[1.8rem] border border-white/20 bg-white/10 p-5 text-left backdrop-blur-sm">
                                        <div className="grid gap-5">
                                            <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                                                <CalendarDays size={18} style={{ color: cs.accent }} />
                                                <div>
                                                    <p
                                                        className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.32em] ${bodyClass}`}
                                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                                    >
                                                        {language === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date'}
                                                    </p>
                                                    <p className={`${bodyClass}`} style={{ color: '#FFFFFF', marginTop: '0.35rem', fontSize: language === 'kh' ? '17px' : '15px', lineHeight: 1.6 }}>{dateLabel}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                                                <Clock3 size={18} style={{ color: cs.accent }} />
                                                <div>
                                                    <p
                                                        className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.32em] ${bodyClass}`}
                                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                                    >
                                                        {language === 'kh' ? 'ម៉ោង' : 'Time'}
                                                    </p>
                                                    <p className={`${bodyClass}`} style={{ color: '#FFFFFF', marginTop: '0.35rem', fontSize: language === 'kh' ? '17px' : '15px', lineHeight: 1.6 }}>{timeLabel}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-[20px_1fr] items-start gap-3">
                                                <MapPin size={18} style={{ color: cs.accent }} />
                                                <div>
                                                    <p
                                                        className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.32em] ${bodyClass}`}
                                                        style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                                    >
                                                        {labels.venueTitle}
                                                    </p>
                                                    <p className={`${bodyClass}`} style={{ color: '#FFFFFF', marginTop: '0.35rem', fontSize: language === 'kh' ? '17px' : '15px', lineHeight: 1.7 }}>
                                                        {venueDetails || location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ArchPanel>

                            {familyRows.length > 0 && (
                                <div className="rounded-[2rem] border border-white/18 bg-white/10 p-5 backdrop-blur-md">
                                    <p
                                        className={language === 'kh' ? `${supportingHeadingClass} text-center` : `text-center text-[11px] uppercase tracking-[0.35em] ${bodyClass}`}
                                        style={{ color: cs.accent, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                    >
                                        {labels.familyTitle}
                                    </p>
                                    <div className="mt-4 grid gap-4">
                                        {familyRows.map((row) => (
                                            <div key={row.label} className="rounded-[1.2rem] border border-white/12 bg-white/6 px-4 py-4 text-center">
                                                <p
                                                    className={language === 'kh' ? `${bodyClass}` : `text-[11px] uppercase tracking-[0.28em] ${bodyClass}`}
                                                    style={{ color: cs.textSecondary, fontSize: language === 'kh' ? '14px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                                >
                                                    {row.label}
                                                </p>
                                                <p className={`mt-2 text-sm leading-6 ${bodyClass}`} style={{ color: '#FFFFFF' }}>
                                                    {row.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <motion.div
                                initial={props.previewPage === 'details' ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
                                animate={hasStartedDetailScroll || props.previewPage === 'details' ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-[2rem] border border-white/18 bg-white/10 p-5 backdrop-blur-md"
                            >
                                <p
                                    className={language === 'kh' ? `${supportingHeadingClass} text-center` : `text-center text-[11px] uppercase tracking-[0.35em] ${bodyClass}`}
                                    style={{ color: cs.accent, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                >
                                    {language === 'kh' ? 'សារអញ្ជើញ' : 'Invitation Note'}
                                </p>
                                <p className={`mt-4 text-center text-sm leading-7 ${bodyClass}`} style={{ color: '#FFFFFF' }}>
                                    {detailMessage}
                                </p>
                            </motion.div>

                            {onRsvp && (
                                <div className="rounded-[2rem] border border-white/18 bg-white/10 p-6 text-center backdrop-blur-md">
                                    <Gift className="mx-auto" size={24} style={{ color: cs.accent }} />
                                    <h3 className={`mt-4 text-3xl ${supportingHeadingClass}`} style={{ color: '#FFFFFF' }}>
                                        {rsvpTitle}
                                    </h3>
                                    <p className={`mt-3 text-sm ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                        {rsvpSubtitle}
                                    </p>
                                    <div className="mt-6 grid gap-3">
                                        <button
                                            type="button"
                                            disabled={rsvpSubmitting || rsvpSent}
                                            onClick={() => handleRsvp('ACCEPTED')}
                                            className={language === 'kh'
                                                ? `rounded-full px-6 py-4 text-[17px] ${bodyClass}`
                                                : `rounded-full px-6 py-4 text-sm uppercase tracking-[0.22em] ${bodyClass}`}
                                            style={{
                                                background: `linear-gradient(135deg, ${cs.accent} 0%, ${cs.secondary} 100%)`,
                                                color: '#5A4569',
                                                opacity: rsvpSubmitting || rsvpSent ? 0.8 : 1,
                                            }}
                                        >
                                            {rsvpSent ? rsvpThanksLabel : rsvpAcceptedLabel}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={rsvpSubmitting || rsvpSent}
                                            onClick={() => handleRsvp('DECLINED')}
                                            className={language === 'kh'
                                                ? `rounded-full border px-6 py-4 text-[17px] ${bodyClass}`
                                                : `rounded-full border px-6 py-4 text-sm uppercase tracking-[0.22em] ${bodyClass}`}
                                            style={{ borderColor: `${cs.accent}85`, color: cs.accent, opacity: rsvpSubmitting || rsvpSent ? 0.5 : 1 }}
                                        >
                                            {rsvpDeclinedLabel}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(albumPhotos.length > 0 || albumVideos.length > 0) && (
                                <div className="rounded-[2rem] border border-white/18 bg-white/10 p-5 backdrop-blur-md">
                                    <p
                                        className={language === 'kh' ? `${supportingHeadingClass} text-center` : `text-center text-[11px] uppercase tracking-[0.35em] ${bodyClass}`}
                                        style={{ color: cs.accent, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                    >
                                        {language === 'kh' ? 'វិចិត្រសាល' : 'Gallery & Moments'}
                                    </p>
                                    <p className={`mt-2 text-center text-sm ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                        {language === 'kh' ? 'ទស្សនាទិដ្ឋភាពដ៏ស្រស់ស្អាតនៃព្រឹត្តិការណ៍' : 'A glimpse into the celebration'}
                                    </p>
                                    <div className="mt-5">
                                        <GalleryAlbum
                                            photos={albumPhotos}
                                            videos={albumVideos}
                                            colorScheme={cs}
                                        />
                                    </div>
                                </div>
                            )}

                            {featureLimits?.digitalWishes && id && (
                                <DigitalWishesSection
                                    eventId={id}
                                    enabled={Boolean(featureLimits?.digitalWishes)}
                                    guestCode={code}
                                    guestName={guestName}
                                    colorScheme={cs}
                                    language={language}
                                    cardClassName="border-white/16 bg-[linear-gradient(180deg,rgba(143,122,170,0.72),rgba(103,84,129,0.68))] backdrop-blur-xl"
                                    headingClassName={supportingHeadingClass}
                                    bodyClassName={bodyClass}
                                    backgroundOverride="linear-gradient(180deg, rgba(120, 100, 147, 0.82), rgba(84, 68, 112, 0.8))"
                                    fieldBackgroundOverride="linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))"
                                />
                            )}

                            {paymentQrImageUrl && (
                                <div className="rounded-[2rem] border border-white/18 bg-white/10 p-5 text-center backdrop-blur-md">
                                    <p
                                        className={language === 'kh' ? `${supportingHeadingClass}` : `text-[11px] uppercase tracking-[0.35em] ${bodyClass}`}
                                        style={{ color: cs.accent, fontSize: language === 'kh' ? '16px' : undefined, lineHeight: language === 'kh' ? 1.45 : undefined }}
                                    >
                                        {paymentQrTitle}
                                    </p>
                                    <p className={`mt-2 text-sm ${bodyClass}`} style={{ color: cs.textSecondary }}>
                                        {paymentQrHint}
                                    </p>
                                    <div className="mt-4 flex justify-center">
                                        <div className="rounded-[1.8rem] border border-white/25 bg-white/85 p-3 shadow-xl">
                                            <img src={paymentQrImageUrl} alt="Payment QR" className="h-56 w-56 rounded-[1.2rem] object-contain" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <InvitationCountdownSection eventDate={eventDate} featureLimits={featureLimits} colorScheme={cs} />
                            <AppFooter />
                        </div>

                        <ScrollUpGuide
                            show={showScrollGuide}
                            label={scrollGuideLabel}
                            color={cs.accent}
                            textColor="#FFF8FF"
                        />
                    </motion.section>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSwitching && (
                    <motion.div
                        key="botanical-page-transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: pageSwitchMs / 1000 }}
                        className="pointer-events-none fixed inset-0 z-[120]"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1.12 }}
                            exit={{ opacity: 0, scale: 1.18 }}
                            transition={{ duration: pageSwitchMs / 1000, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle at center, ${cs.accent}88 0%, ${cs.secondary}66 22%, ${cs.primary}4f 44%, rgba(255,255,255,0.08) 64%, rgba(255,255,255,0) 100%)`,
                                filter: 'blur(10px)',
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 34 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -26 }}
                            transition={{ duration: pageSwitchMs / 1000, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(180deg, ${cs.secondary}3d 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.02) 76%, ${cs.primary}3d 100%)`,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0.82 }}
                            animate={{ opacity: 1, scaleX: 1.18 }}
                            exit={{ opacity: 0, scaleX: 1.28 }}
                            transition={{ duration: pageSwitchMs / 1000, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-x-0 top-1/2 h-[42vh] -translate-y-1/2"
                            style={{
                                background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${cs.accent}55 18%, ${cs.accent}88 50%, ${cs.secondary}55 82%, rgba(255,255,255,0) 100%)`,
                                filter: 'blur(26px)',
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: pageSwitchMs / 1000, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(135deg, ${cs.primary}26 0%, transparent 24%, ${cs.secondary}20 52%, transparent 72%, ${cs.accent}24 100%)`,
                                backdropFilter: 'blur(9px) saturate(1.15)',
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1.04 }}
                            exit={{ opacity: 0, scale: 1.08 }}
                            transition={{ duration: pageSwitchMs / 1000, ease: 'easeInOut' }}
                            className="absolute inset-0"
                            style={{
                                boxShadow: `inset 0 0 120px ${cs.primary}35, inset 0 0 180px ${cs.accent}28`,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
