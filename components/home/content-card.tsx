import Link from "next/link";
import type { ModuleSummary } from "@/types";
import { cn } from "@/lib/utils";
import { moduleCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { CoverVideo } from "@/components/common/cover-video";
import { AccessBadge } from "@/components/common/access-badge";
import { FavoriteButton } from "@/components/common/favorite-button";

const RATIO_CLASS = {
  wide: "aspect-[16/9]",
  cinematic: "aspect-[3/2]",
} as const;

export function ContentCard({
  module,
  ratio = "wide",
  sizes = "(max-width: 640px) 60vw, (max-width: 1024px) 34vw, 320px",
  priority = false,
  className,
}: {
  module: ModuleSummary;
  ratio?: "wide" | "cinematic";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const cover = moduleCover(module);
  const flag = module.startHere ? "Comece aqui" : module.isNew ? "Novo" : null;

  return (
    <Link
      href={`/app/modulo/${module.slug}`}
      className={cn("group block focus-visible:outline-none", className)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-hairline transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:-translate-y-0.5 group-hover:border-hairline-strong group-hover:shadow-[var(--shadow-panel)]",
          "group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand",
          RATIO_CLASS[ratio],
        )}
      >
        {cover.previewVideo ? (
          <CoverVideo
            cover={cover}
            seed={module.slug}
            sizes={sizes}
            showSceneLabel={false}
          />
        ) : (
          <CoverImage
            cover={cover}
            seed={module.slug}
            sizes={sizes}
            priority={priority}
            showSceneLabel={false}
          />
        )}

        {flag ? (
          <span className="absolute left-2.5 top-2.5 rounded bg-canvas/70 px-1.5 py-0.5 text-2xs font-medium text-ink-muted backdrop-blur">
            {flag}
          </span>
        ) : null}

        {module.accessLevel !== "free" ? (
          <span className="absolute right-2.5 top-2.5 transition-opacity group-hover:opacity-0">
            <AccessBadge level={module.accessLevel} />
          </span>
        ) : null}

        <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <FavoriteButton id={module.slug} kind="module" size="sm" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-canvas/95 via-canvas/55 to-transparent p-3 pt-9 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-2 text-xs leading-snug text-ink-muted">
            {module.description}
          </p>
          <span className="mt-1.5 inline-block text-xs font-medium text-ink">
            Abrir módulo →
          </span>
        </div>
      </div>

      <p className="mt-2 truncate text-sm text-ink">{module.name}</p>
    </Link>
  );
}
