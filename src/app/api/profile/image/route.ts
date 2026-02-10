import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/profile/image
 * Upload profile image
 */
export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Get current user to check for existing image
        const currentUser = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { profileImage: true }
        });

        // Delete old profile image if exists
        if (currentUser?.profileImage) {
            const oldImagePath = join(process.cwd(), 'public', currentUser.profileImage);
            if (existsSync(oldImagePath)) {
                try {
                    await unlink(oldImagePath);
                } catch (error) {
                    console.error('Error deleting old profile image:', error);
                }
            }
        }

        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `${session.userId}-${timestamp}.${extension}`;
        const filepath = join(process.cwd(), 'public', 'uploads', 'profiles', filename);

        // Save file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Update user profile
        const imageUrl = `/uploads/profiles/${filename}`;
        await prisma.user.update({
            where: { id: session.userId },
            data: { profileImage: imageUrl }
        });

        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error('[API] Upload profile image error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/profile/image
 * Remove profile image
 */
export async function DELETE() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current user
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { profileImage: true }
        });

        if (!user?.profileImage) {
            return NextResponse.json({ error: 'No profile image to delete' }, { status: 400 });
        }

        // Delete file
        const imagePath = join(process.cwd(), 'public', user.profileImage);
        if (existsSync(imagePath)) {
            try {
                await unlink(imagePath);
            } catch (error) {
                console.error('Error deleting profile image:', error);
            }
        }

        // Update user profile
        await prisma.user.update({
            where: { id: session.userId },
            data: { profileImage: null }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[API] Delete profile image error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
