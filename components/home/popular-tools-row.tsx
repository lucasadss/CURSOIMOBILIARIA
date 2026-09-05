"use client";

import { useHistory } from "@/lib/storage/history";
import { useHydrated } from "@/hooks/use-hydrated";
import { POPULAR_TOOLS } from "@/lib/modules";
import { ContentRow } from "./content-row";
import { ContentCard } from "./content-card";

/**
 * "Ferramentas mais usadas" — a curated shortlist, minus whatever is already
 * showing in "Continue de onde parou", so the same module never appears twice
 * in adjacent sections (dedup priority: Continue > Mais usados).
 */
export function PopularToolsRow() {
  const hydrated = useHydrated();
  const visits = useHistory((s) => s.visits);
  const visited = new Set(visits.map((v) => v.slug));

  const filtered = POPULAR_TOOLS.filter((m) => !visited.has(m.slug));
  const items = (hydrated && filtered.length >= 3 ? filtered : POPULAR_TOOLS).slice(
    0,
    5,
  );

  return (
    <ContentRow
      title="Mais usadas"
      href="/app/explorar"
      itemWidth="w-[300px] sm:w-[380px] lg:w-[440px]"
    >
      {items.map((m) => (
        <ContentCard
          key={m.slug}
          module={m}
          sizes="(max-width: 640px) 82vw, 440px"
        />
      ))}
    </ContentRow>
  );
}
