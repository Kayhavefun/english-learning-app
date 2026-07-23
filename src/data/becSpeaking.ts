// BEC 口语题库（参考剑桥商务英语口语考试结构）：
// Part 1 面试问答 · Part 2 个人小演讲（1 分钟）· Part 3 协作讨论
// 场景贴合商务 / 化工工程项目经理日常工作。

export interface SpeakingPrompt {
  id: string;
  part: 1 | 2 | 3;
  partLabel: string;
  title: string;
  prompt: string; // 英文题目 / 任务
  bullets?: string[]; // Part 2/3 的提示要点
  prepSec?: number; // 准备时间（秒）
  tip?: string; // 中文提示
}

export const speakingPrompts: SpeakingPrompt[] = [
  // ---------------- Part 1：面试问答 ----------------
  {
    id: 'p1-role',
    part: 1,
    partLabel: 'Part 1 · 面试',
    title: '你的工作职责',
    prompt: 'Could you tell me about your current role and what you do on a typical day?',
    tip: '用 3–4 句话介绍职位、日常任务，最后可提一个你最在意的目标。',
  },
  {
    id: 'p1-industry',
    part: 1,
    partLabel: 'Part 1 · 面试',
    title: '所在行业',
    prompt: 'What do you find most interesting about working in the chemical / engineering industry?',
    tip: '谈技术挑战、项目交付的成就感，或行业与可持续发展的结合。',
  },
  {
    id: 'p1-skills',
    part: 1,
    partLabel: 'Part 1 · 面试',
    title: '所需能力',
    prompt: 'Which skills do you think are most important for a project manager?',
    tip: '对比 technical 与 soft skills（沟通、计划、风险意识），用例子支撑。',
  },
  {
    id: 'p1-success',
    part: 1,
    partLabel: 'Part 1 · 面试',
    title: '成功项目',
    prompt: 'Describe a project you worked on that was successful. What made it work?',
    tip: '用 "problem – action – result" 结构，提到具体成果（如按时、降本）。',
  },

  // ---------------- Part 2：个人小演讲（约 1 分钟） ----------------
  {
    id: 'p2-supplier',
    part: 2,
    partLabel: 'Part 2 · 小演讲',
    title: '选择新供应商',
    prompt:
      'Your company is choosing a new supplier for a key component. What factors should be considered before making a decision?',
    bullets: ['cost and payment terms', 'quality and certification', 'delivery time and reliability', 'after-sales support'],
    prepSec: 60,
    tip: '开头表明立场，按要点逐条展开，结尾总结推荐。目标说到 1 分钟。',
  },
  {
    id: 'p2-delays',
    part: 2,
    partLabel: 'Part 2 · 小演讲',
    title: '减少项目延误',
    prompt:
      'Your project is falling behind schedule. What would you recommend to reduce delays?',
    bullets: ['better planning and milestones', 'clearer communication', 'additional resources', 'risk monitoring'],
    prepSec: 60,
    tip: '每条建议配一句原因，体现"先诊断再解决"的逻辑。',
  },
  {
    id: 'p2-safety',
    part: 2,
    partLabel: 'Part 2 · 小演讲',
    title: '提升现场安全',
    prompt:
      'The site manager asks you to propose actions that would improve workplace safety. What would you suggest?',
    bullets: ['training and drills', 'regular audits', 'better equipment', 'safety culture'],
    prepSec: 60,
    tip: '把"制度"和"文化"都提到，显得全面。',
  },
  {
    id: 'p2-cost',
    part: 2,
    partLabel: 'Part 2 · 小演讲',
    title: '削减成本',
    prompt:
      'Your company wants to cut operating costs without hurting quality. How would you approach it?',
    bullets: ['energy efficiency', 'inventory optimization', 'process improvement', 'selective outsourcing'],
    prepSec: 60,
    tip: '强调"不牺牲质量"，用 efficiency / optimization 等商务词。',
  },
  {
    id: 'p2-present',
    part: 2,
    partLabel: 'Part 2 · 小演讲',
    title: '向利益相关方汇报',
    prompt:
      'You need to present a new process to stakeholders. How would you structure your presentation?',
    bullets: ['the problem', 'the proposed solution', 'expected benefits', 'next steps'],
    prepSec: 60,
    tip: '用 "First… Second… Finally…" 串起四部分，结构清晰易得高分。',
  },

  // ---------------- Part 3：协作讨论 ----------------
  {
    id: 'p3-cost-vs-green',
    part: 3,
    partLabel: 'Part 3 · 讨论',
    title: '成本与环保如何平衡',
    prompt:
      'How can a manufacturing company balance the need to cut costs with its environmental responsibilities?',
    bullets: ['short-term cost vs long-term saving', 'regulation and reputation', 'efficiency investments'],
    tip: '先陈述两难，再给出折中方案（如高效设备长期更省钱）。',
  },
  {
    id: 'p3-price-vs-exp',
    part: 3,
    partLabel: 'Part 3 · 讨论',
    title: '选承包商：价格还是经验',
    prompt:
      'When selecting a contractor, which is more important: a lower price or more experience?',
    bullets: ['risk of cheap bids', 'value of proven track record', 'mixed strategy'],
    tip: '避免绝对化，用 "It depends on…" 体现讨论感。',
  },
  {
    id: 'p3-delay',
    part: 3,
    partLabel: 'Part 3 · 讨论',
    title: '如何应对严重延误',
    prompt:
      'A major project is seriously delayed. How should the project team respond?',
    bullets: ['identify the root cause', 'communicate with stakeholders', 'recover the schedule', 'prevent recurrence'],
    tip: '强调先找原因、再沟通、最后补救与预防。',
  },
  {
    id: 'p3-focus-vs-div',
    part: 3,
    partLabel: 'Part 3 · 讨论',
    title: '专注还是多元化',
    prompt:
      'Should a company focus on one core market or diversify into new ones?',
    bullets: ['depth vs spread of resources', 'market risk', 'growth opportunity'],
    tip: '用权衡框架回答，并给一个倾向性结论。',
  },
];
