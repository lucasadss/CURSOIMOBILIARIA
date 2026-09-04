import { Check } from "lucide-react";
import { OFFER } from "@/lib/product";
import { Wordmark, Cta, Hl, C } from "./landing-ui";

const MICRO_BENEFITS = [
  "Sem edição complicada",
  "Sem precisar criar prompts",
  "Funciona no celular ou computador",
];

export function LandingHero() {
  return (
    <section
      style={{ background: C.bgDark, color: C.textLight }}
      className="px-5 pb-16 pt-8 text-center sm:px-8 sm:pb-20 sm:pt-10 md:pb-24 md:pt-14"
    >
      <div className="mx-auto w-full max-w-[850px]">
        <Wordmark className="mx-auto" />

        <h1 className="mt-10 text-balance text-[2rem] font-extrabold leading-[1.15] tracking-[-0.02em] sm:mt-12 sm:text-[2.75rem] md:mt-14 md:text-[3.25rem]">
          Venda mais transformando uma foto comum em um{" "}
          <Hl>vídeo que chama atenção e valoriza o imóvel</Hl>.
        </h1>

        <p
          className="mx-auto mt-5 max-w-[34rem] text-base font-normal leading-relaxed sm:mt-6 sm:text-lg"
          style={{ color: "var(--muted)" }}
        >
          Crie vídeos imobiliários com IA em poucos minutos, mesmo sem saber editar ou
          escrever prompts.
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-[300px] sm:mt-10 sm:max-w-[320px]">
          <div className="overflow-hidden rounded-2xl border border-[rgba(247,244,239,0.12)] bg-[#161616]">
            <video
              className="aspect-[9/16] w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/landing/hero-video-poster.jpg"
            >
              <source src="/landing/hero-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <Cta
          href="#oferta"
          className="mt-8 w-full !py-4 !text-base sm:mt-10 sm:w-fit sm:min-w-[320px] sm:max-w-[420px] sm:!py-5 sm:!text-lg"
        >
          {OFFER.ctaHero}
        </Cta>

        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs sm:mt-6 sm:text-sm"
          style={{ color: "var(--muted)" }}
        >
          {MICRO_BENEFITS.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
