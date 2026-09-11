import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/llm";
import type { AnalyzeRequest, Goal } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

const VALID_RELATIONSHIPS = [
  "friend",
  "partner",
  "coworker",
  "boss",
  "teacher",
  "family",
  "stranger",
  "custom",
];

const VALID_GOALS = [
  "solve_problem",
  "express_dissatisfaction",
  "decline",
  "apologize",
  "persuade",
  "set_boundary",
  "ask_for_help",
  "vent_emotion",
];

function validate(body: unknown): { ok: true; data: AnalyzeRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

  if (typeof b.message !== "string" || b.message.trim().length === 0) {
    return { ok: false, error: "message is required" };
  }
  if (b.message.length > 1000) {
    return { ok: false, error: "message too long (max 1000 chars)" };
  }
  if (typeof b.relationship !== "string" || !VALID_RELATIONSHIPS.includes(b.relationship)) {
    return { ok: false, error: "invalid relationship" };
  }
  if (typeof b.goal !== "string" || !VALID_GOALS.includes(b.goal)) {
    return { ok: false, error: "invalid goal" };
  }
  if (b.customRelationship !== undefined && typeof b.customRelationship !== "string") {
    return { ok: false, error: "customRelationship must be string" };
  }

  return {
    ok: true,
    data: {
      message: b.message.trim(),
      relationship: b.relationship as AnalyzeRequest["relationship"],
      goal: b.goal as Goal,
      customRelationship:
        typeof b.customRelationship === "string" ? b.customRelationship.trim() : undefined,
    },
  };
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }

  try {
    const result = await analyzeMessage(v.data);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[analyze] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: "Analysis failed", detail: msg },
      { status: 500 },
    );
  }
}