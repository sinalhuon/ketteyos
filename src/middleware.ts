import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/settings'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for the session cookie (set by AuthContext.login)
    const session = request.cookies.get('session')?.value;

    // If user is already authenticated and tries to access login/register → redirect to home
    if (authRoutes.some((route) => pathname === route || pathname === route + '/')) {
        if (session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // Check if this is a protected route
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Protected route + no session cookie → redirect to home/login
    if (!session) {
        const redirectUrl = new URL('/', request.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Session cookie exists — allow the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, icon.png, robots.txt
         * - public files
         */
        '/((?!_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml).*)',
    ],
};
