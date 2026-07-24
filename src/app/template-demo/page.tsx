'use client';

import { useState } from 'react';
import { TemplateEngine, defaultTemplateConfigs, TemplateConfig } from '@/components/Templates';

export default function TemplateDemo() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig>(defaultTemplateConfigs.default);
    const [showForm, setShowForm] = useState(false);

    // Sample event data
    const sampleEventData = {
        guestName: "លោក ស៊ីណាល់ ហួន",
        eventTitle: "Wedding Invitation",
        eventDate: new Date('2024-12-25T10:00:00'),
        location: "Phnom Penh, Cambodia",
        eventType: "wedding",
        musicUrl: "/uploads/music/wedding-music.mp3",
        logoUrl: "/uploads/logo/wedding-logo.png",
        groomFirstName: "Bora",
        groomLastName: "ស៊ីណាល់",
        brideFirstName: "Sophea",
        brideLastName: "ចន្ថ្រា",
        groomFatherName: "លោក ឪពុករបស់កូនប្រុស",
        groomMotherName: "លោកស្រី ម្តាយរបស់កូនប្រុស",
        brideFatherName: "លោក ឪពុករបស់កូនស្រី",
        brideMotherName: "លោកស្រី ម្តាយរបស់កូនស្រី",
        invitationMessage: "សូមគោរពអញ្ជើញជួបជុំក្នុងពិធីអាពាហ៍ពិពាហ៍របស់យើង",
        eventTime: "10:00 AM",
        venueDetails: "Hotel Cambodiana, Phnom Penh",
        mapUrl: "https://maps.google.com/?q=Hotel+Cambodiana",
        albumPhotos: [],
        onRsvp: async (status: 'ACCEPTED' | 'DECLINED') => {
            console.log('RSVP Status:', status);
            alert(`Thank you for your RSVP: ${status}`);
        }
    };

    const handleTemplateChange = (config: TemplateConfig) => {
        setSelectedTemplate(config);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Template Demo</h1>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            {showForm ? 'Hide' : 'Show'} Template Selector
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Template Selector Sidebar */}
                {showForm && (
                    <div className="w-96 bg-white shadow-lg h-screen overflow-y-auto">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold mb-4">Choose Template Style</h2>
                            
                            {/* Quick Template Selection */}
                            <div className="space-y-3 mb-6">
                                {Object.entries(defaultTemplateConfigs).map(([key, config]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedTemplate(config)}
                                        className={`w-full text-left p-3 rounded-lg border transition ${
                                            selectedTemplate.id === config.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="font-medium">{config.name}</div>
                                        <div className="text-sm text-gray-600">{config.description}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-sm font-medium mb-2">Current Selection:</h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium">{selectedTemplate.name}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        Layout: {selectedTemplate.layoutType}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Colors: {selectedTemplate.colorScheme.primary}, {selectedTemplate.colorScheme.secondary}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Area */}
                <div className="flex-1">
                    <div className="bg-white shadow-sm m-4 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Invitation Preview</h2>
                            <div className="text-sm text-gray-600">
                                Template: {selectedTemplate.name}
                            </div>
                        </div>
                        
                        {/* Template Preview */}
                        <div className="border-2 border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                            <TemplateEngine 
                                templateConfig={selectedTemplate}
                                {...sampleEventData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
