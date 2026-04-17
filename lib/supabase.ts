import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (used in 'use client' components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (used in API routes and Server Actions)
export function createClient(request?: NextRequest, response?: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request?.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request?.cookies.set({ name, value, ...options });
        response?.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request?.cookies.set({ name, value: '', ...options });
        response?.cookies.set({ name, value: '', ...options });
      },
    },
  });
}

export type Profile = {
  id: string;
  user_id: string;
  persona: string;
  persona_title: string;
  xp: number;
  streak: number;
  level: number;
  last_active: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  pillar: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  completed_at: string;
};
