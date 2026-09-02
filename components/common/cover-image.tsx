import Image from "next/image";
import { BLUR_DATA_URL, type ResolvedCover } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { CoverScene } from "./cover-scene";

/**
 * The one component that renders a cover. Real photo via next/image when the
 * asset layer resolved a `src`; otherwise the category scene. Never holds a URL
 * itself — always driven by a ResolvedCover from lib/assets.
 *
 * The caller sizes the box (aspect-ratio + relative). This just fills it.
 */
export function CoverImage({
  cover,
  seed,
  sizes,
  priority = false,
  rounded,
  showOverlay = true,
  showSceneLabel = true,
  className,
}: {
  cover: ResolvedCover;
  seed: string;
  /** required for real images — avoids shipping oversized files */
  sizes: string;
  priority?: boolean;
  rounded?: string;
  showOverlay?: boolean;
  showSceneLabel?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate size-full overflow-hidden bg-panel-2",
        rounded,
        className,
      )}
    >
      {cover.src ? (
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
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

      {showOverlay && cover.overlayClass ? (
        <div aria-hidden className={cn("absolute inset-0", cover.overlayClass)} />
      ) : null}
    </div>
  );
}
