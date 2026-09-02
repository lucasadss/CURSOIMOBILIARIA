import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getModuleBySlug, toSummary } from "@/lib/modules";
import { moduleCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { Section, SectionHead, C } from "./landing-ui";

const ITEMS = [
  { slug: "casa-em-terreno", name: "Casa em Terreno", line: "Mostre como aquele lote pode ficar depois de construído." },
  { slug: "metragem-do-terreno", name: "Metragem do Terreno", line: "Destaque visualmente os limites e a área do imóvel." },
  { slug: "mobiliando-comodos", name: "Mobiliando Cômodos", line: "Transforme um ambiente vazio em uma apresentação mais atraente." },
  { slug: "antes-e-depois-geral", name: "Antes e Depois", line: "Mostre a transformação de um jeito impossível de ignorar." },
  { slug: "voo-de-drone", name: "Voo de Drone", line: "Crie movimentos que normalmente exigiriam drone, operador e edição." },
  { slug: "timelapse-de-construcao", name: "Timelapse", line: "Mostre uma construção acontecendo em segundos." },
];

export function LandingExamples() {
  return (
    <Section tone="dark" id="exemplos">
      <SectionHead
        title={
          <>
            Uma foto. Mais de 20 formas de{" "}
            <span style={{ color: C.brand }}>chamar atenção</span> para o imóvel.
          </>
        }
        lead="Terreno, obra, fachada, apartamento, casa pronta ou ambiente vazio. Escolha o resultado que quer criar e use a mesma foto para produzir conteúdos completamente diferentes."
      />

      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ITEMS.map((item) => {
          const m = getModuleBySlug(item.slug);
          const cover = m ? moduleCover(toSummary(m)) : null;
          return (
            <div key={item.slug} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
              <div className="overflow-hidden rounded-2xl border border-[color:var(--hairline)]">
                <div className="relative aspect-[4/3]">
                  {cover ? (
                    <CoverImage cover={cover} seed={item.slug} sizes="(max-width: 640px) 78vw, 340px" showSceneLabel={false} />
                  ) : (
                    <div className="size-full bg-[var(--surface-2)]" />
                  )}
                </div>
              </div>
              <p className="mt-3 text-base font-semibold">{item.name}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {item.line}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/app/explorar"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: C.brand }}
      >
        Ver todas as possibilidades
        <ArrowRight className="size-4" />
      </Link>
    </Section>
  );
}
