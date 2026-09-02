import { getModuleBySlug, toSummary } from "@/lib/modules";
import { moduleCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { Section, SectionHead } from "./landing-ui";

const GALLERY = [
  "casa-em-terreno",
  "decoracao-de-interiores",
  "mobiliando-comodos",
  "metragem-do-terreno",
  "timelapse-de-construcao",
  "entrada-cinematografica",
];

export function LandingProof() {
  return (
    <Section tone="dark">
      <SectionHead
        title="Se o imóvel é bom, a apresentação precisa parecer boa também"
        lead="Uma fachada mal fotografada continua parecendo uma fachada mal fotografada. Um terreno vazio continua parecendo só um terreno vazio. Um cômodo vazio continua parecendo sem vida. Agora você cria novas formas de apresentar o mesmo imóvel e mostra melhor o que uma foto simples não transmite."
      />

      <p className="mt-10 text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
        Antes de explicar, mostre
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
        {GALLERY.map((slug) => {
          const m = getModuleBySlug(slug);
          const cover = m ? moduleCover(toSummary(m)) : null;
          return (
            <div key={slug} className="overflow-hidden rounded-xl border border-[color:var(--hairline)]">
              <div className="relative aspect-square">
                {cover ? (
                  <CoverImage cover={cover} seed={`proof-${slug}`} sizes="(max-width: 768px) 45vw, 360px" showSceneLabel={false} />
                ) : (
                  <div className="size-full bg-[var(--surface-2)]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs" style={{ color: "var(--muted)" }}>
        Exemplos de resultados possíveis com os modelos da plataforma.
      </p>
    </Section>
  );
}
