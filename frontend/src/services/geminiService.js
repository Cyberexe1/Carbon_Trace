// =============================================================================
// SECTION: Gemini AI Service
// Wraps the Google Generative AI SDK (Gemini 2.0 Flash) for client-side use.
//
// All functions return { text, error } so callers never need try/catch.
//
// Usage:
//   import { analyzeFootprint, suggestGoals } from './geminiService';
//   const { text, error } = await analyzeFootprint(statsPayload);
// =============================================================================

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialise once — reused across all calls in the session
const genAI  = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model  = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// =============================================================================
// SECTION: Core helper
// Sends a prompt, returns the trimmed text response or an error string.
// =============================================================================
async function generate(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return { text: result.response.text().trim(), error: null };
  } catch (err) {
    console.error('[geminiService]', err);
    return {
      text: null,
      error: err?.message?.includes('API_KEY')
        ? 'Invalid Gemini API key. Set VITE_GEMINI_API_KEY in .env.local.'
        : err?.message || 'Gemini request failed.',
    };
  }
}

// =============================================================================
// SECTION: analyzeFootprint
// Given a carbon stats object, returns a concise 3-bullet AI analysis
// highlighting the biggest wins and risks in plain English.
//
// @param {Object} stats
//   stats.totalKg        — total kg CO₂e this period
//   stats.categories     — array of { name, kg, pct }
//   stats.vsAvgPct       — % above/below global average (negative = below)
//   stats.trendPct       — % change vs last period (negative = improved)
// @returns {{ text: string, error: string|null }}
// =============================================================================
export async function analyzeFootprint(stats) {
  const { totalKg, categories = [], vsAvgPct, trendPct } = stats;

  const catLines = categories
    .map((c) => `  - ${c.name}: ${c.kg} kg (${c.pct}%)`)
    .join('\n');

  const prompt = `
You are a concise carbon footprint advisor. Analyse the user's emissions data below
and respond with EXACTLY 3 short bullet points (one insight per bullet, max 25 words each).
Focus on their biggest opportunity, a positive trend to reinforce, and one specific action.
Use plain language — no jargon, no markdown headers, no emojis.

Data:
- Total this period: ${totalKg} kg CO₂e
- Breakdown by category:
${catLines}
- vs. global average: ${vsAvgPct > 0 ? `+${vsAvgPct}%` : `${vsAvgPct}%`}
- trend vs. last period: ${trendPct > 0 ? `+${trendPct}% (worse)` : `${trendPct}% (improved)`}

Respond only with the 3 bullet points, starting each with "•".
`.trim();

  return generate(prompt);
}

// =============================================================================
// SECTION: suggestGoals
// Given current active goals and the highest-emission category,
// returns 3 new AI-suggested goals as a JSON array.
//
// @param {Object} context
//   context.topCategory  — string, e.g. "Transport"
//   context.activeGoals  — array of goal title strings
// @returns {{ text: string, error: string|null }}
//   text is a JSON string: [{ title, category, saving_kg, days }]
// =============================================================================
export async function suggestGoals(context) {
  const { topCategory, activeGoals = [] } = context;
  const existing = activeGoals.length
    ? `Existing goals (do not duplicate): ${activeGoals.join('; ')}.`
    : '';

  const prompt = `
You are a carbon footprint reduction coach. ${existing}
The user's highest-emission category is "${topCategory}".

Suggest exactly 3 realistic, specific, measurable goals.
Respond ONLY with a valid JSON array — no markdown, no explanation.
Schema per item:
  { "title": string, "category": string, "saving_kg": number, "days": number }

Example:
[
  { "title": "Take the bus twice a week instead of driving", "category": "Transport", "saving_kg": 24, "days": 30 },
  { "title": "Switch to plant-based meals on Mondays", "category": "Diet", "saving_kg": 18, "days": 30 },
  { "title": "Turn off all standby devices overnight", "category": "Energy", "saving_kg": 10, "days": 30 }
]
`.trim();

  return generate(prompt);
}

// =============================================================================
// SECTION: chatWithAdvisor
// Conversational Q&A for the AI coach panel.
// Keeps the persona focused on carbon / sustainability.
//
// @param {string} userMessage
// @param {string[]} history — alternating [userMsg, modelMsg, ...] for context
// @returns {{ text: string, error: string|null }}
// =============================================================================
export async function chatWithAdvisor(userMessage, history = []) {
  // Build multi-turn chat
  const chat = model.startChat({
    history: history.map((msg, i) => ({
      role: i % 2 === 0 ? 'user' : 'model',
      parts: [{ text: msg }],
    })),
    generationConfig: { maxOutputTokens: 300 },
    systemInstruction: {
      parts: [{
        text: `You are a friendly, knowledgeable carbon footprint advisor inside the CarbonTrace app.
Answer only questions about carbon emissions, sustainability, climate, and eco-friendly lifestyle.
If the user asks about anything unrelated, politely redirect to sustainability topics.
Keep answers concise — 2–4 sentences unless a list is clearly better.`,
      }],
    },
  });

  try {
    const result = await chat.sendMessage(userMessage);
    return { text: result.response.text().trim(), error: null };
  } catch (err) {
    console.error('[geminiService:chat]', err);
    return { text: null, error: err?.message || 'Chat request failed.' };
  }
}
