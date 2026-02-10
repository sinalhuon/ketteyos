import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const eventSchema = z.object({
    title: z.string().min(3),
    date: z.string(),
    location: z.string().min(3),
    eventType: z.string().optional(),
    musicUrl: z.string().optional(),
    schedule: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const result = eventSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { title, date, location, eventType, musicUrl, schedule } = result.data;

        const event = await prisma.event.create({
            data: {
                title,
                date: new Date(date),
                location,
                eventType: (eventType as any) || 'wedding',
                musicUrl,
                schedule,
                userId: session.userId as string,
                // Create a default "self" guest so the creator can see the invite immediately
                guests: {
                    create: {
                        name: 'Me (Preview)',
                        status: 'OPENED'
                    }
                }
            } as any
        });

        return NextResponse.json({ success: true, event });

    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
