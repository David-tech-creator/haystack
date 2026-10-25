/**
 * The Haystack mark as SVG, rebuilt from the same numbers as the logo
 * (src/lib/formations/strands.ts). Geometry unchanged from the old static mark.
 */
import { STRAND_WIDTH, haystackStrands } from "@/lib/formations/strands"

const STRAW = { ink: "#1A2136", paper: "#F6F1E7" } as const
const GOLD = "#C29A3E"

const f = (v: number) => (v * 100).toFixed(2)
// Deterministic: compute once per server process.
const STRANDS = haystackStrands()

export function HaystackMark({
  className,
  title,
  tone = "ink",
}: {
  className?: string
  title?: string
  tone?: "ink" | "paper"
}) {
  return (
    <svg
      viewBox="-104 -104 208 208"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <g strokeLinecap="round" strokeWidth={STRAND_WIDTH * 100}>
        {STRANDS.map((s, i) => (
          <line key={i} x1={f(s.ax)} y1={f(-s.ay)} x2={f(s.bx)} y2={f(-s.by)} stroke={s.gold ? GOLD : STRAW[tone]} />
        ))}
      </g>
    </svg>
  )
}
