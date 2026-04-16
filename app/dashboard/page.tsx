'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LESSONS, PILLARS } from '@/lib/lessons';
import styles from './page.module.css';

const BADGES = [
  { id: 'first_lesson', emoji: '🌱', title: 'First Step', desc: 'Complete your first lesson', threshold: 1 },
  { id: 'xp_100', emoji: '⭐', title: 'XP Rookie', desc: 'Earn 100 XP', threshold: 100 },
  { id: 'xp_500', emoji: '🔥', title: 'XP Hunter', desc: 'Earn 500 XP', threshold: 500 },
  { id: 'streak_3', emoji: '🗓️', title: '3-Day Streak', desc: 'Learn 3 days in a row', threshold: 3 },
  { id: 'xp_1000', emoji: '💎', title: 'Diamond Learner', desc: 'Earn 1000 XP', threshold: 1000 },
  { id: 'all_pillars', emoji: '🏛️', title: 'Pillar Scholar', desc: 'Start all 5 pillars', threshold: 5 },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [xpAnim, setXpAnim] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      const { data: prog } = await supabase.from('user_progress').select('*').eq('user_id', user.id);

      setProfile(prof || { xp: 0, streak: 0, level: 1, persona_title: '⚡ The UPI Ninja', persona: 'upiNinja' });
      setProgress(prog || []);
      setLoading(false);

      setTimeout(() => {
        setXpAnim(prof?.xp || 0);
      }, 300);
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

  // Recommended next lesson
  const completedIds = new Set(progress.filter(p => p.completed).map((p: any) => p.lesson_id));
  const nextLesson = LESSONS.find(l => !completedIds.has(l.id));

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className="loadingSpinner" style={{ width: 60, height: 60, border: '5px solid var(--blue-light)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: 20, color: 'var(--text-muted)', fontWeight: 700 }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit AI
        </Link>
        <Link href="/learn/income" className="nav-link">Learn</Link>
        <Link href="/ai-coach" className="nav-link">AI Coach</Link>
        <Link href="/profile" className="nav-link">Profile</Link>
        <button className="nav-link cta" onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}>Sign Out</button>
      </nav>

      <div className={styles.dashOuter}>
        {/* ── HEADER ROW ── */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.greeting}>Good morning! 👋</h1>
            <p className={styles.personaLabel}>{profile?.persona_title || '⚡ The UPI Ninja'}</p>
          </div>
          <div className={styles.statsRow}>
            <div className="streak-badge">🔥 {streak} day streak</div>
            <div className="level-ring">L{level}</div>
          </div>
        </div>

        {/* ── XP BAR ── */}
        <div className={styles.xpCard}>
          <div className={styles.xpTop}>
            <span className={styles.xpLabel}>⭐ {xp} XP</span>
            <span className={styles.xpNext}>{xpForNext - (xp % xpForNext)} XP to Level {level + 1}</span>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* ── NEXT LESSON CARD ── */}
        {nextLesson && (
          <div className={styles.nextLessonCard}>
            <div className={styles.nextLessonBadge}>📚 UP NEXT</div>
            <div className={styles.nextLessonContent}>
              <div className={styles.nextLessonIcon}>{nextLesson.emoji}</div>
              <div>
                <h3 className={styles.nextLessonTitle}>{nextLesson.title}</h3>
                <p className={styles.nextLessonMeta}>
                  {PILLARS.find(p => p.id === nextLesson.pillar)?.label} •
                  {nextLesson.duration} • +{nextLesson.xp} XP
                </p>
              </div>
            </div>
            <Link href={`/learn/${nextLesson.pillar}/${nextLesson.id}`} className="cta-button">
              Start Lesson →
            </Link>
          </div>
        )}

        {/* ── PILLARS GRID ── */}
        <h2 className={styles.sectionTitle}>📖 Your Learning Pillars</h2>
        <div className={styles.pillarsGrid}>
          {PILLARS.map(pillar => {
            const pillarLessons = LESSONS.filter(l => l.pillar === pillar.id);
            const done = progress.filter(p => p.pillar === pillar.id && p.completed).length;
            const pct = (done / pillarLessons.length) * 100;
            return (
              <Link key={pillar.id} href={`/learn/${pillar.id}`} className={styles.pillarCard} style={{ ['--pillar-color' as string]: pillar.color }}>
                <div className={styles.pillarTop}>
                  <span className={styles.pillarEmoji}>{pillar.emoji}</span>
                  <span className={styles.pillarDone}>{done}/{pillarLessons.length}</span>
                </div>
                <h3 className={styles.pillarName}>{pillar.label}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
                <div className={styles.pillarProgress}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pillar.color, borderRadius: 999, transition: 'width 1s ease' }} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── BADGES ── */}
        <h2 className={styles.sectionTitle}>🏅 Your Badges</h2>
        <div className={styles.badgesGrid}>
          {BADGES.map(b => {
            const earned = earnedBadges.find(e => e.id === b.id);
            return (
              <div key={b.id} className={`${styles.badge} ${earned ? styles.badgeEarned : styles.badgeLocked}`}>
                <div className={styles.badgeEmoji}>{earned ? b.emoji : '🔒'}</div>
                <div className={styles.badgeTitle}>{b.title}</div>
                <div className={styles.badgeDesc}>{b.desc}</div>
              </div>
            );
          })}
        </div>

        {/* ── AI COACH PROMO ── */}
        <div className={styles.aiPromo}>
          <div className={styles.aiPromoContent}>
            <div style={{ fontSize: '3rem' }}>🤖</div>
            <div>
              <h3>Chat with your AI Finance Coach</h3>
              <p>Ask anything about budgeting, SIPs, taxes, or run financial simulations.</p>
            </div>
          </div>
          <Link href="/ai-coach" className="cta-button accent-mode">Talk to AI Coach →</Link>
        </div>
      </div>
    </>
  );
}
