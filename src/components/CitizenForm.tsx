import { useRef, useState } from 'react';
import { categorize, categorizePhoto } from '../ai/gemini';
import { VILLAGES } from '../data/seed';
import { CATS } from '../theme';
import type { Category, Submission } from '../types';

const LANGS = [
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'en-IN', label: 'English' },
  { code: 'te-IN', label: 'తెలుగు' },
  { code: 'ta-IN', label: 'தமிழ்' },
  { code: 'bn-IN', label: 'বাংলা' },
  { code: 'mr-IN', label: 'मराठी' },
];

const PLACEHOLDER: Record<string, string> = {
  'hi-IN': 'उदा. हमारे गाँव में पानी नहीं आता…',
  'en-IN': 'e.g. Our village has no drinking water…',
  'te-IN': 'ఉదా. మా ఊరిలో నీళ్ళు రావడం లేదు…',
  'ta-IN': 'எ.கா. எங்கள் ஊரில் தண்ணீர் இல்லை…',
  'bn-IN': 'যেমন আমাদের গ্রামে জল নেই…',
  'mr-IN': 'उदा. आमच्या गावात पाणी येत नाही…',
};

export default function CitizenForm({ onAdd, subs }: { onAdd: (s: Submission) => void; subs: Submission[] }) {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('hi-IN');
  const [village, setVillage] = useState(VILLAGES[0].name);
  const [photo, setPhoto] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ cat: Category; rank: number; peers: number; village: string } | null>(null);
  const recRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser. Please type instead.'); return; }
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = lang; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (e: any) => setText(Array.from(e.results).map((r: any) => r[0].transcript).join(' '));
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start(); recRef.current = rec; setListening(true);
  };

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => setPhoto(r.result as string);
    r.readAsDataURL(f);
  };

  const submit = async () => {
    if (!text.trim() && !photo) return;
    setBusy(true);
    let cat: Category = 'Other';
    if (text.trim()) cat = await categorize(text);
    else if (photo) cat = (await categorizePhoto(photo)) ?? 'Other';
    const v = VILLAGES.find((x) => x.name === village)!;
    onAdd({
      id: crypto.randomUUID(), text: text.trim() || '(photo report)', language: lang.split('-')[0],
      category: cat, village: v.name, lat: v.lat, lng: v.lng, photo: photo ?? undefined, createdAt: Date.now(),
    });
    // social-proof feedback: where does this need rank, who else agrees
    const counts = new Map<Category, number>();
    for (const s of subs) counts.set(s.category, (counts.get(s.category) ?? 0) + 1);
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
    const rank = [...counts.entries()].sort((a, b) => b[1] - a[1]).findIndex(([c]) => c === cat) + 1;
    const peers = subs.filter((s) => s.category === cat).length;
    setBusy(false); setText(''); setPhoto(null);
    setResult({ cat, rank, peers, village: v.name });
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">अपनी बात कहें · Share your need</h2>
      <p className="mb-4 text-sm text-slate-500">Speak, type, or add a photo in your language. AI files it for your MP.</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {LANGS.map((l) => (
          <button key={l.code} onClick={() => setLang(l.code)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${lang === l.code ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {l.label}
          </button>
        ))}
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
        placeholder={PLACEHOLDER[lang]}
        className="w-full resize-none rounded-2xl border border-slate-200 p-3 text-slate-800 outline-none focus:border-indigo-400" />

      {photo && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-2">
          <img src={photo} alt="report" className="h-16 w-16 rounded-xl object-cover" />
          <span className="text-sm text-slate-500">Photo attached</span>
          <button onClick={() => setPhoto(null)} className="ml-auto text-sm text-red-500">Remove</button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <button onClick={startVoice}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${listening ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
          {listening ? '● सुन रहे हैं…' : '🎤 बोलें'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="rounded-full bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700">📷 Photo</button>
        <select value={village} onChange={(e) => setVillage(e.target.value)}
          className="rounded-full border border-slate-200 px-3 py-2.5 text-sm">
          {VILLAGES.map((v) => <option key={v.name}>{v.name}</option>)}
        </select>
        <button onClick={submit} disabled={busy || (!text.trim() && !photo)}
          className="ml-auto rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
          {busy ? 'Filing…' : 'Submit →'}
        </button>
      </div>

      {result && (
        <div className="pop mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-800">✓ दर्ज हो गया · Filed with the MP's office</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{CATS[result.cat].icon} {CATS[result.cat].hi} · {result.cat}</p>
          <p className="text-sm text-slate-600">
            This is the <b>#{result.rank} priority</b> in your constituency right now.
            {result.peers > 0 ? ` ${result.peers} neighbour${result.peers > 1 ? 's' : ''} already raised it — you are not alone.` : ' You are the first to raise this — thank you.'}
          </p>
          <button onClick={() => setResult(null)} className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white">Raise another →</button>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {(Object.keys(CATS) as Category[]).map((c) => (
          <span key={c} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-500">{CATS[c].icon} {c}</span>
        ))}
      </div>
    </div>
  );
}
