import type { FieldConfig } from "./field";
import type { FidelityRules, PromptFormat, TargetTool } from "./prompt";

export type ModuleType =
  | "image"
  | "image-custom"
  | "video-single-image"
  | "video-two-images"
  | "video-multi-image"
  | "instruction-only"
  | "stepped";

export type AccessLevel = "free" | "pro" | "premium";

/** Lightweight camera-motion classification, used only to power the
 *  declarative conflict validator (lib/modules/validate.ts). */
export type CameraMode = "locked" | "static" | "controlled-motion" | "free-motion";

export type CategorySlug =
  | "terrenos"
  | "construcao"
  | "interiores"
  | "imovel-pronto"
  | "cinematograficos"
  | "redes-sociais"
  | "outros";

export interface ImageSlot {
  key: string;
  label: string;
  hint?: string;
  /** English phrase sent to the model instead of `label`, for prompt accuracy. */
  promptLabel?: string;
  /**
   * Fuller sentence describing what this image *means* and what rule it
   * locks in (e.g. "Starting state. Camera angle locked to this frame.").
   * Used only in structured_json's source_images, where the extra length
   * earns its keep; falls back to promptLabel/label. Keep plain_text's
   * source-images line terse — it stays on promptLabel.
   */
  promptRole?: string;
}

export interface StepRef {
  label: string;
  moduleSlug?: string;
  done?: boolean;
}

export interface SupportMaterial {
  kind: "guide" | "video" | "pdf" | "walkthrough" | "example";
  label: string;
  href?: string;
  body?: string;
}

export interface ToolGuideConfig {
  tool: TargetTool;
  /** breadcrumb-style path inside the tool, e.g. ["Vídeo", "Elementos", "Omni Flash"] */
  path: string[];
  steps: string[];
  walkthroughHref?: string;
}

/** Darkening applied on top of a real photo so titles/badges stay legible. */
export type CoverOverlay = "none" | "soft" | "strong";

/** Cover image config. `thumbnail` is a real photo path/URL; when absent the
 *  UI renders the category scene fallback (see lib/assets). */
export interface CoverConfig {
  /** e.g. "/thumbnails/casa-em-terreno.jpg" or an https:// CDN url */
  thumbnail?: string;
  /** describes the *result*, not the file — used as <img alt> */
  thumbnailAlt?: string;
  /** CSS object-position, e.g. "center", "50% 30%", "left bottom" */
  thumbnailPosition?: string;
  thumbnailOverlay?: CoverOverlay;
  /** optional muted loop shown on hover once assets exist */
  previewVideo?: string;
}

export interface ModuleDefinition {
  name: string;
  slug: string;
  description: string;
  /** one longer paragraph shown on the module screen */
  longDescription?: string;
  category: CategorySlug;
  type: ModuleType;
  accessLevel: AccessLevel;

  /** real cover photo + treatment; falls back to the category scene */
  thumbnail?: string;
  thumbnailAlt?: string;
  thumbnailPosition?: string;
  thumbnailOverlay?: CoverOverlay;
  previewVideo?: string;

  /** required reference images; [] means none */
  requiredImages: ImageSlot[];
  /** how many are strictly required to enable "Gerar Prompt" */
  minImages?: number;

  /** how the camera behaves in this module — only used to validate that
   *  fidelity/hardNegatives/systemRules don't contradict it (see validate.ts) */
  cameraMode?: CameraMode;

  recommendedTool: TargetTool;
  /** tools offered in the selector; defaults to a sane set per type */
  availableTools?: TargetTool[];
  defaultFormat?: PromptFormat;
  allowStructuredJson?: boolean;

  /** contextual "what to do" copy — short, not a giant banner */
  instructions?: string[];
  toolGuide?: ToolGuideConfig;

  beginnerFields: FieldConfig[];
  advancedFields: FieldConfig[];

  /** mustache-ish template; {{key}} resolves from field values */
  promptTemplate: string;
  systemRules?: string[];
  hardNegatives?: string[];
  fidelity?: FidelityRules;
  /** per-tool template overrides */
  toolOverrides?: Partial<Record<TargetTool, string>>;

  /**
   * Overrides parameters.role in structured_json. Falls back to a generic
   * "cinematographer"/"visualization artist" line by kind when absent. Worth
   * setting for tasks the model could easily misread as "regenerate the
   * scene" instead of what they actually are — e.g. a compositing/overlay
   * reveal, or a specific professional role like "drone pilot".
   */
  promptRole?: string;
  /**
   * Extra top-level keys merged into the structured_json output verbatim,
   * for a module whose task benefits from bespoke structure a generic
   * schema can't express well (e.g. an explicit construction phase list, a
   * drawing order, a glow spec). Sparingly used — most modules don't need
   * this; the shared parameters.* shape already covers them.
   */
  structuredExtras?: Record<string, unknown>;

  /** guided flow */
  steps?: StepRef[];
  nextModule?: string;
  /** this module needs the output of another one first */
  dependsOn?: string;
  /**
   * Slug of this module's image/video counterpart for the exact same
   * subject (e.g. "Casa em Terreno" <-> "Casa em Terreno (Vídeo)"). Must be
   * set on both sides. When present, the module workspace shows an
   * Imagem/Vídeo switch that swaps the whole form in place instead of
   * requiring a separate page visit.
   */
  pairedModule?: string;

  supportMaterial?: SupportMaterial[];
  examples?: { label: string; body: string }[];

  /** discovery flags */
  featured?: boolean;
  isNew?: boolean;
  startHere?: boolean;
  /**
   * Excluded from catalog listings (category grids, Explorar, search) while
   * still fully reachable by direct link, dependsOn/nextModule chains and
   * favorites. Use for modules that don't have a real cover photo yet.
   */
  hidden?: boolean;
}

export interface ModuleSummary
  extends Pick<
    ModuleDefinition,
    | "name"
    | "slug"
    | "description"
    | "category"
    | "type"
    | "thumbnail"
    | "thumbnailAlt"
    | "thumbnailPosition"
    | "thumbnailOverlay"
    | "previewVideo"
    | "accessLevel"
    | "featured"
    | "isNew"
    | "startHere"
  > {}
