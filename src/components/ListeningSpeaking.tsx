import { useMemo, useState, type ReactNode } from 'react';
import { articles, todaysArticle, type Article } from '../data/articles';
import { speakingPrompts, type SpeakingPrompt } from '../data/becSpeaking';
import { speak, recognize, isRecognitionSupported } from '../lib/speech';
import { comparePronunciation, passedPronunciation, type WordMatch } from '../lib/text';
import { useStore } from '../store/useStore';

// 把段落中的重点词汇高亮为可点击按钮
function Highlighted({
  text,
  terms,
  onPick,
}: {
  text: string;
  terms: { term: string; meaning: string }[];
  onPick: (t: { term: string; meaning: string }) => void;
}) {
  if (!terms.length) return <>{text}</>;
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  const rx = new RegExp(`\\b(${sorted.map((t) => esc(t.term)).join('|')})\\b`, 'gi');
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = rx.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const matched = m[0];
    const termObj = terms.find((t) => t.term.toLowerCase() === matched.toLowerCase());
    out.push(
      <button
        key={`kw-${key++}`}
        className="kw"
        onClick={(e) => {
          e.stopPropagation();
          onPick({ term: matched, meaning: termObj?.meaning ?? '' });
        }}
      >
        {matched}
      </button>
    );
    last = m.index + matched.length;
    if (m.index === rx.lastIndex) rx.lastIndex++;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export default function ListeningSpeaking() {
  const profile = useStore((s) => s.profile);
  const recordListening = useStore((s) => s.recordListening);
  const recordSpeaking = useStore((s) => s.recordSpeaking);
  const recSupported = isRecognitionSupported();
  const [tab, setTab] = useState<'listen' | 'speak'>('listen');

  const [article, setArticle] = useState<Article | null>(null);
  const [reading, setReading] = useState(false);
  const [activeTerm, setActiveTermState] = useState<{ term: string; meaning: string } | null>(null);
  const [counted, setCounted] = useState<Set<string>>(new Set());

  const today = useMemo(() => todaysArticle(), []);

  function openArticle(a: Article) {
    setArticle(a);
    setActiveTermState(null);
    if (!counted.has(a.id)) {
      recordListening();
      setCounted((s) => new Set(s).add(a.id));
    }
  }

  function readAll() {
    if (reading) {
      window.speechSynthesis.cancel();
      setReading(false);
      return;
    }
    if (!article) return;
    setReading(true);
    const paras = article.paragraphs;
    let i = 0;
    const speakNext = () => {
      if (i >= paras.length) {
        setReading(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(paras[i]);
      u.lang = 'en-US';
      if (profile.ttsVoice) {
        const v = window.speechSynthesis.getVoices().find((x) => x.name === profile.ttsVoice);
        if (v) u.voice = v;
      }
      u.onend = () => {
        i++;
        speakNext();
      };
      u.onerror = () => setReading(false);
      window.speechSynthesis.speak(u);
    };
    speakNext();
  }

  // ---------------- 口语 ----------------
  const [prompt, setPrompt] = useState<SpeakingPrompt | null>(null);
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<{ matches: WordMatch[]; score: number } | null>(null);
  const [spoken, setSpoken] = useState('');

  function pickPrompt(p: SpeakingPrompt) {
    setPrompt(p);
    setResult(null);
    setSpoken('');
  }
  function randomPrompt() {
    const p = speakingPrompts[Math.floor(Math.random() * speakingPrompts.length)];
    pickPrompt(p);
  }
  function record() {
    if (!recSupported || !prompt || listening) return;
    setListening(true);
    setResult(null);
    setSpoken('');
    recognize(
      'en-US',
      (transcript) => {
        setListening(false);
        setSpoken(transcript);
        setResult(comparePronunciation(prompt.prompt, transcript));
        recordSpeaking();
      },
      () => setListening(false)
    );
  }

  return (
    <section className="card-page">
      <h2>听力 · 口语</h2>
      <div className="seg">
        <button className={tab === 'listen' ? 'active' : ''} onClick={() => setTab('listen')}>
          听力（每日文章）
        </button>
        <button className={tab === 'speak' ? 'active' : ''} onClick={() => setTab('speak')}>
          口语（BEC 题库）
        </button>
      </div>

      {tab === 'listen' ? (
        article ? (
          <div className="reader">
            <button className="link" onClick={() => setArticle(null)}>
              ← 返回文章列表
            </button>
            <div className="reader-head">
              <span className="topic-badge">{article.topicLabel}</span>
              {article.id === today.id && <span className="today-badge">今日推荐</span>}
            </div>
            <h3 className="reader-title">{article.title}</h3>
            <div className="reader-tools">
              <button className="primary" onClick={readAll}>
                {reading ? '⏹ 停止朗读' : '🔊 朗读全文'}
              </button>
              <span className="muted">点击文中高亮词查看中文</span>
            </div>
            <div className="reader-body">
              {article.paragraphs.map((p, i) => (
                <p key={i}>
                  <Highlighted text={p} terms={article.keyTerms} onPick={setActiveTermState} />
                </p>
              ))}
            </div>
            {activeTerm && (
              <div className="kw-pop" onClick={() => setActiveTermState(null)}>
                <div className="kw-pop-inner" onClick={(e) => e.stopPropagation()}>
                  <b>{activeTerm.term}</b>
                  <span>{activeTerm.meaning}</span>
                  <button className="link" onClick={() => setActiveTermState(null)}>
                    关闭
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="article-list">
            <p className="muted">每日一篇商务 / 金融 / 工程文章，可阅读、可听读，重点词汇点击翻译。</p>
            {articles.map((a) => (
              <button key={a.id} className="article-card" onClick={() => openArticle(a)}>
                <div className="ac-top">
                  <span className="topic-badge">{a.topicLabel}</span>
                  {a.id === today.id && <span className="today-badge">今日推荐</span>}
                </div>
                <div className="ac-title">{a.title}</div>
                <div className="ac-meta">约 {a.paragraphs.join(' ').split(/\s+/).length} 词 · {a.keyTerms.length} 个重点词</div>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="speak-box">
          {!recSupported && (
            <div className="warn">当前浏览器不支持语音识别，请使用 Chrome 或 Edge 体验口语评测。</div>
          )}
          {!prompt ? (
            <>
              <p className="muted">BEC 口语题库：面试问答、个人小演讲、协作讨论。选一道开始练习。</p>
              <div className="prompt-list">
                {speakingPrompts.map((p) => (
                  <button key={p.id} className="prompt-chip" onClick={() => pickPrompt(p)}>
                    <span className="pc-part">{p.partLabel}</span>
                    <span className="pc-title">{p.title}</span>
                  </button>
                ))}
              </div>
              <button className="primary big" onClick={randomPrompt} disabled={!recSupported}>
                随机一道
              </button>
            </>
          ) : (
            <>
              <button className="link" onClick={() => setPrompt(null)}>
                ← 返回题库
              </button>
              <div className="prompt-detail">
                <span className="topic-badge">{prompt.partLabel}</span>
                <h3>{prompt.title}</h3>
                <p className="prompt-text">{prompt.prompt}</p>
                {prompt.bullets && (
                  <ul className="prompt-bullets">
                    {prompt.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                {prompt.prepSec && (
                  <p className="muted">准备时间约 {Math.floor(prompt.prepSec / 60)} 分钟</p>
                )}
                {prompt.tip && <p className="tip">💡 {prompt.tip}</p>}
              </div>
              <div className="fc-actions">
                <button className="speak-inline" onClick={() => speak(prompt.prompt, 'en-US', profile.ttsVoice)}>
                  🔊 听题
                </button>
                <button className="primary" onClick={record} disabled={!recSupported || listening}>
                  {listening ? '聆听中…' : '🎤 开始录音'}
                </button>
                <button className="link" onClick={randomPrompt}>
                  换一道
                </button>
              </div>
              {result && (
                <div className="result">
                  <div className={'verdict ' + (passedPronunciation(result.score) ? 'pass' : 'fail')}>
                    {passedPronunciation(result.score) ? '通过 ✅' : '需练习 🔁'}（匹配度{' '}
                    {Math.round(result.score * 100)}%）
                  </div>
                  <div className="words">
                    {result.matches.map((m, i) => (
                      <span key={i} className={m.ok ? 'w ok' : 'w no'}>
                        {m.word}
                      </span>
                    ))}
                  </div>
                  {spoken && <p className="muted">你说的是：{spoken}</p>}
                  <p className="muted">绿色为读对，灰色为未识别到的词。</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
