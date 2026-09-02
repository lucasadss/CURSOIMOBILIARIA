"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section, SectionHead } from "./landing-ui";

const ITEMS = [
  {
    q: "Preciso saber usar IA?",
    a: "Não. A IMOVIX foi criada justamente para evitar que você tenha que aprender a parte técnica.",
  },
  {
    q: "Preciso saber editar vídeo?",
    a: "Não. A proposta é gerar o material sem depender de software profissional de edição.",
  },
  {
    q: "Preciso escrever prompts?",
    a: "Não. A plataforma prepara os comandos por você.",
  },
  {
    q: "Funciona no celular?",
    a: "Sim. A plataforma pode ser acessada pelo celular ou pelo computador, no navegador.",
  },
  {
    q: "Preciso pagar outra ferramenta?",
    a: "A IMOVIX entrega o comando pronto. A geração da imagem ou do vídeo acontece em ferramentas de IA externas. Algumas têm camada de uso gratuita, outras têm planos pagos. A plataforma indica qual usar em cada caso.",
  },
  {
    q: "Consigo usar com terreno vazio?",
    a: "Sim. Há modelos específicos para terreno.",
  },
  {
    q: "Consigo usar com imóveis prontos?",
    a: "Sim. Há modelos para interiores e imóvel pronto.",
  },
  {
    q: "Tem treinamento?",
    a: "Sim. Existe um treinamento rápido dentro da plataforma, mostrando o fluxo e como criar seus primeiros resultados.",
  },
  {
    q: "O acesso é vitalício?",
    a: "Sim. É um pagamento único, sem mensalidade.",
  },
  {
    q: "Tem suporte?",
    a: "Sim. Você recebe suporte para avançar nos primeiros passos e usar a plataforma.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <Section tone="light" id="faq">
      <SectionHead align="center" kicker="Dúvidas" title="Perguntas frequentes" />

      <div className="mx-auto mt-10 max-w-[720px] space-y-2.5 text-left">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[var(--surface)]"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-[0.95rem] font-medium">{item.q}</span>
                <Plus
                  className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-45")}
                  style={{ color: "var(--muted)" }}
                />
              </button>
              {isOpen ? (
                <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.a}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
