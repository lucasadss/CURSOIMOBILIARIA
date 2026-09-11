import type { FidelityRules } from "@/types";

const FIDELITY_COPY: Record<keyof FidelityRules, string> = {
  preserveStructure:
    "preserve the existing architectural structure (walls, openings, slab)",
  preserveGeometry: "preserve the property's geometry and proportions",
  preserveObjectPlacement:
    "keep the position of doors, windows and fixed elements",
  preserveCamera:
    "preserve the reference image's camera characteristics — same axis, same lens, same architectural reading",
  lockedCamera:
    "camera 100% locked — no movement, pan, zoom or reframing",
  preserveLighting:
    "keep the original scene's light direction and color temperature",
  noInventedElements:
    "do not add rooms, floors, furniture or elements that don't exist in the reference",
  noPropertyChanges:
    "do not alter the lot, its area or its boundaries",
  noPerspectiveChanges: "do not alter the perspective or the horizon",
};

export function fidelityLines(rules?: FidelityRules): string[] {
  if (!rules) return [];
  return (Object.keys(rules) as (keyof FidelityRules)[])
    .filter((k) => rules[k])
    .map((k) => FIDELITY_COPY[k]);
}

export function fidelityLock(rules?: FidelityRules): Record<string, boolean> {
  if (!rules) return {};
  const out: Record<string, boolean> = {};
  for (const k of Object.keys(rules) as (keyof FidelityRules)[]) {
    if (rules[k]) out[k] = true;
  }
  return out;
}
