import { Section, SectionHead, ImpactLine, C } from "./landing-ui";

const HOURS = [
  "qual ferramenta usar",
  "como escrever prompt",
  "qual configuração escolher",
  "como animar a imagem",
  "como corrigir um resultado ruim",
];

export function LandingNotEditor() {
  return (
    <Section tone="light">
      <SectionHead
        title="Você não precisa virar editor para vender imóvel"
        lead="Seu trabalho é atender, visitar, captar imóvel, negociar e vender. Não passar horas no computador tentando descobrir:"
      />

      <ul className="mx-auto mt-6 flex max-w-[40rem] flex-wrap justify-center gap-2">
        {HOURS.map((h) => (
          <li
            key={h}
            className="rounded-full border border-[color:var(--hairline)] px-3.5 py-1.5 text-sm"
            style={{ color: "var(--muted)" }}
          >
            {h}
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-6 max-w-[40rem] text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        A IMOVIX foi criada justamente para tirar essa parte do seu caminho.
      </p>

      <div
        className="mt-10 rounded-2xl border p-8 text-center"
        style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
      >
        <ImpactLine>
          Você escolhe. <span style={{ color: C.brand }}>A IMOVIX prepara.</span> Você gera.
        </ImpactLine>
      </div>
    </Section>
  );
}
