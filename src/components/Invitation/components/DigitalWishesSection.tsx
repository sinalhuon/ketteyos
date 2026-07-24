'use client';

import { useEffect, useMemo, useState } from 'react';
import { Heart, Loader2, Send, Star } from 'lucide-react';
import { BASE_URL } from '@/lib/api';

type Wish = {
    id: string;
    name: string;
    message: string;
    rating?: number | null;
    createdAt: string;
};

interface Props {
    eventId?: string;
    enabled?: boolean;
    guestName?: string;
    guestCode?: string;
    language?: 'kh' | 'en';
    colorScheme: {
        primary: string;
        accent?: string;
        background?: string;
        text?: string;
        textSecondary?: string;
        border?: string;
        gradient?: string;
        secondary?: string;
    };
    className?: string;
    cardClassName?: string;
    headingClassName?: string;
    bodyClassName?: string;
    backgroundOverride?: string;
    fieldBackgroundOverride?: string;
    variant?: 'wishes' | 'reviews';
}

export default function DigitalWishesSection({
    eventId,
    enabled,
    guestName,
    guestCode,
    language = 'en',
    colorScheme,
    className = '',
    cardClassName = '',
    headingClassName = '',
    bodyClassName = '',
    backgroundOverride,
    fieldBackgroundOverride,
    variant = 'wishes',
}: Props) {
    const isReviewMode = variant === 'reviews';
    const [resolvedGuestName, setResolvedGuestName] = useState(guestName || '');
    const [resolvedEventId, setResolvedEventId] = useState(eventId || '');
    const hasResolvedGuestIdentity = Boolean(resolvedGuestName.trim() || guestCode?.trim());
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [viewerWishId, setViewerWishId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(guestName || '');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');

    const text = useMemo(() => ({
        title: isReviewMode
            ? (language === 'kh' ? 'មតិយោបល់ និងការវាយតម្លៃ' : 'Reviews & Feedback')
            : (language === 'kh' ? 'សារជូនពរ' : 'Digital Wishes'),
        subtitle: isReviewMode
            ? (language === 'kh' ? 'ទុកមតិយោបល់ និងវាយតម្លៃពី ០ ដល់ ៥ ផ្កាយសម្រាប់កម្មវិធីនេះ។' : 'Leave a comment and rate the experience from 0 to 5 stars.')
            : (language === 'kh' ? 'ទុកសារជូនពរ និងពាក្យអបអរសាទររបស់អ្នកសម្រាប់ម្ចាស់កម្មវិធី។' : 'Leave a blessing, message, or celebration note for the host.'),
        name: language === 'kh' ? 'ឈ្មោះរបស់អ្នក' : 'Your Name',
        postingAs: isReviewMode
            ? (language === 'kh' ? 'អ្នកកំពុងផ្ញើមតិជា' : 'Reviewing as')
            : (language === 'kh' ? 'អ្នកកំពុងផ្ញើជូនពរជា' : 'Posting as'),
        message: isReviewMode
            ? (language === 'kh' ? 'មតិយោបល់របស់អ្នក' : 'Your Comment')
            : (language === 'kh' ? 'សារជូនពរ' : 'Your Wish'),
        placeholderName: language === 'kh' ? 'សូមបញ្ចូលឈ្មោះ' : 'Enter your name',
        placeholderMessage: isReviewMode
            ? (language === 'kh' ? 'សរសេរមតិយោបល់ ឬអារម្មណ៍របស់អ្នក...' : 'Write your comment or feedback...')
            : (language === 'kh' ? 'សរសេរសារជូនពររបស់អ្នក...' : 'Write your message or blessing...'),
        send: isReviewMode
            ? (language === 'kh' ? 'ផ្ញើមតិយោបល់' : 'Send Feedback')
            : (language === 'kh' ? 'ផ្ញើសារជូនពរ' : 'Send Wish'),
        update: isReviewMode
            ? (language === 'kh' ? 'កែប្រែមតិយោបល់' : 'Update Feedback')
            : (language === 'kh' ? 'កែប្រែសារជូនពរ' : 'Update Wish'),
        editNote: isReviewMode
            ? (language === 'kh' ? 'អ្នកបានផ្ញើមតិយោបល់រួចហើយ។ អ្នកអាចកែប្រែវាបាន។' : 'You already left feedback. You can edit it here.')
            : (language === 'kh' ? 'អ្នកបានផ្ញើសារជូនពររួចហើយ។ អ្នកអាចកែប្រែសារនេះបាន។' : 'You already left a wish. You can edit it here.'),
        empty: isReviewMode
            ? (language === 'kh' ? 'មិនទាន់មានមតិយោបល់នៅឡើយទេ។' : 'No feedback yet. Be the first to leave one.')
            : (language === 'kh' ? 'មិនទាន់មានសារជូនពរនៅឡើយទេ។' : 'No wishes yet. Be the first to leave one.'),
        rating: language === 'kh' ? 'ការវាយតម្លៃ' : 'Rating',
        zeroStars: language === 'kh' ? '០ ផ្កាយ' : '0 stars',
    }), [isReviewMode, language]);

    const reviewRatings = useMemo(
        () => wishes
            .map((wish) => typeof wish.rating === 'number' ? wish.rating : null)
            .filter((value): value is number => value !== null),
        [wishes]
    );
    const averageRating = reviewRatings.length
        ? reviewRatings.reduce((sum, value) => sum + value, 0) / reviewRatings.length
        : null;

    useEffect(() => {
        if (guestName) {
            setResolvedGuestName(guestName);
            setName(guestName);
        }
    }, [guestName]);

    useEffect(() => {
        if (eventId) {
            setResolvedEventId(eventId);
        }
    }, [eventId]);

    useEffect(() => {
        if (!guestCode?.trim()) return;
        if (guestName?.trim() && resolvedEventId) return;

        const loadGuestContext = async () => {
            try {
                const res = await fetch(`${BASE_URL}/guests.php?code=${encodeURIComponent(guestCode)}`);
                const data = await res.json();
                const fetchedName = data?.success ? (data?.guest?.name || '') : '';
                const fetchedEventId = data?.success ? String(data?.guest?.eventId || '') : '';
                if (fetchedName) {
                    setResolvedGuestName(fetchedName);
                    setName(fetchedName);
                }
                if (fetchedEventId) {
                    setResolvedEventId(fetchedEventId);
                }
            } catch (err) {
                console.error('Failed to resolve guest name for wishes', err);
            }
        };

        loadGuestContext();
    }, [guestCode, guestName, resolvedEventId]);

    useEffect(() => {
        if (!enabled || !resolvedEventId) return;
        const loadWishes = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({ eventId: resolvedEventId });
                if (guestCode) params.set('guestCode', guestCode);
                else if (resolvedGuestName.trim()) params.set('guestName', resolvedGuestName.trim());

                const res = await fetch(`${BASE_URL}/wishes.php?${params.toString()}`);
                const data = await res.json();
                if (data?.success) {
                    setWishes(Array.isArray(data.wishes) ? data.wishes : []);
                    if (data.viewerWish) {
                        setViewerWishId(data.viewerWish.id || null);
                        setMessage(data.viewerWish.message || '');
                        if (isReviewMode && typeof data.viewerWish.rating === 'number') {
                            setRating(Math.max(0, Math.min(5, data.viewerWish.rating)));
                        }
                    } else {
                        setViewerWishId(null);
                    }
                }
            } catch (err) {
                console.error('Failed to load wishes', err);
            } finally {
                setLoading(false);
            }
        };
        loadWishes();
    }, [enabled, isReviewMode, resolvedEventId, guestCode, resolvedGuestName]);

    if (!enabled || !resolvedEventId) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitName = hasResolvedGuestIdentity ? (resolvedGuestName || name) : name;
        if ((!hasResolvedGuestIdentity && !name.trim()) || !message.trim()) {
            setError(language === 'kh' ? 'សូមបំពេញសារ និងឈ្មោះប្រសិនបើចាំបាច់។' : 'Please fill in your message and name if needed.');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            const res = await fetch(`${BASE_URL}/wishes.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: resolvedEventId,
                    guestCode,
                    name: submitName.trim(),
                    message: message.trim(),
                    ...(isReviewMode ? { rating } : {}),
                }),
            });
            const data = await res.json();
            if (data?.success && data.wish) {
                setViewerWishId(data.wish.id || null);
                setWishes((prev) => {
                    const withoutCurrent = prev.filter((wish) => wish.id !== data.wish.id);
                    return [data.wish, ...withoutCurrent];
                });
                setMessage('');
                setMessage(data.wish.message || '');
                if (isReviewMode && typeof data.wish.rating === 'number') {
                    setRating(Math.max(0, Math.min(5, data.wish.rating)));
                }
                return;
            }
            setError(data?.error || (language === 'kh' ? 'មិនអាចផ្ញើសារបានទេ។' : 'Unable to send your wish.'));
        } catch (err) {
            console.error('Failed to submit wish', err);
            setError(language === 'kh' ? 'មានបញ្ហាក្នុងការផ្ញើសារ។' : 'There was a problem sending your wish.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className={className}>
            <div
                className={`mx-auto rounded-[30px] border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)] ${cardClassName}`}
                style={{
                    borderColor: colorScheme.border || `${colorScheme.primary}55`,
                    background: backgroundOverride || (colorScheme.background
                        ? `linear-gradient(180deg, ${colorScheme.background}f2, ${colorScheme.background}d6)`
                        : 'linear-gradient(180deg, rgba(10,12,24,0.92), rgba(10,12,24,0.82))'),
                }}
            >
                <div className="text-center">
                    <Heart size={26} className="mx-auto" style={{ color: colorScheme.primary }} />
                    <h3 className={`mt-3 text-2xl font-bold ${headingClassName}`} style={{ color: colorScheme.primary }}>
                        {text.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-6 ${bodyClassName}`} style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                        {text.subtitle}
                    </p>
                    {isReviewMode && averageRating !== null && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2" style={{ borderColor: colorScheme.border || `${colorScheme.primary}44`, background: fieldBackgroundOverride || 'rgba(255,255,255,0.04)' }}>
                            <span className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={14} fill={star <= Math.round(averageRating) ? colorScheme.primary : 'transparent'} style={{ color: colorScheme.primary }} />
                                ))}
                            </span>
                            <span className={`text-xs font-semibold ${bodyClassName}`} style={{ color: colorScheme.text || '#fff' }}>
                                {averageRating.toFixed(1)}/5
                            </span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {viewerWishId && (
                        <div className={`rounded-2xl border px-4 py-3 text-sm ${bodyClassName}`} style={{ borderColor: colorScheme.border || `${colorScheme.primary}44`, background: fieldBackgroundOverride || 'rgba(255,255,255,0.03)', color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                            {text.editNote}
                        </div>
                    )}
                    {hasResolvedGuestIdentity ? (
                        <div
                            className={`w-full rounded-2xl border px-4 py-3 ${bodyClassName}`}
                            style={{
                                borderColor: colorScheme.border || `${colorScheme.primary}44`,
                                background: fieldBackgroundOverride || 'rgba(255,255,255,0.04)',
                                color: colorScheme.text || '#fff',
                            }}
                        >
                            <p className="text-[11px]" style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                                {text.postingAs}
                            </p>
                            <p className="mt-1 text-sm font-semibold" style={{ color: colorScheme.primary }}>
                                {resolvedGuestName || (language === 'kh' ? 'ភ្ញៀវដែលបានអញ្ជើញ' : 'Invited Guest')}
                            </p>
                        </div>
                    ) : (
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={text.placeholderName}
                            className={`w-full rounded-2xl border px-4 py-3 outline-none ${bodyClassName}`}
                            style={{
                                borderColor: colorScheme.border || `${colorScheme.primary}44`,
                                background: fieldBackgroundOverride || 'rgba(255,255,255,0.04)',
                                color: colorScheme.text || '#fff',
                            }}
                            />
                    )}
                    {isReviewMode && (
                        <div
                            className={`rounded-2xl border px-4 py-3 ${bodyClassName}`}
                            style={{
                                borderColor: colorScheme.border || `${colorScheme.primary}44`,
                                background: fieldBackgroundOverride || 'rgba(255,255,255,0.04)',
                                color: colorScheme.text || '#fff',
                            }}
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                                    {text.rating}
                                </span>
                                <span className="text-xs font-semibold" style={{ color: colorScheme.primary }}>
                                    {rating}/5
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRating(0)}
                                    className="rounded-full border px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-85"
                                    style={{
                                        borderColor: rating === 0 ? colorScheme.primary : colorScheme.border || `${colorScheme.primary}44`,
                                        color: rating === 0 ? colorScheme.primary : colorScheme.textSecondary || colorScheme.text || '#d6d6d6',
                                        background: rating === 0 ? `${colorScheme.primary}1f` : 'transparent',
                                    }}
                                >
                                    {text.zeroStars}
                                </button>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="rounded-full p-1.5 transition hover:scale-105"
                                        aria-label={`${star} stars`}
                                    >
                                        <Star
                                            size={24}
                                            fill={star <= rating ? colorScheme.primary : 'transparent'}
                                            style={{ color: colorScheme.primary }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={text.placeholderMessage}
                        rows={4}
                        className={`w-full rounded-2xl border px-4 py-3 outline-none ${bodyClassName}`}
                        style={{
                            borderColor: colorScheme.border || `${colorScheme.primary}44`,
                            background: fieldBackgroundOverride || 'rgba(255,255,255,0.04)',
                            color: colorScheme.text || '#fff',
                        }}
                    />
                    {error && (
                        <p className={`text-sm ${bodyClassName}`} style={{ color: '#fca5a5' }}>
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ background: colorScheme.gradient || colorScheme.primary, color: colorScheme.background || '#101010' }}
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        <span>{viewerWishId ? text.update : text.send}</span>
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 size={20} className="animate-spin" style={{ color: colorScheme.primary }} />
                        </div>
                    ) : wishes.length === 0 ? (
                        <p className={`text-center text-sm ${bodyClassName}`} style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                            {text.empty}
                        </p>
                    ) : (
                        wishes.map((wish) => (
                            <div
                                key={wish.id}
                                className="rounded-2xl border px-4 py-4"
                                style={{
                                    borderColor: colorScheme.border || `${colorScheme.primary}33`,
                                    background: fieldBackgroundOverride || 'rgba(255,255,255,0.03)',
                                }}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className={`text-sm font-semibold ${headingClassName}`} style={{ color: colorScheme.primary }}>
                                            {wish.name}
                                        </p>
                                        {isReviewMode && typeof wish.rating === 'number' && (
                                            <div className="mt-1 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star key={star} size={12} fill={star <= (wish.rating || 0) ? colorScheme.primary : 'transparent'} style={{ color: colorScheme.primary }} />
                                                ))}
                                                <span className={`ml-1 text-[11px] ${bodyClassName}`} style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                                                    {wish.rating}/5
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <span className={`text-[11px] ${bodyClassName}`} style={{ color: colorScheme.textSecondary || colorScheme.text || '#d6d6d6' }}>
                                        {new Intl.DateTimeFormat(language === 'kh' ? 'km-KH' : 'en-US', { day: 'numeric', month: 'short' }).format(new Date(wish.createdAt))}
                                    </span>
                                </div>
                                <p className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${bodyClassName}`} style={{ color: colorScheme.text || '#fff' }}>
                                    {wish.message}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
