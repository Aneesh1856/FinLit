'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

const BADGES = [
  { id: 'first_lesson', emoji: '🌱', title: 'First Step', desc: 'Complete your first lesson', threshold: 1 },
  { id: 'xp_100', emoji: '⭐', title: 'XP Rookie', desc: 'Earn 100 XP', threshold: 100 },
  { id: 'xp_500', emoji: '🔥', title: 'XP Hunter', desc: 'Earn 500 XP', threshold: 500 },
  { id: 'streak_3', emoji: '🗓️', title: '3-Day Streak', desc: 'Learn 3 days in a row', threshold: 3 },
  { id: 'xp_1000', emoji: '💎', title: 'Diamond Learner', desc: 'Earn 1000 XP', threshold: 1000 },
  { id: 'all_pillars', emoji: '🏛️', title: 'Pillar Scholar', desc: 'Start all 5 pillars', threshold: 5 },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth/login';
        return;
      }
      setUser(user);

      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      const { data: prog } = await supabase.from('user_progress').select('*').eq('user_id', user.id);

      setProfile(prof || { xp: 0, streak: 0, level: 1, persona_title: '⚡ The UPI Ninja', persona: 'upiNinja' });
      setProgress(prog || []);
      setLoading(false);
    }
    load();
  }, []);

  const xp = profile?.xp ?? 0;
  const streak = profile?.streak ?? 0;
  const level = profile?.level ?? 1;
  const xpForNext = level * 200;
  const xpPct = Math.min((xp % xpForNext) / xpForNext * 100, 100);
  const completedLessons = progress.filter(p => p.completed).length;
  const pillarsStarted = new Set(progress.map((p: any) => p.pillar)).size;

  const earnedBadges = BADGES.filter(b => {
    if (b.id === 'first_lesson') return completedLessons >= 1;
    if (b.id === 'xp_100') return xp >= 100;
    if (b.id === 'xp_500') return xp >= 500;
    if (b.id === 'xp_1000') return xp >= 1000;
    if (b.id === 'streak_3') return streak >= 3;
    if (b.id === 'all_pillars') return pillarsStarted >= 5;
    return false;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner}></div>
        <p>Loading your financial identity...</p>
      </div>
    );
  }

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit AI
        </Link>
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/learn/income" className="nav-link">Learn</Link>
        <Link href="/ai-coach" className="nav-link">AI Coach</Link>
      </nav>

      <div className={styles.profileOuter}>
        {/* ── PROFILE HEADER ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarLarge}>
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.userName}>{user?.user_metadata?.full_name || 'FinLit Explorer'}</h1>
            <p className={styles.userEmail}>{user?.email}</p>
            <div className={styles.personaBadge}>{profile?.persona_title || '⚡ The UPI Ninja'}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        {/* ── STATS GRID ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>⭐</span>
            <div className={styles.statContent}>
              <span className={styles.statVal}>{xp}</span>
              <span className={styles.statLabel}>Total XP</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>🔥</span>
            <div className={styles.statContent}>
              <span className={styles.statVal}>{streak}</span>
              <span className={styles.statLabel}>Day Streak</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>🎓</span>
            <div className={styles.statContent}>
              <span className={styles.statVal}>{completedLessons}</span>
              <span className={styles.statLabel}>Lessons Done</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statEmoji}>🏅</span>
            <div className={styles.statContent}>
              <span className={styles.statVal}>{earnedBadges.length}</span>
              <span className={styles.statLabel}>Badges Earned</span>
            </div>
          </div>
        </div>

        {/* ── LEVEL PROGRESS ── */}
        <div className={styles.levelSection}>
          <div className={styles.levelHeader}>
            <span className={styles.levelText}>Current Level: {level}</span>
            <span className={styles.nextLevelText}>{xpForNext - (xp % xpForNext)} XP to Level {level + 1}</span>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* ── BADGE SHELF ── */}
        <div className={styles.badgeShelf}>
          <h2 className={styles.sectionTitle}>🏅 My Badge Collection</h2>
          <div className={styles.badgesGrid}>
            {BADGES.map((b) => {
              const earned = earnedBadges.find((e) => e.id === b.id);
              return (
                <div key={b.id} className={`${styles.badgeItem} ${earned ? styles.earned : styles.locked}`}>
                  <div className={styles.badgeEmoji}>{earned ? b.emoji : '🔒'}</div>
                  <div className={styles.badgeText}>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                  </div>
                  {earned && <div className={styles.checkMark}>✅</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PILLAR PROGRESS ── */}
        <div className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>🏛️ Learning Journey</h2>
          <div className={styles.pillarProgressList}>
            {['income', 'spending', 'saving', 'investing', 'protection'].map((pillarId) => {
              const done = progress.filter((p) => p.pillar === pillarId && p.completed).length;
              const total = 3; // 3 lessons per pillar
              const pct = (done / total) * 100;
              return (
                <div key={pillarId} className={styles.pillarProgressRow}>
                  <div className={styles.pillarInfo}>
                    <span className={styles.pillarName}>{pillarId.charAt(0).toUpperCase() + pillarId.slice(1)}</span>
                    <span className={styles.pillarCount}>{done}/{total}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
