"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestMagicLink } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Enviando…" : "Enviar link de acesso"}
    </Button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(requestMagicLink, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          E-mail da compra
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
            className="pl-9"
          />
        </div>
      </div>

      <SubmitButton />

      {state ? (
        <p
          className={
            state.ok
              ? "text-sm text-positive"
              : "text-sm text-danger"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
