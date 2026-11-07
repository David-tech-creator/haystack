/**
 * Metadata and JSON-LD, built from lib/site.ts and lib/content.ts so the
 * structured data always matches what the page shows. The @ids are stable:
 * never rename them.
 */
import type { Metadata } from "next"
import { FAQ, FDE_CLUB_FAQ, FDE_DEFINITION, FDE_GUIDE, FDE_GUIDE_FAQ, FDE_HUB, FDE_SOURCES, FIELD_NOTES, STEPS } from "./content"
import { fieldNotePath, type FieldNote } from "./field-notes"
import type { ImageEntry } from "./images"
import { primaryImage } from "./page-images"
import {
  AUTHOR,
  CONTENT_UPDATED,
  FDE_CLUB,
  FDE_EMPLOYERS,
  FDE_EVENTS,
  FDE_GUIDE_PATH,
  FDE_PATH,
  FDE_UPDATED,
  FIELD_NOTES_FEED,
  FIELD_NOTES_PATH,
  KEYWORDS,
  LINKEDIN_URL,
  SITE,
  SITE_URL,
} from "./site"

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const SERVICE_ID = `${SITE_URL}/#recruitment-sprint`

export const FDE_HUB_URL = `${SITE_URL}${FDE_PATH}`
export const FDE_GUIDE_URL = `${SITE_URL}${FDE_GUIDE_PATH}`
export const CLUB_ID = `${FDE_HUB_URL}#club`
export const FDE_TERM_ID = `${FDE_GUIDE_URL}#term`
export const FDE_GUIDE_ID = `${FDE_GUIDE_URL}#article`
export const FDE_SERVICE_ID = `${SITE_URL}/#fde-recruitment`
export const EMPLOYERS_ID = `${FDE_HUB_URL}#employers`

export const FIELD_NOTES_URL = `${SITE_URL}${FIELD_NOTES_PATH}`
export const BLOG_ID = `${FIELD_NOTES_URL}#blog`
/** David's Person node lives on his own site; we reference the same @id. */
export const AUTHOR_ID = AUTHOR.id

type PageInput = {
  title?: string
  absoluteTitle?: string
  description: string
  path: string
  /** Per-page keywords, added in front of the site list. */
  keywords?: readonly string[]
  /** An evergreen guide is an article; everything else is a website page. */
  article?: { publishedTime: string; modifiedTime: string; authors?: string[] }
  /** RSS feed advertised in <head> (alternates.types). */
  feed?: { url: string; title: string }
}

export function pageMetadata({ title, absoluteTitle, description, path, keywords, article, feed }: PageInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`
  const shown = absoluteTitle ?? `${title} · ${SITE.name}`
  const base = { url, title: shown, description, siteName: SITE.name, locale: SITE.locale }
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    keywords: keywords ? Array.from(new Set([...keywords, ...KEYWORDS])) : KEYWORDS,
    alternates: {
      canonical: url,
      ...(feed ? { types: { "application/rss+xml": [{ url: `${SITE_URL}${feed.url}`, title: feed.title }] } } : {}),
    },
    openGraph: article
      ? {
          ...base,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors ?? [SITE.name],
        }
      : { ...base, type: "website" },
    twitter: { card: "summary_large_image", title: shown, description },
  }
}

const organization = {
  "@type": ["Organization", "EmploymentAgency"],
  "@id": ORG_ID,
  name: SITE.name,
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/haystack-mark.png`, width: 512, height: 512 },
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/site/og-default.jpg`,
    width: 1200,
    height: 630,
  },
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
    "Forward deployed engineer recruitment",
    { "@id": FDE_TERM_ID },
  ],
  knowsLanguage: ["en"],
  subOrganization: { "@id": CLUB_ID },
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@id": SERVICE_ID } },
    { "@type": "Offer", itemOffered: { "@id": FDE_SERVICE_ID } },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: `${SITE_URL}/contact`,
    areaServed: "CH",
    availableLanguage: ["en"],
  },
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

const PAGE_PATHS = new Set(["/", "/process", "/about", "/contact"])

function webPage(
  path: string,
  type: string,
  idSuffix: string,
  name: string,
  description: string,
  extra: Record<string, unknown> = {},
) {
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
    publisher: { "@id": ORG_ID },
    dateModified: CONTENT_UPDATED,
    ...(PAGE_PATHS.has(path) ? { primaryImageOfPage: photoObject(primaryImage(path)) } : {}),
    ...extra,
  }
}

/** Breadcrumbs from Home down: pass the trail after Home, last item is the current page. */
function breadcrumbs(trail: { name: string; path: string }[]) {
  const last = trail[trail.length - 1]
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${last.path}#breadcrumbs`,
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  }
}

/** ImageObject for a site image. */
export function photoObject(img: ImageEntry, caption?: string) {
  return {
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${img.src}`,
    url: `${SITE_URL}${img.src}`,
    width: img.width,
    height: img.height,
    ...(caption ? { caption } : {}),
    description: img.alt,
  }
}

const faqPage = (id: string, items: readonly { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  "@id": id,
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
})

const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes })

export function homeJsonLd() {
  return graph(
    organization,
    website,
    service,
    fdeService,
    club,
    webPage("/", "WebPage", "webpage", SITE.title, SITE.description),
    faqPage(`${SITE_URL}/#faq`, FAQ),
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
    breadcrumbs([{ name: "Process", path: "/process" }]),
  )
}

export function aboutJsonLd(description: string) {
  return graph(organization, webPage("/about", "AboutPage", "aboutpage", "Why Haystack exists", description), breadcrumbs([{ name: "About", path: "/about" }]))
}

export function contactJsonLd(description: string) {
  return graph(
    organization,
    webPage("/contact", "ContactPage", "contactpage", "Ready to find the needle?", description),
    breadcrumbs([{ name: "Contact", path: "/contact" }]),
  )
}

/* FDE Club Switzerland ----------------------------------------------------- */

const club = {
  "@type": "Organization",
  "@id": CLUB_ID,
  name: FDE_CLUB.name,
  alternateName: [...FDE_CLUB.alternateName],
  url: FDE_HUB_URL,
  description: FDE_CLUB.short,
  parentOrganization: { "@id": ORG_ID },
  founder: { "@id": ORG_ID },
  foundingDate: FDE_CLUB.launched,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/haystack-mark.png`, width: 512, height: 512 },
  foundingLocation: { "@type": "Place", name: "Geneva, Switzerland" },
  areaServed: { "@type": "Country", name: "Switzerland" },
  knowsAbout: ["Forward deployed engineering", { "@id": FDE_TERM_ID }, "AI deployment", "Applied AI engineering"],
  ...(FDE_CLUB.sameAs.length ? { sameAs: FDE_CLUB.sameAs } : {}),
  potentialAction: { "@type": "JoinAction", target: `${FDE_HUB_URL}#join`, name: `Join ${FDE_CLUB.name}` },
}

const fdeService = {
  "@type": "Service",
  "@id": FDE_SERVICE_ID,
  name: "Forward deployed engineer recruitment",
  serviceType: "Technical recruitment",
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "Switzerland" },
  audience: { "@type": "BusinessAudience" },
  url: `${FDE_HUB_URL}#hire`,
  description: FDE_HUB.hire.body,
}

const term = {
  "@type": "DefinedTerm",
  "@id": FDE_TERM_ID,
  name: "Forward deployed engineer",
  alternateName: ["FDE", "Forward deployed software engineer", "FDSE"],
  description: FDE_DEFINITION,
  url: FDE_GUIDE_URL,
  inDefinedTermSet: { "@type": "DefinedTermSet", "@id": `${FDE_HUB_URL}#glossary`, name: `${FDE_CLUB.name} glossary` },
}

/** Meetups exist only once confirmed in FDE_EVENTS; no placeholder Event is ever emitted. */
const events = FDE_EVENTS.map((e) => ({
  "@type": "Event",
  "@id": `${FDE_HUB_URL}#${e.id}`,
  name: e.name,
  startDate: e.startDate,
  endDate: e.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: e.venue,
    address: { "@type": "PostalAddress", streetAddress: e.street, addressLocality: e.city, postalCode: e.postalCode, addressCountry: "CH" },
  },
  organizer: { "@id": CLUB_ID },
  url: e.rsvpUrl,
}))

export function fdeHubJsonLd(description: string, image: ImageEntry) {
  return graph(
    organization,
    club,
    fdeService,
    term,
    webPage(FDE_PATH, "CollectionPage", "webpage", FDE_HUB.title, description, {
      about: { "@id": CLUB_ID },
      mainEntity: { "@id": CLUB_ID },
      hasPart: [{ "@id": FDE_GUIDE_ID }],
      primaryImageOfPage: photoObject(image),
      dateModified: FDE_UPDATED,
    }),
    {
      "@type": "ItemList",
      "@id": EMPLOYERS_ID,
      name: "Companies hiring forward deployed engineers in Switzerland",
      description: `Live forward deployed engineer postings in Switzerland, each checked on its source page on ${FDE_UPDATED}.`,
      numberOfItems: FDE_EMPLOYERS.length,
      itemListElement: FDE_EMPLOYERS.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${e.company}: ${e.title} (${e.city})`,
        url: e.sourceUrl,
        item: { "@type": "Organization", name: e.company, url: e.url },
      })),
    },
    faqPage(`${FDE_HUB_URL}#faq`, FDE_CLUB_FAQ),
    ...events,
    breadcrumbs([{ name: FDE_CLUB.name, path: FDE_PATH }]),
  )
}

export function fdeGuideJsonLd(description: string, image: ImageEntry) {
  const page = `${FDE_GUIDE_URL}#webpage`
  return graph(
    organization,
    club,
    term,
    webPage(FDE_GUIDE_PATH, "WebPage", "webpage", FDE_GUIDE.title, description, {
      about: { "@id": FDE_TERM_ID },
      mainEntity: { "@id": FDE_GUIDE_ID },
      primaryImageOfPage: photoObject(image),
      datePublished: FDE_GUIDE.published,
      dateModified: FDE_UPDATED,
    }),
    {
      "@type": "Article",
      "@id": FDE_GUIDE_ID,
      headline: FDE_GUIDE.title,
      description,
      datePublished: FDE_GUIDE.published,
      dateModified: FDE_UPDATED,
      inLanguage: "en",
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      about: { "@id": FDE_TERM_ID },
      isPartOf: { "@id": WEBSITE_ID },
      mainEntityOfPage: { "@id": page },
      image: photoObject(image),
      mentions: [
        { "@type": "Organization", name: "Palantir Technologies", sameAs: "https://en.wikipedia.org/wiki/Palantir_Technologies" },
        { "@type": "Organization", name: "OpenAI", sameAs: "https://en.wikipedia.org/wiki/OpenAI" },
        { "@type": "Organization", name: "Anthropic", sameAs: "https://en.wikipedia.org/wiki/Anthropic" },
        { "@type": "Organization", name: "Amazon Web Services", sameAs: "https://en.wikipedia.org/wiki/Amazon_Web_Services" },
        { "@type": "Organization", name: "Microsoft", sameAs: "https://en.wikipedia.org/wiki/Microsoft" },
        { "@id": CLUB_ID },
      ],
      citation: FDE_SOURCES.map((src) => src.url),
    },
    faqPage(`${FDE_GUIDE_URL}#faq`, FDE_GUIDE_FAQ),
    breadcrumbs([
      { name: FDE_CLUB.name, path: FDE_PATH },
      { name: FDE_GUIDE.title, path: FDE_GUIDE_PATH },
    ]),
  )
}

/* Field notes ----------------------------------------------------------------- */

/**
 * David, the author of every Field note. The @id is the Person node on his
 * own site, so search engines can join the two graphs.
 */
const author = {
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: AUTHOR.name,
  givenName: AUTHOR.givenName,
  familyName: AUTHOR.familyName,
  url: AUTHOR.url,
  sameAs: [AUTHOR.linkedin],
  worksFor: { "@id": ORG_ID },
}

const blogRef = {
  "@type": "Blog",
  "@id": BLOG_ID,
  name: FIELD_NOTES.name,
  url: FIELD_NOTES_URL,
}

/** The small BlogPosting summary used inside the Blog node on the index. */
const postStub = (p: FieldNote) => ({
  "@type": "BlogPosting",
  "@id": `${SITE_URL}${fieldNotePath(p.slug)}#article`,
  headline: p.title,
  url: `${SITE_URL}${fieldNotePath(p.slug)}`,
  datePublished: p.date,
  dateModified: p.updated,
  author: { "@id": AUTHOR_ID },
})

export function fieldNotesJsonLd(posts: FieldNote[], updated: string) {
  return graph(
    organization,
    website,
    author,
    {
      ...blogRef,
      description: FIELD_NOTES.description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": ORG_ID },
      author: { "@id": AUTHOR_ID },
      about: [{ "@id": FDE_TERM_ID }, "Tech hiring in Switzerland"],
      ...(posts.length ? { blogPost: posts.map(postStub) } : {}),
    },
    webPage(FIELD_NOTES_PATH, "CollectionPage", "webpage", FIELD_NOTES.title, FIELD_NOTES.description, {
      mainEntity: { "@id": BLOG_ID },
      dateModified: updated,
    }),
    breadcrumbs([{ name: FIELD_NOTES.name, path: FIELD_NOTES_PATH }]),
  )
}

export function fieldNoteJsonLd(p: FieldNote, size: { width: number; height: number } | null) {
  const path = fieldNotePath(p.slug)
  const url = `${SITE_URL}${path}`
  const pageId = `${url}#webpage`
  const image = p.figure
    ? {
        "@type": "ImageObject",
        url: p.figure.src.startsWith("/") ? `${SITE_URL}${p.figure.src}` : p.figure.src,
        contentUrl: p.figure.src.startsWith("/") ? `${SITE_URL}${p.figure.src}` : p.figure.src,
        ...(size ?? {}),
        ...(p.figure.alt ? { description: p.figure.alt } : {}),
        ...(p.figure.credit ? { creditText: p.figure.credit.label } : {}),
        ...(p.figure.credit?.url ? { acquireLicensePage: p.figure.credit.url } : {}),
      }
    : { "@type": "ImageObject", url: `${url}/opengraph-image`, width: 1200, height: 630 }
  return graph(
    organization,
    author,
    blogRef,
    webPage(path, "WebPage", "webpage", p.title, p.summary, {
      // A post is about its subject, not about Haystack: drop the default "about".
      about: undefined,
      mainEntity: { "@id": `${url}#article` },
      primaryImageOfPage: image,
      datePublished: p.date,
      dateModified: p.updated,
      author: { "@id": AUTHOR_ID },
    }),
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: p.title,
      description: p.summary,
      ...(p.tldrText.length ? { abstract: p.tldrText.join(" ") } : {}),
      datePublished: p.date,
      dateModified: p.updated,
      inLanguage: "en",
      wordCount: p.words,
      timeRequired: `PT${p.minutes}M`,
      author: { "@id": AUTHOR_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": BLOG_ID },
      mainEntityOfPage: { "@id": pageId },
      url,
      image,
      ...(p.sources.some((s) => s.url) ? { citation: p.sources.filter((s) => s.url).map((s) => s.url) } : {}),
    },
    breadcrumbs([
      { name: FIELD_NOTES.name, path: FIELD_NOTES_PATH },
      { name: p.title, path },
    ]),
  )
}

export const FIELD_NOTES_FEED_LINK = { url: FIELD_NOTES_FEED, title: `${FIELD_NOTES.name}, ${SITE.name}` }
