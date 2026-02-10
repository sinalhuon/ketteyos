import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InvitationView from '@/components/Invitation/InvitationView';

export default async function InvitationPage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ g?: string }>
}) {
    const { slug: id } = await props.params;

    console.log('[InvitationPage] Accessing slug:', id);

    const searchParams = await props.searchParams;
    const guestToken = searchParams.g;

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            albumPhotos: {
                orderBy: { order: 'asc' }
            },
            template: true
        }
    });

    if (!event) {
        console.log('[InvitationPage] Event not found for id:', id);
        notFound();
    } else {
        console.log('[InvitationPage] Event found:', event.title);
    }


    let guestName = '';
    if (guestToken) {
        const guest = await prisma.guest.findUnique({
            where: { token: guestToken }
        });
        if (guest && guest.eventId === event.id) {
            guestName = guest.name;
            // Optionally update status to OPENED
            await prisma.guest.update({
                where: { id: guest.id },
                data: { status: 'OPENED' }
            }).catch(() => { });
        }
    }

    return (
        <InvitationView
            guestName={guestName}
            eventTitle={event.title}
            eventDate={event.date}
            location={event.location}
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
            venueDetails={event.venueDetails}
            mapUrl={event.mapUrl}
            schedule={event.schedule}
            albumPhotos={event.albumPhotos}

            eventType={event.eventType}
            introVideoUrl={event.template.introVideoUrl}
            transitionVideoUrl={event.template.transitionVideoUrl}
            backgroundVideoUrl={event.template.backgroundVideoUrl}
            effectLayerUrl={event.template.effectLayerUrl}
            effectLayerOpacity={event.template.effectLayerOpacity}
            effectLayerBlendMode={event.template.effectLayerBlendMode}
        />
    );
}
