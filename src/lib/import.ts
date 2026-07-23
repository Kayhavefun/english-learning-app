import type { ParsedWord } from '../types';

// 解析用户粘贴/上传的词表文本，支持三种格式：
//   1) JSON 数组：[{ word, meaning, phonetic?, pos?, example?, exampleTrans? }]
//   2) CSV（带表头，逗号分隔，支持引号）
//   3) 纯文本：每行 "英文<分隔符>中文"，分隔符可为空格/制表符/逗号/冒号/等号/连字符
export function parseWordInput(raw: string): ParsedWord[] {
  const text = raw.trim();
  if (!text) return [];

  // 1) JSON
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const json = JSON.parse(text);
      const arr = Array.isArray(json) ? json : [json];
      return arr
        .map((o: any) => normalizeRow(o))
        .filter((w: ParsedWord | null) => w && w.text && w.meaning) as ParsedWord[];
    } catch {
      /* 不是合法 JSON，继续按文本处理 */
    }
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  // 2) CSV（带表头）
  const header = lines[0].toLowerCase();
  if (/word|英文|单词/.test(header) && /meaning|释义|中文/.test(header)) {
    const cols = splitCsvLine(lines[0]);
    const idx = {
      word: cols.findIndex((c) => /word|英文|单词/i.test(c)),
      phonetic: cols.findIndex((c) => /phonetic|音标/i.test(c)),
      pos: cols.findIndex((c) => /pos|词性/i.test(c)),
      meaning: cols.findIndex((c) => /meaning|释义|中文/i.test(c)),
      example: cols.findIndex((c) => /example|例句/i.test(c)),
      exampleTrans: cols.findIndex((c) => /example_trans|例句翻译|例句中文/i.test(c)),
    };
    const out: ParsedWord[] = [];
    for (let i = 1; i < lines.length; i++) {
      const c = splitCsvLine(lines[i]);
      const w = (c[idx.word] ?? '').trim();
      const m = (c[idx.meaning] ?? '').trim();
      if (w && m) {
        out.push({
          text: w,
          phonetic: idx.phonetic >= 0 ? (c[idx.phonetic] ?? '').trim() || undefined : undefined,
          pos: idx.pos >= 0 ? (c[idx.pos] ?? '').trim() || undefined : undefined,
          meaning: m,
          example: idx.example >= 0 ? (c[idx.example] ?? '').trim() || undefined : undefined,
          exampleTrans:
            idx.exampleTrans >= 0 ? (c[idx.exampleTrans] ?? '').trim() || undefined : undefined,
        });
      }
    }
    return out;
  }

  // 3) 纯文本
  const out: ParsedWord[] = [];
  for (const line of lines) {
    const p = parseTextLine(line);
    if (p) out.push(p);
  }
  return out;
}

function normalizeRow(o: any): ParsedWord | null {
  if (!o || typeof o !== 'object') return null;
  const text = String(o.word ?? o.text ?? o.英文 ?? o.单词 ?? '').trim();
  const meaning = String(o.meaning ?? o.释义 ?? o.中文 ?? '').trim();
  if (!text || !meaning) return null;
  return {
    text,
    phonetic: o.phonetic ?? o.音标 ?? undefined,
    pos: o.pos ?? o.词性 ?? undefined,
    meaning,
    example: o.example ?? o.例句 ?? undefined,
    exampleTrans: o.exampleTrans ?? o.例句翻译 ?? o.例句中文 ?? undefined,
  };
}

function parseTextLine(line: string): ParsedWord | null {
  const m = line.match(/^(.+?)[\s\t,:=：\-]+(.+)$/);
  if (!m) return null;
  const text = m[1].trim();
  const meaning = m[2].trim();
  if (!text || !meaning) return null;
  return { text, meaning };
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (ch === ',' && !inQ) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}
