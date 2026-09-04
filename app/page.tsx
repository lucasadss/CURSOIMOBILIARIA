import type { Metadata } from "next";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPatternBreak } from "@/components/landing/landing-pattern-break";
import { LandingExamples } from "@/components/landing/landing-examples";
import { LandingNotEditor } from "@/components/landing/landing-not-editor";
import { LandingHow } from "@/components/landing/landing-how";
import { LandingBenefits } from "@/components/landing/landing-benefits";
import { LandingCompare } from "@/components/landing/landing-compare";
import { LandingNoAi } from "@/components/landing/landing-no-ai";
import { LandingAssistant } from "@/components/landing/landing-assistant";
import { LandingAudience } from "@/components/landing/landing-audience";
import { LandingTraining } from "@/components/landing/landing-training";
import { LandingTestimonials } from "@/components/landing/landing-testimonials";
import { LandingIncluded } from "@/components/landing/landing-included";
import { LandingOffer } from "@/components/landing/landing-offer";
import { LandingBonuses } from "@/components/landing/landing-bonuses";
import { LandingGuarantee } from "@/components/landing/landing-guarantee";
import { LandingSupport } from "@/components/landing/landing-support";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: { absolute: "IMOVIX · Venda mais apresentando melhor os seus imóveis" },
  description:
    "Transforme fotos comuns de imóveis, terrenos e obras em imagens e vídeos que chamam atenção. Sem editar, sem prompt, sem contratar editor para cada conteúdo.",
};

export default function LandingPage() {
  return (
    <div
      className="bg-[#0D0D0D]"
      style={{ fontFamily: 'var(--font-manrope), "Manrope", system-ui, sans-serif' }}
    >
      <main>
        <LandingHero />
        <LandingPatternBreak />
        <LandingExamples />
        <LandingNotEditor />
        <LandingHow />
        <LandingBenefits />
        <LandingCompare />
        <LandingNoAi />
        <LandingAssistant />
        <LandingAudience />
        <LandingTraining />
        <LandingTestimonials />
        <LandingIncluded />
        <LandingOffer />
        <LandingBonuses />
        <LandingGuarantee />
        <LandingSupport />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
