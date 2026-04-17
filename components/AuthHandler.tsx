'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // We only import Capacitor inside useEffect so it never runs on the server
    const initCapacitor = async () => {
      const { App } = await import('@capacitor/app');

      const handleAuthUrl = async (urlStr: string) => {
        try {
          const url = new URL(urlStr);
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
              alert('Login Successful! Redirecting...');
              window.location.href = '/dashboard';
            } else {
              alert('Auth Error: ' + error.message);
            }
          }
        } catch (e) {
          console.error('Error parsing auth URL', e);
        }
      };

      // 1. Handle "Browser Landing" (Website version)
      if (typeof window !== 'undefined') {
        handleAuthUrl(window.location.href);
      }

      // 2. Handle "Native Cold Start"
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        handleAuthUrl(launchUrl.url);
      }

      // 3. Handle "Warm Start"
      App.addListener('appUrlOpen', (event: any) => {
        handleAuthUrl(event.url);
      });
    };

    if (typeof window !== 'undefined') {
      initCapacitor();
    }

    return () => {
      // Cleanup
      const cleanup = async () => {
        const { App } = await import('@capacitor/app');
        App.removeAllListeners();
      };
      cleanup();
    };
  }, [router]);

  return null;
}
