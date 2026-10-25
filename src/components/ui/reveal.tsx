import { cn } from "@/lib/utils"

/**
 * Fade + 12px rise as it scrolls into view. Pure CSS (scroll-driven
 * animation); without support or with reduced motion the content is simply
 * there. Never use above the fold.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: "div" | "li" | "section" | "figure" | "p"
  delay?: 0 | 1 | 2 | 3
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag className={cn("reveal", className)} data-delay={delay || undefined}>
      {children}
    </Tag>
  )
}
