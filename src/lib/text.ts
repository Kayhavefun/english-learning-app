// 文本归一化与口语比对工具

// 小写、去标点、折叠空白，返回词数组
export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[''-]+|[''-]+$/g, ''))
    .filter(Boolean);
}

export interface WordMatch {
  word: string;
  ok: boolean;
}

// 比较用户发音与目标文本，逐词判定是否命中，给出匹配率
export function comparePronunciation(
  target: string,
  spoken: string
): { matches: WordMatch[]; score: number } {
  const targetWords = normalizeWords(target);
  const spokenWords = normalizeWords(spoken);
  const remaining = [...spokenWords];
  const matches: WordMatch[] = targetWords.map((w) => {
    const idx = remaining.indexOf(w);
    if (idx >= 0) {
      remaining.splice(idx, 1);
      return { word: w, ok: true };
    }
    return { word: w, ok: false };
  });
  const score = targetWords.length
    ? matches.filter((m) => m.ok).length / targetWords.length
    : 0;
  return { matches, score };
}

// 宽松判定：达到阈值即算通过
export function passedPronunciation(score: number, threshold = 0.6): boolean {
  return score >= threshold;
}
