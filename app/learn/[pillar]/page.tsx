'use client';

import Link from 'next/link';
import { getLessonsByPillar, getPillar, PILLARS } from '@/lib/lessons';
import styles from './page.module.css';

export default function LearnPillarPage({ params }: { params: { pillar: string } }) {
  const pillar = getPillar(params.pillar);
  const lessons = getLessonsByPillar(params.pillar);

  if (!pillar) return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2>Pillar not found</h2>
      <Link href="/dashboard" className="cta-button mt-large">← Back to Dashboard</Link>
    </div>
  );

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit AI
        </Link>
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/ai-coach" className="nav-link">AI Coach</Link>
      </nav>

      <div className={styles.pillarOuter}>
        <div className={styles.pillarHero} style={{ ['--pillar-color' as string]: pillar.color }}>
          <Link href="/dashboard" className={styles.backBtn}>← Dashboard</Link>
          <div className={styles.pillarHeroIcon}>{pillar.emoji}</div>
          <h1>{pillar.label}</h1>
          <p>{pillar.desc}</p>
        </div>

        <div className={styles.lessonsGrid}>
          {lessons.map((lesson, i) => (
            <Link key={lesson.id} href={`/learn/${pillar.id}/${lesson.id}`} className={styles.lessonCard}>
              <div className={styles.lessonNum}>Lesson {i + 1}</div>
              <div className={styles.lessonEmoji}>{lesson.emoji}</div>
              <h3 className={styles.lessonTitle}>{lesson.title}</h3>
              <div className={styles.lessonMeta}>
                <span>⏱ {lesson.duration}</span>
                <span>⭐ +{lesson.xp} XP</span>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.otherPillars}>
          <h2>Explore Other Pillars</h2>
          <div className={styles.otherGrid}>
            {PILLARS.filter(p => p.id !== pillar.id).map(p => (
              <Link key={p.id} href={`/learn/${p.id}`} className={styles.otherCard}>
                <span>{p.emoji}</span><span>{p.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
