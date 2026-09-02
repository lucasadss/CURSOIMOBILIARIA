import type { FieldConfig, FieldValues } from "@/types";

/** label the user picked ← → technical phrase the model receives. */
function promptText(field: FieldConfig | undefined, value: string): string {
  const opt = field?.options?.find((o) => o.value === value);
  return opt?.promptValue ?? opt?.label ?? value;
}

/**
 * Resolve raw field values into the strings that go into the prompt. Options
 * with a `promptValue` send that technical phrase instead of the friendly
 * label the user saw. Multiselect becomes a comma list. Toggles become
 * sim/não.
 */
export function resolveValues(
  fields: FieldConfig[],
  values: FieldValues,
): Record<string, string> {
  const byKey = new Map(fields.map((f) => [f.key, f]));
  const out: Record<string, string> = {};

  for (const [key, raw] of Object.entries(values)) {
    const field = byKey.get(key);
    if (raw === undefined || raw === null || raw === "") continue;

    if (Array.isArray(raw)) {
      const labels = raw.map((v) => promptText(field, v));
      out[key] = formatList(labels);
      continue;
    }

    if (typeof raw === "boolean") {
      const bt = field?.booleanText;
      out[key] = bt ? (raw ? bt.on : bt.off) : raw ? "sim" : "não";
      continue;
    }

    if (typeof raw === "number") {
      out[key] = field?.unit ? `${raw}${field.unit}` : String(raw);
      continue;
    }

    out[key] = promptText(field, raw);
  }

  return out;
}

export function formatList(items: string[]): string {
  const clean = items.filter(Boolean);
  if (clean.length <= 1) return clean.join("");
  if (clean.length === 2) return `${clean[0]} e ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} e ${clean[clean.length - 1]}`;
}

/**
 * Interpolate a template.
 *   {{key}}            → value or "" (and the surrounding sentence is dropped
 *                        if it becomes empty — see cleanup below)
 *   {{key|fallback}}   → value or fallback
 */
export function interpolate(
  template: string,
  resolved: Record<string, string>,
): string {
  let text = template.replace(
    /\{\{\s*([\w.]+)\s*(?:\|\s*([^}]*?)\s*)?\}\}/g,
    (_m, key: string, fallback?: string) => {
      const v = resolved[key];
      if (v !== undefined && v !== "") return v;
      return fallback ?? "␀";
    },
  );

  // Drop clauses that reference a missing value (marked ␀).
  text = text
    .split("\n")
    .map((line) =>
      line
        .split(/(?<=\.)\s+/)
        .filter((sentence) => !sentence.includes("␀"))
        .join(" "),
    )
    .join("\n")
    .replace(/␀/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.;])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}
