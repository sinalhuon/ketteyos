'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, storageKey = 'language' }: { children: ReactNode, storageKey?: string }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window === 'undefined') return 'kh';
        const savedLang = localStorage.getItem(storageKey) as Language | null;
        return savedLang === 'en' || savedLang === 'kh' ? savedLang : 'kh';
    });

    useEffect(() => {
        document.documentElement.lang = language === 'kh' ? 'km' : 'en';
        document.documentElement.classList.toggle('khmer-language', language === 'kh');
    }, [language]);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem(storageKey, lang);
    };

    const t = (path: string) => {
        const keys = path.split('.');
        let current: unknown = translations[language];

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = (current as Record<string, unknown>)[key];
            } else {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return path;
            }
        }
        return current as string;
    };

    // We must provide the context even during SSR/hydration to prevent errors in consumers
    // The mounted check was previously returning children WITHOUT the provider, causing the build error.

    // To handle hydration mismatch, we can rely on the default language 'kh' during SSR,
    // and the effect will update it on the client.


    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
