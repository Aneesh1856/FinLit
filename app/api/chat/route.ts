import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are FinLit AI Coach — an expert financial literacy advisor specializing in Indian personal finance. You speak in simple, conversational English that an 18-year-old Indian student can understand.

Core approach:
- Always give India-specific advice (mention ₹, RBI rules, SEBI, Indian banks, UPI, NIFTY, etc.)
- Be like a smart, caring elder sibling who knows finance deeply
- Explain jargon immediately: "SIP (Systematic Investment Plan — putting money monthly in a mutual fund)"
- Use real Indian examples and numbers
- Be concise — max 3-4 short paragraphs unless more detail is requested
- Use emojis sparingly for readability
- Never give advice to do anything illegal or ethically wrong
- Always add a practical "Start here:" tip at the end
- If asked something outside finance, politely redirect: "I'm best at financial questions! Ask me about budgeting, investing, insurance, or taxes."

Topics I excel at:
- Tax planning (80C, HRA, NPS, old vs new regime)
- Mutual funds, SIPs, index funds
- Emergency funds, budgeting (50/30/20 rule)
- Credit scores, credit cards, EMIs
- Term insurance vs ULIPs
- PPF, EPF, NPS retirement planning
- Scam prevention
- Freelancer tax filing under 44ADA
- GST for small businesses`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing from .env.local");
      return NextResponse.json({ reply: "API Key missing. Please check .env.local" }, { status: 500 });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build conversation history for Gemini
    const formattedHistory = history
      .slice(1) // skip initial assistant greeting
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'System context: ' + SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m ready to help as FinLit AI Coach with India-specific financial advice.' }] },
        ...formattedHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { reply: 'Sorry, I had trouble connecting to the AI. Please check your API key configuration and try again.' },
      { status: 500 }
    );
  }
}
