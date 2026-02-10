'use client';

import { useState, useEffect } from 'react';
import { ProfileImageUpload } from '@/components/ProfileImageUpload';
import { User, Mail, Lock, Calendar, Shield, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setName(data.user.name || '');
                setEmail(data.user.email);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }), // Only send name
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            alert('Profile updated successfully!');
            setUser(data.user);
        } catch (error) {
            console.error('Update error:', error);
            alert(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setSaving(true);

        try {
            const response = await fetch('/api/profile/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Password change error:', error);
            alert(error instanceof Error ? error.message : 'Failed to change password');
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
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account information</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Picture</h2>
                        <ProfileImageUpload
                            currentImage={user?.profileImage}
                            onUploadSuccess={(imageUrl) => setUser({ ...user, profileImage: imageUrl })}
                            onRemoveSuccess={() => setUser({ ...user, profileImage: null })}
                        />
                    </div>

                    {/* Account Info */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Info</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                {user?.isSuperAdmin ? (
                                    <>
                                        <Crown size={16} className="text-yellow-500" />
                                        <span className="font-medium text-yellow-600 dark:text-yellow-400">Super Admin</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield size={16} className="text-blue-500" />
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{user?.role}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar size={16} />
                                <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form & Password */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Mail size={16} className="inline mr-2" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#0a0a0a] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Email cannot be changed for security reasons
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Lock size={16} className="inline mr-2" />
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                            >
                                {saving ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
