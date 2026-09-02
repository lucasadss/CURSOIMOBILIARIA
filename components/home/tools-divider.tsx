/**
 * The seam between the two halves of the Home: the editorial (light) training
 * band above, the operational (dark) tools below. The zone colour change does
 * most of the work — this just names the new section.
 */
export function ToolsDivider() {
  return (
    <div className="px-4 pt-16 sm:px-6 lg:px-8">
      <span className="block h-px w-8 bg-brand" />
      <p className="mt-4 text-2xs font-semibold uppercase tracking-[0.16em] text-brand">
        Coloque em prática
      </p>
      <h2 className="mt-2 text-lg font-medium text-ink">Ferramentas de criação</h2>
      <p className="mt-1.5 max-w-[40rem] text-sm text-ink-muted">
        Use os modelos abaixo para criar imagens e vídeos para seus imóveis.
      </p>
    </div>
  );
}
