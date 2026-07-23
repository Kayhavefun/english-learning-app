import { useEffect, useState } from 'react';
import { initAuth, useStore } from './store/useStore';
import { isSupabaseConfigured } from './lib/supabaseClient';
import Auth from './components/Auth';
import Layout from './components/Layout';
import VocabularyList from './components/VocabularyList';
import Flashcard from './components/Flashcard';
import Quiz from './components/Quiz';
import ListeningSpeaking from './components/ListeningSpeaking';
import ImportWords from './components/ImportWords';
import Progress from './components/Progress';
import Settings from './components/Settings';

export type View = 'vocab' | 'review' | 'quiz' | 'listen' | 'import' | 'progress' | 'settings';

export default function App() {
  const [view, setView] = useState<View>('review');
  const user = useStore((s) => s.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAuth().finally(() => setReady(true));
  }, []);

  if (!ready) return <div className="loading">加载中…</div>;

  // 配置了云端但还没登录：先登录
  if (isSupabaseConfigured && !user) return <Auth />;

  return (
    <Layout view={view} setView={setView}>
      {view === 'vocab' && <VocabularyList />}
      {view === 'review' && <Flashcard />}
      {view === 'quiz' && <Quiz />}
      {view === 'listen' && <ListeningSpeaking />}
      {view === 'import' && <ImportWords />}
      {view === 'progress' && <Progress />}
      {view === 'settings' && <Settings />}
    </Layout>
  );
}
