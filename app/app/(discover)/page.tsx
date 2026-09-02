import type { Metadata } from "next";
import { TrainingHero } from "@/components/home/training-hero";
import { ContinueWatching } from "@/components/home/continue-watching";
import { QuickTrainingRow } from "@/components/home/quick-training-row";
import { ToolsDivider } from "@/components/home/tools-divider";
import { PopularToolsRow } from "@/components/home/popular-tools-row";
import { ContentRow } from "@/components/home/content-row";
import { ContentCard } from "@/components/home/content-card";
import { getPrimaryTraining } from "@/lib/trainings";
import { getModulesByCategory, POPULAR_TOOL_SLUGS } from "@/lib/modules";
import { CATEGORY_MAP } from "@/lib/categories";
import type { CategorySlug } from "@/types";

export const metadata: Metadata = {
  title: "Início",
};

const TOOL_CATEGORY_ROWS: CategorySlug[] = [
  "terrenos",
  "interiores",
  "construcao",
  "cinematograficos",
];

export default function HomePage() {
  const course = getPrimaryTraining();
  const popular = new Set<string>(POPULAR_TOOL_SLUGS);

  return (
    <div className="pb-16">
      <TrainingHero training={course} />

      {/* Training — editorial, light "members area" band */}
      <section className="zone-light">
        <div className="mx-auto max-w-[1360px] space-y-10 py-14 lg:py-16">
          <ContinueWatching training={course} />
          <QuickTrainingRow />
        </div>
      </section>

      {/* Tools — operational, dark */}
      <div className="mx-auto max-w-[1360px]">
        <ToolsDivider />

        <div className="mt-8 space-y-12">
          <PopularToolsRow />

          {TOOL_CATEGORY_ROWS.map((slug) => {
            const category = CATEGORY_MAP[slug];
            const items = getModulesByCategory(slug).filter(
              (m) => !popular.has(m.slug),
            );
            if (items.length === 0) return null;
            return (
              <ContentRow
                key={slug}
                title={category.name}
                href={`/app/categoria/${slug}`}
                itemWidth="w-[264px] sm:w-[300px]"
              >
                {items.map((m) => (
                  <ContentCard
                    key={m.slug}
                    module={m}
                    sizes="(max-width: 640px) 72vw, 300px"
                  />
                ))}
              </ContentRow>
            );
          })}
        </div>
      </div>
    </div>
  );
}
