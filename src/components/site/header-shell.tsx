"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

const TOP = 72 // px: above this the header is the transparent top-of-page header

/**
 * Sticky header (pattern from the Rive Foundry site): always fixed and
 * visible, transparent over the top of the page, a slim blurred bar further
 * down. The state lives in a data-state attribute written through a ref: no
 * React render per scroll. Without JavaScript the bar simply stays visible
 * (noscript style).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let state = ""
    let raf = 0
    const update = () => {
      raf = 0
      const next = window.scrollY < TOP ? "top" : "shown"
      if (next !== state) el.dataset.state = state = next
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <header ref={ref} data-state="top" className="site-header">
      <noscript>
        <style>{".site-header{background:rgba(246,240,226,0.9);border-bottom-color:#e3d7be;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}"}</style>
      </noscript>
      {children}
    </header>
  )
}

/** Header nav link that marks itself aria-current="page" when it is where you are. */
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
