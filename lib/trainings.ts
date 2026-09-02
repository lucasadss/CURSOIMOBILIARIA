import type { Training } from "@/types";

/**
 * The main course — shown on the Home as the members-area centrepiece. Lesson
 * titles/durations are placeholders until the real videos are cut; the shape
 * is the real one (Training → TrainingModule → Lesson).
 */
const fundamentos: Training = {
  slug: "fundamentos-imovel-ia",
  title: "Treinamento rápido",
  headline: "Domine a criação de conteúdos imobiliários com IA",
  description:
    "Aprenda a usar a plataforma e criar seus primeiros resultados — 5 vídeos curtos.",
  level: "Introdução",
  scene: "outros",
  thumbnailAlt: "Plantas baixas e laptop sobre uma mesa de mármore",
  totalLessons: 5,
  // A single sequence — the UI treats this course as one short playlist.
  modules: [
    {
      id: "treinamento-rapido",
      title: "Treinamento rápido",
      lessons: [
        {
          slug: "como-funciona-a-plataforma",
          title: "Como funciona a plataforma",
          summary: "Visão geral da IMOVIX e onde encontrar cada recurso.",
          duration: 240,
        },
        {
          slug: "gerando-seu-primeiro-prompt",
          title: "Gerando seu primeiro prompt",
          summary: "Como escolher um módulo, preencher os campos e gerar o prompt.",
          duration: 300,
        },
        {
          slug: "criando-imagens",
          title: "Criando imagens",
          summary: "Como usar o prompt gerado para criar imagens com IA.",
          duration: 360,
        },
        {
          slug: "criando-videos",
          title: "Criando vídeos",
          summary: "Como usar imagens e prompts para gerar vídeos.",
          duration: 360,
        },
        {
          slug: "melhorando-resultados",
          title: "Melhorando resultados",
          summary: "Como corrigir resultados ruins e refinar uma geração.",
          duration: 300,
        },
      ],
    },
  ],
  materials: [
    { label: "Checklist de foto (PDF)", kind: "pdf" },
    { label: "Planilha de prompts salvos", kind: "sheet" },
  ],
};

const videosQueConvertem: Training = {
  slug: "videos-que-convertem",
  title: "Vídeos que convertem",
  description:
    "Ritmo, movimento de câmera e trilha para timelapses e planos cinematográficos que seguram o público nos primeiros segundos.",
  level: "Intermediário",
  scene: "cinematograficos",
  thumbnailAlt: "Câmera de cinema equipada com microfone em estúdio",
  totalLessons: 5,
  modules: [
    {
      id: "linguagem-de-video",
      title: "Linguagem de vídeo",
      lessons: [
        { slug: "primeiros-segundos", title: "Os 3 primeiros segundos", duration: 300 },
        { slug: "camera", title: "Um movimento de câmera por plano", duration: 360 },
        { slug: "trilha", title: "Escolhendo trilha e efeitos", duration: 280 },
      ],
    },
    {
      id: "na-pratica",
      title: "Na prática",
      lessons: [
        { slug: "timelapse", title: "Timelapse de obra, passo a passo", duration: 600 },
        { slug: "drone", title: "Planos de drone sem enjoar", duration: 460 },
      ],
    },
  ],
  materials: [{ label: "Pack de trilhas livres", kind: "link" }],
};

const terrenoAoLancamento: Training = {
  slug: "terreno-ao-lancamento",
  title: "Do terreno ao lançamento",
  description:
    "Uma trilha completa para transformar um lote em uma campanha: metragem, projeção da casa, vídeo e peças para redes.",
  level: "Avançado",
  scene: "terrenos",
  thumbnailAlt: "Vista aérea vertical de uma rua residencial arborizada",
  totalLessons: 7,
  modules: [
    {
      id: "terreno",
      title: "Terreno",
      lessons: [
        { slug: "metragem", title: "Metragem destacada e animada", duration: 420 },
        { slug: "casa", title: "Projetando a casa no lote", duration: 480 },
        { slug: "empreendimento", title: "Contexto de empreendimento", duration: 360 },
      ],
    },
    {
      id: "campanha",
      title: "Campanha",
      lessons: [
        { slug: "video-terreno", title: "Vídeo do terreno para tráfego", duration: 520 },
        { slug: "cortes", title: "Cortes verticais para Reels", duration: 380 },
        { slug: "antes-depois", title: "Antes e depois como prova", duration: 300 },
        { slug: "entrega", title: "Montando a entrega para o cliente", duration: 440 },
      ],
    },
  ],
};

export const TRAININGS: Training[] = [
  fundamentos,
  videosQueConvertem,
  terrenoAoLancamento,
];

/** The course that leads the Home. */
export const PRIMARY_TRAINING_SLUG = "fundamentos-imovel-ia";

const TRAINING_BY_SLUG = new Map(TRAININGS.map((t) => [t.slug, t]));

export function getTraining(slug: string): Training | undefined {
  return TRAINING_BY_SLUG.get(slug);
}

export function getPrimaryTraining(): Training {
  return TRAINING_BY_SLUG.get(PRIMARY_TRAINING_SLUG) ?? TRAININGS[0];
}

export function trainingLessonCount(t: Training): number {
  return t.modules.reduce((acc, m) => acc + m.lessons.length, 0);
}

/** Flat lesson list with its module attached, in course order. */
export function flatLessons(t: Training) {
  return t.modules.flatMap((m, mi) =>
    m.lessons.map((lesson, li) => ({
      lesson,
      module: m,
      moduleIndex: mi,
      lessonIndex: li,
    })),
  );
}

/** Total runtime of a training, in whole minutes. */
export function trainingMinutes(t: Training): number {
  const seconds = t.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((s, l) => s + l.duration, 0),
    0,
  );
  return Math.max(1, Math.round(seconds / 60));
}
