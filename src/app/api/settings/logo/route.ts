import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/settings/logo
 * Upload app logo (super admin only)
 */
export async function POST(request: Request) {
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

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, SVG, and WebP are allowed.' }, { status: 400 });
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Maximum size is 2MB.' }, { status: 400 });
        }

        // Get or create settings
        let settings = await prisma.appSettings.findFirst();

        if (!settings) {
            settings = await prisma.appSettings.create({
                data: {
                    appName: 'KETTEKYUOS',
                    updatedById: session.userId,
                }
            });
        }

        // Delete old logo if exists
        if (settings.appLogo) {
            const oldLogoPath = join(process.cwd(), 'public', settings.appLogo);
            if (existsSync(oldLogoPath)) {
                try {
                    await unlink(oldLogoPath);
                } catch (error) {
                    console.error('Error deleting old logo:', error);
                }
            }
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `logo-${timestamp}.${extension}`;
        const filepath = join(process.cwd(), 'public', 'uploads', 'branding', filename);

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Update settings
        const logoUrl = `/uploads/branding/${filename}`;
        settings = await prisma.appSettings.update({
            where: { id: settings.id },
            data: {
                appLogo: logoUrl,
                updatedById: session.userId,
            }
        });

        return NextResponse.json({ success: true, logoUrl });

    } catch (error) {
        console.error('[API] Upload logo error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/settings/logo
 * Remove app logo (super admin only)
 */
export async function DELETE() {
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

        // Get settings
        const settings = await prisma.appSettings.findFirst();

        if (!settings?.appLogo) {
            return NextResponse.json({ error: 'No logo to delete' }, { status: 400 });
        }

        // Delete file
        const logoPath = join(process.cwd(), 'public', settings.appLogo);
        if (existsSync(logoPath)) {
            try {
                await unlink(logoPath);
            } catch (error) {
                console.error('Error deleting logo:', error);
            }
        }

        // Update settings
        await prisma.appSettings.update({
            where: { id: settings.id },
            data: {
                appLogo: null,
                updatedById: session.userId,
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[API] Delete logo error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
