import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getModulesByCategory, isVideoModule } from "@/lib/modules";
import { categoryCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { ContentCard } from "@/components/home/content-card";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? category.name : "Categoria" };
}

const GRID_SIZES =
  "(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 420px";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const modules = getModulesByCategory(category.slug);
  const images = modules.filter((m) => !isVideoModule(m));
  const videos = modules.filter((m) => isVideoModule(m));

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 -z-10">
          <CoverImage
            cover={{ ...categoryCover(category), overlayClass: "" }}
            seed={`categoria-${category.slug}`}
            sizes="100vw"
            priority
            showOverlay={false}
            showSceneLabel={false}
            className="opacity-50"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-canvas via-canvas/85 to-canvas/45" />
        <div className="mx-auto max-w-[1360px] px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <p className="text-xs text-ink-faint">Trilha</p>
          <h1 className="mt-1.5 text-2xl font-medium text-ink sm:text-3xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {category.description}
          </p>
          <p className="mt-4 text-xs text-ink-faint">
            {modules.length} {modules.length === 1 ? "módulo" : "módulos"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {images.length > 0 && <Group title="Imagens" items={images} />}
        {videos.length > 0 && <Group title="Vídeos" items={videos} />}
        {modules.length === 0 && (
          <p className="text-sm text-ink-muted">
            Ainda não há módulos nesta trilha.
          </p>
        )}
      </div>
    </div>
  );
}

function Group({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof getModulesByCategory>;
}) {
  return (
    <section>
      <h2 className="section-label mb-3">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <ContentCard key={m.slug} module={m} sizes={GRID_SIZES} />
        ))}
      </div>
    </section>
  );
}
