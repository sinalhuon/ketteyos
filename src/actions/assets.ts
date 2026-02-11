'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/auth';

export async function uploadAsset(formData: FormData) {
    const session = await getSession();
    console.log('[Upload Asset] Session:', JSON.stringify(session));

    if (!session) {
        console.error('[Upload Asset] No session found');
        return { error: 'Unauthorized: Please login again' };
    }
    if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
        console.error('[Upload Asset] Invalid role:', session.role);
        return { error: `Unauthorized: You need ADMIN role. Current role: ${session.role}. Please logout and login again.` };
    }

    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string; // MUSIC, VIDEO, IMAGE

    if (!file || !name || !type) {
        return { error: 'Missing fields' };
    }

    try {
        // Upload to Vercel Blob
        const filename = `${type.toLowerCase()}/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const blob = await put(filename, file, {
            access: 'public',
        });

        // Create DB Record
        await prisma.globalAsset.create({
            data: {
                name,
                type,
                url: blob.url
            }
        });

        revalidatePath('/admin/assets');
        return { success: true };

    } catch (error) {
        console.error('Upload Error:', error);
        return { error: 'Failed to upload file to Vercel Blob' };
    }
}
