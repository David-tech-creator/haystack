import Link from "next/link"
import type { Route } from "next"

import { siteConfig } from "@/lib/site-config"

type FooterLink = {
  href: string
  label: string
  external?: boolean
}

const footerLinks: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/process", label: "Process" },
      { href: "/cases", label: "Case Studies" },
    ],
  },
  {
    heading: "Talent",
    links: [
      { href: "/roles", label: "Roles" },
      { href: "/jobs", label: "Jobs" },
      { href: "/contact", label: "Contact" },
    ],
  },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e3d7be] bg-[#f6f0e2]">
      <div className="container grid gap-10 py-16 md:grid-cols-[2fr,3fr]">
        <div className="space-y-4">
          <div>
            <Link href={"/" as Route} className="font-display text-2xl text-primary">
              Haystack
            </Link>
            <p className="mt-3 max-w-sm text-sm text-primary/70">
              Find decisive talent without the guesswork. Calibrated shortlists backed by signal-rich insights every week.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-primary/70">
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.socials.x}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              X
            </a>
            <a href={`mailto:${siteConfig.socials.email}`} className="underline-offset-4 hover:underline">
              Email
            </a>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.heading} className="space-y-3">
              <h4 className="font-display text-lg text-primary">{group.heading}</h4>
              <ul className="space-y-2 text-sm text-primary/70">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 transition hover:text-primary hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href as Route}
                        className="underline-offset-4 transition hover:text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#e3d7be] bg-[#efe4cf]">
        <div className="container flex flex-col gap-4 py-6 text-xs text-primary/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Haystack. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href={"/privacy" as Route}>Privacy</Link>
            <Link href={"/terms" as Route}>Terms</Link>
            <Link href={"/imprint" as Route}>Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
