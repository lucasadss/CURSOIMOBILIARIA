import { cn } from "@/lib/utils";

/**
 * IMOVIX wordmark — provisional. Plain type, "IX" in the accent colour,
 * a small square mark for the collapsed state. No house/AI-chip iconography.
 */
export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex size-6 items-center justify-center rounded-[6px] bg-brand text-[11px] font-bold leading-none text-brand-ink">
        IX
      </span>
      {showText ? (
        <span className="text-sm font-semibold tracking-tight text-ink">
          IMOV<span className="text-brand">IX</span>
        </span>
      ) : null}
    </span>
  );
}
