import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { Plus } from 'lucide-react';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string },
        include: {
            events: {
                orderBy: { createdAt: 'desc' },
                include: { guests: true }
            }
        }
    });

    if (!user) redirect('/login');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-gray-100 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">
                        My Events
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {user.name}
                        </span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Events</h2>
                    <Link
                        href="/dashboard/new"
                        className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        New Event
                    </Link>
                </div>

                {user.events.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any events yet.</p>
                        <Link
                            href="/dashboard/new"
                            className="text-yellow-600 hover:underline font-medium"
                        >
                            Create your first invitation
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.events.map((event: any) => (
                            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium mt-1">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        {event.guests.length} Guests
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                    {event.location}
                                </p>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <Link
                                        href={`/dashboard/events/${event.id}`}
                                        className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded"
                                    >
                                        Manage
                                    </Link>
                                    <Link
                                        href={`/invite/${event.guests[0]?.token || '#'}`} // Fallback if no guests, realistically show preview link
                                        target="_blank"
                                        className={`flex-1 text-center text-sm font-medium text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 py-2 rounded ${!event.guests.length ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        Preview
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
