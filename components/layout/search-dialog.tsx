"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Compass,
  GraduationCap,
  Heart,
  History as HistoryIcon,
  LayoutGrid,
  MessageSquareText,
  Search,
  PenLine,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MODULE_SUMMARIES, moduleKindLabel } from "@/lib/modules";
import { CATEGORIES } from "@/lib/categories";
import { TRAININGS } from "@/lib/trainings";
import { useSearch } from "@/lib/storage/search";

const PAGES = [
  { label: "Explorar", href: "/app/explorar", icon: Compass },
  { label: "Minha lista", href: "/app/favoritos", icon: Heart },
  { label: "Histórico", href: "/app/historico", icon: HistoryIcon },
  { label: "Treinamentos", href: "/app/treinamentos", icon: GraduationCap },
  { label: "Assistente IA", href: "/app/assistente", icon: MessageSquareText },
  { label: "Criação personalizada", href: "/app/assistente?intent=novo-comando", icon: PenLine },
];

export function SearchDialog() {
  const router = useRouter();
  const open = useSearch((s) => s.open);
  const setOpen = useSearch((s) => s.setOpen);

  const go = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router, setOpen],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        hideClose
        className="max-w-xl overflow-hidden p-0"
        aria-label="Busca"
      >
        <Command
          loop
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-ink-faint"
        >
          <div className="flex items-center gap-2 border-b border-hairline px-3">
            <Search className="size-4 shrink-0 text-ink-faint" />
            <Command.Input
              autoFocus
              placeholder="Buscar módulos, categorias, treinamentos…"
              className="h-11 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            <kbd className="hidden shrink-0 rounded border border-hairline-strong px-1.5 py-0.5 text-2xs text-ink-faint sm:block">
              Esc
            </kbd>
          </div>

          <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-1.5">
            <Command.Empty className="px-3 py-8 text-center text-sm text-ink-muted">
              Nada encontrado.
            </Command.Empty>

            <Command.Group heading="Ir para">
              {PAGES.map((p) => (
                <Item key={p.href} onSelect={() => go(p.href)}>
                  <p.icon className="size-4 text-ink-faint" />
                  {p.label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Módulos">
              {MODULE_SUMMARIES.map((m) => (
                <Item
                  key={m.slug}
                  value={`${m.name} ${m.category} ${moduleKindLabel(m)}`}
                  onSelect={() => go(`/app/modulo/${m.slug}`)}
                >
                  <LayoutGrid className="size-4 text-ink-faint" />
                  <span className="flex-1 truncate">{m.name}</span>
                  <span className="text-xs text-ink-faint">{moduleKindLabel(m)}</span>
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Categorias">
              {CATEGORIES.map((c) => (
                <Item
                  key={c.slug}
                  value={`categoria ${c.name} ${c.tagline}`}
                  onSelect={() => go(`/app/categoria/${c.slug}`)}
                >
                  <Compass className="size-4 text-ink-faint" />
                  {c.name}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Treinamentos">
              {TRAININGS.map((t) => (
                <Item
                  key={t.slug}
                  value={`treinamento ${t.title} ${t.level}`}
                  onSelect={() => go(`/app/treinamento/${t.slug}`)}
                >
                  <GraduationCap className="size-4 text-ink-faint" />
                  {t.title}
                </Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  children,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  value?: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-ink-muted transition-colors data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-ink"
    >
      {children}
    </Command.Item>
  );
}
