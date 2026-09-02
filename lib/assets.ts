import type {
  CategoryDefinition,
  CategorySlug,
  CoverOverlay,
  ModuleSummary,
  Training,
} from "@/types";
import { CATEGORY_MAP } from "./categories";

/* ============================================================================
   Asset layer — the single place that turns a module/category/training into a
   resolved cover. No image URLs live in components.

   Real photos go in /public/thumbnails/<slug>.jpg . Until a file exists the UI
   draws the category "scene" (a warm dark architectural illustration that
   depicts the subject — not an abstract gradient). Register a slug below the
   moment you drop its file in.
   ========================================================================== */

export const AVAILABLE_THUMBS: ReadonlySet<string> = new Set<string>([
  // 5 flagship modules
  "decoracao-de-interiores",
  "casa-em-terreno",
  "metragem-do-terreno",
  "timelapse-de-construcao",
  "mobiliando-comodos",
  // modules with a hover preview video (poster frame doubles as the thumb)
  "entrada-cinematografica",
  "apresentacao-profissional",
  "building-revealing-video",
  "voo-de-drone",
  // categories
  "categoria-terrenos",
  "categoria-construcao",
  "categoria-interiores",
  "categoria-imovel-pronto",
  "categoria-cinematograficos",
  // trainings
  "treinamento-fundamentos-imovel-ia",
  "treinamento-videos-que-convertem",
  "treinamento-terreno-ao-lancamento",
  // hero
  "hero",
]);

/**
 * Modules with a short, muted, looping hover-preview clip at
 * /public/thumbnails/<slug>-preview.mp4. Desktop-only — see <CoverImage>.
 */
export const AVAILABLE_PREVIEWS: ReadonlySet<string> = new Set<string>([
  "entrada-cinematografica",
  "apresentacao-profissional",
  "building-revealing-video",
  "voo-de-drone",
  "mobiliando-comodos",
]);

/** Cinematic hero. Drop /public/hero.jpg (and optionally /public/hero.mp4). */
export const HERO = {
  image: AVAILABLE_THUMBS.has("hero") ? "/thumbnails/hero.jpg" : undefined,
  video: undefined as string | undefined,
  poster: AVAILABLE_THUMBS.has("hero") ? "/thumbnails/hero.jpg" : undefined,
  objectPosition: "50% 42%",
  alt: "Casa contemporânea iluminada ao entardecer, fachada de vidro e concreto",
};

/** 1×1 warm-black pixel — keeps <Image placeholder="blur"> from flashing. */
export const BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAPAAAAsLDAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export type SceneId = CategorySlug;

const OVERLAY_CLASS: Record<CoverOverlay, string> = {
  none: "",
  soft: "bg-gradient-to-t from-canvas/70 via-canvas/10 to-transparent",
  strong: "bg-gradient-to-t from-canvas/95 via-canvas/45 to-canvas/5",
};

export interface ResolvedCover {
  src?: string;
  alt: string;
  position: string;
  overlayClass: string;
  previewVideo?: string;
  scene: SceneId;
  sceneLabel: string;
}

function thumbPath(slug: string): string | undefined {
  return AVAILABLE_THUMBS.has(slug) ? `/thumbnails/${slug}.jpg` : undefined;
}

function previewPath(slug: string): string | undefined {
  return AVAILABLE_PREVIEWS.has(slug)
    ? `/thumbnails/${slug}-preview.mp4`
    : undefined;
}

function categoryName(slug: CategorySlug): string {
  return CATEGORY_MAP[slug]?.name ?? "Módulo";
}

/** Result-oriented alt text — never the file name. */
export function moduleAlt(name: string, category: CategorySlug): string {
  return `${name} — exemplo de resultado (${categoryName(category).toLowerCase()})`;
}

export function moduleCover(m: ModuleSummary): ResolvedCover {
  // Card titles sit below the image, not on top of it — badges carry their own
  // backdrop — so a real photo only gets an overlay when a module opts in.
  const overlay: CoverOverlay = m.thumbnailOverlay ?? "none";
  return {
    src: m.thumbnail ?? thumbPath(m.slug),
    alt: m.thumbnailAlt ?? moduleAlt(m.name, m.category),
    position: m.thumbnailPosition ?? "center",
    overlayClass: OVERLAY_CLASS[overlay],
    previewVideo: m.previewVideo ?? previewPath(m.slug),
    scene: m.category,
    sceneLabel: categoryName(m.category),
  };
}

export function categoryCover(c: CategoryDefinition): ResolvedCover {
  const overlay: CoverOverlay = c.thumbnailOverlay ?? "strong";
  return {
    src: c.thumbnail ?? thumbPath(`categoria-${c.slug}`),
    alt: c.thumbnailAlt ?? `${c.name} — ${c.tagline.toLowerCase()}`,
    position: c.thumbnailPosition ?? "center",
    overlayClass: OVERLAY_CLASS[overlay],
    scene: c.slug,
    sceneLabel: c.name,
  };
}

/** For history entries (stored with just slug/name/category). */
export function coverFromRef(ref: {
  slug: string;
  name: string;
  category: string;
}): ResolvedCover {
  const cat = (CATEGORY_MAP[ref.category] ? ref.category : "outros") as CategorySlug;
  return {
    src: thumbPath(ref.slug),
    alt: moduleAlt(ref.name, cat),
    position: "center",
    overlayClass: "",
    scene: cat,
    sceneLabel: categoryName(cat),
  };
}

export function trainingCover(t: Training): ResolvedCover {
  const scene: SceneId = t.scene ?? "outros";
  return {
    src: t.thumbnail ?? thumbPath(`treinamento-${t.slug}`),
    alt: t.thumbnailAlt ?? `${t.title} — treinamento`,
    position: t.thumbnailPosition ?? "center",
    // title sits below the card / the player uses a self-backed play button
    overlayClass: OVERLAY_CLASS.none,
    scene,
    sceneLabel: "Treinamento",
  };
}

/** Standard aspect ratios — keep the grid honest. */
export const RATIO = {
  wide: "16 / 9",
  cinematic: "3 / 2",
  hero: "16 / 9",
} as const;
export type RatioName = keyof typeof RATIO;
