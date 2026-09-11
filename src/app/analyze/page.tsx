"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { RiskBadge } from "@/components/RiskBadge";
import { DimensionBar } from "@/components/DimensionBar";
import { GapVisual } from "@/components/GapVisual";
import { ToneSlider } from "@/components/ToneSlider";
import { cn, riskText } from "@/lib/utils";
import {
  GOAL_LABELS,
  RELATIONSHIP_LABELS,
  type AnalysisResult,
  type Goal,
  type Relationship,
} from "@/lib/schemas";

function AnalyzeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const message = params.get("message") || "";
  const rel = (params.get("rel") || "coworker") as Relationship;
  const goal = (params.get("goal") || "solve_problem") as Goal;

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReceiver, setShowReceiver] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, relationship: rel, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || data?.detail || `HTTP ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!message) {
      router.push("/");
      return;
    }
    // run() sets loading/error/result via fetch promise — handled by lint rule
    // eslint-disable-next-line react-hooks/set-state-in-effect
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, rel, goal]);

  const relLabel = RELATIONSHIP_LABELS[rel] || rel;
  const goalLabel = GOAL_LABELS[goal] || goal;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 md:py-12">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-text-muted transition-colors hover:bg-bg-elevated hover:text-text"
        >
          <ArrowLeft size={16} />
          返回编辑
        </Link>
        <Logo size={28} />
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-text-muted transition-colors hover:bg-bg-elevated hover:text-text disabled:opacity-50"
        >
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          重新分析
        </button>
      </div>

      {/* Meta strip */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span className="rounded-full bg-bg-elevated px-3 py-1">
          👥 {relLabel}
        </span>
        <span className="rounded-full bg-bg-elevated px-3 py-1">
          ✨ {goalLabel}
        </span>
      </div>

      {/* Original message */}
      <div className="mb-8 rounded-2xl border border-border bg-bg-elevated p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          你的消息
        </div>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-text">
          {message}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-border bg-bg-elevated p-10 text-center"
          >
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-shield/30 border-t-shield" />
            <p className="text-sm text-text-muted">正在扫描沟通风险…</p>
            <p className="mt-1 text-xs text-text-subtle">
              模拟对方可能听到的版本
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-risk-high/30 bg-risk-high/10 p-6 text-center"
          >
            <p className="text-sm font-semibold text-risk-high">分析失败</p>
            <p className="mt-1 text-xs text-text-muted">{error}</p>
            <button
              onClick={run}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 text-xs text-text hover:bg-bg-elevated-2"
            >
              <RefreshCw size={14} />
              重试
            </button>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Risk header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Communication Risk
                </div>
                <div className="flex items-baseline gap-2">
                  <RiskBadge score={result.risk_score} size="lg" />
                  <span className="text-sm text-text-muted">
                    / 100
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-muted">{riskText(result.risk_score)}</p>
              </div>
              {result.reason && (
                <p className="max-w-md text-sm italic text-text-subtle">
                  &ldquo;{result.reason}&rdquo;
                </p>
              )}
            </div>

            {/* Dimension bars */}
            <div className="rounded-2xl border border-border bg-bg-elevated p-5 md:p-6">
              <div className="space-y-3">
                <DimensionBar label="情绪强度" value={result.dimensions.emotion} delay={0.0} />
                <DimensionBar label="攻击性" value={result.dimensions.aggression} delay={0.05} />
                <DimensionBar label="歧义" value={result.dimensions.ambiguity} delay={0.1} />
                <DimensionBar label="讽刺 / 阴阳怪气" value={result.dimensions.sarcasm} delay={0.15} />
                <DimensionBar label="关系风险" value={result.dimensions.relationship} delay={0.2} />
                <DimensionBar label="合作意愿" value={result.dimensions.collaboration} inverted delay={0.25} />
              </div>
            </div>

            {/* Gap */}
            <GapVisual
              intent={result.intent}
              perceivedIntent={result.perceived_intent}
              gap={result.gap}
            />

            {/* Receiver simulation toggle */}
            <button
              type="button"
              onClick={() => setShowReceiver((v) => !v)}
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-border-strong"
            >
              <Eye size={16} className="text-cool" />
              {showReceiver ? "隐藏" : "查看"}对方的第一反应
            </button>

            <AnimatePresence>
              {showReceiver && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-2xl border border-cool/30 bg-cool/5 p-5 md:p-6">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-cool">
                      如果我是你的{relLabel}
                    </div>
                    <p className="whitespace-pre-wrap text-base leading-relaxed text-text">
                      {result.receiver_reaction}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tone slider */}
            <ToneSlider rewrites={result.rewrites} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-shield/30 border-t-shield" />
      </div>
    }>
      <AnalyzeInner />
    </Suspense>
  );
}