import { ArrowRight, Bot, Check, GraduationCap, LayoutTemplate, Lock, MessageCircle, Sparkles } from "lucide-react";
import { PRICE, OFFER, BONUSES } from "@/lib/product";
import { Section, Cta, C } from "./landing-ui";

const QUICK_BENEFITS = ["Mais de 20 modelos", "Prompts profissionais", "Assistente de IA", "Atualizações incluídas"];

const BONUS_ICONS = [GraduationCap, LayoutTemplate, Bot, MessageCircle];

function OfferCta({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-[560px]">
        <Cta href="/app" className="w-full !py-4 !text-base sm:!py-5 sm:!text-lg">
          {OFFER.cta}
          <ArrowRight className="size-4" />
        </Cta>
      </div>
    </div>
  );
}

export function LandingOffer() {
  return (
    <Section tone="light" id="oferta">
      <p className="mx-auto max-w-[34rem] text-sm sm:text-base" style={{ color: "var(--muted)" }}>
        Você poderia gastar esse valor em{" "}
        <span className="font-semibold" style={{ color: C.brand }}>
          um único vídeo
        </span>
        . Aqui você cria quantos quiser.
      </p>

      <div className="relative mx-auto mt-10 max-w-[920px]">
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
          className="overflow-hidden rounded-[28px] border shadow-[0_40px_90px_-35px_rgba(25,24,23,0.28)]"
          style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
        >
          <div className="h-1.5 w-full" style={{ background: C.brand }} />

          <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
            <h3 className="text-2xl font-bold tracking-[-0.01em] sm:text-3xl">IMOVIX PRO</h3>
            <p className="mx-auto mt-3 max-w-[32rem] text-sm leading-relaxed sm:text-base" style={{ color: "var(--muted)" }}>
              Tudo que você precisa para transformar fotos de imóveis em vídeos que chamam
              atenção e ajudam você a vender mais.
            </p>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>
                Valor completo
              </p>
              <p className="mt-1 text-xl font-medium line-through" style={{ color: "var(--muted)" }}>
                {PRICE.anchor}
              </p>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em]" style={{ color: C.brand }}>
                Hoje por
              </p>
              <p className="mt-1 text-[64px] font-extrabold leading-none tracking-[-0.02em] sm:text-[76px]">
                {PRICE.display}
              </p>
              <p className="mt-3 text-sm font-medium" style={{ color: "var(--muted)" }}>
                {PRICE.model} · acesso vitalício, sem mensalidade
              </p>

              <span
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold"
                style={{ background: C.greenSoft, color: C.green }}
              >
                Economize {PRICE.savings}
              </span>
            </div>

            <OfferCta className="mt-9 sm:hidden" />

            <div className="mt-10 grid grid-cols-2 justify-items-center gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-7">
              {QUICK_BENEFITS.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <Check className="size-4 shrink-0" style={{ color: C.green }} strokeWidth={2.5} />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-12">
              <p className="text-lg font-bold uppercase tracking-[0.02em] sm:text-xl">
                E você ainda leva <span style={{ color: C.brand }}>4 bônus</span>
              </p>

              <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
                {BONUSES.map((b, i) => {
                  const Icon = BONUS_ICONS[i];
                  return (
                    <div
                      key={b.title}
                      className="flex flex-col gap-2.5 rounded-2xl border p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--hairline-strong)]"
                      style={{ borderColor: "var(--hairline)", background: "var(--surface-2)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "rgba(232,106,36,0.1)" }}
                        >
                          <Icon className="size-4" style={{ color: C.brand }} strokeWidth={2} />
                        </span>
                        <p className="text-sm font-semibold leading-tight">{b.title}</p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                        {b.description}
                      </p>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-xs line-through" style={{ color: "var(--muted)" }}>
                          {b.value}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]"
                          style={{ background: C.greenSoft, color: C.green }}
                        >
                          Grátis
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl p-6 sm:flex-row sm:gap-10"
              style={{ background: "rgba(232,106,36,0.06)" }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
                  Valor total do pacote
                </p>
                <p className="mt-1 text-2xl font-semibold line-through" style={{ color: "var(--muted)" }}>
                  {PRICE.anchor}
                </p>
              </div>
              <div className="hidden h-10 w-px sm:block" style={{ background: "var(--hairline-strong)" }} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: C.brand }}>
                  Hoje você leva tudo por
                </p>
                <p className="mt-1 text-3xl font-extrabold" style={{ color: C.brand }}>
                  {PRICE.display}
                </p>
              </div>
            </div>

            <OfferCta className="mt-10 hidden sm:block" />

            <p
              className="mt-5 flex items-center justify-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              <Lock className="size-3.5" strokeWidth={2.25} />
              Pagamento seguro · Acesso imediato
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {OFFER.reassurance.join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
