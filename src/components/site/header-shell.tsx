import type { ReactNode } from "react"
import { HeaderTone } from "./header-tone"

export { NavLink } from "./nav-link"

/**
 * Sticky header bar. Its paper surface and hairline fade in over the first
 * 24px of scroll with a CSS scroll-driven animation (globals.css); without
 * support it is simply solid. Over a navy band it turns navy with cream text
 * (HeaderTone sets data-over="deep"; the colours are CSS).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  return (
    <header className="site-header">
      {children}
      <HeaderTone />
    </header>
  )
}
