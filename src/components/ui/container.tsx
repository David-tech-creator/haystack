import { cn } from "@/lib/utils"

/** The page container: max 1280px, 16 / 24 / 40px side gutters (`.wrap`). */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "header" | "footer" | "nav"
  className?: string
  children: React.ReactNode
}) {
  return <Tag className={cn("wrap", className)}>{children}</Tag>
}
