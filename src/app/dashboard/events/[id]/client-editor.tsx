'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateEvent } from '@/actions/event-actions';
import { uploadFile } from '@/actions/storage';
import { addAlbumPhoto, deleteAlbumPhoto } from '@/actions/album-actions';
import { getAllEventTypes } from '@/lib/event-types';
import { Loader2, Music, Image as ImageIcon, Save, Calendar, MapPin, Type, Upload, X, Users, MessageSquare, Clock, Map, LayoutTemplate } from 'lucide-react';
import Image from 'next/image';

import { GuestManager } from './guest-manager';

interface EditorProps {
    event: any;
    templates: any[];
    globalMusic: any[];
    guests: any[];
}

export function EventEditor({ event, templates, globalMusic, guests }: EditorProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'details' | 'design' | 'guests'>('details');
    const [saving, setSaving] = useState(false);
    const [uploadingAlbum, setUploadingAlbum] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: event.title,
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        eventType: event.eventType || 'wedding',
        logoUrl: event.logoUrl || '',
        logoSize: event.logoSize || 150,
        musicUrl: event.musicUrl || '',
        templateId: event.templateId || templates[0]?.id || '',

        // Parents
        groomFatherName: event.groomFatherName || '',
        groomMotherName: event.groomMotherName || '',
        brideFatherName: event.brideFatherName || '',
        brideMotherName: event.brideMotherName || '',

        // Couple
        groomFirstName: event.groomFirstName || '',
        groomLastName: event.groomLastName || '',
        brideFirstName: event.brideFirstName || '',
        brideLastName: event.brideLastName || '',

        // Details
        invitationMessage: event.invitationMessage || '',
        eventTime: event.eventTime || '',
        venueDetails: event.venueDetails || '',
        mapUrl: event.mapUrl || '',
        schedule: event.schedule || '',
    });

    // Parse schedule JSON
    const [scheduleItems, setScheduleItems] = useState<any[]>(() => {
        try {
            if (!event.schedule) return [];
            const parsed = JSON.parse(event.schedule);
            // If it's the old flat format, we'll keep it for now but the UI will transition
            // Actually, for better UX, let's auto-convert flat to nested if detected
            if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].activities) {
                const grouped = parsed.reduce((acc: any, item: any) => {
                    const date = item.date || '';
                    if (!acc[date]) acc[date] = { date, activities: [] };
                    acc[date].activities.push({ time: item.time, activity: item.activity });
                    return acc;
                }, {});
                return Object.values(grouped);
            }
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    // Sync scheduleItems to formData.schedule
    const updateScheduleJSON = (items: any[]) => {
        setScheduleItems(items);
        setFormData(prev => ({
            ...prev,
            schedule: JSON.stringify(items)
        }));
    };

    const addDay = () => {
        const defaultDate = formData.date ? formData.date.split('T')[0] : '';
        updateScheduleJSON([...scheduleItems, { date: defaultDate, activities: [{ time: '', activity: '' }] }]);
    };

    const removeDay = (index: number) => {
        const newItems = scheduleItems.filter((_, i) => i !== index);
        updateScheduleJSON(newItems);
    };

    const handleDayChange = (index: number, value: string) => {
        const newItems = [...scheduleItems];
        newItems[index] = { ...newItems[index], date: value };
        updateScheduleJSON(newItems);
    };

    const addActivityToDay = (dayIndex: number) => {
        const newItems = [...scheduleItems];
        newItems[dayIndex].activities = [...newItems[dayIndex].activities, { time: '', activity: '' }];
        updateScheduleJSON(newItems);
    };

    const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
        const newItems = [...scheduleItems];
        newItems[dayIndex].activities = newItems[dayIndex].activities.filter((_: any, i: number) => i !== activityIndex);
        updateScheduleJSON(newItems);
    };

    const handleActivityChange = (dayIndex: number, activityIndex: number, field: string, value: string) => {
        const newItems = [...scheduleItems];
        newItems[dayIndex].activities[activityIndex] = { ...newItems[dayIndex].activities[activityIndex], [field]: value };
        updateScheduleJSON(newItems);
    };

    // Handle Input Change
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle File Upload
    const handleUpload = async (e: any, type: 'music' | 'logo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', type === 'music' ? 'music' : 'covers');

        const result = await uploadFile(formDataUpload);
        if (result.success) {
            setFormData(prev => ({
                ...prev,
                [type === 'music' ? 'musicUrl' : 'logoUrl']: result.url
            }));
            alert('File uploaded successfully!');
        } else {
            alert('Upload failed');
        }
        setSaving(false);
    };

    // Handle Album Photo Upload
    const handleAlbumUpload = async (e: any) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingAlbum(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'album');

            const uploadResult = await uploadFile(formDataUpload);
            if (uploadResult.success) {
                await addAlbumPhoto(event.id, uploadResult.url, event.albumPhotos?.length || 0);
            }
        }

        setUploadingAlbum(false);
        router.refresh();
    };

    // Delete Album Photo
    const handleDeleteAlbumPhoto = async (photoId: string) => {
        if (!confirm('Delete this photo?')) return;

        setSaving(true);
        await deleteAlbumPhoto(photoId);
        setSaving(false);
        router.refresh();
    };

    // Save Changes
    const handleSave = async () => {
        setSaving(true);
        const result = await updateEvent(event.id, formData);
        if (result.success) {
            alert('Changes saved successfully!');
            router.refresh();
        } else {
            alert(`Failed to save changes: ${result.error}`);
        }
        setSaving(false);
    };

    return (
        <div className="bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-gray-200 dark:border-[#222] overflow-hidden min-h-[600px] flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-[#222]">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'details' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Event Details
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'design' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Design & Customization
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'guests' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    Guests
                </button>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 overflow-y-auto">
                {activeTab === 'details' && (
                    <div className="space-y-8 max-w-3xl">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Type size={16} /> Event Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Event Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Type size={16} /> Event Type
                                </label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                >
                                    {getAllEventTypes().map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <Calendar size={16} /> Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                </div>


                                {/* 
                                    Removed Event Time (Khmer) input as per request.
                                    The field remains in formData state but is no longer exposed to the user.
                                */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Location
                                </label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Parents Names */}
                        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users size={20} /> Parents' Names
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Groom's Parents</h4>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Father's Name</label>
                                        <input
                                            name="groomFatherName"
                                            value={formData.groomFatherName}
                                            onChange={handleChange}
                                            placeholder="លោក តាំង សារ៉ាវុធ"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Mother's Name</label>
                                        <input
                                            name="groomMotherName"
                                            value={formData.groomMotherName}
                                            onChange={handleChange}
                                            placeholder="លោកស្រី លី គីមហេង"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Bride's Parents</h4>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Father's Name</label>
                                        <input
                                            name="brideFatherName"
                                            value={formData.brideFatherName}
                                            onChange={handleChange}
                                            placeholder="លោក ណាល់ សុខហ៊ាង"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Mother's Name</label>
                                        <input
                                            name="brideMotherName"
                                            value={formData.brideMotherName}
                                            onChange={handleChange}
                                            placeholder="លោកស្រី កែវ ស្រីម៉ុច"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Couple Names */}
                        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Couple Names (Khmer)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Groom</h4>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">First Name</label>
                                        <input
                                            name="groomFirstName"
                                            value={formData.groomFirstName}
                                            onChange={handleChange}
                                            placeholder="ស៊ីមន្ដថា"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Last Name</label>
                                        <input
                                            name="groomLastName"
                                            value={formData.groomLastName}
                                            onChange={handleChange}
                                            placeholder="តាំង"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">Bride</h4>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">First Name</label>
                                        <input
                                            name="brideFirstName"
                                            value={formData.brideFirstName}
                                            onChange={handleChange}
                                            placeholder="សុវណ្ណឌី"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Last Name</label>
                                        <input
                                            name="brideLastName"
                                            value={formData.brideLastName}
                                            onChange={handleChange}
                                            placeholder="ណាល់"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invitation Message */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={20} /> Invitation Message
                            </h3>
                            <textarea
                                name="invitationMessage"
                                value={formData.invitationMessage}
                                onChange={handleChange}
                                rows={8}
                                placeholder="សូមគោរពអញ្ជើញ&#10;សម្តេច ទ្រង់ ឯកឧត្តម អ្នកឧកញ៉ា..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Venue Details */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Map size={20} /> Venue Details
                            </h3>
                            <textarea
                                name="venueDetails"
                                value={formData.venueDetails}
                                onChange={handleChange}
                                rows={4}
                                placeholder="ភូមិផ្អាវ ឃុំផ្អាវ ស្រុកបាធាយ ខេត្តកំពង់ចាម..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                            />
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Map URL (Google Maps link)</label>
                                <input
                                    name="mapUrl"
                                    value={formData.mapUrl}
                                    onChange={handleChange}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock size={20} /> Event Schedule
                                </h3>
                                <button
                                    onClick={addDay}
                                    className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-lg hover:bg-yellow-500/20 transition-all font-bold"
                                >
                                    + Add Day
                                </button>
                            </div>

                            <div className="space-y-6">
                                {scheduleItems.map((day, dayIndex) => (
                                    <div key={dayIndex} className="bg-gray-50 dark:bg-black/20 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                                                    {dayIndex + 1}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Event Date</span>
                                                    <input
                                                        type="date"
                                                        value={day.date || ''}
                                                        onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none transition"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeDay(dayIndex)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {day.activities.map((activity: any, actIndex: number) => (
                                                <div key={actIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Time</label>
                                                        <input
                                                            type="time"
                                                            value={activity.time}
                                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'time', e.target.value)}
                                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3">
                                                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Activity Description</label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                value={activity.activity}
                                                                onChange={(e) => handleActivityChange(dayIndex, actIndex, 'activity', e.target.value)}
                                                                placeholder="ពិធីហែរជំនូន..."
                                                                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                            />
                                                            <button
                                                                onClick={() => removeActivityFromDay(dayIndex, actIndex)}
                                                                className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addActivityToDay(dayIndex)}
                                                className="w-full py-2 mt-2 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-[10px] font-bold text-gray-500 hover:border-yellow-500/50 hover:text-yellow-600 transition-all uppercase tracking-widest"
                                            >
                                                + Add Activity for this day
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {scheduleItems.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                                        <Clock className="mx-auto text-gray-300 mb-3" size={40} />
                                        <p className="text-gray-500 text-sm mb-4 font-medium">No schedule days added yet.</p>
                                        <button
                                            onClick={addDay}
                                            className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
                                        >
                                            Add First Day
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'design' && (
                    <div className="space-y-8 max-w-4xl">
                        {/* 1. Template Selection */}
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <LayoutTemplate size={18} /> Choose Template
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((template) => {
                                    const isSelected = formData.templateId === template.codeKey || formData.templateId === template.id;
                                    return (
                                        <div
                                            key={template.id}
                                            onClick={() => setFormData(prev => ({ ...prev, templateId: template.codeKey }))}
                                            className={`
                                                relative group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-300
                                                ${isSelected
                                                    ? 'border-yellow-500 shadow-lg scale-[1.02]'
                                                    : 'border-gray-200 dark:border-[#333] hover:border-yellow-300 dark:hover:border-yellow-900'}
                                            `}
                                        >
                                            {/* Preview Image */}
                                            <div className="aspect-video bg-gray-200 dark:bg-[#111] relative">
                                                {template.previewUrl ? (
                                                    <Image
                                                        src={template.previewUrl}
                                                        alt={template.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">
                                                        <LayoutTemplate size={32} />
                                                    </div>
                                                )}

                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center backdrop-blur-[2px]">
                                                        <div className="bg-white dark:bg-black text-yellow-600 dark:text-yellow-500 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                            Active
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className={`p-4 ${isSelected ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-white dark:bg-[#222]'}`}>
                                                <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-yellow-700 dark:text-yellow-500' : 'text-gray-900 dark:text-white'}`}>
                                                    {template.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 line-clamp-2">
                                                    {template.description || "No description"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Album Photos */}
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ImageIcon size={18} /> Album Photos
                            </h3>

                            {/* Photo Grid */}
                            {event.albumPhotos && event.albumPhotos.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {event.albumPhotos.map((photo: any) => (
                                        <div key={photo.id} className="relative group">
                                            <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-[#333]">
                                                <Image src={photo.imageUrl} alt="Album" fill className="object-cover" />
                                            </div>
                                            <button
                                                onClick={() => handleDeleteAlbumPhoto(photo.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333] transition">
                                {uploadingAlbum ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} className="mr-2 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Album Photos (Multiple)</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAlbumUpload}
                                    disabled={uploadingAlbum}
                                />
                            </label>
                        </div>

                        {/* Wedding Logo */}
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ImageIcon size={18} /> Wedding Logo
                            </h3>
                            {formData.logoUrl && (
                                <div className="space-y-4">
                                    <div className="relative rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-[#333] mx-auto flex items-center justify-center bg-gray-100 dark:bg-black/40">
                                        <div style={{ width: `${formData.logoSize}px`, height: `${formData.logoSize}px`, position: 'relative' }}>
                                            <Image src={formData.logoUrl} alt="Logo" fill className="object-contain" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Logo Size: {formData.logoSize}px
                                        </label>
                                        <input
                                            type="range"
                                            name="logoSize"
                                            min="50"
                                            max="500"
                                            value={formData.logoSize}
                                            onChange={handleChange}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-500"
                                        />
                                    </div>
                                </div>
                            )}
                            <label className="flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333] transition mt-4">
                                <Upload size={18} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Logo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} />
                            </label>
                        </div>

                        {/* Background Music */}
                        <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Music size={18} /> Background Music
                            </h3>
                            {formData.musicUrl && (
                                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-sm text-green-700 dark:text-green-300">✓ Music uploaded</p>
                                </div>
                            )}

                            {globalMusic.length > 0 && (
                                <>
                                    <select
                                        name="musicUrl"
                                        value={formData.musicUrl}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] px-4 py-3 mb-4 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select from library</option>
                                        {globalMusic.map((music) => (
                                            <option key={music.id} value={music.url}>{music.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-center text-sm text-gray-500 mb-4">- OR -</p>
                                </>
                            )}

                            <label className="flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333] transition">
                                <Upload size={18} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Your Own Music</span>
                                <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleUpload(e, 'music')} />
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'guests' && (
                    <GuestManager eventId={event.id} eventSlug={event.slug} guests={guests} />
                )}



            </div>

            {/* Save Button */}
            <div className="p-6 border-t border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#0a0a0a]">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
