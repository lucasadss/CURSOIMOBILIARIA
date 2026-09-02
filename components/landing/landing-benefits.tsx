import { Clock, Laptop, Smartphone } from "lucide-react";
import { Section, SectionHead, C } from "./landing-ui";

const CARDS = [
  {
    icon: Clock,
    title: "Cabe na sua rotina",
    body: "Crie entre um atendimento e outro, sem transformar conteúdo em um segundo emprego.",
  },
  {
    icon: Laptop,
    title: "Sem depender de editor",
    body: "Você não precisa mandar cada ideia para outra pessoa e esperar dias para receber.",
  },
  {
    icon: Smartphone,
    title: "Celular ou computador",
    body: "Faça no dispositivo que você já usa. A tecnologia trabalha por trás.",
  },
];

export function LandingBenefits() {
  return (
    <Section tone="light">
      <SectionHead
        kicker="Simples de aplicar"
        title="Feito para quem não tem tempo a perder com ferramentas complicadas"
        lead="Mais praticidade para quem divide o dia entre divulgação, visitas e atendimento."
      />

      <div className="relative mx-auto mt-12 max-w-[760px] overflow-hidden rounded-2xl border border-[color:var(--hairline)]">
        <video
          className="aspect-video w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/landing/routine-demo.mp4" type="video/mp4" />
        </video>
        <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Antes
        </span>
        <span
          className="absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
          style={{ background: C.brand }}
        >
          Depois
        </span>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.title}>
            <c.icon className="mx-auto size-5" style={{ color: C.brand }} strokeWidth={1.75} />
            <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
