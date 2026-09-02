"use client";

import * as React from "react";
import { Check, Info } from "lucide-react";
import type { FieldConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented";
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Value = string | string[] | number | boolean | undefined;

interface Props {
  field: FieldConfig;
  value: Value;
  onChange: (key: string, value: Value) => void;
}

export function ModuleFieldRenderer({ field, value, onChange }: Props) {
  const set = (v: Value) => onChange(field.key, v);

  if (field.type === "info") {
    return (
      <div
        className={cn(
          "rounded-md border px-3 py-2.5 text-xs leading-relaxed",
          field.tone === "brand"
            ? "border-brand-border bg-brand-subtle text-ink"
            : field.tone === "warning"
              ? "border-warning/30 bg-warning/10 text-ink"
              : "border-hairline bg-panel-2 text-ink-muted",
        )}
      >
        {field.content}
      </div>
    );
  }

  if (field.type === "helper-text") {
    return <p className="text-xs text-ink-faint">{field.content}</p>;
  }

  const control = (() => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value || undefined)}
          >
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        );

      case "multiselect": {
        const arr = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-1.5">
            {field.options?.map((o) => {
              const on = arr.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set(
                      on
                        ? arr.filter((x) => x !== o.value)
                        : [...arr, o.value],
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors",
                    on
                      ? "border-transparent bg-white/[0.08] text-ink"
                      : "border-hairline-strong text-ink-muted hover:border-hairline-strong hover:text-ink",
                  )}
                >
                  {on ? <Check className="size-3 text-ink-muted" /> : null}
                  {o.label}
                </button>
              );
            })}
          </div>
        );
      }

      case "textarea":
        return (
          <Textarea
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value || undefined)}
            rows={3}
          />
        );

      case "input":
        return (
          <Input
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value || undefined)}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value === undefined ? "" : String(value)}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) =>
              set(e.target.value === "" ? undefined : Number(e.target.value))
            }
          />
        );

      case "color": {
        const current = (value as string) ?? (field.defaultValue as string) ?? "#c9662e";
        return (
          <div className="flex items-center gap-2">
            <label className="relative size-8 shrink-0 overflow-hidden rounded-md border border-hairline-strong">
              <span
                className="absolute inset-0"
                style={{ background: current }}
              />
              <input
                type="color"
                value={current}
                onChange={(e) => set(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            {field.swatches?.length ? (
              <div className="flex gap-1.5">
                {field.swatches.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-label={`Cor ${s}`}
                    onClick={() => set(s)}
                    className={cn(
                      "size-6 rounded-md border transition-transform hover:scale-105",
                      current.toLowerCase() === s.toLowerCase()
                        ? "border-ink"
                        : "border-hairline-strong",
                    )}
                    style={{ background: s }}
                  />
                ))}
              </div>
            ) : null}
            <code className="text-xs text-ink-faint">{current}</code>
          </div>
        );
      }

      case "toggle":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(value)}
              onCheckedChange={(v) => set(v)}
              id={`f-${field.key}`}
            />
            <label
              htmlFor={`f-${field.key}`}
              className="text-xs text-ink-muted"
            >
              {Boolean(value) ? "Ativado" : "Desativado"}
            </label>
          </div>
        );

      case "slider": {
        const num =
          typeof value === "number"
            ? value
            : (field.defaultValue as number) ?? field.min ?? 0;
        return (
          <div className="flex items-center gap-3">
            <Slider
              value={[num]}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              onValueChange={([v]) => set(v)}
              className="flex-1"
            />
            <span className="w-12 shrink-0 text-right text-xs tabular-nums text-ink-muted">
              {num}
              {field.unit ?? ""}
            </span>
          </div>
        );
      }

      case "tabs":
      case "segmented-control":
        return (
          <SegmentedControl
            aria-label={field.label}
            options={(field.options ?? []).map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            value={
              (value as string) ??
              (field.defaultValue as string) ??
              field.options?.[0]?.value ??
              ""
            }
            onValueChange={(v) => set(v)}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <div className={cn("space-y-2", field.fullWidth && "sm:col-span-2")}>
      {field.label ? (
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-ink">
            {field.label}
            {field.required ? (
              <span className="text-ink-faint"> (obrigatório)</span>
            ) : null}
          </label>
          {field.tooltip ? (
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-ink-faint hover:text-ink-muted"
                  aria-label="Ajuda"
                >
                  <Info className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{field.tooltip}</TooltipContent>
            </TooltipRoot>
          ) : null}
        </div>
      ) : null}
      {control}
      {field.description ? (
        <p className="text-2xs leading-relaxed text-ink-faint">
          {field.description}
        </p>
      ) : null}
    </div>
  );
}
