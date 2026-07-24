'use client';

import CountdownTimer from './CountdownTimer';

interface InvitationCountdownSectionProps {
    eventDate?: Date;
    featureLimits?: {
        addToCalendar?: boolean;
        [key: string]: any;
    };
    colorScheme?: {
        primary?: string;
        text?: string;
        textSecondary?: string;
        border?: string;
    };
    className?: string;
}

export default function InvitationCountdownSection({
    eventDate,
    featureLimits,
    colorScheme,
    className = '',
}: InvitationCountdownSectionProps) {
    if (!eventDate || !featureLimits?.addToCalendar) return null;

    return (
        <CountdownTimer
            targetDate={eventDate}
            colorScheme={colorScheme}
            className={className}
        />
    );
}
