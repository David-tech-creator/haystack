import { cn } from "@/lib/utils"

/** Bulleted list with a tiny gold needle (or dot) as the marker. */
export function CheckList({
  items,
  marker = "needle",
  className,
}: {
  items: readonly string[]
  marker?: "needle" | "dot"
  className?: string
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-ink">
          <span aria-hidden="true" className={cn("check-marker", marker === "needle" ? "check-needle" : "check-dot")} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
