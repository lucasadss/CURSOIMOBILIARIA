"use client";

import { useEffect } from "react";

/**
 * Global hotkey. `combo` like "mod+k" (mod = Cmd on mac, Ctrl elsewhere),
 * "/" for a bare key. Ignores typing inside inputs unless `allowInInput`.
 */
export function useHotkey(
  combo: string,
  handler: (e: KeyboardEvent) => void,
  opts: { allowInInput?: boolean } = {},
) {
  useEffect(() => {
    const parts = combo.toLowerCase().split("+");
    const needMod = parts.includes("mod");
    const needShift = parts.includes("shift");
    const key = parts[parts.length - 1];

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing && !opts.allowInInput) return;

      const mod = e.metaKey || e.ctrlKey;
      if (needMod && !mod) return;
      if (!needMod && mod) return;
      if (needShift && !e.shiftKey) return;
      if (e.key.toLowerCase() !== key) return;

      e.preventDefault();
      handler(e);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, handler, opts.allowInInput]);
}
