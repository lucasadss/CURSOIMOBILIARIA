import { Check } from "lucide-react";
import { OFFER } from "@/lib/product";
import { Section, SectionHead, C } from "./landing-ui";

export function LandingIncluded() {
  return (
    <Section tone="dark">
      <SectionHead title="Tudo que você precisa para parar de depender de foto parada" />

      <ul className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {OFFER.includes.map((item) => (
          <li key={item} className="flex items-center justify-center gap-3 text-[0.95rem]">
            <Check className="size-4 shrink-0" style={{ color: C.olive }} strokeWidth={2.5} />
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
