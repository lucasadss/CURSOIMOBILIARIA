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

  /** guided flow */
  steps?: StepRef[];
  nextModule?: string;
  /** this module needs the output of another one first */
  dependsOn?: string;

  supportMaterial?: SupportMaterial[];
  examples?: { label: string; body: string }[];

  /** discovery flags */
  featured?: boolean;
  isNew?: boolean;
  startHere?: boolean;
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
