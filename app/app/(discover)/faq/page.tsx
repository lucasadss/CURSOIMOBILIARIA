import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/lib/faq";
import { FaqAccordion } from "@/components/common/faq-accordion";

export const metadata: Metadata = {
  title: "Perguntas frequentes",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-xl font-medium text-ink">Perguntas frequentes</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {FAQ.length} dúvidas respondidas. Não achou? Fale com o{" "}
        <Link href="/app/suporte" className="text-ink underline underline-offset-2 hover:text-ink-muted">
          suporte
        </Link>
        .
      </p>

      <div className="mt-6">
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  );
}
