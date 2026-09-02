"use client";

import * as React from "react";
import { CURRENT_USER } from "@/lib/user";
import { useUI } from "@/lib/storage/ui";
import { useFavorites } from "@/lib/storage/favorites";
import { useHistory } from "@/lib/storage/history";
import { useProgress } from "@/lib/storage/progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 border-b border-hairline py-6 sm:grid-cols-[220px_1fr]">
      <div>
        <h2 className="text-sm font-medium text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-snug text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function ConfiguracoesPage() {
  const hydrated = useHydrated();
  const skillLevel = useUI((s) => s.skillLevel);
  const setSkillLevel = useUI((s) => s.setSkillLevel);
  const sidebarCollapsed = useUI((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useUI((s) => s.setSidebarCollapsed);

  const clearFav = useFavorites((s) => s.clear);
  const clearVisits = useHistory((s) => s.clearVisits);
  const clearPrompts = useHistory((s) => s.clearPrompts);

  function wipeAll() {
    clearFav();
    clearVisits();
    clearPrompts();
    try {
      localStorage.removeItem("imovel-ia:progress");
      useProgress.persist?.clearStorage?.();
    } catch {
      /* noop */
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-xl font-medium text-ink">Configurações</h1>

      <Section
        title="Perfil"
        description="Dados da sua conta. Edição completa chega em breve."
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ink">Nome</label>
          <Input defaultValue={CURRENT_USER.name} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-ink">E-mail</label>
          <Input defaultValue={CURRENT_USER.email} type="email" />
        </div>
        <p className="text-xs text-ink-faint">
          Plano atual: <span className="text-ink">{CURRENT_USER.plan}</span>
        </p>
      </Section>

      <Section
        title="Preferências"
        description="Como a plataforma se comporta por padrão."
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink">Nível padrão dos módulos</p>
            <p className="text-xs text-ink-faint">
              Define se um módulo abre em Iniciante ou Avançado.
            </p>
          </div>
          <SegmentedControl
            aria-label="Nível padrão"
            options={[
              { value: "iniciante", label: "Iniciante" },
              { value: "avancado", label: "Avançado" },
            ]}
            value={hydrated ? skillLevel : "iniciante"}
            onValueChange={(v) => setSkillLevel(v as "iniciante" | "avancado")}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink">Menu lateral recolhido</p>
            <p className="text-xs text-ink-faint">
              Começa com a barra do workspace só com ícones.
            </p>
          </div>
          <Switch
            checked={hydrated ? sidebarCollapsed : false}
            onCheckedChange={setSidebarCollapsed}
          />
        </div>
      </Section>

      <Section
        title="Dados locais"
        description="Favoritos, histórico e progresso ficam salvos neste navegador."
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={clearFav}>
            Limpar favoritos
          </Button>
          <Button variant="outline" size="sm" onClick={clearPrompts}>
            Limpar prompts
          </Button>
          <Button variant="outline" size="sm" onClick={clearVisits}>
            Limpar histórico
          </Button>
          <Button variant="danger" size="sm" onClick={wipeAll}>
            Apagar tudo
          </Button>
        </div>
      </Section>
    </div>
  );
}
