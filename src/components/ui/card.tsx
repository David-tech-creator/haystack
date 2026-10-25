import { cn } from "@/lib/utils"

const TONE = { raised: "card-raised", outline: "card-outline", deep: "card-deep" } as const
const PAD = { md: "p-6", lg: "p-7 lg:p-9" } as const

export function Card({
  as: Tag = "div",
  tone = "raised",
  padding = "md",
  stitch = false,
  className,
  id,
  children,
}: {
  as?: "div" | "li" | "article" | "aside"
  tone?: "raised" | "outline" | "deep"
  padding?: "md" | "lg"
  stitch?: boolean
  className?: string
  id?: string
  children: React.ReactNode
}) {
  return (
    <Tag id={id} className={cn("card", TONE[tone], PAD[padding], stitch && "card-stitch", className)}>
      {children}
    </Tag>
  )
}
