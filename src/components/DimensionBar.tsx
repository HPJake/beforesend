"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DimensionBarProps {
  label: string;
  value: number;
  /** if true, lower value = more "bad" (e.g. collaboration) */
  inverted?: boolean;
  delay?: number;
}

function barColor(value: number, inverted?: boolean): string {
  const v = inverted ? 100 - value : value;
  if (v < 35) return "from-risk-low to-risk-low";
  if (v < 65) return "from-risk-mid to-risk-mid";
  return "from-risk-high to-risk-high";
}

export function DimensionBar({
  label,
  value,
  inverted,
  delay = 0,
}: DimensionBarProps) {
  const v = Math.max(0, Math.min(100, value));
  const colorClass = barColor(v, inverted);

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-sm text-text-muted">{label}</div>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-bg-elevated-2">
        <motion.div
          className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="w-10 shrink-0 text-right text-sm font-semibold tabular-nums text-text">
        {v}
      </div>
    </div>
  );
}