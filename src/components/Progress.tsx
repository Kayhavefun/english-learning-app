import { useMemo } from 'react';
import { useAllWords, wordKeyOf } from '../lib/words';
import { useStore } from '../store/useStore';
import ProgressCharts from './charts/ProgressCharts';

function todayKeyStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function Progress() {
  const words = useAllWords();
  const review = useStore((s) => s.review);
  const dayStats = useStore((s) => s.dayStats);
  const studyLog = useStore((s) => s.studyLog);
  const moduleLog = useStore((s) => s.moduleLog);

  const total = words.length;
  const learned = useMemo(
    () => words.filter((w) => review[wordKeyOf(w.text)]).length,
    [words, review]
  );
  const mastered = useMemo(
    () => words.filter((w) => review[wordKeyOf(w.text)]?.box === 5).length,
    [words, review]
  );

  const today = todayKeyStr();
  const studiedToday = studyLog[today]?.length ?? 0;
  const listeningTotal = Object.values(moduleLog).reduce((a, b) => a + b.listening, 0);
  const speakingTotal = Object.values(moduleLog).reduce((a, b) => a + b.speaking, 0);
  const listeningToday = moduleLog[today]?.listening ?? 0;
  const speakingToday = moduleLog[today]?.speaking ?? 0;

  const totalReviewed = dayStats.reduce((a, b) => a + b.reviewed, 0);
  const totalCorrect = dayStats.reduce((a, b) => a + b.correct, 0);
  const accuracy = totalReviewed ? Math.round((totalCorrect / totalReviewed) * 100) : 0;

  // 连续学习天数
  const dates = new Set(dayStats.filter((d) => d.reviewed > 0).map((d) => d.date));
  let streak = 0;
  const d = new Date();
  while (dates.has(todayKeyStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // 近 7 天正确率
  const last7: { date: string; acc: number }[] = [];
  const base = new Date();
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(base);
    dt.setDate(base.getDate() - i);
    const k = todayKeyStr(dt);
    const s = dayStats.find((x) => x.date === k);
    last7.push({ date: k.slice(5), acc: s && s.reviewed ? Math.round((s.correct / s.reviewed) * 100) : 0 });
  }

  return (
    <section className="card-page">
      <h2>学习进度</h2>

      <div className="module-grid">
        <div className="module-card words">
          <div className="mc-head">📇 单词</div>
          <div className="mc-main">
            <b>{learned}</b>
            <span>已学习 / 共 {total}</span>
          </div>
          <div className="mc-row">
            <span>今日学过</span>
            <b>{studiedToday}</b>
          </div>
          <div className="mc-row">
            <span>已掌握</span>
            <b>{mastered}</b>
          </div>
        </div>

        <div className="module-card listen">
          <div className="mc-head">🎧 听力</div>
          <div className="mc-main">
            <b>{listeningTotal}</b>
            <span>累计文章</span>
          </div>
          <div className="mc-row">
            <span>今日阅读</span>
            <b>{listeningToday}</b>
          </div>
          <div className="mc-row muted">每日一篇商务 / 工程文章</div>
        </div>

        <div className="module-card speak">
          <div className="mc-head">🎤 口语</div>
          <div className="mc-main">
            <b>{speakingTotal}</b>
            <span>累计练习</span>
          </div>
          <div className="mc-row">
            <span>今日练习</span>
            <b>{speakingToday}</b>
          </div>
          <div className="mc-row muted">BEC 口语题库跟读</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{streak}</b>
          <span>连续天数</span>
        </div>
        <div className="stat">
          <b>{accuracy}%</b>
          <span>累计正确率</span>
        </div>
        <div className="stat">
          <b>{totalReviewed}</b>
          <span>累计题数</span>
        </div>
      </div>

      <ProgressCharts masteredRatio={total ? mastered / total : 0} last7={last7} />
    </section>
  );
}
