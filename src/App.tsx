import { useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import { Dashboard } from './pages/Dashboard';
import { Browse } from './pages/Browse';
import { Learn } from './pages/Learn';
import { Quiz } from './pages/Quiz';
import { ProgressPage } from './pages/Progress';

export type Page = 'dashboard' | 'browse' | 'learn' | 'quiz' | 'progress';
const NAV: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'browse', label: 'Browse' }, { id: 'learn', label: 'Learn' },
  { id: 'quiz', label: 'Quiz' }, { id: 'progress', label: 'Progress' },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const { progress, update, reset } = useProgress();
  const { theme, toggle } = useTheme();
  return (
    <div className="shell">
      <nav aria-label="Main">
        <strong className="brand">Recipe Mastery</strong>
        {NAV.map((n) => <button key={n.id} aria-current={page === n.id ? 'page' : undefined} onClick={() => setPage(n.id)}>{n.label}</button>)}
        <button className="theme" onClick={toggle}>Theme: {theme === 'overworld' ? 'Overworld' : 'Deepslate'}</button>
      </nav>
      <main>
        {page === 'dashboard' && <Dashboard progress={progress} go={setPage} />}
        {page === 'browse' && <Browse progress={progress} update={update} />}
        {page === 'learn' && <Learn progress={progress} update={update} />}
        {page === 'quiz' && <Quiz progress={progress} update={update} />}
        {page === 'progress' && <ProgressPage progress={progress} reset={reset} />}
      </main>
    </div>
  );
}
