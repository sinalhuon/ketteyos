'use client';

import React from 'react';
import { TemplateConfig } from './types';
import DefaultLayout from './layouts/DefaultLayout';
import ModernLayout from './layouts/ModernLayout';
import BlueArchLayout from '@/components/Invitation/layouts/BlueArchLayout';
// import TraditionalLayout from './layouts/TraditionalLayout';
// import RomanticLayout from './layouts/RomanticLayout';
// import MovieCeremonyLayout from './layouts/MovieCeremonyLayout';

interface TemplateEngineProps {
    templateConfig: TemplateConfig;
    children?: React.ReactNode;
    // Pass through all the InvitationView props
    guestName: string;
    eventTitle: string;
    eventDate: Date;
    location: string;
    eventType?: string | null;
    musicUrl?: string | null;
    logoUrl?: string | null;
    secondLogoUrl?: string | null;
    logoSize?: number | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    invitationMessage?: string | null;
    eventTime?: string | null;
    venueDetails?: string | null;
    mapUrl?: string | null;
    schedule?: string | null;
    albumPhotos?: any[];
    introVideoUrl?: string | null;
    transitionVideoUrl?: string | null;
    backgroundVideoUrl?: string | null;
    effectLayerUrl?: string | null;
    effectLayerOpacity?: number;
    effectLayerBlendMode?: string;
    guestStatus?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
    onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    scheduleItems?: any[];
    coupleTitles?: { groom: string; bride: string };
}

export default function TemplateEngine(props: TemplateEngineProps) {
    const { templateConfig, ...layoutProps } = props;

    // Render the appropriate layout based on the template configuration
    switch (templateConfig.layoutType) {
        case 'modern':
            return <ModernLayout config={templateConfig} {...layoutProps} />;
        
        case 'traditional':
            // return <TraditionalLayout config={templateConfig} {...layoutProps} />;
            // Fallback to default for now
            return <DefaultLayout config={templateConfig} {...layoutProps} />;
        
        case 'romantic':
            // return <RomanticLayout config={templateConfig} {...layoutProps} />;
            // Fallback to default for now
            return <DefaultLayout config={templateConfig} {...layoutProps} />;
        
        case 'movie-ceremony':
            // return <MovieCeremonyLayout config={templateConfig} {...layoutProps} />;
            // Fallback to default for now
            return <DefaultLayout config={templateConfig} {...layoutProps} />;

        case 'blue-arch':
            return <BlueArchLayout templateConfig={templateConfig} {...layoutProps} />;
        
        case 'default':
        default:
            return <DefaultLayout config={templateConfig} {...layoutProps} />;
    }
}
