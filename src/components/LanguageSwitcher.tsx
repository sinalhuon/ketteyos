'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'kh' : 'en')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
            title="Switch Language"
        >
            <span className="text-lg leading-none">
                {language === 'en' ? '🇺🇸' : '🇰🇭'}
            </span>
            <span className="text-sm font-medium uppercase">{language}</span>
        </button>
    );
}
