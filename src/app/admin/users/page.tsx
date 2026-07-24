'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Shield, Calendar, Edit, UserPlus, X, Trash2, Save } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';

export default function UserManagement() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form
    const [formData, setFormData] = useState({ name: '', email: '', password: '', isSuperAdmin: false });

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await apiFetch('admin.php?action=admins');
            if (data.success) {
                setAdmins(data.admins);
            }
        } catch (e) {
            console.error('Failed to fetch admins', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.usersPage.deleteConfirm'))) return;
        try {
            const res = await apiFetch(`admin.php?action=user&id=${id}`, { method: 'DELETE' });
            if (res.success) {
                setAdmins(admins.filter(a => a.id !== id));
                if (editingAdmin && editingAdmin.id === id) {
                    closeForm();
                }
            } else {
                toast.error(res.error || t('common.error'));
            }
        } catch (e) {
            toast.error(t('common.error'));
        }
    };

    const closeForm = () => {
        setEditingAdmin(null);
        setFormData({ name: '', email: '', password: '', isSuperAdmin: false });
        setShowForm(false);
    };

    const handleAddClick = () => {
        setEditingAdmin(null);
        setFormData({ name: '', email: '', password: '', isSuperAdmin: false });
        setShowForm(true);
    };

    const handleEditClick = (admin: any) => {
        setEditingAdmin(admin);
        setFormData({
            name: admin.name,
            email: admin.email,
            password: '',
            isSuperAdmin: !!admin.isSuperAdmin
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = {
                ...formData,
                role: 'ADMIN',
                isSuperAdmin: formData.isSuperAdmin ? 1 : 0,
                id: editingAdmin ? editingAdmin.id : undefined
            };

            if (formData.isSuperAdmin) body.role = 'SUPER_ADMIN';

            const res = await apiFetch('admin.php?action=user', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (res.success) {
                fetchAdmins();
                closeForm();
            } else {
                toast.error(res.error || t('common.error'));
            }
        } catch (e) {
            toast.error(t('common.error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.usersPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.usersPage.subtitle')}</p>
                </div>
                {!showForm && (
                    <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#ffea75] transition shadow-sm hover:shadow-md">
                        <UserPlus size={18} /> {t('admin.usersPage.addUser')}
                    </button>
                )}
            </header>

            <div className="space-y-8">
                {/* User List Section */}
                {!showForm && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-sm dark:shadow-none">
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-[#161616] text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.name')}</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.role')}</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.permissions')}</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.createdAt')}</th>
                                            <th className="px-6 py-4 text-right font-medium">{t('admin.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">{t('common.loading')}</td>
                                            </tr>
                                        ) : admins.map((admin) => (
                                            <tr key={admin.id} className={`hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group ${editingAdmin?.id === admin.id ? 'bg-yellow-50 dark:bg-[#1a1a1a]' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold shadow-sm">
                                                            {admin.name?.[0] || 'A'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white">{admin.name}</div>
                                                            <div className="text-xs text-gray-500">{admin.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${admin.isSuperAdmin
                                                        ? 'bg-[#FFD700] text-black shadow-sm'
                                                        : 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
                                                        }`}>
                                                        {admin.isSuperAdmin ? <Shield size={10} className="fill-current" /> : null}
                                                        {admin.isSuperAdmin ? t('admin.usersPage.superAdmin') : t('admin.usersPage.admin')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <Shield size={14} className="text-gray-400 dark:text-gray-600" />
                                                        {admin.isSuperAdmin ? t('admin.usersPage.allPermissions') : t('admin.usersPage.limitedAccess')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        {new Date(admin.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(admin)}
                                                        className={`transition p-2 rounded-lg ${editingAdmin?.id === admin.id ? 'text-[#FFD700] bg-yellow-50 dark:bg-transparent' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333]'}`}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin.id)}
                                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout */}
                            <div className="md:hidden divide-y divide-gray-100 dark:divide-[#222]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>
                                ) : admins.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">{t('admin.eventsPage.noEvents')}</div>
                                ) : (
                                    admins.map((admin) => (
                                        <div key={admin.id} className={`p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${editingAdmin?.id === admin.id ? 'bg-yellow-50 dark:bg-[#1a1a1a]' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold shadow-sm shrink-0">
                                                        {admin.name?.[0] || 'A'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{admin.name}</h3>
                                                        <p className="text-xs text-gray-500">{admin.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${admin.isSuperAdmin
                                                    ? 'bg-[#FFD700] text-black shadow-sm'
                                                    : 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30'
                                                    }`}>
                                                    {admin.isSuperAdmin ? <Shield size={10} className="fill-current" /> : null}
                                                    {admin.isSuperAdmin ? t('admin.usersPage.superAdmin') : t('admin.usersPage.admin')}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-50 dark:border-white/5 mx-[-1rem] px-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(admin)}
                                                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#FFD700] dark:hover:text-yellow-400 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Edit size={14} /> {t('common.edit')}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-500 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} /> {t('common.delete')}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Section */}
                {showForm && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] p-8 shadow-sm dark:shadow-none">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-[#222] pb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    {editingAdmin ? <Edit size={24} className="text-[#FFD700]" /> : <UserPlus size={24} className="text-[#FFD700]" />}
                                    {editingAdmin ? t('admin.usersPage.editUser') : t('admin.usersPage.addUser')}
                                </h3>
                                <button onClick={closeForm} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#222] dark:hover:bg-[#333] text-gray-700 dark:text-white rounded-lg flex items-center gap-2 transition text-sm font-medium">
                                    <X size={16} /> {t('common.cancel')}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.table.name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.table.email')}</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={!!editingAdmin}
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black ${editingAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        placeholder="admin@example.com"
                                    />
                                    {editingAdmin && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">* Email cannot be changed</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('common.password')} {editingAdmin && '(Leave empty to keep current)'}</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                        placeholder={editingAdmin ? '••••••' : 'Secret password'}
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#222]">
                                    <input
                                        type="checkbox"
                                        id="isSuperAdmin"
                                        checked={formData.isSuperAdmin}
                                        onChange={e => setFormData({ ...formData, isSuperAdmin: e.target.checked })}
                                        className="w-5 h-5 accent-[#FFD700] bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-gray-600 rounded focus:ring-[#FFD700] cursor-pointer"
                                    />
                                    <label htmlFor="isSuperAdmin" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">{t('admin.usersPage.grantSuperAdmin')}</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:bg-[#ffea75] transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    {saving ? (
                                        t('common.loading')
                                    ) : (
                                        <>
                                            {editingAdmin ? <Save size={18} /> : <UserPlus size={18} />}
                                            {editingAdmin ? t('admin.usersPage.editUser') : t('admin.usersPage.addUser')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
