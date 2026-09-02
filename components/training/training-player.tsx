"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, FileText, Play } from "lucide-react";
import type { Training } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { trainingLessonCount } from "@/lib/trainings";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { trainingCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/common/progress-bar";
import { FavoriteButton } from "@/components/common/favorite-button";

export function TrainingPlayer({
  training,
  initialLesson,
}: {
  training: Training;
  initialLesson?: string;
}) {
  const hydrated = useHydrated();
  const flat = training.modules.flatMap((m) => m.lessons);
  const [activeSlug, setActiveSlug] = React.useState(
    flat.some((l) => l.slug === initialLesson) ? initialLesson! : flat[0]?.slug,
  );
  const active = flat.find((l) => l.slug === activeSlug) ?? flat[0];

  const isDone = useProgress((s) => s.isDone);
  const toggleLesson = useProgress((s) => s.toggleLesson);
  const completedIn = useProgress((s) => s.completedIn);
  const setLastLesson = useProgress((s) => s.setLastLesson);
  const setLessonProgress = useProgress((s) => s.setLessonProgress);

  // Opening a lesson marks it started, so "Continue assistindo" on the Home
  // has something to resume. The store keeps the higher of old/new progress.
  React.useEffect(() => {
    if (!hydrated || !activeSlug) return;
    setLastLesson(training.slug, activeSlug);
    setLessonProgress(training.slug, activeSlug, 8);
  }, [hydrated, activeSlug, training.slug, setLastLesson, setLessonProgress]);

  const total = trainingLessonCount(training);
  const done = hydrated ? completedIn(training.slug) : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/app/treinamentos"
        className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Treinamentos
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg border border-hairline">
            <CoverImage
              cover={trainingCover(training)}
              seed={`treinamento-${training.slug}-${active?.slug ?? ""}`}
              sizes="(max-width: 1024px) 100vw, 760px"
              priority
              showSceneLabel={false}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-white/20 bg-canvas/60 text-ink backdrop-blur">
                <Play className="size-5 translate-x-0.5" />
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-medium text-ink">{active?.title}</h1>
              <p className="mt-1 text-xs text-ink-faint">
                {training.title} · {active ? formatDuration(active.duration) : ""}
              </p>
            </div>
            <FavoriteButton id={`training:${training.slug}`} kind="training" />
          </div>

          <p className="text-sm leading-relaxed text-ink-muted">
            {active?.summary ?? training.description}
          </p>

          {active ? (
            <Button
              variant={hydrated && isDone(training.slug, active.slug) ? "secondary" : "primary"}
              size="sm"
              onClick={() => toggleLesson(training.slug, active.slug)}
            >
              <Check />
              {hydrated && isDone(training.slug, active.slug)
                ? "Concluída"
                : "Marcar como concluída"}
            </Button>
          ) : null}

          {training.materials?.length ? (
            <div className="rounded-lg border border-hairline bg-panel p-4">
              <p className="section-label">
                Materiais
              </p>
              <ul className="mt-2 space-y-1.5">
                {training.materials.map((m, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                    <FileText className="size-3.5 text-ink-faint" />
                    {m.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-hairline bg-panel">
            <div className="border-b border-hairline p-4">
              <p className="text-sm font-medium text-ink">Conteúdo</p>
              <div className="mt-2 flex items-center gap-2">
                <ProgressBar value={total ? (done / total) * 100 : 0} className="flex-1" />
                <span className="text-2xs tabular-nums text-ink-faint">
                  {done}/{total}
                </span>
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {training.modules.map((mod) => (
                <div key={mod.id} className="mb-2">
                  <p className="px-2 py-1.5 text-2xs font-medium uppercase tracking-[0.07em] text-ink-faint">
                    {mod.title}
                  </p>
                  <ul>
                    {mod.lessons.map((l) => {
                      const activeRow = l.slug === activeSlug;
                      const complete = hydrated && isDone(training.slug, l.slug);
                      return (
                        <li key={l.slug}>
                          <button
                            type="button"
                            onClick={() => setActiveSlug(l.slug)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-xs transition-colors",
                              activeRow
                                ? "bg-white/[0.06] text-ink"
                                : "text-ink-muted hover:bg-white/[0.03] hover:text-ink",
                            )}
                          >
                            <span
                              className={cn(
                                "flex size-4 shrink-0 items-center justify-center rounded-full border text-2xs",
                                complete
                                  ? "border-brand bg-brand text-brand-ink"
                                  : "border-hairline-strong text-ink-faint",
                              )}
                            >
                              {complete ? <Check className="size-2.5" /> : null}
                            </span>
                            <span className="flex-1 truncate">{l.title}</span>
                            <span className="shrink-0 text-2xs text-ink-faint">
                              {formatDuration(l.duration)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
