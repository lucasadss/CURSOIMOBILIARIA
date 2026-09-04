import {
  ArrowRight,
  Check,
  Gift,
  Infinity as InfinityIcon,
  LifeBuoy,
  Lock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PRICE, OFFER, BONUSES } from "@/lib/product";
import { Section, Cta, Wordmark, C } from "./landing-ui";

const INCLUDES = [
  "Plataforma IMOVIX completa, com mais de 20 modelos",
  "Prompts profissionais para imagens e vídeos",
  "Assistente para pedidos fora do padrão",
];

const TRUST = [
  { icon: InfinityIcon, label: "Acesso vitalício ao material" },
  { icon: RefreshCw, label: "Atualizações incluídas" },
  { icon: LifeBuoy, label: "Suporte nos primeiros passos" },
];

export function LandingOffer() {
  return (
    <Section
      tone="dark"
      id="oferta"
      className="border-y border-[color:var(--hairline-strong)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-[480px]">
        <div
          className="overflow-hidden rounded-3xl border shadow-[0_40px_90px_-40px_rgba(0,0,0,0.65)]"
          style={{ borderColor: "var(--hairline)", background: "#171717" }}
        >
          <div className="h-1 w-full" style={{ background: C.brand }} />

          <div
            className="px-6 py-6 text-center sm:px-8"
            style={{ background: "linear-gradient(180deg, rgba(232,106,36,0.12), rgba(232,106,36,0))" }}
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ background: "rgba(232,106,36,0.16)", color: C.brand }}
            >
              <Sparkles className="size-3" strokeWidth={2.25} />
              Oferta de lançamento
            </span>
            <Wordmark className="mx-auto mt-4 h-8 sm:h-9" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--muted)" }}>
              Acesso completo à plataforma + os 3 bônus
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
              Você poderia gastar esse valor em um único vídeo. Aqui você cria quantos quiser.
            </p>

            <ul className="mt-5">
              {INCLUDES.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <Check className="size-4 shrink-0" style={{ color: C.green }} strokeWidth={2.5} />
                  <span className="flex-1">{label}</span>
                </li>
              ))}

              {BONUSES.map((b) => (
                <li
                  key={b.title}
                  className="flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <Gift className="size-4 shrink-0" style={{ color: C.brand }} strokeWidth={2} />
                  <span className="flex-1">
                    {b.title}
                    <span
                      className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]"
                      style={{ background: C.greenSoft, color: C.green }}
                    >
                      Grátis
                    </span>
                  </span>
                  <span className="shrink-0 text-xs line-through" style={{ color: "var(--muted)" }}>
                    {b.value}
                  </span>
                </li>
              ))}

              {TRUST.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
                  style={{ borderColor: "var(--hairline)" }}
                >
                  <Icon className="size-4 shrink-0" style={{ color: C.green }} strokeWidth={2} />
                  <span className="flex-1" style={{ color: "var(--muted)" }}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-6 text-center" style={{ borderColor: "var(--hairline)" }}>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                De <span className="line-through">{PRICE.anchor}</span>
              </p>
              <p className="mx-auto mt-1 max-w-[20rem] text-sm" style={{ color: "var(--muted)" }}>
                Hoje você leva tudo isso por apenas
              </p>
              <p className="mt-2 text-[44px] font-extrabold leading-none tracking-[-0.02em] sm:text-[52px]">
                {PRICE.display}
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                {PRICE.model} · acesso vitalício
              </p>

              <span
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{ background: C.greenSoft, color: C.green }}
              >
                Economize {PRICE.savings}
              </span>

              <Cta href="/app" className="mt-5 w-full !py-4 !text-base">
                {OFFER.cta}
                <ArrowRight className="size-4" />
              </Cta>

              <p
                className="mt-3 flex items-center justify-center gap-1.5 text-xs"
                style={{ color: "var(--muted)" }}
              >
                <Lock className="size-3.5" strokeWidth={2.25} />
                Pagamento seguro · Acesso imediato
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
