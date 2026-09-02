import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { ModuleDefinition } from "@/types";
import { getModuleBySlug } from "@/lib/modules";
import { cn } from "@/lib/utils";

export function NextStepCard({ module }: { module: ModuleDefinition }) {
  const next = module.nextModule ? getModuleBySlug(module.nextModule) : undefined;
  if (!next && !module.steps) return null;

  return (
    <div className="rounded-lg border border-hairline bg-panel p-4">
      <p className="section-label text-ink-muted">Próximo passo</p>

      {module.steps ? (
        <ol className="mt-3 space-y-2">
          {module.steps.map((s, i) => {
            const isCurrent = s.moduleSlug === module.slug;
            const done =
              i < module.steps!.findIndex((x) => x.moduleSlug === module.slug);
            return (
              <li key={i} className="flex items-center gap-2.5 text-sm">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border text-2xs",
                    done
                      ? "border-brand bg-brand text-brand-ink"
                      : isCurrent
                        ? "border-ink-muted text-ink"
                        : "border-hairline-strong text-ink-faint",
                  )}
                >
                  {done ? <Check className="size-3" /> : i + 1}
                </span>
                {s.moduleSlug && !isCurrent ? (
                  <Link
                    href={`/app/modulo/${s.moduleSlug}`}
                    className="text-ink-muted hover:text-ink"
                  >
                    {s.label}
                  </Link>
                ) : (
                  <span className={isCurrent ? "text-ink" : "text-ink-muted"}>
                    {s.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      ) : null}

      {next ? (
        <Link
          href={`/app/modulo/${next.slug}`}
          className="mt-3 flex items-center justify-between gap-3 rounded-md border border-hairline bg-panel-2/60 px-3 py-2.5 transition-colors hover:border-hairline-strong"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{next.name}</p>
            <p className="truncate text-xs text-ink-muted">{next.description}</p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-ink-faint" />
        </Link>
      ) : null}
    </div>
  );
}
