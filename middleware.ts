import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const response = await updateSession(request);

    const sessionCookie = request.cookies.get('session')?.value;
    let currentUser = null;

    if (sessionCookie) {
        try {
            currentUser = await decrypt(sessionCookie);
            console.log('[Middleware] Session Decrypted:', currentUser);
        } catch (e) {
            console.log('[Middleware] Session Decrypt Failed');
        }
    } else {
        console.log('[Middleware] No Session Cookie');
    }

    // Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
            // Redirect unauthorized users to login (or dashboard if they are logged in but not admin)
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Dashboard Route Protection
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!currentUser) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect logged in users away from login/register
    if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && currentUser) {
        if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/admin/:path*'],
};
