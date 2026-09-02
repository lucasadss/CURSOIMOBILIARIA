export function ModuleInstructions({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li
          key={i}
          className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
        >
          <span className="mt-2 size-1 shrink-0 rounded-full bg-ink-faint" />
          {t}
        </li>
      ))}
    </ul>
  );
}
