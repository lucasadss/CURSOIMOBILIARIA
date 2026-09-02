import type { TargetTool, ToolProfile } from "@/types";

export const TOOL_PROFILES: Record<TargetTool, ToolProfile> = {
  "google-flow": {
    id: "google-flow",
    label: "Google Flow",
    kind: "both",
    aspectRatios: ["16:9", "9:16", "1:1"],
    note: "Descreva a cena em prosa contínua. Anexe as imagens de referência na ordem indicada.",
    suffix: "Cinematic realism, natural lighting, coherent motion.",
  },
  midjourney: {
    id: "midjourney",
    label: "Midjourney",
    kind: "image",
    aspectRatios: ["16:9", "3:2", "1:1", "9:16"],
    note: "Frase curta e densa em substantivos. Parâmetros no fim da linha.",
    suffix: "--style raw --v 6",
  },
  runway: {
    id: "runway",
    label: "Runway",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    note: "Um movimento de câmera por prompt. Seja explícito sobre o que NÃO deve mudar.",
    suffix: "Subtle, physically plausible camera move. No morphing.",
  },
  pika: {
    id: "pika",
    label: "Pika",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    note: "Prompt curto. Use a imagem como primeiro frame.",
    suffix: "Smooth motion, consistent geometry.",
  },
  sora: {
    id: "sora",
    label: "Sora",
    kind: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    note: "Parágrafo único descrevendo cena, luz e câmera. Sem listas.",
    suffix: "Photoreal, stable structure, no invented elements.",
  },
};

export function getToolProfile(tool: TargetTool): ToolProfile {
  return TOOL_PROFILES[tool];
}

export const TOOL_ORDER: TargetTool[] = [
  "google-flow",
  "midjourney",
  "runway",
  "pika",
  "sora",
];
