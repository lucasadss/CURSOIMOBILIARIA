import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, SectionHead, C, Hl } from "./landing-ui";

const BIG = [
  { file: "exemplo-possibilidade-de-um-terreno", name: "Possibilidade de um terreno" },
  { file: "exemplo-construcao-do-zero", name: "Construção do zero" },
  { file: "exemplo-por-dentro-da-casa", name: "Por dentro da casa" },
  { file: "exemplo-antes-e-depois", name: "Antes e depois" },
];

const SMALL = [
  { file: "exemplo-construcao-completa", name: "Construção completa" },
  { file: "exemplo-mobiliando-comodos", name: "Mobiliando cômodos" },
  { file: "exemplo-reforma-interior", name: "Reforma de interior" },
];

function ExampleCard({
  file,
  name,
  small,
}: {
  file: string;
  name: string;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[color:var(--hairline)]",
        small ? "aspect-square" : "aspect-[4/5]",
      )}
    >
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={`/landing/${file}.jpg`}
      >
        <source src={`/landing/${file}.mp4`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className={cn("font-semibold text-white", small ? "text-xs" : "text-sm")}>{name}</p>
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
          <ExampleCard key={c.file} {...c} />
        ))}
      </div>
      <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {SMALL.map((c) => (
          <ExampleCard key={c.file} {...c} small />
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
