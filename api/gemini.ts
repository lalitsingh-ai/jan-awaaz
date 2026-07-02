import { GoogleGenAI } from '@google/genai';

// Server-side Gemini proxy. The API key lives only here (process.env.GEMINI_API_KEY)
// and never reaches the browser bundle. Deployed as a Vercel serverless function.

const CATEGORIES = [
  'Water', 'Roads', 'Electricity', 'Health', 'Education',
  'Sanitation', 'Employment', 'Agriculture', 'Other',
];
const MODEL = 'gemini-2.0-flash';

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const pick = (out: string) => CATEGORIES.find((c) => out.includes(c)) ?? null;

export default async function handler(req: any, res: any) {
  // Health check — lets the client show the correct status badge.
  if (req.method === 'GET') {
    res.status(200).json({ ai: Boolean(ai) });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method-not-allowed' });
    return;
  }
  if (!ai) {
    res.status(503).json({ error: 'no-key' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
    const { action } = body;

    if (action === 'categorize') {
      const out = await ai.models.generateContent({
        model: MODEL,
        contents: `Classify this citizen grievance into ONE category from ${CATEGORIES.join(', ')}. Reply with only the category word. Text: "${String(body.text ?? '')}"`,
      });
      res.status(200).json({ category: pick((out.text ?? '').trim()) });
      return;
    }

    if (action === 'photo') {
      const [meta, b64] = String(body.dataUrl ?? '').split(',');
      const mime = meta?.match(/data:(.*);base64/)?.[1] ?? 'image/jpeg';
      const out = await ai.models.generateContent({
        model: MODEL,
        contents: [{
          role: 'user',
          parts: [
            { inlineData: { mimeType: mime, data: b64 ?? '' } },
            { text: `Civic issue photo from an Indian village. Reply with ONE word: ${CATEGORIES.join(', ')}.` },
          ],
        }],
      });
      res.status(200).json({ category: pick((out.text ?? '').trim()) });
      return;
    }

    if (action === 'rank') {
      const out = await ai.models.generateContent({
        model: MODEL,
        contents: `You advise an Indian MP. Cluster these multilingual citizen grievances and return JSON only: an array of {category,title,count,urgency(1-100),sentiment(angry|frustrated|concerned|hopeful),recommendation,villages[],peopleReached,score}. Rank by demand x urgency x population reached. Grievances: ${JSON.stringify(body.subs ?? [])}. Village populations: ${JSON.stringify(body.pop ?? {})}.`,
        config: { responseMimeType: 'application/json' },
      });
      let parsed: unknown = [];
      try { parsed = JSON.parse(out.text ?? '[]'); } catch { parsed = []; }
      res.status(200).json({ priorities: Array.isArray(parsed) ? parsed : [] });
      return;
    }

    res.status(400).json({ error: 'bad-action' });
  } catch {
    res.status(500).json({ error: 'ai-failed' });
  }
}
