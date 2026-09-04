"use client";

import * as React from "react";

/**
 * Muted looping video that only plays while it's actually on screen.
 * With ~10 of these on the landing page, letting every one autoplay
 * regardless of scroll position wastes bandwidth and CPU on clips the
 * visitor hasn't scrolled to yet (and never pauses the ones they scroll
 * past). This plays/pauses off the same IntersectionObserver pattern
 * used by <Reveal>, so it costs nothing extra to set up.
 */
export function AutoplayVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      loop
      muted
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
