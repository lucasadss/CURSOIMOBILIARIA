import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { TRAININGS } from "@/lib/trainings";
import { TrainingCard } from "@/components/training/training-card";

export const metadata: Metadata = {
  title: "Treinamentos",
};

export default function TreinamentosPage() {
  const materials = TRAININGS.flatMap((t) =>
    (t.materials ?? []).map((m) => ({ ...m, training: t.title, slug: t.slug })),
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-ink">Treinamentos</h1>
        <p className="mt-1 text-sm text-ink-muted">
          O método por trás dos módulos. Assista na ordem ou pule direto ao que
          precisa.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRAININGS.map((t) => (
          <TrainingCard key={t.slug} training={t} />
        ))}
      </div>

      <section id="materiais" className="mt-14 scroll-mt-20">
        <h2 className="mb-3 section-label">
          Materiais
        </h2>
        <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
          {materials.map((m, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-panel px-4 py-3 text-sm"
            >
              <FileText className="size-4 shrink-0 text-ink-faint" />
              <span className="text-ink">{m.label}</span>
              <span className="ml-auto text-2xs text-ink-faint">{m.training}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
