"use client";

import { motion } from "framer-motion";
import { cn, riskColor, riskLabel } from "@/lib/utils";

interface RiskBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({ score, size = "md", className }: RiskBadgeProps) {
  const level = riskColor(score);
  const colorMap = {
    low: { bg: "bg-risk-low/15", text: "text-risk-low", ring: "ring-risk-low/30" },
    mid: { bg: "bg-risk-mid/15", text: "text-risk-mid", ring: "ring-risk-mid/30" },
    high: { bg: "bg-risk-high/15", text: "text-risk-high", ring: "ring-risk-high/30" },
  };
  const c = colorMap[level];

  const sizeMap = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2.5",
  };
  const numSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={cn(
        "inline-flex items-center rounded-full ring-1 backdrop-blur",
        c.bg,
        c.text,
        c.ring,
        sizeMap[size],
        className,
      )}
    >
      <span className={cn("font-bold tabular-nums", numSize[size])}>
        {score}
      </span>
      <span className="opacity-70">·</span>
      <span className="font-semibold tracking-wider text-xs">
        {riskLabel(score)}
      </span>
    </motion.div>
  );
}