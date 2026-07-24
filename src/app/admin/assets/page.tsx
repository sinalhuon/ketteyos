'use client';

import { useEffect, useMemo, useState } from 'react';
import type { DragEvent } from 'react';
import { apiFetch } from '@/lib/api';
import {
    Music,
    Image as ImageIcon,
    Video,
    Trash2,
    Upload,
    X,
    Edit,
    Plus,
    Save,
    Folder,
    FolderPlus,
    ChevronRight,
    Home
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';

export const dynamic = 'force-dynamic';

type AssetType = 'IMAGE' | 'MUSIC' | 'VIDEO';

type AssetRecord = {
    id: string;
    name: string;
    type: AssetType;
    url: string;
    folderId?: string | null;
};

type FolderRecord = {
    id: string;
    name: string;
    parentId?: string | null;
};

const rootFolderValue = '__ROOT__';
const supportedAssetExtensions: Record<AssetType, string[]> = {
    IMAGE: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
    MUSIC: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'],
    VIDEO: ['mp4', 'webm', 'mov', 'ogg'],
};

const getFileExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || '';

const inferAssetTypeFromFile = (file: File): AssetType | null => {
    if (file.type.startsWith('image/')) return 'IMAGE';
    if (file.type.startsWith('audio/')) return 'MUSIC';
    if (file.type.startsWith('video/')) return 'VIDEO';

    const extension = getFileExtension(file.name);
    if (supportedAssetExtensions.IMAGE.includes(extension)) return 'IMAGE';
    if (supportedAssetExtensions.MUSIC.includes(extension)) return 'MUSIC';
    if (supportedAssetExtensions.VIDEO.includes(extension)) return 'VIDEO';
    return null;
};

const getAcceptedFileText = (type?: AssetType | 'MIXED') => {
    if (type === 'IMAGE') return 'PNG, JPG, GIF, WebP, SVG';
    if (type === 'MUSIC') return 'MP3, WAV, OGG, M4A';
    if (type === 'VIDEO') return 'MP4, WebM, MOV';
    return 'Images, audio, or video files';
};

export default function GlobalAssets() {
    const { toast } = useToast();
    const { t } = useLanguage();

    const [assets, setAssets] = useState<AssetRecord[]>([]);
    const [folders, setFolders] = useState<FolderRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewAsset, setPreviewAsset] = useState<AssetRecord | null>(null);
    const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);

    const [formData, setFormData] = useState({ name: '', type: 'IMAGE' as AssetType, folderId: rootFolderValue });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const normalizeFolderId = (value?: string | null) => value || null;

    const fetchAssets = async () => {
        try {
            const data = await apiFetch('admin.php?action=assets');
            if (data?.success) {
                setAssets(Array.isArray(data.assets) ? data.assets : []);
                setFolders(Array.isArray(data.folders) ? data.folders : []);
            }
        } catch (e) {
            console.error('Failed to fetch assets', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const closeForm = () => {
        setEditingAsset(null);
        setFormData({ name: '', type: 'IMAGE', folderId: currentFolderId || rootFolderValue });
        setSelectedFiles([]);
        setShowForm(false);
    };

    const handleAddClick = () => {
        setEditingAsset(null);
        setFormData({ name: '', type: 'IMAGE', folderId: currentFolderId || rootFolderValue });
        setSelectedFiles([]);
        setShowForm(true);
    };

    const handleEditClick = (asset: AssetRecord) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name,
            type: asset.type,
            folderId: asset.folderId || rootFolderValue,
        });
        setSelectedFiles([]);
        setShowForm(true);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        applySelectedFiles(files);
        e.target.value = '';
    };

    const applySelectedFiles = (files: File[]) => {
        if (files.length === 0) return;

        const supportedFiles = files.filter((file) => inferAssetTypeFromFile(file));
        const skippedCount = files.length - supportedFiles.length;

        if (supportedFiles.length === 0) {
            toast.warning('Please choose image, audio, or video files.');
            return;
        }

        if (skippedCount > 0) {
            toast.warning(`${skippedCount} unsupported file${skippedCount === 1 ? '' : 's'} skipped.`);
        }

        const inferredTypes = supportedFiles.map((file) => inferAssetTypeFromFile(file)).filter(Boolean) as AssetType[];
        const firstType = inferredTypes[0];
        const allSameType = inferredTypes.every((type) => type === firstType);

        setSelectedFiles(editingAsset ? supportedFiles.slice(0, 1) : supportedFiles);
        setFormData((prev) => ({
            ...prev,
            type: allSameType ? firstType : firstType,
            name: !editingAsset && supportedFiles.length === 1 && !prev.name
                ? supportedFiles[0].name.replace(/\.[^/.]+$/, '')
                : prev.name,
        }));
    };

    const handleDropZoneDragOver = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isDragActive) setIsDragActive(true);
    };

    const handleDropZoneDragLeave = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
    };

    const handleDropZoneDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragActive(false);
        const files = Array.from(event.dataTransfer?.files || []);
        applySelectedFiles(files);
    };

    useEffect(() => {
        const preventWindowDrop = (event: globalThis.DragEvent) => {
            event.preventDefault();
        };

        window.addEventListener('dragover', preventWindowDrop);
        window.addEventListener('drop', preventWindowDrop);

        return () => {
            window.removeEventListener('dragover', preventWindowDrop);
            window.removeEventListener('drop', preventWindowDrop);
        };
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm(t('admin.assetsPage.deleteConfirm'))) return;
        try {
            const res = await apiFetch(`admin.php?action=asset&id=${id}`, { method: 'DELETE' });
            if (res?.success) {
                setAssets((prev) => prev.filter((asset) => asset.id !== id));
                if (editingAsset?.id === id) {
                    closeForm();
                }
            } else {
                toast.error(res?.error || t('common.error'));
            }
        } catch {
            toast.error(t('common.error'));
        }
    };

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) {
            toast.warning('Please enter a folder name.');
            return;
        }

        try {
            const res = await apiFetch('admin.php?action=asset-folder', {
                method: 'POST',
                body: JSON.stringify({
                    name: newFolderName.trim(),
                    parentId: currentFolderId,
                }),
            });

            if (res?.success) {
                setNewFolderName('');
                setShowFolderForm(false);
                fetchAssets();
            } else {
                toast.error(res?.error || t('common.error'));
            }
        } catch {
            toast.error(t('common.error'));
        }
    };

    const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this folder? It must be empty first.')) return;

        try {
            const res = await apiFetch(`admin.php?action=asset-folder&id=${id}`, { method: 'DELETE' });
            if (res?.success) {
                if (currentFolderId === id) {
                    setCurrentFolderId(null);
                }
                fetchAssets();
            } else {
                toast.error(res?.error || 'Folder is not empty.');
            }
        } catch {
            toast.error(t('common.error'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            toast.warning('Please upload file(s) for the asset.');
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
            const folderId = formData.folderId === rootFolderValue ? null : formData.folderId;

            const uploadSingleFile = async (file: File, assetType: AssetType) => {
                const data = new FormData();
                data.append('file', file);
                data.append('type', assetType.toLowerCase());

                const res = await fetch(`${API_BASE}/upload.php`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: data,
                });
                const result = await res.json();
                if (!result.success) {
                    throw new Error(result.error || `Upload failed for ${file.name}`);
                }
                return result.url as string;
            };

            if (editingAsset) {
                const inferredType = inferAssetTypeFromFile(selectedFiles[0]) || formData.type;
                const finalUrl = await uploadSingleFile(selectedFiles[0], inferredType);
                const res = await apiFetch('admin.php?action=asset', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: editingAsset.id,
                        name: formData.name,
                        type: inferredType,
                        url: finalUrl,
                        folderId,
                    }),
                });

                if (!res?.success) {
                    toast.error(res?.error || t('common.error'));
                    return;
                }
            } else {
                for (const file of selectedFiles) {
                    const inferredType = inferAssetTypeFromFile(file);
                    if (!inferredType) {
                        toast.error(`Unsupported file type: ${file.name}`);
                        return;
                    }
                    const finalUrl = await uploadSingleFile(file, inferredType);
                    const res = await apiFetch('admin.php?action=asset', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: selectedFiles.length === 1 && formData.name ? formData.name : file.name.replace(/\.[^/.]+$/, ''),
                            type: inferredType,
                            url: finalUrl,
                            folderId,
                        }),
                    });

                    if (!res?.success) {
                        toast.error(res?.error || `Failed to save ${file.name}`);
                        return;
                    }
                }
            }

            fetchAssets();
            closeForm();
        } catch (e: unknown) {
            console.error(e);
            toast.error(e instanceof Error ? e.message : t('common.error'));
        } finally {
            setSaving(false);
        }
    };

    const currentFolders = useMemo(
        () => folders.filter((folder) => normalizeFolderId(folder.parentId) === currentFolderId),
        [folders, currentFolderId]
    );

    const currentAssets = useMemo(
        () => assets.filter((asset) => normalizeFolderId(asset.folderId) === currentFolderId),
        [assets, currentFolderId]
    );

    const groupedAssets = useMemo(
        () => ({
            MUSIC: currentAssets.filter((a) => a.type === 'MUSIC'),
            VIDEO: currentAssets.filter((a) => a.type === 'VIDEO'),
            IMAGE: currentAssets.filter((a) => a.type === 'IMAGE'),
        }),
        [currentAssets]
    );

    const sections = [
        { type: 'MUSIC' as const, label: t('admin.assetsPage.types.music'), icon: Music },
        { type: 'VIDEO' as const, label: t('admin.assetsPage.types.video'), icon: Video },
        { type: 'IMAGE' as const, label: t('admin.assetsPage.types.image'), icon: ImageIcon },
    ];

    const currentPath = useMemo(() => {
        const path: FolderRecord[] = [];
        let cursor = folders.find((folder) => folder.id === currentFolderId) || null;

        while (cursor) {
            path.unshift(cursor);
            cursor = folders.find((folder) => folder.id === cursor?.parentId) || null;
        }

        return path;
    }, [folders, currentFolderId]);

    const folderOptions = useMemo(() => {
        const options: { id: string; label: string }[] = [{ id: rootFolderValue, label: 'Root' }];

        const walk = (parentId: string | null, depth: number) => {
            folders
                .filter((folder) => normalizeFolderId(folder.parentId) === parentId)
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach((folder) => {
                    options.push({ id: folder.id, label: `${'  '.repeat(depth)}${folder.name}` });
                    walk(folder.id, depth + 1);
                });
        };

        walk(null, 0);
        return options;
    }, [folders]);

    const currentFolderLabel = currentPath[currentPath.length - 1]?.name || 'Root';
    const selectedFileTypes = selectedFiles.map((file) => inferAssetTypeFromFile(file)).filter(Boolean) as AssetType[];
    const selectedFilesTypeSummary = selectedFileTypes.length > 0
        ? (selectedFileTypes.every((type) => type === selectedFileTypes[0]) ? selectedFileTypes[0] : 'MIXED')
        : null;

    return (
        <div className="mx-auto max-w-[1700px] p-8 lg:p-10 space-y-10">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.assetsPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage assets with folders, breadcrumbs, and multi-file upload.</p>
                </div>
                {!showForm && (
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowFolderForm((prev) => !prev)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] text-gray-900 dark:text-white font-bold rounded-lg border border-gray-200 dark:border-[#222] hover:border-[#FFD700] transition"
                        >
                            <FolderPlus size={18} /> New Folder
                        </button>
                        <button
                            onClick={handleAddClick}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#ffea75] transition shadow-sm hover:shadow-md"
                        >
                            <Upload size={18} /> {t('admin.assetsPage.uploadNew')}
                        </button>
                    </div>
                )}
            </header>

            {!showForm && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-[#222] dark:bg-[#111]">
                        <button
                            onClick={() => setCurrentFolderId(null)}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${currentFolderId === null ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300' : 'bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300'}`}
                        >
                            <Home size={15} /> Root
                        </button>
                        {currentPath.map((folder) => (
                            <div key={folder.id} className="inline-flex items-center gap-2">
                                <ChevronRight size={14} className="text-gray-400" />
                                <button
                                    onClick={() => setCurrentFolderId(folder.id)}
                                    className={`rounded-full px-3 py-1.5 text-sm transition ${currentFolderId === folder.id ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300' : 'bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300'}`}
                                >
                                    {folder.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    {showFolderForm && (
                        <form onSubmit={handleCreateFolder} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-[#222] dark:bg-[#111]">
                            <div className="flex flex-col gap-3 md:flex-row">
                                <input
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder={`Create folder inside ${currentFolderLabel}`}
                                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none dark:border-[#333] dark:bg-[#0a0a0a] dark:text-white"
                                />
                                <button type="submit" className="rounded-xl bg-[#FFD700] px-5 py-3 font-bold text-black hover:bg-[#ffea75] transition">
                                    Create Folder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFolderForm(false);
                                        setNewFolderName('');
                                    }}
                                    className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 dark:border-[#333] dark:text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#222] dark:bg-[#111]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Folders in {currentFolderLabel}</h2>
                            <span className="text-xs text-gray-500">{currentFolders.length} folder(s)</span>
                        </div>
                        {currentFolders.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {currentFolders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        onClick={() => setCurrentFolderId(folder.id)}
                                        className="cursor-pointer rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-[#FFD700] hover:bg-yellow-50/40 dark:border-[#222] dark:bg-[#0a0a0a] dark:hover:border-[#FFD700]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300">
                                                    <Folder size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-bold text-gray-900 dark:text-white">{folder.name}</p>
                                                    <p className="text-xs text-gray-500">Open folder</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteFolder(e, folder.id)}
                                                className="rounded-lg p-1 text-gray-500 transition hover:text-red-500"
                                                title="Delete empty folder"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-[#222]">
                                No folders here yet.
                            </div>
                        )}
                    </div>

                    <div className="space-y-10">
                        {loading ? (
                            <div className="text-center text-gray-500 py-10">{t('common.loading')}</div>
                        ) : (
                            sections.map((section) => {
                                const sectionAssets = groupedAssets[section.type];
                                if (sectionAssets.length === 0) return null;

                                return (
                                    <div key={section.type} className="space-y-4">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200 dark:border-[#222] pb-2">
                                            <section.icon className="text-[#FFD700]" size={24} /> {section.label}
                                            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded-full ml-auto">
                                                {sectionAssets.length}
                                            </span>
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {sectionAssets.map((asset) => (
                                                <div
                                                    key={asset.id}
                                                    className={`bg-white dark:bg-[#111] rounded-2xl border p-4 group transition shadow-sm dark:shadow-none ${editingAsset?.id === asset.id ? 'border-[#FFD700] bg-yellow-50 dark:bg-[#1a1a1a]' : 'border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333]'}`}
                                                >
                                                    <div
                                                        className="aspect-video bg-gray-100 dark:bg-[#000] rounded-xl mb-4 flex items-center justify-center border border-gray-200 dark:border-[#1a1a1a] relative overflow-hidden cursor-pointer"
                                                        onClick={() => setPreviewAsset(asset)}
                                                    >
                                                        {asset.type === 'MUSIC' ? (
                                                            <div className="text-center">
                                                                <Music className="text-gray-600 mx-auto mb-2" size={32} />
                                                                <p className="text-xs text-gray-500">Click to Play</p>
                                                            </div>
                                                        ) : asset.type === 'VIDEO' ? (
                                                            <video
                                                                src={asset.url}
                                                                className="w-full h-full object-cover"
                                                                preload="metadata"
                                                                muted
                                                                playsInline
                                                            />
                                                        ) : (
                                                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                                        )}

                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                                                                {asset.type === 'IMAGE' ? <ImageIcon size={24} /> : <div className="ml-1">▶</div>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-start">
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-gray-900 dark:text-white truncate w-32">{asset.name}</h3>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{asset.type}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEditClick(asset); }}
                                                                className={`transition p-1 ${editingAsset?.id === asset.id ? 'text-[#FFD700]' : 'text-gray-600 hover:text-white'}`}
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDelete(e, asset.id)}
                                                                className="text-gray-600 hover:text-red-500 transition p-1"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {!loading && currentFolders.length === 0 && currentAssets.length === 0 && (
                            <div className="py-12 text-center border-2 border-dashed border-[#222] rounded-2xl">
                                <p className="text-gray-500 mb-2">{t('admin.assetsPage.noAssets')}</p>
                                <p className="text-xs text-gray-600">This folder is empty. Create a folder or upload files here.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-[#222] pb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                {editingAsset ? <Edit size={24} className="text-[#FFD700]" /> : <Upload size={24} className="text-[#FFD700]" />}
                                {editingAsset ? t('admin.assetsPage.editAsset') : t('admin.assetsPage.uploadAsset')}
                            </h3>
                            <button onClick={closeForm} className="px-4 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-white rounded-lg flex items-center gap-2 transition text-sm font-medium">
                                <X size={16} /> {t('common.cancel')}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Folder</label>
                                <select
                                    value={formData.folderId}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, folderId: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none"
                                >
                                    {folderOptions.map((folder) => (
                                        <option key={folder.id} value={folder.id}>
                                            {folder.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.assetsPage.assetName')}</label>
                                <input
                                    type="text"
                                    required={Boolean(editingAsset) || selectedFiles.length <= 1}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none"
                                    placeholder={selectedFiles.length > 1 && !editingAsset ? 'Multiple files use their own filenames automatically.' : 'My Asset'}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.assetsPage.assetType')}</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AssetType })}
                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none"
                                >
                                    <option value="IMAGE">{t('admin.assetsPage.types.image')}</option>
                                    <option value="MUSIC">{t('admin.assetsPage.types.music')}</option>
                                    <option value="VIDEO">{t('admin.assetsPage.types.video')}</option>
                                </select>
                                {selectedFilesTypeSummary && (
                                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                                        Auto-detected: {selectedFilesTypeSummary === 'MIXED' ? 'mixed file types' : selectedFilesTypeSummary.toLowerCase()}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.assetsPage.assetFile')}</label>

                                {editingAsset && selectedFiles.length === 0 && (
                                    <div className="mb-3 p-3 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {editingAsset.type === 'IMAGE' ? (
                                                <img src={editingAsset.url} alt="Current" className="w-10 h-10 object-cover rounded bg-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-[#222] rounded flex items-center justify-center">
                                                    {editingAsset.type === 'MUSIC' ? <Music size={20} /> : <Video size={20} />}
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium truncate text-gray-900 dark:text-white">{t('admin.assetsPage.currentFile')}</p>
                                                <a href={editingAsset.url} target="_blank" rel="noreferrer" className="text-xs text-[#FFD700] hover:underline truncate block">
                                                    {t('admin.assetsPage.viewCurrent')}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <label
                                    onDragOver={handleDropZoneDragOver}
                                    onDragLeave={handleDropZoneDragLeave}
                                    onDrop={handleDropZoneDrop}
                                    className={`
                                    flex flex-col items-center justify-center w-full h-32 
                                    border-2 border-dashed rounded-xl cursor-pointer transition
                                    ${isDragActive
                                        ? 'border-[#FFD700] bg-yellow-500/10'
                                        : selectedFiles.length > 0
                                        ? 'border-[#FFD700] bg-yellow-50/10'
                                        : 'border-gray-300 dark:border-[#333] hover:border-[#FFD700] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                                    }
                                `}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload size={32} className={`mb-2 ${(selectedFiles.length > 0 || isDragActive) ? 'text-[#FFD700]' : 'text-gray-400'}`} />
                                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">{isDragActive ? 'Drop files here' : t('admin.assetsPage.selectFile')}</span> {isDragActive ? '' : t('admin.assetsPage.dragDrop')}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {getAcceptedFileText(selectedFilesTypeSummary || formData.type)}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                        multiple={!editingAsset}
                                        accept="image/*,audio/*,video/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.mp4,.webm,.mov,.png,.jpg,.jpeg,.gif,.webp,.svg"
                                    />
                                </label>

                                {selectedFiles.length > 0 && (
                                    <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-2 truncate">
                                                <span className="font-bold">{t('admin.assetsPage.selected')}</span>
                                                {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} files selected`}
                                            </p>
                                            {selectedFiles.length > 1 && (
                                                <p className="mt-1 text-[11px] text-green-700/80 dark:text-green-400/80 truncate">
                                                    {selectedFiles.slice(0, 4).map((file) => file.name).join(', ')}
                                                    {selectedFiles.length > 4 ? '...' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => setSelectedFiles([])} className="text-green-700 dark:text-green-400 hover:text-red-500">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {saving && <p className="text-xs text-[#FFD700] mt-1 animate-pulse">{t('admin.assetsPage.uploadingSaving')}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:bg-[#ffea75] transition flex items-center justify-center gap-2"
                            >
                                {saving ? t('common.loading') : (
                                    <>
                                        {editingAsset ? <Save size={18} /> : <Plus size={18} />}
                                        {editingAsset ? t('admin.assetsPage.updateAsset') : t('admin.assetsPage.addAsset')}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {previewAsset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewAsset(null)}>
                    <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">{previewAsset.name}</h3>
                            <button onClick={() => setPreviewAsset(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                            {previewAsset.type === 'MUSIC' && (
                                <audio controls autoPlay className="w-full px-8">
                                    <source src={previewAsset.url} />
                                </audio>
                            )}
                            {previewAsset.type === 'VIDEO' && (
                                <video controls autoPlay className="w-full h-full">
                                    <source src={previewAsset.url} />
                                </video>
                            )}
                            {previewAsset.type === 'IMAGE' && (
                                <img src={previewAsset.url} alt={previewAsset.name} className="max-h-[60vh] object-contain" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
