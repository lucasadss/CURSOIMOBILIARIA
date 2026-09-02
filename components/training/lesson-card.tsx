"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import type { Training, TrainingModule, Lesson } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { trainingCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { ProgressBar } from "@/components/common/progress-bar";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";

/**
 * A single lesson tile. Thumbnail-first, streaming-style. `portrait` (3:4) is
 * the members-area look used in "Treinamento rápido"; `landscape` (16:9) is the
 * compact resume card used in "Continue assistindo".
 */
export function LessonCard({
  training,
  lesson,
  locked = false,
  orientation = "portrait",
  sizes = "(max-width: 640px) 44vw, 200px",
}: {
  training: Training;
  /** kept for call-site symmetry; not rendered */
  module?: TrainingModule;
  lesson: Lesson;
  locked?: boolean;
  orientation?: "portrait" | "landscape";
  sizes?: string;
}) {
  const hydrated = useHydrated();
  const progress = useProgress((s) => s.progressOf(training.slug, lesson.slug));
  const p = hydrated ? progress : 0;
  const done = p >= 100;
  const started = p > 0 && p < 100;
  const portrait = orientation === "portrait";
  const remaining = Math.round((lesson.duration * (100 - p)) / 100 / 60);

  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-hairline transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          portrait ? "aspect-[4/5]" : "aspect-video",
          !locked &&
            "group-hover:-translate-y-0.5 group-hover:border-hairline-strong group-hover:shadow-[var(--shadow-panel)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand",
        )}
      >
        <CoverImage
          cover={{ ...trainingCover(training), src: lesson.thumbnail }}
          seed={`aula-${training.slug}-${lesson.slug}`}
          sizes={sizes}
          showSceneLabel={false}
        />

        {locked ? (
          <span className="absolute inset-0 grid place-items-center bg-canvas/50 backdrop-blur-[1px]">
            <Lock className="size-4 text-ink-muted" />
          </span>
        ) : done ? (
          <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-brand text-brand-ink">
            <Check className="size-3" />
          </span>
        ) : null}

        {!portrait ? (
          <span className="absolute bottom-2 right-2 rounded bg-canvas/75 px-1.5 py-0.5 text-2xs font-medium tabular-nums text-ink-muted backdrop-blur">
            {formatDuration(lesson.duration)}
          </span>
        ) : null}

        {started && !portrait ? (
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
            <span className="block h-full bg-brand" style={{ width: `${p}%` }} />
          </span>
        ) : null}
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-snug text-ink">
        {lesson.title}
      </p>
      {portrait ? (
        <>
          <p className="mt-0.5 text-2xs tabular-nums text-ink-faint">
            {formatDuration(lesson.duration)}
          </p>
          {started ? <ProgressBar value={p} className="mt-1.5" /> : null}
        </>
      ) : started ? (
        <p className="mt-0.5 text-2xs tabular-nums text-ink-faint">
          {remaining > 0 ? `${remaining} min restantes` : "quase lá"}
        </p>
      ) : null}
    </>
  );

  if (locked) {
    return (
      <div className="block cursor-not-allowed opacity-60" aria-disabled>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/app/treinamento/${training.slug}?aula=${lesson.slug}`}
      className="group block focus-visible:outline-none"
    >
      {body}
    </Link>
  );
}
