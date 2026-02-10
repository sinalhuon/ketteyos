'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, LayoutTemplate, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import VideoUpload from '@/components/VideoUpload';

export default function EditTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const templateId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [template, setTemplate] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        previewUrl: '',
        introVideoUrl: '',
        transitionVideoUrl: '',
        backgroundVideoUrl: '',
        effectLayerUrl: '',
        effectLayerOpacity: 1.0,
        effectLayerBlendMode: 'screen',
        isActive: true,
    });

    useEffect(() => {
        fetchTemplate();
    }, [templateId]);

    const fetchTemplate = async () => {
        try {
            // Note: We might need to fetch this from a generic API or specific endpoint.
            // Since we don't have a public template fetch API, we'll implement GET in the same route as PATCH.
            const response = await fetch(`/api/admin/templates/${templateId}`);
            const data = await response.json();

            if (response.ok) {
                setTemplate(data.template);
                setFormData({
                    name: data.template.name,
                    description: data.template.description || '',
                    previewUrl: data.template.previewUrl || '',
                    introVideoUrl: data.template.introVideoUrl || '',
                    transitionVideoUrl: data.template.transitionVideoUrl || '',
                    backgroundVideoUrl: data.template.backgroundVideoUrl || '',
                    effectLayerUrl: data.template.effectLayerUrl || '',
                    effectLayerOpacity: data.template.effectLayerOpacity ?? 1.0,
                    effectLayerBlendMode: data.template.effectLayerBlendMode || 'screen',
                    isActive: data.template.isActive,
                });
            } else {
                alert('Failed to load template');
                router.push('/admin/templates');
            }
        } catch (error) {
            console.error('Failed to fetch template:', error);
            // alert('Failed to load template'); // Use toast in real app
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/admin/templates/${templateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update template');
            }

            alert('Template updated successfully!');
            router.push('/admin/templates');
        } catch (error) {
            console.error('Update template error:', error);
            alert(error instanceof Error ? error.message : 'Failed to update template');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/templates"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                    Back to Templates
                </Link>
            </div>

            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit Template</h1>
                    <p className="text-gray-500 dark:text-gray-400">Update template assets and details</p>
                </div>
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono text-gray-500">
                    ID: {template?.codeKey}
                </div>
            </header>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Template Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>


                            <label className="flex items-center gap-3 p-2 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                                />
                                <span className="font-medium text-gray-900 dark:text-white">Active (Visible to users)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                    </div>

                    <div className="border-t border-gray-200 dark:border-[#222] my-6"></div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <LayoutTemplate size={20} className="text-yellow-600" />
                        Video Assets
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Intro Video */}
                        <VideoUpload
                            label="Intro Video (First Screen)"
                            currentVideoUrl={formData.introVideoUrl}
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, introVideoUrl: url }))}
                            onRemoveSuccess={() => setFormData(prev => ({ ...prev, introVideoUrl: '' }))}
                        />

                        {/* Transition Video */}
                        <VideoUpload
                            label="Transition Video (Middle)"
                            currentVideoUrl={formData.transitionVideoUrl}
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, transitionVideoUrl: url }))}
                            onRemoveSuccess={() => setFormData(prev => ({ ...prev, transitionVideoUrl: '' }))}
                        />

                        {/* Background Video */}
                        <VideoUpload
                            label="Background Video (Second Screen)"
                            currentVideoUrl={formData.backgroundVideoUrl}
                            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, backgroundVideoUrl: url }))}
                            onRemoveSuccess={() => setFormData(prev => ({ ...prev, backgroundVideoUrl: '' }))}
                        />

                        {/* Visual Effect Layer */}
                        <div className="space-y-4">
                            <VideoUpload
                                label="Visual Effect Layer (Overlay)"
                                currentVideoUrl={formData.effectLayerUrl}
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, effectLayerUrl: url }))}
                                onRemoveSuccess={() => setFormData(prev => ({ ...prev, effectLayerUrl: '' }))}
                            />

                            {/* Effect Settings (Only show if effect layer exists) */}
                            {formData.effectLayerUrl && (
                                <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#333] space-y-4">
                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">Effect Settings</h4>

                                    {/* Opacity */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Opacity</label>
                                            <span className="text-xs font-mono text-gray-500">{Math.round(formData.effectLayerOpacity * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={formData.effectLayerOpacity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, effectLayerOpacity: parseFloat(e.target.value) }))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-600"
                                        />
                                    </div>

                                    {/* Blend Mode */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Blend Mode</label>
                                        <select
                                            value={formData.effectLayerBlendMode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, effectLayerBlendMode: e.target.value }))}
                                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-[#0a0a0a] border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-yellow-500 focus:outline-none"
                                        >
                                            <option value="screen">Screen (Best for Black BG)</option>
                                            <option value="overlay">Overlay</option>
                                            <option value="lighten">Lighten</option>
                                            <option value="plus-lighter">Plus Lighter</option>
                                            <option value="normal">Normal</option>
                                            <option value="multiply">Multiply (Darken)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-[#222]">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving Changes...' : 'Save Template'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
