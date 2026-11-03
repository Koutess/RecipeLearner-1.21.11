import type { Recipe } from '../types';
import { CATEGORIES } from '../types';
import { ingredientCounts, itemLabel } from '../lib/items';
import { CraftingGrid } from './CraftingGrid';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const cat = CATEGORIES.find((c) => c.id === recipe.category)?.label;
  return (
    <article className="panel">
      <h3>{recipe.name}</h3>
      <CraftingGrid recipe={recipe} />
      <p>Makes {recipe.result.count} · {recipe.type === 'shaped' ? 'Shaped: position matters' : 'Shapeless: any arrangement'} · {cat}</p>
      <ul>{ingredientCounts(recipe).map((i) => <li key={i.item}>{i.count} × {itemLabel(i.item)}</li>)}</ul>
      {recipe.notes && <p>{recipe.notes}</p>}
      {!recipe.verified && <p className="warn">Not yet verified against 1.21.11 data.</p>}
    </article>
  );
}
