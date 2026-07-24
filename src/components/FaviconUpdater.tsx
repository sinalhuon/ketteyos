'use client';

import { useEffect } from 'react';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';

export default function FaviconUpdater() {
    const { settings } = useAdminSettings();

    useEffect(() => {
        if (settings.favicon) {
            // Update favicon
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.favicon;
        }
    }, [settings.favicon]);

    return null;
}
