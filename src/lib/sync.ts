import { supabase } from './supabaseClient';

export interface CloudUserWord {
  id?: string;
  word: string;
  phonetic: string | null;
  pos: string | null;
  meaning: string;
  example: string | null;
  example_trans: string | null;
}

export interface CloudReview {
  word_key: string;
  box: number;
  next_review: string; // ISO 字符串
  reviews: number;
  correct_streak: number;
}

export interface CloudDayStat {
  date: string;
  reviewed: number;
  correct: number;
}

export interface CloudData {
  userWords: CloudUserWord[];
  reviews: CloudReview[];
  dayStats: CloudDayStat[];
}

export interface PushPayload {
  userWords: CloudUserWord[];
  reviews: CloudReview[];
  dayStats: CloudDayStat[];
}

/** 从云端拉取当前用户的数据 */
export async function pullFromCloud(userId: string): Promise<CloudData | null> {
  if (!supabase) return null;
  const [uw, rs, ds] = await Promise.all([
    supabase.from('user_words').select('*').eq('user_id', userId),
    supabase.from('review_state').select('*').eq('user_id', userId),
    supabase.from('day_stats').select('*').eq('user_id', userId),
  ]);
  if (uw.error || rs.error || ds.error) {
    throw new Error(uw.error?.message || rs.error?.message || ds.error?.message || '拉取云端数据失败');
  }
  return {
    userWords: (uw.data as any[]) ?? [],
    reviews: (rs.data as any[]) ?? [],
    dayStats: (ds.data as any[]) ?? [],
  };
}

/** 把当前用户的数据 upsert 到云端（按主键覆盖） */
export async function pushToCloud(userId: string, payload: PushPayload): Promise<void> {
  if (!supabase) return;
  if (payload.userWords.length) {
    const rows = payload.userWords.map((w) => ({ user_id: userId, ...w }));
    const { error } = await supabase.from('user_words').upsert(rows, { onConflict: 'user_id,word' });
    if (error) throw error;
  }
  if (payload.reviews.length) {
    const rows = payload.reviews.map((r) => ({ user_id: userId, ...r }));
    const { error } = await supabase.from('review_state').upsert(rows, { onConflict: 'user_id,word_key' });
    if (error) throw error;
  }
  if (payload.dayStats.length) {
    const rows = payload.dayStats.map((d) => ({ user_id: userId, ...d }));
    const { error } = await supabase.from('day_stats').upsert(rows, { onConflict: 'user_id,date' });
    if (error) throw error;
  }
}
