"use client";

import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Video } from "lucide-react";
import type { ModuleDefinition } from "@/types";
import { getCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented";
import { AccessBadge } from "@/components/common/access-badge";
import { FavoriteButton } from "@/components/common/favorite-button";
import { SupportDrawer } from "@/components/common/support-drawer";

export function ModuleHeader({
  module,
  level,
  onLevelChange,
  hasAdvanced,
  paired,
  activeKind,
  onKindChange,
}: {
  module: ModuleDefinition;
  level: "iniciante" | "avancado";
  onLevelChange: (v: "iniciante" | "avancado") => void;
  hasAdvanced: boolean;
  /** the module's image/video counterpart, when this pair has been merged into one workspace */
  paired?: ModuleDefinition;
  activeKind?: "imagem" | "video";
  onKindChange?: (v: "imagem" | "video") => void;
}) {
  const category = getCategory(module.category);

  return (
    <div className="border-b border-hairline">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={category ? `/app/categoria/${category.slug}` : "/app/explorar"}
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          {category?.name ?? "Explorar"}
        </Link>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-medium text-ink">{module.name}</h1>
              <AccessBadge level={module.accessLevel} />
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {module.longDescription ?? module.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <FavoriteButton id={module.slug} kind="module" />
            <SupportDrawer
              materials={module.supportMaterial}
              moduleName={module.name}
            />
          </div>
        </div>

        {paired && onKindChange ? (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-ink-muted">
              O que você quer gerar?
            </p>
            <div
              role="radiogroup"
              aria-label="Imagem ou vídeo"
              className="inline-flex gap-2"
            >
              {(
                [
                  { value: "imagem" as const, label: "Prompt de Imagem", Icon: ImageIcon },
                  { value: "video" as const, label: "Prompt de Vídeo", Icon: Video },
                ]
              ).map(({ value, label, Icon }) => {
                const isActive = (activeKind ?? "imagem") === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onKindChange(value)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      isActive
                        ? "border-brand-border bg-brand text-brand-ink shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                        : "border-hairline-strong bg-panel-2 text-ink-muted hover:text-ink",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {hasAdvanced ? (
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xs text-ink-faint">Modo</span>
            <SegmentedControl
              aria-label="Nível de personalização"
              size="sm"
              options={[
                { value: "iniciante", label: "Iniciante" },
                { value: "avancado", label: "Avançado" },
              ]}
              value={level}
              onValueChange={(v) => onLevelChange(v as "iniciante" | "avancado")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
