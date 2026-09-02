import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-lg font-medium text-ink">Página não encontrada</h1>
      <Link href="/app" className="text-sm text-brand hover:underline">
        Ir para a plataforma
      </Link>
    </div>
  );
}
