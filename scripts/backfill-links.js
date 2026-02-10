const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting backfill...');

    // Backfill Events
    const events = await prisma.event.findMany({ where: { slug: null } });
    console.log(`Found ${events.length} events to backfill.`);

    for (const event of events) {
        let baseSlug = (event.title || 'event').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (event.groomLastName && event.brideLastName) {
            baseSlug = `${event.groomLastName}-${event.brideLastName}`.toLowerCase().replace(/[^a-z0-9]/g, '');
        }
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        const slug = `${baseSlug}-${randomSuffix}`;

        await prisma.event.update({
            where: { id: event.id },
            data: { slug }
        });
        console.log(`Updated event ${event.id} with slug ${slug}`);
    }

    // Backfill Guests
    const guests = await prisma.guest.findMany({ where: { shortCode: null } });
    console.log(`Found ${guests.length} guests to backfill.`);

    for (const guest of guests) {
        let shortCode = '';
        let isUnique = false;
        while (!isUnique) {
            shortCode = Math.random().toString(36).substring(2, 7).toUpperCase();
            const existing = await prisma.guest.findUnique({ where: { shortCode } });
            if (!existing) isUnique = true;
        }

        await prisma.guest.update({
            where: { id: guest.id },
            data: { shortCode }
        });
        // Console log less frequently for guests if there are many
        process.stdout.write('.');
    }
    console.log('\nBackfill complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
