import Image from "next/image";
import { Section, C } from "./landing-ui";

const LIST = [
  "Sem edição",
  "Sem código",
  "Sem prompt escrito do zero",
  "Sem ficar pulando entre tutoriais tentando descobrir o que fazer",
];

export function LandingNoAi() {
  return (
    <Section tone="light">
      <div className="mx-auto max-w-[42rem]">
        <p className="text-xl font-semibold" style={{ color: "var(--muted)" }}>
          &ldquo;Não sei usar IA ou editar. Só tenho meu celular.&rdquo;
        </p>
        <p
          className="mt-3 text-4xl font-bold tracking-[-0.02em] sm:text-5xl"
          style={{ color: C.brand }}
        >
          Nem precisa.
        </p>
        <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Você continua fazendo o que já sabe: tira a foto do imóvel. A IMOVIX ajuda a
          transformar essa foto em algo muito mais apresentável.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-[820px] overflow-hidden rounded-2xl border border-[color:var(--hairline)]">
        <Image
          src="/landing/antes-depois-terreno.jpg"
          alt="Antes e depois: foto comum de um lote no celular virando uma apresentação com a metragem destacada"
          width={1400}
          height={788}
          className="h-auto w-full"
        />
      </div>

      <ul className="mx-auto mt-8 flex max-w-[42rem] flex-wrap justify-center gap-2">
        {LIST.map((l) => (
          <li
            key={l}
            className="rounded-full border border-[color:var(--hairline)] px-3.5 py-1.5 text-sm"
            style={{ color: "var(--muted)" }}
          >
            {l}
          </li>
        ))}
      </ul>
    </Section>
  );
}
