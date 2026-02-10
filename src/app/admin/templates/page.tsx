import { prisma } from '@/lib/prisma';
import { LayoutTemplate, Layout, Edit, CheckCircle, XCircle, Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
    const templates = await prisma.template.findMany();

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Invitation Templates</h1>
                <p className="text-gray-500 dark:text-gray-400">Control available designs for your clients.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {templates.map((template: any) => (
                    <div key={template.id} className="group bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#222] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#1a1a1a] dark:to-[#222] relative flex items-center justify-center">
                            {/* Placeholder Preview */}
                            <LayoutTemplate size={48} className="text-gray-300 dark:text-gray-700" />
                            {template.previewUrl && (
                                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${template.previewUrl})` }}></div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {template.category}
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{template.name}</h3>
                                {template.isActive ? (
                                    <span className="text-green-500 flex items-center gap-1 text-xs font-medium uppercase tracking-wide"><CheckCircle size={14} /> Active</span>
                                ) : (
                                    <span className="text-red-500 flex items-center gap-1 text-xs font-medium uppercase tracking-wide"><XCircle size={14} /> Inactive</span>
                                )}
                            </div>

                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                {template.description || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#222] pt-4 mt-auto">
                                <span className="text-xs font-mono text-gray-400">{template.codeKey}</span>
                                <Link
                                    href={`/admin/templates/${template.id}/edit`}
                                    className="text-yellow-600 hover:text-yellow-500 text-sm font-medium"
                                >
                                    Edit Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
