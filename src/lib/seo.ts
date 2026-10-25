/**
 * Metadata and JSON-LD, built from lib/site.ts and lib/content.ts so the
 * structured data always matches what the page shows. The @ids are stable:
 * never rename them.
 */
import type { Metadata } from "next"
import { FAQ, STEPS } from "./content"
import { KEYWORDS, LINKEDIN_URL, SITE, SITE_URL } from "./site"

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const SERVICE_ID = `${SITE_URL}/#recruitment-sprint`

type PageInput = {
  title?: string
  absoluteTitle?: string
  description: string
  path: string
}

export function pageMetadata({ title, absoluteTitle, description, path }: PageInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`
  const shown = absoluteTitle ?? `${title} · ${SITE.name}`
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords: KEYWORDS,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: shown,
      description,
      siteName: SITE.name,
      locale: SITE.locale,
    },
    twitter: { card: "summary_large_image", title: shown, description },
  }
}

const organization = {
  "@type": ["Organization", "EmploymentAgency"],
  "@id": ORG_ID,
  name: SITE.name,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/haystack-mark.png`, width: 512, height: 512 },
  image: `${SITE_URL}/opengraph-image`,
  slogan: SITE.tagline,
  description: SITE.description,
  foundingDate: SITE.founded,
  areaServed: { "@type": "Country", name: "Switzerland" },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  sameAs: [LINKEDIN_URL],
  knowsAbout: [
    "Technical recruitment",
    "Software engineering hiring",
    "Data engineering hiring",
    "Machine learning hiring",
    "AI engineering hiring",
  ],
  knowsLanguage: ["en"],
}

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
}

const service = {
  "@type": "Service",
  "@id": SERVICE_ID,
  name: "Recruitment sprint",
  serviceType: "Technical recruitment",
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "Switzerland" },
  description:
    "A focused search for one engineering, data or AI role: a scorecard agreed up front, a weekly written update, and a shortlist where every candidate comes with a one-page note.",
}

function webPage(path: string, type: string, idSuffix: string, name: string, description: string) {
  const url = `${SITE_URL}${path}`
  return {
    "@type": type,
    "@id": `${url}#${idSuffix}`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  }
}

function breadcrumbs(path: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
    ],
  }
}

const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes })

export function homeJsonLd() {
  return graph(
    organization,
    website,
    service,
    webPage("/", "WebPage", "webpage", SITE.title, SITE.description),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  )
}

export function processJsonLd(description: string) {
  return graph(
    organization,
    webPage("/process", "WebPage", "webpage", "How a Haystack sprint runs", description),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/process#steps`,
      name: "A Haystack recruitment sprint, step by step",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: STEPS.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title, description: s.body })),
    },
    breadcrumbs("/process", "Process"),
  )
}

export function aboutJsonLd(description: string) {
  return graph(organization, webPage("/about", "AboutPage", "aboutpage", "Why Haystack exists", description), breadcrumbs("/about", "About"))
}

export function contactJsonLd(description: string) {
  return graph(
    organization,
    webPage("/contact", "ContactPage", "contactpage", "Ready to find the needle?", description),
    breadcrumbs("/contact", "Contact"),
  )
}
