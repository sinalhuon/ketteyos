'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch, auth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowDown, ArrowUp, AlignLeft, AlignCenter, AlignRight, GripVertical, Layers3, MousePointerSquareDashed, Plus, Save, Trash2, Type, Upload, Video, Image as ImageIcon, Sparkles, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/components/Toast';
import TemplateSelector from '@/components/Templates/TemplateSelector';
import type { TemplateBuilderBlock, TemplateBuilderBlockType, TemplateConfig, TemplatePageConfig, TemplatePageKey } from '@/components/Templates';
import { bodyFontChoices, headingFontChoices, khmerFontChoices } from '@/lib/template-fonts';

const TEMPLATE_PAGES: Array<{ id: TemplatePageKey; label: string; description: string }> = [
    { id: 'intro', label: 'Opening Page', description: 'Guest intro, event type, and open button' },
    { id: 'transition', label: 'Transition Page', description: 'Between-screen animation, video, or poster moment' },
    { id: 'details', label: 'Detail Page', description: 'Final event information, message, and venue details' },
];

const BLOCK_LIBRARY: Array<{ type: TemplateBuilderBlockType; label: string; sample: string }> = [
    { type: 'event-type', label: 'Event Type', sample: 'Wedding Ceremony' },
    { type: 'guest-name', label: 'Guest Name', sample: 'Distinguished Guest' },
    { type: 'main-names', label: 'Main Names', sample: 'Sokha & Sophea' },
    { type: 'date', label: 'Date / Time', sample: 'February 12, 2026' },
    { type: 'location', label: 'Location', sample: 'Midtown 2004 Terk Tla' },
    { type: 'button', label: 'Button', sample: 'Open Invitation' },
    { type: 'message', label: 'Message', sample: 'We warmly invite you to celebrate with us.' },
    { type: 'logo', label: 'Logo / Photo', sample: 'Logo or hero image' },
];

const BLOCK_FONT_OPTIONS = [
    ...headingFontChoices,
    ...bodyFontChoices.filter((font) => !headingFontChoices.some((existing) => existing.value === font.value)),
    ...khmerFontChoices.filter((font) => !headingFontChoices.some((existing) => existing.value === font.value) && !bodyFontChoices.some((existing) => existing.value === font.value)),
];

export default function EditTemplateClient({ id }: { id: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [previewPage, setPreviewPage] = useState<'intro' | 'transition' | 'details'>('intro');
    const [builderPage, setBuilderPage] = useState<TemplatePageKey>('intro');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [dragBlockId, setDragBlockId] = useState<string | null>(null);
    const [builderZoom, setBuilderZoom] = useState(1);
    const [livePreviewZoom, setLivePreviewZoom] = useState(1);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        codeKey: '',
        category: 'Universal',
        previewUrl: '',
        isActive: true,
        introVideoUrl: '',
        transitionVideoUrl: '',
        backgroundVideoUrl: '',
        backgroundImageUrl: '',
        effectLayerUrl: '',
        effectLayerOpacity: 1.0,
        effectLayerBlendMode: 'screen',
        introFrameUrl: '',
        transitionFrameUrl: '',
        detailFrameUrl: '',
        buttonImageUrl: '',
        effectLayerAnimation: '',
        description: '',
        templateConfig: null as any
    });

    useEffect(() => {
        if (!isNew) {
            fetchTemplate();
        }
    }, [id]);

    const fetchTemplate = async () => {
        try {
            const data = await apiFetch(`admin.php?action=template&id=${id}`);
            if (data.success && data.template) {
                const t = data.template;
                setFormData({
                    name: t.name || '',
                    codeKey: t.codeKey || '',
                    category: t.category || 'Universal',
                    previewUrl: t.previewUrl || '',
                    isActive: t.isActive == 1 || t.isActive === true,
                    introVideoUrl: t.introVideoUrl || '',
                    transitionVideoUrl: t.transitionVideoUrl || '',
                    backgroundVideoUrl: t.backgroundVideoUrl || '',
                    backgroundImageUrl: t.backgroundImageUrl || '',
                    effectLayerUrl: t.effectLayerUrl || '',
                    effectLayerOpacity: t.effectLayerOpacity ? parseFloat(t.effectLayerOpacity) : 1.0,
                    effectLayerBlendMode: t.effectLayerBlendMode || 'screen',
                    introFrameUrl: t.introFrameUrl || '',
                    transitionFrameUrl: t.transitionFrameUrl || '',
                    detailFrameUrl: t.detailFrameUrl || '',
                    buttonImageUrl: t.buttonImageUrl || '',
                    effectLayerAnimation: t.effectLayerAnimation || '',
                    description: t.description || '',
                    templateConfig: t.templateConfig ? (typeof t.templateConfig === 'string' ? JSON.parse(t.templateConfig) : t.templateConfig) : null
                });
            } else {
                toast.info('Template not found');
                router.push('/admin/templates');
            }
        } catch (e) {
            console.error('Failed to fetch template', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const body = {
                ...formData,
                isActive: formData.isActive ? 1 : 0,
                id: isNew ? undefined : id,
                templateConfig: formData.templateConfig ? JSON.stringify(formData.templateConfig) : null
            };

            const res = await apiFetch('admin.php?action=template', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (res.success) {
                // If new, redirect to list or the new edit page? Redirect to list is safer.
                router.push('/admin/templates');
            } else {
                toast.error(res.error || 'Operation failed');
            }
        } catch (e) {
            toast.error('Error saving template');
        } finally {
            setSaving(false);
        }
    };

    const isVideoUrl = (url: string) => /\.(mp4|mov|webm|ogg)$/i.test(url);

    // Sub-component for uploading assets (reused)
    const AssetUploader = ({ label, value, onChange, type = 'any' }: any) => {
        const [uploading, setUploading] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        const handleUpload = async (file: File) => {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            // If type is 'any', decide based on file mime
            const uploadType = type === 'any' ? (file.type.startsWith('video/') ? 'video' : 'image') : type;
            formData.append('type', uploadType);

            try {
                const token = auth.getToken();
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
                const res = await fetch(`${API_BASE}/upload.php`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await res.json();
                if (data.success) {
                    onChange(data.url);
                } else {
                    toast.error('Upload failed');
                }
            } catch (e) {
                toast.error('Error uploading');
            } finally {
                setUploading(false);
            }
        };

        const isVideo = value && isVideoUrl(value);

        return (
            <div className="space-y-2 relative group-upload">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-gray-400">{label}</label>
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="bg-red-500 text-white p-1 rounded-full opacity-60 hover:opacity-100 transition"
                            title="Remove"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>

                <div
                    onClick={() => inputRef.current?.click()}
                    className={`relative aspect-video rounded-xl border-2 border-dashed ${value ? 'border-transparent' : 'border-[#333] hover:border-gray-500'} bg-[#111] overflow-hidden cursor-pointer transition-colors flex items-center justify-center`}
                >
                    {value ? (
                        isVideo ? (
                            <>
                                <video src={value} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-upload-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">Click to Replace</span>
                                </div>
                            </>
                        ) : (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        )
                    ) : (
                        <div className="text-center p-4">
                            {uploading ? (
                                <div className="text-[#FFD700] text-xs">Uploading...</div>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-2 text-gray-500">
                                        <Upload size={18} />
                                    </div>
                                    <span className="text-xs text-gray-500">Upload Media</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
            </div>
        );
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading...</div>;

    const previewMedia = {
        introVideoUrl: formData.introVideoUrl,
        transitionVideoUrl: formData.transitionVideoUrl,
        backgroundVideoUrl: formData.backgroundVideoUrl,
        backgroundImageUrl: formData.backgroundImageUrl,
        logoUrl: formData.previewUrl,
        buttonImageUrl: formData.buttonImageUrl,
        introFrameUrl: formData.introFrameUrl,
        transitionFrameUrl: formData.transitionFrameUrl,
        detailFrameUrl: formData.detailFrameUrl,
    };

    const templateConfig = formData.templateConfig as TemplateConfig | null;
    const currentPageConfig = (templateConfig?.pages?.[builderPage] || {}) as TemplatePageConfig;

    const createBlock = (type: TemplateBuilderBlockType): TemplateBuilderBlock => {
        const libraryItem = BLOCK_LIBRARY.find((item) => item.type === type);
        return {
            id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type,
            label: libraryItem?.label || type,
            visible: true,
            props: {
                text: libraryItem?.sample || type,
                color: '#FFFFFF',
                backgroundColor: type === 'button' ? '#1f3d8f' : 'transparent',
                fontFamily: type === 'button'
                    ? 'Cinzel, serif'
                    : type === 'guest-name' || type === 'main-names'
                        ? 'Playfair Display, serif'
                        : 'Lato, sans-serif',
                fontSize: type === 'guest-name' ? 28 : type === 'event-type' ? 16 : 18,
                align: 'center',
                weight: type === 'guest-name' || type === 'main-names' ? 'bold' : 'medium',
                radius: type === 'button' ? 18 : 0,
                padding: type === 'button' ? 12 : 6,
            }
        };
    };

    const defaultPageBlocks = useMemo<Record<TemplatePageKey, TemplateBuilderBlock[]>>(() => ({
        intro: ['event-type', 'guest-name', 'main-names', 'button'].map((type) => createBlock(type as TemplateBuilderBlockType)),
        transition: ['event-type', 'main-names', 'date', 'location'].map((type) => createBlock(type as TemplateBuilderBlockType)),
        details: ['logo', 'main-names', 'date', 'location', 'message', 'button'].map((type) => createBlock(type as TemplateBuilderBlockType)),
    }), []);

    const currentBlocks = currentPageConfig.blocks && currentPageConfig.blocks.length > 0
        ? currentPageConfig.blocks
        : defaultPageBlocks[builderPage];
    const selectedBlock = currentBlocks.find((block) => block.id === selectedBlockId) || currentBlocks[0] || null;

    const updateCurrentPageConfig = (patch: TemplatePageConfig) => {
        setFormData((prev) => ({
            ...prev,
            templateConfig: {
                ...(prev.templateConfig || {}),
                pages: {
                    ...((prev.templateConfig as TemplateConfig | null)?.pages || {}),
                    [builderPage]: {
                        ...(((prev.templateConfig as TemplateConfig | null)?.pages || {})[builderPage] || {}),
                        ...patch,
                    }
                }
            }
        }));
    };

    const persistBlocks = (blocks: TemplateBuilderBlock[]) => {
        updateCurrentPageConfig({ blocks });
        if (!selectedBlockId && blocks[0]) {
            setSelectedBlockId(blocks[0].id);
        }
    };

    const addBlock = (type: TemplateBuilderBlockType) => {
        const nextBlock = createBlock(type);
        const nextBlocks = [...currentBlocks, nextBlock];
        persistBlocks(nextBlocks);
        setSelectedBlockId(nextBlock.id);
    };

    const updateSelectedBlock = (patch: Partial<TemplateBuilderBlock>) => {
        if (!selectedBlock) return;
        const nextBlocks = currentBlocks.map((block) => block.id === selectedBlock.id ? {
            ...block,
            ...patch,
            props: {
                ...block.props,
                ...(patch as TemplateBuilderBlock).props,
            }
        } : block);
        persistBlocks(nextBlocks);
    };

    const removeSelectedBlock = () => {
        if (!selectedBlock) return;
        const nextBlocks = currentBlocks.filter((block) => block.id !== selectedBlock.id);
        persistBlocks(nextBlocks);
        setSelectedBlockId(nextBlocks[0]?.id || null);
    };

    const moveSelectedBlock = (direction: -1 | 1) => {
        if (!selectedBlock) return;
        const currentIndex = currentBlocks.findIndex((block) => block.id === selectedBlock.id);
        const nextIndex = currentIndex + direction;
        if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentBlocks.length) return;
        const nextBlocks = [...currentBlocks];
        [nextBlocks[currentIndex], nextBlocks[nextIndex]] = [nextBlocks[nextIndex], nextBlocks[currentIndex]];
        persistBlocks(nextBlocks);
    };

    useEffect(() => {
        if (!currentBlocks.length) {
            setSelectedBlockId(null);
            return;
        }
        if (!selectedBlockId || !currentBlocks.some((block) => block.id === selectedBlockId)) {
            setSelectedBlockId(currentBlocks[0].id);
        }
    }, [builderPage, currentBlocks, selectedBlockId]);

    const AssetSelector = ({ value, onChange, type = 'VIDEO' }: { value: string, onChange: (val: string) => void, type?: 'VIDEO' | 'IMAGE' | 'ALL' }) => {
        const [assets, setAssets] = useState<any[]>([]);
        const [folders, setFolders] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);
        const [selectedFolderId, setSelectedFolderId] = useState<string>('all');

        useEffect(() => {
            fetchAssets();
        }, []);

        useEffect(() => {
            if (!value) {
                setSelectedFolderId('all');
                return;
            }

            const matchingAsset = assets.find((asset) => asset.url === value);
            if (matchingAsset?.folderId) {
                setSelectedFolderId(matchingAsset.folderId);
            } else if (matchingAsset) {
                setSelectedFolderId('root');
            }
        }, [assets, value]);

        const fetchAssets = async () => {
            setLoading(true);
            try {
                const data = await apiFetch('admin.php?action=assets');
                if (data.success) {
                    const fetchedAssets = type === 'ALL'
                        ? data.assets
                        : data.assets.filter((a: any) => a.type === type);
                    setAssets(fetchedAssets);
                    setFolders(data.folders || []);
                }
            } catch (e) {
                console.error('Failed to fetch assets', e);
            } finally {
                setLoading(false);
            }
        };

        const folderPathMap = useMemo(() => {
            const map = new Map<string, string>();
            const folderById = new Map<string, any>((folders || []).map((folder) => [folder.id, folder]));

            const buildPath = (folderId: string | null | undefined): string => {
                if (!folderId) return 'Root';
                if (map.has(folderId)) return map.get(folderId)!;

                const segments: string[] = [];
                let current = folderById.get(folderId);
                while (current) {
                    segments.unshift(current.name);
                    current = current.parentId ? folderById.get(current.parentId) : null;
                }
                const path = segments.length ? segments.join(' / ') : 'Root';
                map.set(folderId, path);
                return path;
            };

            folders.forEach((folder) => {
                buildPath(folder.id);
            });

            return map;
        }, [folders]);

        const visibleAssets = useMemo(() => {
            if (selectedFolderId === 'all') return assets;
            if (selectedFolderId === 'root') return assets.filter((asset) => !asset.folderId);
            return assets.filter((asset) => asset.folderId === selectedFolderId);
        }, [assets, selectedFolderId]);

        const folderChoices = useMemo(() => {
            const base = [{ id: 'all', label: 'All Folders' }, { id: 'root', label: 'Root' }];
            const nested = folders.map((folder) => ({
                id: folder.id,
                label: folderPathMap.get(folder.id) || folder.name,
            }));
            return [...base, ...nested];
        }, [folders, folderPathMap]);

        return (
            <div className="mt-2 space-y-2">
                <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                    <select
                        value={selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value)}
                        className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs text-gray-300 outline-none transition-colors focus:border-[#FFD700]"
                    >
                        {folderChoices.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                                {folder.label}
                            </option>
                        ))}
                    </select>
                    {loading && <div className="flex items-center text-xs text-gray-500">Loading global assets...</div>}
                </div>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-xs text-gray-300 focus:border-[#FFD700] outline-none appearance-none transition-colors"
                >
                    <option value="">
                        {selectedFolderId === 'all' ? 'Select from Global Assets...' : 'Select asset from this folder...'}
                    </option>
                    {visibleAssets.map(asset => (
                        <option key={asset.id} value={asset.url}>
                            {(folderPathMap.get(asset.folderId) || (asset.folderId ? 'Folder' : 'Root'))} / {asset.name} ({asset.type})
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-[1700px] space-y-6 p-8 lg:p-10">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft size={20} /> <span className="text-sm">Back to Templates</span>
                    </button>
                </div>
                {!isNew && (
                    <div className="px-3 py-1 bg-[#222] rounded-lg border border-[#333] text-xs font-mono text-gray-400">
                        ID: {id}
                    </div>
                )}
            </header>

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{isNew ? 'Create Template' : 'Edit Template'}</h1>
                    <p className="text-gray-400">Design the template on the left and watch the live invitation update on the right.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#ffea75] transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_480px]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 lg:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Template Basics</h2>
                                <p className="mt-1 text-sm text-gray-400">Set the identity and availability of this template before styling it.</p>
                            </div>
                            <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                General
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-400">Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FFD700]"
                                    placeholder="e.g. Premium Gold Book"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-400">Status</label>
                                <div
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${formData.isActive ? 'border-[#FFD700]/50 bg-[#111]' : 'border-[#333] bg-[#111]'}`}
                                >
                                    <div className={`flex h-5 w-5 items-center justify-center rounded ${formData.isActive ? 'bg-[#FFD700] text-black' : 'border border-[#444] bg-[#222]'}`}>
                                        {formData.isActive && <Sparkles size={12} />}
                                    </div>
                                    <span className="text-sm text-gray-300">Active (Visible to users)</span>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-xs font-medium text-gray-400">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[100px] w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FFD700]"
                                    placeholder="Describe the look and feel..."
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-400">Code Key (Unique ID)</label>
                                <input
                                    type="text"
                                    value={formData.codeKey}
                                    onChange={e => setFormData({ ...formData, codeKey: e.target.value })}
                                    className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 font-mono text-sm text-white outline-none focus:border-[#FFD700]"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-400">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FFD700]"
                                >
                                    <option value="Universal">Universal / Multi Event</option>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Birthday">Birthday</option>
                                    <option value="Knot_Tying">Knot Tying</option>
                                    <option value="Housewarming">Housewarming</option>
                                    <option value="Party">Party</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 lg:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Design Studio</h2>
                                <p className="mt-1 text-sm text-gray-400">Design one invitation page at a time. Each page can keep its own styling and behavior.</p>
                            </div>
                            <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                Live sync
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                            {TEMPLATE_PAGES.map((page) => {
                                const active = builderPage === page.id;
                                return (
                                    <button
                                        key={page.id}
                                        type="button"
                                        onClick={() => {
                                            setBuilderPage(page.id);
                                            setPreviewPage(page.id);
                                        }}
                                        className={`rounded-2xl border px-4 py-4 text-left transition ${active ? 'border-[#FFD700] bg-[#171717]' : 'border-[#2a2a2a] bg-[#111] hover:border-[#444]'}`}
                                    >
                                        <div className="text-sm font-semibold text-white">{page.label}</div>
                                        <div className="mt-1 text-xs leading-5 text-gray-400">{page.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
                            <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-4">
                                <div className="mb-4 flex items-center gap-2 text-white">
                                    <Layers3 size={16} className="text-[#FFD700]" />
                                    <h3 className="text-sm font-semibold">Elements</h3>
                                </div>
                                <div className="space-y-2">
                                    {BLOCK_LIBRARY.map((item) => (
                                        <button
                                            key={item.type}
                                            type="button"
                                            onClick={() => addBlock(item.type)}
                                            className="flex w-full items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-3 text-left text-sm text-gray-200 transition hover:border-[#FFD700]"
                                        >
                                            <div>
                                                <div className="font-medium text-white">{item.label}</div>
                                                <div className="text-xs text-gray-500">{item.sample}</div>
                                            </div>
                                            <Plus size={15} className="text-[#FFD700]" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-4">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-white">Visual Canvas</div>
                                        <div className="text-xs text-gray-500">Click any element, then adjust font, size, color, and layout from the right.</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setBuilderZoom((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))))}
                                            className="rounded-full border border-[#2f2f2f] bg-[#111] p-2 text-gray-300 transition hover:border-[#FFD700] hover:text-white"
                                        >
                                            <ZoomOut size={14} />
                                        </button>
                                        <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-gray-400">
                                            {Math.round(builderZoom * 100)}%
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setBuilderZoom((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                                            className="rounded-full border border-[#2f2f2f] bg-[#111] p-2 text-gray-300 transition hover:border-[#FFD700] hover:text-white"
                                        >
                                            <ZoomIn size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-[28px] border border-[#1d1d1d] bg-[radial-gradient(circle_at_top,rgba(255,215,0,0.08),transparent_45%),#080808] p-4">
                                    <div
                                        className="mx-auto w-full max-w-[340px] origin-top transition-transform duration-200"
                                        style={{ transform: `scale(${builderZoom})` }}
                                    >
                                        <div className="rounded-[28px] border border-white/10 bg-[#050505] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                                            <div className="rounded-[24px] bg-[linear-gradient(180deg,#1a1f2f_0%,#101422_100%)] px-5 py-6">
                                                <div className="space-y-3">
                                            {currentBlocks.map((block) => (
                                                <div
                                                    key={block.id}
                                                    draggable
                                                    onDragStart={() => setDragBlockId(block.id)}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={() => {
                                                        if (!dragBlockId || dragBlockId === block.id) return;
                                                        const dragIndex = currentBlocks.findIndex((item) => item.id === dragBlockId);
                                                        const dropIndex = currentBlocks.findIndex((item) => item.id === block.id);
                                                        if (dragIndex < 0 || dropIndex < 0) return;
                                                        const reordered = [...currentBlocks];
                                                        const [dragItem] = reordered.splice(dragIndex, 1);
                                                        reordered.splice(dropIndex, 0, dragItem);
                                                        persistBlocks(reordered);
                                                        setDragBlockId(null);
                                                    }}
                                                    onClick={() => setSelectedBlockId(block.id)}
                                                    className={`cursor-pointer rounded-2xl border px-3 py-3 transition ${selectedBlock?.id === block.id ? 'border-[#FFD700] bg-[#181818]' : 'border-[#2a2a2a] bg-[#101010] hover:border-[#444]'}`}
                                                    style={{
                                                        textAlign: block.props.align || 'center',
                                                        color: block.props.color,
                                                        backgroundColor: block.type === 'button' ? block.props.backgroundColor : undefined,
                                                        fontFamily: block.props.fontFamily,
                                                        fontSize: `${block.props.fontSize || 16}px`,
                                                        fontWeight: block.props.weight,
                                                        borderRadius: `${block.props.radius || 16}px`,
                                                        padding: `${block.props.padding || 10}px`,
                                                        opacity: block.visible ? 1 : 0.45,
                                                    }}
                                                >
                                                    <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical size={12} />
                                                            <span>{block.label}</span>
                                                        </div>
                                                        <MousePointerSquareDashed size={12} />
                                                    </div>
                                                    <div>{block.props.text || block.label}</div>
                                                </div>
                                            ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#222] bg-[#0f0f0f] p-4">
                                <div className="mb-4 flex items-center gap-2 text-white">
                                    <Type size={16} className="text-[#FFD700]" />
                                    <h3 className="text-sm font-semibold">Block Settings</h3>
                                </div>
                                {selectedBlock ? (
                                    <div className="space-y-4">
                                        <div className="rounded-xl border border-[#222] bg-[#111] p-3 text-xs leading-5 text-gray-400">
                                            Editing <span className="font-semibold text-white">{selectedBlock.label}</span>. Use the controls below to tune that element visually.
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs text-gray-500">Block Label</label>
                                            <input
                                                type="text"
                                                value={selectedBlock.label}
                                                onChange={(e) => updateSelectedBlock({ label: e.target.value })}
                                                className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs text-gray-500">Content</label>
                                            <textarea
                                                value={selectedBlock.props.text || ''}
                                                onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, text: e.target.value } })}
                                                className="min-h-[80px] w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs text-gray-500">Font Family</label>
                                            <select
                                                value={selectedBlock.props.fontFamily || ''}
                                                onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, fontFamily: e.target.value } })}
                                                className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]"
                                            >
                                                <option value="">Default for this element</option>
                                                {BLOCK_FONT_OPTIONS.map((font) => (
                                                    <option key={font.value} value={font.value}>{font.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-2 block text-xs text-gray-500">Text Color</label>
                                                <input
                                                    type="color"
                                                    value={selectedBlock.props.color || '#ffffff'}
                                                    onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, color: e.target.value } })}
                                                    className="h-10 w-full rounded-lg border border-[#333] bg-[#111]"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs text-gray-500">Font Size</label>
                                                <div className="space-y-2">
                                                    <input
                                                        type="range"
                                                        min={12}
                                                        max={72}
                                                        value={selectedBlock.props.fontSize || 16}
                                                        onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, fontSize: Number(e.target.value) } })}
                                                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                                    />
                                                    <input
                                                        type="number"
                                                        min={12}
                                                        max={72}
                                                        value={selectedBlock.props.fontSize || 16}
                                                        onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, fontSize: Number(e.target.value) } })}
                                                        className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="mb-2 block text-xs text-gray-500">Weight</label>
                                                <select
                                                    value={selectedBlock.props.weight || 'medium'}
                                                    onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, weight: e.target.value as TemplateBuilderBlock['props']['weight'] } })}
                                                    className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white outline-none focus:border-[#FFD700]"
                                                >
                                                    <option value="normal">Normal</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="bold">Bold</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs text-gray-500">Text Align</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { value: 'left', icon: AlignLeft },
                                                        { value: 'center', icon: AlignCenter },
                                                        { value: 'right', icon: AlignRight },
                                                    ].map((option) => {
                                                        const Icon = option.icon;
                                                        const active = (selectedBlock.props.align || 'center') === option.value;
                                                        return (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => updateSelectedBlock({ props: { ...selectedBlock.props, align: option.value as 'left' | 'center' | 'right' } })}
                                                                className={`flex items-center justify-center rounded-lg border px-3 py-2 transition ${active ? 'border-[#FFD700] bg-[#171717] text-white' : 'border-[#333] bg-[#111] text-gray-400 hover:border-[#555]'}`}
                                                            >
                                                                <Icon size={14} />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedBlock.type === 'button' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="mb-2 block text-xs text-gray-500">Button Background</label>
                                                    <input
                                                        type="color"
                                                        value={selectedBlock.props.backgroundColor || '#1f3d8f'}
                                                        onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, backgroundColor: e.target.value } })}
                                                        className="h-10 w-full rounded-lg border border-[#333] bg-[#111]"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="mb-2 block text-xs text-gray-500">Radius</label>
                                                        <input
                                                            type="range"
                                                            min={0}
                                                            max={40}
                                                            value={selectedBlock.props.radius || 16}
                                                            onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, radius: Number(e.target.value) } })}
                                                            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-2 block text-xs text-gray-500">Padding</label>
                                                        <input
                                                            type="range"
                                                            min={4}
                                                            max={28}
                                                            value={selectedBlock.props.padding || 10}
                                                            onChange={(e) => updateSelectedBlock({ props: { ...selectedBlock.props, padding: Number(e.target.value) } })}
                                                            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => moveSelectedBlock(-1)} className="flex-1 rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-gray-200 hover:border-[#FFD700]">
                                                <ArrowUp size={14} className="mr-2 inline" />
                                                Move Up
                                            </button>
                                            <button type="button" onClick={() => moveSelectedBlock(1)} className="flex-1 rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-gray-200 hover:border-[#FFD700]">
                                                <ArrowDown size={14} className="mr-2 inline" />
                                                Move Down
                                            </button>
                                        </div>
                                        <label className="flex items-center gap-3 rounded-lg border border-[#333] bg-[#111] px-3 py-3 text-sm text-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlock.visible}
                                                onChange={(e) => updateSelectedBlock({ visible: e.target.checked })}
                                                className="accent-[#FFD700]"
                                            />
                                            Show this block
                                        </label>
                                        <button type="button" onClick={removeSelectedBlock} className="w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/15">
                                            Remove Block
                                        </button>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-[#333] p-4 text-sm text-gray-500">
                                        Select a block in the canvas to edit it.
                                    </div>
                                )}
                            </div>
                        </div>
                        <TemplateSelector
                            mode="controls"
                            value={templateConfig}
                            editorPage={builderPage}
                            onTemplateChange={(config) => setFormData((prev) => ({ ...prev, templateConfig: config }))}
                            existingVideos={previewMedia}
                        />
                    </section>

                    <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 lg:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Page Behavior</h2>
                                <p className="mt-1 text-sm text-gray-400">Set how the selected page loads, advances, and which overlay elements it shows.</p>
                            </div>
                            <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                {TEMPLATE_PAGES.find((page) => page.id === builderPage)?.label}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-xl border border-[#333] bg-[#0d0d0d] p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm text-gray-300">Page Load / Advance Mode</label>
                                        <select
                                            value={currentPageConfig.transitionMode || (builderPage === 'transition' ? 'auto' : 'click')}
                                            onChange={(e) => updateCurrentPageConfig({ transitionMode: e.target.value as TemplatePageConfig['transitionMode'] })}
                                            className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                        >
                                            <option value="click">Wait for click</option>
                                            <option value="auto">Auto advance</option>
                                            <option value="video-end">Wait for video end</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm text-gray-300">Auto Advance Seconds</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={20}
                                            step={0.5}
                                            value={currentPageConfig.autoAdvanceSeconds ?? (builderPage === 'transition' ? (templateConfig?.transitionDurationSeconds ?? 3.5) : 3)}
                                            onChange={(e) => {
                                                const seconds = Number(e.target.value);
                                                updateCurrentPageConfig({ autoAdvanceSeconds: seconds });
                                                if (builderPage === 'transition') {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        templateConfig: {
                                                            ...(prev.templateConfig || {}),
                                                            pages: {
                                                                ...(((prev.templateConfig as TemplateConfig | null)?.pages) || {}),
                                                                [builderPage]: {
                                                                    ...((((prev.templateConfig as TemplateConfig | null)?.pages) || {})[builderPage] || {}),
                                                                    autoAdvanceSeconds: seconds,
                                                                }
                                                            },
                                                            transitionDurationSeconds: seconds,
                                                        }
                                                    }));
                                                }
                                            }}
                                            className="w-full rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#FFD700]"
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Phase 1 stores this per page. Existing templates still keep compatibility with the current transition duration field.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {(builderPage === 'intro'
                                    ? [['showGuestName', 'Opening Page: Show Guest Name']]
                                    : builderPage === 'transition'
                                        ? [
                                            ['showOverlay', 'Transition Page: Show Overlay'],
                                            ['showSaveTheDate', 'Transition Page: Show Save the Date'],
                                            ['showEventTitle', 'Transition Page: Show Event Title'],
                                            ['showNames', 'Transition Page: Show Names'],
                                            ['showDate', 'Transition Page: Show Date'],
                                            ['showLocation', 'Transition Page: Show Location'],
                                        ]
                                        : [
                                            ['showEventTitle', 'Detail Page: Show Event Title'],
                                            ['showNames', 'Detail Page: Show Names'],
                                            ['showDate', 'Detail Page: Show Date'],
                                            ['showLocation', 'Detail Page: Show Location'],
                                        ]).map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-3 rounded-lg border border-[#333] bg-[#0d0d0d] px-4 py-3 text-sm text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={(currentPageConfig as any)?.[key] !== false}
                                                onChange={(e) => updateCurrentPageConfig({ [key]: e.target.checked } as TemplatePageConfig)}
                                                className="accent-[#FFD700]"
                                            />
                                            <span>{label}</span>
                                        </label>
                                    ))}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 lg:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Page Assets</h2>
                                <p className="mt-1 text-sm text-gray-400">Upload media for the selected page so each invitation screen can be designed separately.</p>
                            </div>
                            <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                {TEMPLATE_PAGES.find((page) => page.id === builderPage)?.label}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
                            <div>
                                <AssetUploader
                                    label="Custom 'Open Invitation' Button Image (Optional)"
                                    value={formData.buttonImageUrl}
                                    onChange={(val: string) => setFormData({ ...formData, buttonImageUrl: val })}
                                    type="image"
                                />
                                <AssetSelector
                                    value={formData.buttonImageUrl}
                                    onChange={(val: string) => setFormData({ ...formData, buttonImageUrl: val })}
                                    type="IMAGE"
                                />
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-400">Effect Animation</h4>
                                <select
                                    value={formData.effectLayerAnimation || ''}
                                    onChange={e => setFormData({ ...formData, effectLayerAnimation: e.target.value })}
                                    className="w-full rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#FFD700]"
                                >
                                    <option value="">None</option>
                                    <option value="pulse">Pulse Slowly</option>
                                    <option value="float">Float Gently</option>
                                    <option value="spin-slow">Spin Slowly</option>
                                </select>
                            </div>

                            {builderPage === 'intro' && (
                                <>
                                    <div>
                                        <AssetUploader
                                            label="Image/Video Background for Intro"
                                            value={formData.introVideoUrl}
                                            onChange={(val: string) => setFormData({ ...formData, introVideoUrl: val })}
                                        />
                                        <AssetSelector value={formData.introVideoUrl} onChange={(val: string) => setFormData({ ...formData, introVideoUrl: val })} type="ALL" />
                                    </div>
                                    <div>
                                        <AssetUploader
                                            label="Intro Frame Overlay"
                                            value={formData.introFrameUrl}
                                            onChange={(val: string) => setFormData({ ...formData, introFrameUrl: val })}
                                            type="image"
                                        />
                                        <AssetSelector value={formData.introFrameUrl} onChange={(val: string) => setFormData({ ...formData, introFrameUrl: val })} type="ALL" />
                                    </div>
                                </>
                            )}

                            {builderPage === 'transition' && (
                                <>
                                    <div>
                                        <AssetUploader
                                            label="Image/Video Background for Transition"
                                            value={formData.transitionVideoUrl}
                                            onChange={(val: string) => setFormData({ ...formData, transitionVideoUrl: val })}
                                        />
                                        <AssetSelector value={formData.transitionVideoUrl} onChange={(val: string) => setFormData({ ...formData, transitionVideoUrl: val })} type="ALL" />
                                    </div>
                                    <div>
                                        <AssetUploader
                                            label="Transition Frame Overlay"
                                            value={formData.transitionFrameUrl}
                                            onChange={(val: string) => setFormData({ ...formData, transitionFrameUrl: val })}
                                            type="image"
                                        />
                                        <AssetSelector value={formData.transitionFrameUrl} onChange={(val: string) => setFormData({ ...formData, transitionFrameUrl: val })} type="ALL" />
                                    </div>
                                </>
                            )}

                            {builderPage === 'details' && (
                                <>
                                    <div>
                                        <AssetUploader
                                            label="Image/Video Background for Full Detail"
                                            value={formData.backgroundVideoUrl}
                                            onChange={(val: string) => setFormData({ ...formData, backgroundVideoUrl: val })}
                                        />
                                        <AssetSelector value={formData.backgroundVideoUrl} onChange={(val: string) => setFormData({ ...formData, backgroundVideoUrl: val })} type="ALL" />
                                    </div>
                                    <div>
                                        <AssetUploader
                                            label="Detail/Content Answer Frame"
                                            value={formData.detailFrameUrl}
                                            onChange={(val: string) => setFormData({ ...formData, detailFrameUrl: val })}
                                            type="image"
                                        />
                                        <AssetSelector value={formData.detailFrameUrl} onChange={(val: string) => setFormData({ ...formData, detailFrameUrl: val })} type="ALL" />
                                    </div>
                                    <div>
                                        <AssetUploader
                                            label="Secondary Background Image (Optional)"
                                            value={formData.backgroundImageUrl}
                                            onChange={(val: string) => setFormData({ ...formData, backgroundImageUrl: val })}
                                            type="image"
                                        />
                                        <AssetSelector value={formData.backgroundImageUrl} onChange={(val: string) => setFormData({ ...formData, backgroundImageUrl: val })} type="IMAGE" />
                                    </div>
                                </>
                            )}
                            <div>
                                <AssetUploader
                                    label="Card/Thumbnail Preview"
                                    value={formData.previewUrl}
                                    onChange={(val: string) => setFormData({ ...formData, previewUrl: val })}
                                    type="image"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-6 lg:p-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Visual Effect Layer</h2>
                                <p className="mt-1 text-sm text-gray-400">Add an optional overlay for sparkle, texture, smoke, or animated atmosphere.</p>
                            </div>
                            <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                Overlay
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div>
                                <AssetUploader
                                    label="Effect Video/Image"
                                    value={formData.effectLayerUrl}
                                    onChange={(val: string) => setFormData({ ...formData, effectLayerUrl: val })}
                                    type="video"
                                />
                                <AssetSelector value={formData.effectLayerUrl} onChange={(val: string) => setFormData({ ...formData, effectLayerUrl: val })} type="ALL" />
                            </div>
                            <div className="space-y-6 md:col-span-2">
                                <div className="rounded-xl border border-[#222] bg-[#111] p-5">
                                    <label className="mb-4 flex justify-between text-xs font-medium text-gray-400">
                                        <span>Opacity</span>
                                        <span>{Math.round(formData.effectLayerOpacity * 100)}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={formData.effectLayerOpacity}
                                        onChange={(e) => setFormData({ ...formData, effectLayerOpacity: parseFloat(e.target.value) })}
                                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#333] accent-[#FFD700]"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-gray-400">Blend Mode</label>
                                    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                        {['screen', 'overlay', 'multiply', 'normal'].map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, effectLayerBlendMode: mode })}
                                                className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${formData.effectLayerBlendMode === mode ? 'border-[#FFD700] bg-[#FFD700] text-black' : 'border-[#333] bg-[#111] text-gray-400 hover:bg-[#222]'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="xl:sticky xl:top-6 xl:self-start">
                    <div className="rounded-2xl border border-[#222] bg-[#0a0a0a] p-5">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                                <p className="mt-1 text-sm text-gray-400">This preview uses the real invitation layout, not a mock card.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setLivePreviewZoom((prev) => Math.max(0.85, Number((prev - 0.05).toFixed(2))))}
                                    className="rounded-full border border-[#2f2f2f] bg-[#111] p-2 text-gray-300 transition hover:border-[#FFD700] hover:text-white"
                                >
                                    <ZoomOut size={14} />
                                </button>
                                <div className="rounded-full border border-[#2f2f2f] bg-[#111] px-3 py-1 text-xs text-gray-400">
                                    {Math.round(livePreviewZoom * 100)}%
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLivePreviewZoom((prev) => Math.min(1.2, Number((prev + 0.05).toFixed(2))))}
                                    className="rounded-full border border-[#2f2f2f] bg-[#111] p-2 text-gray-300 transition hover:border-[#FFD700] hover:text-white"
                                >
                                    <ZoomIn size={14} />
                                </button>
                            </div>
                        </div>
                        <div
                            className="origin-top overflow-hidden rounded-2xl transition-transform duration-200"
                            style={{ transform: `scale(${livePreviewZoom})`, transformOrigin: 'top center', marginBottom: `${(livePreviewZoom - 1) * 220}px` }}
                        >
                            <TemplateSelector
                                mode="preview"
                                value={templateConfig}
                                previewPage={previewPage}
                                onPreviewPageChange={setPreviewPage}
                                editorPage={previewPage}
                                existingVideos={previewMedia}
                            />
                        </div>
                        <div className="mt-4 rounded-2xl border border-[#222] bg-[#111] p-4 text-sm text-gray-400">
                            <div className="mb-1 flex items-center gap-2 text-white">
                                <Info size={16} className="text-[#FFD700]" />
                                Preview tips
                            </div>
                            <p>Switch between Intro, Transition, and Details above, then zoom in and tune each element from the visual canvas on the left.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
