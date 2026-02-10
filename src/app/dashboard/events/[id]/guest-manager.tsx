'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addGuest, deleteGuest } from '@/actions/guest-actions';
import { Loader2, Plus, Trash2, Copy, Send, Smartphone, Upload, Download, FileDown } from 'lucide-react';

interface GuestManagerProps {
    eventId: string;
    eventSlug?: string | null;
    guests: any[];
}

export function GuestManager({ eventId, eventSlug, guests }: GuestManagerProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [copying, setCopying] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        const result = await addGuest(eventId, name, phoneNumber);
        if (result.success) {
            setName('');
            setPhoneNumber('');
            router.refresh();
        } else {
            alert('Failed to add guest');
        }
        setLoading(false);
    };

    const handleDeleteGuest = async (guestId: string) => {
        if (!confirm('Are you sure you want to delete this guest?')) return;

        // Optimistic update could go here, but router.refresh is safer for now
        await deleteGuest(guestId, eventId);
        router.refresh();
    };

    const copyLink = (token: string, shortCode?: string) => {
        let link;
        if (eventSlug && shortCode) {
            link = `${window.location.origin}/invite/${eventSlug}/${shortCode}`;
        } else {
            link = `${window.location.origin}/invite/${token}`;
        }
        navigator.clipboard.writeText(link);
        setCopying(token); // keep using token as ID for state
        setTimeout(() => setCopying(null), 2000);
    };

    const sendToTelegram = (guest: any) => {
        if (!guest.phoneNumber) {
            alert('No phone number for this guest.');
            return;
        }

        let phone = guest.phoneNumber.replace(/\s+/g, '').replace(/-/g, '');
        if (!phone.startsWith('+')) {
            if (phone.startsWith('0')) {
                phone = '+855' + phone.substring(1);
            } else {
                phone = '+' + phone;
            }
        }

        let inviteLink;
        if (eventSlug && guest.shortCode) {
            inviteLink = `${window.location.origin}/invite/${eventSlug}/${guest.shortCode}`;
        } else {
            inviteLink = `${window.location.origin}/invite/${guest.token}`;
        }
        const message = encodeURIComponent(`សួស្ដី ${guest.name}!\nសូមគោរពអញ្ជើញចូលរួមកម្មវិធីអាពាហ៍ពិពាហ៍របស់យើង។\nចុចទីនេះដើម្បីបើកធៀបការអញ្ជើញ: ${inviteLink}`);
        const tgLink = `https://t.me/${phone}?text=${message}`;
        window.open(tgLink, '_blank');
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/events/${eventId}/guests/import`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                alert(`${data.message}${data.errors ? '\n\nErrors:\n' + data.errors.join('\n') : ''}`);
                router.refresh();
            } else {
                alert(data.error || 'Failed to import guests');
            }
        } catch (error) {
            alert('Failed to import guests');
        } finally {
            setImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`/api/events/${eventId}/guests/export`);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `guests-${eventSlug || eventId}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to export guests');
            }
        } catch (error) {
            alert('Failed to export guests');
        } finally {
            setExporting(false);
        }
    };

    const downloadTemplate = () => {
        window.open('/api/guests/template', '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Add Guest Form */}
            <form onSubmit={handleAddGuest} className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-[#222]">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Add Guest</h3>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Guest Name (e.g. Bong Tola)"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Telegram Phone (e.g. 012345678)"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                        Add
                    </button>
                </div>
            </form>

            {/* Guest List */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Guest List ({guests.length})</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={downloadTemplate}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <FileDown size={14} />
                            Template
                        </button>
                        <label className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                            <Upload size={14} />
                            {importing ? 'Importing...' : 'Import'}
                            <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleImport}
                                disabled={importing}
                                className="hidden"
                            />
                        </label>
                        <button
                            onClick={handleExport}
                            disabled={exporting || guests.length === 0}
                            className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download size={14} />
                            {exporting ? 'Exporting...' : 'Export'}
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#222] text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Phone</div>
                    <div className="col-span-5 text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {guests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No guests added yet.
                        </div>
                    ) : (
                        guests.map((guest) => (
                            <div key={guest.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                                <div className="col-span-4 font-medium text-gray-900 dark:text-white truncate">
                                    {guest.name}
                                </div>
                                <div className="col-span-3 text-gray-500 text-sm truncate">
                                    {guest.phoneNumber || '-'}
                                </div>
                                <div className="col-span-5 flex justify-end gap-2">
                                    <button
                                        onClick={() => copyLink(guest.token, guest.shortCode)}
                                        className="p-2 text-gray-400 hover:text-blue-500 bg-gray-100 dark:bg-[#222] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors relative group"
                                        title="Copy Link"
                                    >
                                        {copying === guest.token ? <span className="text-green-500 text-xs font-bold absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-black px-2 py-1 shadow-lg rounded">Copied!</span> : null}
                                        <Copy size={16} />
                                    </button>

                                    {guest.phoneNumber && (
                                        <button
                                            onClick={() => sendToTelegram(guest)}
                                            className="px-3 py-1.5 text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1.5"
                                        >
                                            <Send size={14} />
                                            Telegram
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteGuest(guest.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 bg-gray-100 dark:bg-[#222] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
