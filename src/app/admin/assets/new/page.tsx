'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadAsset } from '@/actions/assets';
import { Upload, ChevronLeft, Loader2, FileAudio, FileVideo, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewAssetPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('MUSIC');

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await uploadAsset(formData);

        if (result?.success) {
            router.push('/admin/assets');
            router.refresh();
        } else {
            alert(result?.error || 'Upload failed');
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link href="/admin/assets" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center mb-6">
                <ChevronLeft size={16} /> Back to Assets
            </Link>

            <div className="bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-200 dark:border-[#222] p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload New Asset</h1>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asset Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Romantic Piano"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asset Type</label>
                        <select
                            name="type"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none text-gray-900 dark:text-white"
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                        >
                            <option value="MUSIC">Music</option>
                            <option value="VIDEO">Video</option>
                            <option value="IMAGE">Image</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File</label>
                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer relative group ${fileName ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222]'}`}>
                            <input
                                name="file"
                                type="file"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                                {fileName ? (
                                    <>
                                        {fileType === 'MUSIC' && <FileAudio size={32} className="text-yellow-600 mb-2" />}
                                        {fileType === 'VIDEO' && <FileVideo size={32} className="text-yellow-600 mb-2" />}
                                        {fileType === 'IMAGE' && <ImageIcon size={32} className="text-yellow-600 mb-2" />}
                                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{fileName}</span>
                                        <span className="text-xs text-green-600 mt-1">Ready to upload</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} className="text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm text-gray-500">Click to upload file</span>
                                        <span className="text-xs text-gray-400 mt-1">Max 50MB</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={18} />}
                        {loading ? 'Uploading...' : 'Upload Asset'}
                    </button>
                </form>
            </div>
        </div>
    );
}
