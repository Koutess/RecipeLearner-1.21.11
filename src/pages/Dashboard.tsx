import type { Page } from '../App';
import { recipes } from '../lib/recipes';
import type { ProgressState } from '../lib/progress';
import { statusOf } from '../lib/progress';

export function Dashboard({ progress, go }: { progress: ProgressState; go: (p: Page) => void }) {
  const counts = { discovered: 0, learned: 0, mastered: 0 };
  for (const r of recipes) {
    const s = statusOf(progress[r.id]);
    if (s !== 'new') counts.discovered++;
    if (s === 'learned' || s === 'mastered') counts.learned++;
    if (s === 'mastered') counts.mastered++;
  }
  const pct = (n: number) => Math.round((n / recipes.length) * 100);
  const unverified = recipes.filter((r) => !r.verified).length;
  return (
    <section>
      <h1>Dashboard</h1>
      <div className="stats">
        {(['discovered', 'learned', 'mastered'] as const).map((k) => (
          <div className="panel" key={k}><h2>{k[0]!.toUpperCase() + k.slice(1)}</h2><p className="big">{pct(counts[k])}%</p><p>{counts[k]} of {recipes.length} recipes</p></div>
        ))}
      </div>
      <div className="row">
        <button onClick={() => go('learn')}>Start a lesson</button>
        <button onClick={() => go('quiz')}>Take a quiz</button>
      </div>
      {unverified > 0 && <p className="warn">{unverified} of {recipes.length} recipes are unverified seed data. Run the official-data import before relying on them.</p>}
    </section>
  );
}
