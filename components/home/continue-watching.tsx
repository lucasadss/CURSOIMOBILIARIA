"use client";

import type { Training } from "@/types";
import { flatLessons } from "@/lib/trainings";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { LessonCard } from "@/components/training/lesson-card";
import { ContentRow } from "./content-row";

const MAX = 4;

/**
 * "Continue assistindo" — lessons the member started but hasn't finished, most
 * progressed first. Compact landscape cards. Hidden when nothing is in progress.
 */
export function ContinueWatching({ training }: { training: Training }) {
  const hydrated = useHydrated();
  const lessonProgress = useProgress((s) => s.lessonProgress);
  const completed = useProgress((s) => s.completed);

  if (!hydrated) return null;

  const items = flatLessons(training)
    .map((entry) => {
      const k = `${training.slug}/${entry.lesson.slug}`;
      return { ...entry, p: lessonProgress[k] ?? 0, complete: !!completed[k] };
    })
    .filter((entry) => entry.p > 0 && !entry.complete)
    .sort((a, b) => b.p - a.p)
    .slice(0, MAX);

  if (items.length === 0) return null;

  return (
    <ContentRow
      title="Continue assistindo"
      align="center"
      itemWidth="w-[300px] sm:w-[400px] lg:w-[460px]"
    >
      {items.map(({ lesson, module }) => (
        <LessonCard
          key={lesson.slug}
          training={training}
          module={module}
          lesson={lesson}
          orientation="landscape"
          sizes="(max-width: 640px) 82vw, 460px"
        />
      ))}
    </ContentRow>
  );
}
