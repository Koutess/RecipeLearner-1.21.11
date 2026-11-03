import { CATEGORIES } from '../types';

const ITEM = /^#?[a-z0-9_.]+:[a-z0-9_/.]+(\|#?[a-z0-9_.]+:[a-z0-9_/.]+)*$/;

/** Returns human-readable problems; an empty list means the data is structurally valid. */
export function validateRecipes(data: unknown): string[] {
  const errors: string[] = [];
  if (!Array.isArray(data)) return ['recipes.json must contain an array'];
  const ids = new Set<string>();
  const cats = new Set<string>(CATEGORIES.map((c) => c.id));
  data.forEach((r: any, i) => {
    const where = `recipe #${i} (${r?.id ?? 'no id'})`;
    if (typeof r?.id !== 'string' || !r.id) errors.push(`${where}: missing id`);
    else if (ids.has(r.id)) errors.push(`${where}: duplicate id`);
    else ids.add(r.id);
    if (typeof r?.name !== 'string' || !r.name) errors.push(`${where}: missing name`);
    if (!cats.has(r?.category)) errors.push(`${where}: invalid category "${r?.category}"`);
    if (r?.type !== 'shaped' && r?.type !== 'shapeless') errors.push(`${where}: invalid type`);
    if (!Array.isArray(r?.grid) || r.grid.length !== 9) errors.push(`${where}: grid must have 9 cells`);
    else {
      if (!r.grid.some((c: unknown) => c)) errors.push(`${where}: grid is empty`);
      if (r.grid.some((c: unknown) => c !== null && (typeof c !== 'string' || !ITEM.test(c))))
        errors.push(`${where}: grid contains an invalid item id`);
    }
    if (typeof r?.result?.item !== 'string' || !ITEM.test(r.result.item) || !Number.isInteger(r?.result?.count) || r.result.count < 1)
      errors.push(`${where}: invalid result`);
    if (typeof r?.verified !== 'boolean') errors.push(`${where}: "verified" must be true or false`);
    if (typeof r?.source !== 'string' || !r.source) errors.push(`${where}: missing source`);
  });
  return errors;
}
