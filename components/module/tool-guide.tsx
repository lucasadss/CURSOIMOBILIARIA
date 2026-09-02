"use client";

import * as React from "react";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import type { ToolGuideConfig } from "@/types";
import { getToolProfile } from "@/lib/prompt-engine";
import { cn } from "@/lib/utils";

export function ToolGuide({ guide }: { guide?: ToolGuideConfig }) {
  const [open, setOpen] = React.useState(false);
  if (!guide) return null;
  const tool = getToolProfile(guide.tool);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg bg-panel-2/50"
    >
      <Collapsible.Trigger className="flex w-full items-center justify-between gap-3 p-3 text-left">
        <div className="min-w-0">
          <p className="section-label text-ink-muted">Como gerar</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-ink">
            <span className="font-medium">{tool.label}</span>
            {guide.path.map((p, i) => (
              <React.Fragment key={i}>
                <span className="text-ink-faint">/</span>
                <span className="text-ink-muted">{p}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-ink-faint transition-transform",
            open && "rotate-180",
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-fade">
        <div className="px-3 pb-3">
          <ol className="space-y-2 border-t border-hairline pt-3">
            {guide.steps.map((s, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
              >
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-2xs text-ink-faint">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          {tool.note ? (
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              {tool.note}
            </p>
          ) : null}
          {guide.walkthroughHref ? (
            <Link
              href={guide.walkthroughHref}
              className="mt-3 inline-block text-xs font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline"
            >
              Ver passo a passo
            </Link>
          ) : null}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
