"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ModuleDefinition } from "@/types";
import { getCategory } from "@/lib/categories";
import { SegmentedControl } from "@/components/ui/segmented";
import { AccessBadge } from "@/components/common/access-badge";
import { FavoriteButton } from "@/components/common/favorite-button";
import { SupportDrawer } from "@/components/common/support-drawer";

export function ModuleHeader({
  module,
  level,
  onLevelChange,
  hasAdvanced,
}: {
  module: ModuleDefinition;
  level: "iniciante" | "avancado";
  onLevelChange: (v: "iniciante" | "avancado") => void;
  hasAdvanced: boolean;
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
