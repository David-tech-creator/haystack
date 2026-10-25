"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { NavLink } from "./header-shell"

type Item = { href: string; label: string }

/**
 * Phone and tablet menu. A <details> element, so it opens without
 * JavaScript; once hydrated it also closes on a tap outside, on Escape, after
 * picking a link and on any route change.
 */
export function MobileMenu({ items }: { items: readonly Item[] }) {
  const ref = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (ref.current) ref.current.open = false
  }, [pathname])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const close = () => {
      if (el.open) el.open = false
    }
    const onPointer = (e: PointerEvent) => {
      if (el.open && !el.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        close()
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
    <details ref={ref} className="mobile-menu group relative lg:hidden">
      <summary
        aria-label="Menu"
        className="-mr-2 flex h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden"
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span className="absolute inset-x-0 top-0 h-0.5 rounded bg-current transition-transform duration-200 group-open:translate-y-[5px] group-open:rotate-45" />
          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded bg-current transition-transform duration-200 group-open:-translate-y-[5px] group-open:-rotate-45" />
        </span>
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <div className="mobile-sheet absolute right-0 top-[calc(100%+0.5rem)] w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-line bg-[#fefbf4] p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">A small recruitment agency in Geneva.</p>
        <nav aria-label="Main" className="mt-3">
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="menu-link" onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/contact" className="btn-solid mt-4 w-full" onClick={close}>
          Start a sprint
        </Link>
      </div>
    </details>
  )
}
