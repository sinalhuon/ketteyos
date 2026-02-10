import { prisma } from '@/lib/prisma';
import { Users, Calendar, Music, TrendingUp, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const userCount = await prisma.user.count({ where: { role: 'CLIENT' } });
    const eventCount = await prisma.event.count();
    const assetCount = await prisma.globalAsset.count();

    // Fetch recent events for the "Activity Feed"
    const recentEvents = await prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="p-8">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Super Owner. Here's what's happening today.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-4 py-1 rounded-full inline-block">
                        Kettekyuos System v1.0
                    </p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Total Clients"
                    value={userCount}
                    icon={<Users size={24} className="text-blue-500" />}
                    gradient="from-blue-500/10 to-blue-500/5"
                    border="border-blue-200 dark:border-blue-900"
                />
                <StatCard
                    title="Total Events"
                    value={eventCount}
                    icon={<Calendar size={24} className="text-purple-500" />}
                    gradient="from-purple-500/10 to-purple-500/5"
                    border="border-purple-200 dark:border-purple-900"
                />
                <StatCard
                    title="Global Assets"
                    value={assetCount}
                    icon={<Music size={24} className="text-yellow-500" />}
                    gradient="from-yellow-500/10 to-yellow-500/5"
                    border="border-yellow-200 dark:border-yellow-900"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table */}
                <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-[#222] flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock size={18} className="text-gray-400" /> Recent Events
                        </h3>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-900">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 text-left font-medium">Event Name</th>
                                    <th className="px-6 py-4 text-left font-medium">Client</th>
                                    <th className="px-6 py-4 text-left font-medium">Date</th>
                                    <th className="px-6 py-4 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                                {recentEvents.map((event: any) => (
                                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{event.title}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{event.user.name || event.user.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(event.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No events found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Widget */}
                <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-1">System Health</h3>
                        <p className="text-gray-400 text-sm mb-6">Everything is running smoothly.</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Database</span>
                                <span className="text-green-400 flex items-center gap-1">● Connected</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Storage</span>
                                <span className="text-green-400 flex items-center gap-1">● Optimal</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">API Latency</span>
                                <span className="text-green-400 flex items-center gap-1">24ms</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                                    <TrendingUp size={16} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">+12%</p>
                                    <p className="text-xs text-gray-400">Traffic increase</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, gradient, border }: any) {
    return (
        <div className={`bg-white dark:bg-[#111] p-6 rounded-2xl border ${border} shadow-sm relative overflow-hidden group hover:shadow-lg transition-all`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} blur-2xl rounded-bl-full opacity-50`}></div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl">{icon}</div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-[#222] px-2 py-1 rounded">+2.5%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            </div>
        </div>
    );
}
