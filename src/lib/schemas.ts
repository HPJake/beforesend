// Core domain types for BeforeSend

export type Relationship =
  | "friend"
  | "partner"
  | "coworker"
  | "boss"
  | "teacher"
  | "family"
  | "stranger"
  | "custom";

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  friend: "朋友",
  partner: "恋人",
  coworker: "同事",
  boss: "老板",
  teacher: "老师",
  family: "家人",
  stranger: "陌生人",
  custom: "自定义",
};

export type Goal =
  | "solve_problem"
  | "express_dissatisfaction"
  | "decline"
  | "apologize"
  | "persuade"
  | "set_boundary"
  | "ask_for_help"
  | "vent_emotion";

export const GOAL_LABELS: Record<Goal, string> = {
  solve_problem: "解决问题",
  express_dissatisfaction: "表达不满",
  decline: "拒绝",
  apologize: "道歉",
  persuade: "说服",
  set_boundary: "划清边界",
  ask_for_help: "获得帮助",
  vent_emotion: "表达情绪",
};

export interface AnalysisDimensions {
  /** 情绪强度 (0-100) — 越高越激烈 */
  emotion: number;
  /** 攻击性 (0-100) */
  aggression: number;
  /** 歧义 (0-100) — 容易被误读的程度 */
  ambiguity: number;
  /** 讽刺 / 阴阳怪气 (0-100) */
  sarcasm: number;
  /** 关系风险 (0-100) — 对当前关系可能造成的损伤 */
  relationship: number;
  /** 合作意愿 (0-100) — 越低越有对抗感 */
  collaboration: number;
}

export interface ToneRewrites {
  /** 温和 / 克制 */
  tone_30: string;
  /** 坚定 / 中性 */
  tone_60: string;
  /** 强硬 / 直接 */
  tone_90: string;
}

export interface AnalysisResult {
  /** 综合风险分 0-100 */
  risk_score: number;
  /** 各维度细项 */
  dimensions: AnalysisDimensions;
  /** 发送者真实意图（推断） */
  intent: string;
  /** 接收者可能理解的意思 */
  perceived_intent: string;
  /** 意图 - 感知偏差 0-100 */
  gap: number;
  /** 是否值得拦截 / 干预 */
  intervention_needed: boolean;
  /** 三档语气改写 */
  rewrites: ToneRewrites;
  /** 接收者第一反应模拟（可选） */
  receiver_reaction: string;
  /** 风险简评（一句话） */
  reason: string;
}

export interface AnalyzeRequest {
  message: string;
  relationship: Relationship;
  goal: Goal;
  customRelationship?: string;
}