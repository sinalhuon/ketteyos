'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    ArrowDown,
    ArrowUp,
    LayoutTemplate,
    MousePointerSquareDashed,
    Palette,
    PanelsTopLeft,
    PictureInPicture2,
    RotateCcw,
    Rows3,
    Sparkles,
    Type,
    Wand2,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import type { TemplateBuilderBlockType, TemplateConfig, TemplatePageConfig, TemplatePageKey, Typography } from './types';
import { defaultTemplateConfigs } from './configs/defaultConfigs';
import { colorSchemes } from './styles/colorSchemes';
import { typographyOptions } from './styles/typography';
import { animationPresets } from './styles/animations';
import InvitationView from '@/components/Invitation/InvitationView';
import { headingFontChoices, bodyFontChoices, khmerFontChoices } from '@/lib/template-fonts';

type PreviewPage = 'intro' | 'transition' | 'details';
type TemplateSelectorMode = 'full' | 'controls' | 'preview';
type BuilderPanel = 'structure' | 'style' | 'typography' | 'motion';

interface TemplateSelectorProps {
    onTemplateChange?: (config: TemplateConfig) => void;
    initialTemplate?: TemplateConfig;
    value?: TemplateConfig | null;
    mode?: TemplateSelectorMode;
    previewPage?: PreviewPage;
    onPreviewPageChange?: (page: PreviewPage) => void;
    editorPage?: TemplatePageKey;
    existingVideos?: {
        introVideoUrl?: string;
        transitionVideoUrl?: string;
        backgroundVideoUrl?: string;
        backgroundImageUrl?: string;
        logoUrl?: string;
        buttonImageUrl?: string;
        introFrameUrl?: string;
        transitionFrameUrl?: string;
        detailFrameUrl?: string;
    };
}

const layoutOptions = [
    { id: 'default', name: 'Golden Premium', description: 'Elegant gold-themed design with video backgrounds' },
    { id: 'modern', name: 'Modern Minimal', description: 'Clean, contemporary design with geometric elements' },
    { id: 'traditional', name: 'Traditional Heritage', description: 'Classic Khmer-inspired celebration layout for wedding or birthday events' },
    { id: 'romantic', name: 'Romantic Dreams', description: 'Soft floral storytelling layout for elegant celebrations' },
    { id: 'movie-ceremony', name: 'Movie Ceremony', description: 'Cinematic opening with dramatic transitions and spotlight moments' },
    { id: 'class-gold', name: 'Class Gold', description: 'Luxury modern gold design with premium typography' },
    { id: 'golden-grandeur', name: 'Golden Grandeur', description: 'Grand premium gold layout that also works well for one-person birthday invites' },
    { id: 'blush-ornate', name: 'Blush Ornate', description: 'Dusty rose ornamental invitation inspired by elegant card-style mobile invites' },
    { id: 'birthday-balloon', name: 'Birthday Balloon', description: 'Blue-and-gold birthday layout with circular photo, balloons, and a three-stage flow' },
    { id: 'botanical-arch', name: 'Botanical Arch', description: 'Soft lilac floral arch with elegant editorial typography and animated botanicals' },
    { id: 'blue-arch', name: 'Blue Arch', description: 'Reference-style vertical card positioning with calendar and venue icons over your video background' }
] as const;

const colorSchemeOptions = Object.keys(colorSchemes).map((key) => ({
    id: key,
    name: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    preview: colorSchemes[key]
}));

const typographyOptionsList = Object.keys(typographyOptions).map((key) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    preview: typographyOptions[key]
}));

const animationOptionsList = Object.keys(animationPresets).map((key) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    preview: animationPresets[key]
}));

const sectionLabelMap: Record<string, string> = {
    intro: 'Opening Screen',
    logo: 'Logo / Hero Mark',
    title: 'Event Title',
    parents: 'Parents / Family',
    couple: 'Main Names',
    details: 'Date & Time',
    venue: 'Venue',
    schedule: 'Schedule',
    gallery: 'Gallery',
    message: 'Invitation Message',
    'hero-photo': 'Hero Photo',
    rsvp: 'Smart RSVP',
    wishes: 'Digital Wishes',
    video: 'Embed Video',
    music: 'Background Music',
    calendar: 'Add To Calendar',
};

const experienceElements = [
    { id: 'rsvp', label: 'Smart RSVP', description: 'Interactive response area for accepting or declining attendance.' },
    { id: 'wishes', label: 'Digital Wishes', description: 'Guest blessing wall for messages and celebration notes.' },
    { id: 'video', label: 'Embed Video', description: 'Video gallery or embedded highlight reel section.' },
    { id: 'music', label: 'Background Music', description: 'Template-aware music control and ambient soundtrack support.' },
    { id: 'calendar', label: 'Add To Calendar', description: 'Quick calendar action for guests from the invitation.' },
] as const;

const quickEditElements: Record<PreviewPage, Array<{ id: string; type: TemplateBuilderBlockType; label: string; sample: string; englishKey?: keyof Typography; khmerKey?: keyof Typography }>> = {
    intro: [
        { id: 'intro-event-type', type: 'event-type', label: 'Event Type / Subtitle', sample: 'Wedding Ceremony', englishKey: 'englishH2Font', khmerKey: 'khmerH2Font' },
        { id: 'intro-guest-label', type: 'guest-name', label: 'Guest Label', sample: 'You Are Invited', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
        { id: 'intro-guest-name', type: 'guest-name', label: 'Guest Name', sample: 'Distinguished Guest', englishKey: 'englishH3Font', khmerKey: 'khmerH3Font' },
        { id: 'intro-main-names', type: 'main-names', label: 'Main Names / Main Title', sample: 'Sokha & Sophea', englishKey: 'englishH1Font', khmerKey: 'khmerH1Font' },
        { id: 'intro-button', type: 'button', label: 'Open Button', sample: 'Open Invitation', englishKey: 'englishButtonFont', khmerKey: 'khmerButtonFont' },
    ],
    transition: [
        { id: 'transition-event-type', type: 'event-type', label: 'Top Caption', sample: 'Save the Date', englishKey: 'englishH3Font', khmerKey: 'khmerH3Font' },
        { id: 'transition-main-names', type: 'main-names', label: 'Transition Main Title', sample: 'Wedding Ceremony', englishKey: 'englishH1Font', khmerKey: 'khmerH1Font' },
        { id: 'transition-date', type: 'date', label: 'Date / Time', sample: 'February 12, 2026', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
        { id: 'transition-location', type: 'location', label: 'Location', sample: 'Midtown 2004 Terk Tla', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
    ],
    details: [
        { id: 'details-main-names', type: 'main-names', label: 'Detail Headline', sample: 'Sokha & Sophea', englishKey: 'englishH1Font', khmerKey: 'khmerH1Font' },
        { id: 'details-date', type: 'date', label: 'Date / Time', sample: 'February 12, 2026', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
        { id: 'details-location', type: 'location', label: 'Venue / Location', sample: 'Midtown 2004 Terk Tla', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
        { id: 'details-message', type: 'message', label: 'Invitation Message', sample: 'We warmly invite you to celebrate with us.', englishKey: 'englishBodyFont', khmerKey: 'khmerBodyFont' },
        { id: 'details-button', type: 'button', label: 'Action Buttons', sample: 'Add to Calendar / Open Map', englishKey: 'englishButtonFont', khmerKey: 'khmerButtonFont' },
    ],
};

const typographySizeKeyMap: Partial<Record<keyof Typography, keyof Typography>> = {
    englishH1Font: 'englishH1SizePx',
    englishH2Font: 'englishH2SizePx',
    englishH3Font: 'englishH3SizePx',
    englishBodyFont: 'englishBodySizePx',
    englishButtonFont: 'englishButtonSizePx',
    khmerH1Font: 'khmerH1SizePx',
    khmerH2Font: 'khmerH2SizePx',
    khmerH3Font: 'khmerH3SizePx',
    khmerBodyFont: 'khmerBodySizePx',
    khmerButtonFont: 'khmerButtonSizePx',
};

const typographyStyleKeyMap: Partial<Record<keyof Typography, keyof Typography>> = {
    englishH1Font: 'englishH1Style',
    englishH2Font: 'englishH2Style',
    englishH3Font: 'englishH3Style',
    englishBodyFont: 'englishBodyStyle',
    englishButtonFont: 'englishButtonStyle',
    khmerH1Font: 'khmerH1Style',
    khmerH2Font: 'khmerH2Style',
    khmerH3Font: 'khmerH3Style',
    khmerBodyFont: 'khmerBodyStyle',
    khmerButtonFont: 'khmerButtonStyle',
};

const builderPanels: Array<{ id: BuilderPanel; label: string; icon: React.ComponentType<any> }> = [
    { id: 'structure', label: 'Structure', icon: LayoutTemplate },
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'motion', label: 'Motion', icon: Wand2 },
];

function getFallbackTemplate(initialTemplate?: TemplateConfig | null) {
    if (!initialTemplate) {
        return defaultTemplateConfigs.default;
    }

    const fallbackLayout = initialTemplate.layoutType || 'default';
    return {
        ...defaultTemplateConfigs[fallbackLayout],
        ...initialTemplate,
        colorScheme: initialTemplate.colorScheme || defaultTemplateConfigs[fallbackLayout].colorScheme,
        typography: initialTemplate.typography || defaultTemplateConfigs[fallbackLayout].typography,
        animations: initialTemplate.animations || defaultTemplateConfigs[fallbackLayout].animations,
        background: initialTemplate.background || defaultTemplateConfigs[fallbackLayout].background,
        arrangement: initialTemplate.arrangement || defaultTemplateConfigs[fallbackLayout].arrangement,
    };
}

function getPageOverrides(config: TemplateConfig, page?: TemplatePageKey): TemplatePageConfig {
    if (!page) return {};
    return config.pages?.[page] || {};
}

function mergeTemplateWithPageConfig(config: TemplateConfig, page?: TemplatePageKey): TemplateConfig {
    if (!page) return config;

    const pageOverrides = getPageOverrides(config, page);
    return {
        ...config,
        colorScheme: pageOverrides.colorScheme || config.colorScheme,
        typography: pageOverrides.typography || config.typography,
        animations: pageOverrides.animations || config.animations,
        background: pageOverrides.background || config.background,
        arrangement: pageOverrides.arrangement || config.arrangement,
        openButtonTextColor: pageOverrides.openButtonTextColor ?? config.openButtonTextColor,
    };
}

export default function TemplateSelector({
    onTemplateChange,
    initialTemplate,
    value,
    mode = 'full',
    previewPage,
    onPreviewPageChange,
    editorPage,
    existingVideos
}: TemplateSelectorProps) {
    const [previewZoom, setPreviewZoom] = useState(1);
    const previewScale = 0.19 * previewZoom;
    const previewInverseScale = `${(100 / previewScale).toFixed(2)}%`;
    const controlled = value !== undefined;
    const [internalConfig, setInternalConfig] = useState<TemplateConfig>(getFallbackTemplate(initialTemplate));
    const [internalPreviewPage, setInternalPreviewPage] = useState<PreviewPage>('intro');
    const [activePanel, setActivePanel] = useState<BuilderPanel>('structure');
    const [selectedQuickEditBlockId, setSelectedQuickEditBlockId] = useState<string | null>(null);

    useEffect(() => {
        if (controlled) return;
        setInternalConfig(getFallbackTemplate(initialTemplate));
    }, [controlled, initialTemplate]);

    const baseConfig = useMemo(
        () => getFallbackTemplate(controlled ? value : internalConfig),
        [controlled, internalConfig, value]
    );
    const activeConfig = useMemo(
        () => mergeTemplateWithPageConfig(baseConfig, editorPage),
        [baseConfig, editorPage]
    );

    const activePreviewPage = previewPage ?? internalPreviewPage;
    const blockEditorPage = activePreviewPage as TemplatePageKey;

    const updateConfig = (nextConfig: TemplateConfig) => {
        if (!controlled) {
            setInternalConfig(nextConfig);
        }
        onTemplateChange?.(nextConfig);
    };

    const patchConfig = (patch: Partial<TemplateConfig>) => {
        updateConfig({
            ...baseConfig,
            ...patch
        });
    };

    const patchCurrentPage = (patch: TemplatePageConfig) => {
        if (!editorPage) {
            patchConfig(patch as Partial<TemplateConfig>);
            return;
        }

        const existingPage = getPageOverrides(baseConfig, editorPage);
        updateConfig({
            ...baseConfig,
            pages: {
                ...(baseConfig.pages || {}),
                [editorPage]: {
                    ...existingPage,
                    ...patch,
                },
            },
        });
    };

    const patchSpecificPage = (page: TemplatePageKey, patch: TemplatePageConfig) => {
        const existingPage = getPageOverrides(baseConfig, page);
        updateConfig({
            ...baseConfig,
            pages: {
                ...(baseConfig.pages || {}),
                [page]: {
                    ...existingPage,
                    ...patch,
                },
            },
        });
    };

    const updateLayout = (layoutId: TemplateConfig['layoutType']) => {
        const layoutBase = defaultTemplateConfigs[layoutId];
        updateConfig({
            ...layoutBase,
            id: baseConfig.id || layoutBase.id,
            name: baseConfig.name || layoutBase.name,
            description: baseConfig.description || layoutBase.description,
            pages: baseConfig.pages,
        });
    };

    const updatePreviewPage = (page: PreviewPage) => {
        if (onPreviewPageChange) {
            onPreviewPageChange(page);
            return;
        }
        setInternalPreviewPage(page);
    };

    const previewEventType = activeConfig.layoutType === 'birthday-balloon' ? 'birthday' : 'wedding';
    const showControls = mode === 'full' || mode === 'controls';
    const showPreview = mode === 'full' || mode === 'preview';

    const builderStats = useMemo(() => ([
        { label: 'Layout', value: layoutOptions.find((layout) => layout.id === activeConfig.layoutType)?.name || activeConfig.layoutType },
        { label: 'Sections', value: String(activeConfig.arrangement?.sectionOrder?.length || 0) },
        { label: 'Motion', value: activeConfig.animations?.transitionStyle || 'default' },
    ]), [activeConfig]);

    const quickEditBlocks = quickEditElements[blockEditorPage as PreviewPage];

    const selectedQuickEditBlock = quickEditBlocks.find((block) => block.id === selectedQuickEditBlockId) || quickEditBlocks[0] || null;

    useEffect(() => {
        if (!quickEditBlocks.length) {
            setSelectedQuickEditBlockId(null);
            return;
        }
        if (!selectedQuickEditBlockId || !quickEditBlocks.some((block) => block.id === selectedQuickEditBlockId)) {
            setSelectedQuickEditBlockId(quickEditBlocks[0].id);
        }
    }, [quickEditBlocks, selectedQuickEditBlockId]);

    const updateArrangement = (patch: Partial<TemplateConfig['arrangement']>) => {
        const nextArrangement = {
            ...activeConfig.arrangement,
            ...patch,
        };

        if (editorPage) {
            patchCurrentPage({ arrangement: nextArrangement });
            return;
        }

        patchConfig({ arrangement: nextArrangement });
    };

    const updateSelectedQuickEditTypography = (key: keyof Typography, value: string) => {
        patchConfig({
            typography: {
                ...defaultTemplateConfigs[baseConfig.layoutType].typography,
                ...baseConfig.typography,
                [key]: value,
            },
        });
    };

    const updateSelectedQuickEditTypographySize = (key: keyof Typography, value: number) => {
        patchConfig({
            typography: {
                ...defaultTemplateConfigs[baseConfig.layoutType].typography,
                ...baseConfig.typography,
                [key]: value,
            },
        });
    };

    const updateSelectedQuickEditTypographyStyle = (key: keyof Typography, value: 'normal' | 'bold' | 'italic') => {
        patchConfig({
            typography: {
                ...defaultTemplateConfigs[baseConfig.layoutType].typography,
                ...baseConfig.typography,
                [key]: value,
            },
        });
    };

    const getSelectedQuickEditColor = () => {
        if (!selectedQuickEditBlock) return '#ffffff';
        const pageBlocks = getPageOverrides(baseConfig, blockEditorPage)?.blocks || [];
        const matchingBlock = pageBlocks.find((block) => block.id === selectedQuickEditBlock.id);
        return matchingBlock?.props?.color || '#ffffff';
    };

    const updateSelectedQuickEditColor = (color: string) => {
        if (!selectedQuickEditBlock) return;
        const pageConfig = getPageOverrides(baseConfig, blockEditorPage);
        const pageBlocks = pageConfig.blocks || [];
        const existingIndex = pageBlocks.findIndex((block) => block.id === selectedQuickEditBlock.id);
        const nextBlocks = [...pageBlocks];

        if (existingIndex >= 0) {
            nextBlocks[existingIndex] = {
                ...nextBlocks[existingIndex],
                type: nextBlocks[existingIndex].type || selectedQuickEditBlock.type,
                label: nextBlocks[existingIndex].label || selectedQuickEditBlock.label,
                visible: nextBlocks[existingIndex].visible ?? true,
                props: {
                    ...nextBlocks[existingIndex].props,
                    color,
                },
            };
        } else {
            nextBlocks.push({
                id: selectedQuickEditBlock.id,
                type: selectedQuickEditBlock.type,
                label: selectedQuickEditBlock.label,
                visible: true,
                props: {
                    color,
                },
            });
        }

        patchSpecificPage(blockEditorPage, {
            blocks: nextBlocks,
        });
    };

    const moveSection = (index: number, direction: -1 | 1) => {
        const currentOrder = [...(activeConfig.arrangement?.sectionOrder || [])];
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
        [currentOrder[index], currentOrder[targetIndex]] = [currentOrder[targetIndex], currentOrder[index]];
        updateArrangement({ sectionOrder: currentOrder });
    };

    const resetArrangement = () => {
        updateArrangement(defaultTemplateConfigs[activeConfig.layoutType].arrangement);
    };

    const alignmentOptions = [
        { value: 'left', label: 'Left', icon: AlignLeft },
        { value: 'center', label: 'Center', icon: AlignCenter },
        { value: 'right', label: 'Right', icon: AlignRight },
    ] as const;

    const photoOptions = [
        { value: 'top', label: 'Top' },
        { value: 'center', label: 'Center' },
        { value: 'side', label: 'Side' },
        { value: 'background', label: 'Background' },
    ] as const;

    const buttonOptions = [
        { value: 'bottom', label: 'Bottom' },
        { value: 'floating', label: 'Floating' },
        { value: 'side', label: 'Side' },
    ] as const;

    const spacingOptions = [
        { value: 'compact', label: 'Compact' },
        { value: 'normal', label: 'Normal' },
        { value: 'spacious', label: 'Spacious' },
    ] as const;

    return (
        <div className={`space-y-6 ${mode === 'full' ? 'rounded-lg border border-gray-100 bg-white p-6 shadow-lg dark:border-[#222] dark:bg-[#0a0a0a]' : ''}`}>
            {showControls && (
                <div className="space-y-6">
                    {mode === 'full' && (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Template Customization</h2>
                    )}

                    <section className="overflow-hidden rounded-[28px] border border-[#222] bg-[linear-gradient(160deg,#111419_0%,#0a0a0a_50%,#131313_100%)]">
                        <div className="border-b border-white/5 px-5 py-5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[#3a3215] bg-[#17120a] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#ffd76b]">
                                        <Sparkles size={12} />
                                        Builder Workspace
                                    </div>
                                    <h3 className="mt-3 text-xl font-semibold text-white">Template Builder</h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-400">Design faster with focused panels. Start with the structure, then refine style, type, and motion while the preview updates live.</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {builderStats.map((stat) => (
                                        <div key={stat.label} className="rounded-2xl border border-[#242424] bg-[#101010] px-4 py-3 text-center">
                                            <div className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{stat.label}</div>
                                            <div className="mt-1 text-sm font-semibold text-white">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-white/5 px-4 py-3">
                            <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                                {builderPanels.map((panel) => {
                                    const Icon = panel.icon;
                                    const active = activePanel === panel.id;
                                    return (
                                        <button
                                            key={panel.id}
                                            type="button"
                                            onClick={() => setActivePanel(panel.id)}
                                            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition ${active
                                                ? 'bg-[#FFD700] text-black'
                                                : 'border border-[#262626] bg-[#111] text-gray-300 hover:bg-[#181818]'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            <span>{panel.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-5">
                            {activePanel === 'structure' && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><LayoutTemplate size={18} /></div>
                                            <div>
                                                <h4 className="text-base font-semibold text-white">Layout Library</h4>
                                                <p className="text-sm text-gray-400">Choose the closest starting template before customizing details.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                            {layoutOptions.map((layout) => (
                                                <button
                                                    key={layout.id}
                                                    type="button"
                                                    className={`rounded-2xl border p-4 text-left transition ${activeConfig.layoutType === layout.id
                                                        ? 'border-[#FFD700] bg-[#171717] shadow-[0_0_0_1px_rgba(255,215,0,0.18)]'
                                                        : 'border-[#2a2a2a] bg-[#111] hover:border-[#444] hover:bg-[#151515]'
                                                        }`}
                                                    onClick={() => updateLayout(layout.id)}
                                                >
                                                    <div className="text-sm font-semibold text-white">{layout.name}</div>
                                                    <div className="mt-1 text-xs leading-5 text-gray-400">{layout.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><Rows3 size={18} /></div>
                                                    <div>
                                                        <h4 className="text-base font-semibold text-white">Section Order</h4>
                                                        <p className="text-sm text-gray-400">Reorder the invitation flow like drag-and-drop builder blocks.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={resetArrangement}
                                                    className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#111] px-3 py-2 text-xs text-gray-300 hover:border-[#FFD700] hover:text-white"
                                                >
                                                    <RotateCcw size={14} />
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {(activeConfig.arrangement.sectionOrder || []).map((section, index) => (
                                                    <div key={`${section}-${index}`} className="flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#111] px-4 py-3">
                                                        <div className="rounded-xl bg-[#171717] p-2 text-[#FFD700]">
                                                            <MousePointerSquareDashed size={15} />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-white">{sectionLabelMap[section] || section}</div>
                                                            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{section}</div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveSection(index, -1)}
                                                                disabled={index === 0}
                                                                className="rounded-xl border border-[#333] p-2 text-gray-300 hover:border-[#FFD700] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <ArrowUp size={15} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveSection(index, 1)}
                                                                disabled={index === (activeConfig.arrangement.sectionOrder?.length || 0) - 1}
                                                                className="rounded-xl border border-[#333] p-2 text-gray-300 hover:border-[#FFD700] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <ArrowDown size={15} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5 xl:col-span-2">
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <h4 className="text-base font-semibold text-white">Element Quick Edit</h4>
                                                    <p className="text-sm text-gray-400">Edit the selected preview page more directly. Pick an element, then change text, font, size, color, and alignment.</p>
                                                </div>
                                                <div className="rounded-full border border-[#333] bg-[#111] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-400">
                                                    {blockEditorPage}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                                                <div className="space-y-2">
                                                    {quickEditBlocks.map((block) => (
                                                        <button
                                                            key={block.id}
                                                            type="button"
                                                            onClick={() => setSelectedQuickEditBlockId(block.id)}
                                                            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedQuickEditBlock?.id === block.id ? 'border-[#FFD700] bg-[#171717]' : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'}`}
                                                        >
                                                            <div className="text-sm font-medium text-white">{block.label}</div>
                                                            <div className="mt-1 text-xs text-gray-500">{block.sample}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                    {selectedQuickEditBlock ? (
                                                        <div className="space-y-4">
                                                            <div className="rounded-xl border border-[#222] bg-[#0d0d0d] p-4 text-sm leading-6 text-gray-300">
                                                                <div className="font-semibold text-white">{selectedQuickEditBlock.label}</div>
                                                                <div className="mt-1 text-xs text-gray-500">This panel now edits the real invitation typography used by the preview for both Khmer and English.</div>
                                                                <div className="mt-3 rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-xs text-gray-400">
                                                                    Sample: {selectedQuickEditBlock.sample}
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">English Font</label>
                                                                    <select
                                                                        value={selectedQuickEditBlock.englishKey ? ((baseConfig.typography || {})[selectedQuickEditBlock.englishKey] as string || '') : ''}
                                                                        onChange={(e) => selectedQuickEditBlock.englishKey && updateSelectedQuickEditTypography(selectedQuickEditBlock.englishKey, e.target.value)}
                                                                        className="w-full rounded-xl border border-[#333] bg-[#0d0d0d] px-3 py-3 text-sm text-white outline-none focus:border-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.englishKey}
                                                                    >
                                                                        <option value="">Default</option>
                                                                        {[...headingFontChoices, ...bodyFontChoices.filter((font) => !headingFontChoices.some((existing) => existing.value === font.value))].map((font) => (
                                                                            <option key={font.value} value={font.value}>{font.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Khmer Font</label>
                                                                    <select
                                                                        value={selectedQuickEditBlock.khmerKey ? ((baseConfig.typography || {})[selectedQuickEditBlock.khmerKey] as string || '') : ''}
                                                                        onChange={(e) => selectedQuickEditBlock.khmerKey && updateSelectedQuickEditTypography(selectedQuickEditBlock.khmerKey, e.target.value)}
                                                                        className="w-full rounded-xl border border-[#333] bg-[#0d0d0d] px-3 py-3 text-sm text-white outline-none focus:border-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.khmerKey}
                                                                    >
                                                                        <option value="">Default</option>
                                                                        {khmerFontChoices.map((font) => (
                                                                            <option key={font.value} value={font.value}>{font.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">English Size</label>
                                                                    <input
                                                                        type="range"
                                                                        min={12}
                                                                        max={72}
                                                                        value={selectedQuickEditBlock.englishKey && typographySizeKeyMap[selectedQuickEditBlock.englishKey] ? Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] || 24) : 24}
                                                                        onChange={(e) => {
                                                                            const sizeKey = selectedQuickEditBlock.englishKey ? typographySizeKeyMap[selectedQuickEditBlock.englishKey] : undefined;
                                                                            if (sizeKey) updateSelectedQuickEditTypographySize(sizeKey, Number(e.target.value));
                                                                        }}
                                                                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.englishKey || !typographySizeKeyMap[selectedQuickEditBlock.englishKey]}
                                                                    />
                                                                    <div className="mt-2 text-sm text-gray-300">
                                                                        {selectedQuickEditBlock.englishKey && typographySizeKeyMap[selectedQuickEditBlock.englishKey]
                                                                            ? `${Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] || 24)}px`
                                                                            : 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Khmer Size</label>
                                                                    <input
                                                                        type="range"
                                                                        min={12}
                                                                        max={72}
                                                                        value={selectedQuickEditBlock.khmerKey && typographySizeKeyMap[selectedQuickEditBlock.khmerKey] ? Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] || 24) : 24}
                                                                        onChange={(e) => {
                                                                            const sizeKey = selectedQuickEditBlock.khmerKey ? typographySizeKeyMap[selectedQuickEditBlock.khmerKey] : undefined;
                                                                            if (sizeKey) updateSelectedQuickEditTypographySize(sizeKey, Number(e.target.value));
                                                                        }}
                                                                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.khmerKey || !typographySizeKeyMap[selectedQuickEditBlock.khmerKey]}
                                                                    />
                                                                    <div className="mt-2 text-sm text-gray-300">
                                                                        {selectedQuickEditBlock.khmerKey && typographySizeKeyMap[selectedQuickEditBlock.khmerKey]
                                                                            ? `${Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] || 24)}px`
                                                                            : 'N/A'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">English Style</label>
                                                                    <select
                                                                        value={selectedQuickEditBlock.englishKey && typographyStyleKeyMap[selectedQuickEditBlock.englishKey] ? ((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] as string || 'normal') : 'normal'}
                                                                        onChange={(e) => {
                                                                            const styleKey = selectedQuickEditBlock.englishKey ? typographyStyleKeyMap[selectedQuickEditBlock.englishKey] : undefined;
                                                                            if (styleKey) updateSelectedQuickEditTypographyStyle(styleKey, e.target.value as 'normal' | 'bold' | 'italic');
                                                                        }}
                                                                        className="w-full rounded-xl border border-[#333] bg-[#0d0d0d] px-3 py-3 text-sm text-white outline-none focus:border-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.englishKey || !typographyStyleKeyMap[selectedQuickEditBlock.englishKey]}
                                                                    >
                                                                        <option value="normal">Normal</option>
                                                                        <option value="bold">Bold</option>
                                                                        <option value="italic">Italic</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Khmer Style</label>
                                                                    <select
                                                                        value={selectedQuickEditBlock.khmerKey && typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] ? ((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] as string || 'normal') : 'normal'}
                                                                        onChange={(e) => {
                                                                            const styleKey = selectedQuickEditBlock.khmerKey ? typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] : undefined;
                                                                            if (styleKey) updateSelectedQuickEditTypographyStyle(styleKey, e.target.value as 'normal' | 'bold' | 'italic');
                                                                        }}
                                                                        className="w-full rounded-xl border border-[#333] bg-[#0d0d0d] px-3 py-3 text-sm text-white outline-none focus:border-[#FFD700]"
                                                                        disabled={!selectedQuickEditBlock.khmerKey || !typographyStyleKeyMap[selectedQuickEditBlock.khmerKey]}
                                                                    >
                                                                        <option value="normal">Normal</option>
                                                                        <option value="bold">Bold</option>
                                                                        <option value="italic">Italic</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Text Color</label>
                                                                <div className="flex items-center gap-3 rounded-xl border border-[#222] bg-[#0d0d0d] p-3">
                                                                    <input
                                                                        type="color"
                                                                        value={getSelectedQuickEditColor()}
                                                                        onChange={(e) => updateSelectedQuickEditColor(e.target.value)}
                                                                        className="h-12 w-14 cursor-pointer rounded-lg border border-[#333] bg-transparent"
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="text-sm text-white">{getSelectedQuickEditColor()}</div>
                                                                        <div className="text-xs text-gray-500">Used for the selected preview element when the layout supports per-element color.</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div className="rounded-xl border border-[#222] bg-[#0d0d0d] p-4">
                                                                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">English Preview</div>
                                                                    <div
                                                                        className="mt-3 text-lg text-white"
                                                                        style={{
                                                                            fontFamily: selectedQuickEditBlock.englishKey ? ((baseConfig.typography || {})[selectedQuickEditBlock.englishKey] as string || baseConfig.typography?.englishHeadingFont || baseConfig.typography?.headingFont) : (baseConfig.typography?.englishHeadingFont || baseConfig.typography?.headingFont),
                                                                            fontSize: selectedQuickEditBlock.englishKey && typographySizeKeyMap[selectedQuickEditBlock.englishKey] ? `${Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] || 24)}px` : undefined,
                                                                            fontStyle: selectedQuickEditBlock.englishKey && typographyStyleKeyMap[selectedQuickEditBlock.englishKey] ? ((((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] as string) || 'normal') === 'italic' ? 'italic' : 'normal') : 'normal',
                                                                            fontWeight: selectedQuickEditBlock.englishKey && typographyStyleKeyMap[selectedQuickEditBlock.englishKey] ? ((((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.englishKey] as keyof Typography] as string) || 'normal') === 'bold' ? 700 : 400) : 400,
                                                                            color: getSelectedQuickEditColor(),
                                                                        }}
                                                                    >
                                                                        {selectedQuickEditBlock.sample}
                                                                    </div>
                                                                </div>
                                                                <div className="rounded-xl border border-[#222] bg-[#0d0d0d] p-4">
                                                                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">Khmer Preview</div>
                                                                    <div
                                                                        className="mt-3 text-lg text-[#ffd76b]"
                                                                        style={{
                                                                            fontFamily: selectedQuickEditBlock.khmerKey ? ((baseConfig.typography || {})[selectedQuickEditBlock.khmerKey] as string || baseConfig.typography?.khmerHeadingFont || baseConfig.typography?.khmerFont) : (baseConfig.typography?.khmerHeadingFont || baseConfig.typography?.khmerFont),
                                                                            fontSize: selectedQuickEditBlock.khmerKey && typographySizeKeyMap[selectedQuickEditBlock.khmerKey] ? `${Number((baseConfig.typography || {})[typographySizeKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] || 24)}px` : undefined,
                                                                            fontStyle: selectedQuickEditBlock.khmerKey && typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] ? ((((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] as string) || 'normal') === 'italic' ? 'italic' : 'normal') : 'normal',
                                                                            fontWeight: selectedQuickEditBlock.khmerKey && typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] ? ((((baseConfig.typography || {})[typographyStyleKeyMap[selectedQuickEditBlock.khmerKey] as keyof Typography] as string) || 'normal') === 'bold' ? 700 : 400) : 400,
                                                                            color: getSelectedQuickEditColor(),
                                                                        }}
                                                                    >
                                                                        សូមគោរពអញ្ជើញ
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm leading-6 text-blue-100">
                                                                This quick edit now changes the real invitation font mapping, size, font style, and saved element color for the selected page.
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-xl border border-dashed border-[#333] p-4 text-sm text-gray-500">
                                                            Select an element to start editing.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activePanel === 'style' && (
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                    <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><Palette size={18} /></div>
                                            <div>
                                                <h4 className="text-base font-semibold text-white">Color Palette</h4>
                                                <p className="text-sm text-gray-400">Choose a ready-made visual mood for the full invitation.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {colorSchemeOptions.map((scheme) => (
                                                <button
                                                    key={scheme.id}
                                                    type="button"
                                                    className={`rounded-2xl border p-3 text-left transition ${JSON.stringify(activeConfig.colorScheme) === JSON.stringify(scheme.preview)
                                                        ? 'border-[#FFD700] bg-[#171717]'
                                                        : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'
                                                        }`}
                                                    onClick={() => editorPage ? patchCurrentPage({ colorScheme: scheme.preview }) : patchConfig({ colorScheme: scheme.preview })}
                                                >
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: scheme.preview.primary }} />
                                                        <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: scheme.preview.secondary }} />
                                                        <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: scheme.preview.accent }} />
                                                    </div>
                                                    <p className="text-sm font-medium text-white">{scheme.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><PictureInPicture2 size={18} /></div>
                                                <div>
                                                    <h4 className="text-base font-semibold text-white">Button Styling</h4>
                                                    <p className="text-sm text-gray-400">Keep the chosen button image but tune the readable text color.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                <input
                                                    type="color"
                                                    value={activeConfig.openButtonTextColor || '#000000'}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ openButtonTextColor: e.target.value }) : patchConfig({ openButtonTextColor: e.target.value })}
                                                    className="h-14 w-14 cursor-pointer rounded-xl border border-[#333] bg-transparent"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-gray-300">Optional custom text color for the invitation button.</p>
                                                    {activeConfig.openButtonTextColor && (
                                                        <button
                                                            type="button"
                                                            onClick={() => editorPage ? patchCurrentPage({ openButtonTextColor: undefined }) : patchConfig({ openButtonTextColor: undefined })}
                                                            className="mt-2 text-sm text-[#FFD700] hover:text-[#ffea75]"
                                                        >
                                                            Reset to layout default
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                            <h4 className="text-base font-semibold text-white">Current Palette</h4>
                                            <div className="mt-4 grid grid-cols-3 gap-3">
                                                {[
                                                    ['Primary', activeConfig.colorScheme.primary],
                                                    ['Secondary', activeConfig.colorScheme.secondary],
                                                    ['Accent', activeConfig.colorScheme.accent],
                                                ].map(([label, color]) => (
                                                    <div key={label} className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-3 text-center">
                                                        <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                                                        <div className="text-xs uppercase tracking-[0.16em] text-gray-500">{label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activePanel === 'typography' && (
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                    <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><Type size={18} /></div>
                                            <div>
                                                <h4 className="text-base font-semibold text-white">Typography Presets</h4>
                                                <p className="text-sm text-gray-400">Apply a coordinated text style, then override exact fonts below.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {typographyOptionsList.map((typography) => (
                                                <button
                                                    key={typography.id}
                                                    type="button"
                                                    className={`rounded-2xl border p-4 text-left transition ${JSON.stringify(activeConfig.typography) === JSON.stringify(typography.preview)
                                                        ? 'border-[#FFD700] bg-[#171717]'
                                                        : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'
                                                        }`}
                                                    onClick={() => editorPage ? patchCurrentPage({ typography: typography.preview }) : patchConfig({ typography: typography.preview })}
                                                >
                                                    <h4 className="mb-2 text-base text-white" style={{ fontFamily: typography.preview.headingFont }}>
                                                        {typography.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-400" style={{ fontFamily: typography.preview.bodyFont }}>
                                                        Sample body text in {typography.name.toLowerCase()} style
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><Type size={18} /></div>
                                            <div>
                                                <h4 className="text-base font-semibold text-white">Font Mapping</h4>
                                                <p className="text-sm text-gray-400">Choose the final fonts that will be used in the real invitation.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English Heading Font</label>
                                                <select
                                                    value={activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, headingFont: e.target.value, englishHeadingFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, headingFont: e.target.value, englishHeadingFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {headingFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English Body Font</label>
                                                <select
                                                    value={activeConfig.typography.englishBodyFont || activeConfig.typography.bodyFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, bodyFont: e.target.value, englishBodyFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, bodyFont: e.target.value, englishBodyFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {bodyFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English Button Font</label>
                                                <select
                                                    value={activeConfig.typography.englishButtonFont || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, englishButtonFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, englishButtonFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {headingFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English H1 Font</label>
                                                <select
                                                    value={activeConfig.typography.englishH1Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, englishH1Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, englishH1Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {headingFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English H2 Font</label>
                                                <select
                                                    value={activeConfig.typography.englishH2Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, englishH2Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, englishH2Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {headingFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">English H3 Font</label>
                                                <select
                                                    value={activeConfig.typography.englishH3Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, englishH3Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, englishH3Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {headingFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer Heading Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerFont: e.target.value, khmerHeadingFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerFont: e.target.value, khmerHeadingFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer Body Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerBodyFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerFont: e.target.value, khmerBodyFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerFont: e.target.value, khmerBodyFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer Button Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerButtonFont || activeConfig.typography.khmerBodyFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerButtonFont: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerButtonFont: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer H1 Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerH1Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerH1Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerH1Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer H2 Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerH2Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerH2Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerH2Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-gray-500">Khmer H3 Font</label>
                                                <select
                                                    value={activeConfig.typography.khmerH3Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont}
                                                    onChange={(e) => editorPage ? patchCurrentPage({ typography: { ...activeConfig.typography, khmerH3Font: e.target.value } }) : patchConfig({ typography: { ...activeConfig.typography, khmerH3Font: e.target.value } })}
                                                    className="w-full rounded-xl border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                                >
                                                    {khmerFontChoices.map((font) => (
                                                        <option key={font.value} value={font.value}>{font.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Live Type Sample</div>
                                                <div className="mt-3 text-2xl text-white" style={{ fontFamily: activeConfig.typography.englishH1Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont }}>Invitation H1</div>
                                                <div className="mt-2 text-xl text-[#f4d06f]" style={{ fontFamily: activeConfig.typography.englishH2Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont }}>Invitation H2</div>
                                                <div className="mt-2 text-lg text-white/90" style={{ fontFamily: activeConfig.typography.englishH3Font || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont }}>Invitation H3</div>
                                                <div className="mt-2 text-sm text-gray-300" style={{ fontFamily: activeConfig.typography.englishBodyFont || activeConfig.typography.bodyFont }}>Elegant body copy for invitations, schedules, and location details.</div>
                                                <button type="button" className="mt-3 rounded-full border border-[#3a3a3a] px-4 py-2 text-sm text-[#ffd76b]" style={{ fontFamily: activeConfig.typography.englishButtonFont || activeConfig.typography.englishHeadingFont || activeConfig.typography.headingFont }}>Open Invitation</button>
                                                <div className="mt-4 text-2xl text-[#ffd76b]" style={{ fontFamily: activeConfig.typography.khmerH1Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont }}>ការអញ្ជើញ H1</div>
                                                <div className="mt-2 text-xl text-[#ffe7a8]" style={{ fontFamily: activeConfig.typography.khmerH2Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont }}>ការអញ្ជើញ H2</div>
                                                <div className="mt-2 text-lg text-[#ffd76b]" style={{ fontFamily: activeConfig.typography.khmerH3Font || activeConfig.typography.khmerHeadingFont || activeConfig.typography.khmerFont }}>សូមគោរពអញ្ជើញ</div>
                                                <div className="mt-2 text-sm text-gray-300" style={{ fontFamily: activeConfig.typography.khmerBodyFont || activeConfig.typography.khmerFont }}>សូមអញ្ជើញចូលរួមក្នុងកម្មវិធីដ៏ពិសេសនេះជាមួយយើង។</div>
                                                <button type="button" className="mt-3 rounded-full border border-[#3a3a3a] px-4 py-2 text-sm text-[#ffd76b]" style={{ fontFamily: activeConfig.typography.khmerButtonFont || activeConfig.typography.khmerBodyFont || activeConfig.typography.khmerFont }}>បើកការអញ្ជើញ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activePanel === 'motion' && (
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="rounded-2xl bg-[#161616] p-2 text-[#FFD700]"><Wand2 size={18} /></div>
                                            <div>
                                                <h4 className="text-base font-semibold text-white">Animation Presets</h4>
                                                <p className="text-sm text-gray-400">Switch between calm, cinematic, or lively motion styles.</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                                            {animationOptionsList.map((animation) => (
                                                <button
                                                    key={animation.id}
                                                    type="button"
                                                    className={`rounded-2xl border p-4 text-left transition ${JSON.stringify(activeConfig.animations) === JSON.stringify(animation.preview)
                                                        ? 'border-[#FFD700] bg-[#171717]'
                                                        : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'
                                                        }`}
                                                    onClick={() => editorPage ? patchCurrentPage({ animations: animation.preview }) : patchConfig({ animations: animation.preview })}
                                                >
                                                    <h4 className="mb-1 text-sm font-semibold text-white">{animation.name}</h4>
                                                    <div className="space-y-1 text-xs text-gray-400">
                                                        <p>Duration: {animation.preview.entranceDuration}s</p>
                                                        <p>Style: {animation.preview.transitionStyle}</p>
                                                        <p>Hover: {animation.preview.hoverEffect}</p>
                                                        <p>Particles: {animation.preview.particleEffect ? 'On' : 'Off'}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5 xl:col-span-2">
                                            <h4 className="text-base font-semibold text-white">Motion Summary</h4>
                                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                                                <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Entrance</div>
                                                    <div className="mt-2 text-sm font-semibold text-white">{activeConfig.animations.entranceDuration}s</div>
                                                </div>
                                                <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Transition</div>
                                                    <div className="mt-2 text-sm font-semibold text-white">{activeConfig.animations.transitionStyle}</div>
                                                </div>
                                                <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
                                                    <div className="text-xs uppercase tracking-[0.18em] text-gray-500">Hover</div>
                                                    <div className="mt-2 text-sm font-semibold text-white">{activeConfig.animations.hoverEffect}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-5">
                                            <h4 className="text-base font-semibold text-white">Builder Note</h4>
                                            <p className="mt-3 text-sm leading-6 text-gray-400">This builder now behaves more like a structured page builder. The next step, if you want, is true drag-and-drop block editing with custom per-section controls.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {showPreview && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Live Preview</h3>
                            <p className="text-sm text-gray-400">See the actual invitation layout update as you design.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPreviewZoom((prev) => Math.max(0.8, Number((prev - 0.05).toFixed(2))))}
                                className="rounded-full bg-[#171717] p-2 text-gray-300 hover:bg-[#202020]"
                            >
                                <ZoomOut size={14} />
                            </button>
                            <div className="rounded-full bg-[#171717] px-3 py-1.5 text-xs font-medium text-gray-300">
                                {Math.round(previewZoom * 100)}%
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewZoom((prev) => Math.min(1.35, Number((prev + 0.05).toFixed(2))))}
                                className="rounded-full bg-[#171717] p-2 text-gray-300 hover:bg-[#202020]"
                            >
                                <ZoomIn size={14} />
                            </button>
                            {[
                                ['intro', 'Intro'],
                                ['transition', 'Transition'],
                                ['details', 'Details']
                            ].map(([id, label]) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => updatePreviewPage(id as PreviewPage)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${activePreviewPage === id
                                        ? 'bg-[#FFD700] text-black'
                                        : 'bg-[#171717] text-gray-300 hover:bg-[#202020]'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-[#222] bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.1),_transparent_42%),linear-gradient(180deg,#131822_0%,#0b0b0d_100%)] p-4 shadow-2xl">
                        <div className="mx-auto w-full max-w-[312px] rounded-[32px] border border-white/10 bg-black p-3 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
                            <div className="rounded-[24px] border border-white/5 bg-[#040404] p-1">
                                <div className="overflow-hidden rounded-[20px] bg-white dark:bg-gray-900" style={{ aspectRatio: '9/16' }}>
                                    <div className="h-full w-full overflow-hidden">
                                        <div
                                            className="origin-top-left"
                                            style={{
                                                transform: `scale(${previewScale})`,
                                                width: previewInverseScale,
                                                height: previewInverseScale,
                                            }}
                                        >
                                            <InvitationView
                                                guestName={previewEventType === 'birthday' ? 'Distinguished Guest' : 'Mr. Sina Huon'}
                                                eventTitle={previewEventType === 'birthday' ? 'Birthday Party' : 'Wedding Ceremony'}
                                                eventDate={new Date('2026-08-10T20:00:00')}
                                                birthDate={previewEventType === 'birthday' ? '2000-08-10' : undefined}
                                                location="Saffron Banquet Hall, DND Road, Noida"
                                                eventType={previewEventType}
                                                logoUrl={existingVideos?.logoUrl || ''}
                                                groomFirstName={previewEventType === 'birthday' ? 'Sina' : 'Sokha'}
                                                groomLastName={previewEventType === 'birthday' ? 'Huon' : 'Huon'}
                                                brideFirstName={previewEventType === 'birthday' ? '' : 'Sophea'}
                                                brideLastName={previewEventType === 'birthday' ? '' : 'Chan'}
                                                invitationMessage={previewEventType === 'birthday'
                                                    ? 'Please join us for a joyful birthday celebration filled with laughter, memories, and a wonderful evening together.'
                                                    : 'We warmly invite you to celebrate our wedding and share this meaningful day with us.'}
                                                venueDetails="Midtown 2004 Terk Tla, Phnom Penh"
                                                mapUrl="https://maps.google.com"
                                                schedule={JSON.stringify([])}
                                                albumPhotos={[]}
                                                albumVideos={[]}
                                                introVideoUrl={existingVideos?.introVideoUrl}
                                                transitionVideoUrl={existingVideos?.transitionVideoUrl}
                                                backgroundVideoUrl={existingVideos?.backgroundVideoUrl}
                                                backgroundImageUrl={existingVideos?.backgroundImageUrl}
                                                introFrameUrl={existingVideos?.introFrameUrl}
                                                transitionFrameUrl={existingVideos?.transitionFrameUrl}
                                                detailFrameUrl={existingVideos?.detailFrameUrl}
                                                buttonImageUrl={existingVideos?.buttonImageUrl}
                                                templateConfig={activeConfig}
                                                previewPage={activePreviewPage}
                                                showLanguageToggle={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                            <div className="rounded-2xl border border-[#222] bg-[#111] p-3 text-center">
                                <div className="mx-auto mb-2 h-7 w-7 rounded-full border border-white/10" style={{ backgroundColor: activeConfig.colorScheme.primary }} />
                                <p className="text-gray-400">Primary</p>
                            </div>
                            <div className="rounded-2xl border border-[#222] bg-[#111] p-3 text-center">
                                <div className="mx-auto mb-2 h-7 w-7 rounded-full border border-white/10" style={{ backgroundColor: activeConfig.colorScheme.secondary }} />
                                <p className="text-gray-400">Secondary</p>
                            </div>
                            <div className="rounded-2xl border border-[#222] bg-[#111] p-3 text-center">
                                <div className="mx-auto mb-2 h-7 w-7 rounded-full border border-white/10" style={{ backgroundColor: activeConfig.colorScheme.accent }} />
                                <p className="text-gray-400">Accent</p>
                            </div>
                        </div>

                        <div className="mt-3 rounded-2xl border border-[#222] bg-[#111] p-4">
                            <p className="mb-1 text-xs text-white" style={{ fontFamily: activeConfig.typography.headingFont }}>
                                Heading Style: Aa Bb Cc
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: activeConfig.typography.bodyFont }}>
                                Body Style: The quick brown fox jumps over the lazy dog
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
