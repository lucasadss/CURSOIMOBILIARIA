/**
 * Assistant — mock layer.
 * The interface is shaped for a real backend later: swap `runAssistant` for a
 * fetch to an API route; everything upstream stays the same.
 */

export type AssistantIntent = "novo-comando" | "corrigir-resultado" | "referencia" | "objetivo";

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  /** attached reference image names (mock) */
  attachments?: string[];
}

export interface AssistantRequest {
  intent: AssistantIntent;
  message: string;
  attachments?: string[];
  /** for "corrigir-resultado" */
  expected?: string;
  gotWrong?: string;
}

function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `m_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
}

export function makeMessage(
  role: AssistantMessage["role"],
  content: string,
  attachments?: string[],
): AssistantMessage {
  return { id: uid(), role, content, createdAt: new Date().toISOString(), attachments };
}

const CORRECTION_TEMPLATE = (req: AssistantRequest) =>
  `Prompt corretivo

Contexto do problema: ${req.gotWrong || "resultado fora do esperado"}.
Objetivo real: ${req.expected || req.message}.

Instrução para a IA:
Refaça a geração anterior mantendo a composição e o enquadramento originais.
Corrija especificamente: ${req.gotWrong || req.message}.
Priorize a imagem de referência sobre qualquer interpretação do texto.
Não introduza elementos novos; ajuste apenas o ponto indicado.
Evitar: morphing, mudança de perspectiva, alteração de iluminação global.`;

const NEW_COMMAND_TEMPLATE = (req: AssistantRequest) =>
  `Rascunho de comando

Objetivo: ${req.message}

Prompt sugerido:
Gere uma cena imobiliária fotorrealista a partir da imagem de referência, mantendo estrutura e ponto de vista.
${req.attachments?.length ? `Referências anexadas: ${req.attachments.join(", ")}.\n` : ""}Ajuste tom, luz e materiais conforme o objetivo acima.
Formato 3:2. Evitar texto, marca d'água e elementos inventados.

Dica: leve este rascunho para o módulo mais próximo do seu caso e refine pelos campos.`;

/** Mock — resolves after a short, believable delay. */
export function runAssistant(req: AssistantRequest): Promise<AssistantMessage> {
  const body =
    req.intent === "corrigir-resultado"
      ? CORRECTION_TEMPLATE(req)
      : NEW_COMMAND_TEMPLATE(req);

  return new Promise((resolve) => {
    setTimeout(() => resolve(makeMessage("assistant", body)), 650);
  });
}

export const ASSISTANT_INTENTS: { id: AssistantIntent; label: string; hint: string }[] = [
  { id: "novo-comando", label: "Criar novo comando", hint: "Descreva o que quer gerar" },
  { id: "corrigir-resultado", label: "Corrigir resultado", hint: "O que saiu errado?" },
  { id: "referencia", label: "Enviar referência", hint: "Anexe uma imagem de base" },
  { id: "objetivo", label: "Descrever objetivo", hint: "Conte o cenário e o público" },
];
