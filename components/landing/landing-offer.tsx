import { Check, Gift, Lock, ArrowRight, Sparkles } from "lucide-react";
import { PRICE, OFFER, BONUSES, VALUE_SUMMARY, COMPARISON } from "@/lib/product";
import { Section, SectionHead, Cta, C } from "./landing-ui";

const KEY_ITEMS = [
  "Mais de 20 modelos de criação",
  "Prompts profissionais para imagens e vídeos",
  "Assistente para pedidos fora do padrão",
  "Histórico e favoritos",
  "Novos modelos e atualizações incluídas",
  "Acesso vitalício à plataforma",
];

const TRUST = ["Acesso imediato", "Atualizações incluídas", "Suporte nos primeiros passos"];

export function LandingOffer() {
  return (
    <Section tone="light" id="oferta">
      <SectionHead
        kicker="Uma conta que não fecha"
        title="Quanto custaria contratar alguém para criar cada vídeo do seu imóvel?"
        lead="Um único vídeo editado profissionalmente pode custar mais do que o acesso completo à IMOVIX. Aqui você cria quantos conteúdos quiser, no seu ritmo."
      />

      <div className="relative mx-auto mt-16 max-w-[880px]">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-md"
            style={{ background: C.brand }}
          >
            <Sparkles className="size-3.5" strokeWidth={2.25} />
            Oferta de lançamento
          </span>
        </div>

        <div
          className="overflow-hidden rounded-[28px] border shadow-[0_30px_70px_-30px_rgba(25,24,23,0.25)]"
          style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
        >
          <p
            className="border-b px-6 py-3 text-center text-sm font-medium sm:px-10"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-2)", color: "var(--muted)" }}
          >
            Você poderia gastar esse valor em{" "}
            <span className="font-semibold" style={{ color: C.brand }}>
              um único vídeo
            </span>
            . Aqui você cria quantos quiser.
          </p>

          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-[38rem] text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.brand }}>
                Acesso completo IMOVIX
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-[-0.01em] sm:text-3xl">IMOVIX PRO</h3>
              <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: "var(--muted)" }}>
                Tudo que você precisa para transformar fotos comuns de imóveis em conteúdos que
                chamam atenção e ajudam você a vender mais.
              </p>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
              <div
                className="order-1 rounded-2xl p-6 text-center sm:p-8 lg:order-2"
                style={{ background: "var(--surface-2)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>
                  Valor de tudo separadamente
                </p>
                <p className="mt-1.5 text-lg font-medium line-through" style={{ color: "var(--muted)" }}>
                  {PRICE.anchor}
                </p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.brand }}>
                  Por apenas
                </p>
                <div className="mt-1 flex items-end justify-center gap-2">
                  <span className="text-5xl font-extrabold tracking-[-0.02em] sm:text-6xl">
                    {PRICE.display}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium" style={{ color: "var(--muted)" }}>
                  {PRICE.model} · acesso vitalício
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: C.greenSoft, color: C.green }}
                >
                  Você economiza {PRICE.savings}
                </span>

                <div
                  className="mt-6 rounded-xl border p-4 text-left text-sm"
                  style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
                >
                  {VALUE_SUMMARY.map((v) => (
                    <div key={v.label} className="flex items-center justify-between py-1">
                      <span style={{ color: "var(--muted)" }}>{v.label}</span>
                      <span>{v.value}</span>
                    </div>
                  ))}
                  <div
                    className="mt-1 flex items-center justify-between border-t pt-2 text-sm font-semibold"
                    style={{ borderColor: "var(--hairline)" }}
                  >
                    <span>Valor total</span>
                    <span className="line-through" style={{ color: "var(--muted)" }}>
                      {PRICE.anchor}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-base font-bold">
                    <span>Hoje</span>
                    <span style={{ color: C.brand }}>{PRICE.display}</span>
                  </div>
                </div>

                <Cta href="/app" className="mt-7 w-full !py-4 !text-[15px] sm:!text-base">
                  {OFFER.cta}
                  <ArrowRight className="size-4" />
                </Cta>

                <p
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  <Lock className="size-3.5" strokeWidth={2.25} />
                  Pagamento seguro · Acesso imediato
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {OFFER.reassurance.join(" · ")}
                </p>

                <div
                  className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-5 text-xs"
                  style={{ borderColor: "var(--hairline)", color: "var(--muted)" }}
                >
                  {TRUST.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5">
                      <Check className="size-3.5" style={{ color: C.green }} strokeWidth={2.5} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-2 text-left lg:order-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
                  Tudo que você recebe
                </p>
                <ul className="mt-4 grid gap-2.5">
                  {KEY_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: C.greenSoft }}
                      >
                        <Check className="size-3" style={{ color: C.green }} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p
                  className="mt-8 text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--muted)" }}
                >
                  E você ainda recebe de bônus
                </p>
                <div className="mt-4 grid gap-3">
                  {BONUSES.map((b) => (
                    <div
                      key={b.title}
                      className="flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--hairline-strong)]"
                      style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "rgba(232,106,36,0.1)" }}
                        >
                          <Gift className="size-4" style={{ color: C.brand }} strokeWidth={2} />
                        </span>
                        <div>
                          <p className="text-sm font-medium leading-snug">{b.title}</p>
                          <p className="text-xs line-through" style={{ color: "var(--muted)" }}>
                            {b.value}
                          </p>
                        </div>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                        style={{ background: C.greenSoft, color: C.green }}
                      >
                        Grátis
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 border-t pt-8 sm:grid-cols-2" style={{ borderColor: "var(--hairline)" }}>
              <div className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--hairline)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
                  {COMPARISON.competitor.label}
                </p>
                <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>
                  {COMPARISON.competitor.value}
                </p>
              </div>
              <div className="rounded-xl border-2 p-4 text-center" style={{ borderColor: C.brand }}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: C.brand }}>
                  {COMPARISON.imovix.label}
                </p>
                <p className="mt-1 text-lg font-bold">{COMPARISON.imovix.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
