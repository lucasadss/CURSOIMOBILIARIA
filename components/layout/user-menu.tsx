"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENT_USER } from "@/lib/user";

export function UserMenu() {
  const u = CURRENT_USER;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-8 items-center justify-center rounded-full border border-hairline-strong bg-panel-2 text-sm font-medium text-ink transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        aria-label="Abrir menu do perfil"
      >
        {u.initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <div className="px-2.5 py-2">
          <p className="text-sm font-medium text-ink">{u.name}</p>
          <p className="truncate text-xs text-ink-faint">{u.email}</p>
          <p className="mt-1.5 inline-flex items-center rounded-[5px] border border-hairline-strong px-1.5 py-0.5 text-2xs font-medium text-ink-muted">
            Plano {u.plan}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/configuracoes">
            <UserRound />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/app/configuracoes">
            <Settings />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-ink-muted">
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
