"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import type { Training } from "@/types";
import { HERO } from "@/lib/assets";
import { flatLessons, trainingLessonCount, trainingMinutes } from "@/lib/trainings";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { Button } from "@/components/ui/button";
import { CoverScene } from "@/components/common/cover-scene";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * The Home Hero, repurposed as the spotlight for the main course. Same visual
 * treatment as before (media / scene + editorial gradient) — different job:
 * "here's the training you own, pick up where you left off".
 */
export function TrainingHero({ training }: { training: Training }) {
  const hydrated = useHydrated();
  const completed = useProgress((s) => s.completed);
  const lessonProgress = useProgress((s) => s.lessonProgress);

  const flat = flatLessons(training);
  const total = trainingLessonCount(training);
  const minutes = trainingMinutes(training);

  const doneCount = hydrated
    ? flat.filter((e) => completed[`${training.slug}/${e.lesson.slug}`]).length
    : 0;
  const startedCount = hydrated
    ? flat.filter((e) => {
        const k = `${training.slug}/${e.lesson.slug}`;
        return (lessonProgress[k] ?? 0) > 0 && !completed[k];
      }).length
    : 0;

  const hasStarted = doneCount > 0 || startedCount > 0;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  const resume =
    flat.find((e) => {
      const k = `${training.slug}/${e.lesson.slug}`;
      return (lessonProgress[k] ?? 0) > 0 && !completed[k];
    }) ??
    flat.find((e) => !completed[`${training.slug}/${e.lesson.slug}`]) ??
    flat[0];
  const resumeNumber = resume ? flat.indexOf(resume) + 1 : 1;

  const hasMedia = Boolean(HERO.image || HERO.video);

  return (
    <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden border-b border-hairline lg:min-h-[58vh]">
      <div className="absolute inset-0 -z-20">
        {HERO.video ? (
          <video
            className="size-full object-cover"
            style={{ objectPosition: HERO.objectPosition }}
            autoPlay
            muted
            loop
            playsInline
            poster={HERO.poster}
          >
            <source src={HERO.video} type="video/mp4" />
          </video>
        ) : HERO.image ? (
          <Image
            src={HERO.image}
            alt={HERO.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: HERO.objectPosition }}
          />
        ) : (
          <CoverScene scene={training.scene ?? "outros"} seed="hero-treinamento" />
        )}
      </div>

      <div aria-hidden className="absolute inset-0 -z-10 bg-canvas/35" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-canvas via-canvas/70 to-transparent"
      />
      {!hasMedia ? (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      ) : null}

      <div className="mx-auto w-full max-w-[1360px] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center animate-rise">
          <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-brand">
            IMOVIX · Treinamento
          </p>
          <h1 className="mt-3 text-balance text-2xl font-medium leading-[1.14] text-ink sm:text-3xl lg:text-[2.5rem]">
            {training.headline ?? training.title}
          </h1>
          <p className="mt-4 max-w-[36rem] text-base leading-relaxed text-ink-muted">
            {training.description}
          </p>
          <p className="mt-3 text-sm tabular-nums text-ink-faint">
            {total} aulas • ~{minutes} min
          </p>

          {hydrated && hasStarted ? (
            <div className="mt-5 w-full max-w-[22rem]">
              <p className="text-xs text-ink-muted">
                Aula {String(resumeNumber).padStart(2, "0")} — {resume?.lesson.title}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.12]">
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="text-2xs tabular-nums text-ink-faint">
                  {pct}% concluído
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {hydrated && hasStarted ? (
              <Button asChild size="lg">
                <Link href={`/app/treinamento/${training.slug}?aula=${resume?.lesson.slug ?? ""}`}>
                  <Play className="size-4" />
                  Continuar treinamento
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link href={`/app/treinamento/${training.slug}`}>
                  Começar treinamento
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
            <Button asChild size="lg" variant="ghost">
              <Link href="/app/explorar">Explorar ferramentas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
