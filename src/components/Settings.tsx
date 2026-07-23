import { useEffect, useState } from 'react';
import { getVoices } from '../lib/speech';
import { useStore } from '../store/useStore';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function Settings() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const user = useStore((s) => s.user);
  const resetLocalData = useStore((s) => s.resetLocalData);
  const [voices, setVoices] = useState(getVoices());

  useEffect(() => {
    const update = () => setVoices(getVoices());
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = update;
      update();
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <section className="card-page">
      <h2>设置</h2>

      <div className="field">
        <label>朗读语音（TTS）</label>
        <select
          value={profile.ttsVoice || ''}
          onChange={(e) => setProfile({ ttsVoice: e.target.value || undefined })}
        >
          <option value="">默认语音</option>
          {voices
            .filter((v) => v.lang.startsWith('en'))
            .map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}（{v.lang}）
              </option>
            ))}
        </select>
      </div>

      <div className="field">
        <label>每日复习目标（个）</label>
        <input
          type="number"
          min={1}
          max={200}
          value={profile.dailyGoal}
          onChange={(e) => setProfile({ dailyGoal: Number(e.target.value) || 20 })}
        />
      </div>

      <div className="field row">
        <label>启用口语评测</label>
        <input
          type="checkbox"
          checked={profile.speakingEnabled}
          onChange={(e) => setProfile({ speakingEnabled: e.target.checked })}
        />
      </div>

      <div className="account">
        <h3>账户</h3>
        {!isSupabaseConfigured ? (
          <p className="muted">
            当前为「本地模式」：数据仅保存在本浏览器，无法多端同步。配置 Supabase 后可登录同步。
          </p>
        ) : user ? (
          <p>
            已登录：<b>{user.email}</b>{' '}
            <button className="link" onClick={() => supabase?.auth.signOut()}>
              退出登录
            </button>
          </p>
        ) : (
          <p className="muted">未登录。</p>
        )}
      </div>

      <div className="danger">
        <button
          className="bad"
          onClick={() => {
            if (window.confirm('确定清空本地词表与进度？此操作不可恢复。')) resetLocalData();
          }}
        >
          清空本地数据
        </button>
      </div>
    </section>
  );
}
