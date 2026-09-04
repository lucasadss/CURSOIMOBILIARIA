import Image from "next/image";
import { BONUSES } from "@/lib/product";
import { Section, SectionHead, C } from "./landing-ui";

export function LandingBonuses() {
  return (
    <Section tone="dark" id="bonus">
      <SectionHead kicker="Para turbinar seus resultados" title="Bônus exclusivos" />

      <div className="mx-auto mt-10 grid max-w-[860px] gap-5">
        {BONUSES.map((b) => (
          <div
            key={b.title}
            className="grid gap-5 rounded-2xl border p-4 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--hairline-strong)] sm:grid-cols-[260px_1fr] sm:items-center sm:p-5"
            style={{ borderColor: "var(--hairline)", background: "#171717" }}
          >
            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--hairline)" }}
            >
              <Image
                src={b.image}
                alt={b.title}
                width={1000}
                height={1000}
                className="h-auto w-full"
              />
            </div>

            <div>
              <span
                className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ background: "rgba(232,106,36,0.16)", color: C.brand }}
              >
                Bônus exclusivo
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-[-0.01em] sm:text-xl">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {b.description}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm">
                <span className="line-through" style={{ color: "var(--muted)" }}>
                  Valor {b.value}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: C.greenSoft, color: C.green }}
                >
                  Grátis
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
