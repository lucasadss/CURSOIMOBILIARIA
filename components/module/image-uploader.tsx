"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ImagePlus, X } from "lucide-react";
import type { ImageSlot } from "@/types";
import { cn } from "@/lib/utils";

interface Loaded {
  name: string;
  url: string;
}

export function ImageUploader({
  slots,
  onFilledChange,
}: {
  slots: ImageSlot[];
  /** which slots currently have a file, in slot order */
  onFilledChange: (filled: boolean[]) => void;
}) {
  const [files, setFiles] = React.useState<(Loaded | null)[]>(() =>
    slots.map(() => null),
  );
  const reorderable = slots.length > 2;

  React.useEffect(() => {
    onFilledChange(files.map(Boolean));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  React.useEffect(() => {
    return () => {
      files.forEach((f) => f && URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(index: number, file: File | undefined) {
    if (!file) return;
    setFiles((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!.url);
      next[index] = { name: file.name, url: URL.createObjectURL(file) };
      return next;
    });
  }

  function remove(index: number) {
    setFiles((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index]!.url);
      next[index] = null;
      return next;
    });
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        slots.length === 1 ? "grid-cols-1" : "grid-cols-2",
      )}
    >
      {slots.map((slot, i) => {
        const loaded = files[i];
        return (
          <div key={slot.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink">{slot.label}</span>
              {reorderable && loaded ? (
                <span className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === slots.length - 1}
                    className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </span>
              ) : null}
            </div>

            {loaded ? (
              <div className="group relative aspect-[4/3] overflow-hidden rounded-md border border-hairline-strong">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loaded.url}
                  alt={slot.label}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-canvas/80 text-ink-muted backdrop-blur transition-colors hover:text-ink"
                  aria-label="Remover imagem"
                >
                  <X className="size-3.5" />
                </button>
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-canvas/90 to-transparent px-2 py-1 text-2xs text-ink-muted">
                  {loaded.name}
                </span>
              </div>
            ) : (
              <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-hairline-strong bg-panel-2/50 text-center transition-colors hover:border-white/25 hover:bg-panel-2">
                <ImagePlus className="size-5 text-ink-faint" />
                <span className="px-2 text-2xs leading-snug text-ink-faint">
                  {slot.hint ?? "Clique para enviar"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => pick(i, e.target.files?.[0])}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}
