/**
 * Facts about Haystack. Pages, metadata, JSON-LD, llms.txt and the sitemap
 * all read from here so they cannot disagree. Only verified facts belong in
 * this file: no numbers, clients or claims that are not true today.
 */

export const SITE_URL = "https://www.haystack.agency"

/** Bump when the copy changes; used as lastModified in the sitemap. */
export const CONTENT_UPDATED = "2026-10-25"

export const LINKEDIN_URL = "https://www.linkedin.com/company/haystack-agency"

export const SITE = {
  name: "Haystack",
  tagline: "Move the needle.",
  title: "Haystack · Tech recruitment agency in Geneva",
  description:
    "Haystack is a small tech recruitment agency in Geneva. Focused searches for engineering, data and AI roles, a written note on every candidate, and an update every week.",
  short: "A small tech recruitment agency in Geneva.",
  locale: "en_CH",
  city: "Geneva",
  region: "GE",
  country: "CH",
  founded: "2025",
  colors: {
    cream: "#f6f0e2",
    background: "#fbf6ec",
    navy: "#1f2640",
    deep: "#10162a",
    gold: "#c9a046",
  },
} as const

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export const KEYWORDS = [
  "tech recruitment Geneva",
  "recruitment agency Switzerland",
  "software engineer recruitment",
  "data engineer recruitment",
  "machine learning recruitment",
  "AI recruitment Switzerland",
  "Haystack recruitment",
]
