'use client';

import { useState, useEffect } from 'react';
import { LogoUpload } from '@/components/LogoUpload';
import { Building2, Image as ImageIcon, Save, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    const [appName, setAppName] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();

            if (response.ok) {
                setSettings(data.settings);
                setAppName(data.settings.appName || 'KETTEKYUOS');
            } else if (response.status === 403) {
                alert('Access denied: Super admin only');
                router.push('/admin/dashboard');
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appName }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update settings');
            }

            alert('Settings updated successfully! Refresh the page to see changes.');
            setSettings(data.settings);
        } catch (error) {
            console.error('Update error:', error);
            alert(error instanceof Error ? error.message : 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/settings/logo', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }

        return data.logoUrl;
    };

    const handleLogoRemove = async () => {
        const response = await fetch('/api/settings/logo', {
            method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove logo');
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
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">App Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Configure your application branding and settings</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* App Logo */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ImageIcon size={20} />
                            App Logo
                        </h2>
                        <LogoUpload
                            currentLogo={settings?.appLogo}
                            onUploadSuccess={(logoUrl) => setSettings({ ...settings, appLogo: logoUrl })}
                            onRemoveSuccess={() => setSettings({ ...settings, appLogo: null })}
                        />
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                <Info size={14} className="mt-0.5 flex-shrink-0" />
                                <span>Recommended size: 200x200px. Supports JPG, PNG, SVG, WebP (max 2MB)</span>
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    {settings?.updatedAt && (
                        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6 mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last Updated</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(settings.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>

                {/* App Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Building2 size={20} />
                            App Information
                        </h2>
                        <form onSubmit={handleUpdateSettings} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Application Name
                                </label>
                                <input
                                    type="text"
                                    value={appName}
                                    onChange={(e) => setAppName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    placeholder="KETTEKYUOS"
                                    maxLength={50}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    This name will appear in the admin portal sidebar and throughout the application.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Preview */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
                        <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-lg p-4 border border-gray-200 dark:border-[#222]">
                            <div className="flex items-center gap-3">
                                {settings?.appLogo ? (
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
                                        <img src={settings.appLogo} alt="App Logo" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 text-white">
                                        <Building2 size={20} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">
                                        {appName || 'KETTEKYUOS'}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                        Admin Portal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
