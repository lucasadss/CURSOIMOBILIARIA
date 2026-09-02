import Link from "next/link";
import { Logo } from "./logo";

export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-hairline">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-muted">
          <Link href="/app/treinamentos" className="hover:text-ink">
            Treinamento
          </Link>
          <Link href="/app/explorar" className="hover:text-ink">
            Ferramentas
          </Link>
          <Link href="/app/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link href="/app/suporte" className="hover:text-ink">
            Suporte
          </Link>
        </nav>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} IMOVIX
        </p>
      </div>
    </footer>
  );
}
