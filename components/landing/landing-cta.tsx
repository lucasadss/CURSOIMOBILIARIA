import { OFFER } from "@/lib/product";
import { Section, Cta } from "./landing-ui";

export function LandingCta() {
  return (
    <Section tone="dark" className="!py-24 text-center">
      <h2 className="mx-auto max-w-[32rem] text-balance text-2xl font-bold leading-tight sm:text-[2rem]">
        A foto você já tem. Agora faça ela trabalhar muito mais pelo imóvel.
      </h2>
      <p className="mx-auto mt-4 max-w-[34rem] text-base leading-relaxed" style={{ color: "var(--muted)" }}>
        Pare de depender só de fotos paradas para apresentar o seu trabalho. Use a IMOVIX
        para transformar o material que você já tem em algo muito mais interessante de
        mostrar.
      </p>
      <div className="mt-8">
        <Cta href="/app" className="!py-4 !text-base">
          {OFFER.cta}
        </Cta>
      </div>
      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        Acesso imediato • pagamento único • sem mensalidade
      </p>
    </Section>
  );
}
