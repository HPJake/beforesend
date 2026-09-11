"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ToneRewrites } from "@/lib/schemas";

interface ToneSliderProps {
  rewrites: ToneRewrites;
  className?: string;
}

const PRESETS = [
  { value: 30, label: "温和", emoji: "🧊" },
  { value: 60, label: "坚定", emoji: "⚖️" },
  { value: 90, label: "强硬", emoji: "🔥" },
];

export function ToneSlider({ rewrites, className }: ToneSliderProps) {
  const [value, setValue] = useState(60);
  const [copied, setCopied] = useState(false);

  const currentText =
    value <= 45
      ? rewrites.tone_30
      : value <= 75
      ? rewrites.tone_60
      : rewrites.tone_90;

  async function copy() {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const activePreset = PRESETS.reduce((closest, p) =>
    Math.abs(p.value - value) < Math.abs(closest.value - value) ? p : closest,
  );

  return (
    <div className={cn("rounded-2xl border border-border bg-bg-elevated p-5 md:p-6", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-text">Tone</span>
          <span className="text-sm text-text-muted">— 控制表达强度</span>
        </div>
        <div className="text-sm font-semibold tabular-nums text-text-muted">
          {value}
        </div>
      </div>

      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="w-full appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-cool [&::-webkit-slider-runnable-track]:via-text-muted [&::-webkit-slider-runnable-track]:to-warm
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-text
            [&::-webkit-slider-thumb]:-mt-1.75 [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]
            [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
          aria-label="Tone intensity"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span aria-hidden>🧊</span>
            <span>克制</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span>强硬</span>
            <span aria-hidden>🔥</span>
          </span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {PRESETS.map((p) => {
          const active = activePreset.value === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setValue(p.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                active
                  ? "border-shield/50 bg-shield/10 text-text"
                  : "border-border bg-bg-elevated-2 text-text-muted hover:border-border-strong hover:text-text",
              )}
            >
              <span className="text-base" aria-hidden>{p.emoji}</span>
              <span>{p.value} · {p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Rewrite display */}
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-5 rounded-xl border border-border bg-bg p-4 md:p-5"
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed text-text">{currentText}</p>
      </motion.div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            copied
              ? "border-shield/50 bg-shield/15 text-shield"
              : "border-border bg-bg-elevated-2 text-text hover:border-border-strong",
          )}
        >
          {copied ? (
            <>
              <span aria-hidden>✓</span> Copied
            </>
          ) : (
            <>
              <span aria-hidden>⧉</span> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}