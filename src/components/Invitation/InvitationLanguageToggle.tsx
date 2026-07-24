'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function InvitationLanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed top-4 right-4 z-[120]">
            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/35 p-1 shadow-xl backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80">
                    <Languages size={16} />
                </div>
                <button
                    type="button"
                    onClick={() => setLanguage('kh')}
                    className={`rounded-full px-3 py-2 text-xs font-bold transition-all ${
                        language === 'kh'
                            ? 'bg-white text-[#1b2347] shadow-md'
                            : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-pressed={language === 'kh'}
                >
                    KH
                </button>
                <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`rounded-full px-3 py-2 text-xs font-bold transition-all ${
                        language === 'en'
                            ? 'bg-white text-[#1b2347] shadow-md'
                            : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-pressed={language === 'en'}
                >
                    EN
                </button>
            </div>
        </div>
    );
}
