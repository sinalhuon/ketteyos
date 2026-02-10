'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Mail, User, Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        role: 'ADMIN',
        isSuperAdmin: false,
    });

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`/api/admin/admins/${userId}`);
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setFormData({
                    email: data.user.email,
                    name: data.user.name || '',
                    role: data.user.role,
                    isSuperAdmin: data.user.isSuperAdmin || false,
                });
            } else {
                alert('Failed to load user');
                router.push('/admin/admins');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            alert('Failed to load user');
            router.push('/admin/admins');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/admin/admins/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    role: formData.isSuperAdmin ? 'SUPER_ADMIN' : formData.role,
                    isSuperAdmin: formData.isSuperAdmin,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update user');
            }

            alert('User updated successfully!');
            router.push('/admin/admins');
        } catch (error) {
            console.error('Update user error:', error);
            alert(error instanceof Error ? error.message : 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(`/api/admin/admins/${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            alert('User deleted successfully!');
            router.push('/admin/admins');
        } catch (error) {
            console.error('Delete user error:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete user');
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
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/admins"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                    Back to User Management
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Edit User</h1>
                <p className="text-gray-500 dark:text-gray-400">Update user information and role</p>
            </header>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            readOnly
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#0a0a0a] text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <User size={16} className="inline mr-2" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            <Shield size={16} className="inline mr-2" />
                            User Role
                        </label>

                        <div className="space-y-3">
                            {/* Super Admin */}
                            <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-yellow-500 transition">
                                <input
                                    type="checkbox"
                                    checked={formData.isSuperAdmin}
                                    onChange={(e) => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                                            Super Admin
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Full access to all features including user management and settings
                                    </p>
                                </div>
                            </label>

                            {/* Regular Admin (only show if not super admin) */}
                            {!formData.isSuperAdmin && (
                                <div className="p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
                                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            Admin
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Access to client management, assets, and templates
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Delete Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={saving}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={18} />
                            Delete User
                        </button>
                        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                            This action cannot be undone
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
