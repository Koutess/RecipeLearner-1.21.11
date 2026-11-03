import { describe, expect, it } from 'vitest';
import raw from '../data/recipes.json';
import { validateRecipes } from './validate';

describe('recipe data', () => {
  it('is structurally valid', () => expect(validateRecipes(raw)).toEqual([]));
  it('validator catches problems', () => {
    expect(validateRecipes([{ id: 'a' }]).length).toBeGreaterThan(0);
    expect(validateRecipes('nope')).toHaveLength(1);
  });
});
