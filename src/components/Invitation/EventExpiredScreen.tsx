'use client';

import React from 'react';
import { Lock, Clock, CalendarX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EventExpiredScreenProps {
    title?: string;
    contactPhone?: string;
}

export default function EventExpiredScreen({ title, contactPhone }: EventExpiredScreenProps) {
    return (
        <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl">
                {/* Lock Icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <CalendarX size={40} />
                </div>

                {/* Status Badges */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                    <Clock size={14} />
                    <span>កម្មវិធីត្រូវបានបញ្ចប់ ឬផ្អាកដំណើការ</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {title || 'លិខិតអញ្ជើញផុតកំណត់'}
                    </h1>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">
                        សូមអភ័យទោស! លិខិតអញ្ជើញសម្រាប់កម្មវិធីនេះ ត្រូវបានបញ្ចប់ ឬផ្អាកដំណើការជាបណ្ដោះអាសន្ន។
                    </p>
                </div>

                {/* Additional Info Box */}
                {contactPhone && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1">
                        <span className="text-gray-400 font-medium">ទំនាក់ទំនងព័ត៌មានបន្ថែម៖</span>
                        <p className="text-sm font-bold text-amber-400">{contactPhone}</p>
                    </div>
                )}

                {/* Back to Home Button */}
                <div className="pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-105"
                    >
                        <ArrowLeft size={16} />
                        <span>ត្រឡប់ទៅទំព័រដើម</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
