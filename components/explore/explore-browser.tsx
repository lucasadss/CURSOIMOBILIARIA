"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageSquareText, Search, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULE_SUMMARIES, isVideoModule } from "@/lib/modules";
import { CATEGORIES } from "@/lib/categories";
import { TRAININGS } from "@/lib/trainings";
import { Input } from "@/components/ui/input";
import { ContentCard } from "@/components/home/content-card";
import { CategoryCard } from "@/components/home/category-card";
import { TrainingCard } from "@/components/training/training-card";
import { EmptyState } from "@/components/common/empty-state";

type TypeFilter = "todos" | "imagem" | "video" | "treinamentos" | "ferramentas";

const TYPE_TABS: { id: TypeFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "imagem", label: "Imagem" },
  { id: "video", label: "Vídeo" },
  { id: "treinamentos", label: "Treinamentos" },
  { id: "ferramentas", label: "Ferramentas" },
];

const TOOLS = [
  {
    href: "/app/assistente",
    title: "Assistente IA",
    description: "Peça comandos sob medida, corrija resultados e descreva objetivos.",
    icon: MessageSquareText,
  },
  {
    href: "/app/assistente?intent=novo-comando",
    title: "Criação Personalizada",
    description: "Descreva o que quer gerar e receba um prompt pronto para ajustar.",
    icon: PenLine,
  },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function ExploreBrowser() {
  const params = useSearchParams();
  const initialType = (params.get("tab") as TypeFilter) ?? "todos";
  const initialCat = params.get("categoria") ?? "todas";

  const [type, setType] = React.useState<TypeFilter>(
    TYPE_TABS.some((t) => t.id === initialType) ? initialType : "todos",
  );
  const [category, setCategory] = React.useState<string>(initialCat);
  const [query, setQuery] = React.useState("");

  const q = normalize(query.trim());

  const modules = React.useMemo(() => {
    return MODULE_SUMMARIES.filter((m) => {
      if (type === "imagem" && isVideoModule(m)) return false;
      if (type === "video" && !isVideoModule(m)) return false;
      if (type === "treinamentos" || type === "ferramentas") return false;
      if (category !== "todas" && m.category !== category) return false;
      if (q && !normalize(`${m.name} ${m.description} ${m.category}`).includes(q))
        return false;
      return true;
    });
  }, [type, category, q]);

  const showModules = type === "todos" || type === "imagem" || type === "video";
  const showTrainings = type === "todos" || type === "treinamentos";
  const showTools = type === "todos" || type === "ferramentas";

  const trainings = TRAININGS.filter(
    (t) => !q || normalize(`${t.title} ${t.description}`).includes(q),
  );
  const tools = TOOLS.filter(
    (t) => !q || normalize(`${t.title} ${t.description}`).includes(q),
  );

  const nothing =
    (!showModules || modules.length === 0) &&
    (!showTrainings || trainings.length === 0) &&
    (!showTools || tools.length === 0);

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-ink">Explorar</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Todos os módulos, treinamentos e ferramentas em um só lugar.
        </p>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou descrição…"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-hairline pb-3">
        {TYPE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setType(t.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              type === t.id
                ? "bg-white/[0.07] text-ink"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showModules && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Chip active={category === "todas"} onClick={() => setCategory("todas")}>
            Todas as categorias
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
      )}

      {nothing ? (
        <EmptyState
          icon={Search}
          title="Nada por aqui"
          description="Tente outro termo ou remova os filtros."
          className="mt-10"
        />
      ) : null}

      {showModules && modules.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {modules.map((m) => (
            <ContentCard
              key={m.slug}
              module={m}
              sizes="(max-width: 640px) 47vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 300px"
            />
          ))}
        </div>
      )}

      {showTrainings && trainings.length > 0 && (
        <div className="mt-10">
          {type === "todos" && (
            <h2 className="mb-3 text-md font-medium text-ink">Treinamentos</h2>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trainings.map((t) => (
              <TrainingCard key={t.slug} training={t} />
            ))}
          </div>
        </div>
      )}

      {showTools && tools.length > 0 && (
        <div className="mt-10">
          {type === "todos" && (
            <h2 className="mb-3 text-md font-medium text-ink">Ferramentas</h2>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex gap-3 rounded-lg border border-hairline bg-panel p-4 transition-colors hover:border-hairline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-panel-2 text-ink-faint">
                  <t.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{t.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-ink-muted">
                    {t.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showModules && type === "todos" && (
        <div className="mt-12">
          <h2 className="mb-3 text-md font-medium text-ink">Trilhas</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.filter((c) => c.slug !== "outros").map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-transparent bg-white/[0.07] text-ink"
          : "border-hairline-strong text-ink-muted hover:border-white/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
