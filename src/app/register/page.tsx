'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Tag } from 'lucide-react';
import { auth, BASE_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
    id: string;
    name: string;
    nameEn?: string;
    price: string;
    currency: string;
}

function RegisterPageContent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phoneNumber: '', telegram: '', planId: '',
    });
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, loading: authLoading } = useAuth();

    useEffect(() => {
        // Load plans for selection (optional)
        fetch(`${BASE_URL}/public_pricing.php`)
            .then(r => r.json())
            .then(d => { if (d?.success && Array.isArray(d.plans)) setPlans(d.plans); })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            if (user.isSuperAdmin || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BASE_URL}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber,
                    telegram: formData.telegram,
                    planId: formData.planId || null,
                }),
            });
            const data = await res.json();

            if (data.success) {
                // Auto-login with token
                if (data.token && data.user) {
                    login(data.token, data.user);
                    router.push('/dashboard');
                } else {
                    setError('Registration successful but login failed. Please try logging in manually.');
                }
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Start creating beautiful invitations - Free registration!
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md text-center">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="e.g. 012345678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium flex justify-between items-center text-gray-700 dark:text-gray-300">
                                <span>Telegram <span className="text-gray-400 font-normal">(Optional)</span></span>
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.telegram}
                                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                                placeholder="@username or phone number"
                            />
                        </div>
                        {plans.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Tag size={14} /> Select Package <span className="text-gray-400 font-normal">(Optional - you can select later)</span>
                                </label>
                                <select
                                    value={formData.planId}
                                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">No plan (select later)</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nameEn || p.name} — {p.currency}{p.price}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Creating account...' : 'Sign up - It\'s Free!'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {"Already have an account? "}
                    <Link href="/login" className="font-medium text-yellow-600 hover:text-yellow-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
            </div>
        }>
            <RegisterPageContent />
        </Suspense>
    );
}
