import type { ReactNode } from 'react';
import type { View } from '../App';
import { useStore } from '../store/useStore';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const NAV: { key: View; label: string; icon: string }[] = [
  { key: 'review', label: '学习', icon: '📇' },
  { key: 'quiz', label: '测验', icon: '✅' },
  { key: 'listen', label: '听说', icon: '🎧' },
  { key: 'vocab', label: '词库', icon: '📚' },
  { key: 'import', label: '导入', icon: '⬆️' },
  { key: 'progress', label: '进度', icon: '📈' },
  { key: 'settings', label: '设置', icon: '⚙️' },
];

export default function Layout({
  view,
  setView,
  children,
}: {
  view: View;
  setView: (v: View) => void;
  children: ReactNode;
}) {
  const syncing = useStore((s) => s.syncing);
  const syncError = useStore((s) => s.syncError);
  const user = useStore((s) => s.user);

  const status = !isSupabaseConfigured
    ? '本地模式'
    : syncError
    ? '同步失败'
    : syncing
    ? '同步中…'
    : '已同步';

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">🎧 英语听说</div>
        <div className="status">
          <span className={'dot ' + (syncError ? 'err' : syncing ? 'busy' : 'ok')} />
          <span>{status}</span>
          {isSupabaseConfigured && user && (
            <button className="link" onClick={() => supabase?.auth.signOut()}>
              退出
            </button>
          )}
        </div>
      </header>

      <main className="content">{children}</main>

      <nav className="bottomnav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={view === n.key ? 'navbtn active' : 'navbtn'}
            onClick={() => setView(n.key)}
          >
            <span className="ic">{n.icon}</span>
            <span className="lb">{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
