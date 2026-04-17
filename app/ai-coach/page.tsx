'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

type Message = { role: 'user' | 'assistant'; content: string };

const QUICK_PROMPTS = [
  'How do I start a SIP?',
  'Explain 80C deductions',
  'What is a good credit score?',
  'How to build an emergency fund?',
  'Should I invest or pay EMI first?',
  'Explain term insurance simply',
];

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! 🙏 I'm your FinLit Coach, powered by Gemini. I can help with budgeting, investing, taxes, insurance, or anything about personal finance in India. What would you like to learn today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'chat' | 'sip' | 'emi' | 'rantvbuy'>('chat');
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Calculators state
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [emiPrincipal, setEmiPrincipal] = useState(500000);
  const [emiRate, setEmiRate] = useState(12);
  const [emiMonths, setEmiMonths] = useState(36);
  const [rent, setRent] = useState(20000);
  const [propPrice, setPropPrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again!' }]);
    }
    setLoading(false);
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
    setListening(true);
  };

  const fmtINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, j) => {
      if (!line.trim()) return <br key={j} />;
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      if (line.match(/^(\*|-|\d+\.)\s/)) {
        return <div key={j} style={{ marginLeft: '12px', marginBottom: '4px' }} dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      return <p key={j} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  // Calc results
  const rSip = sipRate / 100 / 12;
  const nSip = sipYears * 12;
  const sipMaturity = Math.round(sipAmount * ((Math.pow(1 + rSip, nSip) - 1) / rSip) * (1 + rSip));
  const sipInvested = sipAmount * nSip;
  const sipGains = sipMaturity - sipInvested;

  const rEmi = emiRate / 100 / 12;
  const emiVal = Math.round(emiPrincipal * rEmi * Math.pow(1 + rEmi, emiMonths) / (Math.pow(1 + rEmi, emiMonths) - 1));
  const emiTotal = emiVal * emiMonths;
  const emiInterest = emiTotal - emiPrincipal;

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">
          <img src="/logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          FinLit
        </Link>
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/learn/income" className="nav-link">Learn</Link>
      </nav>

      <div className={styles.coachOuter}>
        <div className={styles.tabBar}>
          {[
            { key: 'chat', label: '💬 AI Coach' },
            { key: 'sip', label: '📈 SIP Calculator' },
            { key: 'emi', label: '🏦 EMI Calculator' },
            { key: 'rantvbuy', label: '🏠 Rent vs Buy' },
          ].map(t => (
            <button key={t.key} className={`${styles.tabBtn} ${tab === t.key ? styles.tabActive : ''}`} onClick={() => setTab(t.key as any)}>{t.label}</button>
          ))}
        </div>

        {tab === 'chat' && (
          <div className={styles.chatContainer}>
            <div className={styles.messages}>
              {messages.map((m, i) => (
                <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
                  {m.role === 'assistant' && <div className={styles.aiAvatar}>🤖</div>}
                  <div className={styles.msgBubble}>{formatMessage(m.content)}</div>
                </div>
              ))}
              {loading && (
                <div className={`${styles.message} ${styles.aiMsg}`}>
                  <div className={styles.aiAvatar}>🤖</div>
                  <div className={`${styles.msgBubble} ${styles.typingBubble}`}>
                    <div className={styles.typingDots}><span/><span/><span/></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className={styles.quickPrompts}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} className={styles.quickBtn} onClick={() => sendMessage(p)}>{p} </button>
              ))}
            </div>
            <div className={styles.inputArea}>
              <button className={`${styles.voiceBtn} ${listening ? styles.voiceActive : ''}`} onClick={startVoice}>🎤</button>
              <input className={styles.chatInput} placeholder="Ask me anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={loading || !input.trim()}>{loading ? '⏳' : '→'}</button>
            </div>
          </div>
        )}

        {tab === 'sip' && (
          <div className={styles.calcContainer}>
            <h2 className={styles.calcTitle}>📈 SIP Calculator</h2>
            <div className={styles.calcGrid}>
              <div className={styles.calcInputs}>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Monthly Investment (₹)</span><span className={styles.sliderVal}>{sipAmount.toLocaleString('en-IN')}</span></div>
                  <input type="range" min="500" max="100000" step="500" value={sipAmount} onChange={e => setSipAmount(Number(e.target.value))} className={styles.slider} />
                </div>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Expected Return (%)</span><span className={styles.sliderVal}>{sipRate}</span></div>
                  <input type="range" min="4" max="20" step="0.5" value={sipRate} onChange={e => setSipRate(Number(e.target.value))} className={styles.slider} />
                </div>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Period (Years)</span><span className={styles.sliderVal}>{sipYears}</span></div>
                  <input type="range" min="1" max="40" step="1" value={sipYears} onChange={e => setSipYears(Number(e.target.value))} className={styles.slider} />
                </div>
              </div>
              <div className={styles.calcResult}>
                <div className={styles.resultItem}><span className={styles.resultLabel}>Invested</span><span className={styles.resultVal}>{fmtINR(sipInvested)}</span></div>
                <div className={styles.resultItem}><span className={styles.resultLabel}>Gains</span><span className={`${styles.resultVal} ${styles.gainVal}`}>{fmtINR(sipGains)}</span></div>
                <div className={`${styles.resultItem} ${styles.totalRow}`}><span className={styles.resultLabel}>Maturity</span><span className={`${styles.resultVal} ${styles.totalVal}`}>{fmtINR(sipMaturity)}</span></div>
                <button className={`cta-button ${styles.askAiBtn}`} onClick={() => { setTab('chat'); sendMessage(`If I invest ₹${sipAmount}/month SIP for ${sipYears} years at ${sipRate}% returns, is this a good strategy? My maturity value would be ₹${sipMaturity.toLocaleString()}`); }}>🤖 Ask AI Coach</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'emi' && (
          <div className={styles.calcContainer}>
            <h2 className={styles.calcTitle}>🏦 EMI Calculator</h2>
            <div className={styles.calcGrid}>
              <div className={styles.calcInputs}>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Loan Amount (₹)</span><span className={styles.sliderVal}>{emiPrincipal.toLocaleString('en-IN')}</span></div>
                  <input type="range" min="10000" max="10000000" step="10000" value={emiPrincipal} onChange={e => setEmiPrincipal(Number(e.target.value))} className={styles.slider} />
                </div>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Interest Rate (%)</span><span className={styles.sliderVal}>{emiRate}</span></div>
                  <input type="range" min="5" max="24" step="0.25" value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} className={styles.slider} />
                </div>
                <div className={styles.sliderGroup}>
                  <div className={styles.sliderLabel}><span>Duration (Months)</span><span className={styles.sliderVal}>{emiMonths}</span></div>
                  <input type="range" min="6" max="360" step="6" value={emiMonths} onChange={e => setEmiMonths(Number(e.target.value))} className={styles.slider} />
                </div>
              </div>
              <div className={styles.calcResult}>
                <div className={styles.resultItem}><span className={styles.resultLabel}>Monthly EMI</span><span className={`${styles.resultVal} ${styles.emiVal}`}>{fmtINR(emiVal)}</span></div>
                <div className={styles.resultItem}><span className={styles.resultLabel}>Interest</span><span className={`${styles.resultVal} ${styles.interestVal}`}>{fmtINR(emiInterest)}</span></div>
                <div className={`${styles.resultItem} ${styles.totalRow}`}><span className={styles.resultLabel}>Total Paid</span><span className={`${styles.resultVal} ${styles.totalVal}`}>{fmtINR(emiTotal)}</span></div>
                <button className={`cta-button ${styles.askAiBtn}`} onClick={() => { setTab('chat'); sendMessage(`I have a loan of ₹${emiPrincipal.toLocaleString()} at ${emiRate}% for ${emiMonths} months. My EMI is ₹${emiVal.toLocaleString()} and total interest is ₹${emiInterest.toLocaleString()}. Thoughts?`); }}>🤖 Ask AI Coach</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'rantvbuy' && (
          <div className={styles.calcContainer}>
            <h2 className={styles.calcTitle}>🏠 Rent vs Buy Analysis</h2>
            <div className={styles.rvbGrid}>
              <div className={styles.rvbCard} style={{ borderTop: '4px solid var(--success-color)' }}>
                <h3>🏠 Renting</h3>
                <div className="form-group"><label className="form-label">Rent (₹)</label><input type="number" className="form-input" value={rent} onChange={e => setRent(Number(e.target.value))} /></div>
                <div className={styles.rvbNote}>
                  <strong>Annual rent:</strong> {fmtINR(rent * 12)}<br/>
                  <strong>Net annual cost:</strong> {fmtINR(rent * 12 - downPayment * 0.12)}
                </div>
              </div>
              <div className={styles.rvbCard} style={{ borderTop: '4px solid var(--accent-color)' }}>
                <h3>🏡 Buying</h3>
                <div className="form-group"><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={propPrice} onChange={e => setPropPrice(Number(e.target.value))} /></div>
                <div className="form-group"><label className="form-label">Down Pay (₹)</label><input type="number" className="form-input" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} /></div>
                {(() => {
                  const loanAmt = propPrice - downPayment;
                  const r = loanRate / 100 / 12;
                  const n = loanYears * 12;
                  const buyEmi = loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                  return (
                    <div className={styles.rvbNote}>
                      <strong>Monthly EMI:</strong> {fmtINR(buyEmi)}<br/>
                      <strong>Annual cost (30% tax benefit):</strong> {fmtINR(buyEmi * 12 * 0.7)}
                    </div>
                  );
                })()}
              </div>
            </div>
            <button className={`cta-button mt-large ${styles.askAiBtn}`} onClick={() => { setTab('chat'); sendMessage(`Renting at ₹${rent.toLocaleString()}/month or buying at ₹${propPrice.toLocaleString()}?`); }}>🤖 Should I Rent or Buy?</button>
          </div>
        )}
      </div>
    </>
  );
}
