"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PromptFormat, TargetTool } from "@/types";

export interface ModuleVisit {
  slug: string;
  name: string;
  category: string;
  type: string;
  thumbnail?: string;
  lastUsedAt: string;
}

export interface PromptRecord {
  id: string;
  moduleSlug: string;
  moduleName: string;
  tool: TargetTool;
  format: PromptFormat;
  kind: "image" | "video";
  text: string;
  createdAt: string;
}

interface HistoryState {
  visits: ModuleVisit[];
  prompts: PromptRecord[];
  recordVisit: (v: Omit<ModuleVisit, "lastUsedAt">) => void;
  recordPrompt: (p: Omit<PromptRecord, "id" | "createdAt">) => void;
  clearVisits: () => void;
  clearPrompts: () => void;
}

const MAX_VISITS = 20;
const MAX_PROMPTS = 60;

export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      visits: [],
      prompts: [],
      recordVisit: (v) =>
        set((s) => {
          const rest = s.visits.filter((x) => x.slug !== v.slug);
          return {
            visits: [
              { ...v, lastUsedAt: new Date().toISOString() },
              ...rest,
            ].slice(0, MAX_VISITS),
          };
        }),
      recordPrompt: (p) =>
        set((s) => ({
          prompts: [
            {
              ...p,
              id:
                globalThis.crypto?.randomUUID?.() ??
                `p_${Date.now()}_${Math.random().toString(36).slice(2)}`,
              createdAt: new Date().toISOString(),
            },
            ...s.prompts,
          ].slice(0, MAX_PROMPTS),
        })),
      clearVisits: () => set({ visits: [] }),
      clearPrompts: () => set({ prompts: [] }),
    }),
    {
      name: "imovel-ia:history",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
