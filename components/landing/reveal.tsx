"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Fades a block up into place the first time it enters the viewport.
 * Content already visible on load (or with reduced-motion on) renders
 * shown immediately, never a flash of hidden content.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight * 0.92;

    if (reduced || alreadyVisible) {
      setShown(true);
      return;
    }

    setReady(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        ready && !shown && "translate-y-5 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
