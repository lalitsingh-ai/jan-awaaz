import type { Brief, Category, Priority, Submission } from '../types';
import { VILLAGES } from '../data/seed';

// All Gemini calls go through a server-side proxy (/api/gemini) so the API key
// never ships to the browser. If the proxy is unreachable or has no key, we fall
// back to the deterministic offline logic below — the app never breaks.
const AI_URL = '/api/gemini';

async function callProxy(payload: unknown): Promise<any | null> {
  try {
    const res = await fetch(AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

let aiStatus: boolean | null = null;
export async function checkAi(): Promise<boolean> {
  if (aiStatus !== null) return aiStatus;
  try {
    const res = await fetch(AI_URL);
    const j = await res.json();
    aiStatus = Boolean(j?.ai);
  } catch {
    aiStatus = false;
  }
  return aiStatus;
}

const CATEGORIES: Category[] = [
  'Water', 'Roads', 'Electricity', 'Health', 'Education',
  'Sanitation', 'Employment', 'Agriculture', 'Other',
];

const POP: Record<string, number> = Object.fromEntries(VILLAGES.map((v) => [v.name, v.population]));

// ---- Keyword fallback (works offline, multilingual hints) ----
const KEYWORDS: Record<Category, string[]> = {
  Water: ['water', 'पानी', 'நீர்', 'নীল', 'నీళ్ళు', 'borewell', 'बोर', 'drinking', 'टंकी', 'tank'],
  Roads: ['road', 'रोड', 'రోడ్డు', 'सड़क', 'rasta', 'রাস্তা', 'சாலை', 'bus', 'pothole'],
  Electricity: ['light', 'current', 'करेंट', 'बिजली', 'power', 'కరెంట్', 'மின்', 'বিদ্যুৎ'],
  Health: ['doctor', 'phc', 'hospital', 'अस्पताल', 'fever', 'డాక్టర్', 'ambulance', 'delivery'],
  Education: ['school', 'teacher', 'स्कूल', 'शिक्षक', 'చదువు', 'பள்ளி', 'education'],
  Sanitation: ['drain', 'toilet', 'garbage', 'mosquito', 'sanitation', 'सफाई', 'கழிப்பறை', 'drainage'],
  Employment: ['job', 'work', 'employment', 'रोजगार', 'wages', 'mnrega', 'mgnrega'],
  Agriculture: ['crop', 'farmer', 'రైతు', 'पंट', 'market', 'msp', 'mandi', 'fasal', 'பயிர்'],
  Other: [],
};

export function categorizeFallback(text: string): Category {
  const t = text.toLowerCase();
  for (const c of CATEGORIES) {
    if (KEYWORDS[c].some((k) => t.includes(k.toLowerCase()))) return c;
  }
  return 'Other';
}

export async function categorize(text: string): Promise<Category> {
  const j = await callProxy({ action: 'categorize', text });
  const cat = j?.category as Category | undefined;
  return cat && CATEGORIES.includes(cat) ? cat : categorizeFallback(text);
}

// ---- Photo intake: classify an uploaded image (multimodal, via proxy) ----
export async function categorizePhoto(dataUrl: string): Promise<Category | null> {
  const j = await callProxy({ action: 'photo', dataUrl });
  const cat = j?.category as Category | undefined;
  return cat && CATEGORIES.includes(cat) ? cat : null;
}

// ---- Deterministic ranking fallback (demand x urgency x reach) ----
function rankFallback(subs: Submission[]): Priority[] {
  const groups = new Map<Category, Submission[]>();
  for (const s of subs) groups.set(s.category, [...(groups.get(s.category) ?? []), s]);

  const urgencyByCat: Record<string, number> = {
    Water: 92, Health: 95, Electricity: 78, Roads: 70,
    Sanitation: 74, Education: 68, Agriculture: 80, Employment: 60, Other: 50,
  };
  const recs: Record<string, string> = {
    Water: 'Sanction piped supply + repair dried borewells; prioritise salty-water habitations.',
    Health: 'Post a night medical officer at the PHC; add a maternity-ready ambulance.',
    Electricity: 'Restore street lighting on the college route; stabilise feeder load.',
    Roads: 'Repair the school-access road before monsoon; restore bus connectivity.',
    Sanitation: 'Build covered drainage + school toilets; weekly fogging for mosquitoes.',
    Education: 'Fill teacher vacancies under SSA; rationalise staffing.',
    Agriculture: 'Set up MSP procurement; link FPOs to the nearest mandi.',
    Employment: 'Open MGNREGA works; add a skilling tie-up for youth.',
    Other: 'Review and route to the relevant department.',
  };
  return [...groups.entries()]
    .map(([category, items]) => {
      const urgency = urgencyByCat[category] ?? 50;
      const villages = [...new Set(items.map((i) => i.village))];
      const peopleReached = villages.reduce((sum, v) => sum + (POP[v] ?? 5000), 0);
      const reachFactor = Math.max(1 + Math.log10(Math.max(peopleReached, 1000)) - 3, 0.5);
      return {
        category,
        title: `${category} needs in ${villages.length} village(s)`,
        count: items.length,
        urgency,
        sentiment: urgency > 90 ? 'angry' : urgency > 75 ? 'frustrated' : 'concerned',
        recommendation: recs[category] ?? recs.Other,
        villages,
        peopleReached,
        score: Math.round(items.length * urgency * reachFactor),
      } as Priority;
    })
    .sort((a, b) => b.score - a.score);
}

export async function clusterAndRank(subs: Submission[]): Promise<Priority[]> {
  const j = await callProxy({
    action: 'rank',
    subs: subs.map((s) => ({ category: s.category, text: s.text, village: s.village })),
    pop: POP,
  });
  const parsed = j?.priorities as Priority[] | undefined;
  if (Array.isArray(parsed) && parsed.length) return parsed.sort((a, b) => b.score - a.score);
  return rankFallback(subs);
}

// ---- One-glance brief for a busy MP office ----
export function buildBrief(p: Priority[], subs: Submission[]): Brief {
  if (!p.length) return { headline: 'No citizen voices yet.', bullets: [] };
  const top = p[0];
  const langs = new Set(subs.map((s) => s.language)).size;
  const villages = new Set(subs.map((s) => s.village)).size;
  return {
    headline: `${top.category} is the top priority — ${top.count} voices, ~${top.peopleReached.toLocaleString('en-IN')} people affected.`,
    bullets: [
      `${subs.length} submissions across ${villages} villages in ${langs} languages.`,
      `Recommended action: ${top.recommendation}`,
      p[1] ? `Also rising: ${p[1].category} in ${p[1].villages.join(', ')}.` : 'One dominant theme this week.',
    ],
  };
}

// ---- Weekly trend (last N weeks) for sparkbars + rising/falling tags ----
export interface CatTrend {
  category: Category;
  weeks: number[];   // counts oldest -> newest
  delta: number;     // newest week minus previous week
}

export function weeklyTrend(subs: Submission[], weeks = 4): CatTrend[] {
  const WEEK = 7 * 86400000;
  const now = Date.now();
  const bucket = (t: number) => Math.min(weeks - 1, Math.floor((now - t) / WEEK));
  const map = new Map<Category, number[]>();
  for (const s of subs) {
    const arr = map.get(s.category) ?? new Array(weeks).fill(0);
    const idx = weeks - 1 - bucket(s.createdAt); // oldest first
    if (idx >= 0 && idx < weeks) arr[idx] += 1;
    map.set(s.category, arr);
  }
  return [...map.entries()]
    .map(([category, w]) => ({ category, weeks: w, delta: w[weeks - 1] - w[weeks - 2] }))
    .sort((a, b) => b.weeks.reduce((x, y) => x + y, 0) - a.weeks.reduce((x, y) => x + y, 0));
}
