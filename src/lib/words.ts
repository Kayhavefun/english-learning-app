import { useMemo } from 'react';
import { builtinWords } from '../data/builtinWords';
import { useStore } from '../store/useStore';
import type { Word } from '../types';

export function wordKeyOf(text: string): string {
  return text.trim().toLowerCase();
}

// 内置词库 + 用户自定义词库，合并为完整词表
export function useAllWords(): Word[] {
  const custom = useStore((s) => s.customWords);
  return useMemo(() => [...builtinWords, ...custom], [custom]);
}

// 确定性乱序：同一 seed 永远得到同一种排列，跨会话稳定，搜索时也不会跳序。
// 采用 mulberry32 播种的 Fisher–Yates 洗牌。
export function shuffleWords<T>(list: T[], seed = 20240723): T[] {
  const arr = list.slice();
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 词根提取：去掉常见派生后缀，用于判断两个词是否"同根"
const ROOT_SUFFIXES = [
  'ation', 'ment', 'er', 'or', 'ist', 'ive', 'ous', 'ful', 'less', 'ly',
  'ness', 'ing', 'ed', 'es', 's', 'al', 'ic', 'ize', 'ise', 'ship', 'ity',
  'able', 'ible', 'ant', 'ent', 'ance', 'ence', 'ion', 'ate', 'ify', 'ial',
];

export function rootOf(text: string): string {
  const parts = text
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return text.toLowerCase();
  let core = parts[parts.length - 1]; // 取末词（多为名词/动词核心）
  for (const s of ROOT_SUFFIXES) {
    if (core.length > s.length + 2 && core.endsWith(s)) {
      core = core.slice(0, core.length - s.length);
      break;
    }
  }
  return core;
}

// 同词根分散：打乱后做一次贪心扫描，保证相邻两项不同根
export function declusterByRoot<T>(list: T[], getRoot: (t: T) => string): T[] {
  const arr = list.slice();
  for (let i = 0; i < arr.length - 1; i++) {
    if (getRoot(arr[i]) === getRoot(arr[i + 1])) {
      for (let j = i + 2; j < arr.length; j++) {
        if (getRoot(arr[j]) !== getRoot(arr[i])) {
          [arr[i + 1], arr[j]] = [arr[j], arr[i + 1]];
          break;
        }
      }
    }
  }
  return arr;
}

// 词库浏览排序模式：'shuffle' 乱序（默认）| 'alpha' 字母序
export type SortMode = 'shuffle' | 'alpha';
export const SORT_MODE_KEY = 'els-sort-mode';

export function loadSortMode(): SortMode {
  try {
    const v = localStorage.getItem(SORT_MODE_KEY);
    return v === 'alpha' ? 'alpha' : 'shuffle';
  } catch {
    return 'shuffle';
  }
}

export function saveSortMode(mode: SortMode): void {
  try {
    localStorage.setItem(SORT_MODE_KEY, mode);
  } catch {
    /* 忽略存储失败 */
  }
}
