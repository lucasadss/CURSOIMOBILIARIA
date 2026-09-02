import { Section, SectionHead } from "./landing-ui";

const CARDS = [
  {
    label: "Escolha o resultado",
    body: "Mais de 20 modelos organizados para diferentes situações do mercado imobiliário.",
  },
  {
    label: "Personalize",
    body: "Campos simples substituem horas tentando descobrir o prompt certo.",
  },
  {
    label: "Copie o comando",
    body: "A plataforma entrega a instrução completa pronta para uso.",
  },
  {
    label: "Volte quando quiser",
    body: "Favoritos, histórico e ferramentas ficam organizados dentro da sua conta.",
  },
];

/** Clean framed placeholder until real screenshots are dropped in. */
function ShotFrame({ label }: { label: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[var(--surface-2)]">
      <div className="flex items-center gap-1.5 border-b border-[color:var(--hairline)] px-3 py-2">
        <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
        <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
        <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
      </div>
      <div className="flex aspect-[16/10] items-center justify-center">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function LandingPlatform() {
  return (
    <Section tone="dark">
      <SectionHead
        title="Não é um curso ensinando você a fazer tudo na mão"
        lead="É uma plataforma feita para resolver isso por você. Ferramentas, passo a passo e treinamento no mesmo lugar."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {CARDS.map((c) => (
          <div key={c.label}>
            <ShotFrame label={c.label} />
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              <span className="font-semibold text-[#F7F4EF]">{c.label}.</span> {c.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
