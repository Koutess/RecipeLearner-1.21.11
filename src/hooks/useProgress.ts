import { useCallback, useEffect, useState } from 'react';
import { loadProgress, saveProgress, type ProgressState } from '../lib/progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  useEffect(() => saveProgress(progress), [progress]);
  const update = useCallback((fn: (s: ProgressState) => ProgressState) => setProgress(fn), []);
  const reset = useCallback(() => setProgress({}), []);
  return { progress, update, reset };
}
