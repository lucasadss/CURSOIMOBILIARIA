"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useSearch } from "@/lib/storage/search";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";

const NAV = [
  { label: "Início", href: "/app" },
  { label: "Treinamento", href: "/app/treinamentos" },
  { label: "Ferramentas", href: "/app/explorar" },
  { label: "Minha lista", href: "/app/favoritos" },
];

export function AppHeader({
  variant = "auto",
}: {
  variant?: "solid" | "overlay" | "auto";
}) {
  const pathname = usePathname();
  const openSearch = useSearch((s) => s.setOpen);
  const [scrolled, setScrolled] = React.useState(false);

  const resolvedVariant =
    variant === "auto" ? (pathname === "/app" ? "overlay" : "solid") : variant;

  React.useEffect(() => {
    if (resolvedVariant !== "overlay") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [resolvedVariant]);

  const floating = resolvedVariant === "overlay" && !scrolled;

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    if (href === "/app/explorar")
      return (
        pathname.startsWith("/app/explorar") ||
        pathname.startsWith("/app/categoria")
      );
    if (href === "/app/treinamentos")
      return pathname.startsWith("/app/treinamento");
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        floating
          ? "border-b border-transparent bg-transparent"
          : "border-b border-hairline bg-canvas/80 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1360px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/app" className="shrink-0" aria-label="IMOVIX — início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-1.5 h-px bg-brand" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => openSearch(true)}
            className="hidden items-center gap-2 rounded-md border border-hairline bg-panel-2/60 px-2.5 py-1.5 text-sm text-ink-faint transition-colors hover:border-hairline-strong hover:text-ink-muted sm:flex"
          >
            <Search className="size-3.5" />
            <span>Buscar</span>
            <kbd className="rounded border border-hairline-strong px-1 text-2xs">
              ⌘K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="sm:hidden"
            aria-label="Buscar"
            onClick={() => openSearch(true)}
          >
            <Search />
          </Button>

          <div className="hidden lg:block">
            <UserMenu />
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="right" title="Menu">
              <nav className="flex flex-col gap-0.5">
                {NAV.map((item) => (
                  <DrawerClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-brand-subtle text-ink"
                          : "text-ink-muted hover:bg-ink/[0.04] hover:text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
              <div className="mt-6 border-t border-hairline pt-4">
                <UserMenu />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
