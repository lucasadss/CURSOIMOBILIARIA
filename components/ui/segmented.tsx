"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export function SegmentedControl({
  options,
  value,
  onValueChange,
  size = "md",
  className,
  ...aria
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      {...aria}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-hairline-strong bg-panel-2 p-0.5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "rounded-[5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
              size === "sm" ? "h-6 px-2.5 text-xs" : "h-7 px-3 text-sm",
              active
                ? "bg-elevated text-ink shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
