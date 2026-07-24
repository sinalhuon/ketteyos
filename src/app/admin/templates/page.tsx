'use client';

import { useEffect, useState, useRef } from 'react';
import { apiFetch, auth } from '@/lib/api';
import { FileCode, Plus, Edit, Trash2, X, Eye, Upload, Video, Image as ImageIcon, Sparkles, Save, Music } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { TemplateSelector, TemplateConfig, defaultTemplateConfigs } from '@/components/Templates';

export default function TemplatesManagement() {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [templateConfig, setTemplateConfig] = useState<TemplateConfig>(defaultTemplateConfigs.default);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        codeKey: '',
        category: 'Universal',
        previewUrl: '',
        isActive: true,
        // New Asset Fields
        introVideoUrl: '',
        transitionVideoUrl: '',
        backgroundVideoUrl: '',
        effectLayerUrl: '',
        musicUrl: '',
        effectLayerOpacity: 1.0,
        effectLayerBlendMode: 'screen',
        introFrameUrl: '',
        transitionFrameUrl: '',
        detailFrameUrl: '',
        buttonImageUrl: '',
        guestFrameUrl: ''
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const data = await apiFetch('admin.php?action=templates');
            if (data.success) {
                setTemplates(data.templates);
            }
        } catch (e) {
            console.error('Failed to fetch templates', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm(t('admin.templatesPage.deleteConfirm'))) return;
        try {
            const res = await apiFetch(`admin.php?action=template&id=${id}`, { method: 'DELETE' });
            if (res.success) {
                setTemplates(templates.filter(t => t.id !== id));
                if (editingTemplate && editingTemplate.id === id) {
                    closeForm();
                }
            } else {
                toast.error(res.error || 'Failed to delete');
            }
        } catch (e) {
            toast.error('Error deleting template');
        }
    };

    const handleTemplateChange = (config: TemplateConfig) => {
        setTemplateConfig(config);
        // Update form data with template info
        setFormData(prev => ({
            ...prev,
            name: prev.name || config.name,
            codeKey: prev.codeKey || config.id
        }));
    };

    const handleVideoChange = (videoType: 'introVideoUrl' | 'transitionVideoUrl' | 'backgroundVideoUrl', url: string) => {
        setFormData(prev => ({
            ...prev,
            [videoType]: url
        }));
    };

    const closeForm = () => {
        setEditingTemplate(null);
        // Don't reset templateConfig - preserve the last selected configuration
        // setTemplateConfig(defaultTemplateConfigs.default);
        setFormData({
            name: '',
            codeKey: '',
            category: 'Universal',
            previewUrl: '',
            isActive: true,
            introVideoUrl: '',
            transitionVideoUrl: '',
            backgroundVideoUrl: '',
            effectLayerUrl: '',
            musicUrl: '',
            effectLayerOpacity: 1.0,
            effectLayerBlendMode: 'screen',
            introFrameUrl: '',
            transitionFrameUrl: '',
            detailFrameUrl: '',
            buttonImageUrl: '',
            guestFrameUrl: ''
        });
        setShowForm(false);
    };

    const addNew = () => {
        setEditingTemplate(null);
        // Don't reset templateConfig - preserve the last selected configuration
        // setTemplateConfig(defaultTemplateConfigs.default);
        setFormData({
            name: '',
            codeKey: '',
            category: 'Universal',
            previewUrl: '',
            isActive: true,
            introVideoUrl: '',
            transitionVideoUrl: '',
            backgroundVideoUrl: '',
            effectLayerUrl: '',
            musicUrl: '',
            effectLayerOpacity: 1.0,
            effectLayerBlendMode: 'screen',
            introFrameUrl: '',
            transitionFrameUrl: '',
            detailFrameUrl: '',
            buttonImageUrl: '',
            guestFrameUrl: ''
        });
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditingTemplate(null);
        setFormData({
            name: '',
            codeKey: '',
            category: 'Universal',
            previewUrl: '',
            isActive: true,
            introVideoUrl: '',
            transitionVideoUrl: '',
            backgroundVideoUrl: '',
            effectLayerUrl: '',
            musicUrl: '',
            effectLayerOpacity: 1.0,
            effectLayerBlendMode: 'screen',
            introFrameUrl: '',
            transitionFrameUrl: '',
            detailFrameUrl: '',
            buttonImageUrl: '',
            guestFrameUrl: ''
        });
        setShowForm(true);
    };

    const handleEditClick = (template: any) => {
        setEditingTemplate(template);

        // Load template configuration if exists
        if (template.templateConfig) {
            try {
                const config = JSON.parse(template.templateConfig);
                setTemplateConfig(config);
            } catch (e) {
                console.error('Failed to parse template config:', e);
                setTemplateConfig(defaultTemplateConfigs.default);
            }
        } else {
            setTemplateConfig(defaultTemplateConfigs.default);
        }

        setFormData({
            name: template.name || '',
            codeKey: template.codeKey || '',
            category: template.category || 'Universal',
            previewUrl: template.previewUrl || '',
            isActive: template.isActive == 1 || template.isActive === true,
            introVideoUrl: template.introVideoUrl || '',
            transitionVideoUrl: template.transitionVideoUrl || '',
            backgroundVideoUrl: template.backgroundVideoUrl || '',
            effectLayerUrl: template.effectLayerUrl || '',
            musicUrl: template.musicUrl || '',
            effectLayerOpacity: template.effectLayerOpacity ? parseFloat(template.effectLayerOpacity) : 1.0,
            effectLayerBlendMode: template.effectLayerBlendMode || 'screen',
            introFrameUrl: template.introFrameUrl || '',
            transitionFrameUrl: template.transitionFrameUrl || '',
            detailFrameUrl: template.detailFrameUrl || '',
            buttonImageUrl: template.buttonImageUrl || '',
            guestFrameUrl: template.guestFrameUrl || ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = {
                ...formData,
                isActive: formData.isActive ? 1 : 0,
                id: editingTemplate ? editingTemplate.id : undefined,
                // Include template configuration
                templateConfig: JSON.stringify(templateConfig)
            };

            const res = await apiFetch('admin.php?action=template', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (res.success) {
                fetchTemplates();
                // If it was a new template, we now have an ID
                if (!editingTemplate && res.id) {
                    const newTemplate = { ...body, id: res.id };
                    setEditingTemplate(newTemplate);
                }
                toast.success(t('admin.templatesPage.saveSuccess'));
            } else {
                toast.error(res.error || 'Operation failed');
            }
        } catch (e) {
            toast.error('Error saving template');
        } finally {
            setSaving(false);
        }
    };

    // Sub-component for uploading assets
    const AssetUploader = ({ label, value, onChange, type = 'video' }: any) => {
        const [uploading, setUploading] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        const handleUpload = async (file: File) => {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

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

        return (
            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
                <div className="flex gap-3 items-start">
                    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg p-2 flex items-center gap-3 relative overflow-hidden group">
                        {value ? (
                            type === 'video' ? (
                                <video src={value} className="w-16 h-10 object-cover rounded bg-black" />
                            ) : (
                                <img src={value} alt="Preview" className="w-16 h-10 object-cover rounded bg-black" />
                            )
                        ) : (
                            <div className="w-16 h-10 bg-[#222] rounded flex items-center justify-center">
                                {type === 'video' ? <Video size={16} className="text-gray-500" /> : <ImageIcon size={16} className="text-gray-500" />}
                            </div>
                        )}
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white flex-1 min-w-0"
                            placeholder={uploading ? "Uploading..." : "https://..."}
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="p-3 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-white rounded-lg transition-colors"
                        disabled={uploading}
                    >
                        <Upload size={16} />
                    </button>
                    <input
                        type="file"
                        ref={inputRef}
                        className="hidden"
                        accept={type === 'video' ? "video/*" : "image/*,video/*"}
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                    />
                </div>
            </div>
        );
    };

    const MusicSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
        const [musicAssets, setMusicAssets] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            fetchMusicAssets();
        }, []);

        const fetchMusicAssets = async () => {
            setLoading(true);
            try {
                const data = await apiFetch('admin.php?action=assets');
                if (data.success) {
                    setMusicAssets(data.assets.filter((a: any) => a.type === 'MUSIC'));
                }
            } catch (e) {
                console.error('Failed to fetch music assets', e);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('admin.templatesPage.selectMusic')}</label>
                <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <select
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#FFD700] outline-none appearance-none transition-colors focus:bg-black"
                            disabled={loading}
                        >
                            <option value="">{t('admin.templatesPage.noMusic')}</option>
                            {musicAssets.map(asset => (
                                <option key={asset.id} value={asset.url}>
                                    {asset.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            ▼
                        </div>
                    </div>
                    {value && (
                        <audio controls src={value} className="h-10 w-40 rounded-lg bg-[#f1f3f4]" />
                    )}
                </div>
            </div>
        );
    };

    const EffectSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
        const [effectAssets, setEffectAssets] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            fetchEffectAssets();
        }, []);

        const fetchEffectAssets = async () => {
            setLoading(true);
            try {
                const data = await apiFetch('admin.php?action=assets');
                if (data.success) {
                    setEffectAssets(data.assets.filter((a: any) => a.type === 'VIDEO' || a.type === 'EFFECT'));
                }
            } catch (e) {
                console.error('Failed to fetch effect assets', e);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('admin.templatesPage.selectEffect')}</label>
                <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <select
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-[#FFD700] outline-none appearance-none transition-colors focus:bg-black"
                            disabled={loading}
                        >
                            <option value="">{t('admin.templatesPage.noEffect')}</option>
                            {effectAssets.map(asset => (
                                <option key={asset.id} value={asset.url}>
                                    {asset.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            ▼
                        </div>
                    </div>
                    {value && (
                        <div className="h-10 w-10 relative rounded-lg overflow-hidden border border-[#333]">
                            <video src={value} className="w-full h-full object-cover" muted loop autoPlay />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const AssetSelector = ({ value, onChange, type = 'VIDEO' }: { value: string, onChange: (val: string) => void, type?: 'VIDEO' | 'IMAGE' | 'ALL' }) => {
        const [assets, setAssets] = useState<any[]>([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            fetchAssets();
        }, []);

        const fetchAssets = async () => {
            setLoading(true);
            try {
                const data = await apiFetch('admin.php?action=assets');
                if (data.success) {
                    if (type === 'ALL') {
                        setAssets(data.assets);
                    } else {
                        setAssets(data.assets.filter((a: any) => a.type === type));
                    }
                }
            } catch (e) {
                console.error('Failed to fetch assets', e);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="mt-1">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-gray-300 focus:border-[#FFD700] outline-none appearance-none transition-colors"
                >
                    <option value="">{t('admin.templatesPage.selectGlobal')}</option>
                    {assets.map(asset => (
                        <option key={asset.id} value={asset.url}>
                            {asset.name} ({asset.type})
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.templatesPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.templatesPage.subtitle')}</p>
                </div>
                {!showForm && (
                    <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#ffea75] transition">
                        <Plus size={18} /> {t('admin.templatesPage.addTemplate')}
                    </button>
                )}
            </header>

            <div className="space-y-8">
                {/* Templates Grid */}
                {!showForm && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <p className="text-gray-500 col-span-full text-center py-10">{t('common.loading')}</p>
                            ) : templates.map((template) => (
                                <div key={template.id} className={`bg-white dark:bg-[#111] rounded-2xl border overflow-hidden group transition-all shadow-sm dark:shadow-none ${editingTemplate?.id === template.id ? 'border-[#FFD700]' : 'border-gray-200 dark:border-[#222] hover:border-gray-300 dark:hover:border-[#333]'}`}>
                                    {/* Preview Area */}
                                    <div className="aspect-video bg-gray-100 dark:bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
                                        {template.previewUrl ? (
                                            <img src={template.previewUrl} alt={template.name} className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <FileCode size={48} className="text-gray-400 dark:text-gray-700" />
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setPreviewUrl(template.previewUrl)}
                                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition"
                                                title="Preview"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(template)}
                                                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full backdrop-blur-md transition"
                                                title="Edit"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, template.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="absolute top-3 right-3">
                                            {template.isActive == 1 ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold rounded uppercase border border-green-500/30">{t('admin.templatesPage.active')}</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase border border-red-500/30">{t('admin.templatesPage.inactive')}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{template.name}</h3>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{template.category || 'Uncategorized'}</span>
                                            <code className="bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded text-xs font-mono text-gray-600 dark:text-gray-400">{template.codeKey}</code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Section */}
                {showForm && (
                    <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-[#222] pb-6 sticky top-0 bg-white dark:bg-[#111] z-10 pt-2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    {editingTemplate ? <Edit size={24} className="text-[#FFD700]" /> : <Plus size={24} className="text-[#FFD700]" />}
                                    {editingTemplate ? t('admin.templatesPage.editTemplate') : t('admin.templatesPage.createTemplate')}
                                </h3>
                                <button onClick={closeForm} className="px-4 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-white rounded-lg flex items-center gap-2 transition text-sm font-medium">
                                    <X size={16} /> {t('common.cancel')}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 pb-2">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2">{t('admin.templatesPage.basicInfo')}</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.templatesPage.templateName')}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.templatesPage.codeKey')}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.codeKey}
                                                    onChange={e => setFormData({ ...formData, codeKey: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none font-mono text-sm transition-colors focus:bg-white dark:focus:bg-black"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.templatesPage.category')}</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none appearance-none transition-colors focus:bg-white dark:focus:bg-black"
                                                >
                                                    <option value="Universal">Universal / Multi Event</option>
                                                    <option value="Wedding">{t('admin.templatesPage.categories.wedding')}</option>
                                                    <option value="Birthday">{t('admin.templatesPage.categories.birthday')}</option>
                                                    <option value="Knot_Tying">Knot Tying</option>
                                                    <option value="Housewarming">Housewarming</option>
                                                    <option value="Party">{t('admin.templatesPage.categories.party')}</option>
                                                    <option value="Corporate">{t('admin.templatesPage.categories.corporate')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <AssetUploader
                                                label={t('admin.templatesPage.previewImage')}
                                                value={formData.previewUrl}
                                                onChange={(val: string) => setFormData({ ...formData, previewUrl: val })}
                                                type="image"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Template Customization */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2 flex items-center gap-2">
                                        <Sparkles size={14} /> Template Layout & Style
                                    </h4>
                                    <TemplateSelector
                                        onTemplateChange={handleTemplateChange}
                                        initialTemplate={templateConfig}
                                        existingVideos={{
                                            introVideoUrl: formData.introVideoUrl,
                                            transitionVideoUrl: formData.transitionVideoUrl,
                                            backgroundVideoUrl: formData.backgroundVideoUrl
                                        }}
                                    />
                                </div>

                                {/* Media Assets */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2 flex items-center gap-2">
                                        <Video size={14} />
                                        <ImageIcon size={14} />
                                        {t('admin.templatesPage.videoAssets')}
                                    </h4>
                                    <div className="space-y-6">
                                        <div>
                                            <AssetUploader
                                                label={t('admin.templatesPage.introVideo')}
                                                value={formData.introVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, introVideoUrl: val })}
                                            />
                                            <AssetSelector
                                                value={formData.introVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, introVideoUrl: val })}
                                                type="ALL"
                                            />
                                            <div className="mt-2 border-t border-dashed border-gray-200 dark:border-gray-800 pt-2">
                                                <AssetUploader
                                                    label={t('admin.templatesPage.introFrame')}
                                                    value={formData.introFrameUrl}
                                                    onChange={(val: string) => setFormData({ ...formData, introFrameUrl: val })}
                                                    type="image"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <AssetUploader
                                                label={t('admin.templatesPage.transitionVideo')}
                                                value={formData.transitionVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, transitionVideoUrl: val })}
                                            />
                                            <AssetSelector
                                                value={formData.transitionVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, transitionVideoUrl: val })}
                                                type="ALL"
                                            />
                                            <div className="mt-2 border-t border-dashed border-gray-200 dark:border-gray-800 pt-2">
                                                <AssetUploader
                                                    label={t('admin.templatesPage.transitionFrame')}
                                                    value={formData.transitionFrameUrl}
                                                    onChange={(val: string) => setFormData({ ...formData, transitionFrameUrl: val })}
                                                    type="image"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <AssetUploader
                                                label={t('admin.templatesPage.backgroundVideo')}
                                                value={formData.backgroundVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, backgroundVideoUrl: val })}
                                            />
                                            <AssetSelector
                                                value={formData.backgroundVideoUrl}
                                                onChange={(val: string) => setFormData({ ...formData, backgroundVideoUrl: val })}
                                                type="ALL"
                                            />
                                            <div className="mt-2 border-t border-dashed border-gray-200 dark:border-gray-800 pt-2">
                                                <AssetUploader
                                                    label={t('admin.templatesPage.detailFrame')}
                                                    value={formData.detailFrameUrl}
                                                    onChange={(val: string) => setFormData({ ...formData, detailFrameUrl: val })}
                                                    type="image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom UI Assets */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2 flex items-center gap-2">
                                        <Sparkles size={14} /> Custom UI Assets (Premium)
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           <div>
                                               <AssetUploader
                                                    label="Open Invitation Button (Image)"
                                                    value={formData.buttonImageUrl}
                                                    onChange={(val: string) => setFormData({ ...formData, buttonImageUrl: val })}
                                                    type="image"
                                                />
                                                <div className="mt-3">
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 block">Or choose predefined design:</span>
                                                    <div className="gap-2 grid grid-cols-2 lg:grid-cols-3">
                                                        {[1, 2, 3, 4, 5, 6].map(num => {
                                                            const btnUrl = '/assets/buttons/royal-' + num + '.svg';
                                                            const isSelected = formData.buttonImageUrl === btnUrl;
                                                            return (
                                                                <div 
                                                                    key={`royal-${num}`}
                                                                    onClick={() => setFormData({ ...formData, buttonImageUrl: btnUrl })}
                                                                    className={`cursor-pointer rounded border-2 transition-all overflow-hidden flex items-center justify-center p-1 bg-[#1a1a1a] ${isSelected ? 'border-[#FFD700] scale-105' : 'border-transparent hover:border-gray-500 hover:scale-105'}`}
                                                                >
                                                                    <img src={btnUrl} alt={`Royal Button ${num}`} className="w-full h-auto drop-shadow-md" />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        id="showButtonText"
                                                        checked={templateConfig.showButtonText !== false}
                                                        onChange={(e) => setTemplateConfig({ ...templateConfig, showButtonText: e.target.checked })}
                                                        className="w-3 h-3 accent-[#FFD700]"
                                                    />
                                                    <label htmlFor="showButtonText" className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                                                        Show text inside button
                                                    </label>
                                                </div>
                                            </div>
                                            <AssetUploader
                                                label="Guest Name Frame (Image)"
                                                value={formData.guestFrameUrl}
                                                onChange={(val: string) => setFormData({ ...formData, guestFrameUrl: val })}
                                                type="image"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Music Assets */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2 flex items-center gap-2">
                                        <Music size={14} /> {t('admin.templatesPage.musicAssets')}
                                    </h4>
                                    <MusicSelector
                                        value={formData.musicUrl}
                                        onChange={(val: string) => setFormData({ ...formData, musicUrl: val })}
                                    />
                                </div>

                                {/* Visual Effects */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-[#222] pb-2 flex items-center gap-2">
                                        <Sparkles size={14} /> {t('admin.templatesPage.visualEffects')}
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <AssetUploader
                                                label={t('admin.templatesPage.uploadPaste')}
                                                value={formData.effectLayerUrl}
                                                onChange={(val: string) => setFormData({ ...formData, effectLayerUrl: val })}
                                                type="video"
                                            />
                                            <EffectSelector
                                                value={formData.effectLayerUrl}
                                                onChange={(val: string) => setFormData({ ...formData, effectLayerUrl: val })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.templatesPage.opacity')}: {formData.effectLayerOpacity}</label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={formData.effectLayerOpacity}
                                                    onChange={(e) => setFormData({ ...formData, effectLayerOpacity: parseFloat(e.target.value) })}
                                                    className="w-full accent-[#FFD700]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.templatesPage.blendMode')}</label>
                                                <select
                                                    value={formData.effectLayerBlendMode}
                                                    onChange={e => setFormData({ ...formData, effectLayerBlendMode: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-2 py-2 text-gray-900 dark:text-white outline-none text-xs transition-colors focus:bg-white dark:focus:bg-black"
                                                >
                                                    <option value="screen">Screen</option>
                                                    <option value="overlay">Overlay</option>
                                                    <option value="multiply">Multiply</option>
                                                    <option value="normal">Normal</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#333]">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-10 h-5 rounded-full p-0.5 transition-colors ${formData.isActive ? 'bg-[#FFD700]' : 'bg-gray-300 dark:bg-[#333]'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                    <label className="text-xs text-gray-700 dark:text-gray-300">
                                        {formData.isActive ? t('admin.templatesPage.active') : t('admin.templatesPage.inactive')}
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:bg-[#ffea75] transition flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        t('admin.templatesPage.saving')
                                    ) : (
                                        <>
                                            {editingTemplate ? <Save size={18} /> : <Plus size={18} />}
                                            {editingTemplate ? t('admin.templatesPage.updateTemplate') : t('admin.templatesPage.createTemplate')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div >
                )
                }
            </div >

            {/* Preview Modal */}
            {
                previewUrl && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 text-center cursor-pointer" onClick={() => setPreviewUrl(null)}>
                        <img src={previewUrl} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl shadow-black" />
                    </div>
                )
            }
        </div >
    );
}
