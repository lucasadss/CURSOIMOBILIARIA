import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const C = {
  bgDark: "#0D0D0D",
  surfaceDark: "#161616",
  surfaceDark2: "#1D1D1B",
  surfaceLight: "#F3EFE8",
  surfaceLight2: "#E8E1D7",
  brand: "#E86A24",
  brandHover: "#D85D1D",
  brandSoft: "#B96F4B",
  olive: "#6E775F",
  textLight: "#F7F4EF",
  textMutedDark: "#A8A39B",
  textDark: "#191817",
  textMutedLight: "#68635D",
};

type Tone = "dark" | "light";

const toneVars: Record<Tone, React.CSSProperties> = {
  dark: {
    background: C.bgDark,
    color: C.textLight,
    // @ts-expect-error custom props
    "--surface": C.surfaceDark,
    "--surface-2": C.surfaceDark2,
    "--muted": C.textMutedDark,
    "--hairline": "rgba(247,244,239,0.10)",
    "--hairline-strong": "rgba(247,244,239,0.18)",
  },
  light: {
    background: C.surfaceLight,
    color: C.textDark,
    // @ts-expect-error custom props
    "--surface": "#FFFFFF",
    "--surface-2": C.surfaceLight2,
    "--muted": C.textMutedLight,
    "--hairline": "rgba(25,24,23,0.10)",
    "--hairline-strong": "rgba(25,24,23,0.18)",
  },
};

export function Section({
  tone,
  id,
  center = true,
  className,
  children,
}: {
  tone: Tone;
  id?: string;
  /** center the inner content (default). Header bars opt out. */
  center?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={toneVars[tone]}
      className={cn("px-5 py-20 sm:px-8 md:py-28", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1200px]",
          center && "text-center",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
  align = "center",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-[44rem] text-center" : "max-w-[40rem]",
        className,
      )}
    >
      {kicker ? (
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.14em]"
          style={{ color: C.brand }}
        >
          {kicker}
        </p>
      ) : null}
      <h2 className="text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[2.1rem] md:text-[2.5rem]">
        {title}
      </h2>
      {lead ? (
        <p
          className="mt-4 text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--muted)" }}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Accent word inside a heading. */
export function Hl({ children }: { children: React.ReactNode }) {
  return <span style={{ color: C.brand }}>{children}</span>;
}

/** A short, loud statement used as a moment of impact between blocks. */
export function ImpactLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-balance text-lg font-bold uppercase leading-[1.25] tracking-[0.01em] sm:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Wordmark({
  tone = "dark",
  className,
}: {
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[0.95rem] font-bold tracking-[-0.01em]",
        tone === "dark" ? "text-[#F7F4EF]" : "text-[#191817]",
        className,
      )}
    >
      IMOV<span style={{ color: C.brand }}>IX</span>
    </span>
  );
}

export function Cta({
  children,
  href = "#oferta",
  variant = "primary",
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost";
  tone?: Tone;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-[background-color,border-color,transform,color] duration-200 hover:-translate-y-px";
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={cn(base, "text-white", className)}
        style={{ background: C.brand }}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        base,
        "border",
        tone === "dark"
          ? "border-[rgba(247,244,239,0.2)] text-[#F7F4EF] hover:border-[rgba(247,244,239,0.4)]"
          : "border-[rgba(25,24,23,0.2)] text-[#191817] hover:border-[rgba(25,24,23,0.4)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--hairline)] p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color:var(--hairline-strong)]",
        className,
      )}
      style={{ background: "var(--surface)" }}
    >
      {children}
    </div>
  );
}
