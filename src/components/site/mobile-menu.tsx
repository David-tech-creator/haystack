"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { NavLink } from "./nav-link"

type Item = { href: string; label: string }

/**
 * Phone and tablet menu. A <details> element, so it opens without
 * JavaScript; once hydrated it also closes on a tap outside, on Escape, after
 * picking a link and on any route change.
 */
export function MobileMenu({ items, note, cta }: { items: readonly Item[]; note: string; cta: string }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()
  const lastPath = useRef(pathname)

  // Close on route change (not on mount, so a tap made before hydration sticks).
  useEffect(() => {
    if (lastPath.current !== pathname && ref.current) ref.current.open = false
    lastPath.current = pathname
  }, [pathname])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onPointer = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) el.open = false
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        el.open = false
        el.querySelector("summary")?.focus()
      }
    }
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  const close = () => {
    if (ref.current) ref.current.open = false
  }

  return (
    <details ref={ref} className="mobile-menu group lg:hidden" suppressHydrationWarning>
      <summary className="menu-trigger">
        <span aria-hidden="true" className="menu-bars" />
        <span className="sr-only group-open:hidden">Menu</span>
        <span className="sr-only hidden group-open:inline">Close</span>
      </summary>
      <div className="mobile-sheet">
        <div className="wrap pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <p className="text-label font-display font-semibold uppercase text-ink-mute">{note}</p>
          <nav aria-label="Main" className="mt-4">
            <ul className="border-t border-line">
              {items.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="menu-link" onClick={close}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link href="/contact" className="btn btn-primary mt-6 w-full" onClick={close}>
            {cta}
          </Link>
        </div>
      </div>
    </details>
  )
}
