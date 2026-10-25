"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/** Nav link that marks itself aria-current="page" when it is where you are. */
export function NavLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string
  className?: string
  onClick?: () => void
  children: ReactNode
}) {
  const pathname = usePathname() || "/"
  const current = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link href={href} className={className} aria-current={current ? "page" : undefined} onClick={onClick}>
      {children}
    </Link>
  )
}
