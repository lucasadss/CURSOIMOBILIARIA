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
import { getModuleBySlug, isVideoModule } from "@/lib/modules";
import { cn } from "@/lib/utils";
import { useHistory } from "@/lib/storage/history";
import { useUI } from "@/lib/storage/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { ModuleHeader } from "./module-header";
import { ModuleInstructions } from "./module-instructions";
import { ToolGuide } from "./tool-guide";
import { ModuleFieldRenderer } from "./field-renderer";
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

  // The image/video counterpart, when this pair was merged into one
  // workspace — fixed for the life of this page (see the `key` on the route
  // page, which remounts on navigation between the two slugs).
  const paired = React.useMemo(
    () => (module.pairedModule ? getModuleBySlug(module.pairedModule) : undefined),
    [module.pairedModule],
  );

  const [active, setActive] = React.useState<ModuleDefinition>(module);
  const activeKind: "imagem" | "video" = isVideoModule(active) ? "video" : "imagem";

  const allFields = React.useMemo(
    () => [...active.beginnerFields, ...active.advancedFields],
    [active],
  );
  const hasAdvanced = active.advancedFields.length > 0;
  const effectiveLevel = hasAdvanced ? level : "iniciante";
  const visibleFields =
    effectiveLevel === "avancado" ? allFields : active.beginnerFields;

  const [values, setValues] = React.useState<FieldValues>(() =>
    initialValues(allFields),
  );
  const [tool, setTool] = React.useState<TargetTool>(active.recommendedTool);
  const [format, setFormat] = React.useState<PromptFormat>(
    active.defaultFormat ?? "plain_text",
  );
  // Photos are prepared and uploaded in the destination tool (Google Flow etc.),
  // never inside this app — so every declared reference image is treated as
  // ready by the time the prompt is actually used.
  const imageCount = active.requiredImages.length;
  const [result, setResult] = React.useState<PromptResult | null>(null);
  const [stale, setStale] = React.useState(false);
  const [savedText, setSavedText] = React.useState<string | null>(null);

  const tools = active.availableTools ?? [active.recommendedTool];

  function switchKind(kind: "imagem" | "video") {
    // `paired` is a fixed reference (the counterpart of the slug this page
    // loaded with) — pick whichever of {module, paired} actually matches the
    // requested kind, rather than toggling relative to the current state.
    const target = [module, paired]
      .filter((m): m is ModuleDefinition => Boolean(m))
      .find((m) => (isVideoModule(m) ? "video" : "imagem") === kind);
    if (!target || target === active) return;
    setActive(target);
    const fields = [...target.beginnerFields, ...target.advancedFields];
    setValues(initialValues(fields));
    setTool(target.recommendedTool);
    setFormat(target.defaultFormat ?? "plain_text");
    setResult(null);
    setStale(false);
    setSavedText(null);
  }

  React.useEffect(() => {
    recordVisit({
      slug: active.slug,
      name: active.name,
      category: active.category,
      type: active.type,
      thumbnail: active.thumbnail,
    });
  }, [active, recordVisit]);

  const requiredMissing = visibleFields
    .filter((f) => f.required)
    .some((f) => {
      const v = values[f.key];
      return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
    });

  const blockReason = requiredMissing
    ? "Preencha os campos obrigatórios."
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
    const res = buildPrompt({ module: active, values, tool, format, imageCount });
    setResult(res);
    setStale(false);
    setSavedText(null);
  }

  function save() {
    if (!result || savedText === result.text) return;
    recordPrompt({
      moduleSlug: active.slug,
      moduleName: active.name,
      tool: result.tool,
      format: result.format,
      kind: result.kind,
      text: result.text,
    });
    setSavedText(result.text);
  }

  // Once merged into one workspace, the pair's own dependsOn/nextModule link
  // is redundant — the Imagem/Vídeo switch above already covers it.
  const prerequisite = active.dependsOn
    ? getModuleBySlug(active.dependsOn)
    : undefined;

  const hasContext = Boolean(
    prerequisite || active.instructions?.length || active.toolGuide,
  );
  const hasImages = active.requiredImages.length > 0;
  const hasFields = visibleFields.length > 0;

  return (
    <div>
      <ModuleHeader
        module={active}
        level={hydrated ? level : "iniciante"}
        onLevelChange={setLevel}
        hasAdvanced={hasAdvanced}
        paired={paired}
        activeKind={activeKind}
        onKindChange={switchKind}
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
                <ModuleInstructions items={active.instructions} />
                <ToolGuide guide={active.toolGuide} />
              </div>
            )}

            {hasImages ? (
              <section>
                <SectionLabel>Imagens de referência</SectionLabel>
                <p className="mb-3 text-sm text-ink-muted">
                  Prepare estas fotos para anexar na ferramenta escolhida ao
                  usar o prompt — o envio não acontece aqui.
                </p>
                <ul className="space-y-2">
                  {active.requiredImages.map((slot) => (
                    <li
                      key={slot.key}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" />
                      <span>
                        <span className="font-medium text-ink">{slot.label}</span>
                        {slot.hint ? ` — ${slot.hint}` : null}
                      </span>
                    </li>
                  ))}
                </ul>
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
                allowStructured={Boolean(active.allowStructuredJson)}
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
              <NextStepCard module={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
