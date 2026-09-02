import type {
  FieldConfig,
  ModuleDefinition,
  PromptEngineInput,
  PromptResult,
  StructuredPrompt,
  TargetTool,
} from "@/types";
import { fidelityLines, fidelityLock } from "./fidelity";
import { getToolProfile } from "./tools";
import { interpolate, resolveValues } from "./template";
import {
  animationInfo,
  audioInfo,
  cameraInfo,
  formatAdditionalDirectionLine,
  formatAnimationLine,
  formatAudioLine,
  formatCameraLine,
  formatSourceImagesLine,
  formatTemporalLine,
  sourceImages,
  temporalConsistency,
  toolClosingNote,
  toolJoiner,
  type RuleContext,
} from "./rules";

export { TOOL_PROFILES, TOOL_ORDER, getToolProfile } from "./tools";
export { resolveValues } from "./template";

function allFields(module: ModuleDefinition): FieldConfig[] {
  return [...module.beginnerFields, ...module.advancedFields];
}

function moduleKind(module: ModuleDefinition): "image" | "video" {
  return module.type === "image" || module.type === "image-custom"
    ? "image"
    : "video";
}

function defaultAspect(tool: TargetTool, kind: "image" | "video"): string {
  const profile = getToolProfile(tool);
  return profile.aspectRatios[0] ?? (kind === "image" ? "3:2" : "16:9");
}

/**
 * The engine pipeline (per module):
 *
 *   input do usuário → normalização (resolveValues, com promptValue técnico)
 *   → template técnico → source image rules → camera rules → animation rules
 *   → fidelity rules → temporal consistency → audio → hard negatives
 *   → tool override → output (plain_text | structured_json)
 */
export function buildPrompt(input: PromptEngineInput): PromptResult {
  const { module, values, tool, format, imageCount } = input;
  const kind = moduleKind(module);
  const fields = allFields(module);
  const resolved = resolveValues(fields, values);
  const profile = getToolProfile(tool);

  const template = module.toolOverrides?.[tool] ?? module.promptTemplate;
  const body = interpolate(template, resolved);

  const ctx: RuleContext = { module, resolved, fields, kind, imageCount };
  const images = sourceImages(ctx);
  const camera = cameraInfo(ctx);
  const animation = animationInfo(ctx);
  const temporal = temporalConsistency(ctx);
  const audio = audioInfo(ctx);
  const fidelity = fidelityLines(module.fidelity);
  const negatives = module.hardNegatives ?? [];
  const rules = module.systemRules ?? [];

  if (format === "structured_json") {
    const structured = buildStructured({
      module,
      body,
      resolved,
      kind,
      tool,
      images,
      camera,
      animation,
      temporal,
      audio,
      negatives,
      rules,
    });
    return {
      format,
      tool,
      kind,
      structured,
      text: JSON.stringify(structured, null, 2),
    };
  }

  // Order follows the brief's readable-block structure (section 12): Objective,
  // Source references, Camera, Transformation/animation, Fidelity, Audio,
  // Restrictions (rules + hard negatives), Additional direction.
  const parts: string[] = [
    body,
    formatSourceImagesLine(images),
    formatCameraLine(camera),
    formatAnimationLine(animation),
    formatTemporalLine(temporal),
    fidelity.length ? `Fidelidade à referência: ${fidelity.join("; ")}.` : undefined,
    formatAudioLine(audio),
    rules.length ? `Regras: ${rules.join("; ")}.` : undefined,
    negatives.length ? `Evitar: ${negatives.join(", ")}.` : undefined,
    formatAdditionalDirectionLine(resolved.extraDetails),
    toolClosingNote(tool, kind, module),
    `Formato ${defaultAspect(tool, kind)}${profile.suffix ? `. ${profile.suffix}` : ""}`,
  ].filter((p): p is string => Boolean(p));

  return {
    format,
    tool,
    kind,
    text: parts.join(toolJoiner(tool)),
  };
}

function buildStructured(args: {
  module: ModuleDefinition;
  body: string;
  resolved: Record<string, string>;
  kind: "image" | "video";
  tool: TargetTool;
  images?: Record<string, string>;
  camera?: Record<string, string>;
  animation?: Record<string, string>;
  temporal?: string[];
  audio?: Record<string, string>;
  negatives: string[];
  rules: string[];
}): StructuredPrompt {
  const {
    module,
    body,
    resolved,
    kind,
    tool,
    images,
    camera,
    animation,
    temporal,
    audio,
    negatives,
    rules,
  } = args;

  const sceneFidelity = fidelityLock(module.fidelity);
  const hardNegatives = [
    ...negatives,
    ...rules.filter((r) => /^(não|nunca|sem)\b/i.test(r)),
  ];

  const parameters: StructuredPrompt["parameters"] = {
    role:
      kind === "video"
        ? "Diretor de fotografia para vídeo imobiliário fotorrealista"
        : "Artista de visualização arquitetônica fotorrealista",
    instruction_priority:
      "As imagens de referência têm prioridade sobre o texto em qualquer conflito.",
  };
  if (images) parameters.source_images = images;
  if (Object.keys(sceneFidelity).length) parameters.scene_fidelity = sceneFidelity;
  if (camera) parameters.camera = camera;
  if (animation) parameters.animation = animation;
  if (temporal?.length) parameters.temporal_consistency = temporal;
  if (audio) parameters.audio = audio;
  if (hardNegatives.length) parameters.hard_negatives = hardNegatives;

  return {
    prompt_summary: body,
    parameters,
    additional_details: [resolved.extraDetails, getToolProfile(tool).suffix]
      .filter(Boolean)
      .join(" "),
  };
}
