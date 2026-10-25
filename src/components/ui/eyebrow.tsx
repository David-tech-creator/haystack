import { cn } from "@/lib/utils"

/** Small uppercase label with the gold tick. `index` ("01") sits before the tick. */
export function Eyebrow({
  children,
  as: Tag = "p",
  index,
  className,
}: {
  children: React.ReactNode
  as?: "p" | "span" | "h2"
  index?: string
  className?: string
}) {
  return (
    <Tag className={cn("eyebrow", className)}>
      {index ? <span className="eyebrow-index">{index}</span> : null}
      <span aria-hidden="true" className="eyebrow-tick" />
      <span>{children}</span>
    </Tag>
  )
}
