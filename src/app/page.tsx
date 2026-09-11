"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SelectField } from "@/components/SelectField";
import {
  GOAL_LABELS,
  RELATIONSHIP_LABELS,
  type Goal,
  type Relationship,
} from "@/lib/schemas";
import { EXAMPLES } from "@/lib/examples";
import { cn } from "@/lib/utils";

const RELATIONSHIP_OPTIONS = (Object.entries(RELATIONSHIP_LABELS) as [Relationship, string][]).map(
  ([value, label]) => ({ value, label, icon: "👥" }),
);
const GOAL_OPTIONS = (Object.entries(GOAL_LABELS) as [Goal, string][]).map(
  ([value, label]) => ({ value, label, icon: "✨" }),
);

export default function HomePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("coworker");
  const [goal, setGoal] = useState<Goal>("solve_problem");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = message.trim().length > 0 && !submitting;

  function loadExample(idx: number) {
    const ex = EXAMPLES[idx];
    setMessage(ex.message);
    setRelationship(ex.relationship);
    setGoal(ex.goal);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    const params = new URLSearchParams({
      message: message.trim(),
      rel: relationship,
      goal,
    });
    router.push(`/analyze?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 md:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col items-center text-center md:mb-14"
      >
        <Logo size={44} className="mb-5" />
        <h1 className="mb-3 text-3xl md:text-5xl font-bold tracking-tight text-text">
          在发送之前，<br className="md:hidden" />
          看看对方听到的是什么。
        </h1>
        <p className="max-w-xl text-base md:text-lg text-text-muted">
          <span className="text-shield font-medium">BeforeSend</span> 是一个 AI 沟通防火墙。
          粘贴一条消息，我们告诉你对方会怎么理解它。
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-5"
      >
        {/* Message input */}
        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              准备发送的消息
            </span>
            <span className="text-xs text-text-subtle tabular-nums">
              {message.length} / 1000
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
            onKeyDown={handleKeyDown}
            placeholder="例如：这个问题我上周已经说过了，为什么你们就是没人听？"
            rows={5}
            className="w-full resize-none rounded-2xl border border-border bg-bg-elevated p-5 text-base leading-relaxed text-text placeholder:text-text-subtle transition-colors hover:border-border-strong focus:border-shield focus:outline-none"
            autoFocus
          />
        </label>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="对话对象"
            value={relationship}
            onChange={(v) => setRelationship(v as Relationship)}
            options={RELATIONSHIP_OPTIONS}
          />
          <SelectField
            label="沟通目标"
            value={goal}
            onChange={(v) => setGoal(v as Goal)}
            options={GOAL_OPTIONS}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl px-6 py-4 text-base font-semibold transition-all",
            "flex items-center justify-center gap-2.5",
            canSubmit
              ? "bg-gradient-to-br from-shield to-cool text-white shadow-[0_8px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
              : "bg-bg-elevated-2 text-text-subtle cursor-not-allowed",
          )}
        >
          {submitting ? (
            <span>正在跳转…</span>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Check Before Sending</span>
              <kbd className="ml-2 hidden md:inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-xs font-medium backdrop-blur">
                ⌘ ↵
              </kbd>
              <span aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </>
          )}
        </button>
      </motion.form>

      {/* Examples */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-10"
      >
        <div className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          <span>试试这些示例</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadExample(idx)}
              className="group flex flex-col items-start gap-1 rounded-xl border border-border bg-bg-elevated p-3 text-left transition-all hover:border-shield/40 hover:bg-bg-elevated-2"
            >
              <span className="text-base" aria-hidden>{ex.emoji}</span>
              <span className="text-xs font-medium text-text">{ex.label}</span>
              <span className="line-clamp-2 text-xs text-text-subtle">
                {ex.message}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Footer tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center text-xs text-text-subtle"
      >
        Not nicer. <span className="text-shield">Clearer.</span>
      </motion.p>
    </div>
  );
}