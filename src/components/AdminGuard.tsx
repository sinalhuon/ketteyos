'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace(`/?redirect=${encodeURIComponent(pathname)}`);
        } else if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            router.replace('/dashboard'); // Redirect non-admins to user dashboard
        }
    }, [user, loading, router, pathname]);

    // Always gate on user presence — never reveal admin content if not authed
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return <>{children}</>;
}
