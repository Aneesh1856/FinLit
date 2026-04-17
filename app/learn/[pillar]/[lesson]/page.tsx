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
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'bonus-quiz' | 'complete'>('reading');
  const [contentPage, setContentPage] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [toast, setToast] = useState('');
  
  // Bonus Quiz States
  const [bonusQuestion, setBonusQuestion] = useState<any>(null);
  const [isGeneratingBonus, setIsGeneratingBonus] = useState(false);
  const [bonusSelected, setBonusSelected] = useState<number | null>(null);
  const [bonusCorrect, setBonusCorrect] = useState(false);
  const [baseScore, setBaseScore] = useState(0);

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
        const currentScore = correct ? score + 1 : score;
        setBaseScore(currentScore);
        startBonusQuiz();
      }
    }, 2200);
  };

  const startBonusQuiz = async () => {
    setPhase('bonus-quiz');
    setIsGeneratingBonus(true);
    try {
      const res = await fetch(`/api/quiz?pillar=${params.pillar}&lessonId=${params.lesson}`);
      const data = await res.json();
      if (data && data.question) {
        setBonusQuestion(data);
      } else {
        // Fallback if API fails
        finishLesson(baseScore, false);
      }
    } catch {
      finishLesson(baseScore, false);
    } finally {
      setIsGeneratingBonus(false);
    }
  };

  const handleBonusAnswer = (idx: number) => {
    if (bonusSelected !== null) return;
    setBonusSelected(idx);
    setShowExplanation(true);
    const correct = idx === bonusQuestion.correct;
    if (correct) setBonusCorrect(true);
    
    setTimeout(() => {
      setShowExplanation(false);
      finishLesson(baseScore, correct);
    }, 3500); // Give them longer to read the explanation since it applies live data
  };

  const finishLesson = async (standardScore: number, didBonusCorrect: boolean) => {
    const baseXp = Math.round(lesson!.xp * (standardScore / lesson!.quiz.length));
    const bonusXp = didBonusCorrect ? 25 : 0;
    const finalXp = baseXp + bonusXp;
    
    setScore(standardScore + (didBonusCorrect ? 1 : 0)); // Update total score for UI
    setXpGained(finalXp);
    setPhase('complete');

    // Save to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        pillar: params.pillar,
        lesson_id: params.lesson,
        completed: true,
        score: standardScore + (didBonusCorrect ? 1 : 0),
        completed_at: new Date().toISOString(),
      });
      // Update profile XP
      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (prof) {
        const newXp = prof.xp + finalXp;
        const newLevel = Math.floor(newXp / 200) + 1;
        const today = new Date().toISOString().split('T')[0];
        const lastActive = prof.last_active?.split('T')[0];
        const newStreak = lastActive === today ? prof.streak : (prof.streak || 0) + 1;
        await supabase.from('profiles').update({ xp: newXp, level: newLevel, streak: newStreak, last_active: new Date().toISOString() }).eq('user_id', user.id);
      }
    }
    showToast(`+${finalXp} XP earned! 🎉`);
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
          FinLit
        </Link>
        <Link href={`/learn/${params.pillar}`} className="nav-link">← {pillar.label}</Link>
      </nav>

      <div className={styles.lessonOuter}>
        {/* ── PROGRESS BAR ── */}
        <div className={styles.lessonProgress}>
          <div className={styles.lessonProgressBar} style={{
            width: phase === 'reading'
              ? `${(contentPage / allContent.length) * 40}%`
              : phase === 'quiz'
              ? `${40 + (quizIndex / lesson.quiz.length) * 40}%`
              : phase === 'bonus-quiz'
              ? '90%'
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

        {/* ── BONUS QUIZ PHASE ── */}
        {phase === 'bonus-quiz' && (
          <div className={styles.quizCard}>
            {isGeneratingBonus ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="loadingSpinner" style={{ width: 60, height: 60, border: '5px solid var(--blue-light)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                <h3 style={{ color: 'var(--primary-color)' }}>Generating Advanced AI Bonus...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Analyzing live market data & news to test your knowledge.</p>
              </div>
            ) : bonusQuestion ? (
              <>
                <div className={styles.quizHeader}>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>⭐ Real-Time Bonus Question</span>
                  <span className={styles.quizScore}>+25 XP</span>
                </div>
                <h2 className={styles.quizQuestion} style={{ fontSize: '1.25rem' }}>{bonusQuestion.question}</h2>
                <div className={styles.quizOptions}>
                  {bonusQuestion.options.map((opt: string, i: number) => {
                    let cls = styles.quizOpt;
                    if (bonusSelected !== null) {
                      if (i === bonusQuestion.correct) cls = `${styles.quizOpt} ${styles.optCorrect}`;
                      else if (i === bonusSelected && bonusSelected !== bonusQuestion.correct) cls = `${styles.quizOpt} ${styles.optWrong}`;
                      else cls = `${styles.quizOpt} ${styles.optDimmed}`;
                    }
                    return (
                      <button key={i} className={cls} onClick={() => handleBonusAnswer(i)} disabled={bonusSelected !== null}>
                        <span className={styles.quizOptLetter}>{['A', 'B', 'C', 'D'][i]}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {showExplanation && (
                  <div className={`${styles.explanation} ${bonusSelected === bonusQuestion.correct ? styles.explanationGood : styles.explanationBad}`}>
                    <strong>{bonusSelected === bonusQuestion.correct ? '✅ Outstanding! Bonus Earned!' : '❌ Detailed Explanation'}</strong>
                    <p style={{ marginTop: '8px' }}>{bonusQuestion.explanation}</p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* ── COMPLETE PHASE ── */}
        {phase === 'complete' && (
          <div className={styles.completeCard}>
            <div className={styles.completeEmoji}>🎉</div>
            <h2 className={styles.completeTitle}>Lesson Complete!</h2>
            <div className={styles.xpEarned}>+{xpGained} XP earned</div>
            <p className={styles.completeSub}>You scored <strong>{score}</strong> total points (including Bonus!).</p>
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
