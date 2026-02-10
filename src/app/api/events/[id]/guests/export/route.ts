import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: eventId } = await params;

        // Verify event ownership
        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                userId: session.userId,
            },
            include: {
                guests: true,
            },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Get base URL from request
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;

        // Generate CSV content
        const headers = ['Name', 'Email', 'Phone Number', 'Status', 'Invitation Link'];
        const rows = event.guests.map((guest: any) => {
            const inviteLink = event.slug && guest.shortCode
                ? `${baseUrl}/invite/${event.slug}/${guest.shortCode}`
                : `${baseUrl}/invite/${guest.token}`;

            return [
                guest.name,
                guest.email || '',
                guest.phoneNumber || '',
                guest.status,
                inviteLink,
            ];
        });

        // Build CSV
        const csv = [
            headers.join(','),
            ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(',')),
        ].join('\n');

        // Return CSV file
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="guests-${event.slug || eventId}.csv"`,
            },
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export guests' }, { status: 500 });
    }
}
