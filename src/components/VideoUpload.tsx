'use client';

import { useState, useRef } from 'react';
import { Upload, X, Film, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface VideoUploadProps {
    currentVideoUrl?: string | null;
    onUploadSuccess: (videoUrl: string) => void;
    onRemoveSuccess: () => void;
    label?: string;
}

export default function VideoUpload({ currentVideoUrl, onUploadSuccess, onRemoveSuccess, label = "Upload Video" }: VideoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputType, setInputType] = useState<'upload' | 'url'>('upload');
    const [manualUrl, setManualUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            setError('Please upload a valid video file (MP4, MOV, etc.)');
            return;
        }

        // Validate file size (e.g., max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setError('Video size must be less than 50MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'templates/videos'); // Organize in subfolder

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadSuccess(data.url);
        } catch (err) {
            console.error(err);
            setError('Failed to upload video. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualUrl) return;
        onUploadSuccess(manualUrl);
        setManualUrl('');
    };

    const handleRemove = async () => {
        if (!currentVideoUrl) return;

        // In a real app, we might want to delete the file from the server too
        // For now, we just remove the reference from the parent
        onRemoveSuccess();
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {!currentVideoUrl && (
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setInputType('upload')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition ${inputType === 'upload'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => setInputType('url')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition ${inputType === 'url'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Link
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                    <X size={16} /> {error}
                </div>
            )}

            {!currentVideoUrl ? (
                inputType === 'upload' ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                        border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8
                        flex flex-col items-center justify-center cursor-pointer transition-all
                        hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10
                        ${uploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={32} className="text-yellow-600 animate-spin mb-3" />
                                <p className="text-sm font-medium text-gray-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 mb-3">
                                    <Upload size={24} />
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload video</p>
                                <p className="text-xs text-gray-500 mt-1">MP4, MOV up to 50MB</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="Enter video URL (e.g. from ImageKit)"
                                value={manualUrl}
                                onChange={(e) => setManualUrl(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#0a0a0a] text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleUrlSubmit}
                                disabled={!manualUrl}
                                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
                            >
                                Add
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Paste a direct link to a video file (.mp4, .mov)
                        </p>
                    </div>
                )
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black group">
                    <video
                        src={currentVideoUrl}
                        className="w-full h-48 object-cover"
                        controls
                        playsInline
                        preload="metadata"
                    />

                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
                            title="Remove video"
                        >
                            <Trash2Icon size={16} />
                        </button>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm truncate max-w-[200px]">
                        {currentVideoUrl.split('/').pop()}
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className="hidden"
            />
        </div>
    );
}

function Trash2Icon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 6h18" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    );
}
