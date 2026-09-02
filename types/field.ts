/**
 * Dynamic field configuration consumed by <ModuleFieldRenderer />.
 * A module declares its form as a flat list of these.
 */

export type FieldType =
  | "select"
  | "multiselect"
  | "textarea"
  | "input"
  | "number"
  | "color"
  | "toggle"
  | "slider"
  | "tabs"
  | "segmented-control"
  | "image-upload"
  | "multi-image-upload"
  | "info"
  | "helper-text";

export interface FieldOption {
  value: string;
  label: string;
  /** short line shown under the label in rich pickers */
  hint?: string;
  /**
   * Technical phrase sent to the prompt engine instead of `label` when set.
   * The user always sees `label` — the model gets the richer description.
   * e.g. label "Golden hour" → promptValue "warm low-angle golden-hour
   * sunlight with soft elongated shadows".
   */
  promptValue?: string;
}

export interface FieldConfig {
  key: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  /** small grey line under the control */
  description?: string;
  /** tooltip content on the label */
  tooltip?: string;
  required?: boolean;
  /** default value — string, string[], number or boolean depending on type */
  defaultValue?: string | string[] | number | boolean;
  options?: FieldOption[];

  /* number / slider */
  min?: number;
  max?: number;
  step?: number;
  /** unit suffix rendered next to slider value, e.g. "s", "%" */
  unit?: string;

  /**
   * toggle only — natural-language phrasing per state, e.g.
   * { on: "include subtle background music", off: "no background music" }.
   * Falls back to sim/não when omitted (fine for plain on/off switches).
   */
  booleanText?: { on: string; off: string };

  /* color */
  swatches?: string[];

  /* layout */
  /** render this field across both grid columns */
  fullWidth?: boolean;

  /* info / helper-text only */
  content?: string;
  tone?: "neutral" | "brand" | "warning";
}

/** A resolved form value map. */
export type FieldValues = Record<
  string,
  string | string[] | number | boolean | undefined
>;
