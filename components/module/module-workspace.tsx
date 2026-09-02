"use client";

import * as React from "react";
import Link from "next/link";
import type {
  FieldConfig,
  FieldValues,
  ModuleDefinition,
  PromptFormat,
  PromptResult,
  TargetTool,
} from "@/types";
import { buildPrompt } from "@/lib/prompt-engine";
import { getModuleBySlug } from "@/lib/modules";
import { cn } from "@/lib/utils";
import { useHistory } from "@/lib/storage/history";
import { useUI } from "@/lib/storage/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { ModuleHeader } from "./module-header";
import { ModuleInstructions } from "./module-instructions";
import { ToolGuide } from "./tool-guide";
import { ModuleFieldRenderer } from "./field-renderer";
import { ImageUploader } from "./image-uploader";
import { PromptOutput } from "./prompt-output";
import { NextStepCard } from "./next-step-card";

function initialValues(fields: FieldConfig[]): FieldValues {
  const v: FieldValues = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) v[f.key] = f.defaultValue;
    else if (f.type === "segmented-control" || f.type === "tabs")
      v[f.key] = f.options?.[0]?.value;
  }
  return v;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-3 text-ink">{children}</p>;
}

export function ModuleWorkspace({ module }: { module: ModuleDefinition }) {
  const hydrated = useHydrated();
  const level = useUI((s) => s.skillLevel);
  const setLevel = useUI((s) => s.setSkillLevel);
  const recordVisit = useHistory((s) => s.recordVisit);
  const recordPrompt = useHistory((s) => s.recordPrompt);

  const allFields = React.useMemo(
    () => [...module.beginnerFields, ...module.advancedFields],
    [module],
  );
  const hasAdvanced = module.advancedFields.length > 0;
  const effectiveLevel = hasAdvanced ? level : "iniciante";
  const visibleFields =
    effectiveLevel === "avancado" ? allFields : module.beginnerFields;

  const [values, setValues] = React.useState<FieldValues>(() =>
    initialValues(allFields),
  );
  const [tool, setTool] = React.useState<TargetTool>(module.recommendedTool);
  const [format, setFormat] = React.useState<PromptFormat>(
    module.defaultFormat ?? "plain_text",
  );
  const [filledImages, setFilledImages] = React.useState<boolean[]>([]);
  const imageCount = filledImages.filter(Boolean).length;
  const [result, setResult] = React.useState<PromptResult | null>(null);
  const [stale, setStale] = React.useState(false);
  const [savedText, setSavedText] = React.useState<string | null>(null);

  const tools = module.availableTools ?? [module.recommendedTool];

  React.useEffect(() => {
    recordVisit({
      slug: module.slug,
      name: module.name,
      category: module.category,
      type: module.type,
      thumbnail: module.thumbnail,
    });
  }, [module, recordVisit]);

  const requiredMissing = visibleFields
    .filter((f) => f.required)
    .some((f) => {
      const v = values[f.key];
      return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
    });

  const minImages = module.minImages ?? module.requiredImages.length;
  const imagesMissing = module.requiredImages.length > 0 && imageCount < minImages;
  const missingImageLabels = module.requiredImages
    .filter((_, i) => !filledImages[i])
    .slice(0, Math.max(0, minImages - imageCount))
    .map((s) => s.label);

  const blockReason = requiredMissing
    ? "Preencha os campos obrigatórios."
    : imagesMissing
      ? missingImageLabels.length === 1
        ? `Envie a imagem “${missingImageLabels[0]}” para continuar (opcional para o prompt).`
        : `Envie as imagens ${missingImageLabels.map((l) => `“${l}”`).join(", ")} para continuar (opcional para o prompt).`
      : undefined;

  const canGenerate = !requiredMissing;

  const setValue = React.useCallback(
    (key: string, value: FieldValues[string]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setStale(true);
    },
    [],
  );

  function generate() {
    if (!canGenerate) return;
    const res = buildPrompt({ module, values, tool, format, imageCount });
    setResult(res);
    setStale(false);
    setSavedText(null);
  }

  function save() {
    if (!result || savedText === result.text) return;
    recordPrompt({
      moduleSlug: module.slug,
      moduleName: module.name,
      tool: result.tool,
      format: result.format,
      kind: result.kind,
      text: result.text,
    });
    setSavedText(result.text);
  }

  const prerequisite = module.dependsOn
    ? getModuleBySlug(module.dependsOn)
    : undefined;

  const hasContext = Boolean(
    prerequisite || module.instructions?.length || module.toolGuide,
  );
  const hasImages = module.requiredImages.length > 0;
  const hasFields = visibleFields.length > 0;

  return (
    <div>
      <ModuleHeader
        module={module}
        level={hydrated ? level : "iniciante"}
        onLevelChange={setLevel}
        hasAdvanced={hasAdvanced}
      />

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-[1fr_380px]">
          {/* left — context + inputs, separated by space, not boxes */}
          <div className="min-w-0 space-y-8">
            {hasContext && (
              <div className="space-y-4">
                {prerequisite ? (
                  <p className="text-sm leading-relaxed text-ink-muted">
                    Funciona melhor a partir do resultado de{" "}
                    <Link
                      href={`/app/modulo/${prerequisite.slug}`}
                      className="font-medium text-ink underline-offset-2 hover:underline"
                    >
                      {prerequisite.name}
                    </Link>
                    . Gere aquela imagem primeiro e use como referência aqui.
                  </p>
                ) : null}
                <ModuleInstructions items={module.instructions} />
                <ToolGuide guide={module.toolGuide} />
              </div>
            )}

            {hasImages ? (
              <section>
                <SectionLabel>Imagens de referência</SectionLabel>
                <ImageUploader
                  slots={module.requiredImages}
                  onFilledChange={setFilledImages}
                />
              </section>
            ) : null}

            {hasFields ? (
              <section
                className={cn(
                  (hasContext || hasImages) && "border-t border-hairline pt-8",
                )}
              >
                <SectionLabel>Personalização</SectionLabel>
                <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                  {visibleFields.map((f) => (
                    <ModuleFieldRenderer
                      key={f.key}
                      field={f}
                      value={values[f.key]}
                      onChange={setValue}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <p className="text-sm text-ink-muted">
                Este módulo não tem campos — é só gerar o prompt e levar para a
                ferramenta.
              </p>
            )}
          </div>

          {/* right — the payoff */}
          <div>
            <div className="space-y-4 lg:sticky lg:top-6">
              <PromptOutput
                result={result}
                tools={tools}
                tool={tool}
                onToolChange={(t) => {
                  setTool(t);
                  setStale(true);
                }}
                allowStructured={Boolean(module.allowStructuredJson)}
                format={format}
                onFormatChange={(f) => {
                  setFormat(f);
                  setStale(true);
                }}
                onGenerate={generate}
                onSave={save}
                canGenerate={canGenerate}
                blockReason={blockReason}
                stale={stale}
                saved={Boolean(result && savedText === result.text)}
              />
              <NextStepCard module={module} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
