'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Calendar, MapPin } from 'lucide-react';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';
import { getTemplateFontFamilies, templateFontVariables } from '@/lib/template-fonts';

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
    albumVideos?: string[];
    templateConfig?: any;
    backgroundImageUrl?: string | null;
    backgroundVideoUrl?: string | null;
    introVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: any;
}

function FrameOverlay({ url }: { url?: string | null }) {
    if (!url) return null;
    const isVideo = /\.(mp4|mov|webm|ogg)$/i.test(url);
    return (
        <div className="absolute inset-0 pointer-events-none z-20">
            {isVideo ? (
                <video src={url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
                <img src={url} alt="Frame" className="w-full h-full object-cover" />
            )}
        </div>
    );
}

export default function BlushOrnateLayout(props: Props) {
    const {
        eventDate,
        location,
        musicUrl,
        logoUrl,
        invitationMessage,
        venueDetails,
        mapUrl,
        albumPhotos = [],
        albumVideos = [],
        paymentQrImageUrl,
        templateConfig,
        backgroundImageUrl,
        backgroundVideoUrl,
        introVideoUrl,
        transitionVideoUrl,
        introFrameUrl,
        transitionFrameUrl,
        detailFrameUrl,
        guestName,
        eventTitle,
    } = props;

    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);
    const cs = templateConfig?.colorScheme || {
        primary: '#F47FB3',
        secondary: '#C57B97',
        accent: '#F6B4C9',
        background: '#8E6A71',
        text: '#FFE7F1',
        textSecondary: 'rgba(255,231,241,0.8)',
        border: 'rgba(244,127,179,0.35)',
        gradient: 'linear-gradient(135deg, #ff9ccc 0%, #f47fb3 45%, #ffd2e4 100%)'
    };
    const typography = templateConfig?.typography || {};
    const templateFonts = getTemplateFontFamilies(templateConfig);
    const headingFont = language === 'kh' ? templateFonts.khmerHeading : templateFonts.heading;
    const bodyFont = language === 'kh' ? templateFonts.khmerBody : templateFonts.body;
    const buttonFont = language === 'kh' ? templateFonts.khmerButton : templateFonts.button;
    const resolveTypographyStyle = (style?: 'normal' | 'bold' | 'italic') => ({
        fontStyle: style === 'italic' ? 'italic' as const : 'normal' as const,
        fontWeight: style === 'bold' ? 700 : 400,
    });
    const headingTypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerH1Style : typography.englishH1Style);
    const bodyTypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerBodyStyle : typography.englishBodyStyle);
    const buttonTypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerButtonStyle : typography.englishButtonStyle);
    const buttonFontWeight = buttonTypographyStyle.fontWeight || (language === 'kh' ? 600 : 700);
    const headingFontSize = typeof (language === 'kh' ? typography.khmerH1SizePx : typography.englishH1SizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerH1SizePx : typography.englishH1SizePx}px`
        : undefined;
    const bodyFontSize = typeof (language === 'kh' ? typography.khmerBodySizePx : typography.englishBodySizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerBodySizePx : typography.englishBodySizePx}px`
        : undefined;
    const buttonFontSize = typeof (language === 'kh' ? typography.khmerButtonSizePx : typography.englishButtonSizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerButtonSizePx : typography.englishButtonSizePx}px`
        : undefined;

    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const showIntroGuestName = templateConfig?.showIntroGuestName !== false;
    const showTransitionOverlay = templateConfig?.showTransitionOverlay !== false;
    const showTransitionSaveTheDate = templateConfig?.showTransitionSaveTheDate !== false;
    const showTransitionEventTitle = templateConfig?.showTransitionEventTitle !== false;
    const showTransitionNames = templateConfig?.showTransitionNames !== false;
    const showTransitionDate = templateConfig?.showTransitionDate !== false;
    const showTransitionLocation = templateConfig?.showTransitionLocation !== false;
    const transitionDurationMs = Math.max(1000, Math.min(15000, Number(templateConfig?.transitionDurationSeconds || 3.8) * 1000));

    const activeIntroMedia = introVideoUrl || backgroundImageUrl || backgroundVideoUrl;
    const activeTransitionMedia = transitionVideoUrl || backgroundVideoUrl || backgroundImageUrl;
    const locale = language === 'kh' ? 'km-KH' : 'en-US';
    const ornateHeadingClass = language === 'kh' ? '' : moul.className;
    const compactLabelClass = language === 'kh' ? '' : 'uppercase tracking-[0.4em]';
    const saveDateClass = language === 'kh' ? 'text-sm' : 'text-sm uppercase tracking-[0.45em]';
    const locationClass = language === 'kh' ? 'text-sm md:text-base' : 'text-sm md:text-base uppercase tracking-[0.3em]';
    const continueButtonClass = language === 'kh' ? 'px-6 py-2 rounded-full text-sm font-bold shadow-lg' : 'px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-lg';
    const dateLine = eventDate
        ? new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate))
        : '';
    const timeLine = eventDate
        ? new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(eventDate))
        : '';
    const guestHeading = language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Special Guest';
    const guestFallback = language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Distinguished Guest';
    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const saveTheDateLabel = language === 'kh' ? 'កត់ថ្ងៃទុកជាមុន' : 'Save the Date';
    const continueLabel = language === 'kh' ? 'បន្ត' : 'Continue';
    const addToCalendarLabel = language === 'kh' ? 'ដាក់ក្នុងប្រតិទិន' : 'Add to Calendar';
    const openMapLabel = language === 'kh' ? 'បើកផែនទី' : 'Open Map';
    const venueLabel = language === 'kh' ? 'ទីតាំង' : 'Venue';
    const paymentQrTitle = language === 'kh' ? 'ស្កេន QR សម្រាប់ការទូទាត់' : 'Scan QR For Payment';
    const paymentQrHint = language === 'kh' ? 'ភ្ញៀវអាចស្កេន QR នេះដើម្បីផ្ញើអំណោយ ឬទូទាត់បាន។' : 'Guests can scan this QR code to send a gift or payment.';

    const googleCalendarUrl = useMemo(() => {
        if (!eventDate) return '#';
        try {
            const startDate = new Date(eventDate);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
            const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(persona.primaryFullName || eventTitle || '')}&dates=${start}/${end}&location=${encodeURIComponent(location || '')}`;
        } catch {
            return '#';
        }
    }, [eventDate, location, persona.primaryFullName, eventTitle]);

    const isVideoUrl = (url?: string | null) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    useEffect(() => {
        if (!musicUrl) return;
        if (phase === 'intro') return;
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
    }, [musicUrl, phase]);

    useEffect(() => {
        if (props.previewPage) setPhase(props.previewPage);
    }, [props.previewPage]);

    const toggleMusic = async () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        }
    };

    const handleOpen = async () => {
        setPhase('transition');
        if (musicUrl && audioRef.current && !isPlaying) {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch { }
        }
        if (!activeTransitionMedia || !isVideoUrl(activeTransitionMedia)) {
            window.setTimeout(() => setPhase('details'), transitionDurationMs);
        }
    };

    const introTitle = eventTitle || persona.primaryFullName;
    const celebrationLabel = labels.eventTitle;
    const cardClass = 'rounded-[24px] border backdrop-blur-sm shadow-[0_18px_45px_rgba(73,39,56,0.16)]';

    const renderBackground = (media?: string | null, fallbackOpacity = 0.85, options?: { loop?: boolean; onEnded?: () => void }) => (
        <>
            {media ? (
                isVideoUrl(media) ? (
                    <video
                        src={media}
                        autoPlay
                        loop={options?.loop ?? true}
                        muted
                        playsInline
                        onEnded={options?.onEnded}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img src={media} alt="background" className="w-full h-full object-cover" />
                )
            ) : (
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12), transparent 35%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg fill='none' stroke='%23c8919f' stroke-opacity='0.18' stroke-width='2'%3E%3Cpath d='M120 18c24 0 42 19 42 42 0 12-5 24-14 31 18 4 32 20 32 39 0 23-18 42-41 42-7 0-14-2-20-5 3 6 5 13 5 20 0 24-19 43-43 43s-43-19-43-43c0-7 2-14 5-20-6 3-13 5-20 5-23 0-41-19-41-42 0-19 14-35 32-39-9-7-14-19-14-31 0-23 18-42 42-42 16 0 30 9 37 22 7-13 21-22 41-22Z'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: 'cover, 260px 260px',
                        backgroundPosition: 'center',
                        backgroundColor: cs.background,
                    }}
                />
            )}
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(142,106,113,${fallbackOpacity})` }} />
        </>
    );

    return (
        <main className={`relative min-h-screen overflow-x-hidden ${templateFontVariables}`} style={{ backgroundColor: cs.background, color: cs.text, fontFamily: templateFonts.body }}>
            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
                        <div className="absolute inset-0">{renderBackground(activeIntroMedia, 0.76)}</div>
                        <FrameOverlay url={introFrameUrl} />
                        <div className="relative z-30 min-h-screen flex items-center justify-center px-6 py-12">
                            <div className="w-full max-w-md text-center space-y-7">
                                <p className={`${ornateHeadingClass} text-xl md:text-2xl`} style={{ color: cs.primary }}>
                                    <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{celebrationLabel}</span>
                                </p>

                                <div className="inline-flex max-w-[320px] items-center justify-center px-6 py-3 border-2 rounded-2xl bg-[#6f5258]/65" style={{ borderColor: `${cs.primary}99` }}>
                                    <h1 className={`${ornateHeadingClass} text-xl md:text-2xl`} style={{ color: cs.text }}>
                                        <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{introTitle}</span>
                                    </h1>
                                </div>

                                {showIntroGuestName && (
                                    <div className={`${cardClass} px-6 py-6`} style={{ backgroundColor: 'rgba(92,62,68,0.66)', borderColor: cs.border }}>
                                        <p className={`mb-3 text-xs ${compactLabelClass}`} style={{ color: cs.primary, fontFamily: bodyFont, fontSize: bodyFontSize, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{guestHeading}</p>
                                        <p className="text-3xl leading-tight" style={{ color: cs.text }}>
                                            <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{guestName || guestFallback}</span>
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleOpen}
                                    className="px-10 py-3 rounded-full text-sm font-bold tracking-[0.25em] uppercase shadow-lg"
                                    style={{ background: cs.gradient, color: templateConfig?.openButtonTextColor || '#5F3947' }}
                                >
                                    <span style={{ fontFamily: buttonFont, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}>{openInvitationLabel}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {phase === 'transition' && (
                    <motion.div key="transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black">
                        <div className="absolute inset-0">
                            {renderBackground(activeTransitionMedia, showTransitionOverlay ? 0.55 : 0.18, {
                                loop: false,
                                onEnded: () => setPhase('details'),
                            })}
                        </div>
                        <FrameOverlay url={transitionFrameUrl} />
                        <div className="absolute right-5 top-20 z-40">
                            <button
                                onClick={() => setPhase('details')}
                                className="rounded-full px-5 py-2 text-xs font-medium uppercase tracking-[0.28em] backdrop-blur-md"
                                style={{ border: `1px solid ${cs.border}`, backgroundColor: `${cs.background}b8`, color: cs.text }}
                            >
                                {language === 'kh' ? 'រំលង' : 'Skip'}
                            </button>
                        </div>
                        {showTransitionOverlay && (
                            <div className="relative z-30 min-h-screen flex items-center justify-center px-6">
                                <div className="text-center max-w-xl space-y-6">
                                    {showTransitionSaveTheDate && (
                                        <p className={saveDateClass} style={{ color: cs.primary, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase' }}>
                                            <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{saveTheDateLabel}</span>
                                        </p>
                                    )}
                                    {showTransitionEventTitle && (
                                        <p className={`${ornateHeadingClass} text-xl md:text-2xl`} style={{ color: cs.text }}>
                                            <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{eventTitle || labels.eventTitle}</span>
                                        </p>
                                    )}
                                    {showTransitionNames && (
                                        <h2 className={`${ornateHeadingClass} text-3xl md:text-5xl leading-tight`} style={{ color: cs.accent }}>
                                            <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{persona.primaryFullName}</span>
                                        </h2>
                                    )}
                                    {showTransitionDate && (
                                        <p className="text-lg md:text-2xl" style={{ color: cs.text }}>
                                            <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{dateLine}</span>
                                        </p>
                                    )}
                                    {showTransitionLocation && location && (
                                        <p className={locationClass} style={{ color: cs.textSecondary, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase' }}>
                                            <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{location}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {!isVideoUrl(activeTransitionMedia) && (
                            <div className="absolute inset-x-0 bottom-10 z-30 flex justify-center">
                                <button
                                    onClick={() => setPhase('details')}
                                    className={continueButtonClass}
                                    style={{ backgroundColor: 'rgba(92,62,68,0.7)', border: `1px solid ${cs.border}`, color: cs.text }}
                                >
                                    <span style={{ fontFamily: buttonFont, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}>{continueLabel}</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {phase === 'details' && (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen">
                        <div className="fixed inset-0 z-0">{renderBackground(backgroundImageUrl || backgroundVideoUrl, 0.82)}</div>
                        <FrameOverlay url={detailFrameUrl} />

                        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-20 space-y-7">
                            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                                <div className="inline-flex max-w-[320px] items-center justify-center px-6 py-3 border-2 rounded-2xl bg-[#6f5258]/65" style={{ borderColor: `${cs.primary}99` }}>
                                    <h1 className={`${ornateHeadingClass} text-xl md:text-2xl`} style={{ color: cs.text }}>
                                        <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{introTitle}</span>
                                    </h1>
                                </div>

                                <p className={`${ornateHeadingClass} text-xl md:text-2xl`} style={{ color: cs.primary }}>
                                    <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{celebrationLabel}</span>
                                </p>

                                {logoUrl && (
                                    <div className="flex items-center justify-center">
                                        <img src={logoUrl} alt="Logo" className="h-20 w-20 object-contain" />
                                    </div>
                                )}
                            </motion.div>

                            {invitationMessage && (
                                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} p-7 text-center`} style={{ backgroundColor: 'rgba(92,62,68,0.66)', borderColor: cs.border }}>
                                    <p className="whitespace-pre-wrap leading-8 text-[17px] md:text-lg" style={{ color: cs.text }}>
                                        {invitationMessage}
                                    </p>
                                </motion.section>
                            )}

                            <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3 py-1">
                                <p className={`${ornateHeadingClass} text-lg md:text-xl`} style={{ color: `${cs.primary}dd` }}>
                                        <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize }}>{persona.primaryRole}</span>
                                </p>
                                {persona.primaryFirstName && (
                                    <p className={`${ornateHeadingClass} text-2xl md:text-3xl`} style={{ color: cs.text }}>
                                            <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{persona.primaryFirstName}</span>
                                    </p>
                                )}
                                {persona.primaryLastName && (
                                    <p className={`${ornateHeadingClass} text-4xl md:text-5xl`} style={{ color: cs.accent }}>
                                            <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{persona.primaryLastName}</span>
                                    </p>
                                )}
                            </motion.section>

                            <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} text-center px-6 py-6`} style={{ backgroundColor: 'rgba(92,62,68,0.34)', borderColor: `${cs.primary}3d` }}>
                                <div className="border-y py-5" style={{ borderColor: `${cs.primary}40` }}>
                                    <p className="text-base md:text-lg mb-3" style={{ color: cs.textSecondary }}>
                                        <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{dateLine}{timeLine ? ` • ${timeLine}` : ''}</span>
                                    </p>
                                    <p className={`${ornateHeadingClass} text-2xl md:text-3xl`} style={{ color: cs.accent }}>
                                        <span style={{ fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(eventDate || Date.now()))}</span>
                                    </p>
                                </div>
                                <a href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm" style={{ color: cs.primary }}>
                                    <Calendar size={15} />
                                    <span style={{ fontFamily: buttonFont, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}>{addToCalendarLabel}</span>
                                </a>
                            </motion.section>

                            {(venueDetails || location) && (
                                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} p-7 text-center`} style={{ backgroundColor: 'rgba(92,62,68,0.62)', borderColor: cs.border }}>
                                    <p className={`${ornateHeadingClass} text-2xl mb-4`} style={{ color: cs.text, fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>{venueLabel}</p>
                                    <p className="text-xl md:text-2xl font-semibold" style={{ color: cs.accent }}>
                                        <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{venueDetails || location}</span>
                                    </p>
                                    {mapUrl && (
                                        <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm" style={{ color: cs.primary }}>
                                            <MapPin size={15} />
                                            <span style={{ fontFamily: buttonFont, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}>{openMapLabel}</span>
                                        </a>
                                    )}
                                </motion.section>
                            )}

                            <div className="pt-2">
                                <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={cs} />
                            </div>
                            {paymentQrImageUrl && (
                                <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={`${cardClass} mt-6 p-7 text-center`} style={{ backgroundColor: 'rgba(92,62,68,0.62)', borderColor: cs.border }}>
                                    <p className={`${ornateHeadingClass} text-2xl`} style={{ color: cs.text, fontFamily: headingFont, fontSize: headingFontSize, fontStyle: headingTypographyStyle.fontStyle, fontWeight: headingTypographyStyle.fontWeight }}>
                                        {paymentQrTitle}
                                    </p>
                                    <p className="mt-3 text-base leading-7" style={{ color: cs.textSecondary }}>
                                        <span style={{ fontFamily: bodyFont, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{paymentQrHint}</span>
                                    </p>
                                    <div className="mx-auto mt-5 max-w-[260px] overflow-hidden rounded-[24px] border border-white/30 bg-white p-3 shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
                                        <img src={paymentQrImageUrl} alt="Payment QR" className="h-auto w-full rounded-[18px] object-contain" />
                                    </div>
                                </motion.section>
                            )}
                            <DigitalWishesSection
                                eventId={props.id}
                                enabled={Boolean(props.featureLimits?.digitalWishes)}
                                guestName={guestName}
                                guestCode={props.code || props.shortCode}
                                language={language as 'kh' | 'en'}
                                colorScheme={cs}
                                className="mt-6"
                                cardClassName={`${cardClass} p-7 text-center`}
                                headingClassName={ornateHeadingClass}
                            />
                            <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                            <AppFooter colorScheme={cs} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {musicUrl && phase !== 'intro' && (
                <button
                    onClick={toggleMusic}
                    className="fixed bottom-6 right-6 z-50 p-3 rounded-full border backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(92,62,68,0.75)', borderColor: cs.border, color: cs.text }}
                >
                    {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            )}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop />}
        </main>
    );
}
