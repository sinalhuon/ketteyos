import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Crown, UserPlus, Mail, Calendar, Shield, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminsPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    const isSuper = await isSuperAdmin(session.userId);
    if (!isSuper) {
        redirect('/admin/dashboard');
    }

    const admins = await prisma.user.findMany({
        where: {
            OR: [
                { role: 'ADMIN' },
                { role: 'SUPER_ADMIN' }
            ]
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isSuperAdmin: true,
            createdAt: true,
            createdBy: {
                select: {
                    name: true,
                    email: true
                }
            },
            permissions: {
                where: { granted: true },
                select: {
                    permission: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage admin users and their permissions</p>
                </div>
                <Link
                    href="/admin/admins/new"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                    <UserPlus size={18} />
                    Add New User
                </Link>
            </div>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium">Admin</th>
                                <th className="px-6 py-4 text-left font-medium">Role</th>
                                <th className="px-6 py-4 text-left font-medium">Permissions</th>
                                <th className="px-6 py-4 text-left font-medium">Created By</th>
                                <th className="px-6 py-4 text-left font-medium">Created At</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                                                {admin.name?.[0]?.toUpperCase() || admin.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{admin.name || 'No Name'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <Mail size={12} /> {admin.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.isSuperAdmin ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                                                <Crown size={12} /> Super Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <Shield size={12} /> Admin
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {admin.isSuperAdmin ? (
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <ShieldCheck size={12} /> All Permissions
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                {admin.permissions.length} permission{admin.permissions.length !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">
                                        {admin.createdBy ? (
                                            <div>
                                                <p className="font-medium">{admin.createdBy.name}</p>
                                                <p className="text-gray-500">{admin.createdBy.email}</p>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">System</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} />
                                            {new Date(admin.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/admins/${admin.id}/edit`}
                                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {admins.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Crown size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No admin users found</p>
                </div>
            )}
        </div>
    );
}
