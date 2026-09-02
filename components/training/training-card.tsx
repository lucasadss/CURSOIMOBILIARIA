"use client";

import Link from "next/link";
import type { Training } from "@/types";
import { trainingCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { ProgressBar } from "@/components/common/progress-bar";
import { FavoriteButton } from "@/components/common/favorite-button";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { trainingLessonCount, trainingMinutes } from "@/lib/trainings";

export function TrainingCard({
  training,
  sizes = "(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 340px",
}: {
  training: Training;
  sizes?: string;
}) {
  const hydrated = useHydrated();
  const done = useProgress((s) => s.completedIn(training.slug));
  const total = trainingLessonCount(training);
  const pct = hydrated && total ? (done / total) * 100 : 0;
  const started = pct > 0;

  return (
    <Link
      href={`/app/treinamento/${training.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-hairline transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:border-hairline-strong group-hover:shadow-[var(--shadow-panel)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand">
        <CoverImage
          cover={trainingCover(training)}
          seed={`treinamento-${training.slug}`}
          sizes={sizes}
          showSceneLabel={false}
        />
        <span className="absolute left-2.5 top-2.5 rounded bg-canvas/70 px-1.5 py-0.5 text-2xs font-medium text-ink-muted backdrop-blur">
          {training.level}
        </span>
        <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <FavoriteButton id={`training:${training.slug}`} kind="training" size="sm" />
        </div>
      </div>

      <div className="mt-2.5">
        <p className="text-sm font-medium text-ink">{training.title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-ink-muted">
          {training.description}
        </p>
        <p className="mt-2 text-2xs tabular-nums text-ink-faint">
          {total} aulas · ~{trainingMinutes(training)} min
        </p>
        {started ? (
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar value={pct} className="flex-1" />
            <span className="shrink-0 text-2xs tabular-nums text-ink-faint">
              {done}/{total}
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
