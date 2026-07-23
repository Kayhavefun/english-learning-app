import { useMemo, useRef, useState } from 'react';
import { useAllWords, wordKeyOf, shuffleWords } from '../lib/words';
import { useStore } from '../store/useStore';
import type { Word } from '../types';
import SpeakButton from './SpeakButton';

type SubTab = 'new' | 'review';

export default function Flashcard() {
  const words = useAllWords();
  const profile = useStore((s) => s.profile);
  const markStudied = useStore((s) => s.markStudied);
  const studyLog = useStore((s) => s.studyLog);

  // 今日日期
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // 今日已学过的单词文本集合
  const todayStudiedSet = useMemo(() => new Set(studyLog[today] ?? []), [studyLog, today]);

  // 历史累计学过的单词文本集合
  const allTimeStudiedSet = useMemo(() => {
    const set = new Set<string>();
    for (const date of Object.keys(studyLog)) {
      for (const w of studyLog[date] ?? []) set.add(w);
    }
    return set;
  }, [studyLog]);

  // 复习列表（按最近学习日期倒序），仅用于进入复习 tab 时冻结
  const reviewWordsComputed = useMemo(() => {
    const lastDate = new Map<string, string>();
    for (const date of Object.keys(studyLog).sort()) {
      for (const w of studyLog[date] ?? []) lastDate.set(w, date);
    }
    return words
      .filter((w) => allTimeStudiedSet.has(wordKeyOf(w.text)))
      .sort((a, b) => {
        const da = lastDate.get(wordKeyOf(a.text)) ?? '';
        const db = lastDate.get(wordKeyOf(b.text)) ?? '';
        return db.localeCompare(da); // 最近学的排前面
      });
  }, [words, allTimeStudiedSet, studyLog]);

  // 根据子标签构建一份"待学习"列表
  function buildList(t: SubTab): Word[] {
    if (t === 'new') {
      return shuffleWords(
        words.filter((w) => !todayStudiedSet.has(wordKeyOf(w.text))),
        Math.floor(Math.random() * 1e9)
      );
    }
    return reviewWordsComputed;
  }

  const [tab, setTab] = useState<SubTab>('new');
  // ★ 显示用列表：进入某 tab 时"冻结"，学习中 markStudied 不再导致列表位移/重排
  const [displayList, setDisplayList] = useState<Word[]>(() => buildList('new'));

  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // 防连击锁：揭示后吞掉紧随的第二次点击（触屏 touch+click 双发），避免一次点完两步
  const justRevealedRef = useRef(false);

  // 切换子标签时重建冻结列表并重置状态
  function switchTab(t: SubTab) {
    justRevealedRef.current = false;
    setTab(t);
    setDisplayList(buildList(t));
    setIdx(0);
    setRevealed(false);
  }

  // 词库为空
  if (words.length === 0) {
    return (
      <section className="card-page">
        <div className="empty">词库为空，请先导入或开启内置词库。</div>
      </section>
    );
  }

  const activeList = displayList;
  const safeIdx = Math.min(idx, activeList.length - 1);
  const w = activeList[safeIdx];

  // 列表为空提示
  if (!w) {
    return (
      <section className="card-page">
        <div className="learn-tabs">
          <button className={tab === 'new' ? 'active' : ''} onClick={() => switchTab('new')}>
            今日新词 ({displayList.length})
          </button>
          <button className={tab === 'review' ? 'active' : ''} onClick={() => switchTab('review')}>
            复习 ({displayList.length})
          </button>
        </div>
        <div className="empty">
          {tab === 'new'
            ? '🎉 今天的新词都学完了！去「复习」巩固一下吧。'
            : '🎉 还没学过任何单词。去「今日新词」开始学习吧！'}
        </div>
      </section>
    );
  }

  function nextOne() {
    justRevealedRef.current = false;
    setRevealed(false);
    setIdx(safeIdx + 1);
  }

  function reveal() {
    markStudied(w.text);
    setRevealed(true);
  }

  // 卡片统一点击：未揭示→揭示，已揭示→下一张（鼠标不用移动）
  // 用 ref 防止触屏 touch+click 双发导致一次点击同时触发 reveal+nextOne
  function handleCardClick() {
    if (justRevealedRef.current) {
      justRevealedRef.current = false; // 消费掉锁，下次点击正常走 nextOne
      return;
    }
    if (!revealed) {
      reveal();
      justRevealedRef.current = true; // 标记"刚揭示"，吞掉紧随的第二次事件
    } else {
      nextOne();
    }
  }

  return (
    <section className="card-page">
      {/* 子标签切换 */}
      <div className="learn-tabs">
        <button className={tab === 'new' ? 'active' : ''} onClick={() => switchTab('new')}>
          今日新词 ({displayList.length})
        </button>
        <button className={tab === 'review' ? 'active' : ''} onClick={() => switchTab('review')}>
          复习 ({displayList.length})
        </button>
      </div>

      {/* 进度 */}
      <div className="prog">
        {tab === 'new' ? '今日新词' : '复习'} {Math.min(safeIdx + 1, activeList.length)} /{' '}
        {activeList.length}
      </div>

      {/* 卡片 —— 点一下揭示，再点一下下一张，鼠标不用动 */}
      <div
        className={'flashcard' + (revealed ? ' revealed' : '')}
        onClick={handleCardClick}
      >
        <SpeakButton text={w.text} label="朗读单词" title="朗读单词" voiceName={profile.ttsVoice} />
        <div className="fc-word">{w.text}</div>
        <div className="fc-phon">
          {w.phonetic} {w.pos}
        </div>

        {w.example && (
          <div className="fc-ex">
            <span className="biz-tag">商务例句</span>
            <div className="ex-line">
              <span>{w.example}</span>
              <SpeakButton
                text={w.example}
                label="朗读例句"
                title="朗读例句"
                className="speak-inline"
                voiceName={profile.ttsVoice}
              />
            </div>
            {revealed && <span className="muted">{w.exampleTrans}</span>}
          </div>
        )}

        {!revealed && <div className="fc-hint">点击显示中文</div>}
        {revealed && <div className="fc-mean">{w.meaning}</div>}
        {revealed && <div className="fc-hint">点击下一张 ▸</div>}
      </div>
    </section>
  );
}
