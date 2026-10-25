import Link from "next/link"
import { NAV } from "@/lib/site"
import { HeaderShell, NavLink } from "./header-shell"
import { MobileMenu } from "./mobile-menu"

/**
 * Site header: transparent over the top of the page, then a slim blurred
 * cream bar that slides away while you read down and comes back the moment
 * you scroll up (HeaderShell). The phone menu is a <details> element, so it
 * works without JavaScript (MobileMenu).
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="header-bar wrap flex items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Haystack, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/haystack-mark-128.png" alt="" width={40} height={40} className="h-9 w-9 lg:h-10 lg:w-10" />
          <span className="font-display text-xl font-medium tracking-tight text-primary lg:text-2xl">Haystack</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="nav-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-solid btn-sm">
            Start a sprint
          </Link>
        </div>

        <MobileMenu items={NAV} />
      </div>
    </HeaderShell>
  )
}
