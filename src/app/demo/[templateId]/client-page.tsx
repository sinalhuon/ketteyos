'use client';

import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import InvitationViewWithTemplates from '@/components/Invitation/InvitationViewWithTemplates';

export default function ClientDemoPage({ templateId }: { templateId: string }) {
    const [templateData, setTemplateData] = useState<any>(null);
    const [appLogo, setAppLogo] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(templateId);

    useEffect(() => {
        async function fetchTemplate() {
            let currentId = templateId;

            // Production: real ID is passed as ?t= query param (since static export
            // only pre-renders templateId='default')
            const searchParams = new URLSearchParams(window.location.search);
            const queryId = searchParams.get('t');
            if (queryId) {
                currentId = queryId;
                setActiveId(currentId);
            } else if (currentId === 'default') {
                // Fallback: read from pathname segment
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                const demoIndex = pathSegments.indexOf('demo');
                if (demoIndex !== -1 && demoIndex + 1 < pathSegments.length) {
                    currentId = pathSegments[demoIndex + 1];
                    setActiveId(currentId);
                }
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public_templates.php`);
                const data = await res.json();
                if (data.success && data.templates) {
                    const matched = data.templates.find((t: any) => t.codeKey === currentId);
                    if (matched) {
                        setTemplateData(matched);
                    }
                }

                // Fetch App Logo
                const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings.php`);
                const settingsData = await settingsRes.json();
                if (settingsData.success && settingsData.settings) {
                    setAppLogo(settingsData.settings.appLogo || null);
                }
            } catch (error) {
                console.error('Failed to fetch template:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTemplate();
    }, [templateId]);

    // Generate dummy date for next month
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setHours(17, 0, 0, 0);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EEC573]"></div>
            </div>
        );
    }

    return (
        <LanguageProvider storageKey="demo_invite_language">
            <DemoContent templateId={activeId} date={nextMonth} templateData={templateData} appLogo={appLogo} />
        </LanguageProvider>
    );
}

function DemoContent({ templateId, date, templateData, appLogo }: { templateId: string, date: Date, templateData?: any, appLogo?: string | null }) {
    const { language, t } = useLanguage();

    const isKhmer = language === 'kh';

    // Day 1 & Day 2 for the schedule
    const day1 = new Date(date);
    const day2 = new Date(date);
    day2.setDate(day2.getDate() + 1);

    const khmerSchedule = [
        // Day 1
        { time: "08:30", activity: "មង្គលសែនក្រុងពាលី", date: day1.toISOString() },
        { time: "09:30", activity: "មង្គលកាត់សក់ អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារពេលព្រឹក", date: day1.toISOString() },
        { time: "13:30", activity: "បើកបទមហោរី", date: day1.toISOString() },
        { time: "14:00", activity: "មង្គលក្រុងពាលី សុំទីដីសុំសេចក្តីសុខ", date: day1.toISOString() },
        { time: "15:00", activity: "មង្គលចម្រើនព្រះបរិត្ត", date: day1.toISOString() },
        { time: "16:00", activity: "មង្គលសែនព្រេនជូនមាតាបិតាគូស្វាមីភរិយា អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារពេលល្ងាច", date: day1.toISOString() },
        { time: "19:00", activity: "មង្គលបុកល័ក្ខធ្វើធ្មេញ", date: day1.toISOString() },
        // Day 2
        { time: "06:30", activity: "ជួបជុំភ្ញៀវកិត្តិយសរៀបចំពិធីហែរជំនូន", date: day2.toISOString() },
        { time: "07:00", activity: "ពិធីហែរជំនូនកំណត់ចូលរោងជ័យ", date: day2.toISOString() },
        { time: "08:45", activity: "មង្គលកាត់សក់បង្កក់សិរី", date: day2.toISOString() },
        { time: "10:25", activity: "មង្គលសំពះផ្ទឹម បើកវាំងននព្រះ បង្វិលពពិល ចងដៃគូស្វាមីភរិយា ព្រះថោងតោងស្បៃ", date: day2.toISOString() },
        { time: "17:00", activity: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយសពិសាភោជនាហារពេលល្ងាចនៅគេហដ្ឋានខាងស្រីស្ថិតនៅផ្លូវជាតិលេខ៦A", date: day2.toISOString() }
    ];

    const englishSchedule = [
        // Day 1
        { time: "08:30", activity: "Krong Peali Ceremony", date: day1.toISOString() },
        { time: "09:30", activity: "Hair Cutting Ceremony & Breakfast", date: day1.toISOString() },
        { time: "13:30", activity: "Traditional Music", date: day1.toISOString() },
        { time: "14:00", activity: "Blessing Ceremony", date: day1.toISOString() },
        { time: "15:00", activity: "Monks Chanting", date: day1.toISOString() },
        { time: "16:00", activity: "Respect to Parents & Dinner", date: day1.toISOString() },
        { time: "19:00", activity: "Teeth Preparation Ceremony", date: day1.toISOString() },
        // Day 2
        { time: "06:30", activity: "Guests Arrival for Dowry Parade", date: day2.toISOString() },
        { time: "07:00", activity: "Dowry Parade", date: day2.toISOString() },
        { time: "08:45", activity: "Hair Cutting Ceremony", date: day2.toISOString() },
        { time: "10:25", activity: "Pairing Ceremony & Ring Exchange", date: day2.toISOString() },
        { time: "17:00", activity: "Wedding Reception at Bride's Residence, National Road 6A", date: day2.toISOString() }
    ];

    return (
        <InvitationViewWithTemplates
            eventTitle={isKhmer ? "អញ្ជើញចូលរួមពិធីមង្គលការ" : "Sample Wedding Event"}
            eventDate={date}
            location={isKhmer ? "សណ្ឋាគារ ហ្គ្រេនភ្នំពេញ" : "Grand Phnom Penh Hotel"}
            eventType="wedding"
            logoUrl={appLogo}
            templateId={templateId}
            backgroundVideoUrl={templateData?.backgroundVideoUrl}
            introVideoUrl={templateData?.introVideoUrl}
            transitionVideoUrl={templateData?.transitionVideoUrl}
            effectLayerUrl={templateData?.effectLayerUrl}
            effectLayerOpacity={templateData?.effectLayerOpacity}
            effectLayerBlendMode={templateData?.effectLayerBlendMode}
            musicUrl={templateData?.musicUrl}
            introFrameUrl={templateData?.introFrameUrl}
            transitionFrameUrl={templateData?.transitionFrameUrl}
            detailFrameUrl={templateData?.detailFrameUrl}
            schedule={JSON.stringify(isKhmer ? khmerSchedule : englishSchedule)}
            invitationMessage={isKhmer
                ? "សម្តេច ទ្រង់ ឯកឧត្តម អ្នកឧកញ៉ា ឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាងកញ្ញា អញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល ក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស-កូនស្រី របស់យើងខ្ញុំ"
                : "We can't wait to celebrate our special day with you!"
            }
            groomFatherName={isKhmer ? "លោក តារា" : "Mr. Doe"}
            groomMotherName={isKhmer ? "លោកស្រី ស្រីពៅ" : "Mrs. Doe"}
            brideFatherName={isKhmer ? "លោក រិទ្ធី" : "Mr. Smith"}
            brideMotherName={isKhmer ? "លោកស្រី ម៉ានែត" : "Mrs. Smith"}
            groomFirstName={isKhmer ? "សុខា" : "John"}
            groomLastName={isKhmer ? "សុខ" : "Doe"}
            brideFirstName={isKhmer ? "ស្រីនាថ" : "Jane"}
            brideLastName={isKhmer ? "ស៊ឹម" : "Smith"}
            venueDetails={isKhmer ? "សណ្ឋាគារ ហ្គ្រេនភ្នំពេញ, សាលប្រជុំធំ, ជាន់ទី ១" : "Grand Phnom Penh Hotel, Grand Ballroom, 1st Floor"}
            mapUrl="https://maps.app.goo.gl/placeholder"
            guestName={isKhmer ? "ភ្ញៀវកិត្តិយស" : "Sample Guest"}
            guestStatus="PENDING"
            onRsvp={async () => {
                alert(isKhmer ? "នេះគឺជាការមើលជាមុន។ ការបញ្ជាក់ភារកិច្ចត្រូវបានបិទ។" : "This is a demo preview. RSVP is disabled.");
            }}
            albumPhotos={[
                { id: "1", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=2069&ixlib=rb-4.0.3" },
                { id: "2", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" },
                { id: "3", imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3" },
                { id: "4", imageUrl: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" }
            ]}
        />
    );
}
