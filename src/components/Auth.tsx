import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store/useStore';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const setUser = useStore((s) => s.setUser);
  const hydrate = useStore((s) => s.hydrateFromCloud);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMsg('');
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session?.user) {
          setUser({ id: data.session.user.id, email: data.session.user.email || '' });
          await hydrate();
        } else {
          setMsg('注册成功！如果收到验证邮件，请先查收并点击确认，再登录。');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session?.user) {
          setUser({ id: data.session.user.id, email: data.session.user.email || '' });
          await hydrate();
        }
      }
    } catch (e: any) {
      setMsg(e?.message || '操作失败');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1>英语听说学习</h1>
        <p className="muted">登录后即可在手机与电脑间同步学习进度</p>
        <div className="seg">
          <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>
            登录
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
            注册
          </button>
        </div>
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="密码（至少 6 位）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button className="primary" disabled={busy}>
            {busy ? '处理中…' : mode === 'signin' ? '登录' : '注册并登录'}
          </button>
        </form>
        {msg && <p className="msg">{msg}</p>}
      </div>
    </div>
  );
}
