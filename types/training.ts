export interface Lesson {
  slug: string;
  title: string;
  /** seconds */
  duration: number;
  summary?: string;
  /** real cover path once it exists; falls back to the training scene */
  thumbnail?: string;
  /** playback source — not wired to a real player yet */
  videoUrl?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  /** one short line under the module title on the Home row */
  description?: string;
  lessons: Lesson[];
}

export interface Training {
  slug: string;
  title: string;
  /** big line used in the training Hero; falls back to `title` */
  headline?: string;
  description: string;
  level: "Introdução" | "Intermediário" | "Avançado";
  /** which category scene to borrow for the fallback cover */
  scene?: import("./module").CategorySlug;
  thumbnail?: string;
  thumbnailAlt?: string;
  thumbnailPosition?: string;
  totalLessons: number;
  modules: TrainingModule[];
  materials?: { label: string; kind: "pdf" | "link" | "sheet" }[];
}
