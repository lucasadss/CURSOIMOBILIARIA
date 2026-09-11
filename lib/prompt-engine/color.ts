/**
 * Hex colors are picked with a free color-wheel input (see the "color"
 * field type), so any value is possible — not just the swatch shortcuts.
 * Video/image models read a natural-language color name far more reliably
 * than a bare hex code, so every color value going into a prompt is
 * described in words, with the hex kept alongside for precision.
 */

function hexToHsl(hex: string): { h: number; s: number; l: number } | undefined {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return undefined;
  const int = parseInt(m[1], 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;

  return { h, s, l };
}

const HUE_NAMES: [max: number, name: string][] = [
  [10, "red"],
  [25, "red-orange"],
  [40, "orange"],
  [55, "amber"],
  [70, "yellow"],
  [95, "yellow-green"],
  [140, "green"],
  [170, "teal-green"],
  [195, "teal"],
  [220, "sky blue"],
  [255, "blue"],
  [275, "indigo"],
  [295, "purple"],
  [325, "magenta"],
  [345, "pink"],
  [360, "red"],
];

function hueName(h: number): string {
  for (const [max, name] of HUE_NAMES) {
    if (h <= max) return name;
  }
  return "red";
}

/** e.g. "#c9662e" -> "burnt orange (#c9662e)" */
export function describeColor(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const { h, s, l } = hsl;

  if (s < 0.08) {
    if (l < 0.12) return `black (${hex})`;
    if (l > 0.92) return `white (${hex})`;
    return `${l < 0.4 ? "dark " : l > 0.7 ? "light " : ""}gray (${hex})`;
  }

  let name = hueName(h);
  if (l < 0.28) name = `dark ${name}`;
  else if (l > 0.85) name = `pale ${name}`;
  else if (l > 0.7) name = `light ${name}`;
  if (s < 0.35) name = `muted ${name}`;

  return `${name} (${hex})`;
}
