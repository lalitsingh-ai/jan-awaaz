import { weeklyTrend } from '../ai/gemini';
import { CATS } from '../theme';
import type { Submission } from '../types';

export default function Trends({ submissions }: { submissions: Submission[] }) {
  const trends = weeklyTrend(submissions, 4).slice(0, 5);
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h3 className="mb-1 text-base font-semibold">4-week trend</h3>
      <p className="mb-4 text-xs text-slate-500">Demand momentum by theme — spot what is climbing before it peaks.</p>
      <div className="space-y-3">
        {trends.map((t) => {
          const peak = Math.max(...t.weeks, 1);
          const rising = t.delta > 0, falling = t.delta < 0;
          return (
            <div key={t.category} className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-sm">{CATS[t.category].icon} {t.category}</div>
              <div className="flex h-10 flex-1 items-end gap-1">
                {t.weeks.map((c, i) => (
                  <div key={i} className="grow-bar w-full rounded-t" title={`Week ${i + 1}: ${c}`}
                    style={{ height: `${Math.max((c / peak) * 100, 6)}%`, background: CATS[t.category].color, opacity: 0.35 + (i / t.weeks.length) }} />
                ))}
              </div>
              <span className={`w-14 shrink-0 text-right text-xs font-medium ${rising ? 'text-green-600' : falling ? 'text-slate-400' : 'text-slate-400'}`}>
                {rising ? `↑ +${t.delta}` : falling ? `↓ ${t.delta}` : '→ 0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
