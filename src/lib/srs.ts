import type { ReviewState } from '../types';

// Leitner 盒子对应的复习间隔（天）。盒子 5 视为已掌握，间隔设得很长。
export const BOX_INTERVALS_DAYS = [1, 3, 7, 16, 36500];
export const MASTERED_BOX = 5;

export function nextBox(box: number, correct: boolean): number {
  if (correct) return Math.min(MASTERED_BOX, box + 1);
  return 1;
}

export function computeNextReview(box: number): number {
  const idx = Math.max(0, Math.min(BOX_INTERVALS_DAYS.length - 1, box - 1));
  const days = BOX_INTERVALS_DAYS[idx];
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function newReviewState(wordKey: string): ReviewState {
  return { wordKey, box: 1, nextReview: Date.now(), reviews: 0, correctStreak: 0 };
}

// 应用一次复习结果，返回新的复习状态
export function applyReview(prev: ReviewState | undefined, correct: boolean): ReviewState {
  const base = prev ?? newReviewState('');
  const box = nextBox(base.box, correct);
  return {
    wordKey: base.wordKey,
    box,
    nextReview: computeNextReview(box),
    reviews: base.reviews + 1,
    correctStreak: correct ? base.correctStreak + 1 : 0,
  };
}

// 该词是否到了该复习的时间（从未复习过则立即出现）
export function isDue(state: ReviewState | undefined, now = Date.now()): boolean {
  if (!state) return true;
  return state.nextReview <= now;
}
