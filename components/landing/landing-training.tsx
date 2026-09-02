import { Section, SectionHead } from "./landing-ui";

export function LandingTraining() {
  return (
    <Section tone="dark" id="treinamento">
      <SectionHead
        kicker="Treinamento"
        title="Nunca usou algo assim? Você não vai ficar perdido."
        lead="Dentro da IMOVIX existe um treinamento rápido mostrando o fluxo da plataforma, como criar imagens, como gerar vídeos e o que fazer quando quiser melhorar um resultado."
      />
      <p className="mx-auto mt-3 max-w-[44rem] text-sm" style={{ color: "var(--muted)" }}>
        Sem curso longo. Sem aula desnecessária. Só o que você precisa para começar.
      </p>

      <div className="mx-auto mt-10 max-w-[760px]">
        {/* screenshot placeholder — replace with a real shot of the members area */}
        <div className="overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-1.5 border-b border-[color:var(--hairline)] px-3 py-2">
            <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
            <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
            <span className="size-2 rounded-full bg-[color:var(--hairline-strong)]" />
          </div>
          <div className="flex aspect-[16/9] items-center justify-center">
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              Área de membros
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
