"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: string }[];
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: SelectFieldProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <label className={cn("group flex flex-col gap-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-bg-elevated px-4 py-3 pr-10 text-base text-text transition-colors hover:border-border-strong focus:border-shield focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-bg-elevated text-text">
              {o.icon ? `${o.icon} ${o.label}` : o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
      </div>
      {selected?.icon && (
        <span className="text-xs text-text-subtle">
          {selected.icon} 已选择
        </span>
      )}
    </label>
  );
}