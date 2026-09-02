import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
      <p className="text-2xs font-medium uppercase tracking-[0.16em] text-brand">
        404
      </p>
      <h1 className="mt-2 text-lg font-medium text-ink">
        Não encontramos esta página
      </h1>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        O módulo ou a rota pode ter mudado de lugar. Volte para o início e siga
        pela navegação.
      </p>
      <Button asChild size="sm" className="mt-5">
        <Link href="/app">Voltar ao início</Link>
      </Button>
    </div>
  );
}
