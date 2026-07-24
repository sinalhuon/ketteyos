import { Metadata } from 'next';
import ClientInvitationPage from './client-page';
import { toKhmerDate, toKhmerNumber } from '@/lib/khmer-utils';

type Props = {
    params: Promise<{ inviteIds: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type EventMetadataData = {
    id?: string | null;
    eventId?: string | null;
    slug?: string | null;
    title?: string | null;
    eventType?: string | null;
    templateId?: string | null;
    templateConfig?: unknown;
    updatedAt?: string | number | Date | null;
    shareImageUrl?: string | null;
    logoUrl?: string | null;
    startDate?: string | Date | null;
    date?: string | Date | null;
    invitationMessage?: string | null;
    venueDetails?: string | null;
    location?: string | null;
    contactPhone?: string | null;
};

type ImageMetadataSize = {
    width: number;
    height: number;
};

type GuestMetadataData = {
    name?: string | null;
    eventId?: string | null;
    photoUrl?: string | null;
    guestPhotoUrl?: string | null;
    avatarUrl?: string | null;
    profileImage?: string | null;
    imageUrl?: string | null;
    photo?: string | null;
    avatar?: string | null;
    updatedAt?: string | number | Date | null;
    photoUpdatedAt?: string | number | Date | null;
};

async function getEventData(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events.php?slug=${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        return (data as { event?: EventMetadataData }).event || null;
    } catch {
        return null;
    }
}

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ketteyos.com').replace(/\/$/, '');
const movieOgImageVersion = 'movie-poster-original-size-v3';

function toAbsoluteImageUrl(url?: string | null) {
    if (!url) return `${siteUrl}/icon.png`;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${siteUrl}/${url.replace(/^\//, '')}`;
}

function parseTemplateConfig(config: unknown): { layoutType?: string | null } {
    if (!config) return {};
    if (typeof config === 'object') return config;
    try {
        const decoded = JSON.parse(String(config));
        return decoded && typeof decoded === 'object' ? decoded : {};
    } catch {
        return {};
    }
}

function isMovieInvite(event: EventMetadataData | null | undefined) {
    const eventType = String(event?.eventType || '').toLowerCase().replace(/[-\s]+/g, '_');
    const templateId = String(event?.templateId || '').toLowerCase().replace(/[-\s]+/g, '_');
    const templateConfig = parseTemplateConfig(event?.templateConfig);
    const layoutType = String(templateConfig?.layoutType || '').toLowerCase().replace(/[-\s]+/g, '_');

    return eventType === 'movie_premiere'
        || eventType.includes('movie')
        || eventType.includes('film')
        || templateId.includes('movie')
        || templateId.includes('film')
        || layoutType === 'movie_ceremony';
}

function getGuestPhotoVersion(guest?: GuestMetadataData | null) {
    if (!guest) return '';

    const photoUrl = guest.photoUrl
        || guest.guestPhotoUrl
        || guest.avatarUrl
        || guest.profileImage
        || guest.imageUrl
        || guest.photo
        || guest.avatar
        || '';
    const updatedAt = guest.updatedAt || guest.photoUpdatedAt || '';
    if (!photoUrl && !updatedAt) return '';

    const versionSource = `${photoUrl}|${updatedAt}`.trim();
    if (!versionSource) return '';

    let hash = 0;
    for (let index = 0; index < versionSource.length; index += 1) {
        hash = ((hash << 5) - hash + versionSource.charCodeAt(index)) | 0;
    }

    return Math.abs(hash).toString(36);
}

function getSharePreviewImage(event: EventMetadataData, guestCode?: string, guest?: GuestMetadataData | null) {
    if (isMovieInvite(event)) {
        const eventIdentifier = event.slug || event.id || event.eventId;
        const params = new URLSearchParams();
        if (event.slug) {
            params.set('slug', event.slug);
        } else if (eventIdentifier) {
            params.set('id', eventIdentifier);
        }
        if (guestCode) {
            params.set('guest', guestCode);
        }
        if (event.updatedAt) {
            params.set('v', String(new Date(event.updatedAt).getTime() || event.updatedAt));
        }
        const guestVersion = getGuestPhotoVersion(guest);
        if (guestVersion) {
            params.set('gv', guestVersion);
        }
        params.set('ogv', movieOgImageVersion);
        return `${siteUrl}/api/og_image.php?${params.toString()}`;
    }

    return toAbsoluteImageUrl(event.shareImageUrl || event.logoUrl || '/icon.png');
}

function getMovieShareImageSize(event?: EventMetadataData | null): ImageMetadataSize {
    const shareImage = event?.shareImageUrl || '';
    const match = shareImage.match(/619594504_2151087885295548_1825948278924567370_n/i);
    if (match) {
        return { width: 1000, height: 838 };
    }

    return { width: 1200, height: 630 };
}

function formatMovieDescription(event: EventMetadataData, guestName?: string | null) {
    const invitee = guestName || event.title || 'ភ្ញៀវកិត្តិយស';
    return `សូមគោរពអញ្ជើញ ${invitee}\nចូលរួមកម្មវិធីសម្ភោធខ្សែភាពយន្តខ្មែរ\n${formatDescription(event)}`;
}

// Helper to format consistent description
function formatDescription(event: EventMetadataData) {
    // Format Date & Time
    const dateObj = new Date(event.startDate || event.date || new Date());
    const dateStr = toKhmerDate(dateObj);

    const hour = dateObj.getHours();
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const minute = dateObj.getMinutes();
    const period = hour >= 5 && hour < 12 ? 'ព្រឹក' :
        hour >= 12 && hour < 17 ? 'រសៀល' :
            hour >= 17 && hour < 20 ? 'ល្ងាច' : 'យប់';

    const timeStr = `វេលាម៉ោង ${toKhmerNumber(hour12)}:${toKhmerNumber(minute).padStart(2, '០')} ${period}`;

    const location = event.venueDetails || event.location || 'Location TBD';
    const phones = event.contactPhone || '012 345 678';

    return `🗓️ ${dateStr}\n⏰ ${timeStr}\n📍 ${location}\n📞 ${phones}`;
}

function buildShareMetadata(title: string, description: string, image: string, imageSize: ImageMetadataSize = { width: 1200, height: 630 }): Metadata {
    const metaDescription = description.replace(/\s+/g, ' ').trim();
    const imageMetadata = {
        url: image,
        width: imageSize.width,
        height: imageSize.height,
        alt: title,
        ...(image.includes('/api/og_image.php') ? { type: 'image/jpeg' } : {}),
    };

    return {
        title,
        description: metaDescription,
        openGraph: {
            title,
            description: metaDescription,
            images: [imageMetadata],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: metaDescription,
            images: [image],
        },
    };
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { inviteIds } = await params;

    // Handle Route: /invite/[slug]/[code]
    if (inviteIds.length === 2) {
        const slug = inviteIds[0];
        const event = await getEventData(slug);

        if (event) {
            let title = event.title || 'Wedding Invitation';
            let description = event.invitationMessage ? event.invitationMessage.substring(0, 150) + '...' : 'You are invited!';
            let image = getSharePreviewImage(event);

            const guestCode = inviteIds[1];
            try {
                const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guests.php?code=${guestCode}`, { cache: 'no-store' });
                if (guestRes.ok) {
                    const guestData = await guestRes.json();
                    if (guestData && guestData.guest && guestData.guest.name) {
                        if (isMovieInvite(event)) {
                            title = 'Ketteyos';
                            description = formatMovieDescription(event, guestData.guest.name);
                        } else {
                            title = `សូមគោរពអញ្ជើញ ${guestData.guest.name}`;
                            description = formatDescription(event);
                        }
                        image = getSharePreviewImage(event, guestCode, guestData.guest);
                    }
                }
            } catch {
                // Ignore guest fetch error
            }

            return buildShareMetadata(title, description, image, isMovieInvite(event) ? getMovieShareImageSize(event) : undefined);
        }
    }

    // Handle Short Code or Token Route: /invite/[code]
    if (inviteIds.length === 1) {
        const id = inviteIds[0];
        try {
            // 1. Try to fetch guest by code
            const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guests.php?code=${id}`, { cache: 'no-store' });
            if (guestRes.ok) {
                const guestData = await guestRes.json() as { success?: boolean; guest?: GuestMetadataData };
                if (guestData && guestData.success && guestData.guest) {
                    const eventRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events.php?id=${guestData.guest.eventId}&public=true`, { cache: 'no-store' });
                    if (eventRes.ok) {
                        const eventData = await eventRes.json() as { event?: EventMetadataData };
                        if (eventData && eventData.event) {
                            const event = eventData.event;
                            const isMovie = isMovieInvite(event);
                            const title = isMovie ? 'Ketteyos' : `សូមគោរពអញ្ជើញ ${guestData.guest.name}`;
                            const description = isMovie ? formatMovieDescription(event, guestData.guest.name) : formatDescription(event);
                            const image = getSharePreviewImage(event, id, guestData.guest);

                            return buildShareMetadata(title, description, image, isMovie ? getMovieShareImageSize(event) : undefined);
                        }
                    }
                }
            }
        } catch {
            // Ignore
        }

        const event = await getEventData(id);
        if (event) {
            const isMovie = isMovieInvite(event);
            const title = isMovie ? 'Ketteyos' : (event.title || 'Wedding Invitation');
            const description = isMovie
                ? formatMovieDescription(event)
                : (event.invitationMessage ? event.invitationMessage.substring(0, 150) + '...' : 'You are invited!');
            const image = getSharePreviewImage(event);
            return buildShareMetadata(title, description, image, isMovie ? getMovieShareImageSize(event) : undefined);
        }
    }

    return {
        title: 'Wedding Invitation',
        description: 'You are invited to join us!',
    };
}


export async function generateStaticParams() {
    return [{ inviteIds: ['default'] }];
}

export default async function InvitationPage({ params }: Props) {
    await params; // Ensure params is awaited if needed, though ClientInvitationPage handles parsing from window/hook mostly.
    return <ClientInvitationPage />;
}
