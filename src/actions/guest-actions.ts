'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function addGuest(eventId: string, name: string, phoneNumber?: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
        // Generate a unique short code
        let shortCode = '';
        let isUnique = false;
        while (!isUnique) {
            shortCode = Math.random().toString(36).substring(2, 7).toUpperCase();
            const existing = await prisma.guest.findUnique({ where: { shortCode } });
            if (!existing) isUnique = true;
        }

        const guest = await prisma.guest.create({
            data: {
                eventId,
                name,
                phoneNumber: phoneNumber || null,
                shortCode
            }
        });

        revalidatePath(`/dashboard/events/${eventId}`);
        return { success: true, guest };
    } catch (error) {
        console.error('Add Guest Error:', error);
        return { error: 'Failed to add guest' };
    }
}

export async function updateGuest(guestId: string, eventId: string, data: { name?: string; phoneNumber?: string }) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
        const guest = await prisma.guest.update({
            where: { id: guestId },
            data
        });
        revalidatePath(`/dashboard/events/${eventId}`);
        return { success: true, guest };
    } catch (error) {
        console.error('Update Guest Error:', error);
        return { error: 'Failed to update guest' };
    }
}

export async function deleteGuest(guestId: string, eventId: string) {
    const session = await getSession();
    if (!session) return { error: 'Unauthorized' };

    try {
        await prisma.guest.delete({ where: { id: guestId } });
        revalidatePath(`/dashboard/events/${eventId}`);
        return { success: true };
    } catch (error) {
        return { error: 'Failed' };
    }
}
