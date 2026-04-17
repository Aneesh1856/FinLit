'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Search, TrendingUp, TrendingDown, BookOpen, BrainCircuit, Activity } from 'lucide-react';
import styles from './predictor.module.css';

export default function StockPredictorPage() {
  const [ticker, setTicker] = useState('RELIANCE.NS');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchPrediction = async () => {
    if (!ticker) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await fetch(`/api/predict?ticker=${ticker}`);
      const json = await response.json();
      
      if (!response.ok) {
        throw new Error(json.error || 'Failed to fetch predictions');
      }

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">💰 FinLit</Link>
        <Link href="/dashboard" className="nav-link">Dashboard</Link>
        <Link href="/learn/income" className="nav-link">Learn</Link>
        <Link href="/dashboard/predictor" className="nav-link active">Predictor</Link>
        <Link href="/ai-coach" className="nav-link">AI Coach</Link>
      </nav>

      <div className={styles.predictorContainer}>
        <div className={styles.header}>
          <BrainCircuit size={32} color="var(--primary-color)" />
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>AI Predictor Engine</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>NLP Sentiment + Time-Series Backtesting</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBox}>
          <input 
            type="text" 
            className={styles.searchInput}
            placeholder="Enter Stock Ticker (e.g. RELIANCE.NS, AAPL, TCS.NS)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && fetchPrediction()}
          />
          <button 
            className={styles.searchBtn} 
            onClick={fetchPrediction}
            disabled={loading || !ticker}
          >
            {loading ? 'Analyzing...' : <span style={{display:'flex', alignItems:'center', gap: '8px'}}><Search size={20} /> Analyze</span>}
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {data && (
          <div className={styles.dashboardGrid}>
            
            {/* Left Column: Chart & Stats */}
            <div>
              <div className={styles.card} style={{ marginBottom: '24px' }}>
                <h3><Activity size={20} /> Historical Backtest & Signals: {data.ticker}</h3>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <span className={styles.label}>Current Price</span>
                    <span className={styles.value}>₹{data.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.label}>Signal Frequency</span>
                    <span className={styles.value}>{data.backtesting.buySignals + data.backtesting.sellSignals} triggers</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.label}>Mock ROI (1Y)</span>
                    <span className={`${styles.value} ${data.backtesting.theoreticalReturnIndex > 0 ? styles.positive : ''}`}>
                      +{data.backtesting.theoreticalReturnIndex}%
                    </span>
                  </div>
                </div>

                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" tick={{fontSize: 12}} minTickGap={30} />
                      <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} width={60} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                      
                      <Line type="monotone" dataKey="close" stroke="#2A5DFF" strokeWidth={2} dot={false} activeDot={{r: 6}} name="Price" />
                      <Line type="monotone" dataKey="ma50" stroke="#F59E0B" strokeWidth={1.5} dot={false} name="50-Day MA" />
                      
                      {/* Render Buy/Sell Signals as dots */}
                      {data.chartData.map((entry: any, index: number) => {
                        if (entry.signal === 'BUY') {
                          return <ReferenceDot key={`buy-${index}`} x={entry.date} y={entry.close} r={4} fill="#10B981" stroke="#fff" strokeWidth={2} />;
                        }
                        if (entry.signal === 'SELL') {
                          return <ReferenceDot key={`sell-${index}`} x={entry.date} y={entry.close} r={4} fill="#EF4444" stroke="#fff" strokeWidth={2} />;
                        }
                        return null;
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px'}}>
                  Historical pricing over 6 months with 50-day MA overlay. Green/Red dots denote MA Crossover triggers.
                </p>
              </div>
            </div>

            {/* Right Column: NLP Sentiment & Recommendations */}
            <div>
              <div className={styles.card} style={{height: '100%'}}>
                <h3><BookOpen size={20} /> NLP News Sentiment</h3>
                
                <div className={styles.sentimentScore}>
                  <div className={`${styles.scoreCircle} ${
                    data.nlp_analysis.score > 20 ? styles.bullish : 
                    data.nlp_analysis.score < -20 ? styles.bearish : styles.neutral
                  }`}>
                    {data.nlp_analysis.score > 0 ? '+' : ''}{data.nlp_analysis.score}
                  </div>
                  <div className={styles.sentimentLabel}>
                    <h4>{data.nlp_analysis.sentiment}</h4>
                    <p>Based on latest news headlines.</p>
                  </div>
                </div>

                <div style={{marginBottom: '24px'}}>
                  <strong style={{display: 'block', marginBottom: '12px', fontSize: '0.95rem', color: '#6B7280'}}>Key Market Drivers:</strong>
                  <ul className={styles.driversList}>
                    {data.nlp_analysis.key_drivers.map((driver: string, idx: number) => (
                      <li key={idx}>{driver}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.recommendationBox}>
                  <h4>Combined AI Recommendation</h4>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                    <span style={{
                      background: data.combinedRecommendation.includes('BUY') ? '#10B981' : 
                                  data.combinedRecommendation.includes('SELL') ? '#EF4444' : '#F59E0B',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {data.combinedRecommendation}
                    </span>
                    <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>(Technical + NLP)</span>
                  </div>
                  <p>{data.nlp_analysis.portfolio_recommendation}</p>
                </div>

              </div>
            </div>
            
          </div>
        )}

        {!data && !loading && !error && (
          <div className={styles.chartPlaceholder}>
            <p>Enter a valid Yahoo Finance ticker (e.g. <b>HDFCBANK.NS</b>, <b>TCS.NS</b>) to run the NLP + Time-Series model.</p>
          </div>
        )}
      </div>
    </>
  );
}
