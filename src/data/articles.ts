// 听力文章库：商务 / 金融 / 化工工程项目管理相关主题，每篇 800–1200 词。
// 重点词汇（keyTerms）会在阅读器中高亮，点击即可查看中文翻译。
// 每日文章由组件按日期轮换选取（见 ListeningSpeaking）。

export interface Article {
  id: string;
  title: string;
  topic: 'finance' | 'business' | 'engineering' | 'career';
  topicLabel: string;
  paragraphs: string[];
  keyTerms: { term: string; meaning: string }[];
}

export const articles: Article[] = [
  {
    id: 'supply-chain',
    title: 'Global Supply Chains Under Pressure: What Project Managers Should Know',
    topic: 'business',
    topicLabel: '商务 · 供应链',
    keyTerms: [
      { term: 'supply chain', meaning: '供应链' },
      { term: 'logistics', meaning: '物流' },
      { term: 'lead time', meaning: '交货周期 / 前置时间' },
      { term: 'inventory', meaning: '库存' },
      { term: 'procurement', meaning: '采购' },
      { term: 'tariff', meaning: '关税' },
      { term: 'resilient', meaning: '有韧性的、抗冲击的' },
      { term: 'bottleneck', meaning: '瓶颈' },
      { term: 'raw material', meaning: '原材料' },
      { term: 'hedging', meaning: '对冲（规避价格风险）' },
      { term: 'forecast', meaning: '预测' },
      { term: 'disruption', meaning: '中断、扰动' },
      { term: 'just-in-time', meaning: '准时制（零库存）' },
      { term: 'warehouse', meaning: '仓库' },
      { term: 'sourcing', meaning: '寻源、采购来源' },
      { term: 'volatility', meaning: '波动性' },
      { term: 'carbon footprint', meaning: '碳足迹' },
      { term: 'diversification', meaning: '多元化' },
    ],
    paragraphs: [
      `A supply chain is the connected network of suppliers, factories, warehouses, and transport routes that moves a product from raw material to the customer. For a chemical engineering project manager, the supply chain is never just a background concern. It decides whether a reactor arrives on time, whether the catalyst is available when commissioning begins, and whether the plant can keep running after it is built. When the supply chain works well, the whole project feels calm. When it breaks, deadlines slip and costs rise.`,
      `In recent years, global logistics have become far more volatile. A port closure, a sudden tariff, or a shortage of a single component can block an entire production line. Many managers learned the hard way that a lean, just-in-time model saves money in normal times but leaves almost no buffer when a disruption appears. The COVID-19 period showed how quickly empty shelves and delayed shipments could appear across industries, from electronics to specialty chemicals.`,
      `Lead time is one of the most important numbers a project manager watches. It is the total time between placing an order and receiving the goods. For standard pumps, lead time might be a few weeks. For a custom compressor or a long-lead item, it can be twelve months or more. If procurement is delayed, the critical path of the project is threatened, because the equipment must be on site before piping and electrical work can finish. Good forecasting and early ordering are therefore not optional—they are survival skills.`,
      `Inventory is the other side of the same coin. Holding extra stock protects against delays but ties up cash and occupies warehouse space. Holding too little exposes the project to every shock in the market. Experienced teams use a balanced approach: they keep safety stock for critical items, negotiate flexible delivery windows with suppliers, and track supplier performance with clear metrics. They also build resilience by sourcing from more than one region, a practice called diversification.`,
      `Procurement strategy deserves careful thought. Should the team buy from the lowest-cost supplier, or pay more for a partner with proven reliability? In a chemical plant, a cheap valve that fails during start-up can cost millions in downtime. Smart managers weigh total cost of ownership, not just the sticker price. They also use contracts with penalty clauses and quality requirements, and they visit supplier sites to verify capability before committing large orders.`,
      `Price volatility adds another layer of risk. The cost of steel, copper, and energy can swing sharply within a single quarter. Some companies reduce this risk through hedging, locking in prices or using financial instruments to protect budgets. Others build contingency into their estimates so that a 10% rise in material cost does not sink the project. Either way, the project manager must understand the exposure and report it clearly to stakeholders.`,
      `Sustainability is now part of supply chain decisions, not a separate topic. Customers and regulators ask about the carbon footprint of delivered goods, the labor practices of tier-two suppliers, and the recyclability of packaging. A resilient supply chain in 2026 is one that is not only fast and cheap but also transparent and responsible. Project managers who ignore this trend may face delays from new regulations or lose contracts with environmentally conscious clients.`,
      `Looking ahead, the most successful teams treat the supply chain as a strategic asset. They map their dependencies, identify each bottleneck, and maintain relationships with alternative suppliers. They invest in better demand forecasting and in digital tools that show shipment status in real time. Above all, they accept that perfect efficiency and perfect resilience cannot both be maximized, and they choose a balance that fits the specific risks of their project. In a world of constant uncertainty, a resilient supply chain is the quiet advantage that keeps plants running.`,
    ],
  },
  {
    id: 'project-finance',
    title: 'Financing Capital Projects: From FEED to Financial Close',
    topic: 'finance',
    topicLabel: '金融 · 项目融资',
    keyTerms: [
      { term: 'capital expenditure', meaning: '资本性支出（CAPEX）' },
      { term: 'operating expenditure', meaning: '运营支出（OPEX）' },
      { term: 'FEED', meaning: '前端工程设计' },
      { term: 'EPC', meaning: '设计采购施工总承包' },
      { term: 'lump sum', meaning: '总价（包干）合同' },
      { term: 'milestone', meaning: '里程碑' },
      { term: 'cash flow', meaning: '现金流' },
      { term: 'debt', meaning: '债务' },
      { term: 'equity', meaning: '股权' },
      { term: 'loan', meaning: '贷款' },
      { term: 'interest rate', meaning: '利率' },
      { term: 'payback period', meaning: '投资回收期' },
      { term: 'net present value', meaning: '净现值（NPV）' },
      { term: 'internal rate of return', meaning: '内部收益率（IRR）' },
      { term: 'contingency', meaning: '应急储备' },
      { term: 'offtake', meaning: '包销、承购协议' },
      { term: 'sponsor', meaning: '项目发起方' },
      { term: 'feasibility study', meaning: '可行性研究' },
      { term: 'working capital', meaning: '营运资金' },
      { term: 'currency risk', meaning: '汇率风险' },
    ],
    paragraphs: [
      `Large industrial projects are expensive. A new chemical plant can require hundreds of millions of dollars in capital expenditure before it produces a single product. Understanding how such projects are financed is therefore a core skill for any project manager in the process industries. Money does not appear by magic; it is raised, scheduled, and repaid according to a disciplined plan that begins long before construction starts.`,
      `The journey usually starts with a feasibility study. At this stage, the sponsor evaluates whether the project makes commercial sense. Engineers produce a rough process design, estimate the capital cost, and model the operating expenditure the plant will incur each year. If the numbers look attractive, the team moves to FEED, or front-end engineering design, which refines the concept enough to invite firm bids from contractors.`,
      `Most major plants are delivered under an EPC contract, where one contractor is responsible for engineering, procurement, and construction. The contract is often lump sum, meaning the contractor carries the risk of cost overruns. For the owner, this provides budget certainty, but it demands very clear specifications. Payment is released against milestones, such as mechanical completion or successful commissioning, which keeps cash flow aligned with real progress.`,
      `Financing itself combines debt and equity. The sponsor typically contributes equity, often 30% to 40% of the total cost, and borrows the rest through loans from banks or bond markets. Lenders want comfort that the project will generate enough cash flow to service the debt. They study the repayment schedule, the interest rate environment, and the strength of the offtake agreements that guarantee future sales.`,
      `Two financial metrics dominate boardroom discussions. Net present value compares the value of future cash flows to the initial investment, discounting for time. A positive NPV suggests the project adds value. Internal rate of return is the discount rate at which NPV becomes zero; sponsors compare it to their required return. Alongside these, the payback period tells how many years until the original capital is recovered. None of these figures is useful without realistic assumptions about prices, volumes, and costs.`,
      `Risk sits underneath every financing model. Construction may run late, raw material prices may rise, or demand may soften. Prudent budgets include a contingency, typically 10% to 20% of capital cost, to absorb surprises. Currency risk is real for cross-border projects: a loan in one currency and revenue in another can create painful mismatches if exchange rates move. Some sponsors use hedging or local-currency financing to reduce this exposure.`,
      `Working capital is easy to forget but essential. Even after the plant is built, the owner must fund inventory, spare parts, and accounts receivable before sales revenue arrives. A project that is technically perfect can still fail if it runs out of cash during the ramp-up phase. The financial plan must therefore cover the period from mechanical completion through to stable operation.`,
      `Reaching financial close means all funding commitments are signed and the money is available to spend. It is a major milestone, often celebrated, but it is not the end of financial discipline. During execution, the project manager reports cost and progress continuously, protects the contingency, and manages change orders carefully because every change affects both schedule and finance. In the end, a well-financed project is not the one with the cheapest money, but the one whose funding structure survives reality.`,
    ],
  },
  {
    id: 'risk-management',
    title: 'Risk Management in Engineering Projects',
    topic: 'engineering',
    topicLabel: '工程 · 风险管理',
    keyTerms: [
      { term: 'risk', meaning: '风险' },
      { term: 'mitigation', meaning: '缓解、减轻' },
      { term: 'hazard', meaning: '危害、危险源' },
      { term: 'HAZOP', meaning: '危险与可操作性分析' },
      { term: 'probability', meaning: '概率' },
      { term: 'impact', meaning: '影响' },
      { term: 'stakeholder', meaning: '利益相关方' },
      { term: 'contingency', meaning: '应急（储备）' },
      { term: 'audit', meaning: '审计' },
      { term: 'compliance', meaning: '合规' },
      { term: 'safety', meaning: '安全' },
      { term: 'reliability', meaning: '可靠性' },
      { term: 'commissioning', meaning: '调试' },
      { term: 'scope', meaning: '范围' },
      { term: 'change order', meaning: '变更指令' },
      { term: 'escalation', meaning: '升级、上报' },
      { term: 'downtime', meaning: '停机时间' },
      { term: 'inspection', meaning: '检验' },
      { term: 'quality', meaning: '质量' },
    ],
    paragraphs: [
      `Every engineering project carries risk. A risk is simply an uncertain event that, if it occurs, affects the project's objectives—cost, schedule, quality, or safety. The job of the project manager is not to eliminate risk, which is impossible, but to understand it, reduce what can be reduced, and prepare for what remains. Good risk management is what separates a stressful failure from a controlled challenge.`,
      `The first step is identification. The team lists what might go wrong: a key supplier might miss a delivery, a buried pipe might clash with electrical cable, a permit might be delayed. In chemical and process plants, a structured workshop called HAZOP is used to examine each part of the design for hazards and operability problems. By imagining how things could fail, the team can design safeguards before construction, which is far cheaper than fixing faults later.`,
      `Once risks are identified, each is judged by two dimensions: probability and impact. A rare event with small consequences may be accepted. A likely event with severe consequences demands immediate attention. This ranking helps the team spend its limited energy where it matters most. A simple risk matrix, with colors from green to red, makes the picture understandable for every stakeholder in the room.`,
      `Mitigation means reducing either the probability or the impact of a risk. To lower probability, you might qualify a second supplier or increase inspection of critical welds. To lower impact, you might hold spare equipment on site or buy insurance. Some risks are transferred to a contractor through a fixed-price contract. Others are simply accepted because the cost of avoidance would exceed the likely loss. The plan should state, for each major risk, who owns it and what action is scheduled.`,
      `Scope control is a quiet form of risk management. When the client asks for one small change, it can trigger a cascade of rework, new procurement, and delayed milestones. Every change order should be reviewed for its effect on cost, schedule, and safety before approval. A disciplined change process protects the project from slow, invisible drift that eventually becomes a crisis.`,
      `Safety deserves special emphasis in our industry. A process plant handles pressure, temperature, and sometimes toxic materials. Compliance with regulations is not paperwork; it is the line between a normal day and a disaster. Regular audits, clear procedures, and a culture where workers can report near-misses without blame all improve reliability. The goal is not zero reports but zero harm, supported by learning from every incident.`,
      `Even with the best plans, surprises happen. That is why a contingency—both time and money—is built into the baseline. When a problem appears, escalation paths must be clear: who is told, when, and with what information. Slow escalation turns a manageable issue into a missed milestone. Fast, honest communication with stakeholders keeps trust intact even when news is bad.`,
      `Finally, risk management is a habit, not a document. The register should be reviewed at every major meeting, not filed and forgotten. Lessons from commissioning and from earlier projects should feed the next one. Teams that treat risk as a living process tend to finish on time, within budget, and—most importantly—with everyone going home safely. In engineering, that outcome is the true measure of success.`,
    ],
  },
  {
    id: 'energy-transition',
    title: 'The Energy Transition and Sustainable Manufacturing',
    topic: 'career',
    topicLabel: '趋势 · 可持续制造',
    keyTerms: [
      { term: 'sustainability', meaning: '可持续性' },
      { term: 'carbon footprint', meaning: '碳足迹' },
      { term: 'emission', meaning: '排放' },
      { term: 'renewable', meaning: '可再生的' },
      { term: 'net zero', meaning: '净零（排放）' },
      { term: 'circular economy', meaning: '循环经济' },
      { term: 'efficiency', meaning: '效率' },
      { term: 'regulation', meaning: '法规' },
      { term: 'stakeholder', meaning: '利益相关方' },
      { term: 'supply chain', meaning: '供应链' },
      { term: 'innovation', meaning: '创新' },
      { term: 'lifecycle', meaning: '生命周期' },
      { term: 'waste', meaning: '废弃物' },
      { term: 'recycling', meaning: '回收' },
      { term: 'biofuel', meaning: '生物燃料' },
      { term: 'greenhouse gas', meaning: '温室气体' },
      { term: 'ESG', meaning: '环境、社会与治理' },
      { term: 'decarbonization', meaning: '脱碳' },
    ],
    paragraphs: [
      `The energy transition is reshaping how factories are designed, financed, and operated. At its heart is a simple but demanding goal: produce more with fewer emissions. For chemical and manufacturing companies, this is not only an environmental duty but a business necessity, because customers, investors, and regulators now judge performance through the lens of sustainability. A plant that ignores this shift risks becoming obsolete.`,
      `Decarbonization starts with measurement. A company must know its carbon footprint across the full lifecycle of a product, from raw material extraction through manufacturing to disposal. Greenhouse gas emissions are usually divided into those from own operations and those from purchased energy and the wider supply chain. Only after the numbers are visible can a credible reduction plan be built, with clear targets and a timeline toward net zero.`,
      `Energy efficiency is the cheapest decarbonization available. Improving insulation, recovering heat that would otherwise be wasted, and upgrading motors and pumps can cut consumption significantly. In many plants, small changes in operating practice save more than large capital projects. Reliability and efficiency go together: well-maintained equipment uses less energy and fails less often, reducing both cost and emissions.`,
      `Renewable energy is the next lever. Solar, wind, and sometimes biofuel can replace fossil power in many operations. For energy-intensive sites, securing a long-term renewable supply through power purchase agreements has become a standard part of the sustainability strategy. Some companies even redesign processes to run on electricity from clean grids rather than on-site combustion, shifting the emission problem upstream where it is easier to solve.`,
      `The circular economy offers a different kind of progress. Instead of making, using, and discarding, materials are kept in use through recycling, reuse, and smarter design. A chemical company might recover solvents from its own waste stream, or design a product so that its components can be separated at end of life. This reduces both waste and the need for virgin raw material, lowering cost and environmental impact at the same time.`,
      `Regulation and stakeholder pressure keep the momentum. Carbon pricing, efficiency standards, and disclosure rules are spreading across markets. Investors increasingly use ESG criteria to decide where to put capital, and customers ask detailed questions about the origin and impact of what they buy. Project managers who can speak this language—translating technical choices into sustainability outcomes—become far more valuable to their organizations.`,
      `Innovation ties it together. New catalysts, gentler reaction conditions, and digital controls that optimize energy use in real time are turning sustainability from a cost center into a source of advantage. Early movers often find that cleaner processes are also cheaper over the full lifecycle, because they waste less and comply without expensive retrofits. The companies that treat the transition as an engineering challenge, not a公关 exercise, tend to win.`,
      `In the end, sustainable manufacturing is a discipline of continuous improvement. It asks hard questions: Which emission can we avoid this quarter? Which supplier shares our standards? Where is the next efficiency gain hiding? The answers rarely come from a single grand project but from hundreds of small, consistent decisions. For the project manager, the energy transition is not a distant policy topic—it is the daily context in which every technical choice is now made.`,
    ],
  },
];

// 按当前日期轮换选出"今日推荐"文章
export function todaysArticle(): Article {
  const day = new Date().getDate();
  return articles[day % articles.length];
}
