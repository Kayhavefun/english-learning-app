-- 英语听说学习应用 · Supabase 建表脚本
-- 在 Supabase 控制台 → SQL Editor 中粘贴本文件并运行即可。

-- 1) 用户自定义/导入的词
create table if not exists public.user_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  word text not null,
  phonetic text,
  pos text,
  meaning text not null,
  example text,
  example_trans text,
  unique (user_id, word)
);

-- 2) 间隔重复状态（按单词文本 key，覆盖内置 + 自定义词）
create table if not exists public.review_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  word_key text not null,
  box integer not null default 1,
  next_review timestamptz not null default now(),
  reviews integer not null default 0,
  correct_streak integer not null default 0,
  primary key (user_id, word_key)
);

-- 3) 每日学习统计
create table if not exists public.day_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  reviewed integer not null default 0,
  correct integer not null default 0,
  primary key (user_id, date)
);

-- 开启行级安全（RLS），确保用户只能访问自己的数据
alter table public.user_words enable row level security;
alter table public.review_state enable row level security;
alter table public.day_stats enable row level security;

-- 允许已登录用户对自己的数据做全部操作
create policy "own user_words" on public.user_words
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own review_state" on public.review_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own day_stats" on public.day_stats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
