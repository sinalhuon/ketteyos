import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/permissions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/clients
 * List all client users
 */
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Admins and Super Admins can view clients
        if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const clients = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                _count: {
                    select: { events: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ clients });

    } catch (error) {
        console.error('[API] Get clients error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
