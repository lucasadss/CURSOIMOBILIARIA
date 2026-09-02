import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, LifeBuoy, MessageSquareText } from "lucide-react";
import { SupportForm } from "@/components/common/support-form";

export const metadata: Metadata = {
  title: "Suporte",
};

const LINKS = [
  {
    href: "/app/faq",
    title: "Perguntas frequentes",
    description: "As dúvidas mais comuns, respondidas.",
    icon: BookOpen,
  },
  {
    href: "/app/treinamento/fundamentos-imovel-ia",
    title: "Treinamento de fundamentos",
    description: "Como a plataforma funciona, do zero.",
    icon: LifeBuoy,
  },
  {
    href: "/app/assistente?intent=corrigir-resultado",
    title: "Corrigir um resultado",
    description: "O assistente devolve um prompt corretivo.",
    icon: MessageSquareText,
  },
];

export default function SuportePage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-xl font-medium text-ink">Suporte</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Comece pelos atalhos abaixo. Se não resolver, mande uma mensagem.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-lg border border-hairline bg-panel p-4 transition-colors hover:border-hairline-strong"
          >
            <l.icon className="size-4 text-ink-faint" />
            <p className="mt-2 text-sm font-medium text-ink">{l.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-ink-muted">
              {l.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="section-label">
          Enviar mensagem
        </h2>
        <div className="mt-3">
          <SupportForm />
        </div>
      </div>
    </div>
  );
}
