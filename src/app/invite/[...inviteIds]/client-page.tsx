'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InvitationView from '@/components/Invitation/InvitationView';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientInvitationPage() {
    const params = useParams();
    const inviteIds = params?.inviteIds as string[] || [];

    const [event, setEvent] = useState<any>(null);
    const [guest, setGuest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            let currentInviteIds = inviteIds;

            // Handle static export 'default' param or missing params
            if (currentInviteIds.length === 0 || (currentInviteIds.length === 1 && currentInviteIds[0] === 'default')) {
                // Parse from window.location
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                const inviteIndex = pathSegments.indexOf('invite');
                if (inviteIndex !== -1 && inviteIndex + 1 < pathSegments.length) {
                    currentInviteIds = pathSegments.slice(inviteIndex + 1);
                }
            }

            if (!currentInviteIds || currentInviteIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                // Scenario 1: /invite/[slug]/[guestCode]
                if (currentInviteIds.length === 2) {
                    const slug = currentInviteIds[0];
                    const guestCode = currentInviteIds[1];

                    // Fetch Event
                    const eventRes = await fetch(`${apiUrl}/events.php?slug=${slug}`);
                    const eventData = await eventRes.json();

                    if (eventData.success && eventData.event) {
                        setEvent(eventData.event);
                    } else {
                        setError('Event not found');
                        setLoading(false);
                        return;
                    }

                    // Fetch Guest
                    const guestRes = await fetch(`${apiUrl}/guests.php?code=${guestCode}`);
                    const guestData = await guestRes.json();

                    if (guestData.success && guestData.guest) {
                        setGuest(guestData.guest);
                    }
                }
                // Scenario 2: /invite/[code] (Short Code or Token)
                else if (currentInviteIds.length === 1) {
                    const code = currentInviteIds[0];

                    // Try as Guest Code first
                    const guestRes = await fetch(`${apiUrl}/guests.php?code=${code}`);
                    const guestData = await guestRes.json();

                    if (guestData.success && guestData.guest) {
                        setGuest(guestData.guest);
                        // Fetch Event by ID from guest data
                        const eventRes = await fetch(`${apiUrl}/events.php?id=${guestData.guest.eventId}&public=true`);
                        const eventData = await eventRes.json();
                        if (eventData.success && eventData.event) {
                            setEvent(eventData.event);
                        } else {
                            setError('Event not found');
                        }
                    } else {
                        // Not a guest code? Try as Event ID/Slug (Public Generic Invite)
                        const eventRes = await fetch(`${apiUrl}/events.php?slug=${code}`);
                        const eventData = await eventRes.json();
                        if (eventData.success && eventData.event) {
                            setEvent(eventData.event);
                        } else {
                            // Try as ID
                            const eventIdRes = await fetch(`${apiUrl}/events.php?id=${code}&public=true`);
                            const eventIdData = await eventIdRes.json();
                            if (eventIdData.success && eventIdData.event) {
                                setEvent(eventIdData.event);
                            } else {
                                setError('Invalid invitation code');
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load invitation');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [inviteIds]);

    const handleRsvp = async (status: 'ACCEPTED' | 'DECLINED') => {
        if (!guest) return;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${apiUrl}/guests.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'rsvp',
                    code: guest.code || guest.shortCode, // Support both if needed, usually 'code' (token) or 'shortCode'
                    status: status
                })
            });
            const data = await res.json();
            if (data.success) {
                setGuest((prev: any) => ({ ...prev, status }));
            }
        } catch (e) {
            console.error('RSVP Failed', e);
        }
    };

    if (loading) {
        return (
            <div suppressHydrationWarning className="min-h-screen flex items-center justify-center bg-black text-white">
                <div suppressHydrationWarning className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EEC573]"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center p-8">
                    <h1 className="text-2xl text-[#EEC573] mb-4">Invitation Not Found</h1>
                    <p className="text-gray-400">{error || "We couldn't find the event you're looking for."}</p>
                </div>
            </div>
        );
    }

    return (
        <LanguageProvider storageKey="client_invite_language">
            <InvitationView
                {...event}
                id={event.id || event.eventId}
                eventId={event.eventId || event.id}
                eventTitle={event.title}
                eventDate={new Date(event.date)}
                location={event.location}
                description={event.description}
                eventType={event.eventType}
                templateId={event.templateId}
                schedule={event.schedule || event.eventDays}
                invitationMessage={event.invitationMessage || event.description}
                groomFatherName={event.groomFatherName}
                groomMotherName={event.groomMotherName}
                brideFatherName={event.brideFatherName}
                brideMotherName={event.brideMotherName}
                groomFirstName={event.groomFirstName}
                groomLastName={event.groomLastName}
                brideFirstName={event.brideFirstName}
                brideLastName={event.brideLastName}
                venueDetails={event.venueDetails}
                mapUrl={event.mapUrl}
                guestName={guest?.name}
                guestPhotoUrl={guest?.photoUrl || guest?.avatarUrl || guest?.photo || guest?.avatar}
                guestAvatarUrl={guest?.avatarUrl || guest?.photoUrl || guest?.photo || guest?.avatar}
                guestStatus={guest?.status}
                code={guest?.code}
                shortCode={guest?.shortCode}
                onRsvp={handleRsvp}
                // Ensure array for photos if null
                albumPhotos={event.albumPhotos || []}
                templateConfig={event.templateConfig ? (typeof event.templateConfig === 'string' ? JSON.parse(event.templateConfig) : event.templateConfig) : undefined}
            />
        </LanguageProvider>
    );
}
