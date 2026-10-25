import Link from "next/link"
import { LINKEDIN_URL } from "@/lib/site"

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
]

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-line bg-[#f6f0e2]">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
        <div className="max-w-md">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/haystack-mark-64.png" alt="" width={32} height={32} className="h-8 w-8" loading="lazy" />
            <span className="font-display text-xl font-medium tracking-tight text-primary">Haystack</span>
          </Link>
          <p className="mt-4 text-primary/75">
            A small recruitment agency in Geneva. Shortlists with a written note on every person, and an honest update
            every week.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 text-primary">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-primary/70 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Haystack</p>
        <p className="font-script text-base italic text-primary/80">Move the needle.</p>
      </div>
    </footer>
  )
}
