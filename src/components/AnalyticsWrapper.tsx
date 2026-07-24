'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import GoogleAnalytics from './GoogleAnalytics';

export default function AnalyticsWrapper() {
    const [gaId, setGaId] = useState<string | null>(null);

    useEffect(() => {
        const fetchGaId = async () => {
            try {
                const data = await apiFetch('settings.php');
                if (data && data.success && data.settings.googleAnalyticsId) {
                    setGaId(data.settings.googleAnalyticsId);
                }
            } catch (error) {
                // Silently fail for analytics
            }
        };
        fetchGaId();
    }, []);

    if (!gaId) return null;

    return <GoogleAnalytics gaId={gaId} />;
}
