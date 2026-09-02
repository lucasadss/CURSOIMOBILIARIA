"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, Paperclip } from "lucide-react";
import {
  ASSISTANT_INTENTS,
  makeMessage,
  runAssistant,
  type AssistantIntent,
  type AssistantMessage,
} from "@/lib/assistant";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { CopyButton } from "@/components/common/copy-button";

export function AssistantChat() {
  const params = useSearchParams();
  const initialIntent = (params.get("intent") as AssistantIntent) ?? "novo-comando";

  const [intent, setIntent] = React.useState<AssistantIntent>(
    ASSISTANT_INTENTS.some((i) => i.id === initialIntent)
      ? initialIntent
      : "novo-comando",
  );
  const [messages, setMessages] = React.useState<AssistantMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [expected, setExpected] = React.useState("");
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const isCorrection = intent === "corrigir-resultado";

  async function send() {
    if (!input.trim() || pending) return;
    const userMsg = makeMessage(
      "user",
      isCorrection
        ? `Resultado errado: ${input}${expected ? `\nEsperado: ${expected}` : ""}`
        : input,
      attachments.length ? attachments : undefined,
    );
    setMessages((m) => [...m, userMsg]);
    setPending(true);
    const reply = await runAssistant({
      intent,
      message: input,
      expected,
      gotWrong: isCorrection ? input : undefined,
      attachments,
    });
    setMessages((m) => [...m, reply]);
    setInput("");
    setExpected("");
    setAttachments([]);
    setPending(false);
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-[800px] flex-col px-4 sm:px-6 lg:h-dvh lg:px-8">
      <div className="py-6">
        <h1 className="text-xl font-medium text-ink">Assistente IA</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Peça comandos sob medida ou corrija um resultado que não saiu como
          esperado.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pb-3">
        {ASSISTANT_INTENTS.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => setIntent(i.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              intent === i.id
                ? "border-transparent bg-white/[0.07] text-ink"
                : "border-hairline-strong text-ink-muted hover:text-ink",
            )}
          >
            {i.label}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-lg border border-hairline bg-panel/40 p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-ink-muted">
              {ASSISTANT_INTENTS.find((i) => i.id === intent)?.hint}
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              Respostas geradas localmente nesta versão.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand-subtle text-ink"
                    : "border border-hairline bg-panel text-ink-muted",
                )}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                {m.attachments?.length ? (
                  <p className="mt-1.5 text-2xs text-ink-faint">
                    {m.attachments.length} anexo(s)
                  </p>
                ) : null}
                {m.role === "assistant" ? (
                  <div className="mt-2">
                    <CopyButton value={m.content} size="sm" variant="ghost" />
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
        {pending ? (
          <div className="flex justify-start">
            <div className="rounded-lg border border-hairline bg-panel px-4 py-2.5 text-sm text-ink-faint">
              Gerando…
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2 py-3">
        {isCorrection ? (
          <Textarea
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            rows={2}
            placeholder="O que você esperava que acontecesse?"
          />
        ) : null}
        <div className="flex items-end gap-2 rounded-lg border border-hairline-strong bg-panel-2 p-2">
          <label className="flex size-8 cursor-pointer items-center justify-center rounded-md text-ink-faint transition-colors hover:text-ink">
            <Paperclip className="size-4" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) =>
                setAttachments(Array.from(e.target.files ?? []).map((f) => f.name))
              }
            />
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={
              isCorrection
                ? "Descreva o que saiu errado…"
                : "Descreva o que você quer criar…"
            }
            className="min-h-9 flex-1 resize-none border-0 bg-transparent px-1 focus-visible:outline-none"
          />
          <Button
            size="icon-sm"
            onClick={send}
            disabled={!input.trim() || pending}
            aria-label="Enviar"
          >
            <ArrowUp />
          </Button>
        </div>
        {attachments.length ? (
          <p className="text-2xs text-ink-faint">
            Anexos: {attachments.join(", ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
