'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateEvent(eventId: string, data: any) {
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
        await prisma.event.update({
            where: { id: eventId },
            data: {
                title: data.title,
                date: data.date ? new Date(data.date) : undefined,
                location: data.location,
                logoUrl: data.logoUrl,
                logoSize: data.logoSize ? parseInt(data.logoSize.toString()) : 150,
                musicUrl: data.musicUrl,
                groomFatherName: data.groomFatherName,
                groomMotherName: data.groomMotherName,
                brideFatherName: data.brideFatherName,
                brideMotherName: data.brideMotherName,
                groomFirstName: data.groomFirstName,
                groomLastName: data.groomLastName,
                brideFirstName: data.brideFirstName,
                brideLastName: data.brideLastName,
                invitationMessage: data.invitationMessage,
                eventTime: data.eventTime,
                venueDetails: data.venueDetails,
                mapUrl: data.mapUrl,
                schedule: data.schedule,
                template: data.templateId ? { connect: { codeKey: data.templateId } } : undefined,
                slug: data.slug || undefined, // Allow updating slug if provided
            }
        });

        // Generate slug if not exists (for backward compatibility or new events without slug)
        // Note: Ideally this should be handled in create, but we only have update here.
        // Let's check if slug is null and generate one based on couple names.
        if (!event.slug && (data.groomLastName || data.brideLastName)) {
            const groom = data.groomLastName || event.groomLastName || 'groom';
            const bride = data.brideLastName || event.brideLastName || 'bride';
            const baseSlug = `${groom}-${bride}`.toLowerCase().replace(/[^a-z0-9]/g, '');
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const slug = `${baseSlug}-${randomSuffix}`;

            await prisma.event.update({
                where: { id: eventId },
                data: { slug }
            });
        }

        revalidatePath(`/dashboard/events/${eventId}`);
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Update Event Error:', error);
        return { error: `Failed to update event: ${(error as Error).message}` };
    }
}
