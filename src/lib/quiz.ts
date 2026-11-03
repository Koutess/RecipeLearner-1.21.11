import type { Recipe } from '../types';
import type { ProgressState } from './progress';

export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)] as number[]);
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length]![b.length]!;
}

/** Typo tolerance: short names must be exact, medium names allow 1 typo, long names allow 2. */
export function isCorrectName(input: string, answer: string): boolean {
  const a = normalize(input), b = normalize(answer);
  if (!a) return false;
  const allowed = b.length <= 4 ? 0 : b.length <= 9 ? 1 : 2;
  return levenshtein(a, b) <= allowed;
}

/** Recipes you get wrong are more likely to come up again. */
export function pickRecipe(list: Recipe[], progress: ProgressState, rng: () => number = Math.random): Recipe {
  const weights = list.map((r) => 1 + 3 * (progress[r.id]?.wrong ?? 0) + (progress[r.id]?.streak ? 0 : 1));
  let roll = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) {
    roll -= weights[i]!;
    if (roll <= 0) return list[i]!;
  }
  return list[list.length - 1]!;
}

export function numberOptions(correct: number, rng: () => number = Math.random): number[] {
  const set = new Set<number>([correct]);
  const pool = [1, 2, 3, 4, 5, 6, 8, 9, 12, 16].filter((n) => n !== correct);
  while (set.size < 4 && pool.length) set.add(pool.splice(Math.floor(rng() * pool.length), 1)[0]!);
  return [...set].sort((a, b) => a - b);
}
