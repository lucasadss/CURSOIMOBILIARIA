import { Wordmark, C } from "./landing-ui";

export function LandingFooter() {
  return (
    <footer
      style={{ background: C.bgDark, color: C.textMutedDark }}
      className="border-t border-[rgba(247,244,239,0.08)] px-5 py-10 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <Wordmark />
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          <a href="#exemplos" className="transition-colors hover:text-[#F7F4EF]">Exemplos</a>
          <a href="#como-funciona" className="transition-colors hover:text-[#F7F4EF]">Como funciona</a>
          <a href="#treinamento" className="transition-colors hover:text-[#F7F4EF]">Treinamento</a>
          <a href="#faq" className="transition-colors hover:text-[#F7F4EF]">Dúvidas</a>
        </nav>
        <p className="text-xs">© {new Date().getFullYear()} IMOVIX</p>
      </div>
    </footer>
  );
}
