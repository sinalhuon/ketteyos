'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Mail, User, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'ADMIN',
        isSuperAdmin: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            // Note: We are using the /api/admin/users endpoint now (formerly admins)
            // But wait, I need to check if I renamed the API endpoint too?
            // Yes, I plan to move /api/admin/admins to /api/admin/users
            // BUT, right now the code on disk for API might still be /api/admin/admins if I fail to move it?
            // The command "mv src/app/api/admin/admins src/app/api/admin/users" was NOT run yet (I ran mv users -> clients).

            // Wait, I haven't moved /api/admin/admins yet because it didn't exist in ls output! 
            // I created it in step 1417 (route.ts). 
            // I should use /api/admin/users here and ensure I create that API route.

            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    role: formData.isSuperAdmin ? 'SUPER_ADMIN' : formData.role,
                    isSuperAdmin: formData.isSuperAdmin,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            alert('User created successfully!');
            router.push('/admin/users');
        } catch (error) {
            console.error('Create user error:', error);
            alert(error instanceof Error ? error.message : 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                    <ArrowLeft size={20} />
                    Back to User Management
                </Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add New User</h1>
                <p className="text-gray-500 dark:text-gray-400">Create a new admin or super admin user</p>
            </header>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            required
                        />
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock size={16} className="inline mr-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            minLength={6}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Minimum 6 characters
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Lock size={16} className="inline mr-2" />
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            minLength={6}
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

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
