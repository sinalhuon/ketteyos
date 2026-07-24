'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requireSuperAdmin?: boolean;
}

const Spinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
);

export default function AuthGuard({ children, requireAdmin, requireSuperAdmin }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            // Mark as redirecting immediately so we never flash content
            setRedirecting(true);
            router.replace(`/?redirect=${encodeURIComponent(pathname)}`);
            return;
        }

        setRedirecting(false);

        // Check Role
        if (requireSuperAdmin && !user.isSuperAdmin && user.role !== 'SUPER_ADMIN') {
            setRedirecting(true);
            router.replace('/dashboard');
            return;
        }

        if (requireAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            setRedirecting(true);
            router.replace('/dashboard');
            return;
        }
    }, [user, loading, router, pathname, requireAdmin, requireSuperAdmin]);

    // Show spinner whenever loading, not authenticated, or actively redirecting
    if (loading || !user || redirecting) {
        return <Spinner />;
    }

    // Check role guards before rendering
    if (requireSuperAdmin && !user.isSuperAdmin && user.role !== 'SUPER_ADMIN') {
        return <Spinner />;
    }

    if (requireAdmin && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return <Spinner />;
    }

    return <>{children}</>;
}
