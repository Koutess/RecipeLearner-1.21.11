import { useEffect, useState } from 'react';

export type Theme = 'overworld' | 'deepslate';
const KEY = 'mrm-theme-v1';

function initial(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'overworld' || saved === 'deepslate') return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'deepslate' : 'overworld';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  }, [theme]);
  return { theme, toggle: () => setTheme((t) => (t === 'overworld' ? 'deepslate' : 'overworld')) };
}
