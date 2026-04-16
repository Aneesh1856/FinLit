'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useEffect, useRef } from 'react';

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Scroll reveal
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observerRef.current!.observe(el);
    });

    // Parallax blobs on scroll
    const handleScroll = () => {
      const y = window.scrollY;
      const b1 = document.querySelector<HTMLElement>('.blob-1');
      const b2 = document.querySelector<HTMLElement>('.blob-2');
      if (b1) b1.style.transform = `translateY(${y * -0.25}px)`;
      if (b2) b2.style.transform = `translateY(${y * -0.12}px)`;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* ── NAVIGATION ──────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit AI
        </Link>
        <Link href="/learn" className="nav-link">Learn</Link>
        <Link href="/ai-coach" className="nav-link">AI Coach</Link>
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/auth/login" className="nav-link cta">Sign In</Link>
      </nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className="pill-badge hero-anim hero-anim-1">🎓 FinLit AI Platform</div>
          <h1 className="hero-anim hero-anim-2">
            Master Money.<br />Make Smarter Decisions.<br />
            <span className="primary-text">Every Single Day.</span>
          </h1>
          <p className="subheading hero-anim hero-anim-3">
            A human-centric, AI-powered financial education app for India.<br />
            We replace boring lectures with real-life scenario training.
          </p>
          <div className={`${styles.dualCta} hero-anim hero-anim-4`}>
            <Link href="/onboarding" className="cta-button">🚀 Start Learning Free</Link>
            <Link href="/onboarding" className="cta-button accent-mode">📊 Get Your AI Roadmap</Link>
          </div>
          <p className="small-text hero-anim hero-anim-4">No prior knowledge required. Just 5 minutes a day.</p>
        </div>
        <div className={`${styles.heroImageWrapper} hero-anim hero-anim-3`}>
          <img src="/finlit.jpeg" alt="FinLit AI App Dashboard" className={styles.finlitImg} />
        </div>
      </header>

      {/* ── PROBLEM SECTION ──────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`chart-container scroll-reveal`} style={{ ['--i' as string]: 1 }}>
            <div className="chart-bar chart-bar-1" />
            <div className="chart-bar chart-bar-2" />
            <div className="chart-bar chart-bar-3" />
          </div>
          <div className={`${styles.problemHeader} scroll-reveal`} style={{ ['--i' as string]: 2 }}>
            <h2>Why Most Indians Struggle With Money</h2>
          </div>
          <div className={styles.cardsGrid}>
            {[
              { icon: '📉', title: 'Zero Basics', desc: "We're rarely taught practical wealth-building before we start earning." },
              { icon: '💳', title: 'Credit Traps', desc: 'Easy EMIs & BNPL inevitably lead to silent, compounding debt cycles.' },
              { icon: '🤯', title: 'Jargon Overload', desc: 'Taxes, mutual funds, and SIPs feel intentionally overwhelming.' },
              { icon: '⚠️', title: 'Scam Vulnerability', desc: 'Massive information gaps leave us exposed to quick money traps.' },
            ].map((card, i) => (
              <div key={card.title} className={`${styles.problemCard} scroll-reveal`} style={{ ['--i' as string]: i + 1 }}>
                <div className={styles.iconBullet}>{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className={`${styles.boldStatement} scroll-reveal`}>
            It&apos;s not a lack of intelligence.<br />
            <span className="accent-text">It&apos;s a lack of structured education.</span>
          </h3>
        </div>
      </section>

      {/* ── SMARTER WAY TO LEARN ─────────────────────────── */}
      <section className={`${styles.section} ${styles.glassAlt} scroll-reveal`}>
        <div className={styles.container}>
          <h2>A Smarter Way to Learn</h2>
          <p className="subheading">Bite-sized mechanics combined with AI decision training.</p>
          <div className={styles.appGrid}>
            {[
              { num: '1️⃣', title: 'Learn', desc: 'Daily 3-minute lessons covering a single concept for perfect retention.' },
              { num: '2️⃣', title: 'Apply', desc: 'Practice safely through real-world financial friction scenarios.' },
              { num: '3️⃣', title: 'Improve', desc: 'Gather AI feedback and watch your analytical strength compound.' },
            ].map((item) => (
              <div key={item.title} className={`${styles.appSection} scroll-reveal`}>
                <div className={styles.stepNum}>{item.num}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOCK SCENARIO PHONE ──────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className="scroll-reveal">
            Practice Financial Decisions<br />Without the Real Risk
          </h2>
          <p className="subheading scroll-reveal">
            Face a relevant money situation daily. The AI engine critiques your logic.
          </p>
          <div className="mock-phone scroll-reveal">
            <div className="mock-header">
              FinLit Scenario <span><span className="mock-badge">Level 2</span></span>
            </div>
            <h3 className="mock-question">
              You just got your first salary of ₹30,000. How do you divide it?
            </h3>
            <div className="mock-btn">Spend ₹20k, Save ₹10k</div>
            <div className="mock-btn selected">50/30/20 Budgeting Rule</div>
            <div className="mock-btn">Invest heavily, ignore emergency fund</div>
            <div className="mock-feedback">
              <span>🤖 AI Engine Evaluation</span><br /><br />
              Smart choice! The 50/30/20 rule secures your needs, wants, and an emergency fund before investing.
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 PILLARS ────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.pillarsSection}`}>
        <div className={styles.container}>
          <h2 className="scroll-reveal">5 Pillars of Financial Mastery</h2>
          <p className="subheading scroll-reveal">Complete curriculum from basics to advanced — all India-specific.</p>
          <div className={styles.pillarsGrid}>
            {[
              { icon: '💼', title: 'Income', desc: 'Salary, freelancing, side income, taxes', color: '#2A5DFF' },
              { icon: '🛒', title: 'Spending', desc: 'Budgeting, credit cards, EMI, UPI', color: '#FF5C00' },
              { icon: '🏦', title: 'Saving', desc: 'Emergency funds, FD/RD, PPF, goals', color: '#10B981' },
              { icon: '📈', title: 'Investing', desc: 'SIPs, stocks, ETFs, diversification', color: '#7C3AED' },
              { icon: '🛡️', title: 'Protection', desc: 'Insurance, credit score, scam prevention', color: '#F59E0B' },
            ].map((p, i) => (
              <Link
                key={p.title}
                href={`/learn/${p.title.toLowerCase()}`}
                className={`${styles.pillarCard} scroll-reveal`}
                style={{ ['--i' as string]: i + 1, ['--pillar-color' as string]: p.color }}
              >
                <div className={styles.pillarIcon}>{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className={styles.pillarArrow}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── USER MARQUEE ─────────────────────────────────── */}
      <section className={`${styles.section} ${styles.glassAlt}`}>
        <div className={styles.container}>
          <h2 className="scroll-reveal">Built for Real Indian Users</h2>
          <p className="subheading scroll-reveal" style={{ marginBottom: '20px' }}>
            Designed to be intuitive, regardless of your background.
          </p>
        </div>
        <div className="users-marquee scroll-reveal">
          <div className="marquee-row">
            {['🎓 Students', '💼 Professionals', '💻 Freelancers', '👨‍👩‍👧 Families', '🎓 Students', '💼 Professionals', '💻 Freelancers', '👨‍👩‍👧 Families'].map((c, i) => (
              <div className="user-chip" key={i}>{c}</div>
            ))}
          </div>
          <div className="marquee-row reverse">
            {['👩 Women', '🏪 Small Businesses', '🌆 Tier 2/3 Users', '📈 Beginner Investors', '👩 Women', '🏪 Small Businesses', '🌆 Tier 2/3 Users', '📈 Beginner Investors'].map((c, i) => (
              <div className="user-chip" key={i}>{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI FEATURES ──────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className="scroll-reveal">🤖 Meet Your AI Finance Coach</h2>
          <p className="subheading scroll-reveal">Powered by Google Gemini. Speaks simply. Plans personally.</p>
          <div className={styles.featuresGrid}>
            {[
              { icon: '💬', title: 'Chat Tutor', desc: 'Ask anything about finance. Get plain-English answers.' },
              { icon: '🎯', title: 'Personalized Plans', desc: 'Saving, investing & debt plans tailored to your profile.' },
              { icon: '🧮', title: 'SIP & EMI Simulators', desc: 'Run what-if scenarios before committing real money.' },
              { icon: '🎤', title: 'Voice Input', desc: 'Talk to your coach like a real conversation.' },
            ].map((f, i) => (
              <div key={f.title} className={`${styles.featureCard} scroll-reveal`} style={{ ['--i' as string]: i + 1 }}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/ai-coach" className="cta-button mt-large scroll-reveal">Talk to AI Coach →</Link>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className="pulse-rings"><div className="ring" /><div className="ring" /></div>
        <div className={styles.container} style={{ position: 'relative', zIndex: 10 }}>
          <h2>Start Building Financial<br />Confidence Today.</h2>
          <p className="subheading">Join thousands of Indians making smarter money moves.</p>
          <div className={styles.dualCta}>
            <Link href="/onboarding" className="cta-button">🚀 Start Free</Link>
            <Link href="/ai-coach" className="cta-button accent-mode">🤖 Ask AI Coach</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerLogo}>💰 FinLit AI</span>
          <p>© 2024 FinLit AI. Making financial education accessible for every Indian.</p>
          <div className={styles.footerLinks}>
            <Link href="/onboarding">Get Started</Link>
            <Link href="/learn/income">Curriculum</Link>
            <Link href="/ai-coach">AI Coach</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
