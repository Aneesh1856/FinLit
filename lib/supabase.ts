import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
