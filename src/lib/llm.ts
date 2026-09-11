import { PROMPTS } from "./prompts";
import type { AnalysisResult, AnalyzeRequest } from "./schemas";
import { clamp } from "./utils";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices: { message: { content: string } }[];
}

/**
 * Call DeepSeek chat completions API.
 * Uses JSON mode (response_format: json_object) to guarantee parseable output.
 */
async function callDeepSeek(
  messages: DeepSeekMessage[],
  apiKey: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    }),
    signal,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `DeepSeek API error ${res.status}: ${errText.slice(0, 300) || res.statusText}`,
    );
  }

  const data = (await res.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from DeepSeek");
  return content;
}

function parseAndValidate(raw: string): AnalysisResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse LLM JSON: ${(e as Error).message}`);
  }
  const o = parsed as Partial<AnalysisResult>;
  if (
    typeof o.risk_score !== "number" ||
    !o.dimensions ||
    typeof o.intent !== "string" ||
    typeof o.perceived_intent !== "string" ||
    typeof o.gap !== "number" ||
    !o.rewrites
  ) {
    throw new Error("LLM JSON missing required fields");
  }

  // Coerce dimensions and clamp
  const dims = o.dimensions;
  const safe = (v: unknown, fallback = 50) =>
    clamp(typeof v === "number" ? v : fallback);

  return {
    risk_score: clamp(o.risk_score),
    dimensions: {
      emotion: safe(dims.emotion, 50),
      aggression: safe(dims.aggression, 30),
      ambiguity: safe(dims.ambiguity, 30),
      sarcasm: safe(dims.sarcasm, 20),
      relationship: safe(dims.relationship, 40),
      collaboration: safe(dims.collaboration, 60),
    },
    intent: o.intent,
    perceived_intent: o.perceived_intent,
    gap: clamp(o.gap),
    intervention_needed: Boolean(o.intervention_needed),
    rewrites: {
      tone_30: o.rewrites.tone_30 || "",
      tone_60: o.rewrites.tone_60 || "",
      tone_90: o.rewrites.tone_90 || "",
    },
    receiver_reaction: o.receiver_reaction || "",
    reason: o.reason || "",
  };
}

/**
 * Mock fallback used when no API key is configured.
 * Returns deterministic-ish results based on message length / punctuation.
 */
function mockAnalyze(req: AnalyzeRequest): AnalysisResult {
  const len = req.message.length;
  const exclam = (req.message.match(/[!?！？]/g) || []).length;
  const hasAccuse =
    /(为什么|怎么|就是|不|没|别)/.test(req.message) && len < 60;
  const baseRisk = clamp(
    30 + (hasAccuse ? 30 : 0) + exclam * 8 + Math.min(20, len / 6),
  );

  return {
    risk_score: baseRisk,
    dimensions: {
      emotion: clamp(baseRisk - 10),
      aggression: clamp(baseRisk - 15),
      ambiguity: clamp(20 + (len < 15 ? 30 : 10)),
      sarcasm: clamp(hasAccuse ? 25 : 10),
      relationship: clamp(baseRisk - 5),
      collaboration: clamp(100 - baseRisk),
    },
    intent: "希望把事情说清楚",
    perceived_intent: hasAccuse
      ? "对方可能在质疑你的能力或态度"
      : "对方可能会觉得被指责",
    gap: hasAccuse ? 65 : 35,
    intervention_needed: baseRisk >= 50,
    rewrites: {
      tone_30: `（温和版 · Mock）${req.message} —— 这是一个基于本地 mock 的示例，等待 API key 配置。`,
      tone_60: `（坚定版 · Mock）${req.message}`,
      tone_90: `（强硬版 · Mock）${req.message}`,
    },
    receiver_reaction:
      "【Mock 模式】请配置 DEEPSEEK_API_KEY 环境变量以启用真实分析。",
    reason: "Mock 数据 — 当前未配置 API key",
  };
}

export async function analyzeMessage(
  req: AnalyzeRequest,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("[BeforeSend] DEEPSEEK_API_KEY not set — using mock data");
    // Add small artificial delay so the loading UI has time to show
    await new Promise((r) => setTimeout(r, 700));
    return mockAnalyze(req);
  }

  const messages: DeepSeekMessage[] = [
    { role: "system", content: PROMPTS.system },
    { role: "user", content: PROMPTS.buildUser(req) },
  ];

  const raw = await callDeepSeek(messages, apiKey, signal);
  return parseAndValidate(raw);
}