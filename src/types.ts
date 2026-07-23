export interface Word {
  id: string;
  text: string;
  phonetic?: string;
  pos?: string;
  meaning: string;
  example?: string;
  exampleTrans?: string;
  source: 'builtin' | 'user';
}

export interface ReviewState {
  wordKey: string; // 单词小写，作为复习状态的主键
  box: number; // Leitner 盒子 1..5（5 表示已掌握）
  nextReview: number; // 下次复习时间（epoch ms）
  reviews: number; // 累计复习次数
  correctStreak: number; // 连续答对次数
}

export interface DayStat {
  date: string; // YYYY-MM-DD（本地日期）
  reviewed: number; // 当天复习/测验题数
  correct: number; // 当天答对题数
}

export interface ParsedWord {
  text: string;
  phonetic?: string;
  pos?: string;
  meaning: string;
  example?: string;
  exampleTrans?: string;
}

export interface Profile {
  ttsVoice?: string;
  dailyGoal: number;
  speakingEnabled: boolean;
}
