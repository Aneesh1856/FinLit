'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    alert('[DEBUG] AuthListener is Active!');
    const handleAuthUrl = async (urlStr: string) => {
      // DEBUG: Show the raw URL on the phone
      console.log('Detected Deep Link:', urlStr);
      
      try {
        // Fix for new URL() not liking custom schemes like com.finlit.ai
        const processedUrl = urlStr.replace('com.finlit.ai://', 'https://auth.callback/');
        const url = new URL(processedUrl);
        
        // Supabase tokens are usually in the #hash
        const hash = url.hash.substring(1);
        const search = url.search.substring(1);
        const params = new URLSearchParams(hash || search);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          alert('Tokens detected! Logging you in...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            alert('Login Successful! Redirecting to Dashboard...');
            window.location.href = '/dashboard';
          } else {
            alert('Supabase Auth Error: ' + error.message);
          }
        }
      } catch (e: any) {
        // Only alert if it looks like an auth URL
        if (urlStr.includes('access_token')) {
          alert('URL Parse Error: ' + e.message + '\nURL: ' + urlStr);
        }
      }
    };

    const setupDeepLinkListener = async () => {
      const { App } = await import('@capacitor/app');

      // 1. Handle Cold Start
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        handleAuthUrl(launchUrl.url);
      }

      // 2. Handle Warm Start
      App.addListener('appUrlOpen', (event: any) => {
        handleAuthUrl(event.url);
      });
    };

    setupDeepLinkListener();

    return () => {
      import('@capacitor/app').then(({ App }) => App.removeAllListeners());
    };
  }, [router]);

  return null;
}
