-- FinLit AI — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ── PROFILES ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade unique not null,
  persona       text default 'upiNinja',
  persona_title text default '⚡ The UPI Ninja',
  xp            integer default 0,
  streak        integer default 0,
  level         integer default 1,
  last_active   timestamptz default now(),
  created_at    timestamptz default now()
);

-- ── USER PROGRESS ─────────────────────────────────────────────────────────────
create table if not exists public.user_progress (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null,
  pillar       text not null,
  lesson_id    text not null,
  completed    boolean default false,
  score        integer default 0,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- ── CHAT SESSIONS ─────────────────────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  messages   jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.chat_sessions enable row level security;

-- Profiles: users can only see/edit their own profile
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = user_id);

-- User progress: users can only access their own progress
create policy "Users can view own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- Chat sessions: users can only access their own chats
create policy "Users can access own chat sessions"
  on public.chat_sessions for all using (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────────────────────
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_progress_user_id on public.user_progress(user_id);
create index if not exists idx_progress_pillar on public.user_progress(pillar);
