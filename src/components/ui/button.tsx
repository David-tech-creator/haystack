import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost"
type Size = "md" | "sm"

/* Literal class names so Tailwind's content scan keeps every variant. */
const VARIANT: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
}

/** Class string for a button-styled element. Same as `.btn .btn-<variant> [.btn-sm]`. */
export function buttonClass({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn("btn", VARIANT[variant], size === "sm" && "btn-sm", className)
}

function Arrow({ external }: { external?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("btn-icon", external && "btn-icon-ext")}
    >
      {external ? <path d="M4 10 10 4M5.5 4H10v4.5" /> : <path d="M2 7h10M8 3l4 4-4 4" />}
    </svg>
  )
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  external = false,
  className,
  children,
  ...rest
}: {
  href: string
  variant?: Variant
  size?: Size
  arrow?: boolean
  external?: boolean
  className?: string
  children: React.ReactNode
  onClick?: never
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children" | "onClick">) {
  const cls = buttonClass({ variant, size, className })
  const icon = arrow || external ? <Arrow external={external} /> : null
  if (external) {
    const { prefetch, replace, scroll, shallow, passHref, legacyBehavior, locale, ...anchor } = rest
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...anchor}>
        {children}
        {icon}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      {icon}
    </Link>
  )
}

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; arrow?: boolean }) {
  return (
    <button type={type} className={buttonClass({ variant, size, className })} {...rest}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  )
}
