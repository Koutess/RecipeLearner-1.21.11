import { useMemo, useState } from 'react';
import type { Recipe } from '../types';
import { recipes } from '../lib/recipes';
import { ingredientCounts, itemLabel } from '../lib/items';
import { isCorrectName, numberOptions, pickRecipe } from '../lib/quiz';
import { applyAnswer, type ProgressState } from '../lib/progress';
import { CraftingGrid } from '../components/CraftingGrid';

type Kind = 'identify' | 'yield' | 'needed';
interface Question { recipe: Recipe; kind: Kind; ingredient?: { item: string; count: number }; options?: number[] }

function makeQuestion(progress: ProgressState): Question {
  const recipe = pickRecipe(recipes, progress);
  const kind = (['identify', 'yield', 'needed'] as const)[Math.floor(Math.random() * 3)]!;
  if (kind === 'yield') return { recipe, kind, options: numberOptions(recipe.result.count) };
  if (kind === 'needed') {
    const ings = ingredientCounts(recipe);
    const ingredient = ings[Math.floor(Math.random() * ings.length)]!;
    return { recipe, kind, ingredient, options: numberOptions(ingredient.count) };
  }
  return { recipe, kind };
}

export function Quiz({ progress, update }: { progress: ProgressState; update: (f: (s: ProgressState) => ProgressState) => void }) {
  const [q, setQ] = useState<Question>(() => makeQuestion(progress));
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<null | boolean>(null);
  const correctText = useMemo(() => {
    if (q.kind === 'identify') return q.recipe.name;
    return String(q.kind === 'yield' ? q.recipe.result.count : q.ingredient!.count);
  }, [q]);

  function submit(value: string) {
    if (result !== null) return;
    const correct = q.kind === 'identify' ? isCorrectName(value, q.recipe.name) : value === correctText;
    setResult(correct);
    update((s) => applyAnswer(s, q.recipe.id, { correct, typed: q.kind === 'identify', date: new Date().toISOString().slice(0, 10) }));
  }
  const next = () => { setQ(makeQuestion(progress)); setAnswer(''); setResult(null); };

  return (
    <section>
      <h1>Quiz</h1>
      <div className="panel">
        <CraftingGrid recipe={q.recipe} hideResult={q.kind === 'identify'} />
        {q.kind === 'identify' && (
          <form onSubmit={(e) => { e.preventDefault(); submit(answer); }}>
            <label>What does this recipe make? <input value={answer} onChange={(e) => setAnswer(e.target.value)} autoComplete="off" disabled={result !== null} /></label>
            <button type="submit" disabled={result !== null}>Check answer</button>
          </form>
        )}
        {q.kind !== 'identify' && (
          <div>
            <p>{q.kind === 'yield' ? `How many ${q.recipe.name} does one craft make?` : `How many ${itemLabel(q.ingredient!.item)} does ${q.recipe.name} need?`}</p>
            <div className="row">{q.options!.map((n) => <button key={n} disabled={result !== null} onClick={() => submit(String(n))}>{n}</button>)}</div>
          </div>
        )}
        <p role="status" aria-live="polite">
          {result === true && 'Correct!'}
          {result === false && `Not quite. The answer is ${correctText}.`}
        </p>
        {result !== null && <button onClick={next}>Next question</button>}
      </div>
    </section>
  );
}
