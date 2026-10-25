import Link from "next/link"
import { HaystackMark } from "@/components/ui/haystack-mark"
import { FOOTER } from "@/lib/content"
import { LINKEDIN_URL } from "@/lib/site"

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M4 10 10 4M5.5 4H10v4.5" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-linen">
      <div className="wrap grid-12 gap-y-12 py-[var(--section-y-tight)]">
        <div className="col-span-12 lg:col-span-6">
          <Link href="/" className="-ml-1 inline-flex min-h-11 items-center gap-2.5 px-1" aria-label="Haystack, home">
            <HaystackMark className="h-7 w-7" />
            <span className="font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">Haystack</span>
          </Link>
          <p className="mt-4 max-w-[26rem] text-ink-soft">{FOOTER.blurb}</p>
          <p className="mt-8 font-serif text-[1.75rem] italic leading-tight text-ink">Move the needle.</p>
        </div>

        <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-6 sm:max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div>
            <p className="text-label font-display font-semibold uppercase text-ink-mute">Site</p>
            <ul className="mt-3">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label font-display font-semibold uppercase text-ink-mute">Elsewhere</p>
            <ul className="mt-3">
              <li>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
                  LinkedIn
                  <ExternalIcon />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-1 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-small text-ink-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Haystack · Geneva, Switzerland</p>
          <p>haystack.agency</p>
        </div>
      </div>
    </footer>
  )
}
