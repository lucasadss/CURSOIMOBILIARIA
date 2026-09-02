"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useSearch } from "@/lib/storage/search";
import { Logo } from "./logo";
import { UserMenu } from "./user-menu";
import { WorkspaceNav, WorkspaceSidebar } from "./workspace-sidebar";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const openSearch = useSearch((s) => s.setOpen);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-dvh">
      <WorkspaceSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-hairline bg-canvas/85 px-4 backdrop-blur-md lg:hidden">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Abrir menu">
                <Menu />
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left" className="p-0">
              <div className="flex h-14 items-center border-b border-hairline px-4">
                <Logo />
              </div>
              <div className="py-1">
                <WorkspaceNav
                  collapsed={false}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </div>
            </DrawerContent>
          </Drawer>

          <Link href="/app" className="lg:hidden">
            <Logo showText={false} />
          </Link>

          <button
            type="button"
            onClick={() => openSearch(true)}
            className="ml-auto flex items-center gap-2 rounded-md border border-hairline-strong bg-panel-2/70 px-2.5 py-1.5 text-sm text-ink-faint"
          >
            <Search className="size-3.5" />
            <span>Buscar</span>
          </button>
          <UserMenu />
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
