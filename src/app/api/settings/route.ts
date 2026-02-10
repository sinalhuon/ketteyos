import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateSettingsSchema = z.object({
    appName: z.string().min(1).max(50).optional(),
});

/**
 * GET /api/settings
 * Get app settings (public)
 */
export async function GET() {
    try {
        // Get or create default settings
        let settings = await prisma.appSettings.findFirst();

        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    appName: 'KETTEKYUOS',
                }
            });
        }

        return NextResponse.json({ settings });

    } catch (error) {
        console.error('[API] Get settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH /api/settings
 * Update app settings (super admin only)
 */
export async function PATCH(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is super admin
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isSuperAdmin: true }
        });

        if (!user?.isSuperAdmin) {
            return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const result = updateSettingsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 });
        }

        const { appName } = result.data;

        // Get or create settings
        let settings = await prisma.appSettings.findFirst();

        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    appName: appName || 'KETTEKYUOS',
                    updatedById: session.userId,
                }
            });
        } else {
            settings = await prisma.appSettings.update({
                where: { id: settings.id },
                data: {
                    ...(appName !== undefined && { appName }),
                    updatedById: session.userId,
                }
            });
        }

        return NextResponse.json({ success: true, settings });

    } catch (error) {
        console.error('[API] Update settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
