import type { FieldConfig, ImageSlot } from "@/types";

/**
 * Reusable field fragments so module definitions stay short and consistent.
 * Every option that benefits from it carries a `promptValue` — the technical
 * phrase sent to the model. The user only ever sees `label`.
 */

export const extraDetails: FieldConfig = {
  key: "extraDetails",
  type: "textarea",
  label: "Detalhes extras",
  placeholder:
    "Ex.: manter o piso de madeira original, adicionar plantas discretas, luz de fim de tarde…",
  description: "Opcional. Vale ouro para orientar a IA sem engessar o resultado.",
  fullWidth: true,
};

export const qualityField: FieldConfig = {
  key: "quality",
  type: "segmented-control",
  label: "Qualidade",
  defaultValue: "alta",
  options: [
    { value: "padrao", label: "Padrão", promptValue: "standard photographic quality" },
    { value: "alta", label: "Alta", promptValue: "high fidelity, sharp detail" },
    { value: "ultra", label: "Ultra", promptValue: "ultra-high fidelity, tack-sharp micro-detail, no compression artifacts" },
  ],
};

export const cameraAngle: FieldConfig = {
  key: "cameraAngle",
  type: "select",
  label: "Ângulo da câmera",
  placeholder: "Selecione…",
  defaultValue: "nivel-olhos",
  options: [
    { value: "nivel-olhos", label: "Nível dos olhos", promptValue: "eye-level, human-height perspective" },
    { value: "baixo", label: "Contra-plongée (de baixo)", promptValue: "low-angle contra-plongée, camera below subject height looking up" },
    { value: "alto", label: "Plongée (de cima)", promptValue: "high-angle plongée, camera above subject height looking down" },
    { value: "amplo", label: "Grande-angular do canto", promptValue: "wide-angle corner perspective, both facades visible" },
    { value: "aerea", label: "Aérea / drone", promptValue: "aerial drone perspective, nadir-adjacent" },
  ],
};

export const timeOfDay: FieldConfig = {
  key: "timeOfDay",
  type: "select",
  label: "Horário",
  defaultValue: "fim-de-tarde",
  options: [
    { value: "manha", label: "Manhã", promptValue: "soft morning daylight, cool-neutral color temperature, long shadows to the west" },
    { value: "meio-dia", label: "Meio-dia", promptValue: "overhead midday sun, high contrast, short shadows" },
    { value: "fim-de-tarde", label: "Fim de tarde (golden hour)", promptValue: "warm low-angle golden-hour sunlight, soft elongated shadows" },
    { value: "noite", label: "Noite", promptValue: "night scene, warm interior lighting glowing through openings, dark blue ambient sky" },
    { value: "azul", label: "Blue hour", promptValue: "blue hour twilight, deep saturated blue sky, warm artificial lights just turning on" },
  ],
};

export const weatherField: FieldConfig = {
  key: "weather",
  type: "select",
  label: "Clima",
  defaultValue: "limpo",
  options: [
    { value: "limpo", label: "Céu limpo", promptValue: "clear sky, no clouds, crisp visibility" },
    { value: "poucas-nuvens", label: "Poucas nuvens", promptValue: "a few scattered clouds, soft directional light" },
    { value: "nublado", label: "Nublado suave", promptValue: "soft overcast sky, diffuse even lighting, no hard shadows" },
    { value: "pos-chuva", label: "Pós-chuva, chão úmido", promptValue: "just after rain, wet reflective ground, clearing sky" },
  ],
};

export const musicField: FieldConfig = {
  key: "music",
  type: "select",
  label: "Música",
  defaultValue: "nenhuma",
  options: [
    { value: "nenhuma", label: "Sem música", promptValue: "no music" },
    { value: "ambiente", label: "Ambiente minimalista", promptValue: "minimal ambient bed, low-key, non-intrusive" },
    { value: "corporativa", label: "Corporativa leve", promptValue: "light corporate underscore, optimistic and clean" },
    { value: "cinematografica", label: "Cinematográfica", promptValue: "cinematic orchestral underscore, slow build" },
    { value: "lo-fi", label: "Lo-fi", promptValue: "warm lo-fi instrumental, relaxed tempo" },
  ],
};

export const soundEffectsField: FieldConfig = {
  key: "soundEffects",
  type: "select",
  label: "Efeitos sonoros",
  defaultValue: "sutis",
  options: [
    { value: "nenhum", label: "Nenhum", promptValue: "no sound effects" },
    { value: "sutis", label: "Sutis (ambiente)", promptValue: "subtle ambient room tone only" },
    { value: "obra", label: "Canteiro de obras", promptValue: "construction-site ambience: distant tools, machinery hum" },
    { value: "whoosh", label: "Transições (whoosh)", promptValue: "soft whoosh transitions between beats" },
  ],
};

export const speedField: FieldConfig = {
  key: "speed",
  type: "segmented-control",
  label: "Velocidade",
  defaultValue: "media",
  options: [
    { value: "lenta", label: "Lenta", promptValue: "slow, deliberate pacing" },
    { value: "media", label: "Média", promptValue: "moderate, natural pacing" },
    { value: "rapida", label: "Rápida", promptValue: "brisk, energetic pacing" },
  ],
};

export const durationField: FieldConfig = {
  key: "duration",
  type: "slider",
  label: "Duração",
  min: 4,
  max: 20,
  step: 1,
  unit: "s",
  defaultValue: 8,
};

export const stabilizationField: FieldConfig = {
  key: "stabilization",
  type: "toggle",
  label: "Estabilização",
  description: "Movimento suave tipo gimbal, sem tremor de mão.",
  defaultValue: true,
  booleanText: {
    on: "smooth gimbal-stabilized camera motion, no handheld shake",
    off: "no stabilization constraint — natural handheld motion is acceptable",
  },
};

export const crewField: FieldConfig = {
  key: "crew",
  type: "toggle",
  label: "Trabalhadores e maquinário",
  description: "Silhuetas em movimento acelerado no canteiro.",
  defaultValue: true,
  booleanText: {
    on: "show realistic workers and construction machinery progressing naturally through the scene",
    off: "do not introduce workers or construction machinery",
  },
};

export const styleOptions = [
  { value: "contemporaneo", label: "Contemporâneo", promptValue: "contemporary architectural style, clean lines" },
  { value: "escandinavo", label: "Escandinavo", promptValue: "Scandinavian style, light wood, muted neutrals, minimal ornament" },
  { value: "industrial", label: "Industrial", promptValue: "industrial style, exposed materials, metal and concrete accents" },
  { value: "organico", label: "Orgânico / natural", promptValue: "organic-modern style, natural materials, curved forms, earthy palette" },
  { value: "classico", label: "Clássico atualizado", promptValue: "updated classic style, traditional proportions with contemporary finishes" },
  { value: "minimalista", label: "Minimalista", promptValue: "minimalist style, restrained palette, negative space" },
];

export const desiredStyle: FieldConfig = {
  key: "desiredStyle",
  type: "select",
  label: "Estilo desejado",
  defaultValue: "contemporaneo",
  options: styleOptions,
};

export const transformLevel: FieldConfig = {
  key: "transformLevel",
  type: "slider",
  label: "Nível de transformação",
  min: 1,
  max: 5,
  step: 1,
  defaultValue: 3,
  unit: "/5",
  description: "1 = retoque leve · 5 = reforma completa",
};

export const oneReferenceImage: ImageSlot[] = [
  {
    key: "reference",
    label: "Imagem de referência",
    hint: "Foto real do imóvel, cômodo ou terreno.",
  },
];

export const AMBER_SWATCHES = [
  "#c9662e",
  "#e0a04a",
  "#f2c14e",
  "#5b8a5a",
  "#3e6c8f",
  "#ffffff",
];

export const beamColorField: FieldConfig = {
  key: "beamColor",
  type: "color",
  label: "Cor do contorno",
  defaultValue: "#c9662e",
  swatches: AMBER_SWATCHES,
};

export const glowStyleField: FieldConfig = {
  key: "glowStyle",
  type: "select",
  label: "Estilo do brilho",
  defaultValue: "neon-suave",
  options: [
    { value: "neon-suave", label: "Neon suave", promptValue: "soft neon glow, gentle bloom" },
    { value: "laser", label: "Laser fino", promptValue: "thin crisp laser-line, minimal bloom" },
    { value: "energia", label: "Energia difusa", promptValue: "diffuse energy-particle glow, slight flicker" },
  ],
};

export const lensOptions = [
  { value: "24mm", label: "24 mm — ambiente amplo", promptValue: "24mm equivalent wide-angle field of view" },
  { value: "35mm", label: "35 mm — natural", promptValue: "35mm equivalent natural field of view" },
  { value: "50mm", label: "50 mm — detalhe", promptValue: "50mm equivalent, compressed detail-focused field of view" },
];

export const lensField: FieldConfig = {
  key: "lens",
  type: "select",
  label: "Lente",
  defaultValue: "35mm",
  options: lensOptions,
};

export const paletteOptions = [
  { value: "neutros-quentes", label: "Neutros quentes", promptValue: "warm neutral palette" },
  { value: "off-white", label: "Off-white", promptValue: "off-white monochrome palette" },
  { value: "terrosos", label: "Terrosos", promptValue: "earthy terracotta and clay tones" },
  { value: "verde-profundo", label: "Verde profundo", promptValue: "deep green accent palette" },
  { value: "madeira-clara", label: "Madeira clara", promptValue: "light natural wood tones" },
  { value: "preto-grafite", label: "Preto / grafite", promptValue: "black and graphite accent tones" },
];

export const cameraMovementOptions = [
  { value: "push-in", label: "Push-in sutil", promptValue: "slow, continuous, subtle push-in" },
  { value: "orbital-leve", label: "Orbital leve", promptValue: "very subtle orbital drift" },
  { value: "estatico", label: "Estático", promptValue: "fully static, no camera movement" },
];

/** Small-scale camera motion for a single fixed setup (push-in / orbital
 *  drift / static). Distinct from `droneAltitudeField` and drone
 *  `trajectory`, which describe a large-scale flight path. */
export const cameraMovementField: FieldConfig = {
  key: "cameraMovement",
  type: "select",
  label: "Movimento de câmera",
  defaultValue: "push-in",
  options: cameraMovementOptions,
};

export const droneAltitudeOptions = [
  { value: "baixa", label: "Baixa", promptValue: "low-altitude drone height, ~20m" },
  { value: "media", label: "Média", promptValue: "medium-altitude drone height, ~60m" },
  { value: "alta", label: "Alta", promptValue: "high-altitude drone height, ~120m" },
];

export const droneAltitudeField: FieldConfig = {
  key: "altitude",
  type: "segmented-control",
  label: "Altura do drone",
  defaultValue: "media",
  options: droneAltitudeOptions,
};

export const showAreaField: FieldConfig = {
  key: "showArea",
  type: "toggle",
  label: "Mostrar metragem",
  description: "Escreve a área aproximada dentro do lote.",
  defaultValue: true,
  booleanText: {
    on: "display the approximate area written inside the lot",
    off: "do not display any area text on the scene",
  },
};
