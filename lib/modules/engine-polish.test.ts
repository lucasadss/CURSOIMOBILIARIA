import { describe, expect, it } from "vitest";
import { ALL_MODULES, getModuleBySlug } from "./index";
import { buildPrompt, resolveValues } from "@/lib/prompt-engine";
import { validateModule } from "./validate";
import type { FieldConfig } from "@/types";

/**
 * Fase 2.1 — prompt-engine polish coverage (sections 6, 14, 15 of the brief).
 * Complements prompt-engine.test.ts (module-specific) and modules.test.ts
 * (registry integrity) with catalogue-wide smoke and consistency checks.
 */

function allFields(m: (typeof ALL_MODULES)[number]): FieldConfig[] {
  return [...m.beginnerFields, ...m.advancedFields];
}

describe("Reforma Cinematográfica is fully generic (section 4)", () => {
  it("no longer depends on Antes e Depois (Decoração)", () => {
    const m = getModuleBySlug("reforma-cinematografica")!;
    expect(m.dependsOn).toBeUndefined();
  });

  it("Antes e Depois (Decoração) still points forward to it (one-directional)", () => {
    const m = getModuleBySlug("antes-e-depois-decoracao")!;
    expect(m.nextModule).toBe("reforma-cinematografica");
  });
});

describe("Apresentação Profissional (section 5)", () => {
  const m = getModuleBySlug("apresentacao-profissional")!;

  it("has exactly one beginner field: Ritmo da apresentação", () => {
    expect(m.beginnerFields).toHaveLength(1);
    expect(m.beginnerFields[0].key).toBe("presentationPace");
  });

  it("maps Suave/Natural/Dinâmico to the exact required promptValues", () => {
    const opts = m.beginnerFields[0].options ?? [];
    const byValue = Object.fromEntries(opts.map((o) => [o.value, o]));
    expect(byValue.suave.promptValue).toBe(
      "slow elegant stabilized walkthrough with gentle transitions between spaces",
    );
    expect(byValue.natural.promptValue).toBe(
      "balanced real-estate walkthrough pacing with smooth continuous camera movement",
    );
    expect(byValue.dinamico.promptValue).toBe(
      "moderately faster cinematic walkthrough while preserving smooth transitions and architectural readability",
    );
  });
});

describe("declarative conflict validator (sections 9, 10, 15, 16)", () => {
  it("finds zero problems across the whole catalogue", () => {
    for (const m of ALL_MODULES) {
      expect(validateModule(m), m.slug).toEqual([]);
    }
  });

  it("does flag an actual locked-vs-controlled-motion conflict", () => {
    const bogus = {
      ...ALL_MODULES[0],
      fidelity: { lockedCamera: true },
      cameraMode: "controlled-motion" as const,
    };
    expect(validateModule(bogus).length).toBeGreaterThan(0);
  });
});

describe("registry-wide smoke test (section 14)", () => {
  for (const m of ALL_MODULES) {
    const formats = m.allowStructuredJson
      ? (["plain_text", "structured_json"] as const)
      : (["plain_text"] as const);

    for (const format of formats) {
      it(`${m.slug} (${format}) — clean output, no leftover tokens`, () => {
        const res = buildPrompt({
          module: m,
          values: {},
          tool: m.recommendedTool,
          format,
          imageCount: m.requiredImages.length,
        });
        expect(res.text).not.toContain("{{");
        expect(res.text).not.toContain("␀");
        expect(res.text).not.toMatch(/\bundefined\b/);
        expect(res.text).not.toMatch(/\bnull\b/);
        expect(res.text).not.toContain("[object Object]");

        if (format === "structured_json") {
          expect(() => JSON.parse(res.text)).not.toThrow();
        }
      });
    }
  }

  it("no module has an option with an empty label", () => {
    for (const m of ALL_MODULES) {
      for (const field of allFields(m)) {
        for (const opt of field.options ?? []) {
          expect(opt.label.trim().length, `${m.slug}.${field.key}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("label vs promptValue consistency (section 1, 6)", () => {
  // Fields whose value is a plain count/unit, not a visual/cinematographic
  // concept — a numeral label needs no technical elaboration.
  const EXEMPT_FIELD_KEYS = new Set(["areaUnit", "floors"]);

  it("flags technical select/segmented options whose promptValue is missing or trivially equal to the label", () => {
    const suspicious: string[] = [];
    for (const m of ALL_MODULES) {
      for (const field of allFields(m)) {
        if (field.type !== "select" && field.type !== "segmented-control" && field.type !== "multiselect") continue;
        if (EXEMPT_FIELD_KEYS.has(field.key)) continue;
        for (const opt of field.options ?? []) {
          if (!opt.promptValue) {
            suspicious.push(`${m.slug}.${field.key} → "${opt.value}" has no promptValue`);
          }
        }
      }
    }
    expect(suspicious).toEqual([]);
  });
});

describe("JSON leanness and validity — Metragem Animada, Metragem em Terreno (Vídeo), Contorno da Casa (section 11)", () => {
  const cases = ["metragem-animada", "metragem-em-terreno-video", "contorno-da-casa"] as const;

  for (const slug of cases) {
    it(`${slug} — parseable, no empty objects, promptValue reaches the JSON`, () => {
      const m = getModuleBySlug(slug)!;
      const res = buildPrompt({
        module: m,
        values: {},
        tool: m.recommendedTool,
        format: "structured_json",
        imageCount: m.requiredImages.length,
      });
      const parsed = JSON.parse(res.text);
      expect(res.text).not.toContain('"undefined"');
      for (const value of Object.values(parsed.parameters)) {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          expect(Object.keys(value).length, slug).toBeGreaterThan(0);
        }
      }
    });
  }

  it("Metragem Animada's beamColor/speed promptValue shows up inside the JSON output", () => {
    const m = getModuleBySlug("metragem-animada")!;
    const res = buildPrompt({
      module: m,
      values: { speed: "rapida", showArea: true, beamColor: "#c9662e" },
      tool: "google-flow",
      format: "structured_json",
      imageCount: 2,
    });
    expect(res.text).toContain("brisk, energetic pacing");
  });
});

describe("boolean fields read naturally, no scattered if/else (sections 7)", () => {
  it("crew resolves through field-config booleanText, not a literal sim/não", () => {
    const m = getModuleBySlug("timelapse-de-construcao")!;
    const fields = [...m.beginnerFields, ...m.advancedFields];
    const on = resolveValues(fields, { crew: true });
    const off = resolveValues(fields, { crew: false });
    expect(on.crew).toBe("show realistic workers and construction machinery progressing naturally through the scene");
    expect(off.crew).toBe("do not introduce workers or construction machinery");
  });

  it("the assembled prompt carries that natural-language phrase, not 'sim'/'não'", () => {
    const m = getModuleBySlug("timelapse-de-construcao")!;
    const on = buildPrompt({ module: m, values: { crew: true }, tool: "google-flow", format: "plain_text", imageCount: 1 });
    const off = buildPrompt({ module: m, values: { crew: false }, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(on.text).toContain("show realistic workers and construction machinery progressing naturally through the scene");
    expect(off.text).toContain("do not introduce workers or construction machinery");
    expect(on.text).not.toMatch(/movimento acelerado: sim\b/);
    expect(off.text).not.toMatch(/movimento acelerado: não\b/);
  });
});

describe("extraDetails standardization (section 8)", () => {
  it("produces no line when empty", () => {
    const m = getModuleBySlug("decoracao-de-interiores")!;
    const res = buildPrompt({ module: m, values: {}, tool: "google-flow", format: "plain_text", imageCount: 1 });
    expect(res.text).not.toMatch(/Direção adicional/);
  });

  it("formats as 'Direção adicional do usuário' when filled, never spliced mid-rule", () => {
    const m = getModuleBySlug("decoracao-de-interiores")!;
    const res = buildPrompt({
      module: m,
      values: { extraDetails: "manter o piso de madeira original" },
      tool: "google-flow",
      format: "plain_text",
      imageCount: 1,
    });
    expect(res.text).toContain("Direção adicional do usuário: manter o piso de madeira original.");
  });

  it("lands in additional_details in structured_json, not duplicated in prompt_summary", () => {
    const m = getModuleBySlug("decoracao-de-interiores")!;
    const res = buildPrompt({
      module: m,
      values: { extraDetails: "luz de fim de tarde" },
      tool: "google-flow",
      format: "structured_json",
      imageCount: 1,
    });
    const parsed = JSON.parse(res.text);
    expect(parsed.additional_details).toContain("luz de fim de tarde");
    expect(parsed.prompt_summary).not.toContain("luz de fim de tarde");
  });
});

describe("locked camera never receives a movement-continuity tool note (section 15)", () => {
  it("Runway's camera-continuity closing line does not appear for a locked-camera module", () => {
    const m = getModuleBySlug("metragem-animada")!;
    const res = buildPrompt({ module: m, values: {}, tool: "runway", format: "plain_text", imageCount: 2 });
    expect(res.text).not.toContain("Um único movimento de câmera contínuo por plano");
  });
});
