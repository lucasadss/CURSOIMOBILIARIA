"use client";

import * as React from "react";
import Image from "next/image";
import { BLUR_DATA_URL, type ResolvedCover } from "@/lib/assets";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { CoverScene } from "./cover-scene";

/**
 * Cover with an optional hover-preview video. Same visual contract as
 * <CoverImage>, but for the handful of modules that carry a `previewVideo`.
 *
 * The clip only starts on hover (desktop pointers only), is muted/looped/
 * controls-free, is never fetched until the first hover, and reverts to the
 * static thumbnail the moment the pointer leaves. Respects reduced motion —
 * on mobile, or with the OS motion setting off, this is just <CoverImage>.
 */
export function CoverVideo({
  cover,
  seed,
  sizes,
  rounded,
  showOverlay = true,
  showSceneLabel = true,
  className,
}: {
  cover: ResolvedCover;
  seed: string;
  sizes: string;
  rounded?: string;
  showOverlay?: boolean;
  showSceneLabel?: boolean;
  className?: string;
}) {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const loadedRef = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);

  const enabled = Boolean(cover.previewVideo) && canHover && !reduceMotion;

  function start() {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;
    if (!loadedRef.current) {
      v.src = cover.previewVideo!;
      v.load();
      loadedRef.current = true;
    }
    v.play().catch(() => {});
    setPlaying(true);
  }

  function stop() {
    setPlaying(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  return (
    <div
      className={cn(
        "relative isolate size-full overflow-hidden bg-panel-2",
        rounded,
        className,
      )}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {cover.src ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
          style={{ objectPosition: cover.position }}
        />
      ) : (
        <CoverScene
          scene={cover.scene}
          seed={seed}
          label={showSceneLabel ? cover.sceneLabel : undefined}
        />
      )}

      {enabled ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className={cn(
            "pointer-events-none absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300",
            playing && "opacity-100",
          )}
        />
      ) : null}

      {showOverlay && cover.overlayClass ? (
        <div aria-hidden className={cn("absolute inset-0", cover.overlayClass)} />
      ) : null}
    </div>
  );
}
