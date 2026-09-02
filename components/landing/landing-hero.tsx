import { Check } from "lucide-react";
import { HERO } from "@/lib/assets";
import { OFFER } from "@/lib/product";
import { Wordmark, Cta, Hl, C } from "./landing-ui";

const BULLETS = [
  "Não precisa saber editar",
  "Não precisa escrever prompts",
  "Não precisa contratar um editor para cada vídeo",
  "Funciona pelo celular ou computador",
];

export function LandingHero() {
  return (
    <section
      style={{ background: C.bgDark, color: C.textLight }}
      className="px-5 pb-24 pt-6 sm:px-8 md:pb-28"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Wordmark />

        <div className="mt-16 grid items-center gap-14 md:mt-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-balance text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] md:text-[3rem]">
              Venda mais transformando uma foto comum em um{" "}
              <Hl>vídeo que chama atenção e valoriza o imóvel</Hl>.
            </h1>

            <p className="mt-5 text-lg font-medium leading-snug text-[#F7F4EF]">
              Mesmo sem saber editar.<br />
              Mesmo sem entender de IA.<br />
              Mesmo sem passar horas aprendendo ferramentas.
            </p>

            <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-[#A8A39B]">
              Escolha o que quer criar, personalize em poucos passos e receba o comando
              pronto para transformar suas fotos em conteúdos muito mais profissionais.
            </p>

            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-[#F7F4EF]">
                  <Check className="size-4 shrink-0" style={{ color: C.olive }} strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Cta href="#oferta">{OFFER.ctaHero}</Cta>
              <Cta href="#exemplos" variant="ghost">
                Ver exemplos
              </Cta>
            </div>

            <p className="mt-5 text-xs text-[#A8A39B]">
              Pagamento único • acesso imediato • sem mensalidade
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[380px] lg:mx-0">
            <div className="overflow-hidden rounded-2xl border border-[rgba(247,244,239,0.12)] bg-[#161616]">
              <video
                className="aspect-[9/16] w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={HERO.image ?? undefined}
              >
                <source src="/landing/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="mt-3 text-xs text-[#A8A39B]">
              Foto comum de um lote, apresentada como vídeo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
