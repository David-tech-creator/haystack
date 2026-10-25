/**
 * Server-rendered fallbacks for reduced motion and no WebGL: the same
 * haystack the particles draw, as an SVG, and a needle lifted out of a pile.
 * Both carry .pf-static and hide themselves while the field runs.
 */
import { STRAND_WIDTH, haystackStrands } from "@/lib/formations/strands"
import { createRng } from "@/lib/formations/random"

const NAVY = "#253e5e"
const GOLD = "#c9a046"

export function HaystackMark({ className, title }: { className?: string; title?: string }) {
  const strands = haystackStrands()
  const f = (v: number) => (v * 100).toFixed(2)
  return (
    <svg
      viewBox="-104 -104 208 208"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g strokeLinecap="round" strokeWidth={STRAND_WIDTH * 100}>
        {strands.map((s, i) => (
          <line key={i} x1={f(s.ax)} y1={f(-s.ay)} x2={f(s.bx)} y2={f(-s.by)} stroke={s.gold ? GOLD : NAVY} />
        ))}
      </g>
    </svg>
  )
}

export function StaticHaystack({ className }: { className?: string }) {
  return (
    <div className={`pf-static ${className ?? ""}`}>
      <HaystackMark className="h-auto w-full" />
    </div>
  )
}

/** A needle rising out of a low pile of straw. */
export function StaticNeedle({ className }: { className?: string }) {
  const rng = createRng(5)
  const straws = Array.from({ length: 46 }, () => {
    const cx = (rng() * 2 - 1) * 92
    const h = 30 * Math.max(0, 1 - (cx / 100) ** 2)
    const cy = 86 - rng() * h
    const a = (rng() - 0.5) * 1.4
    const l = 8 + rng() * 16
    return { x1: cx - Math.cos(a) * l, y1: cy - Math.sin(a) * l, x2: cx + Math.cos(a) * l, y2: cy + Math.sin(a) * l }
  })
  return (
    <div className={`pf-static ${className ?? ""}`}>
      <svg viewBox="-100 -100 200 200" className="h-auto w-full" aria-hidden="true">
        <g stroke={NAVY} strokeOpacity={0.45} strokeWidth={3.2} strokeLinecap="round">
          {straws.map((s, i) => (
            <line key={i} x1={s.x1.toFixed(1)} y1={s.y1.toFixed(1)} x2={s.x2.toFixed(1)} y2={s.y2.toFixed(1)} />
          ))}
        </g>
        <g transform="rotate(11)">
          <path d="M0 64 L-3.2 10 L-3.2 -62 Q0 -70 3.2 -62 L3.2 10 Z" fill={NAVY} />
          <path d="M1.4 -6 L1.4 -60" stroke={GOLD} strokeWidth={1.2} />
          <ellipse cx="0" cy="-50" rx="1.2" ry="7" fill="#fbf6ec" />
        </g>
      </svg>
    </div>
  )
}
