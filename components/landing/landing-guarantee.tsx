import { Check, ShieldCheck } from "lucide-react";
import { Section, C } from "./landing-ui";

const POINTS = ["Reembolso de 100%", "Sem burocracia", "Você decide com calma"];

export function LandingGuarantee() {
  return (
    <Section tone="light">
      <div className="mx-auto max-w-[40rem]">
        <div
          className="mx-auto flex size-20 items-center justify-center rounded-full"
          style={{ background: "rgba(232,106,36,0.1)" }}
        >
          <ShieldCheck className="size-9" style={{ color: C.brand }} strokeWidth={1.75} />
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: C.brand }}>
          Risco zero
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.01em] sm:text-[1.9rem]">
          Garantia incondicional de 7 dias
        </h2>
        <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Entre, explore os modelos e teste com as fotos dos seus imóveis. Se nos primeiros 7
          dias você achar que a IMOVIX não é para você, peça o reembolso e devolvemos 100% do
          valor. Sem formulário longo e sem precisar justificar.
        </p>

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          style={{ color: "var(--muted)" }}
        >
          {POINTS.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5">
              <Check className="size-4 shrink-0" style={{ color: C.green }} strokeWidth={2.5} />
              {p}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
