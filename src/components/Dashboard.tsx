import { useEffect, useMemo, useState } from 'react';
import { buildBrief, clusterAndRank, weeklyTrend } from '../ai/gemini';
import { CATS, SENT_COLOR } from '../theme';
import type { Category, Priority, Submission } from '../types';
import MapView from './MapView';
import Trends from './Trends';

export default function Dashboard({ submissions }: { submissions: Submission[] }) {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Category | 'All'>('All');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    clusterAndRank(submissions).then((p) => { if (alive) { setPriorities(p); setLoading(false); } });
    return () => { alive = false; };
  }, [submissions]);

  const villages = useMemo(() => new Set(submissions.map((s) => s.village)).size, [submissions]);
  const langs = useMemo(() => new Set(submissions.map((s) => s.language)).size, [submissions]);
  const brief = useMemo(() => buildBrief(priorities, submissions), [priorities, submissions]);
  const trendByCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of weeklyTrend(submissions, 4)) m[t.category] = t.delta;
    return m;
  }, [submissions]);
  const max = priorities[0]?.score ?? 1;
  const shown = filter === 'All' ? submissions : submissions.filter((s) => s.category === filter);

  return (
    <div className="space-y-5">
      {/* Executive brief — what a busy MP reads first */}
      <div className="fade-up rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-100">AI brief for the MP's office</p>
          <button onClick={() => window.print()} className="rounded-full bg-white/15 px-3 py-1 text-xs hover:bg-white/25">⬇ Export report</button>
        </div>
        <h2 className="mt-1 text-xl font-bold leading-snug">{brief.headline}</h2>
        <ul className="mt-3 space-y-1 text-sm text-indigo-50">
          {brief.bullets.map((b, i) => <li key={i}>• {b}</li>)}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Citizen voices" value={submissions.length} />
        <Stat label="Villages" value={villages} />
        <Stat label="Languages" value={langs} />
        <Stat label="Top need" value={priorities[0] ? `${CATS[priorities[0].category].icon} ${priorities[0].category}` : '—'} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h3 className="mb-4 text-base font-semibold">Ranked priorities {loading && <span className="text-xs text-slate-400">analysing…</span>}</h3>
          {!loading && !priorities.length && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No voices yet. Switch to the Citizen tab and add the first one.</p>}
          <ol className="space-y-4">
            {priorities.map((p, i) => (
              <li key={p.category} className="fade-up rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{CATS[p.category].icon} #{i + 1} · {p.category}</span>
                  <span className="flex items-center gap-2">
                    {trendByCat[p.category] > 0 && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">↑ rising</span>}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${SENT_COLOR[p.sentiment]}`}>{p.sentiment}</span>
                  </span>
                </div>
                <p className="text-sm text-slate-500">{p.count} voices · ~{p.peopleReached.toLocaleString('en-IN')} people · {p.villages.join(', ')}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div className="grow-bar h-2 rounded-full bg-indigo-500" style={{ width: `${(p.score / max) * 100}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-700"><b>AI suggests:</b> {p.recommendation}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Demand hotspots</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value as Category | 'All')}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs">
              <option value="All">All categories</option>
              {priorities.map((p) => <option key={p.category} value={p.category}>{p.category}</option>)}
            </select>
          </div>
          <MapView submissions={shown} />
        </div>
      </div>

      <Trends submissions={submissions} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
