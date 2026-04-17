'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthUrl = async (urlStr: string) => {
      try {
        const url = new URL(urlStr);
        // Supabase tokens can be in the hash (#) or search (?) params
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
            // Give user feedback on the phone
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

    const setupDeepLinkListener = async () => {
      // Dynamic import to prevent SSR crash
      const { App } = await import('@capacitor/app');

      // 1. Handle "Cold Start" (App was closed when link was clicked)
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        handleAuthUrl(launchUrl.url);
      }

      // 2. Handle "Warm Start" (App was already open)
      App.addListener('appUrlOpen', (event: any) => {
        handleAuthUrl(event.url);
      });
    };

    setupDeepLinkListener();

    return () => {
      // Inline cleanup if App was loaded
      import('@capacitor/app').then(({ App }) => App.removeAllListeners());
    };
  }, [router]);

  return null;
}
