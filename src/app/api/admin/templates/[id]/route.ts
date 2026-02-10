import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/permissions';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateTemplateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    previewUrl: z.string().optional(),
    introVideoUrl: z.string().optional(),
    transitionVideoUrl: z.string().optional(),
    backgroundVideoUrl: z.string().optional(),
    effectLayerUrl: z.string().optional(),
    effectLayerOpacity: z.number().optional(), // Added opacity
    effectLayerBlendMode: z.string().optional(), // Added blend mode
    // Capacity removed
    isActive: z.boolean().optional(),
});

/**
 * GET /api/admin/templates/[id]
 * Get template details
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only admins/super admins can view templates detail
        if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        const template = await prisma.template.findUnique({
            where: { id },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json({ template });

    } catch (error) {
        console.error('[API] Get template error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/templates/[id]
 * Update template details
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        console.log('[API] PATCH template - start');
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only super admins can update templates? Or just admins?
        // Let's allow admins for now
        if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        console.log('[API] PATCH template - id:', id);

        const body = await request.json();
        console.log('[API] PATCH template - body:', body);

        const result = updateTemplateSchema.safeParse(body);

        if (!result.success) {
            console.error('[API] Validation error:', result.error);
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 });
        }

        const data = result.data;
        console.log('[API] PATCH template - data to update:', data);

        // Check if template exists
        const template = await prisma.template.findUnique({
            where: { id }
        });

        if (!template) {
            console.error('[API] Template not found:', id);
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        // Update template
        const updatedTemplate = await prisma.template.update({
            where: { id },
            data: {
                ...data
            }
        });

        console.log('[API] PATCH template - success');
        return NextResponse.json({ success: true, template: updatedTemplate });

    } catch (error: any) {
        console.error('[API] Update template error:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
