"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  ListChecks,
  PlayCircle,
  PenLine,
  LifeBuoy,
} from "lucide-react";
import type { SupportMaterial } from "@/types";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const ICON = {
  guide: BookOpen,
  video: PlayCircle,
  pdf: FileText,
  walkthrough: ListChecks,
  example: PenLine,
} as const;

export function SupportDrawer({
  materials,
  moduleName,
}: {
  materials?: SupportMaterial[];
  moduleName: string;
}) {
  const list = materials ?? [];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          <LifeBuoy />
          Material de apoio
        </Button>
      </DrawerTrigger>
      <DrawerContent
        title="Material de apoio"
        description={moduleName}
      >
        {list.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Nenhum material específico para este módulo ainda. Enquanto isso, o
            treinamento{" "}
            <Link
              href="/app/treinamento/fundamentos-imovel-ia"
              className="text-ink underline underline-offset-2"
            >
              Treinamento rápido
            </Link>{" "}
            cobre o essencial.
          </p>
        ) : (
          <ul className="space-y-2">
            {list.map((m, i) => {
              const Icon = ICON[m.kind];
              const inner = (
                <div className="flex gap-3 rounded-lg border border-hairline bg-panel-2 p-3 transition-colors hover:border-hairline-strong">
                  <Icon className="mt-0.5 size-4 shrink-0 text-ink-faint" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{m.label}</p>
                    {m.body ? (
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {m.body}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
              return (
                <li key={i}>
                  {m.href ? (
                    <Link href={m.href} className="block focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-lg">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DrawerContent>
    </Drawer>
  );
}
