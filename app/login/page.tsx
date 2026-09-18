import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium text-ink">Entrar na IMOVIX</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Digite o e-mail que você usou na compra. A gente manda um link de
            acesso pra ele.
          </p>
        </div>
        {error === "link_invalido" ? (
          <p className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            Esse link expirou ou já foi usado. Peça um novo abaixo.
          </p>
        ) : null}
        {error === "acesso_revogado" ? (
          <p className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            Não encontramos uma compra ativa pra esse e-mail. Se isso for um
            engano, fale com o suporte.
          </p>
        ) : null}
        <LoginForm next={next} />
      </div>
    </div>
  );
}
