'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLessonById, getPillar, LESSONS } from '@/lib/lessons';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function LessonPage({ params }: { params: { pillar: string; lesson: string } }) {
  const router = useRouter();
  const lesson = getLessonById(params.lesson);
  const pillar = getPillar(params.pillar);
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'complete'>('reading');
  const [contentPage, setContentPage] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    const correct = idx === lesson!.quiz[quizIndex].correct;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      setShowExplanation(false);
      setSelected(null);
      if (quizIndex + 1 < lesson!.quiz.length) {
        setQuizIndex(q => q + 1);
      } else {
        finishLesson(correct ? score + 1 : score);
      }
    }, 2200);
  };

  const finishLesson = async (finalScore: number) => {
    const xp = Math.round(lesson!.xp * (finalScore / lesson!.quiz.length));
    setXpGained(xp);
    setPhase('complete');

    // Save to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        pillar: params.pillar,
        lesson_id: params.lesson,
        completed: true,
        score: finalScore,
        completed_at: new Date().toISOString(),
      });
      // Update profile XP
      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (prof) {
        const newXp = prof.xp + xp;
        const newLevel = Math.floor(newXp / 200) + 1;
        const today = new Date().toISOString().split('T')[0];
        const lastActive = prof.last_active?.split('T')[0];
        const newStreak = lastActive === today ? prof.streak : (prof.streak || 0) + 1;
        await supabase.from('profiles').update({ xp: newXp, level: newLevel, streak: newStreak, last_active: new Date().toISOString() }).eq('user_id', user.id);
      }
    }
    showToast(`+${xp} XP earned! 🎉`);
  };

  if (!lesson || !pillar) {
    return <div style={{ textAlign: 'center', padding: '80px' }}><h2>Lesson not found</h2><Link href="/dashboard" className="cta-button mt-large">← Back</Link></div>;
  }

  const allContent = lesson.content;
  const q = phase === 'quiz' ? lesson.quiz[quizIndex] : null;

  // Find next lesson
  const allLessons = LESSONS.filter(l => l.pillar === params.pillar);
  const currentIdx = allLessons.findIndex(l => l.id === params.lesson);
  const nextLesson = allLessons[currentIdx + 1];

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit AI
        </Link>
        <Link href={`/learn/${params.pillar}`} className="nav-link">← {pillar.label}</Link>
      </nav>

      <div className={styles.lessonOuter}>
        {/* ── PROGRESS BAR ── */}
        <div className={styles.lessonProgress}>
          <div className={styles.lessonProgressBar} style={{
            width: phase === 'reading'
              ? `${(contentPage / allContent.length) * 50}%`
              : phase === 'quiz'
              ? `${50 + (quizIndex / lesson.quiz.length) * 50}%`
              : '100%'
          }} />
        </div>

        <div className={styles.lessonHeader}>
          <span className={styles.pillarTag} style={{ color: pillar.color }}>{pillar.emoji} {pillar.label}</span>
          <div className={styles.xpTag}>⭐ +{lesson.xp} XP</div>
        </div>

        {/* ── READING PHASE ── */}
        {phase === 'reading' && (
          <div className={styles.contentCard}>
            <div className={styles.contentEmoji}>{lesson.emoji}</div>
            <h1 className={styles.lessonTitle}>{lesson.title}</h1>
            <div className={styles.contentBody}>
              {allContent[contentPage].split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className={styles.contentH2}>{line.replace('## ', '')}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className={styles.contentH1}>{line.replace('# ', '')}</h1>;
                if (line.startsWith('> ')) return <blockquote key={i} className={styles.contentQuote}>{line.replace('> ', '')}</blockquote>;
                if (line.startsWith('✅ ')) return <p key={i} className={styles.contentGood}>{line}</p>;
                if (line.startsWith('❌ ')) return <p key={i} className={styles.contentBad}>{line}</p>;
                if (line.startsWith('**')) {
                  return <p key={i} className={styles.contentBold} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />;
                }
                if (line === '') return <br key={i} />;
                return <p key={i} className={styles.contentP} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />;
              })}
            </div>
            <div className={styles.contentNav}>
              {contentPage > 0 && (
                <button className="cta-button outline-mode" onClick={() => setContentPage(p => p - 1)}>← Previous</button>
              )}
              <span className={styles.pageIndicator}>{contentPage + 1} / {allContent.length}</span>
              {contentPage < allContent.length - 1 ? (
                <button className="cta-button" onClick={() => setContentPage(p => p + 1)}>Next →</button>
              ) : (
                <button className="cta-button accent-mode" onClick={() => setPhase('quiz')}>Take Quiz →</button>
              )}
            </div>
          </div>
        )}

        {/* ── QUIZ PHASE ── */}
        {phase === 'quiz' && q && (
          <div className={styles.quizCard}>
            <div className={styles.quizHeader}>
              <span>Question {quizIndex + 1} of {lesson.quiz.length}</span>
              <span className={styles.quizScore}>Score: {score}/{quizIndex}</span>
            </div>
            <h2 className={styles.quizQuestion}>{q.question}</h2>
            <div className={styles.quizOptions}>
              {q.options.map((opt, i) => {
                let cls = styles.quizOpt;
                if (selected !== null) {
                  if (i === q.correct) cls = `${styles.quizOpt} ${styles.optCorrect}`;
                  else if (i === selected && selected !== q.correct) cls = `${styles.quizOpt} ${styles.optWrong}`;
                  else cls = `${styles.quizOpt} ${styles.optDimmed}`;
                }
                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
                    <span className={styles.quizOptLetter}>{['A', 'B', 'C', 'D'][i]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {showExplanation && (
              <div className={`${styles.explanation} ${selected === q.correct ? styles.explanationGood : styles.explanationBad}`}>
                <strong>{selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}</strong>
                <p>{q.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* ── COMPLETE PHASE ── */}
        {phase === 'complete' && (
          <div className={styles.completeCard}>
            <div className={styles.completeEmoji}>🎉</div>
            <h2 className={styles.completeTitle}>Lesson Complete!</h2>
            <div className={styles.xpEarned}>+{xpGained} XP earned</div>
            <p className={styles.completeSub}>You scored <strong>{score}/{lesson.quiz.length}</strong> on the quiz</p>
            <div className={styles.completeActions}>
              {nextLesson && (
                <Link href={`/learn/${params.pillar}/${nextLesson.id}`} className="cta-button">
                  Next Lesson: {nextLesson.title} →
                </Link>
              )}
              <Link href="/dashboard" className="cta-button outline-mode">View Dashboard</Link>
              <Link href="/ai-coach" className="cta-button accent-mode">🤖 Ask AI Coach</Link>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast">⭐ {toast}</div>}
    </>
  );
}
