'use server';

import { getSession } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function uploadFile(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'misc';

    if (!file) {
        return { error: 'No file provided' };
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads', folder);

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) { }

        const filePath = path.join(uploadDir, filename);

        // Save file
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${folder}/${filename}`;
        return { success: true, url: publicUrl };

    } catch (error) {
        console.error('Upload Error:', error);
        return { error: 'Failed to upload file' };
    }
}
