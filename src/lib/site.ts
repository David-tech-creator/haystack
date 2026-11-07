/**
 * Facts about Haystack. Pages, metadata, JSON-LD, llms.txt and the sitemap
 * all read from here so they cannot disagree. Only verified facts belong in
 * this file: no numbers, clients or claims that are not true today.
 */

export const SITE_URL = "https://www.haystack.agency"

/** Bump when the copy changes; used as lastModified in the sitemap. */
export const CONTENT_UPDATED = "2026-11-07"

export const LINKEDIN_URL = "https://www.linkedin.com/company/haystack-agency"

export const SITE = {
  name: "Haystack",
  tagline: "Move the needle.",
  title: "Haystack · Tech recruitment agency in Geneva",
  description:
    "Haystack is a tech recruitment agency in Geneva. Focused searches for engineering, data and AI roles, a written note on every candidate, weekly updates.",
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
  { href: "/forward-deployed-engineers", label: "FDE Club" },
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
  "forward deployed engineer Switzerland",
  "FDE recruitment",
  "FDE Club Switzerland",
]

/* FDE Club Switzerland ------------------------------------------------------ */

export const FDE_PATH = "/forward-deployed-engineers"
export const FDE_GUIDE_PATH = `${FDE_PATH}/what-is-a-forward-deployed-engineer`

/**
 * The club Haystack started. "First" is a founding statement: in November
 * 2026 we found no other community for forward deployed engineers in
 * Switzerland. Add every off-site profile (LinkedIn, Luma, Meetup,
 * newsletter archive) to sameAs as it goes live.
 */
export const FDE_CLUB = {
  name: "FDE Club Switzerland",
  alternateName: ["Forward Deployed Engineers Switzerland", "FDE Switzerland"],
  /** The fixed descriptor. Reuse it word for word on and off the site. */
  short:
    "Switzerland's first club for forward deployed engineers, started by Haystack, a tech recruitment agency in Geneva.",
  launched: "2026-11",
  sameAs: [] as string[],
} as const

/** The day the employer list and the guide were last checked against their sources. */
export const FDE_UPDATED = "2026-11-07"

/**
 * Meetups. Empty until a date and a venue are confirmed: the page, the
 * Event JSON-LD and llms.txt all read from here, and nothing is shown or
 * emitted while it is empty. Never add a placeholder.
 */
export const FDE_EVENTS: Array<{
  id: string
  name: string
  startDate: string
  endDate: string
  venue: string
  street: string
  city: string
  postalCode: string
  rsvpUrl: string
}> = []

/**
 * Live forward deployed engineer postings in Switzerland, each checked on its
 * source page. Only add a row with a working source link; remove rows when
 * the posting closes and bump FDE_UPDATED only after a real re-check.
 */
export const FDE_EMPLOYERS = [
  {
    company: "OpenAI",
    url: "https://openai.com",
    city: "Zurich",
    title: "Forward Deployed Engineer, Zurich",
    sourceUrl: "https://jobs.ashbyhq.com/openai/067788c8-505b-4296-bc05-d5699cb87a1f",
    checked: "2026-11-07",
  },
  {
    company: "Databricks",
    url: "https://www.databricks.com",
    city: "Zurich",
    title: "Sr. Forward Deployed Engineer (Fullstack)",
    sourceUrl: "https://databricks.com/company/careers/open-positions/job?gh_jid=8782216002",
    checked: "2026-11-07",
  },
  {
    company: "Salesforce",
    url: "https://www.salesforce.com",
    city: "Zurich",
    title: "Forward Deployed Engineer",
    sourceUrl:
      "https://salesforce.wd12.myworkdayjobs.com/en-US/External_Career_Site/job/Switzerland---Zurich/Forward-Deployed-Engineer_JR350790",
    checked: "2026-11-07",
  },
  {
    company: "LatticeFlow AI",
    url: "https://latticeflow.ai",
    city: "Zurich",
    title: "Forward Deployed Engineer",
    sourceUrl: "https://apply.workable.com/latticeflow/jobs/view/452E48C107",
    checked: "2026-11-07",
  },
  {
    company: "DeepJudge",
    url: "https://www.deepjudge.ai",
    city: "Zurich",
    title: "Forward Deployed Engineer",
    sourceUrl: "https://jobs.ashbyhq.com/deepjudge/740cf0e0-38e7-4ad5-90d7-fd05fa73b33f",
    checked: "2026-11-07",
  },
  {
    company: "Blockstream",
    url: "https://blockstream.com",
    city: "Zurich or Geneva",
    title: "Forward Deployed Engineer (Switzerland)",
    sourceUrl: "https://jobs.ashbyhq.com/blockstream/5dc8fec2-3a59-4a5b-9ad7-f44bcd1163a4",
    checked: "2026-11-07",
  },
  {
    company: "Neural Concept",
    url: "https://www.neuralconcept.com",
    city: "Lausanne",
    title: "Forward Deployed Engineer, Switzerland",
    sourceUrl: "https://jobs.ashbyhq.com/neuralconcept/534580d2-7848-431e-9a42-b0d53187f4f5",
    checked: "2026-11-07",
  },
  {
    company: "Neural Concept",
    url: "https://www.neuralconcept.com",
    city: "Lausanne or Zurich",
    title: "CAD/CAE Automation Software Engineer (Forward Deployed)",
    sourceUrl: "https://jobs.ashbyhq.com/neuralconcept/7475e20a-c1d8-430c-abf6-3f505454ef4c",
    checked: "2026-11-07",
  },
  {
    company: "Pictet",
    url: "https://www.group.pictet",
    city: "Geneva",
    title: "Chapter Lead, Forward-Deployed Engineering",
    sourceUrl: "https://www.jobup.ch/en/jobs/detail/506d5dba-e9c2-435c-a8b8-e3361281ad7d/",
    checked: "2026-11-07",
  },
] as const

/* Field notes ---------------------------------------------------------------- */

/**
 * Field notes: David's bylined posts, one Markdown file per post in
 * content/field-notes/ (format in the README there), committed by the agent
 * in nas/field-notes/. Posts are read at build time by src/lib/field-notes.ts.
 */
export const FIELD_NOTES_PATH = "/field-notes"
export const FIELD_NOTES_FEED = `${FIELD_NOTES_PATH}/rss.xml`

/**
 * The author of Field notes. The @id is the Person node on David's own site
 * (rive-foundry.com), so both sites describe the same person. LinkedIn
 * checked against rive-foundry's lib/site.ts.
 */
export const AUTHOR = {
  name: "David Vinkenroye",
  givenName: "David",
  familyName: "Vinkenroye",
  url: "https://www.rive-foundry.com",
  id: "https://www.rive-foundry.com/#david",
  linkedin: "https://www.linkedin.com/in/david-vinkenroye-1a479468/",
} as const

/** "2026-11-07" to "7 November 2026", fixed to en-GB so server and client agree. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  return d ? `${d} ${months[m - 1]} ${y}` : `${months[m - 1]} ${y}`
}

/**
 * IndexNow key (Bing, Yandex, Seznam, Naver). The same string is served at
 * /<key>.txt from public/. scripts/indexnow.mjs pings the sitemap URLs after
 * a deploy. Not a secret: IndexNow keys are public by design.
 */
export const INDEXNOW_KEY = "221582928817ed5a8047f735f91a9971"
