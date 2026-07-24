'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import React from 'react';
import { Volume2, VolumeX, MapPin, Calendar, Heart, X, ChevronLeft, ChevronRight, Play, Pause, Hand } from 'lucide-react';
import localFont from 'next/font/local';
import { motion, AnimatePresence } from 'framer-motion';
import { Great_Vibes, Playfair_Display, Lato } from 'next/font/google';
import Image from 'next/image';
import { toKhmerDateTime, getCoupleTitles, getKhmerDateTimeParts, parseAndFormatKhmerTime, toKhmerNumber, parseTimeObject, toKhmerDate } from '@/lib/khmer-utils';
import { getEventDetailTitle, type EventType } from '@/lib/event-types';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import InvitationCountdownSection from './InvitationCountdownSection';
import GoldParticles from './GoldParticles';
import AppFooter from './AppFooter';
import FancyFrame from './FancyFrame';
import DigitalWishesSection from './components/DigitalWishesSection';
import { DotLottiePlayer } from '@dotlottie/react-player';
import { colorSchemes } from '../Templates/styles/colorSchemes';
import ModernMinimalLayout from './layouts/ModernMinimalLayout';
import TraditionalHeritageLayout from './layouts/TraditionalHeritageLayout';
import RomanticDreamsLayout from './layouts/RomanticDreamsLayout';
import MovieCeremonyLayout from './layouts/MovieCeremonyLayout';
import ClassGoldLayout from './layouts/ClassGoldLayout';
import GoldenGrandeurLayout from './layouts/GoldenGrandeurLayout';
import BlushOrnateLayout from './layouts/BlushOrnateLayout';
import BirthdayBalloonLayout from './layouts/BirthdayBalloonLayout';
import BotanicalArchLayout from './layouts/BotanicalArchLayout';
import BlueArchLayout from './layouts/BlueArchLayout';
import GalleryAlbum from './components/GalleryAlbum';
import InvitationLanguageToggle from './InvitationLanguageToggle';
import EventExpiredScreen from './EventExpiredScreen';
import { useLanguage } from '@/context/LanguageContext';
import { getTemplateFontFamilies, templateFontVariables } from '@/lib/template-fonts';
import type { StorySlide } from '../Templates/types';

const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const lato = Lato({ weight: ['300', '400'], subsets: ['latin'] });

const koulen = localFont({
    src: '../../../public/assets/fonts/Koulen-Regular.ttf',
    variable: '--font-koulen',
});

const moul = localFont({
    src: '../../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-moul',
});

const kantumruy = localFont({
    src: '../../../public/assets/fonts/KantumruyPro-Regular.ttf',
    variable: '--font-kantumruy',
});

// Simple Gallery Item Component - CSS Animations & Scroll Fade-In
const GalleryItem = React.memo(({ photo, index, openGallery, ratio, activeColorScheme }: any) => {
    const isLandscape = ratio === 'landscape';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            style={{ willChange: 'transform, opacity', backfaceVisibility: 'hidden' }} // Optimize for mobile
            className={`relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl ${isLandscape ? 'col-span-2 aspect-[16/10]' : 'col-span-1 aspect-[3/4.2]'
                } border border-[${activeColorScheme?.primary || '#EEC573'}]/20 bg-black/20`}
            onClick={() => openGallery(index)}
        >
            <Image
                src={photo.imageUrl}
                alt="Wedding Photo"
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Simple Gradient Overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-500" />
        </motion.div>
    );
});
GalleryItem.displayName = 'GalleryItem';

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

interface InvitationViewProps {
    id?: string;
    eventId?: string;
    event_id?: string;
    eventID?: string;
    invitationId?: string;
    invitation_id?: string;
    code?: string;
    shortCode?: string;
    guestName: string;
    eventTitle: string;
    eventDate: Date;
    location: string;
    eventType?: string | null;
    birthDate?: Date | string | null;
    enableSecondaryLanguage?: boolean | number | string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    secondLogoUrl?: string | null;
    logoSize?: number | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
    groomFatherNameEn?: string | null;
    groomMotherNameEn?: string | null;
    brideFatherNameEn?: string | null;
    brideMotherNameEn?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    groomFirstNameEn?: string | null;
    groomLastNameEn?: string | null;
    brideFirstNameEn?: string | null;
    brideLastNameEn?: string | null;
    invitationMessage?: string | null;
    invitationMessageEn?: string | null;
    eventTime?: string | null;
    venueDetails?: string | null;
    venueDetailsEn?: string | null;
    eventTitleEn?: string | null;
    titleEn?: string | null;
    locationEn?: string | null;
    mapUrl?: string | null;
    schedule?: string | null;
    albumPhotos?: any[];
    storySlides?: StorySlide[];
    introVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    effectLayerUrl?: string | null;
    effectLayerOpacity?: number;
    effectLayerBlendMode?: string;
    guestPhotoUrl?: string | null;
    guestAvatarUrl?: string | null;
    guestStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    templateId?: string; // e.g. 'frame-floral', 'premium-gold'
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    scheduleItems?: any[];
    templateConfig?: any;
    featureLimits?: {
        digitalWishes?: boolean;
        addToCalendar?: boolean;
        [key: string]: any;
    };
    buttonImageUrl?: string | null;
    guestFrameUrl?: string | null;
    albumVideos?: string[];
    previewPage?: 'intro' | 'transition' | 'details';
    showLanguageToggle?: boolean;
}
// --- PredefinedButton Component ---
export const PredefinedButton = ({ type, colorScheme, text, openButtonTextColor, fontFamily }: { type: number, colorScheme: any, text: string, openButtonTextColor?: string, fontFamily?: string }) => {
    const primary = colorScheme.primary || '#D4AF37';
    const secondary = colorScheme.secondary || '#FFDF73';
    const bg = colorScheme.background || '#FFF9E6';
    const baseTextCol = colorScheme.text || '#4A3511';
    const textCol = openButtonTextColor || baseTextCol;

    // Base wrapper with responsive height
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <div className="relative inline-block mt-2 w-auto h-20 md:h-24 drop-shadow-xl" style={{ aspectRatio: '3/1' }}>
            {children}
            {text && (
                 <span className="absolute inset-0 flex items-center justify-center text-base md:text-xl pb-1 pointer-events-none"
                 style={{
                     color: textCol,
                     fontFamily: fontFamily || 'Moul, serif',
                     fontWeight: 700,
                     letterSpacing: '0.03em',
                     textShadow: '0 1px 2px rgba(255,255,255,0.4)'
                 }}
                >
                    {text}
                </span>
            )}
        </div>
    );

    // Depending on type, render an inline SVG that uses the passed colors
    switch (type) {
        case 1:
            return (
                <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <rect x="5" y="5" width="230" height="70" rx="35" fill={`url(#grad1-${type})`} fillOpacity="0.15" stroke={`url(#grad2-${type})`} strokeWidth="2"/>
                        <rect x="12" y="12" width="216" height="56" rx="28" fill="none" stroke={`url(#grad3-${type})`} strokeWidth="1" strokeDasharray="4 2"/>
                        <path d="M25 40 L35 30 L35 50 Z" fill={`url(#grad2-${type})`}/>
                        <path d="M215 40 L205 30 L205 50 Z" fill={`url(#grad2-${type})`}/>
                        <defs>
                            <linearGradient id={`grad1-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={secondary}/>
                                <stop offset="1" stopColor={primary}/>
                            </linearGradient>
                            <linearGradient id={`grad2-${type}`} x1="0" y1="40" x2="240" y2="40">
                                <stop stopColor={primary}/><stop offset="0.5" stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                            <linearGradient id={`grad3-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        case 2:
            return (
                <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M20 10 H220 L230 40 L220 70 H20 L10 40 Z" fill={bg} fillOpacity="0.9" stroke={`url(#grad2-${type})`} strokeWidth="3"/>
                        <path d="M25 15 H215 L223 40 L215 65 H25 L17 40 Z" fill="none" stroke={`url(#grad3-${type})`} strokeWidth="1"/>
                        <defs>
                            <linearGradient id={`grad2-${type}`} x1="0" y1="40" x2="240" y2="40">
                                <stop stopColor={primary}/><stop offset="0.5" stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                            <linearGradient id={`grad3-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={primary}/><stop offset="1" stopColor={primary} stopOpacity="0.6"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        case 3:
            return (
                <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <rect x="2" y="10" width="236" height="60" rx="4" fill="none" stroke={`url(#grad1-${type})`} strokeWidth="2"/>
                        <rect x="6" y="14" width="228" height="52" rx="2" fill="none" stroke={`url(#grad2-${type})`} strokeWidth="1"/>
                        <circle cx="20" cy="40" r="4" fill={`url(#grad1-${type})`}/>
                        <circle cx="220" cy="40" r="4" fill={`url(#grad1-${type})`}/>
                        <line x1="30" y1="40" x2="45" y2="40" stroke={`url(#grad1-${type})`} strokeWidth="1"/>
                        <line x1="195" y1="40" x2="210" y2="40" stroke={`url(#grad1-${type})`} strokeWidth="1"/>
                         <defs>
                            <linearGradient id={`grad1-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                            <linearGradient id={`grad2-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={primary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        case 4:
            return (
                 <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <rect x="2" y="2" width="236" height="76" rx="38" fill={baseTextCol} stroke={`url(#grad1-${type})`} strokeWidth="4"/>
                        <path d="M30 40 L45 35 L45 45 Z" fill={`url(#grad1-${type})`}/>
                        <path d="M210 40 L195 35 L195 45 Z" fill={`url(#grad1-${type})`}/>
                        <defs>
                            <linearGradient id={`grad1-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={primary}/><stop offset="0.5" stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        case 5:
             return (
                 <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M10 40 C 10 20, 30 10, 50 10 L 190 10 C 210 10, 230 20, 230 40 C 230 60, 210 70, 190 70 L 50 70 C 30 70, 10 60, 10 40 Z" fill={bg} stroke={`url(#grad2-${type})`} strokeWidth="2"/>
                        <path d="M15 40 C 15 25, 35 15, 50 15 L 190 15 C 205 15, 225 25, 225 40 C 225 55, 205 65, 190 65 L 50 65 C 35 65, 15 55, 15 40 Z" fill="none" stroke={`url(#grad1-${type})`} strokeWidth="1"/>
                        <circle cx="30" cy="40" r="3" fill={`url(#grad2-${type})`}/>
                        <circle cx="210" cy="40" r="3" fill={`url(#grad2-${type})`}/>
                        <defs>
                            <linearGradient id={`grad1-${type}`} x1="0" y1="10" x2="240" y2="70">
                                <stop stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                            <linearGradient id={`grad2-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={primary}/><stop offset="0.5" stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        case 6:
            return (
                 <Wrapper>
                    <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path d="M20 5 L220 5 L235 40 L220 75 L20 75 L5 40 Z" fill={baseTextCol} fillOpacity="0.95" stroke={`url(#grad1-${type})`} strokeWidth="4"/>
                        <path d="M23 10 L217 10 L229 40 L217 70 L23 70 L11 40 Z" fill="none" stroke={`url(#grad2-${type})`} strokeWidth="1" strokeDasharray="3 3"/>
                         <defs>
                            <linearGradient id={`grad1-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={secondary}/><stop offset="0.5" stopColor={primary}/><stop offset="1" stopColor={secondary}/>
                            </linearGradient>
                            <linearGradient id={`grad2-${type}`} x1="0" y1="0" x2="240" y2="80">
                                <stop stopColor={secondary}/><stop offset="1" stopColor={primary}/>
                            </linearGradient>
                        </defs>
                    </svg>
                </Wrapper>
            );
        default:
            return null;
    }
};

export default function InvitationView(props: InvitationViewProps) {
    const {
        guestName,
        eventTitle,
        eventDate,
        location,
        eventType,
        enableSecondaryLanguage,
        musicUrl,
        logoUrl,
        secondLogoUrl,
        logoSize = 150,
        backgroundVideoUrl,
        backgroundImageUrl,
        groomFatherName,
        groomMotherName,
        brideFatherName,
        brideMotherName,
        groomFatherNameEn,
        groomMotherNameEn,
        brideFatherNameEn,
        brideMotherNameEn,
        groomFirstName,
        groomLastName,
        brideFirstName,
        brideLastName,
        groomFirstNameEn,
        groomLastNameEn,
        brideFirstNameEn,
        brideLastNameEn,
        invitationMessage,
        invitationMessageEn,
        eventTime,
        venueDetails,
        venueDetailsEn,
        mapUrl,
        schedule,
        albumPhotos = [],
        introFrameUrl,
        transitionFrameUrl,
        detailFrameUrl,
        templateConfig: rawTemplateConfig,
        albumVideos = [],
        previewPage,
        showLanguageToggle = true,
    } = props;

    // Check if Event is Inactive / Expired
    if ((props as any).is_active === 0 || (props as any).is_active === false) {
        return <EventExpiredScreen title={props.eventTitle || undefined} contactPhone={(props as any).contactPhone || undefined} />;
    }

    // Parse templateConfig if it's a string (e.g. from a PHP/MySQL backend)
    const templateConfig = useMemo(() => {
        if (!rawTemplateConfig) return null;
        if (typeof rawTemplateConfig === 'string') {
            try {
                return JSON.parse(rawTemplateConfig);
            } catch (e) {
                console.error("Failed to parse templateConfig", e);
                return null;
            }
        }
        return rawTemplateConfig;
    }, [rawTemplateConfig]);

    const normalizedStorySlides = useMemo(() => {
        const source = Array.isArray(props.storySlides)
            ? props.storySlides
            : (Array.isArray(templateConfig?.storySlides) ? templateConfig.storySlides : []);

        return source
            .map((slide: any, index: number) => ({
                id: String(slide?.id || `story-slide-${index}`),
                imageUrl: typeof slide?.imageUrl === 'string' ? slide.imageUrl : '',
                title: typeof slide?.title === 'string' ? slide.title : '',
                caption: typeof slide?.caption === 'string' ? slide.caption : '',
                order: typeof slide?.order === 'number' ? slide.order : index,
            }))
            .filter((slide: StorySlide) => slide.imageUrl);
    }, [props.storySlides, templateConfig]);

    const { language, setLanguage } = useLanguage();
    const secondaryLanguageEnabled = enableSecondaryLanguage === true || enableSecondaryLanguage === 1 || enableSecondaryLanguage === '1';
    const hasSecondaryLanguageContent = Boolean(
        secondaryLanguageEnabled ||
        props.titleEn ||
        props.locationEn ||
        groomFatherNameEn ||
        groomMotherNameEn ||
        brideFatherNameEn ||
        brideMotherNameEn ||
        groomFirstNameEn ||
        groomLastNameEn ||
        brideFirstNameEn ||
        brideLastNameEn ||
        invitationMessageEn ||
        venueDetailsEn
    );

    useEffect(() => {
        if (!hasSecondaryLanguageContent && language !== 'kh') {
            setLanguage('kh');
        }
    }, [hasSecondaryLanguageContent, language, setLanguage]);

    const localizedContent = useMemo(() => {
        const useEnglish = hasSecondaryLanguageContent && language === 'en';
        const pickValue = (primary?: string | null, secondary?: string | null) => {
            if (useEnglish && secondary && secondary.trim() !== '') {
                return secondary;
            }
            return primary;
        };

        return {
            eventTitle: pickValue(eventTitle, props.eventTitleEn || props.titleEn) || eventTitle,
            location: pickValue(location, props.locationEn) || location,
            groomFatherName: pickValue(groomFatherName, groomFatherNameEn) || groomFatherName,
            groomMotherName: pickValue(groomMotherName, groomMotherNameEn) || groomMotherName,
            brideFatherName: pickValue(brideFatherName, brideFatherNameEn) || brideFatherName,
            brideMotherName: pickValue(brideMotherName, brideMotherNameEn) || brideMotherName,
            groomFirstName: pickValue(groomFirstName, groomFirstNameEn) || groomFirstName,
            groomLastName: pickValue(groomLastName, groomLastNameEn) || groomLastName,
            brideFirstName: pickValue(brideFirstName, brideFirstNameEn) || brideFirstName,
            brideLastName: pickValue(brideLastName, brideLastNameEn) || brideLastName,
            invitationMessage: pickValue(invitationMessage, invitationMessageEn) || invitationMessage,
            venueDetails: pickValue(venueDetails, venueDetailsEn) || venueDetails,
        };
    }, [
        hasSecondaryLanguageContent,
        language,
        eventTitle,
        location,
        groomFatherName,
        groomMotherName,
        brideFatherName,
        brideMotherName,
        groomFirstName,
        groomLastName,
        brideFirstName,
        brideLastName,
        invitationMessage,
        venueDetails,
        groomFatherNameEn,
        groomMotherNameEn,
        brideFatherNameEn,
        brideMotherNameEn,
        groomFirstNameEn,
        groomLastNameEn,
        brideFirstNameEn,
        brideLastNameEn,
        invitationMessageEn,
        venueDetailsEn,
        props.eventTitleEn,
        props.titleEn,
        props.locationEn,
    ]);

    const persona = useMemo(() => getInvitationPersona({
        eventType,
        eventTitle: localizedContent.eventTitle,
        groomFirstName: localizedContent.groomFirstName,
        groomLastName: localizedContent.groomLastName,
        brideFirstName: localizedContent.brideFirstName,
        brideLastName: localizedContent.brideLastName,
        groomFatherName: localizedContent.groomFatherName,
        groomMotherName: localizedContent.groomMotherName,
        brideFatherName: localizedContent.brideFatherName,
        brideMotherName: localizedContent.brideMotherName,
    }), [
        eventType,
        localizedContent,
    ]);
    const localizedLabels = useMemo(
        () => getLocalizedInvitationLabels(eventType, language),
        [eventType, language]
    );

    // Use parsed config for props passed to layouts
    const effectiveProps = useMemo(() => ({
        ...props,
        eventTitle: localizedContent.eventTitle,
        location: localizedContent.location,
        invitationMessage: localizedContent.invitationMessage,
        venueDetails: localizedContent.venueDetails,
        groomFirstName: persona.primaryFirstName,
        groomLastName: persona.primaryLastName,
        brideFirstName: persona.secondaryFirstName,
        brideLastName: persona.secondaryLastName,
        groomFatherName: persona.primaryParents[0] || null,
        groomMotherName: persona.primaryParents[1] || null,
        brideFatherName: persona.secondaryParents[0] || null,
        brideMotherName: persona.secondaryParents[1] || null,
        guestPhotoUrl: props.guestPhotoUrl || props.guestAvatarUrl || (props as any).photoUrl || null,
        guestAvatarUrl: props.guestAvatarUrl || props.guestPhotoUrl || (props as any).photoUrl || null,
        templateConfig,
        storySlides: normalizedStorySlides,
    }), [localizedContent, normalizedStorySlides, persona, props, templateConfig]);

    // --- Golden Premium (default) layout below ---
    // Use theme colors if provided, otherwise default to gold
    const layoutType = templateConfig?.layoutType || 'default';
    const activeColorScheme = templateConfig?.colorScheme || colorSchemes.gold;
    const templateFonts = useMemo(() => getTemplateFontFamilies(templateConfig), [templateConfig]);
    const buttonFontFamily = language === 'kh' ? templateFonts.khmerButton : templateFonts.button;
    const buttonFontWeight = language === 'kh' ? 600 : 700;

    // Generate Google Calendar URL
    const googleCalendarUrl = useMemo(() => {
        try {
            const startDate = new Date(eventDate);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
            const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
            return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(localizedContent.eventTitle)}&dates=${start}/${end}&details=${encodeURIComponent(localizedContent.invitationMessage || '')}&location=${encodeURIComponent(localizedContent.location)}`;
        } catch {
            return '#';
        }
    }, [eventDate, localizedContent]);

    const allowLanguageToggle = showLanguageToggle && hasSecondaryLanguageContent;

    const [hasOpened, setHasOpened] = useState(previewPage === 'details');
    const [introFinished, setIntroFinished] = useState(previewPage === 'details');
    const [showIntroVideo, setShowIntroVideo] = useState(previewPage === 'transition');
    const [isPlaying, setIsPlaying] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSlideshow, setIsSlideshow] = useState(false);
    const [showRsvpOptions, setShowRsvpOptions] = useState(false);
    const [activeScheduleDate, setActiveScheduleDate] = useState<string | null>(null);
    const [photoRatios, setPhotoRatios] = useState<Record<string, 'landscape' | 'portrait'>>({});
    const [imageZoom, setImageZoom] = useState(1);

    // Detect Photo Ratios for Dynamic Grid
    useEffect(() => {
        if (albumPhotos && albumPhotos.length > 0) {
            albumPhotos.forEach((photo: any) => {
                if (!photoRatios[photo.imageUrl]) {
                    const img = new window.Image();
                    img.src = photo.imageUrl;
                    img.onload = () => {
                        const ratio = img.width > img.height ? 'landscape' : 'portrait';
                        setPhotoRatios(prev => ({ ...prev, [photo.imageUrl]: ratio }));
                    };
                }
            });
        }
    }, [albumPhotos]);

    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);
    const backgroundVideoRef = useRef<HTMLVideoElement>(null);

    // Transition Variants for Synchronized Reveal
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

    // Initial autoplay logic moved to handleVideoEnd to prevent clash

    // Attempt autoplay on mount and interaction
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

        // Try immediately
        playAudio();

        // Add global listener for first interaction (fallback for browser block)
        const handleInteraction = () => {
            playAudio();
            // Remove listeners after first successful interaction attempt
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

    // State for transition flash
    const [showTransitionFlash, setShowTransitionFlash] = useState(false);

    useEffect(() => {
        if (!previewPage) return;
        if (previewPage === 'intro') {
            setHasOpened(false);
            setIntroFinished(false);
            setShowIntroVideo(false);
            return;
        }
        if (previewPage === 'transition') {
            setHasOpened(false);
            setIntroFinished(false);
            setShowIntroVideo(true);
            return;
        }
        setHasOpened(true);
        setIntroFinished(true);
        setShowIntroVideo(false);
    }, [previewPage]);

    const handleOpen = () => {
        setShowIntroVideo(true);

        // If no transition media, auto-advance after 4 seconds
        if (!props.transitionVideoUrl) {
            setTimeout(() => { handleVideoEnd(); }, 4000);
        } else if (!isVideoUrl(props.transitionVideoUrl)) {
            // Transition is an image — no onEnded event, so auto-advance after 4 seconds
            setTimeout(() => { handleVideoEnd(); }, 4000);
        } else if (transitionVideoRef.current) {
            transitionVideoRef.current.currentTime = 0;
            transitionVideoRef.current.play().catch(e => console.error("Video play failed", e));
        }

        // Ensure music plays if it wasn't already playing
        if (musicUrl && audioRef.current && !isPlaying) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(console.error);
        }
    };

    const handleVideoEnd = () => {
        // 1. Trigger Flash
        setShowTransitionFlash(true);

        // 2. Wait for white-out (approx 200ms) then switch content
        setTimeout(() => {
            setShowIntroVideo(false);
            setIntroFinished(true);
            setHasOpened(true);

            // Start playing background video if ref exists
            if (backgroundVideoRef.current) {
                backgroundVideoRef.current.play().catch(e => console.log("Background video play delayed:", e));
            }

            // 3. Fade out flash after content is switched
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

    // Gallery functions
    const openGallery = useCallback((index: number) => {
        setCurrentImageIndex(index);
        setGalleryOpen(true);
    }, []);

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



    const englishDateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(eventDate)).toUpperCase();
    const khmerDateTime = toKhmerDateTime(new Date(eventDate));
    const englishTimePart = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(eventDate));
    const englishDatePart = new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate));
    const khmerDateParts = getKhmerDateTimeParts(new Date(eventDate));
    const timePart = language === 'kh' ? khmerDateParts.timePart : `Starting at ${englishTimePart}`;
    const datePart = language === 'kh' ? khmerDateParts.datePart : englishDatePart;
    const coupleTitles = language === 'kh'
        ? getCoupleTitles()
        : { groom: 'The Groom', bride: 'The Bride' };
    const eventDetailTitle = getEventDetailTitle((eventType as EventType) || 'wedding');
    const dateTimeHeadline = language === 'kh' ? khmerDateTime : englishDateTime;
    const introInvitationLabel = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'You Are Invited';
    const specialGuestLabel = language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Special Guest';
    const guestFallbackName = language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Distinguished Guest';
    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const addToCalendarLabel = language === 'kh' ? 'ដាក់ក្នុងប្រតិទិន 📅' : 'Add to Calendar 📅';
    const transitionEventLabel = persona.isBirthday ? 'For the birthday of' : 'For the wedding of';
    const saveTheDateLabel = 'Save the Date';
    const parentSidePrimaryLabel = persona.isBirthday
        ? localizedLabels.familyTitle
        : (language === 'kh' ? 'លោកមេបាកូនកម្លោះ' : "Groom's Family");
    const parentSideSecondaryLabel = language === 'kh' ? 'លោកមេបាកូនក្រមុំ' : "Bride's Family";
    const invitationMessageTitle = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'Invitation Message';
    const venueLabel = localizedLabels.venueTitle;
    const openMapLabel = language === 'kh' ? 'បើកផែនទី 📍' : 'Open Map 📍';
    const rsvpLabel = language === 'kh' ? 'ឆ្លើយតប' : 'RSVP';
    const joinLabel = language === 'kh' ? 'ចូលរួម' : 'Join';
    const sorryLabel = language === 'kh' ? 'មិនអាចចូលរួម' : 'Sorry';
    const cancelLabel = language === 'kh' ? 'បោះបង់' : 'Cancel';
    const acceptedLabel = language === 'kh' ? 'អ្នកបានឆ្លើយតបថា ចូលរួម ✅' : 'You responded: Joining ✅';
    const declinedLabel = language === 'kh' ? 'អ្នកបានឆ្លើយតបថា មិនអាចចូលរួម ❌' : 'You responded: Sorry, unable to join ❌';

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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Stagger effect
                delayChildren: 0.3,   // Wait a bit after mount
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

    const galleryVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            } as any
        },
        hover: {    // Add hover variant for specific scale effect on image
            scale: 1.02,
            transition: { duration: 0.5 }
        }

    }), []);

    const MobilePortraitFrame = ({ children }: { children: React.ReactNode }) => (
        <div className="min-h-screen w-full bg-[#0a0a0c] flex justify-center items-center overflow-x-hidden">
            <div 
                className="w-full max-w-[480px] min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.95)] bg-black overflow-hidden"
                style={{ transform: 'translateZ(0)' }}
            >
                {children}
            </div>
        </div>
    );

    // Route to dedicated layouts only after all InvitationView hooks are declared,
    // so switching layouts in the preview cannot change the hook count mid-render.
    if (layoutType === 'modern') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<ModernMinimalLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'traditional') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<TraditionalHeritageLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'romantic') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<RomanticDreamsLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'movie-ceremony') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<MovieCeremonyLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'class-gold') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<ClassGoldLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'golden-grandeur') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<GoldenGrandeurLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'blush-ornate') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<BlushOrnateLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'birthday-balloon') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<BirthdayBalloonLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'botanical-arch') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<BotanicalArchLayout {...effectiveProps} /></MobilePortraitFrame>;
    if (layoutType === 'blue-arch') return <MobilePortraitFrame>{allowLanguageToggle && <InvitationLanguageToggle />}<BlueArchLayout {...effectiveProps} /></MobilePortraitFrame>;

    // Video/Image URL helpers
    const isVideoUrl = (url: string | null | undefined) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);

    // Media URLs - Use props first, then fallbacks
    const introParams = props.introVideoUrl || "/uploads/video/1770281365052-first_screen.mp4";
    const transitionParams = props.transitionVideoUrl;
    const backgroundParams = props.backgroundVideoUrl || "/uploads/video/1770281380424-second_screen.mp4";

    // Check if this is a "Frame" template
    // We assume the caller passes the template codeKey via eventType (hack) or we deduce it from properties
    // Actually, InvitationView doesn't receive templateId directly in props.
    // However, we can check if effectLayerUrl is present and maybe add a prop "templateId" later.
    // For now, let's assume we pass templateId or use a specific reliable way.
    // Wait, the plan said "template codeKey starts with frame-".
    // I need to add `templateId` to InvitationViewProps first to support this robustly.
    // For now, checking if we have a prop `templateId` or similar.
    // Let's add `templateId` to `InvitationViewProps` in the interface and usage.

    const isFrameTemplate = props.templateId?.startsWith('frame-');

    if (isFrameTemplate && !introFinished && !showIntroVideo) {
        // --- STAGE 1 (Frame Mode): INTRO ---
        // Similar to standard but maybe simplified?
        // For now, let's keep the standard intro.
    }

    if (isFrameTemplate && hasOpened) {
        // --- STAGE 2 (Frame Mode): MAIN CONTENT ---
        const mainPhoto = albumPhotos.length > 0 ? albumPhotos[0].imageUrl : null;

        return (
            <main lang={language === 'kh' ? 'km' : 'en'} className={`relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden ${lato.className} ${templateFontVariables}`} style={{ fontFamily: templateFonts.body }}>
                {allowLanguageToggle && <InvitationLanguageToggle />}
                {/* Background Video (Sky/Clouds) */}
                <div className="fixed inset-0 z-0">
                    {props.backgroundImageUrl ? (
                        <img src={props.backgroundImageUrl} className="w-full h-full object-cover" alt="background" />
                    ) : (
                        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                            <source src={backgroundParams} type="video/mp4" />
                        </video>
                    )}
                    {/* Optional Overlay to ensure text readability if needed */}
                    <div className="absolute inset-0 bg-white/10" />
                </div>

                {/* Main Content Container */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">

                    {/* Top Text */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-center mb-4 md:mb-8"
                    >
                        <h1 className="text-[#2C3E50] text-3xl md:text-5xl font-bold tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {persona.isBirthday ? 'HAPPY BIRTHDAY' : 'TRUE LOVE'}
                        </h1>
                        <p className="text-[#34495E] text-lg md:text-xl mt-2 tracking-wider">
                            {eventDetailTitle}
                        </p>
                    </motion.div>

                    {/* Photo + Frame Container */}
                    <div className="relative w-full max-w-lg aspect-[3/4] flex items-center justify-center p-4">

                        {/* 1. User Photo (Behind Frame) */}
                        {mainPhoto ? (
                            <div className="absolute inset-4 overflow-hidden rounded-lg">
                                <Image
                                    src={mainPhoto}
                                    alt="Couple"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="absolute inset-4 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">
                                No Photo
                            </div>
                        )}

                        {/* 2. Animated Frame (Overlay) */}
                        {/* This is the 'Effect Layer' video, reused as the Frame */}
                        {props.effectLayerUrl && (
                            <div className="absolute inset-0 pointer-events-none z-20">
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-fill scale-105"
                                    style={{
                                        mixBlendMode: (props.effectLayerBlendMode as any) || 'normal',
                                        opacity: props.effectLayerOpacity ?? 1
                                    }}
                                >
                                    <source src={props.effectLayerUrl} type="video/mp4" />
                                </video>
                            </div>
                        )}

                        {/* 3. Static Frame Fallback (Optional, standard border) */}
                        {!props.effectLayerUrl && (
                            <div className="absolute inset-0 border-[16px] rounded-lg z-20" style={{ borderColor: `${activeColorScheme.primary}80` }} />
                        )}
                    </div>

                    {/* Bottom Names */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="text-center mt-4 md:mt-8 space-y-4"
                    >
                        <h2 className="text-[#2C3E50] text-2xl md:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {persona.coupleLine}
                        </h2>

                        {/* Enhanced Date Display */}
                        <div className="relative py-6 px-8">
                            {/* Decorative Lines */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeColorScheme.primary}66, ${activeColorScheme.primary}99)` }}></div>
                                <div className="mx-4 w-2 h-2 rounded-full" style={{ backgroundColor: activeColorScheme.primary, boxShadow: `0 0 10px ${activeColorScheme.primary}99` }}></div>
                                <div className="flex-1 h-[2px]" style={{ backgroundImage: `linear-gradient(to left, transparent, ${activeColorScheme.primary}66, ${activeColorScheme.primary}99)` }}></div>
                            </div>

                            {/* Date Text */}
                            <p className="relative z-10 bg-white/90 backdrop-blur-sm inline-block px-6 py-3 text-[#2C3E50] text-lg md:text-2xl font-bold tracking-[0.3em] uppercase shadow-lg" style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.15em' }}>
                                {khmerDateTime}
                            </p>

                            {/* Corner Ornaments */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: `${activeColorScheme.primary}99` }}></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: `${activeColorScheme.primary}99` }}></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: `${activeColorScheme.primary}99` }}></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: `${activeColorScheme.primary}99` }}></div>
                        </div>

                        {/* Add to Calendar Button */}
                        <div className="pt-4">
                            <a
                                href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-2 bg-transparent text-[#2C3E50] border border-[#2C3E50]/30 rounded-full text-xs md:text-sm font-bold tracking-wider hover:bg-[#2C3E50]/5 transition-colors"
                                style={{ fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}
                            >
                                {addToCalendarLabel}
                            </a>
                        </div>
                    </motion.div>

                    {/* RSVP Button (Floating or integrated) */}
                    {!showRsvpOptions ? (
                        <button
                            onClick={() => setShowRsvpOptions(true)}
                            className="mt-8 px-8 py-2 bg-[#2C3E50] text-white rounded-full text-sm tracking-wider hover:bg-[#34495E] transition-colors shadow-lg z-30 relative"
                            style={{ fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}
                        >
                            {rsvpLabel}
                        </button>
                    ) : (
                        <div className="mt-8 flex gap-4 z-30 relative">
                            <button onClick={() => props.onRsvp?.('ACCEPTED')} className="px-6 py-2 bg-green-600 text-white rounded-full text-xs" style={{ fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}>{joinLabel}</button>
                            <button onClick={() => props.onRsvp?.('DECLINED')} className="px-6 py-2 bg-red-600 text-white rounded-full text-xs" style={{ fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}>{sorryLabel}</button>
                        </div>
                    )}
                </div>

                {/* Music Control */}
                {musicUrl && (
                    <button
                        onClick={toggleMusic}
                        className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full text-[#2C3E50] shadow-lg"
                    >
                        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                )}
                {/* Frame Overlay for Frame Template Mode */}
                <FrameOverlay url={introFrameUrl || detailFrameUrl} />
                {musicUrl && <audio ref={audioRef} src={musicUrl} loop autoPlay />}
            </main>
        );
    }

    // Default / Standard Layout Return
    return (
        <main lang={language === 'kh' ? 'km' : 'en'} className={`relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden ${lato.className} ${templateFontVariables}`} style={{ fontFamily: templateFonts.body }}>
            {allowLanguageToggle && <InvitationLanguageToggle />}
            {/* ... (Original Standard Layout Code) ... */}
            {/* Stage 1 Background (Intro) */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${introFinished || showIntroVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {props.backgroundImageUrl ? (
                    <img src={props.backgroundImageUrl} className="w-full h-full object-cover" alt="background" />
                ) : isVideoUrl(introParams) ? (
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                        <source src={introParams} type="video/mp4" />
                    </video>
                ) : (
                    <img src={introParams} className="w-full h-full object-cover" alt="intro background" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <FrameOverlay url={introFrameUrl} />
            </div>

            {/* Stage 1.5 (Transition) - PRELOADED */}
            <div className={`fixed inset-0 bg-black transition-opacity duration-300 ${showIntroVideo ? 'z-30 opacity-100' : 'z-[-1] opacity-0'}`}>
                {transitionParams ? (
                    isVideoUrl(transitionParams) ? (
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
                    ) : (
                        <img src={transitionParams} className="w-full h-full object-cover" alt="transition background" />
                    )
                ) : props.backgroundImageUrl && (
                    <img src={props.backgroundImageUrl} className="w-full h-full object-cover opacity-30" alt="background" />
                )}

                {/* Overlay Content (Logo & Save the Date) */}
                {/* Overlay Content */}
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none pb-10">
                    {/* Contrast Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 opacity-90 z-0" />

                    {/* Particles */}
                    <div className="absolute inset-0 opacity-70 z-10">
                        <GoldParticles />
                    </div>

                    <motion.div
                        variants={transitionOverlayVariants}
                        initial="hidden"
                        animate={showIntroVideo ? "show" : "hidden"}
                        className="flex flex-col items-center space-y-8 relative z-50 w-full max-w-lg px-6"
                    >
                        {!persona.isBirthday && logoUrl && (
                            <motion.div
                                variants={transitionItemVariants}
                                className="relative mb-4 w-24 h-24"
                            >
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(238,197,115,0.4)] brightness-100" />
                            </motion.div>
                        )}
                        {/* 1. Save the Date (Moved to Top) */}
                        <div className="text-center flex flex-col items-center space-y-4 w-full">
                            <motion.h2
                                variants={transitionItemVariants}
                                className="text-2xl md:text-3xl font-bold uppercase tracking-widest bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    fontFamily: 'Playfair Display, serif',
                                    letterSpacing: "0.4em",
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                {saveTheDateLabel}
                            </motion.h2>

                            {/* Divider & "For the wedding of" */}
                            <motion.div
                                variants={lineVariants}
                                className="flex items-center justify-center gap-4 w-full"
                            >
                                <div className="h-[1px] w-8 md:w-12 bg-white/40" />
                                <span className="text-white/90 text-[10px] md:text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Lato, sans-serif' }}>
                                    {transitionEventLabel}
                                </span>
                                <div className="h-[1px] w-8 md:w-12 bg-white/40" />
                            </motion.div>
                        </div>

                        {/* 2. Main Logo (Moved to Middle) */}
                        {(secondLogoUrl || logoUrl) && (
                            <motion.div
                                variants={transitionItemVariants}
                                className="relative drop-shadow-[0_0_25px_rgba(238,197,115,0.6)]"
                                style={{ width: (Number(logoSize) || 150), height: (Number(logoSize) || 150) }}
                            >
                                {persona.isBirthday ? (
                                    <div className="relative h-full w-full rounded-[32px] p-[6px]" style={{ background: activeColorScheme.gradient, boxShadow: '0 18px 40px rgba(0,0,0,0.28)' }}>
                                        <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/35 bg-black/15">
                                            <img
                                                src={secondLogoUrl || logoUrl || ''}
                                                alt="Celebrant Portrait"
                                                className="h-full w-full object-cover brightness-105 contrast-105"
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_45%)]" />
                                            <div className="pointer-events-none absolute inset-[10px] rounded-[22px] border" style={{ borderColor: `${activeColorScheme.accent || '#ffffff'}66` }} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={secondLogoUrl || logoUrl || ''}
                                            alt="Wedding Graphic"
                                            className="w-full h-full object-contain filter brightness-110 contrast-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 animate-shine-slow rounded-full pointer-events-none" />

                                        <motion.div
                                            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                                            animate={{
                                                opacity: [0.3, 0.8, 0.3],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent"
                                                animate={{
                                                    rotate: [0, 360]
                                                }}
                                                transition={{
                                                    duration: 8,
                                                    repeat: Infinity,
                                                    ease: "linear"
                                                }}
                                                style={{
                                                    backgroundImage: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)'
                                                }}
                                            />
                                        </motion.div>
                                    </>
                                )}
                            </motion.div>
                        )}

                        <div className="text-center flex flex-col items-center space-y-4 w-full">
                            {/* 3. Names (Smaller Size) */}
                            <motion.h1
                                variants={transitionItemVariants}
                                className="text-3xl md:text-5xl font-bold leading-tight py-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    fontFamily: 'Moul, "Great Vibes", cursive',
                                    letterSpacing: 0,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                    // textShadow: '0 4px 30px rgba(238, 197, 115, 0.6)'
                                }}
                            >
                                {persona.isBirthday ? (
                                    persona.primaryFullName || groomLastName || groomFirstName || localizedContent.eventTitle
                                ) : (
                                    <>
                                        {groomLastName || 'Groom'}
                                        <span className="text-2xl align-middle px-3 font-serif" style={{ color: `${activeColorScheme.primary}cc` }}>&</span>
                                        {brideLastName || 'Bride'}
                                    </>
                                )}
                            </motion.h1>

                            {/* Enhanced Khmer Date Line */}
                            <motion.div
                                variants={transitionItemVariants}
                                className="flex items-center justify-center text-center text-xl md:text-3xl font-bold py-5 border-y px-10 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
                                style={{
                                    borderColor: `${activeColorScheme.primary}4d`,
                                    backgroundImage: activeColorScheme.gradient,
                                    fontFamily: 'Moul, serif',
                                    letterSpacing: 0,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                    // textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                    // color: '#eec573'
                                }}
                            >
                                {language === 'kh' ? toKhmerDate(new Date(eventDate)) : englishDatePart}
                            </motion.div>

                            {/* Location with Map Icon & Gold Color */}
                            <motion.div
                                variants={transitionItemVariants}
                                className={`flex items-start justify-center gap-2 text-lg md:text-2xl font-bold mt-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${kantumruy.className}`}
                                style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                <span className="shrink-0 mt-0.5" style={{ color: activeColorScheme.secondary }}><MapPin size={18} /></span>
                                {localizedContent.location || 'Phnom Penh'}
                            </motion.div>
                        </div>
                    </motion.div>
                    <FrameOverlay url={transitionFrameUrl} />
                </div>
            </div>

            {/* Stage 2 Background (Main Content) */}
            <div className={`fixed inset-0 z-0 transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0'}`}>
                {props.backgroundImageUrl ? (
                    <img src={props.backgroundImageUrl} className="w-full h-full object-cover" alt="background" />
                ) : isVideoUrl(backgroundParams) ? (
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
                ) : (
                    <img src={backgroundParams} className="w-full h-full object-cover" alt="background" />
                )}
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
                        {/* 1. Base Flash Layer (White/Gold mix) */}
                        <div className="absolute inset-0 opacity-90" style={{ backgroundImage: `radial-gradient(circle, white, ${activeColorScheme.primary}, white)` }} />

                        {/* 2. Moving Sheen/Bright Sweep */}
                        <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '100%', opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 rotate-12 scale-150 transform"
                        />

                        {/* 3. Central Burst */}
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
                <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: `${activeColorScheme.primary}99` }} />
                <div className="absolute top-20 right-20 w-3 h-3 rounded-full animate-pulse" style={{ animationDelay: '0.5s', backgroundColor: `${activeColorScheme.primary}66` }} />
                <div className="absolute bottom-32 left-16 w-2 h-2 rounded-full animate-pulse" style={{ animationDelay: '1s', backgroundColor: `${activeColorScheme.primary}80` }} />
                <div className="absolute bottom-20 right-32 w-3 h-3 rounded-full animate-pulse" style={{ animationDelay: '1.5s', backgroundColor: `${activeColorScheme.primary}99` }} />
            </div>

            {!introFinished && !showIntroVideo ? (
                // --- STAGE 1: INTRO ---
                <>
                    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-6 md:p-6 space-y-8">
                        <div className="space-y-6 max-w-md w-full">
                            {logoUrl && (
                                <div
                                    className="relative mb-4 mx-auto"
                                    style={{ width: Number(logoSize) || 150, height: Number(logoSize) || 150 }}
                                >
                                    {persona.isBirthday ? (
                                        <div className="relative h-full w-full rounded-[34px] p-[6px]" style={{ background: activeColorScheme.gradient, boxShadow: '0 20px 38px rgba(0,0,0,0.3)' }}>
                                            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/35 bg-black/10">
                                                <img src={logoUrl} alt="Celebrant Photo" className="w-full h-full object-cover" />
                                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_46%)]" />
                                                <div className="pointer-events-none absolute inset-[10px] rounded-[22px] border" style={{ borderColor: `${activeColorScheme.accent || '#fff'}66` }} />
                                                <div className="pointer-events-none absolute -left-2 top-5 h-10 w-10 rounded-full blur-xl" style={{ backgroundColor: `${activeColorScheme.primary}55` }} />
                                                <div className="pointer-events-none absolute -right-2 bottom-5 h-10 w-10 rounded-full blur-xl" style={{ backgroundColor: `${activeColorScheme.secondary || activeColorScheme.primary}55` }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={logoUrl} alt="Wedding Logo" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(238,197,115,0.5)]" />
                                    )}
                                </div>
                            )}

                            <div className="space-y-6">
                                <p
                                    className={`text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className}`}
                                    style={{
                                        background: `linear-gradient(to right, ${activeColorScheme.secondary}, ${activeColorScheme.accent}, ${activeColorScheme.primary})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    {introInvitationLabel}
                                </p>

                                {/* Fancy Frame for Guest Name Only */}
                                <div className="flex flex-col items-center space-y-10">
                                    {props.guestFrameUrl ? (
                                        <div className="relative py-8 px-12 sm:px-16" style={{ minWidth: "280px" }}>
                                            <div className="absolute inset-0 z-0 pointer-events-none">
                                                <img src={props.guestFrameUrl} alt="Guest Frame" className="w-full h-full object-fill drop-shadow-md" />
                                            </div>
                                            <div className="relative z-10 flex items-center justify-center">
                                                {/* Dynamic Font Size Calculation */}
                                                {(() => {
                                                    const nameLength = (guestName || guestFallbackName).length;
                                                    let fontSizeClass = "text-xl md:text-3xl"; // Default
                                                    if (nameLength > 40) fontSizeClass = "text-sm md:text-lg";
                                                    else if (nameLength > 25) fontSizeClass = "text-base md:text-xl";
                                                    else if (nameLength > 15) fontSizeClass = "text-lg md:text-2xl";

                                                    return (
                                                        <p
                                                            className={`${fontSizeClass} font-bold tracking-normal leading-relaxed text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className} text-center break-words whitespace-normal`}
                                                            style={{
                                                                background: `linear-gradient(to right, ${activeColorScheme.secondary}, ${activeColorScheme.accent}, ${activeColorScheme.primary})`,
                                                                WebkitBackgroundClip: 'text',
                                                                WebkitTextFillColor: 'transparent',
                                                                backgroundClip: 'text'
                                                            }}
                                                        >
                                                            {guestName || guestFallbackName}
                                                        </p>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ) : (
                                        <FancyFrame padding="px-10 py-1" color={activeColorScheme.primary}>
                                            {/* Dynamic Font Size Calculation */}
                                            {(() => {
                                                const nameLength = (guestName || guestFallbackName).length;
                                                let fontSizeClass = "text-2xl md:text-4xl"; // Default
                                                if (nameLength > 40) fontSizeClass = "text-base md:text-xl";
                                                else if (nameLength > 25) fontSizeClass = "text-lg md:text-2xl";
                                                else if (nameLength > 15) fontSizeClass = "text-xl md:text-3xl";

                                                return (
                                                    <p
                                                        className={`${fontSizeClass} font-bold tracking-normal leading-relaxed bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className} max-w-[85vw] md:max-w-xl text-center break-words whitespace-normal`}
                                                        style={{
                                                            background: `linear-gradient(to right, ${activeColorScheme.secondary}, ${activeColorScheme.accent}, ${activeColorScheme.primary})`,
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            backgroundClip: 'text'
                                                        }}
                                                    >
                                                        {guestName || guestFallbackName}
                                                    </p>
                                                );
                                            })()}
                                        </FancyFrame>
                                    )}

                                    <div className="relative group flex flex-col items-center gap-3">
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.85 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ 
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: 0.2 
                                            }}
                                            onClick={handleOpen}
                                            className="cursor-pointer mx-auto transition-transform hover:scale-105 active:scale-95"
                                        >
                                            {props.buttonImageUrl ? (
                                                props.buttonImageUrl.includes('/assets/buttons/royal-') ? (
                                                    <PredefinedButton 
                                                        type={parseInt(props.buttonImageUrl.split('royal-')[1].split('.svg')[0])} 
                                                        colorScheme={activeColorScheme}
                                                        text={props.templateConfig?.showButtonText !== false ? openInvitationLabel : ''}
                                                        openButtonTextColor={props.templateConfig?.openButtonTextColor}
                                                        fontFamily={buttonFontFamily}
                                                    />
                                                ) : (
                                                    <div className="relative inline-block mt-2">
                                                        <img src={props.buttonImageUrl} alt="Open Invitation" className="w-auto h-20 md:h-24 object-contain drop-shadow-xl" />
                                                        {props.templateConfig?.showButtonText !== false && (
                                                            <span className="absolute inset-0 flex items-center justify-center text-base md:text-xl pb-1 pointer-events-none"
                                                                style={{
                                                                    color: props.templateConfig?.openButtonTextColor || '#4A3511', // Strong dark brown for contrast against gold buttons
                                                                    fontFamily: buttonFontFamily,
                                                                    fontWeight: buttonFontWeight,
                                                                    textShadow: '0 1px 2px rgba(255,255,255,0.4)'
                                                                }}
                                                            >
                                                                {openInvitationLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            ) : (
                                                <div
                                                    className="px-8 py-3 rounded-full text-sm md:text-base font-medium tracking-wide shadow-lg border relative overflow-hidden group"
                                                    style={{
                                                        backgroundColor: activeColorScheme.primary,
                                                        color: props.templateConfig?.openButtonTextColor || activeColorScheme.background,
                                                        borderColor: `${activeColorScheme.accent}80`,
                                                        fontFamily: buttonFontFamily,
                                                        fontWeight: buttonFontWeight
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                                    <span className="relative z-10">{openInvitationLabel}</span>
                                                </div>
                                            )}
                                        </motion.button>

                                        {/* Custom Animated Guiding Button (Theme Compliant) */}
                                        <motion.div
                                            className="absolute right-[26px] top-1/2 -translate-y-[38%] pointer-events-none z-50 flex items-center justify-center w-24 h-24 md:right-[24px]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.5, duration: 0.5 }}
                                        >
                                            {/* Pulsing Ripple Effects */}
                                            <motion.div 
                                                className="absolute w-12 h-12 rounded-full border-[3px]"
                                                style={{ borderColor: activeColorScheme.primary }}
                                                animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.3, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                            />
                                            <motion.div 
                                                className="absolute w-12 h-12 rounded-full border-[3px]"
                                                style={{ borderColor: activeColorScheme.primary }}
                                                animate={{ scale: [1, 2, 2.5], opacity: [0.8, 0.3, 0] }}
                                                transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                                            />
                                            {/* Bouncing Pointing Hand */}
                                            <motion.div
                                                className="relative z-10"
                                                animate={{ y: [0, -8, 0], scale: [1, 0.95, 1], rotate: [-10, -5, -10] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                style={{ filter: `drop-shadow(0 6px 10px rgba(0,0,0,0.28))` }}
                                            >
                                                <svg width="46" height="46" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <linearGradient id="premiumPointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor={activeColorScheme.accent || '#FCF6BA'} />
                                                            <stop offset="52%" stopColor={activeColorScheme.primary} />
                                                            <stop offset="100%" stopColor={activeColorScheme.secondary || '#AA8439'} />
                                                        </linearGradient>
                                                    </defs>
                                                    <path
                                                        d="M13.4 2.2c-.82 0-1.4.63-1.4 1.54v7.34l-2.13-1.05c-.94-.47-2.02-.34-2.8.35l-.87.78c-.39.35-.43.96-.09 1.36l5.05 5.88c.92 1.08 2.27 1.7 3.69 1.7h3.56c1.98 0 3.58-1.6 3.58-3.58v-4.1c0-1.84-1.49-3.34-3.34-3.34H15V3.74c0-.91-.59-1.54-1.4-1.54Z"
                                                        fill="url(#premiumPointerGradient)"
                                                    />
                                                    <path
                                                        d="M13.4 2.2c-.82 0-1.4.63-1.4 1.54v7.34l-2.13-1.05c-.94-.47-2.02-.34-2.8.35l-.87.78c-.39.35-.43.96-.09 1.36l5.05 5.88c.92 1.08 2.27 1.7 3.69 1.7h3.56c1.98 0 3.58-1.6 3.58-3.58v-4.1c0-1.84-1.49-3.34-3.34-3.34H15V3.74c0-.91-.59-1.54-1.4-1.54Z"
                                                        fill="none"
                                                        stroke="rgba(82,58,12,0.28)"
                                                        strokeWidth="0.75"
                                                    />
                                                </svg>
                                            </motion.div>
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
                        {/* Main Title */}
                        <motion.div
                            variants={itemVariants}
                            className={`text-center space-y-3 relative z-10 ${logoUrl ? (persona.isBirthday ? 'mt-20 md:mt-24' : 'mt-24 md:mt-28') : 'mt-24 md:mt-28'}`}
                        >
                            <div className="inline-block px-6 py-3 md:px-7 md:py-4 border-2 rounded-lg bg-black/30 backdrop-blur-sm" style={{ borderColor: `${activeColorScheme.primary}99` }}>
                                <p className={`text-xl md:text-2xl font-bold tracking-normal leading-[1.35] pt-0.5 bg-clip-text text-transparent ${moul.className}`} style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    fontFamily: 'Moul, serif',
                                    letterSpacing: 0,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {eventDetailTitle}
                                </p>
                            </div>
                        </motion.div>

                        {/* Logo Section */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <div
                                className="relative mx-auto flex items-center justify-center"
                                style={{ width: Number(logoSize) || 150, height: logoUrl ? (Number(logoSize) || 150) : 72 }}
                            >
                                {logoUrl && (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(238,197,115,0.5)]" />
                                )}
                            </div>
                        </motion.div>





                        {/* Parents Names */}
                        {(groomFatherName || groomMotherName || brideFatherName || brideMotherName) && (
                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-2 gap-4 md:gap-8 text-center"
                            >
                                <div className="space-y-3">
                                    <p className="text-base md:text-lg mb-2" style={{ fontFamily: "'Moul', serif", letterSpacing: 0, color: activeColorScheme.primary }}>
                                        {parentSidePrimaryLabel}
                                    </p>
                                    {groomFatherName && (
                                        <p className={`text-lg md:text-xl font-medium ${kantumruy.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                            {groomFatherName}
                                        </p>
                                    )}
                                    {groomMotherName && (
                                        <p className="text-lg md:text-xl font-medium" style={{ fontFamily: "'Kantumruy Pro', sans-serif", color: activeColorScheme.textSecondary }}>
                                            {groomMotherName}
                                        </p>
                                    )}
                                </div>
                                {!persona.isBirthday && (
                                    <div className="space-y-3">
                                        <p className="text-base md:text-lg mb-2" style={{ fontFamily: "'Moul', serif", letterSpacing: 0, color: activeColorScheme.primary }}>
                                            {parentSideSecondaryLabel}
                                        </p>
                                        {brideFatherName && (
                                            <p className={`text-lg md:text-xl font-medium ${kantumruy.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                                {brideFatherName}
                                            </p>
                                        )}
                                        {brideMotherName && (
                                            <p className="text-lg md:text-xl font-medium" style={{ fontFamily: "'Kantumruy Pro', sans-serif", color: activeColorScheme.textSecondary }}>
                                                {brideMotherName}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Invitation Message Box */}
                        {localizedContent.invitationMessage && (
                            <motion.div variants={itemVariants} className="space-y-6">
                                <div className="text-center">
                                    <p className="text-xl md:text-2xl" style={{ fontFamily: 'Moul, serif', letterSpacing: 0, color: activeColorScheme.primary }}>
                                        {invitationMessageTitle}
                                    </p>
                                </div>
                                <div className="border-2 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20" style={{ borderColor: `${activeColorScheme.primary}40` }}>
                                    <div className={`text-center space-y-4 whitespace-pre-wrap leading-relaxed text-base md:text-lg ${kantumruy.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                        {localizedContent.invitationMessage}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Couple Names */}
                        <motion.div variants={itemVariants} className="text-center space-y-4">
                            <div className={`grid gap-4 md:gap-8 ${persona.isBirthday ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-2'}`}>
                                {groomLastName && groomFirstName && (
                                    <div className="space-y-2">
                                        <p className={`text-lg md:text-xl mb-1 ${koulen.className}`} style={{ color: `${activeColorScheme.primary}99` }}>
                                            {persona.isBirthday ? localizedLabels.roleTitle : coupleTitles.groom}
                                        </p>
                                        <p className={`text-xl md:text-2xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className}`} style={{
                                            backgroundImage: activeColorScheme.gradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            {groomFirstName}
                                        </p>
                                        <p className={`text-2xl md:text-4xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mt-1 ${moul.className}`} style={{
                                            backgroundImage: activeColorScheme.gradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            {groomLastName}
                                        </p>
                                    </div>
                                )}
                                {!persona.isBirthday && brideLastName && brideFirstName && (
                                    <div className="space-y-2">
                                        <p className={`text-lg md:text-xl mb-1 ${koulen.className}`} style={{ color: `${activeColorScheme.primary}99` }}>
                                            {coupleTitles.bride}
                                        </p>
                                        <p className={`text-xl md:text-2xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className}`} style={{
                                            backgroundImage: activeColorScheme.gradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            {brideFirstName}
                                        </p>
                                        <p className={`text-2xl md:text-4xl font-bold tracking-normal leading-loose pb-2 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mt-1 ${moul.className}`} style={{
                                            backgroundImage: activeColorScheme.gradient,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            {brideLastName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Date & Time in Khmer */}
                        <motion.div variants={itemVariants} className="text-center space-y-4">
                            <div className="w-full h-[1px]" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeColorScheme.primary}80, transparent)` }} />

                            <div className="space-y-3">
                                {/* Time part */}
                                <p className={`text-base md:text-lg ${kantumruy.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                    {timePart}
                                </p>
                                {/* Date part - Koulen */}
                                <p className={`text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] ${koulen.className}`} style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {datePart}
                                </p>
                            </div>

                            <div className="w-full h-[1px]" style={{ backgroundImage: `linear-gradient(to right, transparent, ${activeColorScheme.primary}80, transparent)` }} />

                            {/* Add to Calendar Button */}
                            <div className="pt-4">
                                <a
                                    href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-block px-6 py-2 bg-transparent rounded-full text-sm font-bold tracking-wider hover:bg-white/10 transition-colors ${kantumruy.className}`}
                                    style={{ color: activeColorScheme.primary, borderColor: `${activeColorScheme.primary}66`, fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}
                                >
                                    {addToCalendarLabel}
                                </a>
                            </div>
                        </motion.div>

                        {/* Venue */}
                        {localizedContent.venueDetails && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="border-2 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20 text-center"
                                style={{ borderColor: `${activeColorScheme.primary}66` }}
                            >
                                <p className={`text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] mb-4 ${koulen.className}`} style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>{venueLabel}</p>
                                <div className={`text-xl md:text-2xl font-bold tracking-normal leading-relaxed bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] space-y-2 whitespace-pre-wrap ${koulen.className}`} style={{
                                    backgroundImage: activeColorScheme.gradient,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    {localizedContent.venueDetails}
                                </div>
                                {mapUrl && (
                                    <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-6 transition-colors border-2 px-6 py-2 rounded-full text-sm md:text-base font-bold"
                                        style={{ color: activeColorScheme.primary, borderColor: activeColorScheme.primary, fontFamily: buttonFontFamily, fontWeight: buttonFontWeight }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = activeColorScheme.primary; e.currentTarget.style.color = '#fff' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = activeColorScheme.primary }}
                                    >
                                        {openMapLabel}
                                    </a>
                                )}
                            </motion.div>
                        )}

                        {/* Schedule */}
                        {uniqueDates.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6 }}
                                className="border-2 rounded-lg p-6 md:p-8 backdrop-blur-sm bg-black/20"
                                style={{ borderColor: `${activeColorScheme.primary}40` }}
                            >
                                <p className="text-xl md:text-2xl text-center mb-6" style={{ fontFamily: 'Moul, serif', letterSpacing: 0, color: activeColorScheme.primary }}>កម្មវិធី</p>

                                {uniqueDates.length > 1 && (
                                    <div className="flex justify-center gap-3 mb-8 border-b pb-4" style={{ borderColor: `${activeColorScheme.primary}20` }}>
                                        {uniqueDates.map((date, idx) => (
                                            <button
                                                key={date}
                                                onClick={() => setActiveScheduleDate(date)}
                                                className="px-5 py-2 rounded-full text-sm md:text-base font-bold transition-all"
                                                style={{
                                                    fontFamily: 'Moul, serif', letterSpacing: 0,
                                                    ...(activeScheduleDate === date
                                                        ? { backgroundColor: activeColorScheme.primary, color: activeColorScheme.background, boxShadow: `0 0 15px ${activeColorScheme.primary}66` }
                                                        : { color: activeColorScheme.primary, border: `1px solid ${activeColorScheme.primary}40` }
                                                    )
                                                }}
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
                                        className="space-y-8"
                                    >
                                        {(() => {
                                            const items = activeScheduleDate ? scheduleByDate[activeScheduleDate] : [];
                                            const morningItems: any[] = [];
                                            const eveningItems: any[] = [];

                                            items?.forEach((item: any) => {
                                                const timeObj = parseTimeObject(item.time);
                                                if (timeObj) {
                                                    if (timeObj.hour < 14) { morningItems.push(item); }
                                                    else { eveningItems.push(item); }
                                                } else {
                                                    eveningItems.push(item);
                                                }
                                            });

                                            return (
                                                <>
                                                    {morningItems.length > 0 && (
                                                        <div className="space-y-4">
                                                            <h4 className="text-lg md:text-xl text-center font-bold" style={{ fontFamily: 'Moul, serif', letterSpacing: 0, color: activeColorScheme.primary }}>
                                                                កម្មវិធីពេលព្រឹក
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {morningItems.map((item: any, index: number) => (
                                                                    <div key={`morning-${index}`} className="flex gap-4 text-base md:text-lg items-start">
                                                                        <div className="font-bold min-w-[110px] pt-0.5" style={{ fontFamily: 'Moul, serif', fontSize: '13px', letterSpacing: 0, color: activeColorScheme.primary }}>
                                                                            {parseAndFormatKhmerTime(item.time)}
                                                                        </div>
                                                                        <div className={`flex-1 leading-relaxed ${language === 'kh' ? kantumruy.className : lato.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                                                            {language === 'en' ? (item.activityEn || item.titleEn || item.activity || item.title) : (item.activity || item.title)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {morningItems.length > 0 && eveningItems.length > 0 && (
                                                        <div className="w-full h-[1px]" style={{ backgroundColor: `${activeColorScheme.primary}20` }} />
                                                    )}

                                                    {eveningItems.length > 0 && (
                                                        <div className="space-y-4">
                                                            <h4 className="text-lg md:text-xl text-center font-bold" style={{ fontFamily: 'Moul, serif', letterSpacing: 0, color: activeColorScheme.primary }}>
                                                                កម្មវិធីពេលល្ងាច
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {eveningItems.map((item: any, index: number) => (
                                                                    <div key={`evening-${index}`} className="flex gap-4 text-base md:text-lg items-start">
                                                                        <div className="font-bold min-w-[110px] pt-0.5" style={{ fontFamily: 'Moul, serif', fontSize: '13px', letterSpacing: 0, color: activeColorScheme.primary }}>
                                                                            {parseAndFormatKhmerTime(item.time)}
                                                                        </div>
                                                                        <div className={`flex-1 leading-relaxed ${language === 'kh' ? kantumruy.className : lato.className}`} style={{ color: activeColorScheme.textSecondary }}>
                                                                            {language === 'en' ? (item.activityEn || item.titleEn || item.activity || item.title) : (item.activity || item.title)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Album Photos Section */}
                        <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={activeColorScheme} />

                        {/* RSVP Button */}
                        <div className="text-center pt-6">
                            {props.guestStatus === 'ACCEPTED' ? (
                                <div className="inline-block px-8 py-3 border-2 border-green-500 text-green-400 rounded-full font-bold bg-green-500/10 backdrop-blur-sm">
                                    {acceptedLabel}
                                </div>
                            ) : props.guestStatus === 'DECLINED' ? (
                                <div className="inline-block px-8 py-3 border-2 border-red-500 text-red-400 rounded-full font-bold bg-red-500/10 backdrop-blur-sm">
                                    {declinedLabel}
                                </div>
                            ) : !showRsvpOptions ? (
                                <button
                                    onClick={() => setShowRsvpOptions(true)}
                                    className="px-8 py-3 min-h-[48px] border-2 rounded-full font-bold transition-all"
                                    style={{ color: activeColorScheme.primary, borderColor: activeColorScheme.primary, boxShadow: `0 0 20px ${activeColorScheme.primary}33` }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = activeColorScheme.primary; e.currentTarget.style.color = activeColorScheme.background; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = activeColorScheme.primary; }}
                                >
                                    {rsvpLabel}
                                </button>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-center animate-fade-in-up">
                                    <button
                                        onClick={() => props.onRsvp?.('ACCEPTED')}
                                        className="w-full md:w-auto px-10 py-3 min-h-[48px] rounded-full font-bold tracking-wider transition-all hover:scale-105"
                                        style={{ backgroundColor: activeColorScheme.primary, color: activeColorScheme.background, boxShadow: `0 0 20px ${activeColorScheme.primary}44` }}
                                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                                    >
                                        {joinLabel}
                                    </button>
                                    <button
                                        onClick={() => props.onRsvp?.('DECLINED')}
                                        className="w-full md:w-auto px-10 py-3 min-h-[48px] border-2 bg-black/30 backdrop-blur-sm rounded-full font-bold tracking-wider transition-all hover:scale-105"
                                        style={{ color: activeColorScheme.primary, borderColor: activeColorScheme.primary }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = activeColorScheme.primary; e.currentTarget.style.color = activeColorScheme.background; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = activeColorScheme.primary; }}
                                    >
                                        {sorryLabel}
                                    </button>
                                    <button
                                        onClick={() => setShowRsvpOptions(false)}
                                        className="text-white/50 text-sm hover:text-white mt-2 md:mt-0"
                                    >
                                        {cancelLabel}
                                    </button>
                                </div>
                            )}
                        </div>

                        <InvitationCountdownSection
                            eventDate={eventDate}
                            featureLimits={props.featureLimits}
                            colorScheme={activeColorScheme}
                        />

                        <DigitalWishesSection
                            eventId={props.id}
                            enabled={Boolean((props as any).featureLimits?.digitalWishes)}
                            guestName={guestName}
                            guestCode={(props as any).code || (props as any).shortCode}
                            language={language as 'kh' | 'en'}
                            colorScheme={activeColorScheme}
                            className="pt-6"
                            headingClassName={koulen.className}
                            bodyClassName={kantumruy.className}
                        />

                        {/* Thank You */}
                        <div className={`text-center text-xs md:text-sm pb-8 ${kantumruy.className}`} style={{ color: `${activeColorScheme.textSecondary}` }}>
                            អរគុណសម្រាប់ការចូលរួមរបស់លោកអ្នក
                        </div>

                        {/* App Footer - Now inside scroll container */}
                        <AppFooter colorScheme={activeColorScheme} />
                    </motion.div>
                    <FrameOverlay url={detailFrameUrl} className="fixed inset-0 pointer-events-none z-[60]" />
                </div>
            ) : null
            }

            {
                musicUrl && (
                    <button
                        onClick={toggleMusic}
                        className="fixed bottom-6 right-6 z-50 backdrop-blur-sm p-3 rounded-full border-2 shadow-lg transition-all"
                        style={{ backgroundColor: `${activeColorScheme.primary}20`, color: activeColorScheme.primary, borderColor: `${activeColorScheme.primary}50` }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = activeColorScheme.primary; e.currentTarget.style.color = activeColorScheme.background; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = `${activeColorScheme.primary}20`; e.currentTarget.style.color = activeColorScheme.primary; }}
                    >
                        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                )
            }

            {musicUrl && <audio ref={audioRef} src={musicUrl} loop autoPlay />}

            <style>{`
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

            {/* Full Screen Gallery Modal */}
            <AnimatePresence>
                {galleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center touch-none"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white z-50 p-2 transition-colors"
                        >
                            <X size={32} />
                        </button>

                        {/* Main Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full flex items-center justify-center p-4 md:p-10"
                                >
                                    <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                                        <Image
                                            src={albumPhotos[currentImageIndex]?.imageUrl}
                                            alt="Gallery Preview"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons (Desktop) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
                            >
                                <ChevronLeft size={40} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-4 hover:bg-white/10 rounded-full"
                            >
                                <ChevronRight size={40} />
                            </button>

                            {/* Image Counter & Slideshow Toggle */}
                            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
                                <span className="text-white/60 text-sm tracking-widest font-mono">
                                    {currentImageIndex + 1} / {albumPhotos.length}
                                </span>

                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleSlideshow(); }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                                    style={isSlideshow
                                        ? { backgroundColor: activeColorScheme.primary, color: activeColorScheme.background }
                                        : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }
                                    }
                                >
                                    {isSlideshow ? <Pause size={16} /> : <Play size={16} />}
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        {isSlideshow ? 'Pause' : 'Play'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main >
    );
}
