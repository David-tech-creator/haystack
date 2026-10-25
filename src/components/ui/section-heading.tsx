import { cn } from "@/lib/utils"
import { Eyebrow } from "./eyebrow"

const SIZE = {
  "display-xl": "text-display-xl",
  display: "text-display",
  h2: "text-h2",
} as const

/**
 * Eyebrow + title + lead. `children` render directly after the lead with no
 * wrapper, so callers own their spacing (e.g. `<div className="mt-8 ...">` CTAs).
 */
export function SectionHeading({
  eyebrow,
  index,
  title,
  titleId,
  as: Tag = "h2",
  size,
  lead,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string
  index?: string
  title: React.ReactNode
  titleId: string
  as?: "h1" | "h2"
  size?: "display-xl" | "display" | "h2"
  lead?: React.ReactNode
  align?: "left" | "center"
  className?: string
  children?: React.ReactNode
}) {
  const s = size ?? (Tag === "h1" ? "display" : "h2")
  const center = align === "center"
  return (
    <div className={cn(center && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
      <Tag id={titleId} className={cn(SIZE[s], "font-medium", eyebrow && "mt-4", center && "mx-auto")}>
        {title}
      </Tag>
      {lead ? (
        <p className={cn("mt-5 max-w-[34rem] text-lead text-ink-soft", center && "mx-auto")}>{lead}</p>
      ) : null}
      {children}
    </div>
  )
}
