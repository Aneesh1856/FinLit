'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

// ── FULL SURVEY DATA (ported from finlit_ref/script.js) ─────────────────────
const questionsDB: any = {
  root: {
    question: "To begin, what best describes your primary activity?",
    options: [
      { text: "🎓 Student (School, College, or Research)", path: 'A', tags: ['student'] },
      { text: "💼 Salaried Employee (Corporate, Govt, or NGO)", path: 'B', tags: ['professional'] },
      { text: "💻 Entrepreneur / Freelancer / Gig Worker", path: 'C', tags: ['freelancer'] },
      { text: "👩 Homemaker (Managing household finances)", path: 'D', tags: ['homemaker'] },
      { text: "🌟 Retired (Done with active career)", path: 'E', tags: ['retired'] },
    ],
  },
  branches: {
    A: [
      { question: "What is your age group?", options: [{ text: "Under 18", tags: ['minor'] }, { text: "18–24", tags: ['adult'] }, { text: "25+", tags: ['adult'] }] },
      { question: "How do you get your money?", options: [{ text: "Pocket Money", tags: ['allowance'] }, { text: "Internship Stipend", tags: ['stipend'] }, { text: "Scholarship", tags: ['stipend'] }] },
      { question: "Where is your money kept?", options: [{ text: "Cash", tags: ['untracked'] }, { text: "Joint Bank Account", tags: ['monitored'] }, { text: "My own Bank Account", tags: ['independent'] }] },
      { question: "What do you spend most on?", options: [{ text: "Food & Hanging out", tags: ['impulse'] }, { text: "Gaming & Subscriptions", tags: ['digital'] }, { text: "Hobbies", tags: ['steady'] }] },
      { question: "Do you know what 'Inflation' does to your money?", options: [{ text: "Yes", tags: ['aware'] }, { text: "I've heard of it", tags: ['unsure'] }, { text: "No", tags: ['clueless'] }] },
      { question: "When you want something expensive, you:", options: [{ text: "Save for it", tags: ['saver'] }, { text: "Ask parents", tags: ['dependent'] }, { text: "Spend now, worry later", tags: ['impulse'] }] },
      { question: "Do you use UPI (GPay/PhonePe) daily?", options: [{ text: "Yes, for everything", tags: ['upi_heavy'] }, { text: "Only for big things", tags: ['upi_light'] }, { text: "No", tags: ['no_upi'] }] },
    ],
    B: [
      { question: "How many years have you been working?", options: [{ text: "0–2 (Fresher)", tags: ['fresher'] }, { text: "3–10 (Mid-career)", tags: ['mid_career'] }, { text: "10+ (Experienced)", tags: ['senior'] }] },
      { question: "Do you know your exact take-home pay after taxes?", options: [{ text: "Yes, precisely", tags: ['aware'] }, { text: "Rough idea", tags: ['unsure'] }, { text: "No idea", tags: ['clueless'] }] },
      { question: "Do you have active EMIs or Credit Card dues?", options: [{ text: "Yes, it's high", tags: ['debt_heavy'] }, { text: "Yes, manageable", tags: ['debt_light'] }, { text: "No", tags: ['no_debt'] }] },
      { question: "Do you plan investments to save Income Tax?", options: [{ text: "Yes actively", tags: ['tax_pro'] }, { text: "I just file ITR", tags: ['tax_lazy'] }, { text: "No", tags: ['tax_clueless'] }] },
      { question: "Do you have Health Insurance outside your company's plan?", options: [{ text: "Yes", tags: ['insured'] }, { text: "No", tags: ['uninsured'] }] },
      { question: "Where is most of your wealth?", options: [{ text: "Savings Account / FDs", tags: ['safe_assets'] }, { text: "Mutual Funds / Stocks", tags: ['risk_assets'] }, { text: "Gold / Real Estate", tags: ['illiquid_assets'] }] },
      { question: "Do you track your expenses monthly?", options: [{ text: "Yes, strictly", tags: ['tracker'] }, { text: "Mental track only", tags: ['untracked'] }, { text: "No", tags: ['untracked'] }] },
    ],
    C: [
      { question: "How stable is your monthly income?", options: [{ text: "Stable", tags: ['stable'] }, { text: "Highly Variable", tags: ['variable'] }, { text: "Seasonal", tags: ['variable'] }] },
      { question: "Are your business and personal bank accounts separate?", options: [{ text: "Yes", tags: ['separated'] }, { text: "No", tags: ['mixed_accounts'] }] },
      { question: "Do you pay yourself a fixed monthly salary?", options: [{ text: "Yes", tags: ['disciplined'] }, { text: "No", tags: ['chaotic'] }] },
      { question: "Do you find GST and Business Taxes confusing?", options: [{ text: "Yes, very much", tags: ['tax_clueless'] }, { text: "Somewhat", tags: ['tax_lazy'] }, { text: "I handle it well", tags: ['tax_pro'] }] },
      { question: "Do you have a 6-month business emergency fund?", options: [{ text: "Yes", tags: ['secure'] }, { text: "No", tags: ['vulnerable'] }, { text: "Working on it", tags: ['building'] }] },
      { question: "What do you do with surplus profits?", options: [{ text: "Reinvest in business", tags: ['growth'] }, { text: "Personal savings", tags: ['saver'] }, { text: "Spend", tags: ['impulse'] }] },
      { question: "Do you have a personal retirement plan (no EPF for you)?", options: [{ text: "Yes", tags: ['planner'] }, { text: "No", tags: ['vulnerable'] }] },
    ],
    D: [
      { question: "How do you receive the household money?", options: [{ text: "Monthly fixed amount", tags: ['stable'] }, { text: "As needed from family", tags: ['chaotic'] }, { text: "Shared account access", tags: ['separated'] }] },
      { question: "Do rising prices of groceries/fuel stress your budget?", options: [{ text: "Yes, significantly", tags: ['price_sensitive'] }, { text: "It's manageable", tags: ['stable'] }, { text: "Not really", tags: ['secure'] }] },
      { question: "Where do you keep your personal savings?", options: [{ text: "Cash at home", tags: ['safe_assets'] }, { text: "Gold jewelry/coins", tags: ['safe_assets'] }, { text: "My own Bank Account", tags: ['banked'] }] },
      { question: "Do you make your own investment decisions?", options: [{ text: "Yes, independently", tags: ['independent'] }, { text: "Together with family", tags: ['shared'] }, { text: "Family/husband decides", tags: ['dependent'] }] },
      { question: "How comfortable are you with digital banking/UPI?", options: [{ text: "Very comfortable", tags: ['digitally_fluent'] }, { text: "Still learning", tags: ['learning'] }, { text: "Not at all", tags: ['offline'] }] },
      { question: "What are you primarily saving for?", options: [{ text: "Children's education/future", tags: ['family_goal'] }, { text: "Personal emergency fund", tags: ['emergency_goal'] }, { text: "Family travel / home", tags: ['lifestyle'] }] },
      { question: "Do you know what to do if you get a suspicious 'Bank Link' on SMS?", options: [{ text: "Yes, I'd ignore/report it", tags: ['scam_aware'] }, { text: "I'd check it carefully", tags: ['vulnerable'] }, { text: "I might click it", tags: ['scam_target'] }] },
    ],
    E: [
      { question: "What is your primary income source now?", options: [{ text: "Government / Company Pension", tags: ['stable'] }, { text: "Interest / Rentals", tags: ['stable'] }, { text: "Financially dependent on children", tags: ['dependent'] }] },
      { question: "Do you have any pending loans?", options: [{ text: "Yes", tags: ['debt_heavy'] }, { text: "No", tags: ['no_debt'] }] },
      { question: "Is your current corpus enough for the next 20 years?", options: [{ text: "Yes, I'm comfortable", tags: ['secure'] }, { text: "I'm a bit worried", tags: ['anxious'] }, { text: "No, it's concerning", tags: ['vulnerable'] }] },
      { question: "Do you have a Will or updated Nominations for all assets?", options: [{ text: "Yes, fully updated", tags: ['legacy_ready'] }, { text: "No, pending", tags: ['legacy_pending'] }] },
      { question: "Is your medical insurance enough for big emergencies?", options: [{ text: "Yes", tags: ['insured'] }, { text: "No", tags: ['uninsured'] }, { text: "Unsure", tags: ['uninsured'] }] },
      { question: "Are you confident in spotting digital/phone scams?", options: [{ text: "Yes, very aware", tags: ['scam_aware'] }, { text: "Not very confident", tags: ['scam_target'] }] },
      { question: "Where is the bulk of your money kept?", options: [{ text: "Senior Citizen Schemes / FDs", tags: ['safe_assets'] }, { text: "Gold or Real Estate", tags: ['illiquid_assets'] }, { text: "Stocks / Mutual Funds", tags: ['risk_assets'] }] },
    ],
  },
  finale: [
    {
      question: "If you get ₹50,000 extra today, you would:",
      options: [
        { text: "Invest it for the long term", tags: ['investor_mindset'] },
        { text: "Put it in a safe FD or Gold", tags: ['safe_mindset'] },
        { text: "Pay off a bill or debt", tags: ['debt_focus'] },
        { text: "Treat yourself or your family", tags: ['spender_mindset'] },
      ],
    },
    {
      question: "What is your biggest financial fear?",
      options: [
        { text: "Not being able to afford my future lifestyle", tags: ['inflation_fear'] },
        { text: "Losing money in the stock market or scams", tags: ['scam_fear'] },
        { text: "Not having enough for a medical emergency", tags: ['medical_fear'] },
        { text: "Never becoming debt-free", tags: ['debt_fear'] },
      ],
    },
  ],
};

const personaManifest: Record<string, { title: string; action: string; desc: string; path: string }> = {
  piggyBankProdigy: { title: "🐷 The Piggy-Bank Prodigy", action: "Start: Income Pillar — Compounding Basics", path: 'income', desc: "You're young with an amazing head start! We'll focus on Compounding and how to multiply money over decades through smart, early saving habits." },
  independentScholar: { title: "🎓 The Independent Scholar", action: "Start: Spending Pillar — Budgeting", path: 'spending', desc: "You're navigating adult independence with real digital money. We'll help your stipends cover needs and wants optimally, without running dry mid-month." },
  upiNinja: { title: "⚡ The UPI Ninja", action: "Start: Spending Pillar — Micro-expenses", path: 'spending', desc: "Scan, tap, paid! You transact digitally all day but lack tracking mechanics. We'll focus on invisible micro-expenses that silently destroy your wealth." },
  creditCraver: { title: "💳 The Credit Craver", action: "Start: Spending Pillar — Debt Traps", path: 'spending', desc: "You rely heavily on BNPL and credit cards, creating end-of-month anxiety. Your daily scenarios will forcefully focus on breaking endless 'Buy Now, Pay Later' loops." },
  emiAcrobat: { title: "🤹 The EMI Acrobat", action: "Start: Spending Pillar — Debt Snowball", path: 'spending', desc: "You have solid income but it's swallowed instantly by high EMI loads. We'll analyze rapid strategies to demolish debt so you can start investing." },
  taxTangledPro: { title: "💼 The Tax-Tangled Pro", action: "Start: Income Pillar — Tax Optimization", path: 'income', desc: "You earn well but hemorrhage capital due to poor tax planning. Your scenarios will train you aggressively on utilizing every legal avenue to retain your wealth." },
  soloMaverick: { title: "🚀 The Solo Maverick", action: "Start: Income Pillar — Cash Flow", path: 'income', desc: "As a freelancer/biz owner, your cash flow is chaotic and accounts are mixed. Daily scenarios will train you to separate accounts, build buffers, and stabilize income." },
  inflationWarrior: { title: "🛡️ The Inflation Warrior", action: "Start: Saving Pillar — Beat Inflation", path: 'saving', desc: "You're the anchor of your family's finances, leaning on ultra-safe assets while battling rising prices. We'll show you how to deploy capital safely to beat inflation." },
  safetyGuardian: { title: "🔐 The Safety Guardian", action: "Start: Protection Pillar — Scam Prevention", path: 'protection', desc: "You prioritize protecting your nest egg against modern digital traps. Your AI scenarios will strictly focus on identifying fraud, phishing, and protecting your capital." },
  legacyBuilder: { title: "🏛️ The Legacy Builder", action: "Start: Protection Pillar — Estate Planning", path: 'protection', desc: "Your focus has shifted from accumulation to preserving wealth for the next generation. Scenarios will train you on executing nominations, wills, and seamless asset transfer." },
};

function calculatePersona(answers: string[]): string {
  const flags = new Set(answers);
  if (flags.has('student') && flags.has('minor')) return 'piggyBankProdigy';
  if (flags.has('student') && flags.has('stipend') && flags.has('upi_heavy')) return 'independentScholar';
  if (flags.has('upi_heavy') && flags.has('untracked')) return 'upiNinja';
  if (flags.has('debt_heavy') && (flags.has('impulse') || flags.has('spender_mindset'))) return 'creditCraver';
  if (flags.has('professional') && flags.has('debt_heavy')) return 'emiAcrobat';
  if (flags.has('professional') && flags.has('tax_clueless')) return 'taxTangledPro';
  if (flags.has('freelancer') && flags.has('mixed_accounts') && flags.has('variable')) return 'soloMaverick';
  if (flags.has('homemaker') && flags.has('safe_assets') && flags.has('price_sensitive')) return 'inflationWarrior';
  if (flags.has('retired') && flags.has('scam_target')) return 'safetyGuardian';
  if ((flags.has('retired') || flags.has('professional')) && flags.has('legacy_pending')) return 'legacyBuilder';
  if (flags.has('student')) return 'independentScholar';
  if (flags.has('professional')) return 'taxTangledPro';
  if (flags.has('freelancer')) return 'soloMaverick';
  if (flags.has('homemaker')) return 'inflationWarrior';
  if (flags.has('retired')) return 'legacyBuilder';
  return 'upiNinja';
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'survey' | 'result'>('survey');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [persona, setPersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentQuestion = () => {
    if (questionIndex === 0) return questionsDB.root;
    if (questionIndex >= 1 && questionIndex <= 7 && currentPath)
      return questionsDB.branches[currentPath][questionIndex - 1];
    return questionsDB.finale[questionIndex - 8];
  };

  const handleSelect = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const data = getCurrentQuestion();
    const opt = data.options[optionIdx];
    const newAnswers = [...userAnswers, ...(opt.tags || [])];

    if (questionIndex === 0 && opt.path) setCurrentPath(opt.path);

    setTimeout(() => {
      setUserAnswers(newAnswers);
      setSelectedOption(null);
      if (questionIndex < 9) {
        setQuestionIndex(questionIndex + 1);
      } else {
        setLoading(true);
        const p = calculatePersona(newAnswers);
        setTimeout(() => {
          setPersona(p);
          setLoading(false);
          setStep('result');
          // Save to sessionStorage for use after auth
          sessionStorage.setItem('finlit_persona', p);
          sessionStorage.setItem('finlit_persona_title', personaManifest[p].title);
        }, 2000);
      }
    }, 400);
  };

  const qData = step === 'survey' ? getCurrentQuestion() : null;
  const progress = (questionIndex / 10) * 100;

  if (step === 'result' && persona) {
    const p = personaManifest[persona];
    return (
      <div className={styles.resultOuter}>
        <div className={styles.resultCard}>
          <div className={styles.celebrate}>🎉 Assessment Complete</div>
          <h1 className={styles.personaTitle}>{p.title}</h1>
          <p className={styles.personaAction}>{p.action}</p>
          <p className={styles.personaDesc}>{p.desc}</p>
          <div className={styles.resultActions}>
            <button className="cta-button" onClick={() => router.push(`/auth/signup?persona=${persona}`)}>
              🚀 Start My Learning Path
            </button>
            <button className="cta-button accent-mode" onClick={() => router.push(`/dashboard`)}>
              👀 Explore Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.resultOuter}>
        <div className={styles.resultCard} style={{ alignItems: 'center' }}>
          <div className={styles.loadingSpinner} />
          <h2 style={{ color: 'var(--primary-color)', textAlign: 'center', marginTop: '24px' }}>
            Extracting your Financial Profile...
          </h2>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            AI is analyzing your responses
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.surveyOuter}>
      <div className={styles.surveyCard}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>← Back to Home</button>

        <div className={styles.surveyHeader}>
          <span className={styles.questionCounter}>Question {questionIndex + 1} of 10</span>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <h2 className={styles.surveyTitle}>Let&apos;s map your financial baseline.</h2>
          <p className={styles.surveySubtext}>This trains the FinLit AI engine to your exact needs.</p>
        </div>

        <div className={styles.questionText}>{qData?.question}</div>
        <div className={styles.optionsContainer}>
          {qData?.options.map((opt: any, i: number) => (
            <button
              key={i}
              className={`${styles.optionBtn} ${selectedOption === i ? styles.optionSelected : ''}`}
              onClick={() => handleSelect(i)}
              disabled={selectedOption !== null}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
