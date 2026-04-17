'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// This component handles the case where the app was COLD STARTED
// via a deep link (e.g., the app was fully closed when the OAuth redirect fired).
// For WARM starts (app already open), the Login page handles it inline.
export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleColdStartUrl = async (urlStr: string) => {
      if (!urlStr || !urlStr.startsWith('com.finlit.ai://')) return;

      try {
        const processedUrl = urlStr.replace('com.finlit.ai://', 'https://placeholder.com/');
        const url = new URL(processedUrl);
        const hash = url.hash.substring(1);
        const search = url.search.substring(1);
        const params = new URLSearchParams(hash || search);

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            router.replace('/dashboard');
          }
        }
      } catch (e) {
        console.error('AuthHandler: Error parsing cold-start URL', e);
      }
    };

    // Only run this on native platforms
    const setupColdStartHandler = async () => {
      if (typeof window === 'undefined') return;
      const { Capacitor } = await import('@capacitor/core');
      if (!Capacitor.isNativePlatform()) return;

      const { App } = await import('@capacitor/app');
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        handleColdStartUrl(launchUrl.url);
      }
    };

    setupColdStartHandler();
  }, [router]);

  return null;
}
