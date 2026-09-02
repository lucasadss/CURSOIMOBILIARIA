"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FavoriteKind = "module" | "training" | "tool";

export interface FavoriteEntry {
  id: string;
  kind: FavoriteKind;
  addedAt: string;
}

interface FavoritesState {
  items: FavoriteEntry[];
  toggle: (id: string, kind: FavoriteKind) => void;
  has: (id: string) => boolean;
  byKind: (kind: FavoriteKind) => FavoriteEntry[];
  clear: () => void;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id, kind) =>
        set((s) => {
          const exists = s.items.some((i) => i.id === id);
          return {
            items: exists
              ? s.items.filter((i) => i.id !== id)
              : [{ id, kind, addedAt: new Date().toISOString() }, ...s.items],
          };
        }),
      has: (id) => get().items.some((i) => i.id === id),
      byKind: (kind) => get().items.filter((i) => i.kind === kind),
      clear: () => set({ items: [] }),
    }),
    {
      name: "imovel-ia:favorites",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
