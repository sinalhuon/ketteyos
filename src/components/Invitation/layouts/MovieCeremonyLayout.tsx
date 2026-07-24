'use client';

import { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Hand } from 'lucide-react';
import localFont from 'next/font/local';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import { toKhmerDate, toKhmerTime } from '@/lib/khmer-utils';
import { getTemplateFontFamilies, templateFontVariables } from '@/lib/template-fonts';
import { PredefinedButton } from '../InvitationView';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';
import OpenInvitationHint from '../OpenInvitationHint';

const moul = localFont({
    src: '../../../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-moul',
});

const konkhmer = localFont({
    src: '../../../../public/assets/fonts/KonkhmerSleokchher-Regular.ttf',
    variable: '--font-konkhmer',
});

const moulpali = localFont({
    src: '../../../../public/assets/fonts/Moulpali-Regular.ttf',
    variable: '--font-moulpali',
});

const hanuman = localFont({
    src: '../../../../public/assets/fonts/Hanuman-VariableFont_wght.ttf',
    variable: '--font-hanuman',
});

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
    guestPhotoUrl?: string | null;
    guestAvatarUrl?: string | null;
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
    templateConfig?: any;
    backgroundVideoUrl?: string | null;
    backgroundImageUrl?: string | null;
    transitionVideoUrl?: string | null;
    logoUrl?: string | null;
    movieTrailerUrl?: string | null;
    trailerUrl?: string | null;
    dressCode?: string | null;
    dressCodeText?: string | null;
    dressCodeColors?: string[] | string | null;
    dressColors?: string[] | string | null;
    albumPhotos?: string[];
    albumVideos?: string[] | string;
    featureLimits?: {
        digitalWishes?: boolean;
        [key: string]: unknown;
    };
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    [key: string]: any;
}

function TypewriterText({ text, delay = 0 }: { text: string, delay?: number }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
        >
            {text}
        </motion.span>
    );
}

function MovieSummarySection({ summary, language, colorScheme, moulFontClass }: { summary: string; language: string; colorScheme: any; moulFontClass: string }) {
    const [charIndex, setCharIndex] = useState(0);
    const [isSkipped, setIsSkipped] = useState(false);
    const graphemes = useRef<string[]>([]);
    const audioCtxRef = useRef<any>(null);

    const playClickSound = () => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContextClass();
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume().catch(() => {});
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(380 + Math.random() * 140, ctx.currentTime);

            gain.gain.setValueAtTime(0.012, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.035);
        } catch {}
    };

    useEffect(() => {
        if (!summary) return;
        try {
            if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
                const segmenter = new (Intl as any).Segmenter(language === 'kh' ? 'km' : 'en', { granularity: 'grapheme' });
                graphemes.current = Array.from(segmenter.segment(summary), (s: any) => s.segment);
            } else {
                graphemes.current = Array.from(summary);
            }
        } catch {
            graphemes.current = Array.from(summary);
        }
        setCharIndex(0);
        setIsSkipped(false);
    }, [summary, language]);

    useEffect(() => {
        if (isSkipped || graphemes.current.length === 0) return;
        if (charIndex >= graphemes.current.length) return;

        const currentChar = graphemes.current[charIndex];
        if (currentChar && currentChar.trim() !== '') {
            playClickSound();
        }

        const timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
        }, 110); // Perfectly balanced theatrical script typing speed (110ms)

        return () => clearTimeout(timer);
    }, [charIndex, isSkipped]);

    const isComplete = isSkipped || charIndex >= graphemes.current.length;
    const currentText = isSkipped ? summary : graphemes.current.slice(0, charIndex).join('');

    const handleSkip = () => {
        setIsSkipped(true);
    };

    if (!summary) return null;

    return (
        <div className="w-full max-w-2xl mx-auto px-6 py-8 sm:px-10 sm:py-10 bg-black/75 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className={`text-sm sm:text-base font-bold uppercase tracking-wider ${moulFontClass}`} style={{ color: colorScheme.primary }}>
                    📖 {language === 'kh' ? 'សាច់រឿងសង្ខេប' : 'MOVIE SYNOPSIS'}
                </span>
                {!isComplete && (
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 px-3 py-1 rounded-full transition-all cursor-pointer shadow-md"
                    >
                        <span>⚡ {language === 'kh' ? 'រំលង' : 'Skip Typing'}</span>
                    </button>
                )}
            </div>
            <p className={`text-sm sm:text-base md:text-lg font-normal leading-relaxed text-white/95 whitespace-pre-line min-h-[5rem] ${hanuman.className}`}>
                {currentText}
                {!isComplete && (
                    <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse align-middle shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
            </p>
        </div>
    );
}

function getVideoProviderId(url: string, provider: 'youtube' | 'vimeo') {
    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace(/^www\./, '');
        const pathParts = parsed.pathname.split('/').filter(Boolean);

        if (provider === 'youtube') {
            if (host === 'youtu.be' && pathParts[0]?.match(/^[A-Za-z0-9_-]{11}$/)) return pathParts[0];
            if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
                const watchId = parsed.searchParams.get('v');
                if (watchId?.match(/^[A-Za-z0-9_-]{11}$/)) return watchId;
                if (['embed', 'shorts', 'v'].includes(pathParts[0]) && pathParts[1]?.match(/^[A-Za-z0-9_-]{11}$/)) return pathParts[1];
            }
        }

        if (provider === 'vimeo' && host.endsWith('vimeo.com')) {
            const videoIndex = pathParts.indexOf('video');
            const candidate = videoIndex >= 0 ? pathParts[videoIndex + 1] : pathParts.find((part) => /^\d+$/.test(part));
            if (candidate && /^\d+$/.test(candidate)) return candidate;
        }
    } catch {
        // Fall back to regex parsing below.
    }

    if (provider === 'youtube') {
        return url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?[^#\s]*?[?&]?v=))([A-Za-z0-9_-]{11})/i)?.[1] || null;
    }

    return url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1] || null;
}

function getEmbedVideoUrl(url: string | null | undefined): { type: 'mp4' | 'youtube' | 'vimeo' | 'facebook' | 'empty', embedUrl: string } {
    if (!url || typeof url !== 'string') return { type: 'empty', embedUrl: '' };
    const trimmed = url.trim();
    if (!trimmed) return { type: 'empty', embedUrl: '' };

    const youtubeId = getVideoProviderId(trimmed, 'youtube');
    if (youtubeId) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
        };
    }

    const vimeoId = getVideoProviderId(trimmed, 'vimeo');
    if (vimeoId) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&api=1`
        };
    }

    if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
        return {
            type: 'facebook',
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&autoplay=true`
        };
    }

    return {
        type: 'mp4',
        embedUrl: trimmed
    };
}

function collectVideoLinks(value: unknown): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (typeof item === 'string') return collectVideoLinks(item);
            if (item && typeof item === 'object') {
                const record = item as { videoUrl?: unknown; url?: unknown };
                return collectVideoLinks(record.videoUrl || record.url);
            }
            return [];
        });
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return collectVideoLinks(parsed);
        } catch {
            // Plain text field: one URL per line.
        }

        return trimmed
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function getVideoKey(url: string) {
    const trimmed = url.trim();
    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.replace(/^www\./, '');
        const pathParts = parsed.pathname.split('/').filter(Boolean);

        if (host === 'youtu.be' && pathParts[0]) return `youtube:${pathParts[0]}`;
        if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
            const watchId = parsed.searchParams.get('v');
            if (watchId) return `youtube:${watchId}`;
            if (['embed', 'shorts', 'v'].includes(pathParts[0]) && pathParts[1]) return `youtube:${pathParts[1]}`;
        }

        if (host.endsWith('vimeo.com')) {
            const videoIndex = pathParts.indexOf('video');
            const vimeoId = videoIndex >= 0 ? pathParts[videoIndex + 1] : pathParts.find((part) => /^\d+$/.test(part));
            if (vimeoId) return `vimeo:${vimeoId}`;
        }
    } catch {
        // Use normalized URL as a stable fallback.
    }

    return trimmed.replace(/\/+$/, '').toLowerCase();
}

function uniqueVideoLinks(value: unknown) {
    const seen = new Set<string>();
    return collectVideoLinks(value).filter((url) => {
        const key = getVideoKey(url);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function firstNonEmptyText(...values: unknown[]) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return '';
}

function collectDressCodeColors(value: unknown): string[] {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.flatMap((item) => {
            if (typeof item === 'string') return collectDressCodeColors(item);
            if (item && typeof item === 'object') {
                const record = item as { color?: unknown; value?: unknown; label?: unknown };
                return collectDressCodeColors(record.color || record.value || record.label);
            }
            return [];
        });
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return collectDressCodeColors(parsed);
        } catch {
            // Plain text field: one color per line or comma.
        }

        return trimmed
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

function uniqueDressCodeColors(value: unknown) {
    const seen = new Set<string>();
    return collectDressCodeColors(value).filter((color) => {
        const key = color.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export default function MovieCeremonyLayout(props: Props) {
    const { groomFirstName, groomLastName, brideFirstName, brideLastName, eventDate, location, venueDetails, mapUrl, invitationMessage, groomFatherName, groomMotherName, brideFatherName, brideMotherName, musicUrl, onRsvp, templateConfig, schedule, guestName, guestPhotoUrl, guestAvatarUrl, backgroundVideoUrl, backgroundImageUrl, transitionVideoUrl, introVideoUrl, logoUrl, albumPhotos = [], albumVideos = [] } = props;
    const avatar = guestPhotoUrl || guestAvatarUrl || props.guestPhoto || props.guestAvatar || (props as any).photoUrl || (props as any).avatarUrl || (props as any).photo || (props as any).avatar;

    const bgVideo = props.introVideoUrl || introVideoUrl || props.backgroundVideoUrl || backgroundVideoUrl || templateConfig?.introVideoUrl || templateConfig?.backgroundVideoUrl;
    const bgImg = props.introImageUrl || props.introFrameUrl || backgroundImageUrl || props.backgroundImageUrl;

    const movieTrailerRawUrl = templateConfig?.movieTrailerUrl || props.movieTrailerUrl || props.trailerUrl;
    const movieTrailerLinks = useMemo(() => uniqueVideoLinks(movieTrailerRawUrl), [movieTrailerRawUrl]);
    const embeddedVideoLinks = useMemo(() => uniqueVideoLinks(albumVideos), [albumVideos]);
    const firstTrailerUrl = movieTrailerLinks[0] || '';
    const trailerVideo = getEmbedVideoUrl(firstTrailerUrl);

    const allVideoHighlights = useMemo(() => {
        return embeddedVideoLinks.length > 0 ? embeddedVideoLinks : movieTrailerLinks;
    }, [embeddedVideoLinks, movieTrailerLinks]);
    const trailerEmbedSrc = useMemo(() => {
        if (!['youtube', 'vimeo', 'facebook'].includes(trailerVideo.type)) return trailerVideo.embedUrl;
        if (typeof window === 'undefined') return trailerVideo.embedUrl;
        try {
            const url = new URL(trailerVideo.embedUrl);
            if (trailerVideo.type === 'youtube') {
                url.searchParams.set('origin', window.location.origin);
            }
            return url.toString();
        } catch {
            return trailerVideo.embedUrl;
        }
    }, [trailerVideo.embedUrl, trailerVideo.type]);

    const cs = templateConfig?.colorScheme || {
        primary: '#DC143C', secondary: '#8B0000', accent: '#FFD700',
        background: '#000000', text: '#FFFFFF', textSecondary: 'rgba(255,255,255,0.8)',
        border: 'rgba(220,20,60,0.4)', gradient: 'linear-gradient(45deg, #DC143C, #8B0000, #FFD700)'
    };
    const persona = getInvitationPersona(props);
    const { language, setLanguage } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);
    const dressCodeText = firstNonEmptyText(
        templateConfig?.dressCodeText,
        templateConfig?.dressCode,
        props.dressCodeText,
        props.dressCode
    );
    const dressCodeColors = useMemo(
        () => uniqueDressCodeColors(templateConfig?.dressCodeColors || templateConfig?.dressColors || props.dressCodeColors || props.dressColors),
        [templateConfig, props.dressCodeColors, props.dressColors]
    );
    const hasDressCode = Boolean(dressCodeText || dressCodeColors.length > 0);
    const wishesEventId = String(props.eventId || props.id || props.event_id || props.eventID || props.invitationId || props.invitation_id || '');
    const wishesGuestCode = props.code || props.shortCode;
    const canShowMovieReviews = props.featureLimits?.digitalWishes !== false && Boolean(wishesEventId || wishesGuestCode);
    const { scheduleItems, scheduleGroups } = useMemo(() => {
        const items: any[] = [];
        let groups: { date: string; items: any[] }[] = [];

        try {
            if (!schedule) return { scheduleItems: items, scheduleGroups: groups };
            const parsedSchedule = JSON.parse(schedule);
            if (!Array.isArray(parsedSchedule) || parsedSchedule.length === 0) {
                return { scheduleItems: items, scheduleGroups: groups };
            }

            if (Array.isArray(parsedSchedule[0]?.activities)) {
                groups = parsedSchedule.map((day: any) => {
                    const dayItems = (day.activities || []).map((activity: any) => ({
                        date: day.date,
                        time: activity.time,
                        activity: activity.activity || activity.title,
                        activityEn: activity.activityEn || activity.titleEn || '',
                        title: activity.title,
                        titleEn: activity.titleEn,
                        description: activity.description,
                        descriptionEn: activity.descriptionEn,
                    })).filter((item: any) => item.time || item.activity || item.activityEn || item.title || item.titleEn);
                    items.push(...dayItems);
                    return { date: day.date || '', items: dayItems };
                }).filter((group) => group.items.length > 0);
            } else {
                parsedSchedule
                    .filter((item: any) => item?.time || item?.activity || item?.activityEn || item?.title || item?.titleEn)
                    .forEach((item: any) => items.push(item));

                const grouped = items.reduce((acc: Record<string, any[]>, item: any) => {
                    const key = item.date || '';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(item);
                    return acc;
                }, {});
                groups = Object.entries(grouped).map(([date, groupItems]) => ({ date, items: groupItems }));
            }
        } catch {
            return { scheduleItems: [], scheduleGroups: [] };
        }

        if (items.length > 0 && groups.length === 0) {
            groups = [{ date: '', items }];
        }

        return { scheduleItems: items, scheduleGroups: groups };
    }, [schedule]);

    const [phase, setPhase] = useState<'curtain' | 'title' | 'trailer' | 'details'>(props.previewPage === 'details' ? 'details' : props.previewPage === 'transition' ? 'title' : 'curtain');
    const [posterStep, setPosterStep] = useState<1 | 2 | 3 | 4>(1);
    const [showFlash, setShowFlash] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rsvpSent, setRsvpSent] = useState(false);
    const audioObjRef = useRef<HTMLAudioElement | null>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);
    const trailerFrameRef = useRef<HTMLIFrameElement | null>(null);
    const musicStartedRef = useRef(false);
    const restoreMusicAfterTrailerRef = useRef(false);
    const normalMusicVolumeRef = useRef(1);
    const volumeFadeRef = useRef<number | null>(null);
    const trailerFinishedRef = useRef(false);
    const trailerMusicVolume = 0.18;

    // Create the Audio object once and keep it alive for the component lifetime.
    // This avoids timing issues where the <audio> DOM element isn't mounted yet
    // when the user taps the button on first render.
    useEffect(() => {
        if (!musicUrl) return;
        const audio = new Audio(musicUrl);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = normalMusicVolumeRef.current;
        audioObjRef.current = audio;
        musicStartedRef.current = false;
        setIsPlaying(false);
        return () => {
            if (volumeFadeRef.current) {
                window.clearInterval(volumeFadeRef.current);
                volumeFadeRef.current = null;
            }
            audio.pause();
            audioObjRef.current = null;
        };
    }, [musicUrl]);

    // Call on any user gesture to start music the FIRST time.
    const startMusicOnGesture = () => {
        if (!musicUrl || !audioObjRef.current || musicStartedRef.current) return;
        musicStartedRef.current = true;
        audioObjRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => { musicStartedRef.current = false; });
    };

    const fadeMusicVolume = useCallback((targetVolume: number, duration = 700) => {
        const audio = audioObjRef.current;
        if (!audio) return;

        if (volumeFadeRef.current) {
            window.clearInterval(volumeFadeRef.current);
            volumeFadeRef.current = null;
        }

        const clampedTarget = Math.max(0, Math.min(1, targetVolume));
        const startVolume = audio.volume;
        const steps = Math.max(1, Math.round(duration / 50));
        let currentStep = 0;

        volumeFadeRef.current = window.setInterval(() => {
            currentStep += 1;
            const progress = Math.min(1, currentStep / steps);
            audio.volume = startVolume + ((clampedTarget - startVolume) * progress);

            if (progress >= 1) {
                if (volumeFadeRef.current) {
                    window.clearInterval(volumeFadeRef.current);
                    volumeFadeRef.current = null;
                }
                audio.volume = clampedTarget;
            }
        }, 50);
    }, []);

    const restoreMusicAfterTrailer = useCallback(() => {
        const audio = audioObjRef.current;
        if (!musicUrl || !audio || !restoreMusicAfterTrailerRef.current) {
            restoreMusicAfterTrailerRef.current = false;
            return;
        }

        restoreMusicAfterTrailerRef.current = false;
        audio.play()
            .then(() => {
                setIsPlaying(true);
                fadeMusicVolume(normalMusicVolumeRef.current, 900);
            })
            .catch(() => setIsPlaying(false));
    }, [fadeMusicVolume, musicUrl]);

    const finishTrailer = useCallback(() => {
        if (trailerFinishedRef.current) return;
        trailerFinishedRef.current = true;
        setPhase('details');
        restoreMusicAfterTrailer();
    }, [restoreMusicAfterTrailer]);

    const registerTrailerPlayerEvents = useCallback(() => {
        const frame = trailerFrameRef.current?.contentWindow;
        if (!frame) return;

        if (trailerVideo.type === 'youtube') {
            frame.postMessage(JSON.stringify({ event: 'listening', id: 'movie-trailer' }), '*');
            frame.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }), '*');
        }

        if (trailerVideo.type === 'vimeo') {
            frame.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ended' }), '*');
        }
    }, [trailerVideo.type]);

    useEffect(() => {
        if (phase !== 'trailer') return;

        trailerFinishedRef.current = false;
        const audio = audioObjRef.current;
        restoreMusicAfterTrailerRef.current = Boolean(audio && musicStartedRef.current);
        if (audio) {
            normalMusicVolumeRef.current = Math.max(audio.volume || 1, 0.35);
            if (audio.paused && musicStartedRef.current) {
                audio.play()
                    .then(() => {
                        setIsPlaying(true);
                        fadeMusicVolume(trailerMusicVolume, 650);
                    })
                    .catch(() => setIsPlaying(false));
            } else if (!audio.paused) {
                fadeMusicVolume(trailerMusicVolume, 650);
            }
        }

        const handleTrailerMessage = (event: MessageEvent) => {
            let payload: unknown = event.data;
            if (typeof payload === 'string') {
                try {
                    payload = JSON.parse(payload);
                } catch {
                    return;
                }
            }

            if (!payload || typeof payload !== 'object') return;
            const trailerEvent = payload as { event?: unknown; info?: unknown };
            if (trailerVideo.type === 'youtube' && trailerEvent.event === 'onStateChange' && Number(trailerEvent.info) === 0) {
                finishTrailer();
            }
            if (trailerVideo.type === 'vimeo' && trailerEvent.event === 'ended') {
                finishTrailer();
            }
        };

        window.addEventListener('message', handleTrailerMessage);
        const registerTimer = window.setTimeout(registerTrailerPlayerEvents, 500);

        return () => {
            window.removeEventListener('message', handleTrailerMessage);
            window.clearTimeout(registerTimer);
        };
    }, [fadeMusicVolume, finishTrailer, phase, registerTrailerPlayerEvents, trailerMusicVolume, trailerVideo.type]);

    useEffect(() => {
        if (phase !== 'title') {
            setPosterStep(1);
            return;
        }

        const hasStudioLogo = Boolean(templateConfig?.productionLogoUrl || logoUrl);
        const hasMainSponsors = Array.isArray(templateConfig?.mainSponsorLogos) && templateConfig.mainSponsorLogos.length > 0;
        const hasCooperateSponsors = Array.isArray(templateConfig?.cooperateSponsorLogos) && templateConfig.cooperateSponsorLogos.length > 0;

        let t1: NodeJS.Timeout;
        let t2: NodeJS.Timeout;
        let t3: NodeJS.Timeout;
        let t4: NodeJS.Timeout;

        if (posterStep === 1) {
            if (!hasStudioLogo) {
                setPosterStep(2);
            } else {
                t1 = setTimeout(() => setPosterStep(2), 2400);
            }
        } else if (posterStep === 2) {
            if (!hasMainSponsors) {
                setPosterStep(3);
            } else {
                t2 = setTimeout(() => setPosterStep(3), 2600);
            }
        } else if (posterStep === 3) {
            if (!hasCooperateSponsors) {
                setPosterStep(4);
            } else {
                t3 = setTimeout(() => setPosterStep(4), 2600);
            }
        } else if (posterStep === 4) {
            t4 = setTimeout(() => {
                if (trailerVideo.type !== 'empty') {
                    setPhase('trailer');
                } else {
                    setPhase('details');
                }
            }, 5500);
        }

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [phase, posterStep, templateConfig, logoUrl, trailerVideo.type]);

    useEffect(() => {
        if (!props.previewPage) return;
        setPhase(props.previewPage === 'details' ? 'details' : props.previewPage === 'transition' ? 'title' : 'curtain');
    }, [props.previewPage]);

    const handleTransitionEnd = () => {
        setShowFlash(true);
        setTimeout(() => {
            setPhase('details');
        }, 300);
        setTimeout(() => {
            setShowFlash(false);
        }, 1000);
    };

    const isVideoUrl = (url: string | null | undefined) => {
        if (!url) return false;
        const cleanUrl = url.toLowerCase().split('?')[0];
        if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl)) return false;
        return /\.(mp4|mov|webm|ogg|m4v)/i.test(cleanUrl) || cleanUrl.includes('video') || cleanUrl.includes('/uploads/video/');
    };

    const activeVideoSrc = bgVideo || (bgImg && isVideoUrl(bgImg) ? bgImg : null);
    const activeImgSrc = !activeVideoSrc && bgImg ? bgImg : null;

    const toggleMusic = () => {
        const audio = audioObjRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    const dateStr = eventDate ? new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(eventDate)) : '';
    const yearStr = eventDate ? new Date(eventDate).getFullYear().toString() : '';

    return (
        <main className={`relative min-h-screen overflow-x-hidden ${templateFontVariables}`} style={{ backgroundColor: cs.background, color: cs.text, fontFamily: "'Arial Narrow', 'Arial', sans-serif" }}>
            {/* Film grain overlay */}
            <div className="fixed inset-0 z-[2] pointer-events-none opacity-[0.04]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />
            {/* Spotlight top */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-[1] opacity-10" style={{ background: `radial-gradient(ellipse, ${cs.primary}cc 0%, transparent 70%)` }} />

            {/* Background Image/Video Support */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {activeVideoSrc ? (
                    <video src={activeVideoSrc} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000 z-[-1]" />
                ) : activeImgSrc ? (
                    <img src={activeImgSrc} className="fixed inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000 z-[-1]" alt="background" />
                ) : (
                    // Premium CSS Fallback Background
                    <div className="fixed inset-0 w-full h-full z-[-1]" style={{ background: cs.background }}>
                        {/* Film reel gradient backdrop */}
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `radial-gradient(circle at center, ${cs.secondary}44 0%, transparent 80%)` }} />

                        {/* Dramatic cinematic spotlight */}
                        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[140%] opacity-20 transform -rotate-12 blur-3xl pointer-events-none" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${cs.primary}, transparent)` }} />
                        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[140%] opacity-20 transform rotate-12 blur-3xl pointer-events-none" style={{ backgroundImage: `linear-gradient(90deg, transparent, ${cs.primary}, transparent)` }} />

                        {/* Subtle film scratch overlay */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent 200px, ${cs.text} 200px, ${cs.text} 201px)` }} />
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {phase === 'curtain' && (
                    <motion.div key="curtain" className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 pt-3 pb-3 sm:pb-6 overflow-y-auto" exit={{ opacity: 0 }}>
                        {/* Top Area: Top Header Title */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="w-full flex flex-col items-center text-center space-y-1 pointer-events-none mt-1 sm:mt-2 z-10"
                        >
                            <div className={`space-y-0.5 ${moulpali.className}`}>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-normal tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                    {language === 'kh' ? 'សូមអញ្ជើញ' : 'You Are Cordially Invited'}
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg font-normal tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ color: 'rgb(196 130 73)' }}>
                                    {language === 'kh' ? 'ចូលរួមកម្មវិធីសម្ភោធខ្សែភាពយន្តខ្មែរ' : (persona.isBirthday ? labels.eventTitle : 'To The Premiere Event')}
                                </p>
                            </div>
                        </motion.div>

                        {/* Middle Area: Guest Avatar, Guest Name & Single-Row Event Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-2.5 max-w-[320px] sm:max-w-sm md:max-w-md w-full flex flex-col items-center text-center my-auto pt-2 sm:pt-6 md:pt-10 pb-2 z-10"
                        >
                            {/* Guest Photo */}
                            {avatar && (
                                <motion.div
                                    initial={{ scale: 0.85, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="flex justify-center"
                                >
                                    <div
                                        className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden p-1 shadow-[0_0_30px_rgba(255,255,255,0.25)] border-2 border-white/40"
                                        style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(200,200,200,0.3), rgba(255,255,255,0.8))` }}
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900 relative">
                                            <img
                                                src={avatar}
                                                alt={guestName || 'Guest photo'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Guest Name Pill Container (Smaller Font & Compact Padding) */}
                            <div className="w-full max-w-[240px] sm:max-w-[260px] py-1.5 px-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 shadow-lg text-center">
                                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-wider uppercase text-white truncate">
                                    {guestName || (language === 'kh' ? "ភ្ញៀវកិត្តិយស" : "Distinguished Guest")}
                                </h1>
                            </div>

                            {/* Single-Row Date & Time and Location Info */}
                            <div className={`space-y-0.5 pt-0.5 text-center w-full px-1 ${moulpali.className}`}>
                                {eventDate && (
                                    <p className="text-[11px] sm:text-xs md:text-sm font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" style={{ color: 'rgb(196 130 73)' }}>
                                        {language === 'kh'
                                            ? `${toKhmerDate(new Date(eventDate))} ${toKhmerTime(new Date(eventDate))}`
                                            : `${dateStr} at ${new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                    </p>
                                )}
                                {(location || venueDetails) && (
                                    <p className="text-[10px] sm:text-xs md:text-sm font-normal tracking-tight text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] truncate max-w-full">
                                        {location}{venueDetails ? ` (${venueDetails})` : ''}
                                    </p>
                                )}
                            </div>
                        </motion.div>

                        {/* Bottom Area: Open Invitation Button with Golden Grandeur Guiding Pointer Indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full flex justify-center pb-3 sm:pb-6 md:pb-8 z-20 mt-auto"
                        >
                            {(() => {
                                const buttonImg = props.buttonImageUrl || templateConfig?.buttonImageUrl || props.openButtonUrl || templateConfig?.openButtonUrl || templateConfig?.customOpenButtonUrl || props.customOpenButtonUrl;
                                const buttonText = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
                                const templateFonts = getTemplateFontFamilies(templateConfig);
                                const buttonFontFamily = language === 'kh' ? templateFonts.khmerButton : templateFonts.button;

                                return (
                                    <div className="relative inline-flex items-center justify-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => { startMusicOnGesture(); setPhase('title'); }}
                                            className="relative group cursor-pointer transition-transform duration-300"
                                        >
                                            {buttonImg ? (
                                                buttonImg.includes('/assets/buttons/royal-') ? (
                                                    <PredefinedButton
                                                        type={parseInt(buttonImg.split('royal-')[1]?.split('.svg')[0] || '1')}
                                                        colorScheme={cs}
                                                        text={templateConfig?.showButtonText !== false ? buttonText : ''}
                                                        openButtonTextColor={templateConfig?.openButtonTextColor}
                                                        fontFamily={buttonFontFamily}
                                                    />
                                                ) : (
                                                    <div className="relative inline-block mt-2">
                                                        <img
                                                            src={buttonImg}
                                                            alt="Open Button"
                                                            className="h-14 md:h-16 object-contain drop-shadow-xl"
                                                        />
                                                        {templateConfig?.showButtonText !== false && (
                                                            <span
                                                                className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold tracking-wider uppercase text-yellow-100 drop-shadow-md px-4 pointer-events-none"
                                                                style={{
                                                                    color: templateConfig?.openButtonTextColor || '#FFDF73',
                                                                    fontFamily: buttonFontFamily
                                                                }}
                                                            >
                                                                {buttonText}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            ) : (
                                                <div className="relative w-56 md:w-64 h-12 md:h-14 flex items-center justify-center">
                                                    <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M20 5 L220 5 L235 30 L220 55 L20 55 L5 30 Z" fill="#2A1B0E" fillOpacity="0.9" stroke="url(#goldGrad)" strokeWidth="3"/>
                                                        <path d="M24 9 L216 9 L227 30 L216 51 L24 51 L13 30 Z" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7"/>
                                                        <defs>
                                                            <linearGradient id="goldGrad" x1="0" y1="0" x2="240" y2="60">
                                                                <stop stopColor="#FFD700"/>
                                                                <stop offset="0.5" stopColor="#FFA500"/>
                                                                <stop offset="1" stopColor="#FFD700"/>
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <span
                                                        className="relative z-10 text-xs md:text-sm font-bold tracking-widest uppercase text-[#FFDF73] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-4"
                                                        style={{ fontFamily: buttonFontFamily }}
                                                    >
                                                        {buttonText}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Guiding Click Pulsing Pointer Indicator matching Golden Grandeur */}
                                            <div className="pointer-events-none absolute right-1 top-1/2 z-20 -translate-y-1/2 scale-[0.68]">
                                                <OpenInvitationHint
                                                    label={buttonText}
                                                    color={cs.primary}
                                                    textColor={cs.text}
                                                    borderColor={cs.border}
                                                    background="rgba(7,10,22,0.48)"
                                                    iconOnly
                                                />
                                            </div>
                                        </motion.button>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}

                {phase === 'title' && (
                    <motion.div
                        key="title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-between text-center bg-black px-4 py-6 sm:py-8 overflow-y-auto"
                    >
                        {/* Background Video/Image (Looping continuously for title phase) */}
                        {transitionVideoUrl ? (
                            <div className="absolute inset-0 w-full h-full pointer-events-none">
                                {isVideoUrl(transitionVideoUrl) ? (
                                    <video
                                        ref={transitionVideoRef}
                                        src={transitionVideoUrl}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover opacity-50"
                                    />
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0"
                                    >
                                        <img src={transitionVideoUrl} className="w-full h-full object-cover opacity-50" alt="transition" />
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-[#050505] pointer-events-none"
                            />
                        )}

                        {/* Top Action Bar */}
                        <div className="absolute right-5 top-5 z-[80] flex items-center gap-3">
                            <button
                                onClick={() => { startMusicOnGesture(); setPhase('details'); }}
                                className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md cursor-pointer hover:bg-white/20 transition-all"
                                style={{ border: `1px solid ${cs.border}`, backgroundColor: 'rgba(0,0,0,0.72)', color: cs.text }}
                            >
                                {language === 'kh' ? 'រំលង' : 'Skip'}
                            </button>
                        </div>

                        {/* Main Movie Poster Step Content */}
                        <div className="relative z-50 flex flex-col items-center justify-center w-full max-w-4xl my-auto px-4 py-8 min-h-[65vh]">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: Production Studio Logo */}
                                {posterStep === 1 && (templateConfig?.productionLogoUrl || logoUrl) && (
                                    <motion.div
                                        key="step-studio"
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.8 }}
                                        className="flex flex-col items-center justify-center space-y-4"
                                    >
                                        <p className={`text-xs sm:text-sm font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                            {language === 'kh' ? 'ផលិតកម្ម' : 'A PRODUCTION BY'}
                                        </p>
                                        <img
                                            src={templateConfig?.productionLogoUrl || logoUrl}
                                            alt="Production Studio Logo"
                                            className="h-36 sm:h-52 md:h-64 max-h-[45vh] w-auto max-w-[90vw] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.7)]"
                                        />
                                    </motion.div>
                                )}

                                {/* STEP 2: Main Sponsors (PRESENTED BY) */}
                                {posterStep === 2 && Array.isArray(templateConfig?.mainSponsorLogos) && templateConfig.mainSponsorLogos.length > 0 && (
                                    <motion.div
                                        key="step-main-sponsors"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ duration: 0.8 }}
                                        className="flex flex-col items-center justify-center space-y-6 w-full"
                                    >
                                        <p className={`text-sm sm:text-base md:text-lg font-extrabold drop-shadow-md ${moulpali.className}`} style={{ color: cs.primary }}>
                                            {language === 'kh' ? 'នាំមកជូនជាពិសេសដោយ' : 'PRESENTED BY'}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl">
                                            {templateConfig.mainSponsorLogos.map((logo: any, idx: number) => {
                                                const url = typeof logo === 'string' ? logo : logo?.logoUrl;
                                                const name = typeof logo === 'object' ? logo?.name : '';
                                                if (!url) return null;
                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.15, duration: 0.5 }}
                                                        className="flex items-center justify-center p-4 sm:p-6 bg-black/70 rounded-3xl border border-white/25 backdrop-blur-md shadow-2xl"
                                                    >
                                                        <img src={url} alt={name || `Main Sponsor ${idx + 1}`} className="h-20 sm:h-28 md:h-36 max-h-[35vh] w-auto max-w-[80vw] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]" />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: Cooperate Sponsors (CO-SPONSORED BY) IN ONE SINGLE ROW */}
                                {posterStep === 3 && Array.isArray(templateConfig?.cooperateSponsorLogos) && templateConfig.cooperateSponsorLogos.length > 0 && (
                                    <motion.div
                                        key="step-cooperate-sponsors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.8 }}
                                        className="flex flex-col items-center justify-center space-y-5 w-full"
                                    >
                                        <p className={`text-xs sm:text-sm md:text-base font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                            {language === 'kh' ? 'សហការណ៍ឧបត្ថមដោយ' : 'CO-SPONSORED BY'}
                                        </p>
                                        {/* Single Row Layout */}
                                        <div className="flex flex-nowrap items-center justify-center gap-5 sm:gap-8 overflow-x-auto max-w-full px-8 py-6 bg-black/70 rounded-3xl border border-white/20 backdrop-blur-md shadow-2xl">
                                            {templateConfig.cooperateSponsorLogos.map((logo: any, idx: number) => {
                                                const url = typeof logo === 'string' ? logo : logo?.logoUrl;
                                                const name = typeof logo === 'object' ? logo?.name : '';
                                                if (!url) return null;
                                                return (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.12, duration: 0.4 }}
                                                        className="shrink-0 flex items-center justify-center p-3 sm:p-4 bg-black/60 rounded-2xl border border-white/10"
                                                    >
                                                        <img src={url} alt={name || `Cooperate Sponsor ${idx + 1}`} className="h-16 sm:h-22 md:h-28 max-h-[25vh] w-auto object-contain filter drop-shadow-xl" />
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: Movie Title, Director & Billing Credits Group by Group */}
                                {posterStep === 4 && (
                                    <motion.div
                                        key="step-credits"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.8 }}
                                        className="flex flex-col items-center justify-center space-y-6 w-full"
                                    >
                                        {/* Movie Title */}
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className={`text-xs sm:text-sm font-bold text-amber-300/90 drop-shadow ${moulpali.className}`}>
                                                <TypewriterText text={language === 'kh' ? 'សម្ភោធខ្សែភាពយន្ត' : 'NOW PREMIERING'} delay={0.2} />
                                            </div>
                                            <h1 className={`text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight drop-shadow-[0_0_40px_rgba(255,215,0,0.6)] ${moulpali.className}`} style={{ color: cs.text }}>
                                                {templateConfig?.movieTitle || props.title || persona.coupleLine || (language === 'kh' ? 'ខ្សែភាពយន្តខ្មែរ' : 'THE PREMIERE MOVIE')}
                                            </h1>
                                            {(templateConfig?.directorName || templateConfig?.directorNameEn) && (
                                                <p className="text-sm sm:text-base font-extrabold drop-shadow-md pt-1" style={{ color: cs.primary }}>
                                                    {language === 'kh' ? `ដឹកនាំរឿងដោយ៖ ${templateConfig.directorName || templateConfig.directorNameEn}` : `DIRECTED BY ${templateConfig.directorNameEn || templateConfig.directorName}`}
                                                </p>
                                            )}
                                        </div>



                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Phase: Trailer Player Modal */}
                {phase === 'trailer' && (
                    <motion.div
                        key="trailer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black p-2 sm:p-6"
                    >
                        {/* Top-Left Language Switcher */}
                        <div className="fixed top-4 left-4 z-[99999]">
                            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 p-1 shadow-xl backdrop-blur-md">
                                <button
                                    type="button"
                                    onClick={() => setLanguage('kh')}
                                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                        language === 'kh'
                                            ? 'bg-white text-black shadow-md'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    KH
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLanguage('en')}
                                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                                        language === 'en'
                                            ? 'bg-white text-black shadow-md'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>

                        {/* Top-Right Soft Glass Skip Button */}
                        <div className="fixed top-4 right-4 z-[99999]">
	                            <button
	                                type="button"
	                                onClick={() => { startMusicOnGesture(); finishTrailer(); }}
	                                className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold tracking-wide text-white bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
	                            >
                                <span>{language === 'kh' ? 'រំលងទៅទំព័របន្ទាប់' : 'Skip to Next Page'}</span>
                            </button>
                        </div>

                        {/* Video Player Frame */}
                        <div className="relative w-full max-w-5xl aspect-video my-auto rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.3)] border border-white/20 bg-zinc-950 flex items-center justify-center">
	                            {trailerVideo.type === 'youtube' || trailerVideo.type === 'vimeo' || trailerVideo.type === 'facebook' ? (
	                                <iframe
                                        ref={trailerFrameRef}
	                                    src={trailerEmbedSrc}
                                        title="Movie trailer"
	                                    className="w-full h-full border-0"
	                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	                                    allowFullScreen
                                        onLoad={registerTrailerPlayerEvents}
	                                />
	                            ) : trailerVideo.type === 'mp4' ? (
	                                <video
                                    src={trailerVideo.embedUrl}
	                                    autoPlay
	                                    controls
	                                    playsInline
	                                    onEnded={finishTrailer}
	                                    className="w-full h-full object-contain"
	                                />
                            ) : (
                                <div className="text-gray-400 text-sm italic">
                                    {language === 'kh' ? 'មិនទាន់មានវីដេអូឈុតខ្លី' : 'No trailer video available.'}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {phase === 'details' && (
                    <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">

                        {/* SECTION 1: Top Hero & Event Invitation Info */}
                        <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center max-w-3xl mx-auto">
                            {/* Studio Logo */}
                            {(templateConfig?.productionLogoUrl || logoUrl) && (
                                <motion.img
                                    initial={{ opacity: 0, y: -20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.7 }}
                                    src={templateConfig?.productionLogoUrl || logoUrl}
                                    alt="Production Logo"
                                    className="h-20 sm:h-28 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                                />
                            )}
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className={`text-xs sm:text-sm uppercase font-bold ${moulpali.className}`}
                                style={{ color: cs.primary }}
                            >
                                {language === 'kh' ? 'សូមអញ្ជើញចូលរួមកម្មវិធីសម្ភោធខ្សែភាពយន្ត' : 'YOU ARE CORDIALLY INVITED TO THE GRAND PREMIERE'}
                            </motion.p>

                            {/* Movie Title & Director */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: 0.15 }}
                                className="flex flex-col items-center space-y-3 py-4 border-y border-white/15 w-full"
                            >
                                <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight drop-shadow-[0_0_40px_rgba(255,215,0,0.6)] ${moulpali.className}`} style={{ color: cs.text }}>
                                    {templateConfig?.movieTitle || props.title || persona.coupleLine || (language === 'kh' ? 'ខ្សែភាពយន្តខ្មែរ' : 'THE PREMIERE MOVIE')}
                                </h1>
                                {(templateConfig?.directorName || templateConfig?.directorNameEn) && (
                                    <p className="text-sm sm:text-base font-extrabold drop-shadow-md" style={{ color: cs.primary }}>
                                        {language === 'kh' ? `ដឹកនាំរឿងដោយ៖ ${templateConfig.directorName || templateConfig.directorNameEn}` : `DIRECTED BY ${templateConfig.directorNameEn || templateConfig.directorName}`}
                                    </p>
                                )}
                            </motion.div>

                            {/* Invitation Message */}
                            {invitationMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.7, delay: 0.2 }}
                                    className="max-w-xl mx-auto px-4 py-4 bg-black/50 rounded-2xl border border-white/10 backdrop-blur-md"
                                >
                                    <p className="text-sm sm:text-base font-light leading-relaxed text-white/90">{invitationMessage}</p>
                                </motion.div>
                            )}

                            {/* Unified Event Info Card (Date, Time, Location) */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: 0.25 }}
                                className="p-4 sm:p-5 bg-black/70 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl text-center space-y-3 w-full max-w-xl"
                            >
                                {/* DATE */}
                                <div className="flex flex-col items-center space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">📅 {language === 'kh' ? 'កាលបរិច្ឆេទ' : 'DATE'}</span>
                                    <p className={`text-xs sm:text-sm font-bold text-white leading-snug ${moulpali.className}`}>
                                        {eventDate ? (language === 'kh' ? toKhmerDate(new Date(eventDate)) : dateStr) : (language === 'kh' ? 'ថ្ងៃព្រហស្បតិ៍ ទី២៨ ខែមករា' : '28 January 2026')}
                                    </p>
                                </div>

                                <div className="h-px w-full bg-white/10" />

                                {/* TIME */}
                                <div className="flex flex-col items-center space-y-0.5">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">⏰ {language === 'kh' ? 'ពេលវេលា' : 'TIME'}</span>
                                    <p className={`text-xs sm:text-sm font-bold text-white leading-snug ${moulpali.className}`}>
                                        {eventDate ? (language === 'kh' ? toKhmerTime(new Date(eventDate)) : new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : '05:00 PM Onwards'}
                                    </p>
                                </div>

                                <div className="h-px w-full bg-white/10" />

                                {/* VENUE */}
                                <div className="flex flex-col items-center space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">📍 {language === 'kh' ? 'ទីតាំងរៀបចំកម្មវិធី' : 'VENUE LOCATION'}</span>
                                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                                        {venueDetails || location || 'Chip Mong 271 Mega Mall (Legend Cinema)'}
                                    </p>
	                                    {mapUrl && (
	                                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition-all">
	                                            📍 {language === 'kh' ? 'មើលទីតាំងលើផែនទី' : 'View Location Map'}
	                                        </a>
	                                    )}
	                                </div>

                                    {hasDressCode && (
                                        <>
                                            <div className="h-px w-full bg-white/10" />

                                            <div className="flex flex-col items-center space-y-2">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
                                                    {language === 'kh' ? 'សម្លៀកបំពាក់' : 'DRESS CODE'}
                                                </span>
                                                {dressCodeText && (
                                                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                                                        {dressCodeText}
                                                    </p>
                                                )}
                                                {dressCodeColors.length > 0 && (
                                                    <div className="flex flex-wrap justify-center gap-2 pt-1">
                                                        {dressCodeColors.map((color, index) => (
                                                            <span
                                                                key={`${color}-${index}`}
                                                                className="h-8 w-8 rounded-full border border-white/40 shadow-[0_0_14px_rgba(255,255,255,0.18)]"
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </section>

                        {/* SECTION 2: Event Schedule */}
                        {scheduleItems.length > 0 && (
                            <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center max-w-xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full p-5 sm:p-6 bg-black/70 rounded-2xl border border-white/15 backdrop-blur-md shadow-xl text-left space-y-5"
                                >
                                    <div className="text-center space-y-2">
                                        <h3 className={`text-base sm:text-lg uppercase font-bold tracking-wider ${moulpali.className}`} style={{ color: cs.primary }}>
                                            {language === 'kh' ? 'កម្មវិធី' : 'EVENT SCHEDULE'}
                                        </h3>
                                        <div className="h-px w-20 mx-auto" style={{ background: cs.gradient }} />
                                    </div>

                                    <div className="space-y-6">
                                        {scheduleGroups.map((group, groupIndex) => (
                                            <div key={`${group.date || 'schedule'}-${groupIndex}`} className="space-y-4">
                                                {group.date && (
                                                    <p className={`text-center text-xs sm:text-sm font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                                        {(() => {
                                                            const parsed = new Date(group.date);
                                                            if (Number.isNaN(parsed.getTime())) return group.date;
                                                            return language === 'kh'
                                                                ? toKhmerDate(parsed)
                                                                : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed);
                                                        })()}
                                                    </p>
                                                )}

                                                <div className="space-y-3.5">
                                                    {group.items.map((item: any, index: number) => {
                                                        const title = language === 'kh'
                                                            ? (item.activity || item.title || item.activityEn || item.titleEn)
                                                            : (item.activityEn || item.titleEn || item.activity || item.title);
                                                        const description = language === 'kh'
                                                            ? (item.description || item.descriptionEn)
                                                            : (item.descriptionEn || item.description);

                                                        return (
                                                            <div key={`${group.date || 'item'}-${index}-${item.time || ''}`} className="grid grid-cols-[4.5rem_1rem_1fr] gap-3 items-start">
                                                                <p className="text-right text-[11px] sm:text-xs font-bold pt-0.5" style={{ color: cs.primary }}>
                                                                    {item.time || '--'}
                                                                </p>
                                                                <div className="relative flex justify-center pt-1">
                                                                    <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.75)]" style={{ backgroundColor: cs.primary }} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                                                                        {title}
                                                                    </p>
                                                                    {description && (
                                                                        <p className="mt-0.5 text-[10px] sm:text-xs text-white/55 leading-snug">
                                                                            {description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </section>
                        )}

                        {/* SECTION 3: Sponsors & Cast/Crew Billing Credits */}
                        <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 space-y-6 text-center max-w-3xl mx-auto">
                            {/* Sponsors Showcase */}
                            {((Array.isArray(templateConfig?.mainSponsorLogos) && templateConfig.mainSponsorLogos.length > 0) || (Array.isArray(templateConfig?.cooperateSponsorLogos) && templateConfig.cooperateSponsorLogos.length > 0)) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, amount: 0.15 }}
                                    transition={{ duration: 0.8 }}
                                    className="space-y-6 w-full"
                                >
                                    {Array.isArray(templateConfig?.mainSponsorLogos) && templateConfig.mainSponsorLogos.length > 0 && (
                                        <div className="space-y-3">
                                            <p className={`text-xs sm:text-sm uppercase font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                                {language === 'kh' ? 'នាំមកជូនជាពិសេសដោយ' : 'PRESENTED BY'}
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-6">
                                                {templateConfig.mainSponsorLogos.map((logo: any, idx: number) => {
                                                    const url = typeof logo === 'string' ? logo : logo?.logoUrl;
                                                    if (!url) return null;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: false, amount: 0.2 }}
                                                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                            className="p-3 bg-black/60 rounded-2xl border border-white/20 shadow-lg"
                                                        >
                                                            <img src={url} alt="Main sponsor" className="h-12 sm:h-16 object-contain" />
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {Array.isArray(templateConfig?.cooperateSponsorLogos) && templateConfig.cooperateSponsorLogos.length > 0 && (
                                        <div className="space-y-3 pt-3">
                                            <p className={`text-xs uppercase font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                                {language === 'kh' ? 'សហការណ៍ឧបត្ថមដោយ' : 'CO-SPONSORED BY'}
                                            </p>
                                            <div className="flex flex-wrap items-center justify-center gap-4">
                                                {templateConfig.cooperateSponsorLogos.map((logo: any, idx: number) => {
                                                    const url = typeof logo === 'string' ? logo : logo?.logoUrl;
                                                    if (!url) return null;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: false, amount: 0.2 }}
                                                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                                                            className="p-2.5 bg-black/50 rounded-xl border border-white/10 shadow-md"
                                                        >
                                                            <img src={url} alt="Cooperate sponsor" className="h-10 sm:h-12 object-contain" />
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Billing Credits Block */}
                            {Array.isArray(templateConfig?.movieCredits) && templateConfig.movieCredits.some((c: any) => c.name || c.nameEn) && (() => {
                                const allCredits = templateConfig.movieCredits.filter((c: any) => c.name || c.nameEn);
                                const producerIdx = allCredits.findIndex((c: any) => /producer/i.test(c.role || ''));
                                const producer = producerIdx >= 0 ? allCredits[producerIdx] : allCredits[0];
                                const restCredits = allCredits.filter((_: any, i: number) => i !== (producerIdx >= 0 ? producerIdx : 0));
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: false, amount: 0.15 }}
                                        transition={{ duration: 0.85, delay: 0.2 }}
                                        className="w-full pt-2"
                                    >
                                        <h3 className={`text-xs sm:text-sm uppercase font-bold mb-3 ${moulpali.className}`} style={{ color: cs.primary }}>
                                            {language === 'kh' ? 'ក្រុមការងារផលិត និងសម្ដែង' : 'CAST & CREW BILLING CREDITS'}
                                        </h3>
                                        <div className="p-4 sm:p-5 rounded-2xl bg-black/65 border border-white/15 backdrop-blur-md shadow-xl space-y-4">
                                            <div className="flex flex-col items-center text-center border-b border-white/10 pb-3">
                                                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold mb-0.5" style={{ color: cs.primary }}>
                                                    {producer.role || 'Producer'}
                                                </span>
                                                <span className="text-sm sm:text-base font-extrabold text-white">
                                                    {language === 'kh' ? (producer.name || producer.nameEn) : (producer.nameEn || producer.name)}
                                                </span>
                                            </div>
                                            {restCredits.length > 0 && (
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-center">
                                                    {restCredits.map((credit: any, idx: number) => {
                                                        const nameText = language === 'kh' ? (credit.name || credit.nameEn) : (credit.nameEn || credit.name);
                                                        if (!nameText) return null;
                                                        return (
                                                            <div key={idx} className="flex flex-col items-center">
                                                                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold mb-0.5" style={{ color: cs.primary }}>
                                                                    {credit.role || 'Credit'}
                                                                </span>
                                                                <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                                                                    {nameText}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </section>

                        {/* SECTION 3: Full Screen Movie Summary (Typewriter Script Animation & Typing Sound & Skip) */}
                        {templateConfig?.movieSummary && (
                            <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 text-center max-w-3xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: false, amount: 0.2 }}
                                    transition={{ duration: 0.8 }}
                                    className="w-full"
                                >
                                    <MovieSummarySection
                                        summary={templateConfig.movieSummary}
                                        language={language}
                                        colorScheme={cs}
                                        moulFontClass={moulpali.className}
                                    />
                                </motion.div>
                            </section>
                        )}

                        {/* SECTION 4: Video Highlight & Photo Gallery (Prominent Large Layout) */}
                        <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 text-center max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.1 }}
                                transition={{ duration: 0.8 }}
                                className="w-full"
                            >
                                <GalleryAlbum photos={albumPhotos} videos={allVideoHighlights} colorScheme={cs} />
                            </motion.div>
                        </section>

                        {/* SECTION 5: RSVP Section Alone */}
                        <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 text-center max-w-2xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6 w-full p-8 bg-black/75 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl"
                            >
                                <h3 className={`text-base sm:text-lg uppercase font-bold ${moulpali.className}`} style={{ color: cs.primary }}>
                                    {language === 'kh' ? 'ឆ្លើយតបការអញ្ជើញ (RSVP)' : 'CONFIRM YOUR ATTENDANCE'}
                                </h3>
                                {!rsvpSent ? (
                                    <div className="flex gap-4 justify-center pt-2">
                                        <button onClick={async () => { await onRsvp?.('ACCEPTED'); setRsvpSent(true); }} className="px-8 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-widest rounded-full shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: cs.primary, color: '#fff' }}>
                                            {language === 'kh' ? 'ចូលរួម' : 'Accept'}
                                        </button>
                                        <button onClick={async () => { await onRsvp?.('DECLINED'); setRsvpSent(true); }} className="px-8 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-widest rounded-full transition-transform hover:scale-105" style={{ border: `1px solid ${cs.border}`, color: cs.textSecondary }}>
                                            {language === 'kh' ? 'មិនអាចចូលរួម' : 'Decline'}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm uppercase tracking-widest font-bold" style={{ color: cs.accent }}>
                                        {language === 'kh' ? 'សូមអរគុណ! ចម្លើយរបស់អ្នកត្រូវបានកត់ត្រា ✓' : 'Thank You! Response Recorded ✓'}
                                    </p>
                                )}
                            </motion.div>
	                        </section>

                            {canShowMovieReviews && (
                                <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 text-center max-w-2xl mx-auto">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: false, amount: 0.2 }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full"
                                    >
                                        <DigitalWishesSection
                                            eventId={wishesEventId}
                                            enabled={canShowMovieReviews}
                                            guestCode={wishesGuestCode}
                                            guestName={guestName}
                                            colorScheme={cs}
                                            language={language}
                                            variant="reviews"
                                            cardClassName="bg-black/75 rounded-3xl border-white/20 backdrop-blur-xl"
                                            backgroundOverride="rgba(0,0,0,0.75)"
                                            fieldBackgroundOverride="rgba(255,255,255,0.04)"
                                        />
                                    </motion.div>
                                </section>
                            )}

	                        {/* SECTION 6: Countdown & Footer */}
	                        <section className="min-h-screen w-full snap-start snap-always flex flex-col items-center justify-center py-12 px-4 space-y-8 text-center max-w-3xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.2 }}
                                transition={{ duration: 0.8 }}
                                className="w-full space-y-8"
                            >
                                <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={cs} />
                                <AppFooter colorScheme={cs} />
                            </motion.div>
                        </section>

                    </motion.div>
                )}

            </AnimatePresence>

            {musicUrl && (
                <button onClick={toggleMusic} className="fixed bottom-6 right-6 z-50 p-3" style={{ backgroundColor: `${cs.primary}22`, border: `1px solid ${cs.primary}`, color: cs.primary }}>
                    {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            )}
            {/* No <audio> tag needed — audio is managed imperatively via audioObjRef */}


            {/* MOVIE FLASH TRANSITION (PROJECTOR LIGHT) */}
            <AnimatePresence>
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circIn" }}
                        className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-white"
                    >
                        {/* Central Lens Flare / Brightest Spot */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute w-full h-full"
                            style={{ background: 'radial-gradient(circle, #FFF 0%, #FFF 20%, #EEE 40%, transparent 80%)' }}
                        />

                        {/* Horizontal anamorphic flare */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 0.6 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="absolute w-full h-1 bg-white shadow-[0_0_20px_white]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
