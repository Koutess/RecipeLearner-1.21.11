import { describe, expect, it } from 'vitest';
import { isCorrectName, levenshtein, numberOptions, pickRecipe } from './quiz';
import { recipes } from './recipes';

describe('isCorrectName', () => {
  it('ignores case and spacing', () => expect(isCorrectName('  diamond   PICKAXE ', 'Diamond Pickaxe')).toBe(true));
  it('allows one typo in medium names', () => expect(isCorrectName('Chesst', 'Chest')).toBe(true));
  it('allows two typos in long names', () => expect(isCorrectName('Diamnd Pickxe', 'Diamond Pickaxe')).toBe(true));
  it('rejects wrong items', () => expect(isCorrectName('Wooden Pickaxe', 'Diamond Pickaxe')).toBe(false));
  it('requires exact tiny names', () => expect(isCorrectName('Tn', 'Tnt')).toBe(false));
  it('rejects empty input', () => expect(isCorrectName('', 'Stick')).toBe(false));
});
describe('helpers', () => {
  it('levenshtein', () => expect(levenshtein('kitten', 'sitting')).toBe(3));
  it('numberOptions always includes the answer', () => expect(numberOptions(4)).toContain(4));
  it('pickRecipe returns a recipe', () => expect(recipes).toContain(pickRecipe(recipes, {})));
});
