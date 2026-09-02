"use client";

import { Check, RefreshCw } from "lucide-react";
import type { PromptFormat, PromptResult, TargetTool } from "@/types";
import { getToolProfile } from "@/lib/prompt-engine";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented";
import { CopyButton } from "@/components/common/copy-button";
import { cn } from "@/lib/utils";

export function PromptOutput({
  result,
  tools,
  tool,
  onToolChange,
  allowStructured,
  format,
  onFormatChange,
  onGenerate,
  onSave,
  canGenerate,
  blockReason,
  stale,
  saved,
}: {
  result: PromptResult | null;
  tools: TargetTool[];
  tool: TargetTool;
  onToolChange: (t: TargetTool) => void;
  allowStructured: boolean;
  format: PromptFormat;
  onFormatChange: (f: PromptFormat) => void;
  onGenerate: () => void;
  onSave: () => void;
  canGenerate: boolean;
  blockReason?: string;
  stale?: boolean;
  saved?: boolean;
}) {
  const kindLabel = result?.kind === "video" ? "Vídeo" : "Imagem";

  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-panel">
      <div className="space-y-3 border-b border-hairline p-4">
        <div className="flex items-center justify-between">
          <p className="section-label text-ink">Prompt</p>
          {result ? (
            <span className="text-xs text-ink-faint">
              {getToolProfile(result.tool).label} · {kindLabel}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[150px] flex-1 space-y-1.5">
            <span className="text-xs text-ink-muted">Ferramenta</span>
            <Select
              value={tool}
              onChange={(e) => onToolChange(e.target.value as TargetTool)}
            >
              {tools.map((t) => (
                <option key={t} value={t}>
                  {getToolProfile(t).label}
                </option>
              ))}
            </Select>
          </label>
          {allowStructured ? (
            <div className="space-y-1.5">
              <span className="block text-xs text-ink-muted">Formato</span>
              <SegmentedControl
                aria-label="Formato do prompt"
                size="sm"
                options={[
                  { value: "plain_text", label: "Texto" },
                  { value: "structured_json", label: "JSON" },
                ]}
                value={format}
                onValueChange={(v) => onFormatChange(v as PromptFormat)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        {!result ? (
          <div className="py-8 text-center">
            <p className="text-sm text-ink-muted">
              Preencha os campos e gere o prompt.
            </p>
            {blockReason ? (
              <p className="mt-1 text-xs text-warning">{blockReason}</p>
            ) : null}
            <Button
              className="mt-4"
              size="sm"
              onClick={onGenerate}
              disabled={!canGenerate}
            >
              Gerar prompt
            </Button>
          </div>
        ) : (
          <>
            {stale ? (
              <p className="mb-2 text-xs text-warning">
                Campos alterados. Gere de novo para atualizar.
              </p>
            ) : null}
            <pre
              className={cn(
                "max-h-[380px] overflow-auto whitespace-pre-wrap rounded-md bg-canvas p-3 text-xs leading-relaxed text-ink",
                result.format === "structured_json" ? "font-mono" : "font-sans",
              )}
            >
              {result.text}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton
                value={result.text}
                variant="primary"
                size="sm"
                label="Copiar prompt"
              />
              <Button variant="secondary" size="sm" onClick={onGenerate}>
                <RefreshCw />
                Gerar de novo
              </Button>
              <Button variant="ghost" size="sm" onClick={onSave} disabled={saved}>
                {saved ? <Check className="text-positive" /> : null}
                {saved ? "Salvo" : "Salvar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
