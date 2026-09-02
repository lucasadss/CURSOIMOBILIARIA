import Image from "next/image";
import { Section, SectionHead } from "./landing-ui";

const ITEMS = [1, 2, 3, 4, 5];

export function LandingTestimonials() {
  // Duplicated so the CSS marquee loops seamlessly.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <Section tone="light">
      <SectionHead
        kicker="Depoimentos"
        title="Quem começa a usar entende rápido o porquê"
        lead="Porque deixa de ser aprender IA e vira simplesmente escolher o que quer criar."
      />

      <div className="ll-marquee mt-12 rounded-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="ll-marquee-track flex w-max gap-4">
          {loop.map((n, i) => (
            <div
              key={`${n}-${i}`}
              className="w-[280px] shrink-0 overflow-hidden rounded-2xl border border-[color:var(--hairline)] bg-[var(--surface)]"
            >
              <Image
                src={`/landing/depoimento-${n}.jpg`}
                alt="Depoimento de um profissional do mercado imobiliário"
                width={640}
                height={480}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
