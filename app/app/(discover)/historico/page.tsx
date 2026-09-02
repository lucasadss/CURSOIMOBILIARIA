"use client";

import Link from "next/link";
import { ArrowUpRight, History as HistoryIcon } from "lucide-react";
import { useHistory } from "@/lib/storage/history";
import { useHydrated } from "@/hooks/use-hydrated";
import { relativeTime } from "@/lib/utils";
import { getToolProfile } from "@/lib/prompt-engine";
import { coverFromRef } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/common/copy-button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoricoPage() {
  const hydrated = useHydrated();
  const visits = useHistory((s) => s.visits);
  const prompts = useHistory((s) => s.prompts);
  const clearVisits = useHistory((s) => s.clearVisits);
  const clearPrompts = useHistory((s) => s.clearPrompts);

  return (
    <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-ink">Histórico</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Seus últimos módulos e os prompts que você gerou. Fica salvo só neste
          navegador.
        </p>
      </div>

      {!hydrated ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : visits.length === 0 && prompts.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="Nada por aqui ainda"
          description="Abra um módulo e gere um prompt — o histórico aparece automaticamente."
          action={
            <Button asChild size="sm">
              <Link href="/app/explorar">Explorar módulos</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          {visits.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="section-label">
                  Módulos recentes
                </h2>
                <button
                  onClick={clearVisits}
                  className="text-xs text-ink-faint hover:text-ink"
                >
                  Limpar
                </button>
              </div>
              <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
                {visits.map((v) => (
                  <li key={v.slug}>
                    <Link
                      href={`/app/modulo/${v.slug}`}
                      className="flex items-center gap-3 bg-panel px-3 py-2.5 transition-colors hover:bg-panel-2"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-hairline">
                        <CoverImage
                          cover={coverFromRef(v)}
                          seed={v.slug}
                          sizes="40px"
                          showOverlay={false}
                          showSceneLabel={false}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {v.name}
                        </p>
                        <p className="text-2xs text-ink-faint">
                          {relativeTime(v.lastUsedAt)}
                        </p>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-ink-faint" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {prompts.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="section-label">
                  Prompts gerados
                </h2>
                <button
                  onClick={clearPrompts}
                  className="text-xs text-ink-faint hover:text-ink"
                >
                  Limpar
                </button>
              </div>
              <ul className="space-y-2.5">
                {prompts.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-hairline bg-panel p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/app/modulo/${p.moduleSlug}`}
                        className="text-sm font-medium text-ink underline-offset-2 hover:underline"
                      >
                        {p.moduleName}
                      </Link>
                      <Badge variant="outline">{getToolProfile(p.tool).label}</Badge>
                      <Badge variant="neutral">
                        {p.kind === "video" ? "Vídeo" : "Imagem"}
                      </Badge>
                      <span className="ml-auto text-2xs text-ink-faint">
                        {relativeTime(p.createdAt)}
                      </span>
                    </div>
                    <pre className="mt-2 line-clamp-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink-muted">
                      {p.text}
                    </pre>
                    <div className="mt-2.5 flex gap-2">
                      <CopyButton value={p.text} size="sm" />
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/app/modulo/${p.moduleSlug}`}>Abrir módulo</Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
