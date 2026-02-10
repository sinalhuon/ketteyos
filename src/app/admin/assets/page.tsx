import { prisma } from '@/lib/prisma';
import { Music, Image as ImageIcon, Plus, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AssetsPage() {
    const assets = await prisma.globalAsset.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Global Assets</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage background music and default images.</p>
                </div>
                <Link href="/admin/assets/new" className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition">
                    <Plus size={18} /> Add Asset
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset: any) => (
                    <div key={asset.id} className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#222] p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${asset.type === 'MUSIC' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
                                {asset.type === 'MUSIC' ? <Music size={24} /> : <ImageIcon size={24} />}
                            </div>
                            <span className="text-xs font-mono text-gray-400">ID: {asset.id.slice(0, 4)}</span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{asset.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{asset.type}</p>

                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] p-2 rounded truncate">
                            <LinkIcon size={14} />
                            <a href={asset.url} target="_blank" className="hover:text-yellow-500 truncate">{asset.url}</a>
                        </div>
                    </div>
                ))}
            </div>

            {assets.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No assets found in the system.
                </div>
            )}
        </div>
    );
}
