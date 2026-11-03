import { CATEGORIES } from '../types';
import { recipes } from '../lib/recipes';
import { MASTERY, statusOf, type ProgressState } from '../lib/progress';

export function ProgressPage({ progress, reset }: { progress: ProgressState; reset: () => void }) {
  return (
    <section>
      <h1>Progress</h1>
      <p>Mastered = {MASTERY.streak} correct answers in a row, on {MASTERY.days}+ different days, including a typed answer.</p>
      {CATEGORIES.map((c) => {
        const list = recipes.filter((r) => r.category === c.id);
        const n = (s: string) => list.filter((r) => statusOf(progress[r.id]) === s).length;
        const learned = n('learned') + n('mastered');
        return (
          <div className="panel" key={c.id}>
            <h2>{c.label}</h2>
            <progress max={list.length || 1} value={learned} aria-label={`${c.label} learned`} />
            <p>{list.length} recipes · {n('discovered')} discovered only · {learned} learned · {n('mastered')} mastered</p>
          </div>
        );
      })}
      <button onClick={() => { if (confirm('Erase all progress? This cannot be undone.')) reset(); }}>Reset progress</button>
    </section>
  );
}
