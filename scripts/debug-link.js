const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const slug = '-sa2vd';
    const shortCode = '5AURT';

    console.log(`Checking for Event: ${slug} and Guest: ${shortCode}`);

    const event = await prisma.event.findUnique({
        where: { slug },
    });

    if (!event) {
        console.error('❌ Event NOT found with slug:', slug);
        // Try searching for partial or list all to see what's there
        const allEvents = await prisma.event.findMany({ select: { slug: true, id: true } });
        console.log('Available slugs:', allEvents.map(e => e.slug));
    } else {
        console.log('✅ Event found:', event.title, event.id);
    }

    const guest = await prisma.guest.findUnique({
        where: { shortCode },
        include: { event: true } // Include event to check relationship
    });

    if (!guest) {
        console.error('❌ Guest NOT found with shortCode:', shortCode);
        const allGuests = await prisma.guest.findMany({ select: { shortCode: true, eventId: true } });
        console.log('Available shortCodes:', allGuests.map(g => g.shortCode));
    } else {
        console.log('✅ Guest found:', guest.name);
        console.log('Guest EventId:', guest.eventId);

        if (event && guest.eventId === event.id) {
            console.log('✅ Relationship VALID: Guest belongs to this Event.');
        } else {
            console.error('❌ Relationship INVALID: Guest eventId does not match Event id.');
            console.log(`Guest EventId: ${guest.eventId}, Event Id: ${event?.id}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
