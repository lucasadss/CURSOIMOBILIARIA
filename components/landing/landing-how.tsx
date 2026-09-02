import { Section, SectionHead, Card, ImpactLine, C } from "./landing-ui";

const STEPS = [
  {
    title: "Escolha o que quer criar",
    body: "Quer mostrar uma casa em um terreno? Animar uma metragem? Criar um voo? Mobiliar um cômodo? Escolha o modelo.",
  },
  {
    title: "Personalize sem termos técnicos",
    body: "Você responde perguntas simples sobre o resultado que quer. Nada de aprender engenharia de prompt.",
  },
  {
    title: "Receba o comando pronto",
    body: "A IMOVIX monta a instrução completa por trás.",
  },
  {
    title: "Gere o resultado",
    body: "Copie, cole e transforme a sua foto.",
  },
];

export function LandingHow() {
  return (
    <Section tone="dark" id="como-funciona">
      <SectionHead kicker="Como funciona" title="Da foto ao conteúdo em poucos passos" />

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <Card key={s.title} className="!p-7">
            <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--muted)" }}>
              Etapa {i + 1}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {s.body}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <ImpactLine>
          A parte difícil fica com <span style={{ color: C.brand }}>a plataforma</span>.
        </ImpactLine>
      </div>
    </Section>
  );
}
