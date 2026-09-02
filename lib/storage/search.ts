"use client";

import { create } from "zustand";

interface SearchState {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

/** Ephemeral — command palette visibility. Not persisted. */
export const useSearch = create<SearchState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
