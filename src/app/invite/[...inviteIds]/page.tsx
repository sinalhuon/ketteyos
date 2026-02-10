import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InvitationView from '@/components/Invitation/InvitationView';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ inviteIds: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { inviteIds } = await params;

    // Case 1: Legacy Token Route /invite/[token]
    if (inviteIds.length === 1) {
        const token = inviteIds[0];
        const guest = await prisma.guest.findUnique({
            where: { token },
            include: { event: true }
        });

        if (!guest || !guest.event) return { title: 'Invitation Not Found' };
        return {
            title: `Invitation for ${guest.name} - ${guest.event.title}`,
            description: `You are invited to ${guest.event.title}`,
        };
    }

    // Case 2: New Slug/Code Route /invite/[slug]/[code]
    if (inviteIds.length === 2) {
        const [slug, code] = inviteIds;
        const event = await prisma.event.findUnique({ where: { slug } });
        if (!event) return { title: 'Event Not Found' };

        const guest = await prisma.guest.findUnique({
            where: { shortCode: code },
            include: { event: true }
        });

        if (!guest || guest.eventId !== event.id) return { title: 'Invitation Not Found' };

        return {
            title: `Invitation for ${guest.name} - ${event.title}`,
            description: `You are invited to ${event.title}`,
        };
    }

    return { title: 'Invitation Not Found' };
}

export default async function InvitationPage({ params }: Props) {
    const { inviteIds } = await params;

    let event = null;
    let guest = null;

    // Case 1: Legacy Token Route /invite/[token]
    if (inviteIds.length === 1) {
        const token = inviteIds[0];
        guest = await prisma.guest.findUnique({
            where: { token },
        });

        if (guest) {
            event = await prisma.event.findUnique({
                where: { id: guest.eventId },
                include: { albumPhotos: true }
            });
        }
    }
    // Case 2: New Slug/Code Route /invite/[slug]/[code]
    else if (inviteIds.length === 2) {
        const [slug, code] = inviteIds;
        // Decode URI components just in case
        const decodedSlug = decodeURIComponent(slug);
        const decodedCode = decodeURIComponent(code);

        event = await prisma.event.findUnique({
            where: { slug: decodedSlug },
            include: { albumPhotos: true }
        });

        if (event) {
            guest = await prisma.guest.findUnique({
                where: { shortCode: decodedCode },
            });

            // Verify guest belongs to event
            if (guest && guest.eventId !== event.id) {
                guest = null;
            }
        }
    }

    if (!event || !guest) {
        notFound();
    }

    return (
        <InvitationView
            guestName={guest.name}
            eventTitle={event.title}
            eventDate={event.date}
            location={event.location}
            eventType={event.eventType}
            musicUrl={event.musicUrl}
            logoUrl={event.logoUrl}
            logoSize={event.logoSize}
            groomFatherName={event.groomFatherName}
            groomMotherName={event.groomMotherName}
            brideFatherName={event.brideFatherName}
            brideMotherName={event.brideMotherName}
            groomFirstName={event.groomFirstName}
            groomLastName={event.groomLastName}
            brideFirstName={event.brideFirstName}
            brideLastName={event.brideLastName}
            invitationMessage={event.invitationMessage}
            eventTime={event.eventTime}
            venueDetails={event.venueDetails}
            mapUrl={event.mapUrl}
            schedule={event.schedule}
            albumPhotos={event.albumPhotos}
        />
    );
}
