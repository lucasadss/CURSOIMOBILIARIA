"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function SupportForm() {
  const [sent, setSent] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  if (sent) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-positive/30 bg-positive/10 px-4 py-3 text-sm text-ink">
        <Check className="size-4 text-positive" />
        Mensagem registrada. Responderemos por e-mail.
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-ink">Assunto</label>
        <Select
          value={subject}
          placeholder="Selecione…"
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="duvida">Dúvida de uso</option>
          <option value="resultado">Resultado abaixo do esperado</option>
          <option value="acesso">Acesso / plano</option>
          <option value="sugestao">Sugestão</option>
          <option value="outro">Outro</option>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-ink">Mensagem</label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          placeholder="Conte o que está acontecendo, com o máximo de detalhe."
        />
      </div>
      <Input type="email" placeholder="Seu e-mail para resposta" required />
      <Button type="submit" size="sm" disabled={!subject || !message.trim()}>
        Enviar mensagem
      </Button>
    </form>
  );
}
