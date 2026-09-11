"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GapVisualProps {
  intent: string;
  perceivedIntent: string;
  gap: number;
  className?: string;
}

export function GapVisual({ intent, perceivedIntent, gap, className }: GapVisualProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch", className)}>
      {/* YOU MEAN */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-cool/30 bg-cool/5 p-5 md:p-6"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">👤</span>
          <span className="text-xs font-bold uppercase tracking-wider text-cool">You Mean</span>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-text">{intent}</p>
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-cool/50 to-transparent" />
      </motion.div>

      {/* GAP center */}
      <div className="flex flex-col items-center justify-center gap-3 px-2 md:px-4 min-w-[120px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
          className="text-center"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">Gap</div>
          <div className="text-4xl md:text-5xl font-bold tabular-nums bg-gradient-to-br from-cool via-warm to-risk-high bg-clip-text text-transparent">
            {gap}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 text-text-subtle"
          aria-hidden
        >
          <span className="hidden md:block h-px w-12 bg-gradient-to-r from-cool/40 to-transparent" />
          <span className="text-lg">⇄</span>
          <span className="hidden md:block h-px w-12 bg-gradient-to-l from-warm/40 to-transparent" />
        </motion.div>
      </div>

      {/* THEY MAY HEAR */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-warm/30 bg-warm/5 p-5 md:p-6"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xl">👀</span>
          <span className="text-xs font-bold uppercase tracking-wider text-warm">They May Hear</span>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-text">{perceivedIntent}</p>
        <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-warm/50 to-transparent" />
      </motion.div>
    </div>
  );
}