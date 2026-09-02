import { X, Check } from "lucide-react";
import { Section, SectionHead, ImpactLine, C } from "./landing-ui";

const WITHOUT = [
  "Pesquisar tutorial",
  "Testar ferramenta",
  "Escrever prompt",
  "Errar",
  "Tentar de novo",
  "Editar",
  "Corrigir",
  "Perder tempo",
];

const WITH = ["Escolher", "Personalizar", "Copiar", "Gerar"];

export function LandingCompare() {
  return (
    <Section tone="light">
      <SectionHead title="Você pode continuar fazendo tudo do jeito difícil" />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <div
          className="rounded-2xl border p-7"
          style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
            Sem IMOVIX
          </p>
          <ul className="mt-5 space-y-2.5 text-sm" style={{ color: "var(--muted)" }}>
            {WITHOUT.map((w) => (
              <li key={w} className="flex items-center justify-center gap-2.5">
                <X className="size-4 shrink-0" style={{ color: "var(--muted)" }} />
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-2xl border p-7"
          style={{ borderColor: C.brand, background: "var(--surface)" }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: C.brand }}>
            Com IMOVIX
          </p>
          <ul className="mt-5 space-y-2.5 text-[0.95rem] font-medium">
            {WITH.map((w) => (
              <li key={w} className="flex items-center justify-center gap-2.5">
                <Check className="size-4 shrink-0" style={{ color: C.olive }} strokeWidth={2.5} />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <ImpactLine>
          Menos ferramenta. Menos tentativa.{" "}
          <span style={{ color: C.brand }}>Mais tempo para vender.</span>
        </ImpactLine>
      </div>
    </Section>
  );
}
