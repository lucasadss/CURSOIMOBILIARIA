import type { FieldConfig, ModuleDefinition, TargetTool } from "@/types";

export interface RuleContext {
  module: ModuleDefinition;
  resolved: Record<string, string>;
  fields: FieldConfig[];
  kind: "image" | "video";
  imageCount: number;
}

function hasField(ctx: RuleContext, key: string): boolean {
  return ctx.fields.some((f) => f.key === key);
}

/* ============================================================================
   Structured data per pipeline stage. Both plain_text and structured_json
   read from these — one source of truth, so the two formats never disagree
   about what the module is actually saying.
   ========================================================================== */

export function sourceImages(ctx: RuleContext): Record<string, string> | undefined {
  if (ctx.module.requiredImages.length === 0) return undefined;
  const out: Record<string, string> = {};
  ctx.module.requiredImages.forEach((slot, i) => {
    out[slot.key] =
      `${slot.label} — ${i < ctx.imageCount ? "fornecida" : "pendente"}`;
  });
  return out;
}

export function cameraInfo(ctx: RuleContext): Record<string, string> | undefined {
  // A locked camera overrides any movement-implying field — defensive
  // correctness so a module can never claim both "locked" and "push-in".
  const locked = ctx.kind === "video" && Boolean(ctx.module.fidelity?.lockedCamera);
  const angle =
    ctx.resolved.cameraAngle ?? ctx.resolved.angle ?? ctx.resolved.altitude;
  const explicitMovement =
    ctx.resolved.cameraMovement ??
    ctx.resolved.orbit ??
    ctx.resolved.trajectory;
  if (!angle && !explicitMovement && !locked) return undefined;

  const out: Record<string, string> = {};
  if (angle) out.angle = angle;
  if (locked) {
    out.movement = "nenhum — travada, sem pan, zoom ou reenquadramento";
  } else if (ctx.kind === "video") {
    out.movement = explicitMovement ?? "sutil e contínuo, sem cortes";
  } else {
    out.movement = "estático";
  }
  return out;
}

export function animationInfo(ctx: RuleContext): Record<string, string> | undefined {
  if (ctx.kind !== "video") return undefined;
  const speed =
    ctx.resolved.speed ?? ctx.resolved.animationSpeed ?? ctx.resolved.pushInSpeed;
  const style = ctx.resolved.transitionStyle ?? ctx.resolved.glowStyle;
  if (!speed && !style) return undefined;
  const out: Record<string, string> = {};
  if (speed) out.speed = speed;
  if (style) out.style = style;
  return out;
}

export function temporalConsistency(ctx: RuleContext): string[] | undefined {
  if (ctx.kind !== "video") return undefined;
  const lines = [
    "manter geometria, materiais e proporções idênticos em todos os frames",
    "sem morphing, flicker ou deriva de textura entre quadros",
  ];
  if (ctx.module.requiredImages.length >= 2) {
    lines.push(
      "interpolar de forma contínua entre as imagens de referência fornecidas, sem saltos abruptos",
    );
  }
  return lines;
}

export function audioInfo(ctx: RuleContext): Record<string, string> | undefined {
  if (ctx.kind !== "video") return undefined;
  if (!hasField(ctx, "music") && !hasField(ctx, "soundEffects")) return undefined;
  const out: Record<string, string> = {};
  out.music = ctx.resolved.music ?? "nenhuma";
  out.sfx = ctx.resolved.soundEffects ?? "nenhum";
  return out;
}

/* ============================================================================
   Plain-text formatters — one sentence per stage, reading the same data the
   JSON builder uses. Returns undefined when the stage has nothing to say.
   ========================================================================== */

export function formatSourceImagesLine(
  images: Record<string, string> | undefined,
): string | undefined {
  if (!images) return undefined;
  return `Imagens de referência, nesta ordem — ${Object.values(images).join("; ")}.`;
}

export function formatCameraLine(
  camera: Record<string, string> | undefined,
): string | undefined {
  if (!camera) return undefined;
  const bits: string[] = [];
  if (camera.angle) bits.push(`ângulo ${camera.angle}`);
  if (camera.movement) bits.push(`movimento de câmera ${camera.movement}`);
  return bits.length ? `Câmera: ${bits.join(", ")}.` : undefined;
}

export function formatAnimationLine(
  animation: Record<string, string> | undefined,
): string | undefined {
  if (!animation) return undefined;
  const bits: string[] = [];
  if (animation.speed) bits.push(`ritmo ${animation.speed}`);
  if (animation.style) bits.push(`estilo ${animation.style}`);
  return bits.length ? `Animação: ${bits.join(", ")}.` : undefined;
}

export function formatTemporalLine(lines: string[] | undefined): string | undefined {
  if (!lines?.length) return undefined;
  return `Consistência temporal: ${lines.join("; ")}.`;
}

export function formatAudioLine(
  audio: Record<string, string> | undefined,
): string | undefined {
  if (!audio) return undefined;
  return `Áudio: trilha ${audio.music}; efeitos ${audio.sfx}.`;
}

/**
 * Standardized extraDetails handling (section 8) — no line at all when
 * empty, never spliced into the middle of a technical rule when filled.
 */
export function formatAdditionalDirectionLine(
  extraDetails: string | undefined,
): string | undefined {
  if (!extraDetails) return undefined;
  return `Direção adicional do usuário: ${extraDetails}.`;
}

/* ============================================================================
   Tool-structural adjustments (section 13 of the brief) — small, honest
   differences in how the SAME content is organized per destination tool.
   No invented proprietary syntax, just structure and emphasis.
   ========================================================================== */

/** Midjourney reads better as one dense line than stacked paragraphs. */
export function toolJoiner(tool: TargetTool): string {
  return tool === "midjourney" ? " — " : "\n\n";
}

/** One closing line naming what this tool specifically needs to hear. */
export function toolClosingNote(
  tool: TargetTool,
  kind: "image" | "video",
  module: ModuleDefinition,
): string | undefined {
  if (kind === "video" && (tool === "runway" || tool === "pika" || tool === "sora")) {
    // A locked-camera module must never receive a movement-continuity note —
    // that would directly contradict "câmera travada" (section 15 conflicts).
    if (module.fidelity?.lockedCamera) {
      return "Câmera travada do início ao fim do clipe — nenhum movimento de câmera; o dinamismo vem apenas do elemento descrito na cena.";
    }
    return "Um único movimento de câmera contínuo por plano; sem cortes e sem alterar a geometria entre frames.";
  }
  if (tool === "google-flow") {
    return "Priorizar fielmente as imagens de referência anexadas sobre qualquer ambiguidade do texto.";
  }
  return undefined;
}
