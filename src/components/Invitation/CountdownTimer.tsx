'use client';

import { useState, useEffect } from 'react';
import { toKhmerNumber } from '@/lib/khmer-utils';

interface CountdownTimerProps {
    targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [isExpired, setIsExpired] = useState(false);

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

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-[#EEC573]/10 border-2 border-[#EEC573]/30 rounded-lg w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(238,197,115,0.1)]">
                <span className="text-[#EEC573] text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Moul, serif' }}>
                    {toKhmerNumber(value)}
                </span>
            </div>
            <span className="text-white/70 text-[10px] md:text-xs uppercase tracking-widest" style={{ fontFamily: 'KantumruyPro, sans-serif' }}>
                {label}
            </span>
        </div>
    );

    return (
        <div className="py-8 animate-fade-in-up">
            <p className="text-[#EEC573] text-sm text-center mb-6" style={{ fontFamily: 'Moul, serif' }}>
                រាប់ថយក្រោយ
            </p>
            <div className="flex justify-center gap-4 md:gap-8">
                <TimeUnit value={timeLeft.days} label="ថ្ងៃ" />
                <TimeUnit value={timeLeft.hours} label="ម៉ោង" />
                <TimeUnit value={timeLeft.minutes} label="នាទី" />
                <TimeUnit value={timeLeft.seconds} label="វិនាទី" />
            </div>
        </div>
    );
}
