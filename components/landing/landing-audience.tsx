import { Section, SectionHead, Card } from "./landing-ui";

const WHO = [
  {
    title: "Corretores",
    body: "Querem apresentar melhor os imóveis sem depender de edição.",
  },
  {
    title: "Imobiliárias",
    body: "Precisam produzir mais conteúdo sem aumentar a operação.",
  },
  {
    title: "Autônomos",
    body: "Fazem tudo sozinhos e não podem perder horas em cada publicação.",
  },
  {
    title: "Lançamentos e empreendimentos",
    body: "Precisam transformar plantas, terrenos e imagens em apresentações mais interessantes.",
  },
];

export function LandingAudience() {
  return (
    <Section tone="light">
      <SectionHead
        title={
          <>
            Feita para quem vende imóvel.
            <br />
            Não para quem quer virar especialista em IA.
          </>
        }
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHO.map((w) => (
          <Card key={w.title} className="!p-6">
            <h3 className="text-base font-semibold">{w.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {w.body}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
