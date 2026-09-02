import { describe, expect, it } from "vitest";
import { ALL_MODULES, getModuleBySlug } from "./index";
import { buildPrompt } from "@/lib/prompt-engine";

describe("module registry", () => {
  it("has 22 modules with unique slugs", () => {
    expect(ALL_MODULES).toHaveLength(22);
    const slugs = new Set(ALL_MODULES.map((m) => m.slug));
    expect(slugs.size).toBe(22);
  });

  it("every dependsOn / nextModule / steps reference resolves to a real module", () => {
    for (const m of ALL_MODULES) {
      if (m.dependsOn) {
        expect(getModuleBySlug(m.dependsOn), `${m.slug} → dependsOn "${m.dependsOn}"`).toBeDefined();
      }
      if (m.nextModule) {
        expect(getModuleBySlug(m.nextModule), `${m.slug} → nextModule "${m.nextModule}"`).toBeDefined();
      }
      for (const step of m.steps ?? []) {
        if (step.moduleSlug) {
          expect(getModuleBySlug(step.moduleSlug), `${m.slug} → step "${step.moduleSlug}"`).toBeDefined();
        }
      }
    }
  });

  it("image labels are specific, never the generic placeholders", () => {
    const generic = /^imagem\s*\d*$/i;
    for (const m of ALL_MODULES) {
      for (const slot of m.requiredImages) {
        expect(generic.test(slot.label), `${m.slug} → "${slot.label}"`).toBe(false);
      }
    }
  });

  it("modules that declare a hard fidelity guarantee also ship hard negatives", () => {
    for (const m of ALL_MODULES) {
      if (m.fidelity && Object.values(m.fidelity).some(Boolean)) {
        expect(m.hardNegatives?.length ?? 0, `${m.slug} has fidelity rules but no hard negatives`).toBeGreaterThan(0);
      }
    }
  });

  it("buildPrompt never throws for any module, in every format it allows", () => {
    for (const m of ALL_MODULES) {
      const formats = m.allowStructuredJson
        ? (["plain_text", "structured_json"] as const)
        : (["plain_text"] as const);
      for (const format of formats) {
        expect(() =>
          buildPrompt({ module: m, values: {}, tool: m.recommendedTool, format, imageCount: 0 }),
        ).not.toThrow();
      }
    }
  });

  it("structured_json output is always valid JSON", () => {
    for (const m of ALL_MODULES.filter((m) => m.allowStructuredJson)) {
      const res = buildPrompt({
        module: m,
        values: {},
        tool: m.recommendedTool,
        format: "structured_json",
        imageCount: m.requiredImages.length,
      });
      expect(() => JSON.parse(res.text)).not.toThrow();
    }
  });
});
