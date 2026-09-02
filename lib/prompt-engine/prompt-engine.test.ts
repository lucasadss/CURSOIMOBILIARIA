import { describe, expect, it } from "vitest";
import { buildPrompt } from "./index";
import { getModuleBySlug } from "@/lib/modules";
import type { FieldValues, ModuleDefinition } from "@/types";

function mod(slug: string): ModuleDefinition {
  const m = getModuleBySlug(slug);
  if (!m) throw new Error(`fixture module not found: ${slug}`);
  return m;
}

function noLeftoverTokens(text: string) {
  expect(text).not.toContain("␀");
  expect(text).not.toContain("{{");
  expect(text).not.toMatch(/\bundefined\b/i);
}

describe("Decoração de Interiores", () => {
  const module = mod("decoracao-de-interiores");
  const values: FieldValues = { roomType: "sala", style: "escandinavo" };

  it("sends the technical promptValue, not the friendly label, to the model", () => {
    const res = buildPrompt({ module, values, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(res.text).toContain("living room");
    expect(res.text).toContain("Scandinavian");
  });

  it("drops clauses for empty fields without leaving placeholders", () => {
    const res = buildPrompt({ module, values: {}, tool: "google-flow", format: "plain_text", imageCount: 0 });
    noLeftoverTokens(res.text);
  });

  it("includes every declared hard negative", () => {
    const res = buildPrompt({ module, values, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(res.text).toMatch(/Evitar:/);
    for (const negative of module.hardNegatives ?? []) {
      expect(res.text).toContain(negative);
    }
  });

  it("produces valid, non-empty structured JSON", () => {
    const res = buildPrompt({ module, values, tool: "google-flow", format: "structured_json", imageCount: 1 });
    const parsed = JSON.parse(res.text);
    expect(parsed.prompt_summary.length).toBeGreaterThan(0);
    expect(parsed.parameters.hard_negatives.length).toBeGreaterThan(0);
    // image module: no animation/temporal_consistency — nothing empty shipped
    expect(parsed.parameters.animation).toBeUndefined();
    expect(parsed.parameters.temporal_consistency).toBeUndefined();
  });
});

describe("Casa em Terreno", () => {
  const module = mod("casa-em-terreno");
  const values: FieldValues = { houseType: "sobrado", floors: "2", facade: "concreto-vidro" };

  it("sends the technical promptValue, not the friendly label, to the model", () => {
    const res = buildPrompt({ module, values, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(res.text).toContain("two-story house");
    expect(res.text).toContain("exposed concrete and glass facade");
  });

  it("names the single reference image slot in the source-image line", () => {
    const res = buildPrompt({ module, values, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(res.text).toContain("Foto do terreno");
  });

  it("resolves its guided-flow dependency and next step to real modules", () => {
    expect(module.dependsOn).toBeUndefined(); // it's the entry point of its chain
    expect(module.nextModule).toBe("casa-em-terreno-video");
    expect(getModuleBySlug(module.nextModule!)).toBeDefined();
  });
});

describe("Metragem Animada", () => {
  const module = mod("metragem-animada");

  it("defaults to structured_json as the brief requires", () => {
    expect(module.defaultFormat).toBe("structured_json");
  });

  it("produces valid JSON with a lean parameter set (no empty objects)", () => {
    const res = buildPrompt({
      module,
      values: { showArea: true, beamColor: "#c9662e" },
      tool: "google-flow",
      format: "structured_json",
      imageCount: 2,
    });
    const parsed = JSON.parse(res.text);
    expect(parsed.parameters.source_images).toBeDefined();
    expect(Object.keys(parsed.parameters.source_images)).toHaveLength(2);
    expect(parsed.parameters.scene_fidelity).toBeDefined();
    expect(parsed.parameters.hard_negatives.length).toBeGreaterThan(0);
  });

  it("locks the camera and forbids redrawing the outline", () => {
    const res = buildPrompt({ module, values: {}, tool: "google-flow", format: "plain_text", imageCount: 2 });
    expect(module.fidelity?.lockedCamera).toBe(true);
    expect(res.text.toLowerCase()).toContain("travada");
  });

  it("resolves its dependency to a real module", () => {
    expect(module.dependsOn).toBe("metragem-do-terreno");
    expect(getModuleBySlug(module.dependsOn!)).toBeDefined();
  });
});

describe("Voo de Drone", () => {
  const module = mod("voo-de-drone");

  it("uses distinct start/end image labels, not generic ones", () => {
    expect(module.requiredImages.map((s) => s.label)).toEqual(["Ponto inicial", "Ponto final"]);
  });

  it("keeps a technical trajectory value out of the visible label", () => {
    const trajectoryField = module.beginnerFields
      .concat(module.advancedFields)
      .find((f) => f.key === "trajectory");
    const orbital = trajectoryField?.options?.find((o) => o.value === "orbital");
    expect(orbital?.label).toBe("Orbital ao redor");
    expect(orbital?.promptValue).toContain("orbital flight path");
  });

  it("plain-text output differs meaningfully between Runway and Google Flow", () => {
    const values: FieldValues = { peakSpeed: "media", trajectory: "orbital" };
    const flow = buildPrompt({ module, values, tool: "google-flow", format: "plain_text", imageCount: 2 });
    const runway = buildPrompt({ module, values, tool: "runway", format: "plain_text", imageCount: 2 });
    expect(runway.text).toContain("Um único movimento de câmera contínuo por plano");
    expect(flow.text).not.toContain("Um único movimento de câmera contínuo por plano");
    expect(flow.text).toContain("Priorizar fielmente as imagens de referência");
  });
});

describe("Contorno da Casa", () => {
  const module = mod("contorno-da-casa");

  it("defaults to structured_json", () => {
    expect(module.defaultFormat).toBe("structured_json");
  });

  it("forbids redrawing or recoloring the outline as a hard negative", () => {
    expect(module.hardNegatives).toContain("redesenhar o contorno");
    expect(module.hardNegatives).toContain("alterar a cor do traço");
  });

  it("produces parseable JSON with camera fidelity locked", () => {
    const res = buildPrompt({
      module,
      values: { beamColor: "#c9662e", glowStyle: "neon-suave" },
      tool: "google-flow",
      format: "structured_json",
      imageCount: 2,
    });
    const parsed = JSON.parse(res.text);
    expect(parsed.parameters.scene_fidelity.lockedCamera).toBe(true);
  });
});

describe("Construção Completa (fluxo em 2 etapas)", () => {
  const module = mod("construcao-completa");

  it("switching the stage field changes the generated prompt", () => {
    const base = { speed: "media" };
    const stage1 = buildPrompt({
      module,
      values: { ...base, stage: "terreno-estrutura" },
      tool: "google-flow",
      format: "plain_text",
      imageCount: 2,
    });
    const stage2 = buildPrompt({
      module,
      values: { ...base, stage: "estrutura-entrega" },
      tool: "google-flow",
      format: "plain_text",
      imageCount: 2,
    });
    expect(stage1.text).not.toBe(stage2.text);
    expect(stage1.text).toContain("Etapa 1 de 2");
    expect(stage2.text).toContain("Etapa 2 de 2");
  });

  it("never generates the prompt beyond the selected stage (hard negative present)", () => {
    expect(module.hardNegatives).toContain("avançar a obra além da segunda imagem enviada");
  });
});

describe("Tool structural differences (section 13)", () => {
  it("Midjourney reads as one dense line, not stacked paragraphs", () => {
    const module = mod("decoracao-de-interiores");
    const res = buildPrompt({
      module,
      values: { roomType: "sala", style: "contemporaneo" },
      tool: "midjourney",
      format: "plain_text",
      imageCount: 1,
    });
    expect(res.text).not.toContain("\n\n");
  });

  it("never invents proprietary parameter syntax beyond the tool's known suffix", () => {
    const module = mod("timelapse-de-construcao");
    const res = buildPrompt({ module, values: {}, tool: "sora", format: "plain_text", imageCount: 1 });
    expect(res.text).not.toMatch(/--\w/); // that's a Midjourney-only convention
  });
});
