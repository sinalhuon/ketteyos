import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { EventEditor } from './client-editor';

export default async function EventEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const paramsAwaited = await params;
    const id = paramsAwaited?.id;

    if (!id) notFound();
    const session = await getSession();

    if (!session) redirect('/login');

    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            template: true,
            guests: true,
            albumPhotos: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!event) notFound();
    if (event.userId !== session.userId && session.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const templates = await prisma.template.findMany({ where: { isActive: true } });
    const globalMusic = await prisma.globalAsset.findMany({ where: { type: 'MUSIC' } });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <div className="p-8 max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage and design your invitation.</p>
                    </div>
                    <a href={`/invitation/${event.id}`} target="_blank" className="bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition">
                        Preview Invitation
                    </a>
                </header>

                <EventEditor
                    event={event}
                    templates={templates}
                    globalMusic={globalMusic}
                    guests={event.guests}
                />
            </div>
        </div>
    );
}
