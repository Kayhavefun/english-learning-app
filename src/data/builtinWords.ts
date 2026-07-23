import type { Word } from '../types';

// 内置词库：面向「化工工程行业项目经理」的商务英语中高级词汇。
// 按 20 个专业领域拆分在 ./bec/*.ts，此处合并为单一数组，供运行时与用户自定义词合并。
// 各领域：工艺与单元操作、化学反应与物料、设备与机械、仪表与控制、工厂与设施、
// 项目管理基础、EPC 全周期、进度与赶工、成本与合同、采购与厂商、质量与检验、
// HSE、调试与开车、维修与运行、会议与沟通、谈判与商务、报告与邮件、财务与会计、
// 人力与团队、通用商务动词短语。
import { processWords } from './bec/process';
import { reactionWords } from './bec/reactions';
import { equipmentWords } from './bec/equipment';
import { instrumentWords } from './bec/instrumentation';
import { plantWords } from './bec/plant';
import { pmBasicsWords } from './bec/pm-basics';
import { epcLifecycleWords } from './bec/epc-lifecycle';
import { scheduleWords } from './bec/schedule';
import { costContractWords } from './bec/cost-contract';
import { procurementWords } from './bec/procurement';
import { qualityWords } from './bec/quality';
import { hseWords } from './bec/hse';
import { commissioningWords } from './bec/commissioning';
import { maintenanceWords } from './bec/maintenance';
import { meetingWords } from './bec/meetings';
import { negotiationWords } from './bec/negotiation';
import { reportingWords } from './bec/reporting';
import { accountingWords } from './bec/accounting';
import { hrWords } from './bec/hr';
import { generalVerbWords } from './bec/general-verbs';

export const builtinWords: Word[] = [
  ...processWords,
  ...reactionWords,
  ...equipmentWords,
  ...instrumentWords,
  ...plantWords,
  ...pmBasicsWords,
  ...epcLifecycleWords,
  ...scheduleWords,
  ...costContractWords,
  ...procurementWords,
  ...qualityWords,
  ...hseWords,
  ...commissioningWords,
  ...maintenanceWords,
  ...meetingWords,
  ...negotiationWords,
  ...reportingWords,
  ...accountingWords,
  ...hrWords,
  ...generalVerbWords,
];
