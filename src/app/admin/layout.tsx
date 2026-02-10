import Link from 'next/link';
import { LayoutDashboard, Users, Music, Settings, Crown, UserCog } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get session and user data
    const session = await getSession();

    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, email: true, profileImage: true, isSuperAdmin: true }
    });

    // Get app settings
    const appSettings = await prisma.appSettings.findFirst();
    const appName = appSettings?.appName || 'KETTEKYUOS';
    const appLogo = appSettings?.appLogo;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex flex-col md:flex-row font-sans transition-colors duration-300">
            {/* Premium Sidebar */}
            <aside className="w-full md:w-72 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-[#222] min-h-screen flex flex-col text-gray-900 dark:text-white shadow-xl relative overflow-hidden transition-colors duration-300">
                {/* Decorative Gold Glow (Subtle in Light Mode) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        {appLogo ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-yellow-500/20 shadow-lg">
                                <img src={appLogo} alt={appName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 text-white">
                                <Crown size={20} />
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold tracking-wide text-gray-900 dark:text-white">{appName}</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">Admin Portal</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                        <NavLink href="/admin/clients" icon={<Users size={20} />} label="Client Management" />
                        <NavLink href="/admin/assets" icon={<Music size={20} />} label="Global Assets" />
                        <NavLink href="/admin/templates" icon={<Settings size={20} />} label="Templates" />
                        {user?.isSuperAdmin && (
                            <>
                                <NavLink href="/admin/users" icon={<UserCog size={20} />} label="User Management" />
                                <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                            </>
                        )}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-gray-100 dark:border-[#222]">
                    <div className="flex justify-between items-center mb-6">
                        <ThemeToggle />
                    </div>

                    <Link href="/admin/profile" className="flex items-center gap-3 mb-4 hover:opacity-80 transition">
                        {user?.profileImage ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 relative">
                                <img src={user.profileImage} alt={user.name || 'Profile'} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{user?.email}</p>
                        </div>
                    </Link>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
                {children}
            </main>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-200 group relative overflow-hidden"
        >
            <span className="relative z-10 group-hover:scale-110 transition-transform duration-200">{icon}</span>
            <span className="relative z-10 font-medium">{label}</span>
            <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
        </Link>
    );
}
