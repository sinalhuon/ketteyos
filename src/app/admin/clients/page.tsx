import { prisma } from '@/lib/prisma';
import { Mail, Calendar, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { events: true } } }
    });

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Client Management</h1>
                <p className="text-gray-500 dark:text-gray-400">View and manage registered users.</p>
            </header>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium">Name</th>
                                <th className="px-6 py-4 text-left font-medium">Email</th>
                                <th className="px-6 py-4 text-left font-medium">Joined Date</th>
                                <th className="px-6 py-4 text-left font-medium">Events</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            {user.name || 'No Name'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Mail size={14} /> {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                                            {user._count.events} Events
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete User">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No clients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
