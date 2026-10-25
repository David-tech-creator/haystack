import type { ReactNode } from "react"

export { NavLink } from "./nav-link"

/**
 * Sticky header bar. Its paper surface and hairline fade in over the first
 * 24px of scroll with a CSS scroll-driven animation (globals.css); without
 * support it is simply solid. No JavaScript.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  return <header className="site-header">{children}</header>
}
