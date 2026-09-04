import { Gift } from "lucide-react";
import { BONUSES } from "@/lib/product";
import { Section, SectionHead, C } from "./landing-ui";

export function LandingBonuses() {
  return (
    <Section tone="dark" id="bonus">
      <SectionHead
        kicker="Para turbinar seus resultados"
        title="Bônus exclusivos"
      />

      <div className="mx-auto mt-10 grid max-w-[820px] gap-5">
        {BONUSES.map((b) => (
          <div
            key={b.title}
            className="grid gap-5 rounded-2xl border p-5 text-left transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--hairline-strong)] sm:grid-cols-[210px_1fr] sm:items-center sm:p-6"
            style={{ borderColor: "var(--hairline)", background: "#171717" }}
          >
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-xl px-4 py-6 text-center"
              style={{
                background:
                  "linear-gradient(160deg, rgba(232,106,36,0.14), rgba(232,106,36,0.03))",
              }}
            >
              <span
                className="flex size-12 items-center justify-center rounded-full"
                style={{ background: "rgba(232,106,36,0.18)" }}
              >
                <Gift className="size-6" style={{ color: C.brand }} strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs line-through" style={{ color: "var(--muted)" }}>
                  Valor {b.value}
                </p>
                <p className="text-sm font-extrabold tracking-[0.06em]" style={{ color: C.green }}>
                  GRÁTIS
                </p>
              </div>
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
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
