"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useHotkey } from "@/hooks/use-hotkey";
import { useSearch } from "@/lib/storage/search";
import { SearchDialog } from "./search-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  const toggle = useSearch((s) => s.toggle);
  const setOpen = useSearch((s) => s.setOpen);

  useHotkey("mod+k", () => toggle(), { allowInInput: true });
  useHotkey("/", () => setOpen(true));

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      {children}
      <SearchDialog />
    </TooltipProvider>
  );
}
