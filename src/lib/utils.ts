import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/** Color for a 0-100 risk score */
export function riskColor(score: number): "low" | "mid" | "high" {
  if (score < 35) return "low";
  if (score < 65) return "mid";
  return "high";
}

export function riskText(score: number): string {
  if (score < 35) return "Looks good.";
  if (score < 65) return "Hold on — worth a second look.";
  return "High risk — pause and review.";
}

export function riskLabel(score: number): string {
  if (score < 35) return "LOW";
  if (score < 65) return "MID";
  return "HIGH";
}