'use client';

import { useState } from 'react';
import GoldenGrandeurLayout from '@/components/Invitation/layouts/GoldenGrandeurLayout';
import ClassGoldLayout from '@/components/Invitation/layouts/ClassGoldLayout';
import ModernMinimalLayout from '@/components/Invitation/layouts/ModernMinimalLayout';
import TraditionalHeritageLayout from '@/components/Invitation/layouts/TraditionalHeritageLayout';
import MovieCeremonyLayout from '@/components/Invitation/layouts/MovieCeremonyLayout';
import BlueArchLayout from '@/components/Invitation/layouts/BlueArchLayout';

const mockData = {
    guestName: "Mr. & Mrs. John Doe",
    groomFirstName: "Rithy",
    groomLastName: "Chann",
    brideFirstName: "Sreyneang",
    brideLastName: "Vuth",
    eventTitle: "The Wedding Celebration",
    eventDate: new Date(),
    location: "Phnom Penh Hotel",
    venueDetails: "Grand Ballroom, Floor 2",
    invitationMessage: "We request the honor of your presence at our wedding celebration.",
    groomFatherName: "Mr. Chann Sophat",
    groomMotherName: "Mrs. Keo Sopheap",
    brideFatherName: "Mr. Vuth Sovann",
    brideMotherName: "Mrs. Seng Sreysros",
    musicUrl: null, // Audio is annoying in tests
    logoUrl: "https://via.placeholder.com/150",
    albumPhotos: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80"
    ],
    albumVideos: [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    ],
    schedule: JSON.stringify([
        { time: "08:00 AM", activity: "Reception" },
        { time: "10:00 AM", activity: "Ceremony" },
        { time: "12:00 PM", activity: "Lunch" }
    ])
};

export default function TestPage() {
    const [layout, setLayout] = useState('golden-grandeur');

    const renderLayout = () => {
        switch (layout) {
            case 'golden-grandeur': return <GoldenGrandeurLayout {...mockData} />;
            case 'class-gold': return <ClassGoldLayout {...mockData} />;
            case 'modern-minimal': return <ModernMinimalLayout {...mockData} />;
            case 'traditional': return <TraditionalHeritageLayout {...mockData} />;
            case 'movie': return <MovieCeremonyLayout {...mockData} />;
            case 'blue-arch': return <BlueArchLayout {...mockData} previewPage="details" />;
            default: return <div>Select a layout</div>;
        }
    };

    return (
        <div className="min-h-screen">
            <div className="fixed top-4 left-4 z-[200] flex gap-2 flex-wrap">
                {['golden-grandeur', 'class-gold', 'modern-minimal', 'traditional', 'movie', 'blue-arch'].map(l => (
                    <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`px-4 py-2 rounded-full text-xs font-bold ${layout === l ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'}`}
                    >
                        {l}
                    </button>
                ))}
            </div>
            {renderLayout()}
        </div>
    );
}
