# 英语听说学习（English Listening & Speaking）

一个以**听力 / 口语**为主轴的英语学习网页应用。支持单词卡片间隔复习、测验闯关、词表导入、学习进度统计，并通过 **Supabase** 在多台设备（手机 / 电脑）间自动同步进度。可部署为静态站点，并支持“添加到主屏幕”像 App 一样使用。

## 功能
- 📇 **复习**：翻卡记忆，按 Leitner 间隔重复算法安排复习计划。
- ✅ **测验**：听音选义、听写拼写两种题型，结果计入复习进度。
- 🎧 **听说（核心）**：
  - 听力：听发音写单词。
  - 口语：跟读句子/单词，用浏览器语音识别逐词评测发音（匹配度 + 高亮）。
- 📚 **词库**：内置约 1760 个面向「化工工程行业项目经理」的商务英语中高级词汇（按 20 个专业领域组织），可搜索、按掌握度筛选、删除自定义词；默认**乱序**展示（可切换字母序）；每个单词与**商务例句**均带 🔊 朗读按钮。
- ⬆️ **导入**：粘贴或上传 CSV / JSON / 纯文本词表。
- 📈 **进度**：总词数、已掌握、连续学习天数、累计正确率、近 7 天正确率图表。
- ⚙️ **设置**：TTS 语音选择、每日目标、口语评测开关、账户管理。

## 浏览器建议
- **发音（TTS）**：Chrome / Edge / Safari 均支持。
- **口语评测（语音识别）**：最佳体验在 **Chrome / Edge**；不支持的浏览器会自动提示并降级，听力与朗读不受影响。
- 手机：用 Chrome/Edge 打开网址后，点浏览器菜单“添加到主屏幕”即可像 App 使用。

## 本地运行
```bash
npm install
npm run gen-icons   # 生成 PWA 图标（首次需执行）
npm run dev         # 本地开发预览
npm run build       # 构建到 dist/
npm run preview     # 预览构建产物
```
未配置 Supabase 时，应用以**本地模式**运行：数据仅保存在当前浏览器（localStorage），无法多端同步，其余功能完全可用。

## 配置云端同步（Supabase，可选但推荐）
1. 注册免费 Supabase 账号（https://supabase.com），新建一个项目。
2. 在 Supabase 控制台 → **SQL Editor** 中粘贴并运行 `supabase/schema.sql`（建表 + 权限）。
3. 在 **Project Settings → API** 复制 Project URL 与 anon public key。
4. 复制 `.env.example` 为 `.env`，填入上述两个值：
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxx
   ```
5. 重新 `npm run dev` / `npm run build`。
6. 打开应用 → 注册/登录 → 进度即会在登录设备上自动同步。

> 应用通过 Supabase Auth（邮箱+密码）登录，数据按 `user_id` 隔离，仅本人可访问。

## 词表导入格式
支持三种，任选其一：
1. **JSON 数组**
   ```json
   [{"word":"apple","meaning":"苹果","phonetic":"/ˈæpl/","pos":"n.","example":"I eat an apple.","exampleTrans":"我吃一个苹果。"}]
   ```
2. **CSV**（首行表头需含 `word` 与 `meaning`，可含 `phonetic/pos/example/example_trans`）
   ```csv
   word,meaning,phonetic
   apple,苹果,/ˈæpl/
   ```
3. **纯文本**（每行 `英文<空格/逗号/冒号/等号>中文`）
   ```
   apple 苹果
   banana 香蕉
   ```

## 部署
构建产物在 `dist/`，可直接托管到任意静态服务（CloudStudio / Vercel / Netlify / GitHub Pages 等）。部署后把网址发到手机即可学习。

## 目录结构
```
src/
  data/builtinWords.ts   # 内置词库入口（合并下方 20 个领域文件）
  data/bec/*.ts          # 词库按领域拆分：工艺/反应/设备/仪表/工厂/PM基础/EPC/进度/成本合同/
                         #   采购/质量/HSE/调试/维修/会议/谈判/报告/财务/人力/通用动词（共约 1760 词）
  lib/                   # srs / speech / import / text / sync / supabaseClient / words
  store/useStore.ts      # Zustand 状态 + 云端同步
  components/            # 各页面与图表（含 SpeakButton 朗读按钮）
  styles.css
supabase/schema.sql     # 云端建表脚本
```
