"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Marks the header with data-over="deep" while a navy band
 * ([data-tone="deep"]) sits under it, so it can switch to its navy variant.
 * One IntersectionObserver with a 1px probe line through the middle of the
 * bar: no scroll handler. Stays cream while the phone menu is open.
 */
export function HeaderTone() {
  const ref = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const header = ref.current?.parentElement
    if (!header || typeof IntersectionObserver === "undefined") return
    const menu = header.querySelector("details")
    const hits = new Set<Element>()
    let io: IntersectionObserver | null = null
    let frame = 0

    const apply = () => {
      const deep = hits.size > 0 && !menu?.open
      if (deep) header.dataset.over = "deep"
      else delete header.dataset.over
    }

    const build = () => {
      frame = 0
      io?.disconnect()
      hits.clear()
      const probe = Math.round(header.offsetHeight / 2)
      const below = Math.max(0, window.innerHeight - probe - 1)
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target)
            else hits.delete(e.target)
          }
          apply()
        },
        { rootMargin: `-${probe}px 0px -${below}px 0px` },
      )
      document.querySelectorAll('[data-tone="deep"]').forEach((el) => {
        if (!header.contains(el)) io?.observe(el)
      })
      apply()
    }
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(build)
    }

    build()
    window.addEventListener("resize", onResize)
    menu?.addEventListener("toggle", apply)
    return () => {
      io?.disconnect()
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("resize", onResize)
      menu?.removeEventListener("toggle", apply)
      delete header.dataset.over
    }
  }, [pathname])

  return <span ref={ref} hidden />
}
