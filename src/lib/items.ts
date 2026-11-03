import type { Recipe } from '../types';

/** Cell values may be "a|b" when several items are accepted (e.g. coal or charcoal). */
export function itemLabel(id: string): string {
  return id
    .split('|')
    .map((part) => {
      const tag = part.startsWith('#');
      const base = part.replace(/^#/, '').replace(/^minecraft:/, '').replace(/_/g, ' ');
      const title = base.replace(/\b\w/g, (c) => c.toUpperCase());
      return tag ? `Any ${title}` : title;
    })
    .join(' or ');
}

export function ingredientCounts(recipe: Recipe): { item: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const cell of recipe.grid) if (cell) counts.set(cell, (counts.get(cell) ?? 0) + 1);
  return [...counts].map(([item, count]) => ({ item, count }));
}
