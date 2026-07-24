'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, BASE_URL } from '@/lib/api';
import { Loader2, Plus, Trash2, Copy, Send, Smartphone, Upload, Download, FileDown, Edit2, Save, X, Check, Eye, EyeOff, ArrowUpDown, Filter, XCircle, Camera } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { toKhmerDate, toKhmerNumber } from '@/lib/khmer-utils';

interface GuestManagerProps {
    eventId: string;
    eventSlug?: string | null;
    guests: any[];
    event?: any; // Added event prop to access details for sharing message
}

export function GuestManager({ eventId, eventSlug, guests, event }: GuestManagerProps) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [copying, setCopying] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [showFilter, setShowFilter] = useState(false);

    // Edit State
    const [editingGuest, setEditingGuest] = useState<any | null>(null);
    const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
    const [editUploading, setEditUploading] = useState(false);

    const [guestList, setGuestList] = useState<any[]>(guests);

    // Calculate absolute guest numbers based on oldest to newest creation order
    // Since the API returns guests in descending order (ORDER BY id DESC or newest first),
    // we can use the original `guests` prop to determine the absolute index reliably.
    const guestNumbers = useMemo(() => {
        const map = new Map<string, number>();
        const totalGuests = guests.length;

        // The last item in `guests` (oldest) gets 1, the first gets totalGuests
        guests.forEach((guest, index) => {
            map.set(guest.id, totalGuests - index);
        });

        // Note: We also need to add manually added guests locally
        // newly added guests (which prepend to guestList) will get IDs higher than totalGuests
        let newCount = totalGuests;
        guestList.forEach(guest => {
            if (!map.has(guest.id)) {
                newCount++;
                map.set(guest.id, newCount);
            }
        });

        return map;
    }, [guestList, guests]);

    const filteredGuestList = guestList.filter(guest => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery = !query ||
            (guest.name?.toLowerCase() || '').includes(query) ||
            (guest.phoneNumber?.toLowerCase() || '').includes(query);

        const matchesFilter = filterStatus === 'ALL' || guest.status === filterStatus;

        return matchesQuery && matchesFilter;
    }).sort((a, b) => {
        const numA = guestNumbers.get(a.id) || 0;
        const numB = guestNumbers.get(b.id) || 0;
        if (sortOrder === 'newest') {
            return numB - numA;
        } else {
            return numA - numB;
        }
    });

    // Sync guestList when props change (e.g. after refresh)
    useEffect(() => {
    }, [guests]);

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            let finalPhotoUrl = photoUrl;
            if (photoFile) {
                const formData = new FormData();
                formData.append('file', photoFile);
                formData.append('type', 'image');
                const uploadRes = await apiFetch('upload.php', {
                    method: 'POST',
                    body: formData,
                });
                if (uploadRes.success && uploadRes.url) {
                    finalPhotoUrl = uploadRes.url;
                }
            }

            const result = await apiFetch('guests.php', {
                method: 'POST',
                body: JSON.stringify({
                    eventId,
                    name,
                    phoneNumber,
                    photoUrl: finalPhotoUrl
                })
            });

            if (result.success) {
                setName('');
                setPhoneNumber('');
                setPhotoFile(null);
                setPhotoUrl('');
                // Add to local state — prepend so newest appears first
                setGuestList(prev => [result.guest, ...prev]);
                router.refresh();
            } else {
                toast.error(t('client.dashboard.error') + ': ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('client.dashboard.error'));
        }
        setLoading(false);
    };

    const handleDeleteGuest = async (guestId: string) => {
        if (!confirm(t('client.dashboard.guestManager.deleteConfirm'))) return;

        try {
            await apiFetch(`guests.php?id=${guestId}`, { method: 'DELETE' });
            setGuestList(prev => prev.filter(g => g.id !== guestId));
            router.refresh();
        } catch (e) {
            toast.error('Failed to delete guest');
        }
    };

    const copyLink = (token: string, shortCode?: string) => {
        let link;
        // Prioritize Short Code
        if (shortCode) {
            // If we have an event slug, we COULD use it, but user specifically asked for /shortCode
            // The logic we just added to client-page.tsx handles /invite/[shortCode] directly.
            // So we can just use that.
            link = `${window.location.origin}/invite/${shortCode}`;
        } else {
            link = `${window.location.origin}/invite/${token}`;
        }
        navigator.clipboard.writeText(link);
        setCopying(token); // keep using token as ID for state
        setTimeout(() => setCopying(null), 2000);
    };

    const generateShareMessage = (guest: any, link: string, includeLink: boolean = true) => {
        if (!event) return includeLink ? `Here is your invitation: ${link}` : 'Here is your invitation!';

        const eventType = event.eventType === 'wedding' ? 'ពិធីមង្គលការ' :
            event.eventType === 'birthday' ? 'ពិធីខួបកំណើត' :
                event.eventType === 'knot_tying' ? 'ពិធីកាត់ចំណងដៃ' :
                    event.eventType === 'housewarming' ? 'ពិធីឡើងគេហដ្ឋានថ្មី' :
                        event.eventType === 'movie_premiere' ? 'សម្ភោធខ្សែភាពយន្ត' : 'កម្មវិធី';

        // Format Date & Time
        const dateObj = new Date(event.startDate || event.date);
        const dateStr = toKhmerDate(dateObj); // e.g. ថ្ងៃអាទិត្យ ទី២៧ ខែកុម្ភះ ឆ្នាំ២០២៦

        // Custom Time Formatting to match request: វេលាម៉ោង 5:00 ល្ងាច
        // toKhmerTime outputs: ម៉ោង ០៥ : ០០នាទីល្ងាច
        // We want slightly different format? The user asked for "វេលាម៉ោង 5:00 ល្ងាច"
        // But my plan said "I will use the existing toKhmerTime utility which outputs Khmer numerals"
        // So I will use `toKhmerTime` but maybe tweak the prefix if needed.
        // `toKhmerTime` returns "ម៉ោង HH : MMនាទីPeriod"
        // Request: "វេលាម៉ោង HH:MM Period"
        // Let's use `toKhmerTime` but replace "ម៉ោង" with "វេលាម៉ោង" if strict, or just use `toKhmerTime`.
        // Actually, `toKhmerTime` output is quite standard. Let's use it directly or slightly modified.
        // Let's construct it manually to match "វេលាម៉ោង HH:MM Period" with Khmer numerals.

        const hour = dateObj.getHours();
        const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const minute = dateObj.getMinutes();
        const period = hour >= 5 && hour < 12 ? 'ព្រឹក' :
            hour >= 12 && hour < 17 ? 'រសៀល' :
                hour >= 17 && hour < 20 ? 'ល្ងាច' : 'យប់';

        const timeStr = `វេលាម៉ោង ${toKhmerNumber(hour12)}:${toKhmerNumber(minute).padStart(2, '០')} ${period}`;

        const location = event.venueDetails || event.location || 'Location TBD';
        const phones = event.contactPhone || '012 345 678'; // Fallback

        const linkSection = includeLink
            ? `សូមចុចលើ Link ដើម្បីមើលធៀបអញ្ជើញ 💌 \nសូមអរគុណ! 🙏\n\n${link}`
            : `សូមចុចលើ Link ដើម្បីមើលធៀបអញ្ជើញ 💌 \nសូមអរគុណ! 🙏`;

        return `💕 ជំរាបសួរ ${guest.name}🙏\n\nយើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញលោកអ្នកចូលរួមជាភ្ញៀវកិត្តិយសក្នុង${eventType} របស់យើងខ្ញុំ៖\n\n🗓️ ${dateStr}\n⏰ ${timeStr}\n📍 នៅ ${location}\n📞 ទំនាក់ទំនង: ${phones}\n\n${linkSection}`;
    };

    const sendToTelegram = (guest: any) => {
        if (!guest.phoneNumber) {
            toast.info('No phone number for this guest.');
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
        if (guest.shortCode) {
            inviteLink = `${window.location.origin}/invite/${guest.shortCode}`;
        } else {
            inviteLink = `${window.location.origin}/invite/${guest.token}`;
        }

        const message = encodeURIComponent(generateShareMessage(guest, inviteLink));
        const tgLink = `https://t.me/${phone}?text=${message}`;
        window.open(tgLink, '_blank');
    };

    const handleShareGeneral = async (guest: any) => {
        let inviteLink;
        if (guest.shortCode) {
            inviteLink = `${window.location.origin}/invite/${guest.shortCode}`;
        } else {
            inviteLink = `${window.location.origin}/invite/${guest.token}`;
        }

        // Pre-warm: ping the invite URL so OG data is cached before Facebook/Messenger fetches it
        try { fetch(inviteLink, { mode: 'no-cors' }).catch(() => { }); } catch (e) { }
        if (navigator.share) {
            // Greeting as text (no link), link as url — Messenger needs url field for clickable links
            const greetingOnly = generateShareMessage(guest, inviteLink, false);
            try {
                await navigator.share({
                    text: greetingOnly,
                    url: inviteLink,
                });
            } catch (error) {
                // Share cancelled or failed — no action needed
            }
        } else {
            // Fallback: copy full message with link to clipboard
            const fullMessage = generateShareMessage(guest, inviteLink, true);
            navigator.clipboard.writeText(fullMessage);
            toast.success('Sharing isn\'t supported on this browser, so the message was copied to your clipboard instead!');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventId', eventId);

        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${BASE_URL}/guests_import.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                const errorMsg = data.errors && data.errors.length > 0 ? '\n\nErrors:\n' + data.errors.join('\n') : '';
                toast.error(`${data.message}${errorMsg}`);
                router.refresh();
            } else {
                toast.error(data.error || t('client.dashboard.error'));
            }
        } catch (error) {
            toast.error(t('client.dashboard.error'));
        } finally {
            setImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const token = localStorage.getItem('auth_token');
            const res = await fetch(`${BASE_URL}/guests_export.php?eventId=${eventId}&token=${token}`);
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
                toast.error(t('client.dashboard.error'));
            }
        } catch (error) {
            toast.error(t('client.dashboard.error'));
        } finally {
            setExporting(false);
        }
    };

    const downloadTemplate = () => {
        window.open(`${BASE_URL}/guests_template.php`, '_blank');
    };

    const startEditing = (guest: any) => {
        setEditingGuest({ ...guest });
        setEditPhotoFile(null);
    };

    const cancelEditing = () => {
        setEditingGuest(null);
        setEditPhotoFile(null);
    };

    const saveGuest = async () => {
        if (!editingGuest || !editingGuest.name.trim()) return;

        setEditUploading(true);
        try {
            let finalPhotoUrl = editingGuest.photoUrl || editingGuest.avatarUrl || editingGuest.photo || editingGuest.avatar || null;

            if (editPhotoFile) {
                const formData = new FormData();
                formData.append('file', editPhotoFile);
                formData.append('type', 'image');
                const uploadRes = await apiFetch('upload.php', {
                    method: 'POST',
                    body: formData,
                });
                if (uploadRes.success && uploadRes.url) {
                    finalPhotoUrl = uploadRes.url;
                }
            }

            const updatedData = {
                id: editingGuest.id,
                name: editingGuest.name,
                phoneNumber: editingGuest.phoneNumber,
                photoUrl: finalPhotoUrl
            };

            const result = await apiFetch('guests.php', {
                method: 'PUT',
                body: JSON.stringify(updatedData)
            });

            if (result.success) {
                const fullUpdatedGuest = { ...editingGuest, photoUrl: finalPhotoUrl };
                setGuestList(prev => prev.map(g => g.id === editingGuest.id ? fullUpdatedGuest : g));
                setEditingGuest(null);
                setEditPhotoFile(null);
                router.refresh();
            } else {
                toast.error(t('client.dashboard.error'));
            }
        } catch (e) {
            toast.error(t('client.dashboard.error'));
        } finally {
            setEditUploading(false);
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Add Guest Form */}
            <form onSubmit={handleAddGuest} className="bg-gray-100/50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm md:text-base">{t('client.dashboard.guestManager.addGuest')}</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('client.dashboard.guestManager.placeholderName')}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder={t('client.dashboard.guestManager.placeholderPhone')}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] cursor-pointer hover:border-yellow-500 transition-colors">
                                    <Camera size={16} className="text-gray-400" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {photoFile ? photoFile.name : (photoUrl ? 'Photo uploaded' : 'Upload Guest Photo')}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setPhotoFile(file);
                                                setPhotoUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </label>
                                {(photoFile || photoUrl) && (
                                    <button
                                        type="button"
                                        onClick={() => { setPhotoFile(null); setPhotoUrl(''); }}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !name}
                            className="w-full md:w-auto bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                            {t('client.dashboard.guestManager.add')}
                        </button>
                    </div>
                </div>
            </form>

            {/* Guest List */}
            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800 space-y-4 sticky top-0 bg-white dark:bg-[#111] z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">{t('client.dashboard.guestManager.title')} ({filteredGuestList.length}{searchQuery && ` of ${guestList.length}`})</h3>
                        <div className="flex gap-2 self-end md:self-auto">
                            <button
                                onClick={downloadTemplate}
                                className="p-2 md:px-3 md:py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
                                title="Download Template"
                            >
                                <FileDown size={16} />
                                <span className="hidden md:inline">{t('client.dashboard.guestManager.template')}</span>
                            </button>
                            <label className="p-2 md:px-3 md:py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                                <Upload size={16} />
                                <span className="hidden md:inline">{importing ? t('client.dashboard.guestManager.importing') : t('client.dashboard.guestManager.import')}</span>
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
                                disabled={exporting || guestList.length === 0}
                                className="p-2 md:px-3 md:py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Export Guests"
                            >
                                <Download size={16} />
                                <span className="hidden md:inline">{exporting ? t('client.dashboard.guestManager.exporting') : t('client.dashboard.guestManager.export')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('client.dashboard.guestManager.search')}
                            className="w-full bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-xl py-2 md:py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>

                {/* Filter & Sort Controls */}
                <div className="px-4 md:px-6 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {/* Sort Button */}
                    <button
                        onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors whitespace-nowrap"
                    >
                        <ArrowUpDown size={14} />
                        {sortOrder === 'newest' ? t('client.dashboard.guestManager.sortNewest') || 'Newest' : t('client.dashboard.guestManager.sortOldest') || 'Oldest'}
                    </button>

                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    {/* Filter Options */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilterStatus('ALL')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${filterStatus === 'ALL' ? 'bg-gray-800 text-white dark:bg-white dark:text-black' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('ACCEPTED')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${filterStatus === 'ACCEPTED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Accepted
                        </button>
                        <button
                            onClick={() => setFilterStatus('PENDING')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${filterStatus === 'PENDING' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Pending
                        </button>
                        <button
                            onClick={() => setFilterStatus('DECLINED')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${filterStatus === 'DECLINED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Declined
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Header (Hidden on Mobile) */}
            <div className="hidden md:grid md:grid-cols-[0.5fr_1fr_2.5fr_2fr_1.5fr_1fr_4.5fr] gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#222] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="">#</div>
                <div className="text-center">រូបភាព</div>
                <div className="">{t('client.dashboard.guestManager.name')}</div>
                <div className="">{t('client.dashboard.guestManager.phone')}</div>
                <div className="text-center">{t('client.dashboard.guestManager.status')}</div>
                <div className="text-center">{t('client.dashboard.guestManager.visit')}</div>
                <div className="text-right">{t('client.dashboard.guestManager.actions')}</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-900 md:bg-white md:dark:bg-[#111]">
                {filteredGuestList.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 text-sm">
                        {searchQuery ? t('client.dashboard.guestManager.noResults') : t('client.dashboard.guestManager.noGuests')}
                    </div>
                ) : (
                    filteredGuestList.map((guest, index) => {
                        const absoluteIndex = guestNumbers.get(guest.id) || (index + 1);
                        const photo = guest.photoUrl || guest.avatarUrl || guest.photo || guest.avatar;
                        return (
                            <div key={guest.id} className="flex flex-col md:grid md:grid-cols-[0.5fr_1fr_2.5fr_2fr_1.5fr_1fr_4.5fr] gap-2 md:gap-4 p-3 md:p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group items-center">

                                {/* Desktop Number */}
                                <div className="hidden md:flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {absoluteIndex}
                                </div>

                                {/* Guest Photo Column */}
                                <div className="flex items-center justify-center">
                                    {editingGuest?.id === guest.id ? (
                                        <label className="relative cursor-pointer group/upload block" title="Click to change photo">
                                            <img
                                                src={editPhotoFile ? URL.createObjectURL(editPhotoFile) : (photo || 'https://via.placeholder.com/150')}
                                                alt={guest.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500 shadow-sm opacity-80 group-hover/upload:opacity-50 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/40 rounded-full opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                                <Camera size={14} />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setEditPhotoFile(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    ) : photo ? (
                                        <img
                                            src={photo}
                                            alt={guest.name}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-yellow-500/50 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                                            No pic
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Row 1: Name and Link Copy */}
                                <div className="flex justify-between items-center md:block w-full">
                                    <div className="font-bold text-gray-900 dark:text-white text-sm md:text-sm truncate flex-1 md:flex-none">
                                        <span className="md:hidden text-gray-400 mr-2 font-normal">{absoluteIndex}.</span>
                                        {editingGuest?.id === guest.id ? (
                                            <input
                                                value={editingGuest.name}
                                                onChange={e => setEditingGuest({ ...editingGuest, name: e.target.value })}
                                                className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-[#333] border-yellow-500 outline-none dark:text-white"
                                                autoFocus
                                            />
                                        ) : (
                                            guest.name
                                        )}
                                    </div>
                                    <div className="md:hidden flex items-center gap-2">
                                        {guest.status === 'ACCEPTED' && <span className="w-2 h-2 rounded-full bg-green-500" title="Joining" />}
                                        {guest.status === 'DECLINED' && <span className="w-2 h-2 rounded-full bg-red-500" title="Sorry" />}
                                        <button
                                            onClick={() => copyLink(guest.token, guest.shortCode)}
                                            className="p-1.5 text-gray-400 hover:text-yellow-600 transition-colors"
                                        >
                                            {copying === guest.token ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Phone & Status Row on Mobile */}
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between md:justify-start gap-3 w-full md:w-auto mt-1 md:mt-0">
                                    <span className="flex items-center gap-1 overflow-hidden">
                                        <Smartphone size={12} className="opacity-50 flex-shrink-0" />
                                        {editingGuest?.id === guest.id ? (
                                            <input
                                                value={editingGuest.phoneNumber || ''}
                                                onChange={e => setEditingGuest({ ...editingGuest, phoneNumber: e.target.value })}
                                                className="px-1 border rounded bg-white dark:bg-[#333] dark:border-[#444] dark:text-white max-w-[120px]"
                                            />
                                        ) : (
                                            <span className="truncate">{guest.phoneNumber || 'No phone'}</span>
                                        )}
                                    </span>
                                    {/* Mobile Only - Visited Icon / Status */}
                                    <div className="md:hidden flex items-center gap-2">
                                        {guest.isVisited ? (
                                            <span className="flex items-center gap-1 text-blue-500 font-bold uppercase tracking-tighter text-[9px]">
                                                <Eye size={12} /> Opened
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400 text-[9px]">
                                                <EyeOff size={12} /> Unopened
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Desktop: Status */}
                                <div className="hidden md:block text-center">
                                    {guest.status === 'ACCEPTED' && <span className="px-2 py-1 text-[10px] bg-green-100 text-green-700 rounded-full font-bold">{t('client.dashboard.guestManager.attending')}</span>}
                                    {guest.status === 'DECLINED' && <span className="px-2 py-1 text-[10px] bg-red-100 text-red-700 rounded-full font-bold">{t('client.dashboard.guestManager.declined')}</span>}
                                    {guest.status === 'PENDING' && <span className="px-2 py-1 text-[10px] bg-gray-100 text-gray-500 rounded-full">{t('client.dashboard.guestManager.pending')}</span>}
                                </div>
                                <div className="hidden md:block text-center">
                                    {guest.isVisited ? (
                                        <div className="flex flex-col items-center text-blue-500 text-xs">
                                            <Eye size={16} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300 text-xs">
                                            <EyeOff size={16} />
                                        </div>
                                    )}
                                </div>

                                {/* Actions: Shares & Management */}
                                <div className="flex justify-between md:justify-end gap-2 mt-3 md:mt-0 items-center w-full md:w-auto border-t border-dashed border-gray-100 dark:border-gray-800 pt-3 md:border-0 md:pt-0">
                                    {editingGuest?.id === guest.id ? (
                                        <div className="flex gap-2 ml-auto">
                                            <button onClick={saveGuest} disabled={editUploading} className="p-2 text-green-600 hover:bg-green-50 rounded-lg bg-green-50 dark:bg-green-900/20 disabled:opacity-50">
                                                {editUploading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                            </button>
                                            <button onClick={cancelEditing} disabled={editUploading} className="p-2 text-red-600 hover:bg-red-50 rounded-lg bg-red-50 dark:bg-red-900/20 disabled:opacity-50"><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex gap-2 flex-1 md:flex-none">
                                                {/* Telegram */}
                                                <button
                                                    onClick={() => sendToTelegram(guest)}
                                                    className="flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-xl bg-[#229ED9]/10 text-[#229ED9] dark:bg-[#229ED9]/20 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-[#229ED9]/20"
                                                    title="Telegram"
                                                >
                                                    <Send size={14} /> {t('client.dashboard.guestManager.telegram')}
                                                </button>

                                                {/* Messenger / Native */}
                                                <button
                                                    onClick={() => handleShareGeneral(guest)}
                                                    className="flex-1 md:flex-none px-3 py-2 md:py-1.5 rounded-xl bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-yellow-500/20"
                                                    title="Share"
                                                >
                                                    <Send size={14} className="-rotate-45" /> {t('client.dashboard.guestManager.share')}
                                                </button>
                                            </div>

                                            {/* Management Icons */}
                                            <div className="flex gap-1 items-center md:border-l border-gray-100 dark:border-gray-800 md:pl-2">
                                                <button
                                                    onClick={() => copyLink(guest.token, guest.shortCode)}
                                                    className="p-2 text-gray-400 hover:text-yellow-600 transition-colors hidden md:block"
                                                    title={t('client.dashboard.guestManager.copyLink') || "Copy Link"}
                                                >
                                                    {copying === guest.token ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                                </button>
                                                <button onClick={() => startEditing(guest)} className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteGuest(guest.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
