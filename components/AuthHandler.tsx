'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';
import { supabase } from '@/lib/supabase';

export default function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    // Listener for Deep Links (com.finlit.ai://)
    const setupDeepLinkListener = async () => {
      App.addListener('appUrlOpen', async (event: any) => {
        const url = new URL(event.url);
        
        // Supabase returns tokens in the hash (#access_token=...)
        const hash = url.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          console.log('Deep link detected. Setting Supabase session...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!error) {
            router.push('/dashboard');
            // Force a reload to ensure all components see the new session
            window.location.href = '/dashboard';
          } else {
            console.error('Error setting session from deep link:', error.message);
          }
        }
      });
    };

    setupDeepLinkListener();

    return () => {
      // Cleanup listener on unmount
      App.removeAllListeners();
    };
  }, [router]);

  return null;
}
