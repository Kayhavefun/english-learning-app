import { useMemo, useState } from 'react';
import { useAllWords, wordKeyOf } from '../lib/words';
import { speak } from '../lib/speech';
import { isDue } from '../lib/srs';
import { useStore } from '../store/useStore';
import type { Word } from '../types';

type Mode = 'meaning' | 'recognize';

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function shuffle<T>(a: T[]): T[] {
  return [...a].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const words = useAllWords();
  const reviewWord = useStore((s) => s.reviewWord);
  const profile = useStore((s) => s.profile);
  const studyLog = useStore((s) => s.studyLog);

  const [mode, setMode] = useState<Mode | null>(null);
  const [qs, setQs] = useState<Word[]>([]);
  const [qi, setQi] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [poolNote, setPoolNote] = useState('');

  const todayStudied = studyLog[todayStr()] ?? [];
  const studiedCount = todayStudied.length;

  // 构建题源：优先今日学过的词，不足则用待复习词补足，最少 4 题
  function buildPool(): { pool: Word[]; note: string } {
    const studiedSet = new Set(todayStudied);
    let pool = words.filter((w) => studiedSet.has(wordKeyOf(w.text)));
    let note = `题源：今日学过的 ${pool.length} 个词`;
    if (pool.length < 4) {
      const extra = words
        .filter((w) => !studiedSet.has(wordKeyOf(w.text)) && isDue(useStore.getState().review[wordKeyOf(w.text)]))
        .slice(0, 4 - pool.length);
      pool = [...pool, ...extra];
      note = `今日学的词不足，已用「待复习」词补足至 ${pool.length} 题`;
    }
    if (pool.length === 0) {
      pool = shuffle(words).slice(0, Math.min(10, words.length));
      note = `先去「复习」学几个词，这里先用全库随机题`;
    }
    return { pool: shuffle(pool).slice(0, Math.min(12, pool.length)), note };
  }

  function start(m: Mode) {
    const { pool, note } = buildPool();
    setMode(m);
    setQs(pool);
    setQi(0);
    setDone(false);
    setAnswered(false);
    setPicked(null);
    setScore(0);
    setPoolNote(note);
  }

  function back() {
    setMode(null);
    setQs([]);
  }

  function answer(correct: boolean, chosen?: string) {
    if (answered) return;
    setAnswered(true);
    setPicked(chosen ?? null);
    reviewWord(wordKeyOf(qs[qi].text), correct);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qi + 1 >= qs.length) setDone(true);
      else {
        setQi(qi + 1);
        setAnswered(false);
        setPicked(null);
      }
    }, 1000);
  }

  const q = qs[qi];

  const options = useMemo(() => {
    if (!q) return [];
    const others = shuffle(words.filter((w) => w.text !== q.text))
      .slice(0, 3)
      .map((w) => w.meaning);
    return shuffle([q.meaning, ...others]);
  }, [q, words]);

  // 开始界面
  if (mode === null) {
    return (
      <section className="card-page">
        <h2>测验闯关</h2>
        <p className="muted">
          用 <b>今天在「复习」里学过的单词</b> 来测验，结果会计入记忆追踪。
          今日已学 <b>{studiedCount}</b> 个词。
        </p>
        <div className="quiz-modes">
          <button className="quiz-card" onClick={() => start('meaning')}>
            <div className="qc-ic">🔤</div>
            <div className="qc-t">选择词义</div>
            <div className="qc-d">看英文单词，选出正确中文释义</div>
          </button>
          <button className="quiz-card" onClick={() => start('recognize')}>
            <div className="qc-ic">🧠</div>
            <div className="qc-t">是否记得</div>
            <div className="qc-d">看英文单词，凭印象点「记得 / 不记得」</div>
          </button>
        </div>
        {studiedCount === 0 && (
          <p className="warn">提示：你今天还没在「复习」里学过词，测验将先用「待复习」词。</p>
        )}
      </section>
    );
  }

  if (done) {
    return (
      <section className="card-page">
        <div className="empty">✅ 测验完成！得分 {score} / {qs.length}</div>
        <button className="primary big" onClick={() => start(mode)}>
          再来一次
        </button>
        <button className="link" onClick={back}>
          返回
        </button>
      </section>
    );
  }

  return (
    <section className="card-page">
      <div className="prog">
        第 {qi + 1} / {qs.length} 题 · 得分 {score}
        <span className="muted" style={{ marginLeft: 8 }}>{poolNote}</span>
      </div>

      <div className="quiz-q">
        <div className="quiz-word">{q.text}</div>
        <SpeakButtonInline text={q.text} voiceName={profile.ttsVoice} />
        {q.phonetic && <span className="quiz-phon">{q.phonetic}</span>}
      </div>

      {mode === 'meaning' ? (
        <div className="opts">
          {options.map((o, i) => (
            <button
              key={i}
              className={
                'opt' +
                (answered && picked === o ? (o === q.meaning ? ' correct' : ' wrong') : '')
              }
              disabled={answered}
              onClick={() => answer(o === q.meaning, o)}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div className="recog">
          <p className="muted">看到这个单词，你能想起它的意思吗？</p>
          <div className="recog-btns">
            <button
              className="good big"
              disabled={answered}
              onClick={() => answer(true)}
            >
              ✅ 记得
            </button>
            <button
              className="bad big"
              disabled={answered}
              onClick={() => answer(false)}
            >
              ❌ 不记得
            </button>
          </div>
          {answered && (
            <div className="quiz-reveal">
              <span className="biz-tag">释义</span> {q.meaning}
              {q.example && (
                <div className="muted" style={{ marginTop: 6 }}>
                  {q.example}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function SpeakButtonInline({ text, voiceName }: { text: string; voiceName?: string }) {
  return (
    <button
      className="speak-btn"
      style={{ position: 'static', marginTop: 8 }}
      onClick={() => speak(text, 'en-US', voiceName)}
      title="朗读单词"
    >
      🔊
    </button>
  );
}
