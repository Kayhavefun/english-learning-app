import { useState } from 'react';
import { parseWordInput } from '../lib/import';
import { useStore } from '../store/useStore';
import type { ParsedWord } from '../types';

export default function ImportWords() {
  const addCustomWords = useStore((s) => s.addCustomWords);
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<ParsedWord[] | null>(null);
  const [msg, setMsg] = useState('');

  function parse() {
    const r = parseWordInput(text);
    setPreview(r);
    setMsg(r.length ? '' : '没有解析到有效词条，请检查格式。');
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ''));
      setPreview(null);
    };
    reader.readAsText(f);
  }

  function doImport() {
    if (!preview || preview.length === 0) return;
    addCustomWords(preview);
    setMsg(`已导入 ${preview.length} 个词！`);
    setText('');
    setPreview(null);
  }

  return (
    <section className="card-page">
      <h2>导入词表</h2>
      <p className="muted">
        支持三种格式：
        <br />
        ① JSON：<code>{'[{"word":"apple","meaning":"苹果"}]'}</code>
        <br />
        ② CSV（首行表头含 word/meaning）：<code>word,meaning{'\n'}apple,苹果</code>
        <br />
        ③ 纯文本每行：<code>apple 苹果</code>
      </p>
      <textarea
        placeholder="在此粘贴词表内容，或选择文件…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <input type="file" accept=".txt,.csv,.json" onChange={onFile} />
      <div className="fc-actions">
        <button className="primary" onClick={parse} disabled={!text.trim()}>
          解析预览
        </button>
        <button className="good" onClick={doImport} disabled={!preview || preview.length === 0}>
          导入 {preview ? `(${preview.length})` : ''}
        </button>
      </div>
      {msg && <p className="msg">{msg}</p>}
      {preview && preview.length > 0 && (
        <div className="preview">
          <div className="muted">预览（前 20 条）：</div>
          <ul>
            {preview.slice(0, 20).map((w, i) => (
              <li key={i}>
                {w.text} — {w.meaning} {w.phonetic ? `(${w.phonetic})` : ''}
              </li>
            ))}
          </ul>
          {preview.length > 20 && <div className="muted">…共 {preview.length} 条</div>}
        </div>
      )}
    </section>
  );
}
