'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addAlbumPhoto(eventId: string, imageUrl: string, order: number = 0) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    // Verify ownership
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) return { error: 'Event not found' };
    if (event.userId !== session.userId && session.role !== 'ADMIN') {
        return { error: 'Forbidden' };
    }

    try {
        const photo = await prisma.albumPhoto.create({
            data: {
                eventId,
                imageUrl,
                order,
            }
        });

        revalidatePath(`/dashboard/events/${eventId}`);
        revalidatePath(`/invitation/${eventId}`);
        return { success: true, photo };
    } catch (error) {
        console.error('Add Album Photo Error:', error);
        return { error: 'Failed to add photo' };
    }
}

export async function deleteAlbumPhoto(photoId: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
        const photo = await prisma.albumPhoto.findUnique({
            where: { id: photoId },
            include: { event: true }
        });

        if (!photo) return { error: 'Photo not found' };
        if (photo.event.userId !== session.userId && session.role !== 'ADMIN') {
            return { error: 'Forbidden' };
        }

        await prisma.albumPhoto.delete({
            where: { id: photoId }
        });

        revalidatePath(`/dashboard/events/${photo.eventId}`);
        revalidatePath(`/invitation/${photo.eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Delete Album Photo Error:', error);
        return { error: 'Failed to delete photo' };
    }
}

export async function reorderAlbumPhotos(eventId: string, photoOrders: { id: string, order: number }[]) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    // Verify ownership
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) return { error: 'Event not found' };
    if (event.userId !== session.userId && session.role !== 'ADMIN') {
        return { error: 'Forbidden' };
    }

    try {
        // Update all photos in a transaction
        await prisma.$transaction(
            photoOrders.map(({ id, order }) =>
                prisma.albumPhoto.update({
                    where: { id },
                    data: { order }
                })
            )
        );

        revalidatePath(`/dashboard/events/${eventId}`);
        revalidatePath(`/invitation/${eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Reorder Album Photos Error:', error);
        return { error: 'Failed to reorder photos' };
    }
}
