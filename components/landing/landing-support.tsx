import { Section } from "./landing-ui";

export function LandingSupport() {
  return (
    <Section tone="dark">
      <div className="mx-auto max-w-[42rem]">
        <h2 className="text-2xl font-semibold sm:text-[1.75rem]">
          Se travar, você não precisa descobrir sozinho.
        </h2>
        <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Você recebe suporte para conseguir avançar nos primeiros passos e usar a
          plataforma com segurança.
        </p>
      </div>
    </Section>
  );
}
