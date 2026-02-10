'use client';

import { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import Image from 'next/image';

interface ProfileImageUploadProps {
    currentImage?: string | null;
    onUploadSuccess: (imageUrl: string) => void;
    onRemoveSuccess: () => void;
}

export function ProfileImageUpload({ currentImage, onUploadSuccess, onRemoveSuccess }: ProfileImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (file: File) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only JPG, PNG, and WebP are allowed.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 5MB.');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/profile/image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onUploadSuccess(data.imageUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload image');
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove your profile image?')) {
            return;
        }

        setUploading(true);
        try {
            const response = await fetch('/api/profile/image', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove image');
            }

            setPreview(null);
            onRemoveSuccess();
        } catch (error) {
            console.error('Remove error:', error);
            alert(error instanceof Error ? error.message : 'Failed to remove image');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Image Preview */}
            <div className="relative">
                {preview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                        <Image
                            src={preview}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white border-4 border-gray-200 dark:border-gray-700">
                        <User size={48} />
                    </div>
                )}

                {/* Remove Button */}
                {preview && (
                    <button
                        onClick={handleRemove}
                        disabled={uploading}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition disabled:opacity-50"
                        title="Remove image"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition ${dragActive
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                />

                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Drag & drop or{' '}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50"
                    >
                        browse
                    </button>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    JPG, PNG or WebP (max 5MB)
                </p>

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center rounded-lg">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Uploading...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
