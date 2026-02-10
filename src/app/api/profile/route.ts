import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
});

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                profileImage: true,
                role: true,
                isSuperAdmin: true,
                createdAt: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });

    } catch (error) {
        console.error('[API] Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH /api/profile
 * Update current user's profile (name only)
 */
export async function PATCH(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 });
        }

        const { name } = result.data;

        // Update user (name only)
        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: {
                ...(name !== undefined && { name }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                profileImage: true,
                role: true,
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('[API] Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
