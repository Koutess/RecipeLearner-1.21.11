import { describe, expect, it } from 'vitest';
import { applyAnswer, isMastered, markDiscovered, statusOf, type ProgressState } from './progress';

const ok = (s: ProgressState, date: string, typed = true) => applyAnswer(s, 'x', { correct: true, typed, date });

describe('progress', () => {
  it('discovered then learned on first correct answer', () => {
    let s = markDiscovered({}, 'x');
    expect(statusOf(s.x)).toBe('discovered');
    s = ok(s, '2026-11-03');
    expect(statusOf(s.x)).toBe('learned');
  });
  it('needs 3 in a row over 2 days with a typed answer', () => {
    let s = ok({}, '2026-11-03');
    s = ok(s, '2026-11-03');
    s = ok(s, '2026-11-03');
    expect(isMastered(s.x)).toBe(false);
    s = ok(s, '2026-11-04');
    expect(isMastered(s.x)).toBe(true);
  });
  it('typed answers are required', () => {
    let s = ok({}, '2026-11-03', false);
    s = ok(s, '2026-11-04', false);
    s = ok(s, '2026-11-05', false);
    expect(isMastered(s.x)).toBe(false);
  });
  it('a wrong answer resets the run but keeps learned', () => {
    let s = ok({}, '2026-11-03');
    s = applyAnswer(s, 'x', { correct: false, typed: true, date: '2026-11-04' });
    expect(s.x!.streak).toBe(0);
    expect(s.x!.wrong).toBe(1);
    expect(statusOf(s.x)).toBe('learned');
  });
});
