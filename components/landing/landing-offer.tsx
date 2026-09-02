import { Check } from "lucide-react";
import { PRICE, OFFER } from "@/lib/product";
import { Section, SectionHead, Cta, C } from "./landing-ui";

const KEY_ITEMS = [
  "Mais de 20 modelos de criação",
  "Prompts para imagens e vídeos",
  "Assistente para pedidos fora do padrão",
  "Treinamento rápido dentro da plataforma",
  "Histórico e favoritos",
  "Atualizações incluídas",
  "Suporte nos primeiros passos",
  "Acesso vitalício",
];

export function LandingOffer() {
  return (
    <Section tone="light" id="oferta">
      <SectionHead
        align="center"
        title="Quanto custa depender de outra pessoa para cada vídeo?"
        lead="Um único vídeo editado profissionalmente pode custar muito mais do que o acesso inteiro à IMOVIX. Aqui você cria quantas ideias quiser usando a plataforma como apoio."
      />

      <div className="mx-auto mt-12 max-w-[640px] rounded-2xl border border-[color:var(--hairline)] bg-[var(--surface)] p-8 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
          IMOVIX, acesso completo
        </p>

        <div className="mt-5 flex items-end justify-center gap-2">
          <span className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
            {PRICE.display}
          </span>
          <span className="pb-1 text-sm" style={{ color: "var(--muted)" }}>
            {PRICE.model}
          </span>
        </div>

        <ul className="mx-auto mt-7 grid w-fit gap-2.5 text-left">
          {KEY_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm">
              <Check className="size-4 shrink-0" style={{ color: C.olive }} strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>

        <Cta href="/app" className="mt-8 w-full !py-4 !text-base">
          {OFFER.cta}
        </Cta>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--muted)" }}>
          {OFFER.reassurance.join(" • ")}
        </p>
      </div>
    </Section>
  );
}
