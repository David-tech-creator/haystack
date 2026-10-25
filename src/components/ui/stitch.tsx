import { cn } from "@/lib/utils"

/** Decorative running stitch with a knot at its left end. */
export function Stitch({ className, tone = "gold" }: { className?: string; tone?: "gold" | "ink" }) {
  return <div aria-hidden="true" className={cn("stitch", tone === "ink" && "stitch-ink", className)} />
}
