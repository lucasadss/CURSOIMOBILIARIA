import { getPrimaryTraining, flatLessons } from "@/lib/trainings";
import { LessonCard } from "@/components/training/lesson-card";
import { ContentRow } from "./content-row";

/**
 * "Treinamento rápido" — the whole course as one short row of vertical (3:4)
 * lesson cards. 4–5 cards fit in a single desktop row; it carousels below that
 * and on mobile.
 */
export function QuickTrainingRow() {
  const course = getPrimaryTraining();
  const lessons = flatLessons(course);

  return (
    <ContentRow
      kicker="Primeiros passos"
      title="Treinamento rápido"
      subtitle="Aprenda a usar a plataforma e criar seus primeiros resultados."
      align="center"
      itemWidth="w-[210px] sm:w-[250px] lg:w-[280px]"
    >
      {lessons.map(({ lesson, module }) => (
        <LessonCard
          key={lesson.slug}
          training={course}
          module={module}
          lesson={lesson}
          orientation="portrait"
          sizes="(max-width: 640px) 58vw, 280px"
        />
      ))}
    </ContentRow>
  );
}
