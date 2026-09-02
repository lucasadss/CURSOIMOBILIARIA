"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { getModulesByCategory } from "@/lib/modules";
import { useUI } from "@/lib/storage/ui";
import { useHydrated } from "@/hooks/use-hydrated";
import { Logo } from "./logo";
import {
  CREATE_NAV,
  LEARN_NAV,
  PRIMARY_NAV,
  TOOLS_NAV,
  type NavLink,
} from "./workspace-nav";

function useActive() {
  const pathname = usePathname();
  return React.useCallback(
    (href: string) => {
      const base = href.split("?")[0].split("#")[0];
      if (base === "/app") return pathname === "/app";
      return pathname === base || pathname.startsWith(base + "/");
    },
    [pathname],
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 pt-5 text-2xs font-medium uppercase tracking-[0.07em] text-ink-faint">
      {children}
    </p>
  );
}

function Row({
  link,
  active,
  collapsed,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const content = (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-white/[0.06] text-ink"
          : "text-ink-muted hover:bg-white/[0.03] hover:text-ink",
      )}
    >
      <link.icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-brand" : "text-ink-faint group-hover:text-ink-muted",
        )}
      />
      {!collapsed && <span className="truncate">{link.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={link.label} side="right">
        {content}
      </Tooltip>
    );
  }
  return content;
}

function CategoryItem({
  label,
  slug,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  label: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const isActive = useActive();
  const href = `/app/categoria/${slug}`;
  const active = isActive(href);
  const [open, setOpen] = React.useState(active);
  const modules = React.useMemo(
    () => getModulesByCategory(slug as never),
    [slug],
  );

  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        <Link
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex justify-center rounded-md py-2 text-ink-muted transition-colors hover:bg-white/[0.03] hover:text-ink",
            active && "bg-white/[0.06] text-ink",
          )}
        >
          <Icon className={cn("size-4", active ? "text-brand" : "text-ink-faint")} />
        </Link>
      </Tooltip>
    );
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "group flex items-center rounded-md pr-1 text-sm font-medium transition-colors",
          active ? "text-ink" : "text-ink-muted hover:text-ink",
        )}
      >
        <Link
          href={href}
          onClick={onNavigate}
          className="flex flex-1 items-center gap-2.5 rounded-md px-3 py-2 hover:bg-white/[0.03]"
        >
          <Icon
            className={cn("size-4 shrink-0", active ? "text-brand" : "text-ink-faint")}
          />
          <span className="truncate">{label}</span>
        </Link>
        <Collapsible.Trigger
          className="rounded p-1 text-ink-faint transition-colors hover:text-ink"
          aria-label={open ? `Recolher ${label}` : `Expandir ${label}`}
        >
          <ChevronDown
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-[ii-fade-in_0.15s_reverse] data-[state=open]:animate-fade">
        <ul className="ml-[26px] mt-0.5 space-y-0.5 border-l border-hairline py-1 pl-2.5">
          {modules.map((m) => {
            const mActive = isActive(`/app/modulo/${m.slug}`);
            return (
              <li key={m.slug}>
                <Link
                  href={`/app/modulo/${m.slug}`}
                  onClick={onNavigate}
                  className={cn(
                    "block truncate rounded px-2 py-1.5 text-xs transition-colors",
                    mActive
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink-muted",
                  )}
                >
                  {m.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function WorkspaceNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const isActive = useActive();
  return (
    <nav className="flex flex-col px-2 pb-6">
      <div className="space-y-0.5 pt-2">
        {PRIMARY_NAV.map((l) => (
          <Row
            key={l.href}
            link={l}
            active={isActive(l.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {!collapsed && <GroupLabel>Criar</GroupLabel>}
      {collapsed && <div className="my-2 h-px bg-hairline" />}
      <div className="space-y-0.5">
        {CREATE_NAV.map((c) => (
          <CategoryItem
            key={c.slug}
            label={c.label}
            slug={c.slug}
            icon={c.icon}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {!collapsed && <GroupLabel>Ferramentas</GroupLabel>}
      {collapsed && <div className="my-2 h-px bg-hairline" />}
      <div className="space-y-0.5">
        {TOOLS_NAV.map((l) => (
          <Row
            key={l.href}
            link={l}
            active={isActive(l.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {!collapsed && <GroupLabel>Aprender</GroupLabel>}
      {collapsed && <div className="my-2 h-px bg-hairline" />}
      <div className="space-y-0.5">
        {LEARN_NAV.map((l) => (
          <Row
            key={l.href}
            link={l}
            active={isActive(l.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

export function WorkspaceSidebar() {
  const hydrated = useHydrated();
  const collapsed = useUI((s) => s.sidebarCollapsed) && hydrated;
  const toggle = useUI((s) => s.toggleSidebar);

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-hairline bg-canvas transition-[width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex",
          collapsed ? "w-[60px]" : "w-[236px]",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center border-b border-hairline",
            collapsed ? "justify-center px-0" : "px-4",
          )}
        >
          <Link href="/app" aria-label="IMOVIX — início">
            <Logo showText={!collapsed} />
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <WorkspaceNav collapsed={collapsed} />
        </div>

        <div className="border-t border-hairline p-2">
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white/[0.03] hover:text-ink",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 text-ink-faint" />
            ) : (
              <>
                <PanelLeftClose className="size-4 text-ink-faint" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
