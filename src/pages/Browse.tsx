import { useState } from 'react';
import { CATEGORIES, type Category } from '../types';
import { recipes, searchRecipes } from '../lib/recipes';
import { markDiscovered, type ProgressState } from '../lib/progress';
import { RecipeCard } from '../components/RecipeCard';

export function Browse({ update }: { progress: ProgressState; update: (f: (s: ProgressState) => ProgressState) => void }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const list = searchRecipes(recipes.filter((r) => cat === 'all' || r.category === cat), q);
  const open = recipes.find((r) => r.id === openId);
  return (
    <section>
      <h1>Browse recipes</h1>
      <div className="row">
        <label>Search by item or ingredient <input type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label>Category <select value={cat} onChange={(e) => setCat(e.target.value as Category | 'all')}>
          <option value="all">All</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select></label>
      </div>
      <p aria-live="polite">{list.length} recipes</p>
      <ul className="list">{list.map((r) => (
        <li key={r.id}><button className="link" onClick={() => { setOpenId(r.id); update((s) => markDiscovered(s, r.id)); }}>{r.name}</button></li>
      ))}</ul>
      {open && <RecipeCard recipe={open} />}
    </section>
  );
}
