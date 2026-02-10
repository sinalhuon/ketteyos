import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/permissions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/permissions
 * Get all available permissions grouped by category
 */
export async function GET() {
    try {
        const session = await getSession();

        if (!session || session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const permissions = await prisma.permission.findMany({
            orderBy: [
                { category: 'asc' },
                { name: 'asc' }
            ]
        });

        // Group by category
        const grouped: Record<string, typeof permissions> = {};

        for (const permission of permissions) {
            if (!grouped[permission.category]) {
                grouped[permission.category] = [];
            }
            grouped[permission.category].push(permission);
        }

        return NextResponse.json({ categories: grouped });

    } catch (error) {
        console.error('[API] Get permissions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
