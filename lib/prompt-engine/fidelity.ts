import type { FidelityRules } from "@/types";

const FIDELITY_COPY: Record<keyof FidelityRules, string> = {
  preserveStructure:
    "preservar a estrutura arquitetônica existente (paredes, aberturas, laje)",
  preserveGeometry: "preservar a geometria e as proporções do imóvel",
  preserveObjectPlacement:
    "manter a posição de portas, janelas e elementos fixos",
  preserveCamera:
    "preservar as características da câmera da imagem de referência — mesmo eixo, mesma lente, mesma leitura arquitetônica",
  lockedCamera:
    "câmera 100% travada — nenhum movimento, pan, zoom ou reenquadramento",
  preserveLighting:
    "manter a direção e a temperatura de luz da cena original",
  noInventedElements:
    "não adicionar cômodos, andares, mobília ou elementos que não existem na referência",
  noPropertyChanges:
    "não alterar o terreno, a metragem ou os limites do lote",
  noPerspectiveChanges: "não alterar a perspectiva nem o horizonte",
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
