import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategoryDefinition } from "@/types";
import { categoryCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";

export function CategoryCard({
  category,
  description,
  sizes = "(max-width: 640px) 80vw, 360px",
}: {
  category: CategoryDefinition;
  /** one-line blurb; falls back to the category tagline */
  description?: string;
  sizes?: string;
}) {
  const cover = categoryCover(category);

  return (
    <Link
      href={`/app/categoria/${category.slug}`}
      className="group relative block aspect-[16/9] overflow-hidden rounded-lg border border-hairline transition-colors hover:border-hairline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <CoverImage
        cover={cover}
        seed={`categoria-${category.slug}`}
        sizes={sizes}
        showSceneLabel={false}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <p className="text-sm font-medium text-ink">{category.name}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
          {description ?? category.tagline}
        </p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100">
          Abrir trilha <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
