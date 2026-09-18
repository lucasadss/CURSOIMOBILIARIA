import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Confirmar acesso",
  robots: { index: false, follow: false },
};

/**
 * Landing page for the emailed access link. The token is only spent when the
 * visitor clicks the button (POST), so link-scanning bots that merely GET this
 * page can't burn a one-time link.
 */
export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; next?: string }>;
}) {
  const { token_hash, next } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-medium text-ink">Seu acesso está pronto</h1>
        {token_hash ? (
          <>
            <p className="mt-2 text-sm text-ink-muted">
              Clique abaixo para entrar na IMOVIX.
            </p>
            <form action="/auth/confirm/verify" method="post" className="mt-6">
              <input type="hidden" name="token_hash" value={token_hash} />
              <input type="hidden" name="next" value={next ?? ""} />
              <Button type="submit" className="w-full">
                Entrar na IMOVIX
              </Button>
            </form>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">
            Link inválido.{" "}
            <Link href="/login" className="text-brand underline">
              Peça um novo acesso
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
