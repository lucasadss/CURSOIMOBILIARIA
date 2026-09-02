"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProgressState {
  /** map of `${trainingSlug}/${lessonSlug}` -> true */
  completed: Record<string, boolean>;
  /** map of `${trainingSlug}/${lessonSlug}` -> 0..100 (partial watch) */
  lessonProgress: Record<string, number>;
  /** map of `${trainingSlug}` -> last opened lessonSlug */
  lastLesson: Record<string, string>;
  toggleLesson: (trainingSlug: string, lessonSlug: string) => void;
  setLessonProgress: (
    trainingSlug: string,
    lessonSlug: string,
    value: number,
  ) => void;
  setLastLesson: (trainingSlug: string, lessonSlug: string) => void;
  isDone: (trainingSlug: string, lessonSlug: string) => boolean;
  /** 0..100 — 100 when completed, else the partial value (or 0) */
  progressOf: (trainingSlug: string, lessonSlug: string) => number;
  completedIn: (trainingSlug: string) => number;
  /** lessons with any progress but not yet completed */
  startedIn: (trainingSlug: string) => number;
}

const key = (t: string, l: string) => `${t}/${l}`;

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      lessonProgress: {},
      lastLesson: {},
      toggleLesson: (t, l) =>
        set((s) => {
          const k = key(t, l);
          const completed = { ...s.completed };
          const lessonProgress = { ...s.lessonProgress };
          if (completed[k]) {
            delete completed[k];
            lessonProgress[k] = 40; // back to "in progress", not zero
          } else {
            completed[k] = true;
            lessonProgress[k] = 100;
          }
          return { completed, lessonProgress };
        }),
      setLessonProgress: (t, l, value) =>
        set((s) => {
          const k = key(t, l);
          const next = Math.max(0, Math.min(100, Math.round(value)));
          if ((s.lessonProgress[k] ?? 0) >= next) return s;
          return { lessonProgress: { ...s.lessonProgress, [k]: next } };
        }),
      setLastLesson: (t, l) =>
        set((s) => ({ lastLesson: { ...s.lastLesson, [t]: l } })),
      isDone: (t, l) => !!get().completed[key(t, l)],
      progressOf: (t, l) => {
        const k = key(t, l);
        if (get().completed[k]) return 100;
        return get().lessonProgress[k] ?? 0;
      },
      completedIn: (t) =>
        Object.keys(get().completed).filter((k) => k.startsWith(`${t}/`)).length,
      startedIn: (t) => {
        const { completed, lessonProgress } = get();
        return Object.keys(lessonProgress).filter(
          (k) =>
            k.startsWith(`${t}/`) &&
            (lessonProgress[k] ?? 0) > 0 &&
            !completed[k],
        ).length;
      },
    }),
    {
      name: "imovel-ia:progress",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return { lessonProgress: {}, lastLesson: {}, completed: {}, ...p };
      },
    },
  ),
);
