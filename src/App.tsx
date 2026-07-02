import { useEffect, useState } from 'react';
import CitizenForm from './components/CitizenForm';
import Dashboard from './components/Dashboard';
import { SEED } from './data/seed';
import { checkAi } from './ai/gemini';
import type { Submission } from './types';

const KEY = 'jan-awaaz-submissions';

export default function App() {
  const [tab, setTab] = useState<'citizen' | 'mp'>('citizen');
  const [hasAi, setHasAi] = useState(false);
  const [subs, setSubs] = useState<Submission[]>(() => {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as Submission[]) : SEED;
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(subs)); }, [subs]);
  useEffect(() => { checkAi().then(setHasAi); }, []);

  return (
    <div className="min-h-full">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white font-bold">जन</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Jan Awaaz</h1>
            <p className="text-xs text-slate-500">People's Priorities · Narasaraopet constituency</p>
          </div>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs ${hasAi ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            {hasAi ? 'Gemini live' : 'Smart demo mode'}
          </span>
        </div>
        <div className="mx-auto flex max-w-5xl gap-2 px-4 pb-3">
          <button onClick={() => setTab('citizen')} className={`rounded-full px-4 py-1.5 text-sm ${tab === 'citizen' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Citizen</button>
          <button onClick={() => setTab('mp')} className={`rounded-full px-4 py-1.5 text-sm ${tab === 'mp' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>MP Dashboard · {subs.length}</button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {tab === 'citizen'
          ? <CitizenForm subs={subs} onAdd={(s) => setSubs((prev) => [s, ...prev])} />
          : <Dashboard submissions={subs} />}
      </main>
    </div>
  );
}
