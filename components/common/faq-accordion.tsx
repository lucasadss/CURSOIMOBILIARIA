"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/lib/faq";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
      {items.map((item, i) => (
        <Collapsible.Root
          key={i}
          open={open === i}
          onOpenChange={(v) => setOpen(v ? i : null)}
        >
          <Collapsible.Trigger className="flex w-full items-center justify-between gap-4 bg-panel px-4 py-3 text-left transition-colors hover:bg-panel-2">
            <span className="text-sm font-medium text-ink">{item.q}</span>
            <Plus
              className={cn(
                "size-4 shrink-0 text-ink-faint transition-transform",
                open === i && "rotate-45",
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Content className="overflow-hidden data-[state=open]:animate-fade">
            <p className="bg-panel px-4 pb-4 text-sm leading-relaxed text-ink-muted">
              {item.a}
            </p>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}
    </div>
  );
}
