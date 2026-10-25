import Link from "next/link"
import { ButtonLink } from "@/components/ui/button"
import { HaystackMark } from "@/components/ui/haystack-mark"
import { FOOTER } from "@/lib/content"
import { NAV } from "@/lib/site"
import { HeaderShell, NavLink } from "./header-shell"
import { MobileMenu } from "./mobile-menu"

/** Mark + wordmark, nav (lg+), one primary action; the phone menu below lg. */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="header-bar wrap flex items-center justify-between gap-6">
        <Link href="/" className="-ml-1 flex min-h-11 items-center gap-2.5 px-1" aria-label="Haystack, home">
          <HaystackMark className="h-7 w-7" />
          <span className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">Haystack</span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="nav-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ButtonLink href="/contact" size="sm" className="hidden lg:inline-flex">
          {FOOTER.cta}
        </ButtonLink>

        <MobileMenu items={NAV} note={FOOTER.menuNote} cta={FOOTER.cta} />
      </div>
    </HeaderShell>
  )
}
