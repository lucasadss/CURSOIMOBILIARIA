import type { FieldValues } from "./field";
import type { ModuleDefinition } from "./module";

export type PromptFormat = "plain_text" | "structured_json";

export type TargetTool = "google-flow" | "midjourney" | "runway" | "pika" | "sora";

export interface ToolProfile {
  id: TargetTool;
  label: string;
  /** what kind of output the tool consumes */
  kind: "image" | "video" | "both";
  /** aspect ratios offered for this tool */
  aspectRatios: string[];
  /** appended verbatim to a plain-text prompt */
  suffix?: string;
  /** short "how it expects the prompt" note shown in the UI */
  note?: string;
}

/** Fidelity rules a module can switch on when it uses reference images. */
export interface FidelityRules {
  preserveStructure?: boolean;
  preserveGeometry?: boolean;
  preserveObjectPlacement?: boolean;
  preserveCamera?: boolean;
  /**
   * Hard lock — zero camera movement at all (no pan/zoom/reframe/push-in).
   * Distinct from `preserveCamera`, which only preserves axis/lens/viewpoint
   * characteristics while movement can still happen (e.g. a push-in).
   */
  lockedCamera?: boolean;
  preserveLighting?: boolean;
  noInventedElements?: boolean;
  noPropertyChanges?: boolean;
  noPerspectiveChanges?: boolean;
}

export interface PromptEngineInput {
  module: ModuleDefinition;
  values: FieldValues;
  tool: TargetTool;
  format: PromptFormat;
  imageCount: number;
}

/**
 * Only `role` and `instruction_priority` are always present — every other key
 * is included only when the module actually has something to say there, so
 * the JSON never ships empty objects/arrays (see prompt-engine/rules.ts).
 */
export interface StructuredPrompt {
  prompt_summary: string;
  parameters: {
    role: string;
    instruction_priority: string;
    source_images?: Record<string, string>;
    scene_fidelity?: Record<string, boolean>;
    camera?: Record<string, string>;
    animation?: Record<string, string>;
    temporal_consistency?: string[];
    audio?: Record<string, string>;
    hard_negatives?: string[];
  };
  additional_details: string;
}

export interface PromptResult {
  format: PromptFormat;
  tool: TargetTool;
  /** "image" | "video" — resolved from module type */
  kind: "image" | "video";
  text: string;
  /** present only when format === "structured_json" */
  structured?: StructuredPrompt;
}
