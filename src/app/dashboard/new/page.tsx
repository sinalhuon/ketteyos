'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { getAllEventTypes } from '@/lib/event-types';

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        eventType: 'wedding',
        schedule: ''
    });

    const [scheduleItems, setScheduleItems] = useState<any[]>([]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/events', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            router.push('/dashboard');
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.details || data.error || 'Failed to create event. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 mt-10">

                <div className="mb-8">
                    <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-4">
                        <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
                    <p className="text-gray-500 mt-2">Enter the details for your special occasion.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Amelia & Lucas Wedding"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Event Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
                            <select
                                value={formData.eventType}
                                onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            >
                                {getAllEventTypes().map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:[color-scheme:dark]"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Grand Hotel, NYC"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Schedule</label>
                                <button
                                    type="button"
                                    onClick={addDay}
                                    className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded hover:bg-yellow-500/20 transition-all font-bold"
                                >
                                    + Add Day
                                </button>
                            </div>

                            <div className="space-y-4">
                                {scheduleItems.map((day, dayIndex) => (
                                    <div key={dayIndex} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                                        <div className="flex flex-col flex-1 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1">Pick Date</span>
                                            <input
                                                type="date"
                                                value={day.date || ''}
                                                onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs font-bold text-gray-700 dark:text-white focus:ring-1 focus:ring-yellow-500 outline-none"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Activities</span>
                                            <button
                                                type="button"
                                                onClick={() => removeDay(dayIndex)}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {day.activities.map((activity: any, actIndex: number) => (
                                                <div key={actIndex} className="flex gap-2 items-start">
                                                    <div className="grid grid-cols-4 gap-2 flex-1">
                                                        <input
                                                            type="time"
                                                            value={activity.time}
                                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'time', e.target.value)}
                                                            className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-[10px] dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                                        />
                                                        <input
                                                            value={activity.activity}
                                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'activity', e.target.value)}
                                                            placeholder="Activity"
                                                            className="col-span-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-[10px] dark:text-white outline-none focus:ring-1 focus:ring-yellow-500"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeActivityFromDay(dayIndex, actIndex)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addActivityToDay(dayIndex)}
                                                className="w-full py-1.5 mt-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold text-gray-500 hover:text-yellow-600 transition-all uppercase tracking-wider"
                                            >
                                                + Add Activity
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {scheduleItems.length === 0 && (
                                    <p className="text-xs text-center text-gray-500 py-4 italic">No schedule days added yet.</p>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center bg-yellow-600 text-white px-6 py-2 rounded-md hover:bg-yellow-700 transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                            Create Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
