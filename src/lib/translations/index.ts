import { en } from './en';
import { kh } from './kh';

export const translations = {
    en,
    kh,
};

export type Language = 'en' | 'kh';
export type TranslationKey = keyof typeof en; // Top level keys
