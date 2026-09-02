import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  showLabel = false,
}: {
  /** 0–100 */
  value: number;
  className?: string;
  showLabel?: boolean;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.1]">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel ? (
        <span className="w-9 text-right text-xs tabular-nums text-ink-faint">{v}%</span>
      ) : null}
    </div>
  );
}
