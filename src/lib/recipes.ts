import raw from '../data/recipes.json';
import type { Recipe } from '../types';
import { itemLabel } from './items';

export const recipes = raw as Recipe[];
export const recipeById = (id: string) => recipes.find((r) => r.id === id);

export function searchRecipes(list: Recipe[], query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (r) => r.name.toLowerCase().includes(q) || r.grid.some((c) => c && itemLabel(c).toLowerCase().includes(q)),
  );
}
