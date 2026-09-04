import Image from "next/image";
import { AlertTriangle, ArrowRight, Ban, HeartCrack, ImageOff, TrendingDown } from "lucide-react";
import { OFFER } from "@/lib/product";
import { Section, Cta, C } from "./landing-ui";

const PROBLEMS = [
  {
    icon: ImageOff,
    title: "Sem movimento",
    body: "Fotos estáticas que ninguém para pra ver.",
  },
  {
    icon: TrendingDown,
    title: "Pouco envolventes",
    body: "Conteúdo genérico que não prende atenção.",
  },
  {
    icon: HeartCrack,
    title: "Nada virais",
    body: "Posts ignorados sem curtidas ou compartilhamentos.",
  },
  {
    icon: Ban,
    title: "E não vendem",
    body: "Imóvel parado sem gerar nenhuma comissão.",
  },
];

export function LandingProblem() {
  return (
    <Section tone="light">
      <div className="mx-auto max-w-[40rem] text-center">
        <h2 className="text-balance text-2xl font-bold leading-[1.2] tracking-[-0.01em] sm:text-3xl">
          Se seus posts ainda se parecem com esses...
        </h2>
        <p className="mt-1 text-balance text-2xl font-bold leading-[1.2] tracking-[-0.01em] sm:text-3xl" style={{ color: C.red }}>
          Seu concorrente agradece
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[1000px] gap-8 text-left lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--hairline)" }}
        >
          <Image
            src="/landing/exemplo-posts-comuns.jpg"
            alt="Prints de posts comuns de imóveis: fotos estáticas, sem edição, com pouco engajamento"
            width={506}
            height={300}
            className="h-auto w-full"
          />
        </div>

        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            O problema desse tipo de conteúdo:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
              >
                <span
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ background: C.redSoft }}
                >
                  <p.icon className="size-4" style={{ color: C.red }} strokeWidth={2} />
                </span>
                <h3 className="mt-3 text-sm font-bold">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-8 flex max-w-[1000px] items-start gap-3 rounded-xl border p-4 text-left text-sm leading-relaxed"
        style={{ background: C.redSoft, borderColor: "rgba(220,68,68,0.25)" }}
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0" style={{ color: C.red }} strokeWidth={2} />
        <p>
          Cada dia que você continua postando do mesmo jeito, seu concorrente publica mais um
          vídeo, chama atenção nas redes e atrai os clientes que poderiam ser seus.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1000px] flex-col items-center">
        <Cta href="#oferta" className="!py-4 !text-base">
          {OFFER.ctaHero}
          <ArrowRight className="size-4" />
        </Cta>
        <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
          Junte-se a +2.000 profissionais que já usam IA
        </p>
      </div>
    </Section>
  );
}
