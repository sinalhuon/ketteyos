'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Trash2, Search, Mail, Calendar, Edit, UserPlus, X, Save, CheckCircle, Phone, MessageCircle, Tag, Power } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';

export default function ClientManagement() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [clients, setClients] = useState<any[]>([]);
    const [plans, setPlans] = useState<{ id: string; name: string; nameEn?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phoneNumber: '', telegram: '', planId: '', status: 'ACTIVE' });

    useEffect(() => {
        fetchClients();
        fetchPlans();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await apiFetch('admin.php?action=clients');
            if (data.success) {
                setClients(data.clients);
            }
        } catch (e) {
            console.error('Failed to fetch clients', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const data = await apiFetch('admin.php?action=pricing');
            if (data?.success && Array.isArray(data.plans)) {
                setPlans(data.plans.filter((p: any) => p.isActive !== false));
            }
        } catch (e) {
            console.error('Failed to fetch plans', e);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm(t('admin.clientsPage.approveConfirm'))) return;
        try {
            const res = await apiFetch('admin.php?action=approve_user', {
                method: 'POST',
                body: JSON.stringify({ id })
            });
            if (res.success) {
                setClients(clients.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
            } else {
                toast.error(res.error || t('common.error'));
            }
        } catch (e) {
            toast.error(t('common.error'));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('admin.clientsPage.deleteConfirm'))) return;
        try {
            const res = await apiFetch(`admin.php?action=user&id=${id}`, { method: 'DELETE' });
            if (res.success) {
                setClients(clients.filter(c => c.id !== id));
                if (editingClient && editingClient.id === id) {
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
        setEditingClient(null);
        setFormData({ name: '', email: '', password: '', phoneNumber: '', telegram: '', planId: '', status: 'ACTIVE' });
        setShowForm(false);
    };

    const handleAddClick = () => {
        setEditingClient(null);
        setFormData({ name: '', email: '', password: '', phoneNumber: '', telegram: '', planId: '', status: 'ACTIVE' });
        setShowForm(true);
    };

    const handleEditClick = (client: any) => {
        setEditingClient(client);
        setFormData({ name: client.name || '', email: client.email || '', phoneNumber: client.phoneNumber || '', telegram: client.telegram || '', password: '', planId: client.planId || '', status: client.status || 'ACTIVE' });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body: Record<string, unknown> = {
                ...formData,
                role: 'CLIENT',
                id: editingClient ? editingClient.id : undefined
            };
            if (editingClient) {
                body.planId = formData.planId || null;
            } else {
                body.planId = formData.planId || null;
            }

            const res = await apiFetch('admin.php?action=client', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (res.success) {
                fetchClients();
                closeForm();
                
                // Trigger user data refresh for the edited client across all tabs
                if (editingClient) {
                    // If user was suspended, send force logout event
                    if (formData.status === 'SUSPENDED') {
                        window.dispatchEvent(new CustomEvent('userSuspended', { 
                            detail: { userId: editingClient.id } 
                        }));
                    } else {
                        window.dispatchEvent(new CustomEvent('userDataUpdated'));
                    }
                }
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.clientsPage.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('admin.clientsPage.subtitle')}</p>
                </div>
                {!showForm && (
                    <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#ffea75] transition shadow-sm hover:shadow-md">
                        <UserPlus size={18} /> {t('admin.clientsPage.addClient')}
                    </button>
                )}
            </header>

            <div className="space-y-8">
                {/* Client List Section */}
                {!showForm && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-sm dark:shadow-none">
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-[#161616] text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.name')}</th>
                                            <th className="px-6 py-4 text-left font-medium">Contact</th>
                                            <th className="px-6 py-4 text-left font-medium">Plan</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.joinedDate')}</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.table.status')}</th>
                                            <th className="px-6 py-4 text-left font-medium">{t('admin.events')}</th>
                                            <th className="px-6 py-4 text-right font-medium">{t('admin.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">{t('common.loading')}</td>
                                            </tr>
                                        ) : clients.map((client) => (
                                            <tr key={client.id} className={`hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group ${editingClient?.id === client.id ? 'bg-yellow-50 dark:bg-[#1a1a1a]' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 flex items-center justify-center font-bold">
                                                            {client.name?.[0] || 'U'}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">{client.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="shrink-0" /> <span className="truncate">{client.email}</span>
                                                    </div>
                                                    {client.phoneNumber && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone size={14} className="shrink-0" /> <span className="truncate">{client.phoneNumber}</span>
                                                        </div>
                                                    )}
                                                    {client.telegram && (
                                                        <div className="flex items-center gap-2">
                                                            <MessageCircle size={14} className="shrink-0" /> <span className="truncate">{client.telegram}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {client.planId ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20">
                                                            <Tag size={12} />
                                                            {plans.find(p => p.id === client.planId)?.nameEn || plans.find(p => p.id === client.planId)?.name || 'Plan'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        {new Date(client.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                                                        client.status === 'ACTIVE' 
                                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                                                            : client.status === 'INACTIVE' 
                                                            ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
                                                            : client.status === 'SUSPENDED'
                                                            ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                            : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                                                    }`}>
                                                        {client.status === 'ACTIVE' ? 'Active' :
                                                         client.status === 'INACTIVE' ? 'Inactive' :
                                                         client.status === 'SUSPENDED' ? 'Suspended' :
                                                         client.status === 'APPROVED' ? 'Active' : // Handle existing APPROVED users
                                                         t('admin.clientsPage.pending')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#222] dark:text-gray-300 dark:border-[#333]">
                                                        {client.eventCount} {t('admin.events')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                    {(!client.status || client.status === 'PENDING') && (
                                                        <button
                                                            onClick={() => handleApprove(client.id)}
                                                            className="text-green-500 hover:text-green-600 dark:hover:text-green-400 transition p-2 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"
                                                            title={t('admin.clientsPage.approveConfirm')}
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditClick(client)}
                                                        className={`transition p-2 rounded-lg ${editingClient?.id === client.id ? 'text-[#FFD700] bg-yellow-50 dark:bg-[#333]' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333]'}`}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(client.id)}
                                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!loading && clients.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">{t('admin.eventsPage.noEvents')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Layout */}
                            <div className="md:hidden divide-y divide-gray-100 dark:divide-[#222]">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>
                                ) : clients.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">{t('admin.eventsPage.noEvents')}</div>
                                ) : (
                                    clients.map((client) => (
                                        <div key={client.id} className={`p-4 space-y-3 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${editingClient?.id === client.id ? 'bg-yellow-50 dark:bg-[#1a1a1a]' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 flex items-center justify-center font-bold shrink-0">
                                                        {client.name?.[0] || 'U'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{client.name || 'Unknown'}</h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Mail size={12} /> {client.email}</p>
                                                        {client.phoneNumber && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone size={12} /> {client.phoneNumber}</p>}
                                                        {client.telegram && <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MessageCircle size={12} /> {client.telegram}</p>}
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium border ${
                                                    client.status === 'ACTIVE' 
                                                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' 
                                                        : client.status === 'INACTIVE' 
                                                        ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20'
                                                        : client.status === 'SUSPENDED'
                                                        ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                                        : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
                                                }`}>
                                                    {client.status === 'ACTIVE' ? 'Active' :
                                                     client.status === 'INACTIVE' ? 'Inactive' :
                                                     client.status === 'SUSPENDED' ? 'Suspended' :
                                                     client.status === 'APPROVED' ? 'Active' : // Handle existing APPROVED users
                                                     t('admin.clientsPage.pending')}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-50 dark:border-white/5 mx-[-1rem] px-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{new Date(client.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {client.planId && (
                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400">
                                                            <Tag size={10} /> {plans.find(p => p.id === client.planId)?.nameEn || plans.find(p => p.id === client.planId)?.name || 'Plan'}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-[#222] dark:text-gray-300 dark:border-[#333]">
                                                        {client.eventCount} {t('admin.events')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 text-xs">
                                                {(!client.status || client.status === 'PENDING') && (
                                                    <button
                                                        onClick={() => handleApprove(client.id)}
                                                        className="flex items-center gap-1 font-medium text-green-500 hover:text-green-600 dark:hover:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle size={14} /> {t('admin.clientsPage.approveConfirm')}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEditClick(client)}
                                                    className="flex items-center gap-1 font-medium text-gray-500 hover:text-[#FFD700] dark:hover:text-yellow-400 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Edit size={14} /> {t('common.edit')}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="flex items-center gap-1 font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-500 bg-gray-50 dark:bg-[#222] px-3 py-1.5 rounded-lg transition-colors"
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
                                    {editingClient ? <Edit size={24} className="text-[#FFD700]" /> : <UserPlus size={24} className="text-[#FFD700]" />}
                                    {editingClient ? t('admin.clientsPage.editClient') : t('admin.clientsPage.addClient')}
                                </h3>
                                <button onClick={closeForm} className="px-4 py-2 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] text-gray-700 dark:text-white rounded-lg flex items-center gap-2 transition text-sm font-medium">
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
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('admin.table.email')}</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={!!editingClient}
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black ${editingClient ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        placeholder="client@example.com"
                                    />
                                    {editingClient && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">* Email cannot be changed</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Telegram (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.telegram}
                                        onChange={e => setFormData({ ...formData, telegram: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                        placeholder="@username"
                                    />
                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('common.password')} {editingClient && '(Leave empty to keep current)'}</label>
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors focus:bg-white dark:focus:bg-black"
                                                        placeholder={editingClient ? '••••••' : 'Secret password'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subscription Plan</label>
                                                    <select
                                                        value={formData.planId}
                                                        onChange={e => setFormData({ ...formData, planId: e.target.value })}
                                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors"
                                                    >
                                                        <option value="">No plan</option>
                                                        {plans.map(p => (
                                                            <option key={p.id} value={p.id}>{p.nameEn || p.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                                        <Power size={14} />
                                                        Account Status
                                                    </label>
                                                    <select
                                                        value={formData.status}
                                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-colors"
                                                    >
                                                        <option value="ACTIVE">Active</option>
                                                        <option value="INACTIVE">Inactive</option>
                                                        <option value="SUSPENDED">Suspended</option>
                                                    </select>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                        {formData.status === 'INACTIVE' && 'User cannot login but account is preserved.'}
                                                        {formData.status === 'SUSPENDED' && 'User cannot login due to violation.'}
                                                        {formData.status === 'ACTIVE' && 'User can login and use all features.'}
                                                    </p>
                                                </div>

                                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:bg-[#ffea75] transition flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        t('common.loading')
                                    ) : (
                                        <>
                                            {editingClient ? <Save size={18} /> : <UserPlus size={18} />}
                                            {editingClient ? t('admin.clientsPage.editClient') : t('admin.clientsPage.addClient')}
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
