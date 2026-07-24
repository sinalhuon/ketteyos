'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { EVENT_TYPES, getAllEventTypes, getEventDetailTitle, type EventType } from '@/lib/event-types';
import { Loader2, Music, Image as ImageIcon, Save, Calendar, MapPin, Type, Upload, X, Users, MessageSquare, Clock, Map, LayoutTemplate, Video, QrCode, Film } from 'lucide-react';
import Image from 'next/image';

import { GuestManager } from './guest-manager';
import { useToast } from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import type { TemplateConfig } from '@/components/Templates/types';
import { calculateAge, formatAgeLabel } from '@/lib/birthday-utils';

type StorySlide = {
    id: string;
    imageUrl: string;
    title?: string;
    caption?: string;
    order?: number;
};

type MovieCredit = {
    role: string;
    name: string;
    nameEn?: string;
};

const MOVIE_CREDIT_ROLE_OPTIONS = [
    'Producer',
    'Co-Producer',
    'Executive Producer',
    'Director',
    'Co-Director',
    'Owner / Studio',
    'Production Company',
    'Presenter',
    'Distributor',
    'Writer',
    'Screenwriter',
    'Story',
    'Main Character',
    'Lead Actor',
    'Lead Actress',
    'Supporting Cast',
    'Cinematographer',
    'Editor',
    'Music Composer',
    'Sound',
    'Art Director',
    'Costume Designer',
    'Makeup Artist',
    'VFX',
    'Colorist',
    'Production Manager',
    'Custom',
];

const DEFAULT_MOVIE_CREDITS: MovieCredit[] = [
    { role: 'Producer', name: '', nameEn: '' },
    { role: 'Co-Producer', name: '', nameEn: '' },
    { role: 'Executive Producer', name: '', nameEn: '' },
    { role: 'Director', name: '', nameEn: '' },
    { role: 'Co-Director', name: '', nameEn: '' },
    { role: 'Owner / Studio', name: '', nameEn: '' },
    { role: 'Writer', name: '', nameEn: '' },
    { role: 'Main Character', name: '', nameEn: '' },
];

interface EditorProps {
    event: any;
    templates: any[];
    globalMusic: any[];
    guests: any[];
    canUseMultipleLanguages: boolean;
    maxLanguages: number;
    featureLimits: {
        maxLanguages: number;
        smartRsvp: boolean;
        digitalWishes: boolean;
        customMusic: boolean;
        embedVideo: boolean;
        premiumAnimations: boolean;
        addToCalendar: boolean;
        customDesign: boolean;
        customDomain: boolean;
        qrCheckin: boolean;
        vipSupport: boolean;
    };
}

const invitationMessageDrafts: Record<string, { id: string; label: string; message: string }[]> = {
    wedding: [
        {
            id: 'wedding-classic',
            label: 'Wedding Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ\nដើម្បីប្រសិទ្ធពរជ័យ សិរីមង្គល និងអបអរសាទរនៅក្នុងឱកាសដ៏ពិសេសនេះ។`
        }
    ],
    birthday: [
        {
            id: 'birthday-classic',
            label: 'Birthday Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមអបអរសាទរពិធីខួបកំណើតរបស់យើងខ្ញុំ\nដើម្បីបង្កើតអនុស្សាវរីយ៍ល្អៗ និងរីករាយជាមួយគ្នានៅក្នុងឱកាសដ៏ពិសេសនេះ។`
        }
    ],
    knot_tying: [
        {
            id: 'knot-tying-classic',
            label: 'Knot Tying Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមជាកិត្តិយសក្នុងពិធីកាត់ចំណងដៃរបស់យើងខ្ញុំ\nដើម្បីប្រសិទ្ធពរជ័យ និងចូលរួមអបអរសាទរនៅក្នុងថ្ងៃដ៏មានន័យនេះ។`
        }
    ],
    housewarming: [
        {
            id: 'housewarming-classic',
            label: 'Housewarming Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមជាកិត្តិយសក្នុងពិធីឡើងគេហដ្ឋានថ្មីរបស់យើងខ្ញុំ\nដើម្បីប្រសិទ្ធពរជ័យ និងអបអរសាទរចំពោះការចាប់ផ្តើមថ្មីដ៏ប្រសើរនេះ។`
        }
    ],
    movie_premiere: [
        {
            id: 'movie-premiere-classic',
            label: 'Movie Premiere Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមជាកិត្តិយសក្នុងពិធីសម្ភោធខ្សែភាពយន្តរបស់យើងខ្ញុំ\nដើម្បីចូលរួមអបអរសាទរ និងទស្សនាខ្សែភាពយន្តថ្មីនេះជាមួយគ្នា។`
        }
    ],
    other: [
        {
            id: 'general-classic',
            label: 'General Draft',
            message: `សូមគោរពអញ្ជើញ\nឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា\nអញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយសក្នុងកម្មវិធីរបស់យើងខ្ញុំ\nដើម្បីចូលរួមអបអរសាទរ និងបង្កើតអនុស្សាវរីយ៍ល្អៗជាមួយគ្នា។`
        }
    ]
};

type EditorEventProfile = {
    key: EventType;
    isBirthday: boolean;
    isCouple: boolean;
    englishTitlePlaceholder: string;
    dateLabel: string;
    familySectionTitle: string;
    primaryFamilyTitle: string;
    secondaryFamilyTitle: string;
    peopleSectionTitle: string;
    primaryPersonTitle: string;
    secondaryPersonTitle: string;
    primaryFirstNameLabel: string;
    primaryLastNameLabel: string;
    primaryFirstNameEnLabel: string;
    primaryLastNameEnLabel: string;
    locationPlaceholder: string;
};

const eventEnglishTitlePlaceholders: Record<EventType, string> = {
    wedding: 'Wedding Celebration',
    birthday: 'Birthday Celebration',
    knot_tying: 'Knot Tying Ceremony',
    housewarming: 'Housewarming Ceremony',
    movie_premiere: 'Movie Premiere',
    other: 'Special Event',
};

const getEditorEventProfile = (eventTypeValue: string): EditorEventProfile => {
    const key = (EVENT_TYPES[eventTypeValue as EventType] ? eventTypeValue : 'other') as EventType;
    const isBirthday = key === 'birthday';
    const isCouple = key === 'wedding' || key === 'knot_tying';

    if (isBirthday) {
        return {
            key,
            isBirthday: true,
            isCouple: false,
            englishTitlePlaceholder: eventEnglishTitlePlaceholders.birthday,
            dateLabel: 'Event Date & Time',
            familySectionTitle: 'Parents / Family',
            primaryFamilyTitle: 'Parents / Family',
            secondaryFamilyTitle: '',
            peopleSectionTitle: 'Celebrant Name',
            primaryPersonTitle: 'Celebrant',
            secondaryPersonTitle: '',
            primaryFirstNameLabel: 'Celebrant First Name',
            primaryLastNameLabel: 'Celebrant Last Name',
            primaryFirstNameEnLabel: 'Celebrant First Name in English',
            primaryLastNameEnLabel: 'Celebrant Last Name in English',
            locationPlaceholder: 'Birthday venue',
        };
    }

    if (isCouple) {
        const isKnotTying = key === 'knot_tying';
        return {
            key,
            isBirthday: false,
            isCouple: true,
            englishTitlePlaceholder: eventEnglishTitlePlaceholders[key],
            dateLabel: isKnotTying ? 'Ceremony Date & Time' : 'Wedding Date & Time',
            familySectionTitle: 'Parents / Family',
            primaryFamilyTitle: 'Groom Parents',
            secondaryFamilyTitle: 'Bride Parents',
            peopleSectionTitle: isKnotTying ? 'Couple Names' : 'Couple Names',
            primaryPersonTitle: 'Groom',
            secondaryPersonTitle: 'Bride',
            primaryFirstNameLabel: 'First Name',
            primaryLastNameLabel: 'Last Name',
            primaryFirstNameEnLabel: 'First Name in English',
            primaryLastNameEnLabel: 'Last Name in English',
            locationPlaceholder: isKnotTying ? 'Ceremony venue' : 'Wedding venue',
        };
    }

    return {
        key,
        isBirthday: false,
        isCouple: false,
        englishTitlePlaceholder: eventEnglishTitlePlaceholders[key],
        dateLabel: key === 'housewarming' ? 'Housewarming Date & Time' : key === 'movie_premiere' ? 'Premiere Date & Time' : 'Event Date & Time',
        familySectionTitle: key === 'housewarming' ? 'Host / Family' : key === 'movie_premiere' ? 'Producer / Owner' : 'Host / Organizer',
        primaryFamilyTitle: key === 'housewarming' ? 'Host Family' : key === 'movie_premiere' ? 'Producer / Owner' : 'Organizer',
        secondaryFamilyTitle: '',
        peopleSectionTitle: key === 'housewarming' ? 'Host Name' : key === 'movie_premiere' ? 'Movie / Producer Name' : 'Main Person / Host',
        primaryPersonTitle: key === 'housewarming' ? 'Host' : key === 'movie_premiere' ? 'Producer / Owner' : 'Main Person',
        secondaryPersonTitle: '',
        primaryFirstNameLabel: key === 'housewarming' ? 'Host First Name' : key === 'movie_premiere' ? 'Producer / Movie Name' : 'First Name',
        primaryLastNameLabel: key === 'housewarming' ? 'Host Last Name' : key === 'movie_premiere' ? 'Owner / Studio Name' : 'Last Name',
        primaryFirstNameEnLabel: key === 'housewarming' ? 'Host First Name in English' : key === 'movie_premiere' ? 'Producer / Movie Name in English' : 'First Name in English',
        primaryLastNameEnLabel: key === 'housewarming' ? 'Host Last Name in English' : key === 'movie_premiere' ? 'Owner / Studio Name in English' : 'Last Name in English',
        locationPlaceholder: key === 'housewarming' ? 'New home address' : key === 'movie_premiere' ? 'Cinema or premiere venue' : 'Event location',
    };
};

const templateMatchesEventType = (template: any, eventTypeValue: string) => {
    const rawCategory = String(template.category || '').trim().toLowerCase();
    if (!rawCategory) return true;

    const normalizedCategory = rawCategory.replace(/\s+/g, '_');
    const universalCategories = ['universal', 'all', 'all_events', 'multi_event', 'multi-event', 'general'];

    if (universalCategories.includes(normalizedCategory)) return true;
    if (normalizedCategory === eventTypeValue) return true;
    if (eventTypeValue === 'birthday') return normalizedCategory === 'party';
    if (eventTypeValue === 'knot_tying') return normalizedCategory === 'wedding';

    return false;
};

export function EventEditor({ event, templates, globalMusic, guests, canUseMultipleLanguages, maxLanguages, featureLimits }: EditorProps) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'details' | 'design' | 'guests'>('details');
    const [saving, setSaving] = useState(false);
    const [uploadingAlbum, setUploadingAlbum] = useState(false);
    const [uploadingStory, setUploadingStory] = useState(false);

    const parseTemplateConfig = (value: any): Partial<TemplateConfig> | null => {
        if (!value) return null;
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        }
        return value;
    };

    const normalizeStorySlides = (slides: any): StorySlide[] => {
        if (!Array.isArray(slides)) return [];
        return slides
            .map((slide: any, index: number) => ({
                id: String(slide?.id || `story-slide-${index}`),
                imageUrl: typeof slide?.imageUrl === 'string' ? slide.imageUrl : '',
                title: typeof slide?.title === 'string' ? slide.title : '',
                caption: typeof slide?.caption === 'string' ? slide.caption : '',
                order: typeof slide?.order === 'number' ? slide.order : index,
            }))
            .filter((slide: StorySlide) => slide.imageUrl);
    };

    const eventHasSecondaryLanguageEnabled = event.enableSecondaryLanguage === true || event.enableSecondaryLanguage === 1 || event.enableSecondaryLanguage === '1';

    // Form State
    const [formData, setFormData] = useState({
        is_active: event.is_active !== 0 && event.is_active !== false,
        title: event.title,
        titleEn: event.titleEn || '',
        date: (() => {
            const raw = event.startDate || event.date;
            if (!raw) return '';
            // If it's a MySQL datetime string 'YYYY-MM-DD HH:mm:ss', convert to 'YYYY-MM-DDTHH:mm'
            // If it's already an ISO string, it works too.
            return raw.replace(' ', 'T').slice(0, 16);
        })(),
        birthDate: (() => {
            const raw = event.birthDate;
            if (!raw) return '';
            return raw.replace(' ', 'T').slice(0, 10);
        })(),
        location: event.location || '',
        locationEn: event.locationEn || '',
        eventType: event.eventType || 'wedding',
        logoUrl: event.logoUrl || '',
        secondLogoUrl: event.secondLogoUrl || '', // Added Second Logo
        logoSize: event.logoSize || 150,
        musicUrl: event.musicUrl || '',
        albumVideos: Array.isArray(event.albumVideos)
            ? event.albumVideos.join('\n')
            : (typeof event.albumVideos === 'string' ? (() => {
                try {
                    const parsed = JSON.parse(event.albumVideos);
                    return Array.isArray(parsed) ? parsed.join('\n') : event.albumVideos;
                } catch {
                    return event.albumVideos;
                }
            })() : ''),
        templateId: event.templateId || templates[0]?.id || '',

        // Parents
        groomFatherName: event.groomFatherName || '',
        groomMotherName: event.groomMotherName || '',
        brideFatherName: event.brideFatherName || '',
        brideMotherName: event.brideMotherName || '',
        groomFatherNameEn: event.groomFatherNameEn || '',
        groomMotherNameEn: event.groomMotherNameEn || '',
        brideFatherNameEn: event.brideFatherNameEn || '',
        brideMotherNameEn: event.brideMotherNameEn || '',

        // Couple
        groomFirstName: event.groomFirstName || '',
        groomLastName: event.groomLastName || '',
        brideFirstName: event.brideFirstName || '',
        brideLastName: event.brideLastName || '',
        groomFirstNameEn: event.groomFirstNameEn || '',
        groomLastNameEn: event.groomLastNameEn || '',
        brideFirstNameEn: event.brideFirstNameEn || '',
        brideLastNameEn: event.brideLastNameEn || '',

        // Celebrant Titles (for birthday events)
        celebrantTitle: event.celebrantTitle || '',
        celebrantKhmerTitle: event.celebrantKhmerTitle || '',

        // Details
        invitationMessage: event.invitationMessage || '',
        invitationMessageEn: event.invitationMessageEn || '',
        eventTime: event.eventTime || '',
        venueDetails: event.venueDetails || '',
        venueDetailsEn: event.venueDetailsEn || '',
        mapUrl: event.mapUrl || '',
        paymentQrImageUrl: event.paymentQrImageUrl || '',
        schedule: event.schedule || '',
        eventDays: event.eventDays || '',
        shareImageUrl: event.shareImageUrl || '',
        contactPhone: event.contactPhone || '',
        enableSecondaryLanguage: eventHasSecondaryLanguageEnabled,
        templateConfig: parseTemplateConfig(event.templateConfig) as Partial<TemplateConfig> | null,
    });

    // Parse schedule JSON
    const [scheduleItems, setScheduleItems] = useState<any[]>(() => {
        try {
            // Check eventDays first (new format), then schedule (old/fallback)
            const rawSchedule = event.eventDays || event.schedule;
            if (!rawSchedule) return [];

            const parsed = typeof rawSchedule === 'string' ? JSON.parse(rawSchedule) : rawSchedule;
            // If it's the old flat format, we'll keep it for now but the UI will transition
            // Actually, for better UX, let's auto-convert flat to nested if detected
            if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].activities) {
                const grouped = parsed.reduce((acc: any, item: any) => {
                    const date = item.date || '';
                    if (!acc[date]) acc[date] = { date, activities: [] };
                    acc[date].activities.push({ time: item.time, activity: item.activity, activityEn: item.activityEn || '' });
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
            schedule: JSON.stringify(items),
            eventDays: JSON.stringify(items) // Also update eventDays
        }));
    };

    const addDay = () => {
        const defaultDate = formData.date ? formData.date.split('T')[0] : '';
        updateScheduleJSON([...scheduleItems, { date: defaultDate, activities: [{ time: '', activity: '', activityEn: '' }] }]);
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
        newItems[dayIndex].activities = [...newItems[dayIndex].activities, { time: '', activity: '', activityEn: '' }];
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

    const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextEventType = e.target.value;
        const nextTitle = getEventDetailTitle(nextEventType as EventType);
        const savedDefaultTitles = Object.keys(EVENT_TYPES).map((key) => getEventDetailTitle(key as EventType));
        const nextMatchingTemplates = templates.filter((template) => templateMatchesEventType(template, nextEventType));

        setFormData((prev) => {
            const selectedStillMatches = templates
                .filter((template) => template.codeKey === prev.templateId || template.id === prev.templateId)
                .some((template) => templateMatchesEventType(template, nextEventType));
            const replacementTemplate = selectedStillMatches
                ? prev.templateId
                : (nextMatchingTemplates[0]?.codeKey || nextMatchingTemplates[0]?.id || prev.templateId);

            return {
                ...prev,
                eventType: nextEventType,
                title: !prev.title || savedDefaultTitles.includes(prev.title) ? nextTitle : prev.title,
                titleEn: !prev.titleEn || Object.values(eventEnglishTitlePlaceholders).includes(prev.titleEn)
                    ? eventEnglishTitlePlaceholders[(EVENT_TYPES[nextEventType as EventType] ? nextEventType : 'other') as EventType]
                    : prev.titleEn,
                templateId: replacementTemplate,
                templateConfig: selectedStillMatches ? prev.templateConfig : null,
            };
        });
    };

    // Handle File Upload
    const handleUpload = async (e: any, type: 'music' | 'logo' | 'secondLogo' | 'shareImage' | 'paymentQr') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'music') {
            const allowedMusicExtensions = ['mp3', 'wav'];
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

            if (!allowedMusicExtensions.includes(fileExtension)) {
                toast.error('Please upload an MP3 or WAV file.');
                e.target.value = '';
                return;
            }
        }

        setSaving(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('folder', type === 'music' ? 'music' : 'covers');

        try {
            const token = localStorage.getItem('auth_token');
            const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/upload.php`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });
            const result = await apiRes.json();

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    [type === 'music'
                        ? 'musicUrl'
                        : type === 'shareImage'
                            ? 'shareImageUrl'
                            : type === 'secondLogo'
                                ? 'secondLogoUrl'
                                : type === 'paymentQr'
                                    ? 'paymentQrImageUrl'
                                    : 'logoUrl']: result.url
                }));
                toast.success('File uploaded successfully!');
            } else {
                toast.error('Upload failed: ' + result.error);
            }
        } catch (e) {
            toast.error('Upload failed');
        }
        e.target.value = '';
        setSaving(false);
    };

    const [albumPhotos, setAlbumPhotos] = useState<any[]>(event.albumPhotos || []);
    const [storySlides, setStorySlides] = useState<StorySlide[]>(() =>
        normalizeStorySlides(parseTemplateConfig(event.templateConfig)?.storySlides)
    );

    // ... (rest of existing state)

    // Handle Album Photo Upload
    const handleAlbumUpload = async (e: any) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingAlbum(true);

        const newPhotos: any[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'album');

            try {
                const token = localStorage.getItem('auth_token');
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/upload.php`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataUpload
                });
                const uploadResult = await uploadRes.json();

                if (uploadResult.success) {
                    // 2. Add to Album DB
                    const photoRes = await apiFetch('album.php', {
                        method: 'POST',
                        body: JSON.stringify({
                            eventId: event.id,
                            url: uploadResult.url,
                            order: (albumPhotos.length + newPhotos.length)
                        })
                    });
                    if (photoRes.success && photoRes.photo) {
                        newPhotos.push({
                            id: photoRes.photo.id,
                            imageUrl: uploadResult.url,
                            order: photoRes.photo.order || 0
                        });
                    }
                }
            } catch (e) {
                console.error('Album upload error', e);
            }
        }

        if (newPhotos.length > 0) {
            setAlbumPhotos(prev => [...prev, ...newPhotos]);
        }

        setUploadingAlbum(false);
    };

    const [deletedAlbumPhotoIds, setDeletedAlbumPhotoIds] = useState<string[]>([]);
    const eventProfile = getEditorEventProfile(formData.eventType);
    const currentEventType = String(formData.eventType || '').toLowerCase();
    const isBirthdayEvent = eventProfile.isBirthday;
    const isCoupleEvent = eventProfile.isCouple;
    const isMovieEvent = currentEventType === 'movie_premiere' || currentEventType.includes('movie') || currentEventType.includes('film');
    const savedMovieCredits = Array.isArray(formData.templateConfig?.movieCredits)
        ? formData.templateConfig.movieCredits
            .map((credit: MovieCredit) => ({
                role: credit?.role ?? '',
                name: credit?.name ?? '',
                nameEn: credit?.nameEn ?? '',
            }))
        : [];
    const movieCredits: MovieCredit[] = isMovieEvent && savedMovieCredits.length === 0
        ? DEFAULT_MOVIE_CREDITS
        : savedMovieCredits;
    const celebrantAge = calculateAge(formData.birthDate, formData.date || new Date());
    const celebrantAgeLabel = formatAgeLabel(celebrantAge, formData.enableSecondaryLanguage ? 'en' : 'kh');
    const hasSavedSecondaryLanguageContent = Boolean(
        eventHasSecondaryLanguageEnabled ||
        event.titleEn ||
        event.locationEn ||
        event.groomFatherNameEn ||
        event.groomMotherNameEn ||
        event.brideFatherNameEn ||
        event.brideMotherNameEn ||
        event.groomFirstNameEn ||
        event.groomLastNameEn ||
        event.brideFirstNameEn ||
        event.brideLastNameEn ||
        event.invitationMessageEn ||
        event.venueDetailsEn
    );
    const messageDraftOptions = invitationMessageDrafts[formData.eventType] || invitationMessageDrafts.other;
    const matchingTemplates = templates.filter((template) => templateMatchesEventType(template, currentEventType));
    const visibleTemplates = matchingTemplates.length > 0 ? matchingTemplates : templates;
    const selectedTemplate = visibleTemplates.find((template) => template.codeKey === formData.templateId || template.id === formData.templateId);
    const selectedTemplateConfig = parseTemplateConfig(selectedTemplate?.templateConfig);
    const transitionContentVisible = formData.templateConfig?.showTransitionOverlay !== false;
    const featureCards = [
        { key: 'smartRsvp', label: 'Smart RSVP', enabled: featureLimits.smartRsvp, description: 'Guest response flow and RSVP experience.' },
        { key: 'digitalWishes', label: 'Digital Wishes', enabled: featureLimits.digitalWishes, description: 'Guest wishes and congratulation wall.' },
        { key: 'embedVideo', label: 'Embed Video', enabled: featureLimits.embedVideo, description: 'Video gallery and media embed support.' },
        { key: 'customMusic', label: 'Custom Music', enabled: featureLimits.customMusic, description: 'Upload your own MP3 or WAV background music.' },
        { key: 'qrPayment', label: 'QR Payment', enabled: featureLimits.qrCheckin, description: 'Upload a QR payment image for guests to scan.' },
        { key: 'addToCalendar', label: 'Add to Calendar', enabled: featureLimits.addToCalendar, description: 'Calendar shortcut on the invitation.' },
        { key: 'premiumAnimations', label: 'Premium Animations', enabled: featureLimits.premiumAnimations, description: 'Advanced motion and transition effects.' },
    ] as const;

    const updateMovieCredits = (credits: MovieCredit[]) => {
        setFormData((prev) => ({
            ...prev,
            templateConfig: {
                ...(prev.templateConfig || {}),
                movieCredits: credits,
            } as Partial<TemplateConfig>,
        }));
    };

    const addMovieCredit = () => {
        updateMovieCredits([...movieCredits, { role: '', name: '', nameEn: '' }]);
    };

    const updateMovieCredit = (index: number, field: keyof MovieCredit, value: string) => {
        updateMovieCredits(movieCredits.map((credit, creditIndex) => (
            creditIndex === index ? { ...credit, [field]: value } : credit
        )));
    };

    const removeMovieCredit = (index: number) => {
        updateMovieCredits(movieCredits.filter((_, creditIndex) => creditIndex !== index));
    };

    const handleSponsorUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'cooperate' | 'production') => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        try {
            const token = localStorage.getItem('auth_token');
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                uploadData.append('folder', 'covers');
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/upload.php`, {
                    method: 'POST',
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                    body: uploadData,
                });
                const uploadResult = await uploadRes.json();
                if (uploadResult.success && uploadResult.url) {
                    uploadedUrls.push(uploadResult.url);
                } else if (uploadResult.error) {
                    toast.error('Upload failed: ' + uploadResult.error);
                }
            }

            if (target === 'production' && uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    templateConfig: {
                        ...(prev.templateConfig || {}),
                        productionLogoUrl: uploadedUrls[0],
                    } as Partial<TemplateConfig>,
                }));
                toast.success('Production studio logo uploaded!');
            } else if (target === 'main' && uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    templateConfig: {
                        ...(prev.templateConfig || {}),
                        mainSponsorLogos: [...(prev.templateConfig?.mainSponsorLogos || []), ...uploadedUrls],
                    } as Partial<TemplateConfig>,
                }));
                toast.success('Main sponsor logo(s) uploaded!');
            } else if (target === 'cooperate' && uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    templateConfig: {
                        ...(prev.templateConfig || {}),
                        cooperateSponsorLogos: [...(prev.templateConfig?.cooperateSponsorLogos || []), ...uploadedUrls],
                    } as Partial<TemplateConfig>,
                }));
                toast.success('Cooperate sponsor logo(s) uploaded!');
            }
        } catch (err) {
            toast.error('Failed to upload logo.');
        }
        e.target.value = '';
    };

    const removeSponsorLogo = (target: 'main' | 'cooperate', index: number) => {
        setFormData(prev => {
            const key = target === 'main' ? 'mainSponsorLogos' : 'cooperateSponsorLogos';
            const currentList = Array.isArray(prev.templateConfig?.[key]) ? [...(prev.templateConfig[key] as string[])] : [];
            currentList.splice(index, 1);
            return {
                ...prev,
                templateConfig: {
                    ...(prev.templateConfig || {}),
                    [key]: currentList,
                } as Partial<TemplateConfig>,
            };
        });
    };

    // Delete Album Photo (Batch)
    const handleDeleteAlbumPhoto = (photoId: string) => {
        // if (!confirm('Remove this photo? (Will be permanently deleted on Save)')) return;

        // Add to deletion queue
        setDeletedAlbumPhotoIds(prev => [...prev, photoId]);

        // Remove from UI immediately
        setAlbumPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    const updateTemplateConfig = (updates: Partial<TemplateConfig>) => {
        setFormData(prev => ({
            ...prev,
            templateConfig: {
                ...(prev.templateConfig || {}),
                ...updates,
            },
        }));
    };

    const updateStorySlides = (slides: StorySlide[]) => {
        const normalized = normalizeStorySlides(
            slides
                .map((slide, index) => ({
                    ...slide,
                    order: index,
                }))
        );
        setStorySlides(normalized);
        updateTemplateConfig({ storySlides: normalized } as Partial<TemplateConfig>);
    };

    const handleStorySlideUpload = async (e: any) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingStory(true);
        const newSlides: StorySlide[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'album');

            try {
                const token = localStorage.getItem('auth_token');
                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/upload.php`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataUpload
                });
                const uploadResult = await uploadRes.json();

                if (uploadResult.success) {
                    newSlides.push({
                        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
                        imageUrl: uploadResult.url,
                        title: '',
                        caption: '',
                        order: storySlides.length + newSlides.length,
                    });
                }
            } catch (error) {
                console.error('Story slide upload error', error);
            }
        }

        if (newSlides.length > 0) {
            updateStorySlides([...storySlides, ...newSlides]);
        }

        e.target.value = '';
        setUploadingStory(false);
    };

    const handleStorySlideChange = (slideId: string, field: 'title' | 'caption', value: string) => {
        updateStorySlides(storySlides.map((slide) => (
            slide.id === slideId ? { ...slide, [field]: value } : slide
        )));
    };

    const handleDeleteStorySlide = (slideId: string) => {
        updateStorySlides(storySlides.filter((slide) => slide.id !== slideId));
    };

    const moveStorySlide = (slideId: string, direction: -1 | 1) => {
        const currentIndex = storySlides.findIndex((slide) => slide.id === slideId);
        if (currentIndex < 0) return;
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= storySlides.length) return;

        const nextSlides = [...storySlides];
        const [currentSlide] = nextSlides.splice(currentIndex, 1);
        nextSlides.splice(targetIndex, 0, currentSlide);
        updateStorySlides(nextSlides);
    };

    // Save Changes
    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Process Album Deletions first
            if (deletedAlbumPhotoIds.length > 0) {
                await Promise.all(deletedAlbumPhotoIds.map(id =>
                    apiFetch(`album.php?id=${id}`, { method: 'DELETE' })
                ));
                setDeletedAlbumPhotoIds([]); // Clear queue after success
            }

            // 2. Save Event Data
            const {
                date,
                titleEn,
                locationEn,
                groomFatherNameEn,
                groomMotherNameEn,
                brideFatherNameEn,
                brideMotherNameEn,
                groomFirstNameEn,
                groomLastNameEn,
                brideFirstNameEn,
                brideLastNameEn,
                invitationMessageEn,
                venueDetailsEn,
                enableSecondaryLanguage,
                celebrantTitle,
                celebrantKhmerTitle,
                is_active,
                ...restFormData
            } = formData;
            const secondaryLanguagePayload = canUseMultipleLanguages
                ? {
                    enableSecondaryLanguage,
                    titleEn,
                    locationEn,
                    groomFatherNameEn,
                    groomMotherNameEn,
                    brideFatherNameEn,
                    brideMotherNameEn,
                    groomFirstNameEn,
                    groomLastNameEn,
                    brideFirstNameEn,
                    brideLastNameEn,
                    invitationMessageEn,
                    venueDetailsEn,
                    celebrantTitle,
                    celebrantKhmerTitle,
                }
                : {};
            const finalTemplateConfig = {
                ...(formData.templateConfig || {}),
                ...(isMovieEvent ? { movieCredits } : {}),
            };
            const result = await apiFetch('events.php', {
                method: 'PUT',
                body: JSON.stringify({
                    id: event.id,
                    is_active: formData.is_active ? 1 : 0,
                    ...restFormData,
                    albumVideos: featureLimits.embedVideo
                        ? formData.albumVideos
                            .split('\n')
                            .map((item: string) => item.trim())
                            .filter(Boolean)
                        : [],
                    ...secondaryLanguagePayload,
                    templateConfig: Object.keys(finalTemplateConfig).length > 0 ? finalTemplateConfig : null,
                    date: date,       // Maintain sync for legacy column
                    startDate: date,  // Primary column
                })
            });

            if (result.success) {
                toast.success(t('client.dashboard.success'));
                router.refresh();
            } else {
                toast.error(`${t('client.dashboard.error')}: ${result.error || 'Unknown error'}`);
            }
        } catch (e) {
            toast.error(t('client.dashboard.error'));
            console.error(e);
        }
        setSaving(false);
    };

    return (
        <div className="bg-transparent md:bg-white md:dark:bg-[#111] md:rounded-2xl md:shadow-xl md:border md:border-gray-200 md:dark:border-[#222] overflow-hidden min-h-[600px] flex flex-col pb-24 md:pb-0">
            {/* Top Tabs (Desktop Only) */}
            <div className="hidden md:flex border-b border-gray-200 dark:border-[#222]">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'details' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    {t('client.dashboard.tabs.details')}
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'design' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    {t('client.dashboard.tabs.design')}
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'guests' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                >
                    {t('client.dashboard.tabs.guests')}
                </button>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-[#222] z-50 flex justify-around items-center px-2 py-2 pb-safe">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${activeTab === 'details' ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <Calendar size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">{t('client.dashboard.tabs.details')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${activeTab === 'design' ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <LayoutTemplate size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">{t('client.dashboard.tabs.design')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('guests')}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${activeTab === 'guests' ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <Users size={20} className="mb-1" />
                    <span className="text-[10px] font-bold">{t('client.dashboard.tabs.guests')}</span>
                </button>
            </div>

            {/* Content */}
            <div className="p-3 md:p-8 flex-1 overflow-y-auto overflow-x-hidden">
                {activeTab === 'details' && (
                    <div className="space-y-6 md:space-y-8 max-w-[1280px]">
                        {/* Basic Info */}
                        <div className="space-y-5 md:space-y-6">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{t('client.dashboard.basicInfo')}</h3>

                            {/* Event Status (Active / Inactive) */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span>ស្ថានភាពកម្មវិធី (Event Status)</span>
                                        </h4>
                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            នៅពេលផ្អាក (Inactive) តំណភ្ជាប់អញ្ជើញភ្ញៀវទាំងអស់នឹងបង្ហាញទំព័រ "កម្មវិធីត្រូវបានបញ្ចប់ ឬផ្អាកដំណើការ"។
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition shadow-md cursor-pointer ${
                                            formData.is_active
                                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                                : 'bg-red-500 text-white shadow-red-500/20'
                                        }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        {formData.is_active ? 'Active (ដំណើការ)' : 'Inactive (ផ្អាក)'}
                                    </button>
                                </div>
                            </div>

                            <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <Type size={16} /> {t('client.dashboard.eventTitle')} (Khmer)
                                    </label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                </div>
                                {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Title in English</label>
                                        <input
                                            name="titleEn"
                                            value={formData.titleEn}
                                            onChange={handleChange}
                                            placeholder={eventProfile.englishTitlePlaceholder}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}
                            </div>

                            {canUseMultipleLanguages && (
                                <div className="rounded-xl border border-blue-200/70 bg-blue-50/80 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Khmer + English Content</h4>
                                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">Enable this to enter English versions for names, family names, title, message, and venue details.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, enableSecondaryLanguage: !prev.enableSecondaryLanguage }))}
                                            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-bold transition ${formData.enableSecondaryLanguage ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white text-gray-600 border border-gray-300 dark:bg-[#111] dark:text-gray-300 dark:border-gray-700'}`}
                                        >
                                            {formData.enableSecondaryLanguage ? 'English Enabled' : 'Enable English'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!canUseMultipleLanguages && hasSavedSecondaryLanguageContent && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                    This event already has secondary-language content, but your current plan cannot edit multiple languages.
                                </div>
                            )}

                            {!canUseMultipleLanguages && !hasSavedSecondaryLanguageContent && (
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300">
                                    Multiple language content is available on plans with 2 or more languages. Your current account limit is {maxLanguages}.
                                </div>
                            )}

                            {/* Event Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Type size={16} /> {t('client.dashboard.eventType')}
                                </label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleEventTypeChange}
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
                                        <Calendar size={16} /> {eventProfile.dateLabel}
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

                            <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <MapPin size={16} /> {t('client.dashboard.location')} (Khmer)
                                    </label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                </div>
                                {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location in English</label>
                                        <input
                                            name="locationEn"
                                            value={formData.locationEn}
                                            onChange={handleChange}
                                            placeholder={eventProfile.locationPlaceholder}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {isMovieEvent && (
                            <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                {/* Movie Premiere Details & Sponsors Settings */}
                                <div className="space-y-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-5">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Film size={20} className="text-yellow-500" /> Movie Premiere & Sponsor Settings
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Configure the Movie Title, Director Name, Production Logo, Main Sponsors (Presented By), and Cooperate Sponsors displayed when guests click Open Invitation.
                                    </p>

                                    {/* Movie Name & Director Input */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Movie Name</label>
                                            <input
                                                value={formData.templateConfig?.movieTitle || ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    templateConfig: {
                                                        ...(prev.templateConfig || {}),
                                                        movieTitle: e.target.value,
                                                    } as Partial<TemplateConfig>,
                                                }))}
                                                placeholder="e.g. ពាយប័ក្ស (The Ghost Mother)"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Director Name</label>
                                            <input
                                                value={formData.templateConfig?.directorName || ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    templateConfig: {
                                                        ...(prev.templateConfig || {}),
                                                        directorName: e.target.value,
                                                    } as Partial<TemplateConfig>,
                                                }))}
                                                placeholder="e.g. សំបូរ ហ៊ួន"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Movie Summary / Synopsis */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                            Movie Summary / Synopsis (សាច់រឿងសង្ខេប)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.templateConfig?.movieSummary || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                templateConfig: {
                                                    ...(prev.templateConfig || {}),
                                                    movieSummary: e.target.value,
                                                } as Partial<TemplateConfig>,
                                            }))}
                                            placeholder="បញ្ចូលសាច់រឿងសង្ខេបនៃខ្សែភាពយន្តនៅទីនេះ... (Enter short summary of the movie here...)"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                        />
                                    </div>

                                    {/* Movie Trailers / Multiple Video Highlights */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                            Movie Highlights & Trailers (Multiple Links or Multiple Uploads - One per line)
                                        </label>
                                        <div className="flex flex-col gap-3">
                                            <textarea
                                                value={formData.templateConfig?.movieTrailerUrl || ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    templateConfig: {
                                                        ...(prev.templateConfig || {}),
                                                        movieTrailerUrl: e.target.value,
                                                    } as Partial<TemplateConfig>,
                                                }))}
                                                rows={4}
                                                placeholder="https://www.youtube.com/watch?v=... (one link per line)"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Dress Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-white/10 bg-black/5 p-4 dark:bg-white/5">
                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                                Dress Code Note
                                            </label>
                                            <input
                                                value={formData.templateConfig?.dressCode || formData.templateConfig?.dressCodeText || ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    templateConfig: {
                                                        ...(prev.templateConfig || {}),
                                                        dressCode: e.target.value,
                                                        dressCodeText: e.target.value,
                                                    } as Partial<TemplateConfig>,
                                                }))}
                                                placeholder="e.g. Formal black, gold, and white"
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                                                Dress Code Colors
                                            </label>
                                            <textarea
                                                value={Array.isArray(formData.templateConfig?.dressCodeColors) ? formData.templateConfig.dressCodeColors.join('\n') : ''}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    templateConfig: {
                                                        ...(prev.templateConfig || {}),
                                                        dressCodeColors: e.target.value
                                                            .split(/\r?\n|,/)
                                                            .map((item) => item.trim())
                                                            .filter(Boolean),
                                                    } as Partial<TemplateConfig>,
                                                }))}
                                                rows={3}
                                                placeholder={`#000000\n#C8A24A\n#FFFFFF`}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                            />
                                            {Array.isArray(formData.templateConfig?.dressCodeColors) && formData.templateConfig.dressCodeColors.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {formData.templateConfig.dressCodeColors.map((color, index) => (
                                                        <span
                                                            key={`${color}-${index}`}
                                                            className="h-7 w-7 rounded-full border border-gray-300 shadow-sm dark:border-white/20"
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Production Studio Logo Upload */}
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Production Studio Logo</label>
                                        <div className="flex items-center gap-3">
                                            {formData.templateConfig?.productionLogoUrl && (
                                                <div className="relative h-12 w-24 rounded-lg overflow-hidden border border-gray-300 bg-black/40 p-1 flex items-center justify-center">
                                                    <img src={formData.templateConfig.productionLogoUrl} alt="Production Logo" className="h-full w-full object-contain" />
                                                </div>
                                            )}
                                            <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-zinc-800 dark:text-gray-200">
                                                <span>Upload Studio Logo</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleSponsorUpload(e, 'production')} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Main Sponsors (PRESENTED BY) Logos Upload */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Main Sponsored Logos (Presented By)</label>
                                            <label className="cursor-pointer rounded-md bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 text-xs font-bold text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-300">
                                                + Add Main Sponsor Logo
                                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleSponsorUpload(e, 'main')} />
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {Array.isArray(formData.templateConfig?.mainSponsorLogos) && formData.templateConfig.mainSponsorLogos.map((logo: any, idx: number) => (
                                                <div key={idx} className="relative group h-14 w-20 rounded-xl border border-gray-300 bg-black/50 p-1 flex items-center justify-center">
                                                    <img src={typeof logo === 'string' ? logo : logo?.logoUrl} alt={`Main Sponsor ${idx}`} className="h-full w-full object-contain" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSponsorLogo('main', idx)}
                                                        className="absolute -top-2 -right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.templateConfig?.mainSponsorLogos || formData.templateConfig.mainSponsorLogos.length === 0) && (
                                                <p className="text-xs text-gray-400 italic">No main sponsor logos added yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cooperate Sponsors Logos Upload */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Cooperate Sponsored Logos (Co-Sponsored By)</label>
                                            <label className="cursor-pointer rounded-md bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 text-xs font-bold text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-300">
                                                + Add Cooperate Sponsor Logo
                                                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleSponsorUpload(e, 'cooperate')} />
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {Array.isArray(formData.templateConfig?.cooperateSponsorLogos) && formData.templateConfig.cooperateSponsorLogos.map((logo: any, idx: number) => (
                                                <div key={idx} className="relative group h-12 w-16 rounded-xl border border-gray-300 bg-black/50 p-1 flex items-center justify-center">
                                                    <img src={typeof logo === 'string' ? logo : logo?.logoUrl} alt={`Cooperate Sponsor ${idx}`} className="h-full w-full object-contain" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSponsorLogo('cooperate', idx)}
                                                        className="absolute -top-2 -right-2 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.templateConfig?.cooperateSponsorLogos || formData.templateConfig.cooperateSponsorLogos.length === 0) && (
                                                <p className="text-xs text-gray-400 italic">No cooperate sponsor logos added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Users size={20} /> Movie Credits
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Add the people or companies that should appear as movie credits on the invitation.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addMovieCredit}
                                        className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold text-yellow-700 transition hover:bg-yellow-500/20 dark:text-yellow-300"
                                    >
                                        + Add Credit
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {movieCredits.map((credit, index) => (
                                        <div key={index} className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-white/5">
                                            <div className={`grid grid-cols-1 gap-3 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-[180px_1fr_1fr_auto]' : 'md:grid-cols-[180px_1fr_auto]'}`}>
                                                <div>
                                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Role</label>
                                                    <input
                                                        list={`credit-role-options-${index}`}
                                                        value={credit.role}
                                                        onChange={(e) => updateMovieCredit(index, 'role', e.target.value)}
                                                        placeholder="Enter role or select..."
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                                    />
                                                    <datalist id={`credit-role-options-${index}`}>
                                                        {MOVIE_CREDIT_ROLE_OPTIONS.filter(r => r !== 'Custom').map((role) => (
                                                            <option key={role} value={role} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Name (Khmer)</label>
                                                    <input
                                                        value={credit.name}
                                                        onChange={(e) => updateMovieCredit(index, 'name', e.target.value)}
                                                        placeholder="ឈ្មោះផលិតករ ឬតួអង្គ"
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                                    />
                                                </div>
                                                {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">Name in English</label>
                                                        <input
                                                            value={credit.nameEn || ''}
                                                            onChange={(e) => updateMovieCredit(index, 'nameEn', e.target.value)}
                                                            placeholder="Producer or cast name"
                                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-yellow-500 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-white"
                                                        />
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeMovieCredit(index)}
                                                    className="self-end rounded-lg p-2 text-gray-400 transition hover:bg-red-500/10 hover:text-red-500"
                                                    aria-label="Remove movie credit"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {movieCredits.length === 0 && (
                                        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800">
                                            No credits added yet. Add Producer, Director, Writer, Owner / Studio, Main Cast, or any custom role.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Parents Names */}
                        {!isMovieEvent && (
                        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users size={20} /> {eventProfile.familySectionTitle}
                            </h3>

                            <div className={`grid grid-cols-1 gap-6 ${isCoupleEvent ? 'md:grid-cols-2' : ''}`}>
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">{eventProfile.primaryFamilyTitle}</h4>
                                    <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.fatherName')} (Khmer)</label>
                                            <input
                                                name="groomFatherName"
                                                value={formData.groomFatherName}
                                                onChange={handleChange}
                                                placeholder="លោក សុខ ពិសិដ្ឋ"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{isCoupleEvent ? 'Father Name in English' : 'Family / Father Name in English'}</label>
                                                <input
                                                    name="groomFatherNameEn"
                                                    value={formData.groomFatherNameEn}
                                                    onChange={handleChange}
                                                    placeholder="Mr. Sok Piseth"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.motherName')} (Khmer)</label>
                                            <input
                                                name="groomMotherName"
                                                value={formData.groomMotherName}
                                                onChange={handleChange}
                                                placeholder="លោកស្រី ម៉ៅ សោភា"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{isCoupleEvent ? 'Mother Name in English' : 'Family / Mother Name in English'}</label>
                                                <input
                                                    name="groomMotherNameEn"
                                                    value={formData.groomMotherNameEn}
                                                    onChange={handleChange}
                                                    placeholder="Mrs. Mao Sophea"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isCoupleEvent && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">{eventProfile.secondaryFamilyTitle}</h4>
                                        <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.fatherName')} (Khmer)</label>
                                                <input
                                                    name="brideFatherName"
                                                    value={formData.brideFatherName}
                                                    onChange={handleChange}
                                                    placeholder="លោក គឹម សុខា"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Father Name in English</label>
                                                    <input
                                                        name="brideFatherNameEn"
                                                        value={formData.brideFatherNameEn}
                                                        onChange={handleChange}
                                                        placeholder="Mr. Kim Sokha"
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.motherName')} (Khmer)</label>
                                                <input
                                                    name="brideMotherName"
                                                    value={formData.brideMotherName}
                                                    onChange={handleChange}
                                                    placeholder="លោកស្រី ចាន់ ធី"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Mother Name in English</label>
                                                    <input
                                                        name="brideMotherNameEn"
                                                        value={formData.brideMotherNameEn}
                                                        onChange={handleChange}
                                                        placeholder="Mrs. Chan Thy"
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Couple Names */}
                        <div className="space-y-5 md:space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{eventProfile.peopleSectionTitle}</h3>

                            <div className={`grid grid-cols-1 gap-6 ${isCoupleEvent ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300">{eventProfile.primaryPersonTitle}</h4>
                                    
                                    {/* Celebrant Title Fields - Only show for birthday events */}
                                    {isBirthdayEvent && (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Title (Khmer)</label>
                                                <select
                                                    name="celebrantKhmerTitle"
                                                    value={formData.celebrantKhmerTitle}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="">Select Title</option>
                                                    <option value="សម្តេចទ្រង់">សម្តេចទ្រង់</option>
                                                    <option value="ឯកឧត្តម">ឯកឧត្តម</option>
                                                    <option value="អែកឧត្តម">អែកឧត្តម</option>
                                                    <option value="លោកជំទាវ">លោកជំទាវ</option>
                                                    <option value="លោកស្រី">លោកស្រី</option>
                                                    <option value="លោក">លោក</option>
                                                    <option value="អ្នកឧកញ៉ា">អ្នកឧកញ៉ា</option>
                                                    <option value="អ្នកនាង">អ្នកនាង</option>
                                                    <option value="កញ្ញា">កញ្ញា</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Title (English)</label>
                                                <select
                                                    name="celebrantTitle"
                                                    value={formData.celebrantTitle}
                                                    onChange={handleChange}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="">Select Title</option>
                                                    <option value="H.E.">H.E. (His/Her Excellency)</option>
                                                    <option value="His Excellency">His Excellency</option>
                                                    <option value="Her Excellency">Her Excellency</option>
                                                    <option value="Hon.">Hon. (Honorable)</option>
                                                    <option value="The Honorable">The Honorable</option>
                                                    <option value="Sir">Sir</option>
                                                    <option value="Madam">Madam</option>
                                                    <option value="Dr.">Dr. (Doctor)</option>
                                                    <option value="Prof.">Prof. (Professor)</option>
                                                    <option value="Mr.">Mr. (Mister)</option>
                                                    <option value="Mrs.">Mrs. (Missus)</option>
                                                    <option value="Ms">Ms</option>
                                                    <option value="Miss">Miss</option>
                                                    <option value="Master">Master</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{eventProfile.primaryFirstNameLabel} (Khmer)</label>
                                            <input
                                                name="groomFirstName"
                                                value={formData.groomFirstName}
                                                onChange={handleChange}
                                                placeholder="ពិសិដ្ឋ"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{eventProfile.primaryFirstNameEnLabel}</label>
                                                <input
                                                    name="groomFirstNameEn"
                                                    value={formData.groomFirstNameEn}
                                                    onChange={handleChange}
                                                    placeholder="Piseth"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                        <div>
                                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{eventProfile.primaryLastNameLabel} (Khmer)</label>
                                            <input
                                                name="groomLastName"
                                                value={formData.groomLastName}
                                                onChange={handleChange}
                                                placeholder="សុខ"
                                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{eventProfile.primaryLastNameEnLabel}</label>
                                                <input
                                                    name="groomLastNameEn"
                                                    value={formData.groomLastNameEn}
                                                    onChange={handleChange}
                                                    placeholder="Sok"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isCoupleEvent && (
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-700 dark:text-gray-300">{eventProfile.secondaryPersonTitle}</h4>
                                        <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.firstName')} (Khmer)</label>
                                                <input
                                                    name="brideFirstName"
                                                    value={formData.brideFirstName}
                                                    onChange={handleChange}
                                                    placeholder="ធីតា"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">First Name in English</label>
                                                    <input
                                                        name="brideFirstNameEn"
                                                        value={formData.brideFirstNameEn}
                                                        onChange={handleChange}
                                                        placeholder="Thida"
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                            <div>
                                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.lastName')} (Khmer)</label>
                                                <input
                                                    name="brideLastName"
                                                    value={formData.brideLastName}
                                                    onChange={handleChange}
                                                    placeholder="ចាន់"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                                <div>
                                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Last Name in English</label>
                                                    <input
                                                        name="brideLastNameEn"
                                                        value={formData.brideLastNameEn}
                                                        onChange={handleChange}
                                                        placeholder="Chan"
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isBirthdayEvent && (
                                <div className="max-w-2xl rounded-2xl border border-yellow-200 bg-yellow-50/70 p-4 dark:border-yellow-500/20 dark:bg-yellow-500/10">
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Birthday / Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                    <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                                        {celebrantAgeLabel
                                            ? (formData.enableSecondaryLanguage
                                                ? `Age on invitation day: ${celebrantAgeLabel}`
                                                : `គម្រប់ខួប ${celebrantAgeLabel}`)
                                            : 'Select the birthday to show the celebrant age on the invitation.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Invitation Message */}
                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={18} /> {t('client.dashboard.invitationMessage')}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                {messageDraftOptions.map((draft) => (
                                    <button
                                        key={draft.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, invitationMessage: draft.message }))}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/20 transition-all"
                                    >
                                        {draft.label}
                                    </button>
                                ))}
                            </div>
                            <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Invitation Message (Khmer)</label>
                                    <textarea
                                        name="invitationMessage"
                                        value={formData.invitationMessage}
                                        onChange={handleChange}
                                        rows={8}
                                        placeholder={messageDraftOptions[0]?.message || "សូមគោរពអញ្ជើញ..."}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                </div>
                                {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Invitation Message in English</label>
                                        <textarea
                                            name="invitationMessageEn"
                                            value={formData.invitationMessageEn}
                                            onChange={handleChange}
                                            rows={8}
                                            placeholder="We warmly invite you to join us in celebrating this special occasion."
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Phone for Inquiry */}
                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users size={18} /> {t('client.dashboard.contactPhone')}
                            </h3>
                            <input
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="012 555 666 / 010 777 888"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Venue Details */}
                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Map size={18} /> {t('client.dashboard.venueDetails')}
                            </h3>
                            <div className={`grid grid-cols-1 gap-4 ${canUseMultipleLanguages && formData.enableSecondaryLanguage ? 'md:grid-cols-2' : ''}`}>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Venue Details (Khmer)</label>
                                    <textarea
                                        name="venueDetails"
                                        value={formData.venueDetails}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="ឧទាហរណ៍: ផ្ទះលេខ ១៦៨ ផ្លូវ ២៧១ សង្កាត់ទឹកល្អក់ទី៣ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                    />
                                </div>
                                {canUseMultipleLanguages && formData.enableSecondaryLanguage && (
                                    <div>
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Venue Details in English</label>
                                        <textarea
                                            name="venueDetailsEn"
                                            value={formData.venueDetailsEn}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Example: House No. 168, Street 271, Tuek Laak III, Toul Kork, Phnom Penh"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">{t('client.dashboard.mapUrl')}</label>
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
                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock size={18} /> {t('client.dashboard.eventSchedule')}
                                </h3>
                                <button
                                    onClick={addDay}
                                    className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-lg hover:bg-yellow-500/20 transition-all font-bold"
                                >
                                    {t('client.dashboard.addDay')}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {scheduleItems.map((day, dayIndex) => (
                                    <div key={dayIndex} className="bg-gray-100/50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                                                    {dayIndex + 1}
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">{t('client.dashboard.eventDate')}</span>
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
                                                <div key={actIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{t('client.dashboard.time')}</label>
                                                        <input
                                                            type="time"
                                                            value={activity.time}
                                                            onChange={(e) => handleActivityChange(dayIndex, actIndex, 'time', e.target.value)}
                                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-3 flex gap-2">
                                                        <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                                                            <div>
                                                                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">{t('client.dashboard.activity')}</label>
                                                                <input
                                                                    value={activity.activity}
                                                                    onChange={(e) => handleActivityChange(dayIndex, actIndex, 'activity', e.target.value)}
                                                                    placeholder="ពិធីហែរជំនូន..."
                                                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Activity in English</label>
                                                                <input
                                                                    value={activity.activityEn || ''}
                                                                    onChange={(e) => handleActivityChange(dayIndex, actIndex, 'activityEn', e.target.value)}
                                                                    placeholder="Dowry parade..."
                                                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] px-3 py-2 text-xs focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeActivityFromDay(dayIndex, actIndex)}
                                                            className="mt-5 p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addActivityToDay(dayIndex)}
                                                className="w-full py-2 mt-2 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-[10px] font-bold text-gray-500 hover:border-yellow-500/50 hover:text-yellow-600 transition-all uppercase tracking-widest"
                                            >
                                                + {t('client.dashboard.addActivity')}
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {scheduleItems.length === 0 && (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                                        <Clock className="mx-auto text-gray-300 mb-3" size={40} />
                                        <p className="text-gray-500 text-sm mb-4 font-medium">{t('client.dashboard.noSchedule')}</p>
                                        <button
                                            onClick={addDay}
                                            className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20"
                                        >
                                            {t('client.dashboard.addFirstDay')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === 'design' && (
                    <div className="space-y-6 md:space-y-8 max-w-[1440px]">
                        {/* Template Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <LayoutTemplate size={18} /> {t('client.dashboard.selectedTemplate')}
                                </h3>
                                {visibleTemplates.filter(t => t.codeKey === formData.templateId || t.id === formData.templateId).map((template) => (
                                    <div key={template.id} className="relative group rounded-xl border-2 overflow-hidden border-yellow-500 shadow-lg">
                                        <div className="aspect-video bg-gray-200 dark:bg-[#111] relative">
                                            {template.previewUrl ? (
                                                <Image src={template.previewUrl} alt={template.name} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <LayoutTemplate size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10">
                                            <h4 className="font-bold text-sm mb-1 text-yellow-700 dark:text-yellow-500">{template.name}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{template.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <LayoutTemplate size={18} /> {t('client.dashboard.changeTemplate')}
                                </h3>
                                <div className="mb-4 flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <p>Browse all available templates for this event type.</p>
                                    <span className="font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                                        {visibleTemplates.length} templates
                                    </span>
                                </div>
                                <div className="max-h-[420px] overflow-y-auto pr-1">
                                    <div className="grid grid-cols-2 gap-3">
                                        {visibleTemplates.map((template) => {
                                        const isSelected = formData.templateId === template.codeKey || formData.templateId === template.id;
                                        return (
                                            <div
                                                key={template.id}
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        templateId: template.codeKey || template.id,
                                                        templateConfig: null,
                                                    }))
                                                }
                                                className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${isSelected ? 'border-yellow-500' : 'border-gray-200 dark:border-gray-800'}`}
                                            >
                                                <div className="aspect-video relative">
                                                    {template.previewUrl && <Image src={template.previewUrl} alt={template.name} fill className="object-cover" />}
                                                </div>
                                                <div className={`px-2 py-2 text-[11px] font-bold ${isSelected ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-400' : 'bg-white/80 text-gray-600 dark:bg-[#111] dark:text-gray-300'}`}>
                                                    {template.name}
                                                </div>
                                            </div>
                                        );
                                        })}
                                    </div>
                                </div>
                                <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Scroll to see more templates</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-100/50 p-4 md:p-6 dark:border-[#222] dark:bg-white/5">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Plan Feature Access</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">These invitation features now respect the current subscribed plan.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {featureCards.map((feature) => (
                                    <div
                                        key={feature.key}
                                        className={`rounded-xl border px-4 py-3 ${feature.enabled
                                            ? 'border-green-200 bg-green-50/80 dark:border-green-500/20 dark:bg-green-500/10'
                                            : 'border-gray-200 bg-white/80 dark:border-gray-700 dark:bg-[#111]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{feature.label}</div>
                                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${feature.enabled
                                                ? 'bg-green-500/15 text-green-700 dark:text-green-300'
                                                : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {feature.enabled ? 'Enabled' : 'Locked'}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-gray-100/50 p-4 md:p-6 dark:border-[#222] dark:bg-white/5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">Transition Page Content</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Show the text/content overlay on the transition page, or hide everything and let the video play by itself.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => updateTemplateConfig({ showTransitionOverlay: !transitionContentVisible })}
                                    className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-bold transition ${transitionContentVisible ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white text-gray-600 border border-gray-300 dark:bg-[#111] dark:text-gray-300 dark:border-gray-700'}`}
                                >
                                    {transitionContentVisible ? 'Content Shown' : 'Video Only'}
                                </button>
                            </div>
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-[#111] dark:text-gray-300">
                                Current behavior: {transitionContentVisible ? 'The transition page shows text and details on top of the video.' : 'The transition page hides all overlay content and only shows the playing video.'}
                            </div>
                        </div>

                        {/* Media: Album */}
                        <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ImageIcon size={18} /> {t('client.dashboard.albumPhotos')}
                            </h3>
                            {albumPhotos.length > 0 && (
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 mb-4">
                                    {albumPhotos.map((photo: any) => (
                                        <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 group">
                                            <Image src={photo.imageUrl} alt="Album" fill className="object-cover" />
                                            <button onClick={() => handleDeleteAlbumPhoto(photo.id)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label className="flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <Upload size={18} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">{uploadingAlbum ? t('client.dashboard.uploading') : t('client.dashboard.uploadPhotos')}</span>
                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleAlbumUpload} disabled={uploadingAlbum} />
                            </label>
                        </div>

                        <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ImageIcon size={18} /> Story Telling
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        A curated swipe story separate from the photo album. Guests can read one caption per image like a romantic photo book.
                                    </p>
                                </div>
                                <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                                    Reusable Across Layouts
                                </span>
                            </div>

                            {storySlides.length > 0 && (
                                <div className="mt-5 space-y-4">
                                    {storySlides.map((slide, index) => (
                                        <div key={slide.id} className="grid gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-800 dark:bg-[#111]/80 md:grid-cols-[120px_minmax(0,1fr)]">
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-black/20">
                                                <Image src={slide.imageUrl} alt={`Story slide ${index + 1}`} fill className="object-cover" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        Slide {index + 1}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveStorySlide(slide.id, -1)}
                                                            disabled={index === 0}
                                                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                                                        >
                                                            Move Up
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveStorySlide(slide.id, 1)}
                                                            disabled={index === storySlides.length - 1}
                                                            className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition disabled:opacity-40 dark:border-gray-700 dark:text-gray-200"
                                                        >
                                                            Move Down
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteStorySlide(slide.id)}
                                                            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition dark:border-red-500/30 dark:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={slide.title || ''}
                                                    onChange={(e) => handleStorySlideChange(slide.id, 'title', e.target.value)}
                                                    placeholder="Story title or short heading"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                                />
                                                <textarea
                                                    value={slide.caption || ''}
                                                    onChange={(e) => handleStorySlideChange(slide.id, 'caption', e.target.value)}
                                                    rows={3}
                                                    placeholder="Write the caption guests should read for this image"
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-yellow-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className="mt-5 flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <Upload size={18} className="mr-2 text-gray-500" />
                                <span className="text-sm font-medium">{uploadingStory ? t('client.dashboard.uploading') : 'Upload Story Images'}</span>
                                <input type="file" className="hidden" accept="image/*" multiple onChange={handleStorySlideUpload} disabled={uploadingStory} />
                            </label>

                            {storySlides.length === 0 && (
                                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                    No story slides added yet. Upload selected images here if you want a separate swipe story section with captions.
                                </p>
                            )}
                        </div>

                        {/* Asset Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Logo */}
                            <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ImageIcon size={18} /> {t('client.dashboard.eventLogo')}
                                </h3>
                                {formData.logoUrl ? (
                                    <div className="relative aspect-square max-w-[120px] mx-auto mb-4 bg-gray-100 dark:bg-black/20 rounded-lg p-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                                            className="absolute right-2 top-2 z-10 rounded-full bg-black/75 p-1.5 text-white transition hover:bg-red-500"
                                            title="Remove logo"
                                        >
                                            <X size={14} />
                                        </button>
                                        <Image src={formData.logoUrl} alt="Logo" fill className="object-contain" />
                                    </div>
                                ) : (
                                    <div className="aspect-square max-w-[120px] mx-auto mb-4 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <ImageIcon size={32} className="text-gray-300" />
                                    </div>
                                )}
                                <label className="flex items-center justify-center w-full py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer text-xs font-bold uppercase tracking-widest">
                                    {t('client.dashboard.uploadLogo')}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} />
                                </label>
                            </div>

                            {/* Share Image */}
                            <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ImageIcon size={18} /> {t('client.dashboard.shareThumbnail')}
                                </h3>
                                {formData.shareImageUrl ? (
                                    <div className="relative aspect-video max-w-[200px] mx-auto mb-4 bg-gray-100 dark:bg-black/20 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, shareImageUrl: '' }))}
                                            className="absolute right-2 top-2 z-10 rounded-full bg-black/75 p-1.5 text-white transition hover:bg-red-500"
                                            title="Remove thumbnail"
                                        >
                                            <X size={14} />
                                        </button>
                                        <Image src={formData.shareImageUrl} alt="Share" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="aspect-video max-w-[200px] mx-auto mb-4 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <ImageIcon size={32} className="text-gray-300" />
                                    </div>
                                )}
                                <label className="flex items-center justify-center w-full py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer text-xs font-bold uppercase tracking-widest">
                                    {t('client.dashboard.uploadThumbnail')}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'shareImage')} />
                                </label>
                            </div>

                            {/* Payment QR */}
                            <div className="bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <QrCode size={18} /> QR Payment
                                </h3>
                                {!featureLimits.qrCheckin && (
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                        Your current plan does not allow QR payment display. Upgrade the plan to upload and show a payment QR image on the invitation.
                                    </div>
                                )}
                                {formData.paymentQrImageUrl ? (
                                    <div className="relative aspect-square max-w-[180px] mx-auto mb-4 bg-gray-100 dark:bg-black/20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, paymentQrImageUrl: '' }))}
                                            className="absolute right-2 top-2 z-10 rounded-full bg-black/75 p-1.5 text-white transition hover:bg-red-500"
                                            title="Remove QR image"
                                        >
                                            <X size={14} />
                                        </button>
                                        <Image src={formData.paymentQrImageUrl} alt="Payment QR" fill className="object-contain p-2" />
                                    </div>
                                ) : (
                                    <div className="aspect-square max-w-[180px] mx-auto mb-4 bg-gray-100 dark:bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <QrCode size={36} className="text-gray-300" />
                                    </div>
                                )}
                                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                                    Upload the QR image guests should scan for Bakong, bank transfer, or other payment support.
                                </p>
                                <label className={`flex items-center justify-center w-full py-2 border rounded-lg text-xs font-bold uppercase tracking-widest ${featureLimits.qrCheckin ? 'bg-white dark:bg-[#222] border-gray-200 dark:border-gray-700 cursor-pointer' : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-600 dark:border-gray-800 cursor-not-allowed'}`}>
                                    Upload QR Image
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'paymentQr')} disabled={!featureLimits.qrCheckin} />
                                </label>
                            </div>

                            {/* Music */}
                            <div className="md:col-span-2 bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Music size={18} /> {t('client.dashboard.backgroundMusic')}
                                </h3>
                                {!featureLimits.customMusic && (
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                        Your current plan does not allow custom background music. Upgrade the plan to unlock music library selection and MP3/WAV upload.
                                    </div>
                                )}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <select
                                        name="musicUrl"
                                        value={formData.musicUrl}
                                        onChange={handleChange}
                                        disabled={!featureLimits.customMusic}
                                        className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#222] px-4 py-2 text-sm outline-none transition"
                                    >
                                        <option value="">Select from library</option>
                                        {globalMusic.map((music) => (
                                            <option key={music.id} value={music.url}>{music.name}</option>
                                        ))}
                                    </select>
                                    <label className={`flex items-center justify-center px-6 py-2 border rounded-lg text-xs font-bold uppercase tracking-widest ${featureLimits.customMusic ? 'bg-white dark:bg-[#222] border-gray-200 dark:border-gray-700 cursor-pointer' : 'bg-gray-100 text-gray-400 border-gray-200 dark:bg-[#1a1a1a] dark:text-gray-600 dark:border-gray-800 cursor-not-allowed'}`}>
                                        Upload Custom
                                        <input type="file" className="hidden" accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav" onChange={(e) => handleUpload(e, 'music')} disabled={!featureLimits.customMusic} />
                                    </label>
                                </div>
                            </div>

                            {/* Embed Video */}
                            <div className="md:col-span-2 bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Video size={18} /> Embed Video
                                </h3>
                                {!featureLimits.embedVideo && (
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                        Your current plan does not allow embedded videos. Upgrade the plan to unlock YouTube or Vimeo video links.
                                    </div>
                                )}
                                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-400">
                                    Add one video link per line. Supported: YouTube, YouTube Shorts, Vimeo, or direct video URLs.
                                </label>
                                <textarea
                                    name="albumVideos"
                                    value={formData.albumVideos}
                                    onChange={handleChange}
                                    rows={5}
                                    disabled={!featureLimits.embedVideo}
                                    placeholder={`https://www.youtube.com/watch?v=...\nhttps://vimeo.com/...`}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none transition text-gray-900 dark:text-white disabled:bg-gray-100 disabled:text-gray-400 dark:disabled:bg-[#111] dark:disabled:text-gray-600"
                                />
                                {featureLimits.embedVideo && formData.albumVideos.trim() && (
                                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        {formData.albumVideos.split('\n').map((item: string) => item.trim()).filter(Boolean).length} video link(s) ready to show in the invitation gallery.
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 bg-gray-100/50 dark:bg-white/5 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-[#222]">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MessageSquare size={18} /> Digital Wishes
                                </h3>
                                {!featureLimits.digitalWishes ? (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                                        Your current plan does not allow a guest wishes wall. Upgrade the plan to let guests post blessing and congratulation messages on the invitation.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Guests can leave comments and blessing wishes directly on the live invitation. This feature is already active for your current plan.
                                        </p>
                                        <div className="rounded-xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-800 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-200">
                                            Digital Wishes is enabled for this event.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'guests' && (
                    <div className="mx-auto max-w-[1440px]">
                        <GuestManager eventId={event.id} eventSlug={event.slug} guests={guests} event={formData} />
                    </div>
                )}
            </div>

            {/* Save Button Container */}
            <div className="fixed md:sticky bottom-[62px] md:bottom-0 left-0 right-0 p-3 md:p-6 border-t border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-black/80 backdrop-blur-lg md:bg-gray-50 md:dark:bg-[#0a0a0a] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-none z-40">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {saving ? t('client.dashboard.saving') : t('client.dashboard.save')}
                </button>
            </div>
        </div>
    );
}
