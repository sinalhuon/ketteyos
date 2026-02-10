'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface LogoUploadProps {
    currentLogo: string | null;
    onUploadSuccess: (logoUrl: string) => void;
    onRemoveSuccess: () => void;
}

export function LogoUpload({ currentLogo, onUploadSuccess, onRemoveSuccess }: LogoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload JPG, PNG, SVG, or WebP.');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('File too large. Maximum size is 2MB.');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/settings/logo', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onUploadSuccess(data.logoUrl);
            alert('Logo uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            alert(error instanceof Error ? error.message : 'Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm('Are you sure you want to remove the logo?')) return;

        setUploading(true);

        try {
            const response = await fetch('/api/settings/logo', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove logo');
            }

            onRemoveSuccess();
            alert('Logo removed successfully!');
        } catch (error) {
            console.error('Remove error:', error);
            alert(error instanceof Error ? error.message : 'Failed to remove logo');
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
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-4">
            {/* Current Logo Preview */}
            {currentLogo && (
                <div className="relative w-32 h-32 mx-auto">
                    <img
                        src={currentLogo}
                        alt="App Logo"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-700"
                    />
                    <button
                        onClick={handleRemove}
                        disabled={uploading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-gray-300 dark:border-gray-700'
                    } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                    onChange={handleFileInput}
                    disabled={uploading}
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                        <Upload size={32} className="text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Drag & drop or <span className="text-yellow-600 hover:text-yellow-700">browse</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            JPG, PNG or WebP (max 5MB)
                        </p>
                    </div>
                </label>
            </div>

            {uploading && (
                <div className="text-center text-sm text-gray-500">
                    Uploading...
                </div>
            )}
        </div>
    );
}
