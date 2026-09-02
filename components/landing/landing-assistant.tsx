import { ArrowDown } from "lucide-react";
import { Section, SectionHead, C } from "./landing-ui";

export function LandingAssistant() {
  return (
    <Section tone="dark">
      <SectionHead
        title="E quando você quiser criar algo diferente?"
        lead="Descreva o que quer fazer. O assistente ajuda a transformar a sua ideia em uma instrução pronta para criação."
      />

      <div className="mx-auto mt-10 max-w-[560px] text-left">
        <div
          className="rounded-2xl border p-5 text-sm"
          style={{ borderColor: "var(--hairline)", background: "var(--surface)" }}
        >
          <p className="italic" style={{ color: "var(--muted)" }}>
            &ldquo;Quero criar um vídeo mostrando essa casa ao entardecer, com movimento
            de câmera suave.&rdquo;
          </p>
        </div>
        <div className="flex justify-center py-3">
          <ArrowDown className="size-5" style={{ color: C.brand }} />
        </div>
        <div
          className="rounded-2xl border p-5 text-sm font-medium"
          style={{ borderColor: C.brand, background: "var(--surface)" }}
        >
          A IMOVIX prepara a direção.
        </div>
      </div>
    </Section>
  );
}
