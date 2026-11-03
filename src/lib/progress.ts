export interface RecipeProgress {
  discovered: boolean;
  learned: boolean;
  correct: number;
  wrong: number;
  /** Current run of correct answers. */
  streak: number;
  /** Distinct days (YYYY-MM-DD) on which the current run's answers were given. */
  streakDays: string[];
  /** Typed identify answers within the current run. */
  streakTyped: number;
}
export type ProgressState = Record<string, RecipeProgress>;
export type Status = 'new' | 'discovered' | 'learned' | 'mastered';

/** Mastery rule (decision pending your review): 3 correct in a row, over 2+ days, incl. 1+ typed answer. */
export const MASTERY = { streak: 3, days: 2, typed: 1 } as const;

const empty = (): RecipeProgress => ({ discovered: false, learned: false, correct: 0, wrong: 0, streak: 0, streakDays: [], streakTyped: 0 });
const get = (s: ProgressState, id: string) => ({ ...empty(), ...s[id] });

export const isMastered = (p?: RecipeProgress) =>
  !!p && p.streak >= MASTERY.streak && p.streakDays.length >= MASTERY.days && p.streakTyped >= MASTERY.typed;

export function statusOf(p?: RecipeProgress): Status {
  if (isMastered(p)) return 'mastered';
  if (p?.learned) return 'learned';
  if (p?.discovered) return 'discovered';
  return 'new';
}

export const markDiscovered = (s: ProgressState, id: string): ProgressState => ({ ...s, [id]: { ...get(s, id), discovered: true } });
export const markViewedInLesson = (s: ProgressState, id: string): ProgressState => ({ ...s, [id]: { ...get(s, id), discovered: true, learned: true } });

export function applyAnswer(s: ProgressState, id: string, a: { correct: boolean; typed: boolean; date: string }): ProgressState {
  const p = get(s, id);
  if (!a.correct) return { ...s, [id]: { ...p, discovered: true, wrong: p.wrong + 1, streak: 0, streakDays: [], streakTyped: 0 } };
  return {
    ...s,
    [id]: {
      ...p, discovered: true, learned: true, correct: p.correct + 1, streak: p.streak + 1,
      streakDays: p.streakDays.includes(a.date) ? p.streakDays : [...p.streakDays, a.date],
      streakTyped: p.streakTyped + (a.typed ? 1 : 0),
    },
  };
}

const KEY = 'mrm-progress-v1';
export function loadProgress(): ProgressState {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as ProgressState; } catch { return {}; }
}
export function saveProgress(s: ProgressState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: progress lasts for this session only */ }
}
