"use client";

import { Heart } from "lucide-react";
import { useFavorites, type FavoriteKind } from "@/lib/storage/favorites";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  kind,
  size = "md",
  className,
  stopPropagation = true,
}: {
  id: string;
  kind: FavoriteKind;
  size?: "sm" | "md";
  className?: string;
  stopPropagation?: boolean;
}) {
  const hydrated = useHydrated();
  const items = useFavorites((s) => s.items);
  const toggle = useFavorites((s) => s.toggle);
  const active = hydrated && items.some((i) => i.id === id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onClick={(e) => {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggle(id, kind);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-hairline-strong bg-canvas/70 text-ink-muted backdrop-blur transition-colors",
        "hover:text-ink hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "sm" ? "size-7" : "size-8",
        active && "border-brand-border text-brand",
        className,
      )}
    >
      <Heart
        className={cn(size === "sm" ? "size-3.5" : "size-4", active && "fill-current")}
      />
    </button>
  );
}
