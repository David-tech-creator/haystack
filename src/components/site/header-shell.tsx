"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

const TOP = 72 // px: above this the header is the transparent top-of-page header
const UP = 8 // px of upward scroll that brings it back
const BOTTOM = 200 // px from the end of the page where it always shows

type State = "top" | "shown" | "hidden"

/**
 * Smart sticky header (pattern from the Rive Foundry site): fixed,
 * transparent over the top of the page, a slim blurred bar further down.
 * Scrolling down slides it away, any upward scroll brings it back. It stays
 * put while the phone menu is open, while a link in it has keyboard focus and
 * near the end of the page. The state lives in a data-state attribute
 * written through a ref: no React render per scroll. Without JavaScript the
 * bar simply stays visible (noscript style).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lastY = window.scrollY
    let upRun = 0
    let state: State | null = null
    let raf = 0

    const pinned = () => {
      if (el.querySelector("details[open]")) return true
      const a = document.activeElement
      if (a && el.contains(a) && a.matches(":focus-visible")) return true
      const doc = document.documentElement
      return window.scrollY + window.innerHeight >= doc.scrollHeight - BOTTOM
    }

    const set = (next: State) => {
      if (next === state) return
      state = next
      el.dataset.state = next
    }

    const update = () => {
      raf = 0
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      if (y < TOP) {
        upRun = 0
        set("top")
        return
      }
      if (pinned()) {
        upRun = 0
        set("shown")
        return
      }
      if (dy > 0) {
        upRun = 0
        set("hidden")
      } else if (dy < 0) {
        upRun -= dy
        if (upRun > UP || state === "top" || state === null) set("shown")
      } else if (state === null || state === "top") {
        set("shown")
      }
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    // menu toggles and focus changes re-check the pins straight away
    const recheck = () => {
      if (window.scrollY >= TOP && pinned()) set("shown")
      else schedule()
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    el.addEventListener("toggle", recheck, true)
    el.addEventListener("focusin", recheck)
    el.addEventListener("focusout", schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      el.removeEventListener("toggle", recheck, true)
      el.removeEventListener("focusin", recheck)
      el.removeEventListener("focusout", schedule)
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
