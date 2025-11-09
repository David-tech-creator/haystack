import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-[#fefbf4] shadow dark:bg-[#f6d891] dark:text-primary",
        secondary: "border-transparent bg-[#f6d891] text-primary dark:bg-[#fce8b0] dark:text-primary",
        outline: "border-[#e3d7be]/70 bg-transparent text-primary dark:border-[#cbbd9e]/40 dark:text-wheat-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }
