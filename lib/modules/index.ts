import type {
  CategorySlug,
  ModuleDefinition,
  ModuleSummary,
  ModuleType,
} from "@/types";
import { FULL_MODULES } from "./definitions";
import { STUB_MODULES } from "./stubs";

export const ALL_MODULES: ModuleDefinition[] = [...FULL_MODULES, ...STUB_MODULES];

const BY_SLUG = new Map(ALL_MODULES.map((m) => [m.slug, m]));

export function getModuleBySlug(slug: string): ModuleDefinition | undefined {
  return BY_SLUG.get(slug);
}

export function moduleExists(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function toSummary(m: ModuleDefinition): ModuleSummary {
  return {
    name: m.name,
    slug: m.slug,
    description: m.description,
    category: m.category,
    type: m.type,
    thumbnail: m.thumbnail,
    thumbnailAlt: m.thumbnailAlt,
    thumbnailPosition: m.thumbnailPosition,
    thumbnailOverlay: m.thumbnailOverlay,
    previewVideo: m.previewVideo,
    accessLevel: m.accessLevel,
    featured: m.featured,
    isNew: m.isNew,
    startHere: m.startHere,
  };
}

export const MODULE_SUMMARIES: ModuleSummary[] = ALL_MODULES.map(toSummary);

export function getModulesByCategory(category: CategorySlug): ModuleSummary[] {
  return MODULE_SUMMARIES.filter((m) => m.category === category);
}

export function getModulesByType(type: ModuleType | "image" | "video"): ModuleSummary[] {
  if (type === "image") {
    return MODULE_SUMMARIES.filter(
      (m) => m.type === "image" || m.type === "image-custom",
    );
  }
  if (type === "video") {
    return MODULE_SUMMARIES.filter((m) => m.type.startsWith("video"));
  }
  return MODULE_SUMMARIES.filter((m) => m.type === type);
}

export function isVideoModule(m: Pick<ModuleDefinition, "type">): boolean {
  return m.type.startsWith("video");
}

export function moduleKindLabel(m: Pick<ModuleDefinition, "type">): string {
  return isVideoModule(m) ? "Vídeo" : "Imagem";
}

/* --- Home discovery selections ------------------------------------------- */

/**
 * Curated "most used" tools shown on the Home. Order is intentional; the Home
 * filters out anything already surfaced in "Continue de onde parou" so the
 * same module never stacks in adjacent sections.
 */
export const POPULAR_TOOL_SLUGS = [
  "decoracao-de-interiores",
  "casa-em-terreno",
  "timelapse-de-construcao",
  "metragem-do-terreno",
  "voo-de-drone",
  "apresentacao-profissional",
] as const;

export const POPULAR_TOOLS: ModuleSummary[] = POPULAR_TOOL_SLUGS.map((s) =>
  BY_SLUG.get(s),
)
  .filter(Boolean)
  .map((m) => toSummary(m as ModuleDefinition));

export { FULL_MODULES, STUB_MODULES };
