import { Lock } from "lucide-react";
import type { AccessLevel } from "@/types";
import { cn } from "@/lib/utils";

const COPY: Record<AccessLevel, string | null> = {
  free: null,
  pro: "Pro",
  premium: "Premium",
};

export function AccessBadge({
  level,
  className,
}: {
  level: AccessLevel;
  className?: string;
}) {
  const label = COPY[level];
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-canvas/70 px-1.5 py-0.5 text-2xs font-medium text-ink-muted backdrop-blur",
        className,
      )}
    >
      <Lock className="size-2.5" />
      {label}
    </span>
  );
}
