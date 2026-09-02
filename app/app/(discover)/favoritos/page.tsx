"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/storage/favorites";
import { useHydrated } from "@/hooks/use-hydrated";
import { getModuleBySlug, toSummary } from "@/lib/modules";
import { getTraining } from "@/lib/trainings";
import { ContentCard } from "@/components/home/content-card";
import { TrainingCard } from "@/components/training/training-card";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritosPage() {
  const hydrated = useHydrated();
  const items = useFavorites((s) => s.items);

  const modules = items
    .filter((i) => i.kind === "module")
    .map((i) => getModuleBySlug(i.id))
    .filter(Boolean)
    .map((m) => toSummary(m!));

  const trainings = items
    .filter((i) => i.kind === "training")
    .map((i) => getTraining(i.id.replace(/^training:/, "")))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-medium text-ink">Minha lista</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Módulos e treinamentos que você salvou.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/explorar">Explorar</Link>
        </Button>
      </div>

      {!hydrated ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/9]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Sua lista está vazia"
          description="Clique no coração de um módulo ou treinamento para guardar aqui."
          action={
            <Button asChild size="sm">
              <Link href="/app/explorar">Ver módulos</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-10">
          {modules.length > 0 && (
            <section>
              <h2 className="section-label mb-3">Módulos</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {modules.map((m) => (
                  <ContentCard
                    key={m.slug}
                    module={m}
                    sizes="(max-width: 640px) 47vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 300px"
                  />
                ))}
              </div>
            </section>
          )}
          {trainings.length > 0 && (
            <section>
              <h2 className="mb-3 section-label">
                Treinamentos
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {trainings.map((t) => (
                  <TrainingCard key={t!.slug} training={t!} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
