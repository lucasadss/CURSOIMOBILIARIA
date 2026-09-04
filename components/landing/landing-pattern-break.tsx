import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import { AutoplayVideo } from "./autoplay-video";
import { Section, SectionHead, Hl, C } from "./landing-ui";

export function LandingPatternBreak() {
  return (
    <Section tone="light">
      <SectionHead
        title={
          <>
            Qual tipo de material você acha que <Hl>mais impressiona?</Hl>
          </>
        }
      />

      <div className="mx-auto mt-10 grid max-w-[780px] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        {/* estática */}
        <div className="overflow-hidden rounded-xl border border-[color:var(--hairline)]">
          <div className="px-3 py-2 text-center">
            <span
              className="inline-block rounded-full px-3 py-1 text-[0.7rem] font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              Imagem estática comum
            </span>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="/landing/foto-comum-lote.jpg"
              alt="Foto comum de um lote, tirada da rua"
              fill
              sizes="(max-width: 640px) 90vw, 340px"
              className="object-cover"
            />
          </div>
        </div>

        {/* seta */}
        <span
          className="mx-auto flex size-8 items-center justify-center rounded-full text-white"
          style={{ background: C.brand }}
        >
          <ArrowRight className="size-4" />
        </span>

        {/* vídeo */}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: C.brand }}>
          <div className="px-3 py-2 text-center">
            <span
              className="inline-block rounded-full px-3 py-1 text-[0.7rem] font-semibold text-white"
              style={{ background: C.brand }}
            >
              Vídeo feito com IA e sem drone
            </span>
          </div>
          <div className="aspect-[4/3]">
            <AutoplayVideo className="size-full object-cover" src="/landing/comparison-video.mp4" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[600px] rounded-2xl border border-[color:var(--hairline)] bg-[var(--surface)] p-7 text-center">
        <span
          className="mx-auto flex size-9 items-center justify-center rounded-full"
          style={{ background: "rgba(232,106,36,0.12)", color: C.brand }}
        >
          <Eye className="size-4" />
        </span>
        <h3 className="mx-auto mt-4 max-w-md text-lg font-semibold leading-snug sm:text-xl">
          Se você escolheu o vídeo, <Hl>seu cliente também escolhe.</Hl>
        </h3>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Você não precisa dedicar horas para criar esse estilo de vídeo.
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Mesmo trabalhando sozinho e sem entender de IA, você consegue{" "}
          <b style={{ color: C.textDark }}>impressionar seu cliente</b>,{" "}
          <b style={{ color: C.textDark }}>fechar mais vendas</b> e publicar conteúdos que
          geram mais engajamento no Instagram.
        </p>
      </div>
    </Section>
  );
}
