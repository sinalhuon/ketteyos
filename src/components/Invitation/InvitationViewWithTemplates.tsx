'use client';

import React from 'react';
import { TemplateEngine, defaultTemplateConfigs, TemplateConfig } from '../Templates';
import { EventType } from '@/lib/event-types';

interface InvitationViewWithTemplatesProps {
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
    templateId?: string;
    introFrameUrl?: string | null;
    transitionFrameUrl?: string | null;
    detailFrameUrl?: string | null;
    scheduleItems?: any[];
    coupleTitles?: { groom: string; bride: string };
}

export default function InvitationViewWithTemplates(props: InvitationViewWithTemplatesProps) {
    // Determine which template to use
    const getTemplateConfig = (): TemplateConfig => {
        // If templateId is provided, try to find matching config
        if (props.templateId) {
            const templateMap: Record<string, keyof typeof defaultTemplateConfigs> = {
                'modern': 'modern',
                'traditional': 'traditional',
                'romantic': 'romantic',
                'movie-ceremony': 'movie-ceremony',
                'golden-grandeur': 'golden-grandeur',
                'blush-ornate': 'blush-ornate',
                'birthday-balloon': 'birthday-balloon',
                'blue-arch': 'blue-arch',
                'frame-floral': 'traditional', // Map frame templates to traditional
                'frame-elegant': 'traditional',
                'premium-gold': 'default',
                'classic': 'default',
                'default': 'default'
            };

            const layoutType = templateMap[props.templateId];
            if (layoutType && defaultTemplateConfigs[layoutType]) {
                return defaultTemplateConfigs[layoutType];
            }
        }

        // Default to default template
        return defaultTemplateConfigs.default;
    };

    const templateConfig = getTemplateConfig();

    return (
        <TemplateEngine 
            templateConfig={templateConfig}
            {...props}
        />
    );
}
