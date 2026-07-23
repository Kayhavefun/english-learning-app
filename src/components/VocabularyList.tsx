import { useMemo, useState } from 'react';
import { useAllWords, wordKeyOf, shuffleWords, declusterByRoot, rootOf, loadSortMode, saveSortMode } from '../lib/words';
import type { SortMode } from '../lib/words';
import { useStore } from '../store/useStore';
import SpeakButton from './SpeakButton';

type Filter = 'all' | 'learning' | 'mastered';

export default function VocabularyList() {
  const words = useAllWords();
  const review = useStore((s) => s.review);
  const removeWord = useStore((s) => s.removeWord);
  const profile = useStore((s) => s.profile);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortMode>(() => loadSortMode());
  // 每次打开/点"重新乱序"生成新的随机种子，保证真正随机且跨会话不同
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));

  const changeSort = (m: SortMode) => {
    setSort(m);
    saveSortMode(m);
  };

  // 基于全量词表的稳定乱序（同词根分散），搜索/筛选时只从中过滤，不会跳序
  const shuffledFull = useMemo(
    () => declusterByRoot(shuffleWords(words, seed), (w) => rootOf(w.text)),
    [words, seed]
  );

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    let arr = shuffledFull.filter((w) => {
      if (filter === 'mastered' && review[wordKeyOf(w.text)]?.box !== 5) return false;
      if (filter === 'learning' && (!review[wordKeyOf(w.text)] || review[wordKeyOf(w.text)]?.box === 5))
        return false;
      if (query && !w.text.toLowerCase().includes(query) && !w.meaning.toLowerCase().includes(query))
        return false;
      return true;
    });
    // 字母序：在筛选结果内排序（仅在显式选择字母序时生效）
    if (sort === 'alpha') arr = arr.slice().sort((a, b) => a.text.localeCompare(b.text));
    return arr;
  }, [shuffledFull, review, q, filter, sort]);

  return (
    <section className="card-page">
      <h2>词库</h2>
      <div className="toolbar">
        <input
          className="search"
          placeholder="搜索单词 / 释义"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="seg-row">
          <div className="seg small">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
              全部
            </button>
            <button className={filter === 'learning' ? 'active' : ''} onClick={() => setFilter('learning')}>
              学习中
            </button>
            <button className={filter === 'mastered' ? 'active' : ''} onClick={() => setFilter('mastered')}>
              已掌握
            </button>
          </div>
          <div className="seg small">
            <button className={sort === 'shuffle' ? 'active' : ''} onClick={() => changeSort('shuffle')}>
              乱序
            </button>
            <button className={sort === 'alpha' ? 'active' : ''} onClick={() => changeSort('alpha')}>
              字母序
            </button>
            <button className="reshuffle" onClick={() => setSeed(Math.floor(Math.random() * 1e9))}>
              🔀 重新乱序
            </button>
          </div>
        </div>
      </div>

      <div className="word-list">
        {list.length === 0 && <div className="empty">没有匹配的词。</div>}
        {list.map((w) => {
          const box = review[wordKeyOf(w.text)]?.box;
          return (
            <div className="word-item" key={w.id}>
              <div className="wi-main">
                <div className="wi-word">
                  {w.text}
                  <SpeakButton
                    text={w.text}
                    label="朗读单词"
                    title="朗读单词"
                    className="mini"
                    voiceName={profile.ttsVoice}
                  />
                  {w.phonetic && <span className="wi-phon">{w.phonetic}</span>}
                  {w.pos && <span className="wi-pos">{w.pos}</span>}
                </div>
                <div className="wi-mean">{w.meaning}</div>
                {w.example && (
                  <div className="wi-ex">
                    <span className="biz-tag">商务例句</span>
                    <div className="ex-line">
                      <span className="ex-en">{w.example}</span>
                      <SpeakButton
                        text={w.example}
                        label="朗读例句"
                        title="朗读例句"
                        className="speak-inline"
                        voiceName={profile.ttsVoice}
                      />
                    </div>
                    <div className="ex-cn muted">{w.exampleTrans}</div>
                  </div>
                )}
              </div>
              <div className="wi-side">
                {box === 5 && <span className="tag ok">已掌握</span>}
                {box && box < 5 && <span className="tag">盒 {box}</span>}
                {w.source === 'user' && (
                  <button className="link danger" onClick={() => removeWord(w.id)}>
                    删除
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
