'use client';

import { useState, useEffect } from 'react';
import { toKhmerNumber } from '@/lib/khmer-utils';
import { useLanguage } from '@/context/LanguageContext';

interface CountdownTimerProps {
    targetDate: Date;
    className?: string;
    colorScheme?: {
        primary?: string;
        text?: string;
        textSecondary?: string;
        border?: string;
    };
}

export default function CountdownTimer({ targetDate, className = '', colorScheme }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [isExpired, setIsExpired] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setIsExpired(true);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (isExpired) return null;

    const primary = colorScheme?.primary || '#EEC573';
    const text = colorScheme?.text || primary;
    const textSecondary = colorScheme?.textSecondary || 'rgba(255,255,255,0.7)';
    const border = colorScheme?.border || 'rgba(238,197,115,0.3)';

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="rounded-lg border-2 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(238,197,115,0.1)]" style={{ backgroundColor: `${primary}10`, borderColor: border }}>
                <span className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Moul, serif', color: text }}>
                    {toKhmerNumber(value)}
                </span>
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-widest" style={{ fontFamily: 'KantumruyPro, sans-serif', color: textSecondary }}>
                {label}
            </span>
        </div>
    );

    return (
        <div className={`py-8 animate-fade-in-up ${className}`}>
            <p className="text-sm text-center mb-6" style={{ fontFamily: 'Moul, serif', color: text }}>
                {t('countdown.title')}
            </p>
            <div className="flex justify-center gap-4 md:gap-8">
                <TimeUnit value={timeLeft.days} label={t('countdown.days')} />
                <TimeUnit value={timeLeft.hours} label={t('countdown.hours')} />
                <TimeUnit value={timeLeft.minutes} label={t('countdown.minutes')} />
                <TimeUnit value={timeLeft.seconds} label={t('countdown.seconds')} />
            </div>
        </div>
    );
}
