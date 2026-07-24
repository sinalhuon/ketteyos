'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        document.cookie = 'session=; path=/; max-age=0';
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-500"
        >
            Sign out
        </button>
    );
}
