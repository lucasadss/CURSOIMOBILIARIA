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

/**
 * `detailed` (structured_json only) swaps in the slot's fuller `promptRole`
 * sentence when the module set one, instead of the terse label used in
 * plain_text — a richer per-image instruction is worth the extra length in
 * JSON but would make the plain_text sentence unwieldy.
 */
export function sourceImages(
  ctx: RuleContext,
  detailed = false,
): Record<string, string> | undefined {
  if (ctx.module.requiredImages.length === 0) return undefined;
  const out: Record<string, string> = {};
  ctx.module.requiredImages.forEach((slot, i) => {
    const provided = i < ctx.imageCount ? "provided" : "pending";
    if (detailed && slot.promptRole) {
      out[slot.key] = `${slot.promptRole} (${provided})`;
    } else {
      const label = slot.promptLabel ?? slot.label;
      out[slot.key] = `${label} — ${provided}`;
    }
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
    out.movement = "none — locked, no pan, zoom or reframing";
  } else if (ctx.kind === "video") {
    out.movement = explicitMovement ?? "subtle and continuous, no cuts";
  } else {
    out.movement = "static";
  }
  return out;
}

export function animationInfo(ctx: RuleContext): Record<string, string> | undefined {
  if (ctx.kind !== "video") return undefined;
  const speed =
    ctx.resolved.speed ??
    ctx.resolved.animationSpeed ??
    ctx.resolved.pushInSpeed ??
    ctx.resolved.peakSpeed;
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
    "keep geometry, materials and proportions identical across every frame",
    "no morphing, flicker or texture drift between frames",
  ];
  if (ctx.module.requiredImages.length >= 2) {
    lines.push(
      "interpolate smoothly between the supplied reference images, with no abrupt jumps",
    );
  }
  return lines;
}

export function audioInfo(ctx: RuleContext): Record<string, string> | undefined {
  if (ctx.kind !== "video") return undefined;
  if (!hasField(ctx, "music") && !hasField(ctx, "soundEffects")) return undefined;
  const out: Record<string, string> = {};
  out.music = ctx.resolved.music ?? "none";
  out.sfx = ctx.resolved.soundEffects ?? "none";
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
  return `Reference images, in this order — ${Object.values(images).join("; ")}.`;
}

export function formatCameraLine(
  camera: Record<string, string> | undefined,
): string | undefined {
  if (!camera) return undefined;
  // Values are already complete descriptive phrases (e.g. "none — locked, no
  // pan, zoom or reframing"), so no "angle"/"camera movement" suffix is
  // appended — that would just repeat words the phrase already ends with.
  const bits: string[] = [];
  if (camera.angle) bits.push(camera.angle);
  if (camera.movement) bits.push(camera.movement);
  return bits.length ? `Camera: ${bits.join("; ")}.` : undefined;
}

export function formatAnimationLine(
  animation: Record<string, string> | undefined,
): string | undefined {
  if (!animation) return undefined;
  // Same reasoning as formatCameraLine: speed/style values already read as
  // full phrases (often already ending in "pacing" or "style").
  const bits: string[] = [];
  if (animation.speed) bits.push(animation.speed);
  if (animation.style) bits.push(animation.style);
  return bits.length ? `Animation: ${bits.join("; ")}.` : undefined;
}

export function formatTemporalLine(lines: string[] | undefined): string | undefined {
  if (!lines?.length) return undefined;
  return `Temporal consistency: ${lines.join("; ")}.`;
}

export function formatAudioLine(
  audio: Record<string, string> | undefined,
): string | undefined {
  if (!audio) return undefined;
  // No "soundtrack"/"effects" labels: values like "no sound effects" already
  // say what they are, and prefixing "effects" would repeat that word.
  return `Audio: ${audio.music}; ${audio.sfx}.`;
}

/**
 * Standardized extraDetails handling (section 8) — no line at all when
 * empty, never spliced into the middle of a technical rule when filled.
 */
export function formatAdditionalDirectionLine(
  extraDetails: string | undefined,
): string | undefined {
  if (!extraDetails) return undefined;
  return `Additional direction from the user: ${extraDetails}.`;
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
    // that would directly contradict "locked camera" (section 15 conflicts).
    if (module.fidelity?.lockedCamera) {
      return "Camera locked from the first to the last frame of the clip — no camera movement at all; motion comes only from the element described in the scene.";
    }
    return "One single continuous camera movement per shot; no cuts and no geometry changes between frames.";
  }
  if (tool === "google-flow") {
    return "Prioritize the attached reference images faithfully over any ambiguity in the text.";
  }
  return undefined;
}
