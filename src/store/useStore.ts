import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayStat, ParsedWord, Profile, ReviewState, Word } from '../types';
import { applyReview, newReviewState } from '../lib/srs';
import { pullFromCloud, pushToCloud } from '../lib/sync';
import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  email: string;
}

interface ModuleDay {
  listening: number; // 当天读完的听力文章数
  speaking: number; // 当天完成的口语练习次数
}

interface AppState {
  user: User | null;
  customWords: Word[];
  review: Record<string, ReviewState>;
  dayStats: DayStat[];
  profile: Profile;
  syncing: boolean;
  syncError: string | null;

  // 今日学习记录：日期 -> 当天"学过"的单词文本（小写）
  studyLog: Record<string, string[]>;
  // 模块进度：日期 -> 听力/口语完成量
  moduleLog: Record<string, ModuleDay>;

  setUser: (u: User | null) => void;
  addCustomWords: (words: ParsedWord[]) => void;
  removeWord: (id: string) => void;
  reviewWord: (wordKey: string, correct: boolean) => void;
  markStudied: (text: string) => void;
  recordListening: () => void;
  recordSpeaking: () => void;
  setProfile: (p: Partial<Profile>) => void;
  hydrateFromCloud: () => Promise<void>;
  pushChanges: () => Promise<void>;
  resetLocalData: () => void;
}

function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function bumpDayStat(stats: DayStat[], reviewed: number, correct: number): DayStat[] {
  const key = todayKey();
  const idx = stats.findIndex((s) => s.date === key);
  if (idx >= 0) {
    const copy = [...stats];
    copy[idx] = {
      ...copy[idx],
      reviewed: copy[idx].reviewed + reviewed,
      correct: copy[idx].correct + correct,
    };
    return copy;
  }
  return [...stats, { date: key, reviewed, correct }];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      customWords: [],
      review: {},
      dayStats: [],
      profile: { dailyGoal: 20, speakingEnabled: true },
      syncing: false,
      syncError: null,
      studyLog: {},
      moduleLog: {},

      setUser: (u) => set({ user: u }),

      addCustomWords: (words) => {
        const existing = new Set(get().customWords.map((w) => w.text.toLowerCase()));
        const added: Word[] = words
          .filter((w) => w.text && !existing.has(w.text.toLowerCase()))
          .map((w) => ({
            id: 'c-' + w.text.toLowerCase(),
            text: w.text,
            phonetic: w.phonetic,
            pos: w.pos,
            meaning: w.meaning,
            example: w.example,
            exampleTrans: w.exampleTrans,
            source: 'user' as const,
          }));
        if (added.length === 0) return;
        set({ customWords: [...get().customWords, ...added] });
        void get().pushChanges();
      },

      removeWord: (id) => {
        const target = get().customWords.find((w) => w.id === id);
        if (!target) return;
        set({ customWords: get().customWords.filter((w) => w.id !== id) });
        void get().pushChanges();
      },

      reviewWord: (wordKey, correct) => {
        const prev = get().review[wordKey];
        const base: ReviewState = prev ?? newReviewState(wordKey);
        const updated = applyReview(base, correct);
        set({
          review: { ...get().review, [wordKey]: updated },
          dayStats: bumpDayStat(get().dayStats, 1, correct ? 1 : 0),
        });
        void get().pushChanges();
      },

      markStudied: (text) => {
        const key = todayKey();
        const lower = text.trim().toLowerCase();
        const today = get().studyLog[key] ?? [];
        if (today.includes(lower)) return;
        set({ studyLog: { ...get().studyLog, [key]: [...today, lower] } });
      },

      recordListening: () => {
        const key = todayKey();
        const prev = get().moduleLog[key] ?? { listening: 0, speaking: 0 };
        set({
          moduleLog: {
            ...get().moduleLog,
            [key]: { ...prev, listening: prev.listening + 1 },
          },
        });
      },

      recordSpeaking: () => {
        const key = todayKey();
        const prev = get().moduleLog[key] ?? { listening: 0, speaking: 0 };
        set({
          moduleLog: {
            ...get().moduleLog,
            [key]: { ...prev, speaking: prev.speaking + 1 },
          },
        });
      },

      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),

      hydrateFromCloud: async () => {
        const user = get().user;
        if (!user) return;
        set({ syncing: true, syncError: null });
        try {
          const data = await pullFromCloud(user.id);
          if (!data) {
            set({ syncing: false });
            return;
          }
          // 合并自定义词：云端优先，本地独有的追加
          const cloudCustom: Word[] = data.userWords.map((w) => ({
            id: 'c-' + w.word.toLowerCase(),
            text: w.word,
            phonetic: w.phonetic ?? undefined,
            pos: w.pos ?? undefined,
            meaning: w.meaning,
            example: w.example ?? undefined,
            exampleTrans: w.example_trans ?? undefined,
            source: 'user',
          }));
          const byText = new Map(cloudCustom.map((w) => [w.text.toLowerCase(), true]));
          const mergedCustom = [
            ...cloudCustom,
            ...get().customWords.filter((w) => !byText.has(w.text.toLowerCase())),
          ];
          // 复习状态：云端覆盖本地同键
          const review = { ...get().review };
          for (const r of data.reviews) {
            review[r.word_key] = {
              wordKey: r.word_key,
              box: r.box,
              nextReview: new Date(r.next_review).getTime(),
              reviews: r.reviews,
              correctStreak: r.correct_streak,
            };
          }
          // 每日统计：按日期取并集，数值取较大者（避免覆盖更优进度）
          const dsMap = new Map(get().dayStats.map((d) => [d.date, { ...d }]));
          for (const d of data.dayStats) {
            const ex = dsMap.get(d.date);
            if (ex) {
              dsMap.set(d.date, {
                date: d.date,
                reviewed: Math.max(ex.reviewed, d.reviewed),
                correct: Math.max(ex.correct, d.correct),
              });
            } else {
              dsMap.set(d.date, { date: d.date, reviewed: d.reviewed, correct: d.correct });
            }
          }
          set({
            customWords: mergedCustom,
            review,
            dayStats: Array.from(dsMap.values()).sort((a, b) => (a.date < b.date ? -1 : 1)),
          });
          // 把本地独有的数据也上传到云端
          await get().pushChanges();
        } catch (e: any) {
          set({ syncError: e?.message || '同步失败' });
        } finally {
          set({ syncing: false });
        }
      },

      pushChanges: async () => {
        const { user, customWords, review, dayStats } = get();
        if (!user) return;
        const userWords = customWords.map((w) => ({
          word: w.text,
          phonetic: w.phonetic ?? null,
          pos: w.pos ?? null,
          meaning: w.meaning,
          example: w.example ?? null,
          example_trans: w.exampleTrans ?? null,
        }));
        const reviews = Object.values(review).map((r) => ({
          word_key: r.wordKey,
          box: r.box,
          next_review: new Date(r.nextReview).toISOString(),
          reviews: r.reviews,
          correct_streak: r.correctStreak,
        }));
        const dayStatsPayload = dayStats.map((d) => ({
          date: d.date,
          reviewed: d.reviewed,
          correct: d.correct,
        }));
        try {
          await pushToCloud(user.id, {
            userWords,
            reviews,
            dayStats: dayStatsPayload,
          });
          set({ syncError: null });
        } catch (e: any) {
          set({ syncError: e?.message || '同步失败' });
        }
      },

      resetLocalData: () => {
        set({ customWords: [], review: {}, dayStats: [] });
        void get().pushChanges();
      },
    }),
    {
      name: 'elt-store-v1',
      partialize: (s) => ({
        user: s.user,
        customWords: s.customWords,
        review: s.review,
        dayStats: s.dayStats,
        profile: s.profile,
        studyLog: s.studyLog,
        moduleLog: s.moduleLog,
      }),
    }
  )
);

// 初始化时尝试恢复 Supabase 会话并拉取云端数据
export async function initAuth(): Promise<void> {
  if (!supabase) return;
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    useStore.getState().setUser({ id: data.session.user.id, email: data.session.user.email || '' });
    await useStore.getState().hydrateFromCloud();
  }
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      useStore.getState().setUser({ id: session.user.id, email: session.user.email || '' });
      void useStore.getState().hydrateFromCloud();
    } else {
      useStore.getState().setUser(null);
    }
  });
}
