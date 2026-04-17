import { NextResponse } from 'next/server';
import YF from 'yahoo-finance2';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLessonById } from '@/lib/lessons';

// Instantiate version 3 wrapper
const yahooFinance = new YF();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pillar = searchParams.get('pillar');
  const lessonId = searchParams.get('lessonId');

  if (!pillar || !lessonId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const lesson = getLessonById(lessonId);

  try {
    let liveDataStr = "General Indian Financial Market Environment";

    // Fetch different real-time data depending on the pillar
    if (pillar === 'investing' || pillar === 'saving') {
        try {
             // NIFTY 50 Index 
            const result = await yahooFinance.quote('^NSEI');
            liveDataStr = `NIFTY 50 Market Status: Currently at ${result.regularMarketPrice}, Daily Change: ${result.regularMarketChangePercent?.toFixed(2)}%`;
        } catch (e) {
            console.error("YF error", e);
        }
    } else {
        try {
             // Fetch general Indian economy news
            const searchResults = await yahooFinance.search('RBI India Economy Rates', { newsCount: 3 });
            const headlines = (searchResults.news || []).map(n => n.title).join(' | ');
            if (headlines) liveDataStr = `Recent Indian Economy News: ${headlines}`;
        } catch (e) {}
    }

    const prompt = `Act as FinLit Coach, an advanced financial literacy AI.
The user just completed a lesson titled "${lesson?.title}" in the "${pillar}" pillar.
Here is the core content they learned:
"${lesson?.content.join(" ")}"

Today's Real-Time Market Data/News in India:
"${liveDataStr}"

Generate exactly ONE advanced, scenario-based "Bonus Question" that tests their applied knowledge of the lesson using today's real-time data context. 
The question should not be a basic definition, but a practical thinking scenario.

Output strictly in JSON format matching this schema:
{
  "question": "<Scenario based question integrating the real time data>",
  "options": ["<Option A>", "<Option B>", "<Option C>", "<Option D>"],
  "correct": <integer 0-3 representing the correct option index>,
  "explanation": "<Why this connects to the lesson and the real time data>"
}`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
      const result = await model.generateContent(prompt);
      const quizResponse = JSON.parse(result.response.text());
      return NextResponse.json(quizResponse);
    } catch (geminiError: any) {
      console.warn('Gemini high demand, using fallback dynamic question:', geminiError.message);
      
      // Fallback question combining the real-time data but hardcoded logic
      return NextResponse.json({
        question: `Based on today's real-world market context (${liveDataStr.substring(0, 50)}...), how should a long-term SIP investor react?`,
        options: [
          "Immediately stop all SIPs to avoid further losses",
          "Try to day-trade to recover any portfolio dips",
          "Continue the SIP to benefit from Rupee Cost Averaging regardless of today's movements",
          "Liquidate all mutual funds and buy fixed deposits"
        ],
        correct: 2,
        explanation: "Regardless of daily market fluctuations or positive/negative news, SIPs are designed for the long term. Rupee Cost Averaging ensures you buy more units when markets are low."
      });
    }

  } catch (error: any) {
    console.error('Quiz Engine Error:', error);
    return NextResponse.json({ error: `Failed to generate bonus quiz: ${error.message}` }, { status: 500 });
  }
}
