import type { SceneId } from "@/lib/assets";
import { hashSeed } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ============================================================================
   CoverScene — the fallback shown until a real photo exists for a module.
   Warm dark architectural illustration that *depicts the subject* of each
   category. Not an abstract gradient. Deterministic, with a small per-item
   jitter from `seed` so a row of cards isn't pixel-identical.
   ========================================================================== */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const STROKE = "rgba(255,255,255,0.14)";
const STROKE_SOFT = "rgba(255,255,255,0.07)";
const FILL_SOFT = "rgba(255,255,255,0.03)";
const WARM = "rgba(201,102,46,0.4)";

function Scene({ id, j }: { id: SceneId; j: number }) {
  // j: 0..1 jitter
  const dx = (j - 0.5) * 12;

  switch (id) {
    case "terrenos":
      return (
        <g fill="none" strokeLinejoin="round">
          <rect x="0" y="58" width="160" height="32" fill={FILL_SOFT} />
          <line x1="0" y1="58" x2="160" y2="58" stroke={STROKE_SOFT} />
          <path
            d={`M${30 + dx} 74 L${74 + dx} 46 L${128 + dx} 60 L${96 + dx} 82 Z`}
            stroke={WARM}
            strokeWidth="1.1"
          />
          <path
            d={`M${30 + dx} 74 L${96 + dx} 82`}
            stroke={WARM}
            strokeWidth="0.5"
            strokeDasharray="2 3"
          />
          <rect x="8" y="30" width="18" height="20" fill={FILL_SOFT} stroke={STROKE_SOFT} />
          <rect x="132" y="24" width="20" height="26" fill={FILL_SOFT} stroke={STROKE_SOFT} />
          <line x1="0" y1="50" x2="160" y2="46" stroke={STROKE_SOFT} strokeWidth="0.5" />
        </g>
      );

    case "construcao":
      return (
        <g fill="none" strokeLinecap="round">
          <line x1="0" y1="78" x2="160" y2="78" stroke={STROKE} />
          {/* building frame */}
          <g stroke={STROKE} strokeWidth="1">
            <rect x={44 + dx} y="30" width="46" height="48" fill={FILL_SOFT} />
            <line x1={44 + dx} y1="42" x2={90 + dx} y2="42" />
            <line x1={44 + dx} y1="54" x2={90 + dx} y2="54" />
            <line x1={44 + dx} y1="66" x2={90 + dx} y2="66" />
            <line x1={59 + dx} y1="30" x2={59 + dx} y2="78" />
            <line x1={75 + dx} y1="30" x2={75 + dx} y2="78" />
          </g>
          {/* crane */}
          <g stroke={STROKE} strokeWidth="1">
            <line x1={112 + dx} y1="20" x2={112 + dx} y2="78" />
            <line x1={82 + dx} y1="20" x2={138 + dx} y2="20" />
            <line x1={112 + dx} y1="20" x2={122 + dx} y2="12" />
            <line x1={122 + dx} y1="12" x2={92 + dx} y2="20" />
            <line x1={128 + dx} y1="20" x2={128 + dx} y2="30" strokeWidth="0.6" />
          </g>
        </g>
      );

    case "interiores":
      return (
        <g fill="none">
          {/* one-point perspective room */}
          <polygon points="18,20 142,20 118,64 42,64" fill={FILL_SOFT} stroke={STROKE_SOFT} />
          <line x1="18" y1="20" x2="42" y2="64" stroke={STROKE_SOFT} />
          <line x1="142" y1="20" x2="118" y2="64" stroke={STROKE_SOFT} />
          <rect x="42" y="64" width="76" height="18" fill={FILL_SOFT} />
          <line x1="42" y1="64" x2="118" y2="64" stroke={STROKE} />
          {/* window */}
          <rect x={30 + dx * 0.4} y="28" width="16" height="18" stroke={STROKE_SOFT} />
          {/* sofa */}
          <rect x={62 + dx * 0.4} y="56" width="34" height="10" rx="2" fill={FILL_SOFT} stroke={STROKE} />
          <rect x={60 + dx * 0.4} y="52" width="6" height="14" rx="2" stroke={STROKE} />
          {/* pendant light */}
          <line x1="88" y1="20" x2="88" y2="34" stroke={STROKE_SOFT} />
          <circle cx="88" cy="36" r="2.4" stroke={STROKE} />
        </g>
      );

    case "imovel-pronto":
      return (
        <g fill="none" strokeLinejoin="round">
          <line x1="0" y1="76" x2="160" y2="76" stroke={STROKE_SOFT} />
          <g stroke={STROKE} strokeWidth="1">
            <path d={`M${52 + dx} 76 L${52 + dx} 44 L${84 + dx} 26 L${116 + dx} 44 L${116 + dx} 76 Z`} fill={FILL_SOFT} />
            <rect x={78 + dx} y="58" width="12" height="18" />
            <rect x={60 + dx} y="50" width="10" height="10" />
            <rect x={98 + dx} y="50" width="10" height="10" />
          </g>
          {/* tree */}
          <line x1={132 + dx} y1="76" x2={132 + dx} y2="62" stroke={STROKE_SOFT} />
          <circle cx={132 + dx} cy="56" r="8" fill={FILL_SOFT} stroke={STROKE_SOFT} />
        </g>
      );

    case "cinematograficos":
      return (
        <g fill="none">
          <rect x="0" y="0" width="160" height="12" fill="rgba(0,0,0,0.55)" />
          <rect x="0" y="78" width="160" height="12" fill="rgba(0,0,0,0.55)" />
          <line x1="0" y1="60" x2="160" y2="56" stroke={STROKE_SOFT} />
          <path
            d={`M${96 + dx} 56 L${96 + dx} 42 L${108 + dx} 34 L${120 + dx} 42 L${120 + dx} 56 Z`}
            fill="rgba(0,0,0,0.4)"
            stroke={STROKE}
          />
          <circle cx="34" cy="26" r="10" stroke={STROKE_SOFT} />
          <line x1="0" y1="70" x2="160" y2="66" stroke={FILL_SOFT} strokeWidth="6" />
        </g>
      );

    case "redes-sociais":
      return (
        <g fill="none">
          <rect x="58" y="14" width="44" height="62" rx="6" fill={FILL_SOFT} stroke={STROKE} />
          <line x1="72" y1="20" x2="88" y2="20" stroke={STROKE_SOFT} />
          <path d={`M${74} 44 L${74} 56 L${86} 50 Z`} fill="rgba(255,255,255,0.12)" />
          <path d="M64 66 L74 58 L84 64 L96 54 L96 70 L64 70 Z" fill={FILL_SOFT} stroke={STROKE_SOFT} />
        </g>
      );

    default:
      return (
        <g fill="none">
          <rect x={70 + dx} y="34" width="20" height="20" rx="4" stroke={STROKE} />
          <line x1="30" y1="66" x2="130" y2="66" stroke={STROKE_SOFT} />
          <line x1="46" y1="30" x2="46" y2="60" stroke={STROKE_SOFT} />
          <line x1="114" y1="30" x2="114" y2="60" stroke={STROKE_SOFT} />
        </g>
      );
  }
}

export function CoverScene({
  scene,
  seed,
  label,
  className,
}: {
  scene: SceneId;
  seed: string;
  /** small text bottom-left (category / "Treinamento") */
  label?: string;
  className?: string;
}) {
  const h = hashSeed(seed);
  const j = (h % 1000) / 1000;

  return (
    <div
      className={cn("relative isolate size-full overflow-hidden bg-panel-2", className)}
      style={{
        backgroundImage:
          "linear-gradient(180deg, #161618 0%, #0f0f10 70%, #0c0c0d 100%)",
      }}
    >
      <svg
        aria-hidden
        viewBox="0 0 160 90"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full opacity-90"
      >
        <Scene id={scene} j={j} />
      </svg>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{ backgroundImage: GRAIN }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, rgba(0,0,0,0.45), transparent 70%)",
        }}
      />
      {label ? (
        <span className="absolute bottom-2 left-2.5 text-2xs font-medium text-white/45">
          {label}
        </span>
      ) : null}
    </div>
  );
}
