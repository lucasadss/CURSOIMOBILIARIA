import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleBySlug, toSummary } from "@/lib/modules";
import { moduleCover } from "@/lib/assets";
import { CoverImage } from "@/components/common/cover-image";
import { Section, SectionHead, C, Hl } from "./landing-ui";

const BIG = [
  { slug: "casa-em-terreno", name: "Casa em Terreno", line: "Mostre como aquele lote pode ficar depois de construído." },
  { slug: "metragem-do-terreno", name: "Metragem do Terreno", line: "Destaque visualmente os limites e a área do imóvel." },
  { slug: "mobiliando-comodos", name: "Mobiliando Cômodos", line: "Transforme um ambiente vazio em uma apresentação mais atraente." },
  { slug: "antes-e-depois-geral", name: "Antes e Depois", line: "Mostre a transformação de um jeito impossível de ignorar." },
];

const SMALL = [
  { slug: "voo-de-drone", name: "Voo de Drone" },
  { slug: "timelapse-de-construcao", name: "Timelapse" },
  { slug: "decoracao-de-interiores", name: "Decoração" },
];

/**
 * Vídeos de exemplo. Coloque o arquivo .mp4 (H.264, mudo, curto e em loop)
 * em /public/landing/ e descomente a linha do slug correspondente aqui.
 * Enquanto o slug não estiver listado, o card continua mostrando a imagem.
 */
const VIDEOS: Record<string, string> = {
  // "casa-em-terreno": "/landing/exemplo-casa-em-terreno.mp4",
  // "metragem-do-terreno": "/landing/exemplo-metragem-do-terreno.mp4",
  // "mobiliando-comodos": "/landing/exemplo-mobiliando-comodos.mp4",
  // "antes-e-depois-geral": "/landing/exemplo-antes-e-depois-geral.mp4",
  // "voo-de-drone": "/landing/exemplo-voo-de-drone.mp4",
  // "timelapse-de-construcao": "/landing/exemplo-timelapse-de-construcao.mp4",
  // "decoracao-de-interiores": "/landing/exemplo-decoracao-de-interiores.mp4",
};

function ExampleCard({
  slug,
  name,
  line,
  small,
}: {
  slug: string;
  name: string;
  line?: string;
  small?: boolean;
}) {
  const m = getModuleBySlug(slug);
  const cover = m ? moduleCover(toSummary(m)) : null;
  const video = VIDEOS[slug];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[color:var(--hairline)]",
        small ? "aspect-square" : "aspect-[4/5]",
      )}
    >
      {video ? (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={cover?.src}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : cover ? (
        <CoverImage
          cover={cover}
          seed={slug}
          sizes={small ? "(max-width: 768px) 40vw, 220px" : "(max-width: 768px) 45vw, 340px"}
          showSceneLabel={false}
        />
      ) : (
        <div className="size-full" style={{ background: "var(--surface-2)" }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5" />
      {video ? null : (
        <span
          className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 group-hover:scale-105"
          style={{ background: C.brand }}
        >
          <Play className="size-4 translate-x-0.5" fill="currentColor" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className={cn("font-semibold text-white", small ? "text-xs" : "text-sm")}>{name}</p>
        {!small && line ? (
          <p className="mt-1 line-clamp-2 text-xs text-white/70">{line}</p>
        ) : null}
      </div>
    </div>
  );
}

export function LandingExamples() {
  return (
    <Section tone="dark" id="exemplos">
      <SectionHead
        title={
          <>
            Uma foto. Mais de 20 formas de <Hl>chamar atenção</Hl> para o imóvel.
          </>
        }
        lead="Terreno, obra, fachada, apartamento, casa pronta ou ambiente vazio. Escolha o resultado que quer criar e use a mesma foto para produzir conteúdos completamente diferentes."
      />

      <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4">
        {BIG.map((c) => (
          <ExampleCard key={c.slug} {...c} />
        ))}
      </div>
      <div className="mx-auto mt-4 grid max-w-3xl grid-cols-4 gap-4">
        {SMALL.map((c) => (
          <ExampleCard key={c.slug} {...c} small />
        ))}
        <div
          className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed p-2 text-center"
          style={{ borderColor: "var(--hairline-strong)" }}
        >
          <span className="text-2xl font-bold" style={{ color: C.brand }}>
            +20
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase leading-tight text-white/80">
            Estilos de vídeos e fotos
          </span>
        </div>
      </div>

      <Link
        href="/app/explorar"
        className="mx-auto mt-8 flex w-fit items-center gap-1.5 text-sm font-semibold"
        style={{ color: C.brand }}
      >
        Ver todas as possibilidades
        <ArrowRight className="size-4" />
      </Link>
    </Section>
  );
}
