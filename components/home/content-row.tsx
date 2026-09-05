"use client";

import * as React from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContentRow({
  title,
  kicker,
  subtitle,
  href,
  align = "start",
  children,
  itemWidth = "w-[280px] sm:w-[340px]",
}: {
  title: string;
  /** small editorial label above the title (accent colour) */
  kicker?: string;
  subtitle?: string;
  href?: string;
  /** header alignment — "center" for the training band, "start" elsewhere */
  align?: "start" | "center";
  children: React.ReactNode;
  itemWidth?: string;
}) {
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const onSelect = React.useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  React.useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const items = React.Children.toArray(children);
  const scrollable = canPrev || canNext;
  const centered = align === "center";

  const arrows = scrollable ? (
    <div className="hidden gap-1 md:flex">
      <button
        type="button"
        onClick={() => embla?.scrollPrev()}
        disabled={!canPrev}
        aria-label="Anterior"
        className="flex size-8 items-center justify-center rounded-full border border-hairline bg-elevated/80 text-ink-muted backdrop-blur transition-colors hover:border-hairline-strong hover:text-ink disabled:opacity-25"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => embla?.scrollNext()}
        disabled={!canNext}
        aria-label="Próximo"
        className="flex size-8 items-center justify-center rounded-full border border-hairline bg-elevated/80 text-ink-muted backdrop-blur transition-colors hover:border-hairline-strong hover:text-ink disabled:opacity-25"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  ) : null;

  return (
    <section className="group/row">
      {centered ? (
        <div className="mb-4 flex flex-col items-center gap-1.5 px-4 text-center sm:px-6 lg:px-8">
          {kicker ? (
            <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-brand">
              {kicker}
            </p>
          ) : null}
          <h2 className="text-md font-medium text-ink">{title}</h2>
          {subtitle ? (
            <p className="max-w-[42rem] text-sm text-ink-muted">{subtitle}</p>
          ) : null}
          {href ? (
            <Link
              href={href}
              className="mt-0.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
            >
              Ver todos
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mb-3 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            {kicker ? (
              <p className="mb-1.5 text-2xs font-semibold uppercase tracking-[0.16em] text-brand">
                {kicker}
              </p>
            ) : null}
            <h2 className="text-md font-medium text-ink">{title}</h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {href ? (
              <Link
                href={href}
                className="shrink-0 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Ver todos
              </Link>
            ) : null}
            {arrows}
          </div>
        </div>
      )}

      <div className="overflow-hidden px-4 sm:px-6 lg:px-8" ref={emblaRef}>
        <div className={cn("flex gap-3", centered && !scrollable && "justify-center")}>
          {items.map((child, i) => (
            <div key={i} className={cn("min-w-0 shrink-0", itemWidth)}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
