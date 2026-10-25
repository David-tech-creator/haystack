import { cn } from "@/lib/utils"

export type SectionTone = "paper" | "linen" | "deep"

const TONE: Record<SectionTone, string> = {
  paper: "bg-paper",
  linen: "bg-linen",
  deep: "bg-deep text-on-deep",
}

const SPACING = {
  default: "py-[var(--section-y)]",
  tight: "pt-[var(--section-top-tight)] pb-[var(--section-y-tight)]",
  "flush-top": "pb-[var(--section-y)]",
  none: "",
} as const

/**
 * A page band. `tone="deep"` sets data-tone="deep", which every dark-aware
 * primitive (eyebrow, buttons, links, focus ring, Faq, Card, Frame) keys off.
 */
export function Section({
  id,
  labelledBy,
  tone = "paper",
  spacing = "default",
  rule = false,
  className,
  children,
}: {
  id?: string
  labelledBy?: string
  tone?: SectionTone
  spacing?: "default" | "tight" | "flush-top" | "none"
  rule?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === "deep" ? "deep" : undefined}
      className={cn(
        "relative",
        TONE[tone],
        SPACING[spacing],
        rule && (tone === "deep" ? "border-t border-deep-line" : "border-t border-line"),
        className,
      )}
    >
      {children}
    </section>
  )
}
