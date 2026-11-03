import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '../types';
import { recipes } from '../lib/recipes';
import { markViewedInLesson, type ProgressState } from '../lib/progress';
import { RecipeCard } from '../components/RecipeCard';

const LESSON_SIZE = 4;

export function Learn({ update }: { progress: ProgressState; update: (f: (s: ProgressState) => ProgressState) => void }) {
  // Guided lessons: each in-game category is split into short lessons of related recipes.
  const lessons = useMemo(() => CATEGORIES.flatMap((c) => {
    const list = recipes.filter((r) => r.category === c.id);
    return Array.from({ length: Math.ceil(list.length / LESSON_SIZE) }, (_, i) => ({
      title: `${c.label} ${i + 1}`, recipes: list.slice(i * LESSON_SIZE, (i + 1) * LESSON_SIZE),
    }));
  }), []);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [free, setFree] = useState('');
  const lesson = lessons[lessonIdx];
  const current = free ? recipes.find((r) => r.id === free) : lesson?.recipes[step];
  useEffect(() => { if (current) update((s) => markViewedInLesson(s, current.id)); }, [current?.id]);
  if (!lesson) return <p>No lessons yet.</p>;
  return (
    <section>
      <h1>Learn</h1>
      <div className="row">
        <label>Lesson <select value={lessonIdx} onChange={(e) => { setLessonIdx(+e.target.value); setStep(0); setFree(''); }}>
          {lessons.map((l, i) => <option key={l.title} value={i}>{l.title}</option>)}</select></label>
        <label>Or pick any recipe <select value={free} onChange={(e) => setFree(e.target.value)}>
          <option value="">Follow the lesson</option>{recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      </div>
      {current && <RecipeCard recipe={current} />}
      {!free && (
        <div className="row">
          <button disabled={step === 0} onClick={() => setStep(step - 1)}>Previous</button>
          <span>Recipe {step + 1} of {lesson.recipes.length}</span>
          <button disabled={step >= lesson.recipes.length - 1} onClick={() => setStep(step + 1)}>Next</button>
        </div>
      )}
    </section>
  );
}
