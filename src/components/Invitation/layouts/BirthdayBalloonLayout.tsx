'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, Volume2, VolumeX } from 'lucide-react';
import { getInvitationPersona, getLocalizedInvitationLabels } from '@/lib/invitation-persona';
import { useLanguage } from '@/context/LanguageContext';
import { toKhmerNumber, toKhmerTime } from '@/lib/khmer-utils';
import { calculateAge } from '@/lib/birthday-utils';
import GalleryAlbum from '../components/GalleryAlbum';
import DigitalWishesSection from '../components/DigitalWishesSection';
import AppFooter from '../AppFooter';
import InvitationCountdownSection from '../InvitationCountdownSection';
import ScrollUpGuide from '../ScrollUpGuide';
import OpenInvitationHint from '../OpenInvitationHint';
import { getTemplateFontFamilies, templateFontVariables } from '@/lib/template-fonts';

const defaultColorScheme = {
    primary: '#F4C542',
    secondary: '#1D3E8A',
    accent: '#FFFFFF',
    background: '#10285F',
    text: '#F8FAFF',
    textSecondary: 'rgba(248,250,255,0.78)',
    border: 'rgba(244,197,66,0.42)',
    gradient: 'linear-gradient(135deg, #ffe39c 0%, #f4c542 40%, #c99017 100%)',
};

const safeKhmerLabelFont = 'var(--font-template-kantumruy), "Kantumruy Pro", "Battambang", "Hanuman", sans-serif';

interface Props {
    guestName?: string;
    eventTitle?: string;
    eventDate?: Date;
    birthDate?: Date | string | null;
    location?: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    invitationMessage?: string | null;
    venueDetails?: string | null;
    mapUrl?: string | null;
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
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    celebrantTitle?: string | null;
    celebrantKhmerTitle?: string | null;
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

function BalloonBurst({ active, colors }: { active: boolean; colors: string[] }) {
    const balloons = useMemo(
        () => Array.from({ length: 18 }, (_, index) => ({
            id: index,
            left: 8 + Math.random() * 84,
            drift: -40 + Math.random() * 80,
            duration: 1.6 + Math.random() * 0.9,
            delay: Math.random() * 0.28,
            size: 28 + Math.random() * 34,
            color: colors[index % colors.length] || '#F4C542',
        })),
        [colors]
    );

    return (
        <AnimatePresence>
            {active && (
                <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
                    {balloons.map((balloon) => (
                        <motion.div
                            key={balloon.id}
                            initial={{ y: '105%', x: 0, opacity: 0, scale: 0.85 }}
                            animate={{ y: '-25%', x: balloon.drift, opacity: [0, 1, 1, 0], scale: [0.85, 1, 1.02, 0.94] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: balloon.duration, delay: balloon.delay, ease: 'easeOut' }}
                            className="absolute bottom-0"
                            style={{ left: `${balloon.left}%` }}
                        >
                            <div
                                className="relative rounded-[48%_48%_44%_44%/55%_55%_38%_38%] shadow-[0_18px_34px_rgba(0,0,0,0.24)]"
                                style={{
                                    width: balloon.size,
                                    height: balloon.size * 1.2,
                                    background: `radial-gradient(circle at 30% 24%, rgba(255,255,255,0.98), rgba(255,255,255,0.55) 16%, ${balloon.color} 68%)`,
                                }}
                            >
                                <div className="absolute left-[22%] top-[18%] h-4 w-2 rounded-full bg-white/45 blur-[1px]" />
                            </div>
                            <div className="mx-auto h-10 w-px bg-white/35" />
                        </motion.div>
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
}

function Confetti() {
    return (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {Array.from({ length: 18 }).map((_, index) => (
                <motion.span
                    key={index}
                    className="absolute block rounded-full opacity-80"
                    style={{
                        top: `${6 + (index % 6) * 9}%`,
                        left: `${4 + (index * 5) % 88}%`,
                        width: index % 2 === 0 ? 3 : 6,
                        height: index % 2 === 0 ? 10 : 3,
                        background: index % 3 === 0 ? '#F4C542' : index % 3 === 1 ? '#FFFFFF' : 'rgba(96,165,250,0.5)',
                        transform: `rotate(${index * 23}deg)`,
                    }}
                    animate={{
                        y: [0, index % 2 === 0 ? -12 : 12, 0],
                        rotate: [index * 23, index * 23 + 14, index * 23],
                        opacity: [0.45, 0.9, 0.45],
                    }}
                    transition={{
                        duration: 4.2 + (index % 5) * 0.35,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.08,
                    }}
                />
            ))}
        </div>
    );
}

function GoldenBokeh() {
    return (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div
                className="absolute inset-x-[-12%] top-[-6%] h-[32%]"
                style={{
                    background:
                        'radial-gradient(circle at 20% 10%, rgba(255,244,204,0.95) 0%, rgba(255,214,102,0.82) 16%, rgba(255,214,102,0.12) 38%, transparent 64%), radial-gradient(circle at 48% 0%, rgba(255,220,120,0.78) 0%, rgba(255,220,120,0.08) 34%, transparent 58%), radial-gradient(circle at 78% 12%, rgba(255,244,214,0.84) 0%, rgba(255,211,92,0.12) 30%, transparent 55%)',
                    filter: 'blur(6px)',
                }}
            />
            {Array.from({ length: 35 }).map((_, index) => {
                const size = 2 + (index % 5) * 2.2;
                const left = `${(index * 9) % 100}%`;
                const top = `${-6 + (index % 8) * 6}%`;
                return (
                    <motion.div
                        key={index}
                        className="absolute rounded-full"
                        style={{
                            left,
                            top,
                            width: size,
                            height: size,
                            background:
                                index % 4 === 0
                                    ? 'rgba(255,250,235,0.95)'
                                    : index % 4 === 1
                                      ? 'rgba(255,217,102,0.92)'
                                      : index % 4 === 2
                                        ? 'rgba(209,158,63,0.88)'
                                        : 'rgba(255,233,163,0.9)',
                            boxShadow: '0 0 16px rgba(244,197,66,0.5)',
                        }}
                        animate={{
                            y: ['0%', `${94 + (index % 3) * 8}%`],
                            x: [0, index % 2 === 0 ? 8 : -8, 0],
                            opacity: [0, 0.95, 0.55, 0],
                            scale: [0.9, 1.15, 0.92],
                        }}
                        transition={{
                            duration: 2.6 + (index % 5) * 0.32,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: index * 0.06,
                        }}
                    />
                );
            })}
        </div>
    );
}

function PremiumGlowAura({ colorScheme }: { colorScheme: typeof defaultColorScheme }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div
                className="absolute left-[-12%] top-[-10%] h-[38%] w-[60%] rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${colorScheme.primary}42 0%, transparent 72%)` }}
            />
            <div
                className="absolute right-[-16%] top-[18%] h-[34%] w-[56%] rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${colorScheme.accent}18 0%, transparent 72%)` }}
            />
            <div
                className="absolute bottom-[-12%] left-[8%] h-[30%] w-[52%] rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${colorScheme.secondary}36 0%, transparent 76%)` }}
            />
            <div
                className="absolute bottom-[-14%] right-[0%] h-[34%] w-[54%] rounded-full blur-3xl"
                style={{ background: `radial-gradient(circle, ${colorScheme.primary}28 0%, transparent 74%)` }}
            />
        </div>
    );
}

function GoldenFall() {
    const particles = Array.from({ length: 12 }, (_, index) => ({
        id: index,
        left: 4 + ((index * 11) % 90),
        duration: 4.8 + (index % 5) * 0.45,
        delay: index * 0.18,
        width: index % 3 === 0 ? 3 : 8,
        height: index % 3 === 0 ? 14 : 3,
        color:
            index % 4 === 0
                ? 'rgba(244,197,66,0.92)'
                : index % 4 === 1
                  ? 'rgba(255,247,214,0.96)'
                  : index % 4 === 2
                    ? 'rgba(96,165,250,0.82)'
                    : 'rgba(230,185,74,0.88)',
        rotate: (index % 6) * 18,
    }));

    return (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {particles.map((particle) => (
                <motion.span
                    key={particle.id}
                    className="absolute block rounded-full"
                    style={{
                        left: `${particle.left}%`,
                        top: '-8%',
                        width: particle.width,
                        height: particle.height,
                        background: particle.color,
                        boxShadow: '0 0 10px rgba(244,197,66,0.22)',
                    }}
                    animate={{
                        y: ['0%', '118%'],
                        x: [0, particle.id % 2 === 0 ? 12 : -12, 0],
                        rotate: [particle.rotate, particle.rotate + 120],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

function BalloonPhotoFrame({ src, alt }: { src: string; alt: string }) {
    const frameBalloons = [
        { left: '-10%', top: '18%', color: '#F4C542', size: 30 },
        { left: '82%', top: '10%', color: '#FFFFFF', size: 28 },
        { left: '-6%', top: '66%', color: '#2E63D4', size: 26 },
        { left: '84%', top: '72%', color: '#F4C542', size: 24 },
    ];

    return (
        <motion.div
            className="relative mt-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
            {frameBalloons.map((balloon, index) => (
                <motion.div
                    key={`${balloon.left}-${balloon.top}`}
                    className="absolute z-10"
                    style={{ left: balloon.left, top: balloon.top }}
                    animate={{
                        y: [0, -10 - index * 2, 0],
                        x: [0, index % 2 === 0 ? 4 : -4, 0],
                    }}
                    transition={{
                        duration: 3.6 + index * 0.35,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.18,
                    }}
                >
                    <div
                        className="relative rounded-[48%_48%_44%_44%/55%_55%_38%_38%] border border-white/30 shadow-[0_12px_25px_rgba(0,0,0,0.25)]"
                        style={{
                            width: balloon.size,
                            height: balloon.size * 1.18,
                            background: `radial-gradient(circle at 30% 24%, rgba(255,255,255,0.98), rgba(255,255,255,0.55) 16%, ${balloon.color} 68%)`,
                        }}
                    >
                        <div className="absolute left-[24%] top-[18%] h-4 w-2 rounded-full bg-white/40 blur-[1px]" />
                    </div>
                    <div className="mx-auto h-6 w-px bg-white/30" />
                </motion.div>
            ))}
            <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                    background: 'conic-gradient(from 0deg, rgba(244,197,66,0.4), rgba(255,255,255,0.4), rgba(46,99,212,0.4), rgba(244,197,66,0.4))',
                    filter: 'blur(2px)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-[3px] border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
                <img src={src} alt={alt} className="h-full w-full object-cover" />
            </div>
        </motion.div>
    );
}

function BirthdayLogoBadge({ src, alt }: { src: string; alt: string }) {
    return (
        <motion.div
            className="relative mt-4 inline-flex items-center justify-center"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="absolute -inset-2 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),rgba(244,197,66,0.12)_45%,transparent_72%)] blur-md" />
            <div
                className="relative overflow-hidden rounded-[26px] p-[1.5px] shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(244,197,66,0.6), rgba(255,255,255,0.2))' }}
            >
                <div className="rounded-[24px] border border-white/20 bg-white/5 backdrop-blur-xl p-3">
                    <img src={src} alt={alt} className="h-40 w-40 rounded-[20px] object-cover shadow-[0_8px_16px_rgba(0,0,0,0.2)]" />
                </div>
            </div>
        </motion.div>
    );
}

function TransitionPhotoCollage({ photos }: { photos: string[] }) {
    const placements = [
        { left: '0%', top: '0%', width: '64%', rotate: -6, z: 20 },
        { left: '45%', top: '15%', width: '50%', rotate: 5, z: 30 },
        { left: '5%', top: '44%', width: '60%', rotate: -4, z: 25 },
        { left: '48%', top: '61%', width: '46%', rotate: 4, z: 15 },
    ];

    const collagePhotos = photos.slice(0, 4);
    if (collagePhotos.length === 0) return null;

    return (
        <div className="relative mx-auto h-[520px] w-full max-w-[360px]">
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_68%)] blur-2xl" />
            {collagePhotos.map((photo, index) => {
                const placement = placements[index] || placements[placements.length - 1];
                return (
                    <motion.div
                        key={`${photo}-${index}`}
                        className="absolute"
                        style={{
                            left: placement.left,
                            top: placement.top,
                            width: placement.width,
                            rotate: `${placement.rotate}deg`,
                            zIndex: placement.z,
                        }}
                        animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0], rotate: [`${placement.rotate}deg`, `${placement.rotate + (index % 2 === 0 ? 1.5 : -1.5)}deg`, `${placement.rotate}deg`] }}
                        transition={{ duration: 5.5 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="rounded-[10px] bg-[#f8f3ec] p-[11px] shadow-[0_22px_44px_rgba(0,0,0,0.34)]">
                            <div className="relative overflow-hidden rounded-[4px] border border-black/8 bg-white">
                                <img src={photo} alt={`Birthday memory ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                            </div>
                            <div className="flex h-11 items-center justify-end px-2 text-[10px] uppercase tracking-[0.18em] text-black/35">
                                Birthday Memories
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function PremiumAgeBadge({
    age,
    language,
    colorScheme,
    detailFontFamily,
    numberFontFamily,
    bodyFontSize,
    bodyTypographyStyle,
}: {
    age: number;
    language: 'kh' | 'en';
    colorScheme: typeof defaultColorScheme;
    detailFontFamily?: string;
    numberFontFamily?: string;
    bodyFontSize?: string;
    bodyTypographyStyle: { fontStyle: 'normal' | 'italic'; fontWeight: number };
}) {
    const displayNumber = language === 'kh' ? toKhmerNumber(age) : String(age);
    const topLabel = language === 'kh' ? 'គម្រប់ខួប' : 'TURNING';
    const bottomLabel = language === 'kh' ? 'ឆ្នាំ' : 'YEARS OLD';

    return (
        <motion.div
            className="relative mx-auto"
            animate={{ y: [0, -4, 0], scale: [1, 1.015, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
            <div className="absolute -inset-4 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),rgba(244,197,66,0.16)_40%,transparent_72%)] blur-xl" />
            <div
                className="relative overflow-hidden rounded-[32px] border px-7 py-5 shadow-[0_24px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                style={{
                    borderColor: 'rgba(255,255,255,0.12)',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
                    boxShadow: 'inset 0 0 24px rgba(255,255,255,0.04), 0 24px 50px rgba(0,0,0,0.3)',
                }}
            >
                <div
                    className="absolute inset-x-6 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${colorScheme.primary}88, transparent)` }}
                />
                <div className="relative flex flex-col items-center text-center">
                    <span
                        className={language === 'kh' ? 'text-[0.72rem]' : 'text-[0.72rem] uppercase tracking-[0.34em]'}
                        style={{
                            color: colorScheme.primary,
                            fontFamily: language === 'kh' ? safeKhmerLabelFont : detailFontFamily,
                            fontSize: bodyFontSize,
                            fontStyle: bodyTypographyStyle.fontStyle,
                            fontWeight: 700,
                            letterSpacing: language === 'kh' ? '0' : undefined,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {topLabel}
                    </span>
                    <motion.span
                        className="mt-1 leading-none"
                        style={{
                            color: colorScheme.text,
                            fontFamily: numberFontFamily || detailFontFamily,
                            fontSize: language === 'kh' ? '4.6rem' : '4.9rem',
                            fontWeight: 800,
                            textShadow: '0 8px 24px rgba(244,197,66,0.24)',
                        }}
                        animate={{ textShadow: ['0 8px 24px rgba(244,197,66,0.18)', '0 12px 30px rgba(244,197,66,0.34)', '0 8px 24px rgba(244,197,66,0.18)'] }}
                        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {displayNumber}
                    </motion.span>
                    <span
                        className={language === 'kh' ? 'mt-1 text-[0.78rem]' : 'mt-1 text-[0.78rem] uppercase tracking-[0.28em]'}
                        style={{
                            color: colorScheme.textSecondary,
                            fontFamily: language === 'kh' ? safeKhmerLabelFont : detailFontFamily,
                            fontSize: bodyFontSize,
                            fontStyle: bodyTypographyStyle.fontStyle,
                            fontWeight: 700,
                            letterSpacing: language === 'kh' ? '0' : undefined,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {bottomLabel}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function PremiumTransitionAgeDisplay({
    age,
    language,
    colorScheme,
    primaryName,
    detailFontFamily,
    numberFontFamily,
    nameFontFamily,
    bodyFontSize,
    bodyTypographyStyle,
}: {
    age: number;
    language: 'kh' | 'en';
    colorScheme: typeof defaultColorScheme;
    primaryName: string;
    detailFontFamily?: string;
    numberFontFamily?: string;
    nameFontFamily?: string;
    bodyFontSize?: string;
    bodyTypographyStyle: { fontStyle: 'normal' | 'italic'; fontWeight: number };
}) {
    const displayNumber = language === 'kh' ? toKhmerNumber(age) : String(age);
    const topLabel = language === 'kh' ? 'សូមអញ្ជើញចូលរួមអបអរ' : 'JOIN US TO CELEBRATE THE';
    const middleLabel = language === 'kh' ? 'ពិធីខួបកំណើត' : 'BIRTHDAY OF';
    const scriptName = primaryName;
    const scriptFont = language === 'kh' ? nameFontFamily : '"Brush Script MT", "Segoe Script", "Snell Roundhand", cursive';

    return (
        <div className="mx-auto flex w-full max-w-[312px] flex-col items-center text-center">
            <div className="flex flex-col items-center">
                <p
                    className={language === 'kh' ? 'text-[1.1rem]' : 'text-[0.78rem] uppercase tracking-[0.3em]'}
                    style={{
                        color: colorScheme.primary,
                        fontFamily: language === 'kh' ? safeKhmerLabelFont : detailFontFamily,
                        fontSize: language === 'kh' ? (bodyFontSize ? `calc(${bodyFontSize} * 1.55)` : '1.15rem') : (bodyFontSize ? `calc(${bodyFontSize} * 1.25)` : '0.82rem'),
                        fontStyle: bodyTypographyStyle.fontStyle,
                        fontWeight: 700,
                        letterSpacing: language === 'kh' ? '0' : undefined,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {topLabel}
                </p>
                <p
                    className={language === 'kh' ? 'mt-2 text-[1.25rem]' : 'mt-2 text-[0.88rem] uppercase tracking-[0.34em]'}
                    style={{
                        color: colorScheme.textSecondary,
                        fontFamily: language === 'kh' ? safeKhmerLabelFont : detailFontFamily,
                        fontSize: language === 'kh' ? (bodyFontSize ? `calc(${bodyFontSize} * 1.65)` : '1.3rem') : (bodyFontSize ? `calc(${bodyFontSize} * 1.35)` : '0.92rem'),
                        fontStyle: bodyTypographyStyle.fontStyle,
                        fontWeight: 700,
                        letterSpacing: language === 'kh' ? '0' : undefined,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {middleLabel}
                </p>
            </div>

            <p
                className={language === 'kh' ? 'mt-4 text-[0.72rem]' : 'mt-4 text-[0.72rem] uppercase tracking-[0.32em]'}
                style={{
                    color: colorScheme.primary,
                    fontFamily: language === 'kh' ? safeKhmerLabelFont : detailFontFamily,
                    fontSize: bodyFontSize,
                    fontStyle: bodyTypographyStyle.fontStyle,
                    fontWeight: 700,
                    textShadow: '0 4px 14px rgba(0,0,0,0.32)',
                    letterSpacing: language === 'kh' ? '0' : undefined,
                    whiteSpace: 'nowrap',
                }}
            >
                {language === 'kh' ? 'គម្រប់ខួប' : 'TURNING'}
            </p>

            <motion.div
                className="relative mt-3 w-full"
                animate={{ y: [0, -4, 0], scale: [1, 1.015, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="absolute inset-x-6 top-[8%] bottom-[18%] rounded-[36px] bg-white/5 blur-xl" />
                <div className="absolute inset-x-4 top-[5%] bottom-[15%] rounded-[32px] border border-white/10 bg-white/5 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl" style={{ boxShadow: 'inset 0 0 32px rgba(255,255,255,0.05), 0 32px 80px rgba(0,0,0,0.5)' }} />
                <div
                    className="relative px-2 py-4"
                >
                    <div
                        className="bg-clip-text text-transparent leading-none"
                        style={{
                            fontFamily: numberFontFamily || nameFontFamily,
                            fontSize: language === 'kh' ? '9.6rem' : '10rem',
                            fontWeight: 900,
                            backgroundImage: 'linear-gradient(180deg, #fff9dc 0%, #f9e08e 30%, #d4a536 72%, #9b6d18 100%)',
                            textShadow: '0 12px 24px rgba(0,0,0,0.2)',
                            WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))',
                        }}
                    >
                        {displayNumber}
                    </div>
                </div>
            </motion.div>

            <div className="mt-1 h-px w-28" style={{ background: `linear-gradient(90deg, transparent, ${colorScheme.primary}, transparent)` }} />
            <h2
                className="mt-2 text-[2.5rem] leading-[0.9]"
                style={{
                    color: colorScheme.text,
                    fontFamily: scriptFont,
                    fontWeight: language === 'kh' ? 800 : 500,
                    textShadow: '0 0 16px rgba(255,234,166,0.16)',
                }}
            >
                {scriptName}
            </h2>
        </div>
    );
}

export default function BirthdayBalloonLayout(props: Props) {
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
        buttonImageUrl,
        birthDate,
        celebrantTitle,
        celebrantKhmerTitle,
    } = props;

    const persona = getInvitationPersona(props);
    const { language } = useLanguage();
    const labels = getLocalizedInvitationLabels(props.eventType, language);
    const isPreviewMode = Boolean(props.previewPage);
    const [phase, setPhase] = useState<'intro' | 'transition' | 'details'>(props.previewPage || 'intro');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showFade, setShowFade] = useState(false);
    const [showBalloonBurst, setShowBalloonBurst] = useState(false);
    const [isOpeningSequence, setIsOpeningSequence] = useState(false);
    const [showScrollGuide, setShowScrollGuide] = useState(true);
    const [hasStartedDetailScroll, setHasStartedDetailScroll] = useState(false);
    const [transitionStage, setTransitionStage] = useState<'content' | 'gallery'>('content');
    const [transitionRuntimeMs, setTransitionRuntimeMs] = useState(3200);
    const audioRef = useRef<HTMLAudioElement>(null);
    const transitionVideoRef = useRef<HTMLVideoElement>(null);
    const cs = templateConfig?.colorScheme || defaultColorScheme;
    const introPageConfig = templateConfig?.pages?.intro || {};
    const transitionPageConfig = templateConfig?.pages?.transition || {};
    const detailPageConfig = templateConfig?.pages?.details || {};
    const introPageBlocks = introPageConfig.blocks || [];
    const introCs = introPageConfig.colorScheme || cs;
    const transitionCs = transitionPageConfig.colorScheme || cs;
    const detailCs = detailPageConfig.colorScheme || cs;

    const showIntroGuestName = templateConfig?.showIntroGuestName !== false;
    const showTransitionOverlay = templateConfig?.showTransitionOverlay !== false;
    const showTransitionSaveTheDate = templateConfig?.showTransitionSaveTheDate !== false;
    const showTransitionEventTitle = templateConfig?.showTransitionEventTitle !== false;
    const showTransitionNames = templateConfig?.showTransitionNames !== false;
    const showTransitionDate = templateConfig?.showTransitionDate !== false;
    const showTransitionLocation = templateConfig?.showTransitionLocation !== false;
    const transitionDurationMs = Math.max(
        1000,
        Math.min(
            15000,
            Number(transitionPageConfig.autoAdvanceSeconds || templateConfig?.transitionDurationSeconds || 3.2) * 1000
        )
    );

    const activeIntroMedia = introVideoUrl || backgroundVideoUrl || backgroundImageUrl;
    const activeTransitionMedia = transitionVideoUrl || backgroundVideoUrl || backgroundImageUrl;
    const isVideoUrl = (url?: string | null) => !!url && /\.(mp4|mov|webm|ogg)$/i.test(url);
    const heroPhoto = backgroundImageUrl || null;
    const resolvePhotoUrl = (photo: any): string | null => {
        if (!photo) return null;
        if (typeof photo === 'string') return photo;
        if (typeof photo === 'object') {
            return photo.url || photo.src || photo.imageUrl || photo.photoUrl || photo.path || null;
        }
        return null;
    };
    const locale = language === 'kh' ? 'km-KH' : 'en-US';
    const displayDate = eventDate ? new Date(eventDate) : null;
    const primaryName = persona.primaryFullName || eventTitle || (language === 'kh' ? 'ម្ចាស់ខួបកំណើត' : 'Birthday Star');
    
    // Function to get celebrant title based on language
    const getCelebrantTitle = () => {
        if (language === 'kh') {
            return celebrantKhmerTitle || '';
        } else {
            return celebrantTitle || '';
        }
    };
    
    const celebrantTitleDisplay = getCelebrantTitle();
    const displayName = celebrantTitleDisplay ? `${celebrantTitleDisplay} ${primaryName}` : primaryName;
    const age = calculateAge(birthDate, eventDate || new Date());
    const titleLabel = eventTitle || labels.eventTitle;
    const timeLine = displayDate
        ? (language === 'kh'
            ? toKhmerTime(displayDate)
            : new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(displayDate))
        : '';
    const guestHeading = language === 'kh' ? 'សូមគោរពអញ្ជើញ' : 'You Are Invited';
    const guestFallback = language === 'kh' ? 'ភ្ញៀវកិត្តិយស' : 'Distinguished Guest';
    const openInvitationLabel = language === 'kh' ? 'បើកការអញ្ជើញ' : 'Open Invitation';
    const openInvitationHintLabel = language === 'kh' ? 'ចុចត្រង់នេះ' : 'Tap Here';
    const transitionIntroLabel = language === 'kh' ? 'ចូលរួមអបអរ' : 'Join Us To Celebrate';
    const transitionPartyLabel = language === 'kh' ? 'ពិធីខួបកំណើត' : 'Birthday Party';
    const continueLabel = language === 'kh' ? 'បន្ត' : 'Continue';
    const birthdayWord = language === 'kh' ? 'ខួបកំណើត' : 'Birthday';
    const partyWord = language === 'kh' ? 'រីករាយ' : 'Party';
    const addToCalendarLabel = language === 'kh' ? 'ដាក់ក្នុងប្រតិទិន' : 'Add to Calendar';
    const openMapLabel = language === 'kh' ? 'បើកផែនទី' : 'Open Map';
    const paymentQrTitle = language === 'kh' ? 'ស្កេន QR សម្រាប់ការទូទាត់' : 'Scan QR For Payment';
    const paymentQrHint = language === 'kh' ? 'ភ្ញៀវអាចស្កេន QR នេះដើម្បីផ្ញើអំណោយ ឬទូទាត់ជូនម្ចាស់កម្មវិធី។' : 'Guests can scan this QR code to send a gift or payment to the host.';
    const skipLabel = language === 'kh' ? 'រំលង' : 'Skip';
    const scrollGuideLabel = language === 'kh' ? 'សូមអូសឡើងលើ' : 'Scroll Up';
    const buttonTextColor = introPageConfig.openButtonTextColor || templateConfig?.openButtonTextColor || '#FFFFFF';
    const getIntroBlockColor = (blockId: string, fallback: string) => {
        const matchingBlock = introPageBlocks.find((block: any) => block.id === blockId);
        return matchingBlock?.props?.color || fallback;
    };
    const introEventTypeColor = getIntroBlockColor('intro-event-type', introCs.textSecondary);
    const introMainTitleColor = getIntroBlockColor('intro-main-names', introCs.text);
    const introGuestLabelColor = getIntroBlockColor('intro-guest-label', introCs.primary);
    const introGuestNameColor = getIntroBlockColor('intro-guest-name', introCs.text);
    const introButtonTextColor = getIntroBlockColor('intro-button', buttonTextColor);
    const typography = templateConfig?.typography || {};
    const templateFonts = getTemplateFontFamilies(templateConfig);
    const headlineFontFamily = language === 'kh' ? templateFonts.khmerHeading : templateFonts.heading;
    const detailFontFamily = language === 'kh' ? templateFonts.khmerBody : templateFonts.body;
    const buttonFontFamily = language === 'kh' ? templateFonts.khmerButton : templateFonts.button;
    const h1FontFamily = language === 'kh' ? templateFonts.khmerH1 : templateFonts.h1;
    const h2FontFamily = language === 'kh' ? templateFonts.khmerH2 : templateFonts.h2;
    const h3FontFamily = language === 'kh' ? templateFonts.khmerH3 : templateFonts.h3;
    const resolveTypographyStyle = (style?: 'normal' | 'bold' | 'italic') => ({
        fontStyle: style === 'italic' ? 'italic' as const : 'normal' as const,
        fontWeight: style === 'bold' ? 700 : 400,
    });
    const h1TypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerH1Style : typography.englishH1Style);
    const h2TypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerH2Style : typography.englishH2Style);
    const h3TypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerH3Style : typography.englishH3Style);
    const bodyTypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerBodyStyle : typography.englishBodyStyle);
    const buttonTypographyStyle = resolveTypographyStyle(language === 'kh' ? typography.khmerButtonStyle : typography.englishButtonStyle);
    const buttonFontWeight = buttonTypographyStyle.fontWeight || (language === 'kh' ? 600 : 700);
    const h1FontSize = typeof (language === 'kh' ? typography.khmerH1SizePx : typography.englishH1SizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerH1SizePx : typography.englishH1SizePx}px`
        : undefined;
    const h2FontSize = typeof (language === 'kh' ? typography.khmerH2SizePx : typography.englishH2SizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerH2SizePx : typography.englishH2SizePx}px`
        : undefined;
    const h3FontSize = typeof (language === 'kh' ? typography.khmerH3SizePx : typography.englishH3SizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerH3SizePx : typography.englishH3SizePx}px`
        : undefined;
    const bodyFontSize = typeof (language === 'kh' ? typography.khmerBodySizePx : typography.englishBodySizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerBodySizePx : typography.englishBodySizePx}px`
        : undefined;
    const buttonFontSize = typeof (language === 'kh' ? typography.khmerButtonSizePx : typography.englishButtonSizePx) === 'number'
        ? `${language === 'kh' ? typography.khmerButtonSizePx : typography.englishButtonSizePx}px`
        : undefined;
    const weekdayLabel = displayDate
        ? (() => {
            if (language === 'kh') {
                const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
                return `ថ្ងៃ${khmerDays[displayDate.getDay()]}`;
            }
            return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(displayDate);
        })()
        : (language === 'kh' ? 'ថ្ងៃចន្ទ' : 'Monday');
    const monthLabel = displayDate
        ? (() => {
            if (language === 'kh') {
                const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
                return `ខែ${khmerMonths[displayDate.getMonth()]}`;
            }
            return new Intl.DateTimeFormat(locale, { month: 'long' }).format(displayDate);
        })()
        : (language === 'kh' ? 'ខែសីហា' : 'August');
    const dayLabel = displayDate
        ? (language === 'kh'
            ? toKhmerNumber(displayDate.getDate()).padStart(2, '០')
            : new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(displayDate))
        : '--';
    const transitionGalleryPhotos = useMemo(() => {
        const fromAlbum = albumPhotos
            .map((photo) => resolvePhotoUrl(photo))
            .filter((photo): photo is string => Boolean(photo));
        const fallbacks = [logoUrl, heroPhoto].filter((photo): photo is string => Boolean(photo));
        return Array.from(new Set([...fromAlbum, ...fallbacks])).slice(0, 4);
    }, [albumPhotos, logoUrl, heroPhoto]);

    const googleCalendarUrl = useMemo(() => {
        if (!eventDate) return '#';
        const startDate = new Date(eventDate);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
        const end = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
        return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(titleLabel)}&dates=${start}/${end}&location=${encodeURIComponent(location || '')}`;
    }, [eventDate, titleLabel, location]);

    useEffect(() => {
        if (!musicUrl || !audioRef.current) return;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }, [musicUrl]);

    useEffect(() => {
        if (props.previewPage) {
            setPhase(props.previewPage);
        }
    }, [props.previewPage]);

    useEffect(() => {
        setTransitionRuntimeMs(transitionDurationMs);
    }, [transitionDurationMs]);

    useEffect(() => {
        if (phase !== 'details') {
            setShowScrollGuide(true);
            setHasStartedDetailScroll(false);
            return;
        }

        const handleScroll = () => {
            if (window.scrollY > 8) {
                setShowScrollGuide(false);
                setHasStartedDetailScroll(true);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [phase]);

    useEffect(() => {
        if (phase !== 'transition') {
            setTransitionStage('content');
            return;
        }

        setTransitionStage('content');
        if (!showTransitionOverlay || transitionGalleryPhotos.length === 0) return;

        const halfDuration = Math.max(1000, Math.floor(transitionRuntimeMs / 2));
        const timer = window.setTimeout(() => {
            setTransitionStage('gallery');
        }, halfDuration);

        return () => {
            window.clearTimeout(timer);
        };
    }, [phase, showTransitionOverlay, transitionGalleryPhotos.length, transitionRuntimeMs]);

    useEffect(() => {
        if (!musicUrl) return;
        const tryPlay = async () => {
            if (!audioRef.current || !audioRef.current.paused) return;
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch {
                setIsPlaying(false);
            }
        };

        const handleFirstInteraction = () => {
            void tryPlay();
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
        window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
        return () => {
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [musicUrl]);

    const toggleMusic = async () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }
        try {
            await audioRef.current.play();
            setIsPlaying(true);
        } catch {
            setIsPlaying(false);
        }
    };

    const runSmoothTransition = (nextPhase: 'transition' | 'details', delayMs = 420) => {
        setShowFade(true);
        window.setTimeout(() => {
            setPhase(nextPhase);
            window.setTimeout(() => setShowFade(false), 240);
        }, delayMs);
    };

    const openInvitation = async () => {
        if (isOpeningSequence) return;
        setIsOpeningSequence(true);
        setShowBalloonBurst(true);
        if (musicUrl && audioRef.current && !isPlaying) {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch {}
        }

        window.setTimeout(() => runSmoothTransition('transition', 320), 140);
        window.setTimeout(() => setShowBalloonBurst(false), 1500);
        window.setTimeout(() => setIsOpeningSequence(false), 900);
        if (!activeTransitionMedia || !isVideoUrl(activeTransitionMedia)) {
            window.setTimeout(() => runSmoothTransition('details', 360), 320 + transitionDurationMs);
        }
    };

    const renderMediaBackground = (
        media?: string | null,
        colorScheme = cs,
        opacity = 0.28,
        options?: { loop?: boolean; onEnded?: () => void }
    ) => (
        <>
            {media && isVideoUrl(media) ? (
                <video
                    ref={media === activeTransitionMedia ? transitionVideoRef : undefined}
                    src={media}
                    autoPlay
                    loop={options?.loop ?? true}
                    muted
                    playsInline
                    onEnded={options?.onEnded}
                    onLoadedMetadata={(event) => {
                        if (media !== activeTransitionMedia) return;
                        const duration = event.currentTarget.duration;
                        if (Number.isFinite(duration) && duration > 0) {
                            setTransitionRuntimeMs(Math.max(1000, Math.min(15000, duration * 1000)));
                        }
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : media ? (
                <img src={media} alt="background" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at top, ${colorScheme.secondary}66, transparent 45%), linear-gradient(180deg, ${colorScheme.background} 0%, ${colorScheme.secondary} 65%, ${colorScheme.background} 100%)`,
                    opacity: media ? opacity : 1,
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0,transparent_58%)]" />
            <div className="pointer-events-none absolute inset-0 z-[5] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/asfalt-dark.png")' }} />
        </>
    );

    const shellClass = `relative w-full overflow-hidden ${isPreviewMode ? 'h-full min-h-full' : 'min-h-screen'}`;
    const stageClass = isPreviewMode ? 'h-full min-h-full' : 'min-h-screen';
    const musicButtonClass = isPreviewMode
        ? 'absolute bottom-4 right-4 z-[90] flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-2xl'
        : 'fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl';
    const fadeOverlayClass = isPreviewMode ? 'pointer-events-none absolute inset-0 z-[100]' : 'pointer-events-none fixed inset-0 z-[100]';

    return (
        <main lang={language === 'kh' ? 'km' : 'en'} className={`${isPreviewMode ? 'h-full min-h-full' : 'min-h-screen'} ${templateFontVariables}`} style={{ fontFamily: templateFonts.body, backgroundColor: cs.background, color: cs.text }}>
            <AnimatePresence mode="wait">
                {phase === 'intro' && (
                    <motion.section key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={shellClass} style={{ backgroundColor: introCs.background }}>
                        <div className="absolute inset-0">{renderMediaBackground(activeIntroMedia, introCs, 0.24)}</div>
                        <FrameOverlay url={introFrameUrl} />
                        <PremiumGlowAura colorScheme={introCs} />
                        <GoldenFall />
                        <Confetti />
                        <BalloonBurst active={showBalloonBurst} colors={[introCs.primary, introCs.accent, introCs.secondary]} />
                        <div className={`relative z-30 flex flex-col items-center justify-center px-7 pb-28 pt-14 text-center text-white ${stageClass}`}>
                            <h2
                                className={language === 'kh' ? 'text-[2.45rem] leading-[1.06] drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]' : 'text-[2rem] leading-[1.04] drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]'}
                                style={{ color: introEventTypeColor, letterSpacing: language === 'kh' ? '0' : '0.04em', fontFamily: h2FontFamily, fontSize: h2FontSize, fontStyle: h2TypographyStyle.fontStyle, fontWeight: h2TypographyStyle.fontWeight }}
                            >
                                {labels.celebrationLabel}
                            </h2>
                            {age !== null && (
                                <div className="mt-5">
                                    <PremiumAgeBadge
                                        age={age}
                                        language={language as 'kh' | 'en'}
                                        colorScheme={introCs}
                                        detailFontFamily={detailFontFamily}
                                        numberFontFamily={h1FontFamily}
                                        bodyFontSize={bodyFontSize}
                                        bodyTypographyStyle={bodyTypographyStyle}
                                    />
                                </div>
                            )}
                            <h1
                                className={language === 'kh' ? 'mt-6 text-[2.85rem] leading-[0.98] drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]' : 'mt-6 text-[3rem] leading-[0.98] drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]'}
                                style={{ color: introMainTitleColor, letterSpacing: language === 'kh' ? '0' : '-0.01em', fontFamily: h1FontFamily, fontSize: h1FontSize, fontStyle: h1TypographyStyle.fontStyle, fontWeight: h1TypographyStyle.fontWeight }}
                            >
                                {displayName}
                            </h1>
                            {showIntroGuestName && (
                                <div className="mt-5 px-4 py-3">
                                    <p className="text-sm" style={{ color: introGuestLabelColor, letterSpacing: language === 'kh' ? '0' : '0.16em', fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>{guestHeading}</p>
                                    <p className="mt-3 text-[1.65rem] leading-tight" style={{ color: introGuestNameColor, letterSpacing: language === 'kh' ? '0' : '0', fontFamily: h3FontFamily, fontSize: h3FontSize, fontStyle: h3TypographyStyle.fontStyle, fontWeight: h3TypographyStyle.fontWeight }}>{guestName || guestFallback}</p>
                                </div>
                            )}
                            <div className="mt-8 flex flex-col items-center gap-3">
                                <OpenInvitationHint
                                    label={openInvitationHintLabel}
                                    color={introCs.primary}
                                    textColor={introCs.text}
                                    borderColor={introCs.border}
                                    background="rgba(255,255,255,0.16)"
                                    iconOnly
                                />
                                <button
                                    onClick={openInvitation}
                                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                >
                                    {buttonImageUrl ? (
                                        <div className="relative inline-block">
                                            <img src={buttonImageUrl} alt={openInvitationLabel} className="h-20 w-auto object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)]" />
                                            {templateConfig?.showButtonText !== false && (
                                                <span
                                                    className="absolute inset-0 flex items-center justify-center px-6"
                                                    style={{ color: introButtonTextColor, letterSpacing: language === 'kh' ? '0' : '0.14em', textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: buttonFontFamily, fontWeight: 700, fontStyle: buttonTypographyStyle.fontStyle, fontSize: language === 'kh' ? (buttonFontSize ? `calc(${buttonFontSize} * 1.55)` : '1.3rem') : buttonFontSize }}
                                                >
                                                    {openInvitationLabel}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span
                                            className="inline-flex rounded-full px-10 py-4 text-base shadow-[0_20px_48px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                                            style={{ border: `1px solid ${introCs.primary}44`, background: `linear-gradient(135deg, ${introCs.primary}dd, ${introCs.primary})`, color: introButtonTextColor, letterSpacing: language === 'kh' ? '0' : '0.18em', textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: buttonFontFamily, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}
                                        >
                                            {openInvitationLabel}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.section>
                )}

                {phase === 'transition' && (
                    <motion.section key="transition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={shellClass} style={{ backgroundColor: transitionCs.background }}>
                        <div className="absolute inset-0">
                            {renderMediaBackground(activeTransitionMedia, transitionCs, showTransitionOverlay ? 0.26 : 0.1, {
                                loop: false,
                                onEnded: () => runSmoothTransition('details', 280),
                            })}
                        </div>
                        <FrameOverlay url={transitionFrameUrl} />
                        <PremiumGlowAura colorScheme={transitionCs} />
                        <GoldenBokeh />
                        <GoldenFall />
                        <div className="absolute right-5 top-20 z-40">
                            <button
                                onClick={() => runSmoothTransition('details', 280)}
                                className={language === 'kh' ? 'rounded-full px-5 py-2 text-sm' : 'rounded-full px-5 py-2 text-xs uppercase tracking-[0.28em]'}
                                style={{ border: `1px solid ${transitionCs.border}`, backgroundColor: `${transitionCs.background}b8`, color: transitionCs.text, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: buttonFontFamily, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize, backdropFilter: 'blur(10px)' }}
                            >
                                {skipLabel}
                            </button>
                        </div>
                        {showTransitionOverlay && (
                            <div className={`relative z-30 flex flex-col items-center justify-center px-6 pb-24 pt-10 text-center text-white ${stageClass}`}>
                                <div className="w-full max-w-[380px]">
                                    <AnimatePresence mode="wait">
                                        {transitionStage === 'gallery' && transitionGalleryPhotos.length > 0 ? (
                                            <motion.div
                                                key="transition-gallery"
                                                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                                                transition={{ duration: 0.42, ease: 'easeOut' }}
                                                className="flex justify-center"
                                            >
                                                <TransitionPhotoCollage photos={transitionGalleryPhotos} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="transition-content"
                                                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -18, scale: 0.98 }}
                                                transition={{ duration: 0.42, ease: 'easeOut' }}
                                            >
                                                {age !== null ? (
                                                    <PremiumTransitionAgeDisplay
                                                        age={age}
                                                        language={language as 'kh' | 'en'}
                                                        colorScheme={transitionCs}
                                                        primaryName={displayName}
                                                        detailFontFamily={detailFontFamily}
                                                        numberFontFamily={h1FontFamily}
                                                        nameFontFamily={h2FontFamily}
                                                        bodyFontSize={bodyFontSize}
                                                        bodyTypographyStyle={bodyTypographyStyle}
                                                    />
                                                ) : (
                                                    <>
                                                        {showTransitionSaveTheDate && (
                                                            <p className={language === 'kh' ? 'text-sm' : 'text-[11px] uppercase tracking-[0.35em]'} style={{ color: transitionCs.primary, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: h3FontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>
                                                                {transitionIntroLabel}
                                                            </p>
                                                        )}
                                                        {showTransitionNames && (
                                                            <h2 className="mt-3 text-[3.75rem] leading-[0.95] drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]" style={{ color: transitionCs.text, fontFamily: h1FontFamily, fontSize: h1FontSize, fontStyle: h1TypographyStyle.fontStyle, fontWeight: h1TypographyStyle.fontWeight }}>
                                                                {transitionPartyLabel}
                                                            </h2>
                                                        )}
                                                        {showTransitionEventTitle && (
                                                            <p className="mt-5 text-2xl" style={{ color: transitionCs.primary, fontFamily: h2FontFamily, fontSize: h2FontSize, fontStyle: h2TypographyStyle.fontStyle, fontWeight: h2TypographyStyle.fontWeight }}>
                                                                {displayName}
                                                            </p>
                                                        )}
                                                    </>
                                                )}

                                                {(showTransitionDate || showTransitionLocation) && (
                                                    <div
                                                        className="mt-8 px-2"
                                                        style={{
                                                            color: transitionCs.primary,
                                                            fontFamily: detailFontFamily,
                                                            fontSize: bodyFontSize,
                                                            fontStyle: bodyTypographyStyle.fontStyle,
                                                            fontWeight: bodyTypographyStyle.fontWeight,
                                                        }}
                                                    >
                                                        <div className="mx-auto h-px w-44" style={{ background: `linear-gradient(90deg, transparent, ${transitionCs.primary}, transparent)` }} />
                                                        {showTransitionDate && (
                                                            <div className="mt-4 flex items-end justify-center gap-5">
                                                                <div className="text-left">
                                                                    <div className={language === 'kh' ? 'text-[1.15rem] font-bold' : 'text-[0.85rem] uppercase tracking-[0.3em] font-bold'} style={{ color: transitionCs.textSecondary, letterSpacing: language === 'kh' ? '0' : undefined }}>
                                                                        {weekdayLabel}
                                                                    </div>
                                                                    <div className={language === 'kh' ? 'mt-1 text-[1.25rem] font-bold' : 'mt-1 text-[0.95rem] uppercase tracking-[0.24em] font-bold'} style={{ color: transitionCs.textSecondary, letterSpacing: language === 'kh' ? '0' : undefined }}>
                                                                        {monthLabel}
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className="bg-clip-text text-transparent text-[5.2rem] leading-none"
                                                                    style={{
                                                                        backgroundImage: 'linear-gradient(180deg, #fff9dc 0%, #f9e08e 30%, #d4a536 72%, #9b6d18 100%)',
                                                                        WebkitTextStroke: '1px rgba(96,68,12,0.34)',
                                                                        fontFamily: h1FontFamily,
                                                                        fontWeight: 900,
                                                                    }}
                                                                >
                                                                    {displayDate ? dayLabel : '29'}
                                                                </span>
                                                                <div className="pb-1 text-right">
                                                                    <div className={language === 'kh' ? 'text-[1.15rem] font-bold' : 'text-[0.85rem] uppercase tracking-[0.3em] font-bold'} style={{ color: transitionCs.textSecondary, letterSpacing: language === 'kh' ? '0' : undefined }}>
                                                                        {language === 'kh' ? 'ម៉ោង' : 'TIME'}
                                                                    </div>
                                                                    <div className="mt-1 text-[1.25rem] font-bold leading-none">{timeLine || '13.00 AM'}</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {showTransitionLocation && location && (
                                                            <p className="mt-8 whitespace-pre-line text-[1.35rem] font-bold leading-relaxed" style={{ color: transitionCs.text, letterSpacing: language === 'kh' ? '0' : undefined }}>
                                                                {venueDetails || location}
                                                            </p>
                                                        )}
                                                        <div className="mx-auto mt-4 h-px w-44" style={{ background: `linear-gradient(90deg, transparent, ${transitionCs.primary}, transparent)` }} />
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                        {!isVideoUrl(activeTransitionMedia) && (
                            <div className="absolute inset-x-0 bottom-12 z-30 flex justify-center">
                                <button
                                    onClick={() => runSmoothTransition('details', 280)}
                                    className={language === 'kh' ? 'rounded-full px-6 py-2 text-sm' : 'rounded-full px-6 py-2 text-xs uppercase tracking-[0.35em]'}
                                    style={{ border: `1px solid ${transitionCs.border}`, backgroundColor: `${transitionCs.background}cc`, color: transitionCs.text, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: buttonFontFamily, fontWeight: buttonFontWeight, fontStyle: buttonTypographyStyle.fontStyle, fontSize: buttonFontSize }}
                                >
                                    {continueLabel}
                                </button>
                            </div>
                        )}
                    </motion.section>
                )}

                {phase === 'details' && (
                    <motion.section key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={shellClass} style={{ backgroundColor: detailCs.background }}>
                        <div className="fixed inset-0">{renderMediaBackground(backgroundVideoUrl || backgroundImageUrl, detailCs, 0.18)}</div>
                        <FrameOverlay url={detailFrameUrl} />
                        <PremiumGlowAura colorScheme={detailCs} />
                        <GoldenFall />
                        <Confetti />

                        <div className={`relative z-30 flex flex-col items-center px-5 pb-40 pt-6 text-center text-white ${stageClass}`}>
                            <div className="w-full max-w-[320px] px-5 pb-2 pt-4">
                                {heroPhoto && (
                                    <div className="flex justify-center">
                                        <BalloonPhotoFrame src={heroPhoto} alt="Celebration photo" />
                                    </div>
                                )}

                                <div className="mt-4">
                                    <motion.p
                                        className={language === 'kh' ? 'text-[1.45rem] leading-none text-[#f8e29a]' : 'text-[1.45rem] leading-none tracking-[0.02em] text-[#f8e29a]'}
                                        style={{ color: detailCs.primary, letterSpacing: language === 'kh' ? '0' : undefined, fontFamily: headlineFontFamily, fontSize: h2FontSize, fontStyle: h2TypographyStyle.fontStyle, fontWeight: h2TypographyStyle.fontWeight }}
                                        animate={{ y: [0, -2, 0], rotate: [0, 0.5, 0] }}
                                        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        {partyWord}
                                    </motion.p>
                                    <motion.p
                                        className="mt-1 text-[2.2rem] leading-[1] drop-shadow-[0_4px_10px_rgba(0,0,0,0.28)]"
                                        style={{ color: detailCs.text, fontFamily: headlineFontFamily, fontSize: h2FontSize, fontStyle: h2TypographyStyle.fontStyle, fontWeight: h2TypographyStyle.fontWeight }}
                                        animate={{ scale: [1, 1.02, 1], y: [0, -1, 0] }}
                                        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        {birthdayWord}
                                    </motion.p>
                                    <motion.h1
                                        className="mt-3 text-[1.85rem] leading-[1.08]"
                                        style={{ color: detailCs.primary, fontFamily: headlineFontFamily, fontSize: h1FontSize, fontStyle: h1TypographyStyle.fontStyle, fontWeight: h1TypographyStyle.fontWeight }}
                                        animate={{ textShadow: ['0 4px 10px rgba(0,0,0,0.18)', '0 8px 18px rgba(244,197,66,0.25)', '0 4px 10px rgba(0,0,0,0.18)'] }}
                                        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                                    >
                                        {displayName}
                                    </motion.h1>
                                    {logoUrl && (
                                        <div className="flex justify-center">
                                            <BirthdayLogoBadge src={logoUrl} alt="Birthday logo" />
                                        </div>
                                    )}
                                    {age !== null && (
                                        <div className="mt-4 flex justify-center">
                                            <PremiumAgeBadge
                                                age={age}
                                                language={language as 'kh' | 'en'}
                                                colorScheme={detailCs}
                                                detailFontFamily={detailFontFamily}
                                                numberFontFamily={h1FontFamily}
                                                bodyFontSize={bodyFontSize}
                                                bodyTypographyStyle={bodyTypographyStyle}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 w-full max-w-[320px] rounded-[28px] px-6 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', boxShadow: 'inset 0 0 24px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.4)' }}>
                                <div className="flex items-center justify-between gap-4 text-[0.92rem]" style={{ color: detailCs.text, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: 600 }}>
                                    <span className="min-w-0 flex-1 text-left uppercase tracking-[0.15em] opacity-80">{weekdayLabel}</span>
                                    <div className="relative">
                                        <div className="absolute -inset-2 rounded-full bg-white/10 blur-md" />
                                        <span className="relative rounded-full px-4 py-2 text-[1.65rem] font-bold leading-none" style={{ color: detailCs.primary, textShadow: '0 0 12px rgba(244,197,66,0.5)' }}>
                                            {dayLabel}
                                        </span>
                                    </div>
                                    <span className="min-w-0 flex-1 text-right uppercase tracking-[0.15em] opacity-80">{monthLabel}</span>
                                </div>
                                {timeLine && (
                                    <p className={language === 'kh' ? 'mt-3 text-sm font-medium' : 'mt-3 text-sm font-medium tracking-[0.04em]'} style={{ color: detailCs.textSecondary, letterSpacing: language === 'kh' ? '0' : undefined, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>
                                        {timeLine}
                                    </p>
                                )}
                                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <p className="mt-4 whitespace-pre-line text-base font-semibold leading-7" style={{ color: detailCs.text, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>
                                    {venueDetails || location}
                                </p>
                            </div>

                            <ScrollUpGuide
                                show={showScrollGuide}
                                label={scrollGuideLabel}
                                color="#FFE7A6"
                                textColor="#FFF9E8"
                                borderColor={detailCs.border}
                                className="fixed bottom-7 left-1/2 z-[95] flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-6"
                                lineClassName="h-20 w-[2px]"
                                labelClassName={language === 'kh' ? 'text-[13px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]' : 'text-xs drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]'}
                                iconSize={18}
                            />

                            <motion.div
                                initial={false}
                                animate={hasStartedDetailScroll ? { opacity: 1, y: 0 } : { opacity: 0, y: 64 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex flex-col items-center"
                            >
                                {invitationMessage && (
                                    <div className="mt-6 w-full max-w-[320px] rounded-[24px] px-6 py-6 shadow-[0_20px_48px_rgba(0,0,0,0.3)] backdrop-blur-md" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)' }}>
                                        <p className={language === 'kh' ? 'text-[0.95rem] font-bold' : 'text-[0.82rem] font-bold uppercase tracking-[0.2em]'} style={{ color: detailCs.primary, letterSpacing: language === 'kh' ? '0' : undefined, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle }}>
                                            {language === 'kh' ? 'លិខិតគោរពអញ្ជើញ' : 'Invitation'}
                                        </p>
                                        <div className="mt-4 h-px w-12 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${detailCs.primary}, transparent)` }} />
                                        <p className="mt-5 whitespace-pre-wrap text-[1.05rem] leading-relaxed opacity-90" style={{ color: detailCs.text, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: 400 }}>
                                            {invitationMessage}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                    <a
                                        href={googleCalendarUrl === '#' ? undefined : googleCalendarUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_26px_rgba(7,13,35,0.3)]"
                                        style={{ border: `1px solid ${detailCs.border}`, background: `linear-gradient(135deg, ${detailCs.background}, ${detailCs.secondary})`, color: detailCs.text, fontFamily: detailFontFamily, fontSize: buttonFontSize, fontStyle: buttonTypographyStyle.fontStyle, fontWeight: buttonFontWeight }}
                                    >
                                        <Calendar size={16} />
                                        <span>{addToCalendarLabel}</span>
                                    </a>
                                    {mapUrl && (
                                        <a
                                            href={mapUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_26px_rgba(7,13,35,0.3)]"
                                            style={{ border: `1px solid ${detailCs.border}`, background: `linear-gradient(135deg, ${detailCs.background}, ${detailCs.secondary})`, color: detailCs.text, fontFamily: detailFontFamily, fontSize: buttonFontSize, fontStyle: buttonTypographyStyle.fontStyle, fontWeight: buttonFontWeight }}
                                        >
                                            <MapPin size={16} />
                                            <span>{openMapLabel}</span>
                                        </a>
                                    )}
                                </div>

                                <div className="mt-6 w-full">
                                    <GalleryAlbum photos={albumPhotos} videos={albumVideos} colorScheme={detailCs} />
                                </div>
                                {paymentQrImageUrl && (
                                    <div className="mt-6 w-full max-w-[320px] rounded-[28px] px-5 py-5 shadow-[0_16px_34px_rgba(5,12,34,0.26)] backdrop-blur-md" style={{ border: `1px solid ${detailCs.border}`, background: `linear-gradient(180deg, ${detailCs.secondary}c9, ${detailCs.background}de)` }}>
                                        <p className={language === 'kh' ? 'text-[0.95rem] font-semibold' : 'text-[0.82rem] font-semibold tracking-[0.14em]'} style={{ color: detailCs.primary, letterSpacing: language === 'kh' ? '0' : undefined, textTransform: language === 'kh' ? 'none' : 'uppercase', fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>
                                            {paymentQrTitle}
                                        </p>
                                        <p className="mt-2 text-sm leading-6" style={{ color: detailCs.textSecondary, fontFamily: detailFontFamily, fontSize: bodyFontSize, fontStyle: bodyTypographyStyle.fontStyle, fontWeight: bodyTypographyStyle.fontWeight }}>
                                            {paymentQrHint}
                                        </p>
                                        <div className="mt-4 overflow-hidden rounded-[24px] bg-white p-3 shadow-[0_12px_24px_rgba(0,0,0,0.24)]">
                                            <img src={paymentQrImageUrl} alt="Payment QR" className="h-auto w-full rounded-[18px] object-contain" />
                                        </div>
                                    </div>
                                )}
                                <div className="mt-6 w-full max-w-[420px]">
                                    <DigitalWishesSection
                                        eventId={props.id}
                                        enabled={Boolean(props.featureLimits?.digitalWishes)}
                                        guestName={guestName}
                                        guestCode={props.code || props.shortCode}
                                        language={language as 'kh' | 'en'}
                                        colorScheme={detailCs}
                                    />
                                </div>
                                <InvitationCountdownSection eventDate={eventDate} featureLimits={props.featureLimits} colorScheme={detailCs} />
                                <AppFooter colorScheme={detailCs} />
                            </motion.div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {musicUrl && (
                <button
                    onClick={toggleMusic}
                    className={musicButtonClass}
                    style={{ border: `1px solid ${cs.border}`, backgroundColor: `${cs.background}cc`, color: cs.primary }}
                >
                    {isPlaying ? <Volume2 size={20} className="animate-pulse" /> : <VolumeX size={20} />}
                </button>
            )}
            {musicUrl && <audio ref={audioRef} src={musicUrl} loop playsInline className="hidden" />}
            <AnimatePresence>
                {showFade && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                        className={fadeOverlayClass}
                        style={{
                            background: `radial-gradient(circle at center, ${cs.accent}33 0%, ${cs.secondary}88 35%, ${cs.background} 100%)`,
                        }}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
