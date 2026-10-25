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
  /** Brand tokens (DESIGN.md). cream is the page colour and the browser theme colour. */
  colors: {
    cream: "#F6F1E7",
    background: "#F6F1E7",
    paper: "#FBF8F2",
    linen: "#EDE5D3",
    line: "#DDD2BC",
    navy: "#1A2136",
    deep: "#10152A",
    gold: "#C29A3E",
    goldInk: "#7E5B12",
    goldLight: "#E6C77A",
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
