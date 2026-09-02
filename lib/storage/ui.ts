"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  skillLevel: "iniciante" | "avancado";
  setSkillLevel: (v: "iniciante" | "avancado") => void;
}

export const useUI = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      skillLevel: "iniciante",
      setSkillLevel: (v) => set({ skillLevel: v }),
    }),
    {
      name: "imovel-ia:ui",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
