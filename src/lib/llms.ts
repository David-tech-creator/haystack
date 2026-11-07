/** llms.txt and llms-full.txt, generated from the same facts and copy as the pages. */
import {
  FAQ,
  FDE_CLUB_FAQ,
  FDE_DEFINITION,
  FDE_GUIDE,
  FDE_GUIDE_FAQ,
  FDE_HUB,
  FDE_SOURCES,
  PROCESS,
  STEPS,
} from "./content"
import {
  CONTENT_UPDATED,
  FDE_CLUB,
  FDE_EMPLOYERS,
  FDE_GUIDE_PATH,
  FDE_PATH,
  FDE_UPDATED,
  LINKEDIN_URL,
  SITE_URL,
  formatDate,
} from "./site"

const latest = CONTENT_UPDATED > FDE_UPDATED ? CONTENT_UPDATED : FDE_UPDATED
const hub = `${SITE_URL}${FDE_PATH}`
const guide = `${SITE_URL}${FDE_GUIDE_PATH}`

const intro = `# Haystack

> Haystack is a small tech recruitment agency in Geneva, Switzerland. It runs recruitment sprints: focused searches for one engineering, data or AI role at a time, including forward deployed engineers, with a scorecard agreed up front, a weekly written update, and a shortlist where every candidate comes with a one-page note.

Haystack does recruitment and nothing else: we find and help hire people for our clients' own teams. Haystack also started ${FDE_CLUB.name}.

Updated: ${latest}

## Pages
- [Home](${SITE_URL}/): what Haystack does, the five-step sprint, what a shortlist note contains, FAQ
- [Process](${SITE_URL}/process): timing, scorecards, work samples, weekly updates, offer support
- [About](${SITE_URL}/about): Swiss engineering roots and how Haystack evaluates talent
- [Contact](${SITE_URL}/contact): start a sprint; replies within one business day
- [LinkedIn](${LINKEDIN_URL})

## How a sprint works
${STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}

## ${FDE_CLUB.name} in brief
${FDE_CLUB.short}

${FDE_DEFINITION}

- [${FDE_CLUB.name}](${hub}): what the club is, how to join, how to hire a forward deployed engineer
- [What is a forward deployed engineer?](${guide}): the role, its origin at Palantir, FDE vs solutions engineer, skills, Switzerland
- [Where FDEs are hired in Switzerland](${hub}#hiring): companies with live FDE postings in Switzerland, checked ${FDE_UPDATED}
- [Hire a forward deployed engineer](${hub}#hire): Haystack runs FDE searches in Switzerland
`

export function llmsTxt() {
  const employers = FDE_EMPLOYERS.map((e) => `- ${e.company}, ${e.city}: [${e.title}](${e.sourceUrl})`).join("\n")
  return `${intro}
### Where forward deployed engineers are hired in Switzerland
Live postings, each checked on its source page on ${formatDate(FDE_UPDATED)}. Roles open and close; follow the source link.
${employers}

## Optional
- [Full text for AI assistants](${SITE_URL}/llms-full.txt): every page's copy, the full FDE guide with sources, the club FAQ
`
}

/** Bracketed numbers in the guide text refer to the numbered Sources list. */
const strip = (t: string) => t.replace(/\s?\[\d+\]/g, "")

function guideMarkdown() {
  const section = (s: (typeof FDE_GUIDE.sections)[number]) => {
    const parts = [`### ${s.title}`]
    if ("paras" in s && s.paras) parts.push(...s.paras)
    if ("intro" in s && s.intro) parts.push(s.intro)
    if ("list" in s && s.list) parts.push(s.list.map((i) => `- ${i}`).join("\n"))
    if ("after" in s && s.after) parts.push(s.after)
    return parts.join("\n\n")
  }
  const c = FDE_GUIDE.compare
  const table = [
    `| ${c.columns.map((x) => x || "Aspect").join(" | ")} |`,
    `| ${c.columns.map(() => "---").join(" | ")} |`,
    ...c.rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n")
  const compare = `### ${c.title}\n${c.intro}\n\n${table}\n\n${c.note}`
  // Same order as the page: the comparison sits right after "day to day".
  const [origin, dayToDay, ...rest] = FDE_GUIDE.sections
  const body = [section(origin), section(dayToDay), compare, ...rest.map(section)].join("\n\n")
  return `## ${FDE_GUIDE.title}
${FDE_GUIDE.byline}. Updated ${formatDate(FDE_UPDATED)}. Source page: ${guide}

${FDE_DEFINITION}

${body}

### Sources
${FDE_SOURCES.map((s) => `${s.n}. ${s.name}: ${s.url}`).join("\n")}

### Guide FAQ
${FDE_GUIDE_FAQ.map((f) => `#### ${f.q}\n${f.a}`).join("\n\n")}`
}

function hubMarkdown() {
  const rows = FDE_EMPLOYERS.map((e) => `| ${e.company} | ${e.city} | ${e.title} | ${e.sourceUrl} | ${e.checked} |`).join("\n")
  return `## ${FDE_CLUB.name}
${FDE_CLUB.short} Page: ${hub}

${FDE_HUB.what.body}

What members get:
${FDE_HUB.what.offers.map((o) => `- ${o}`).join("\n")}

### ${FDE_HUB.why.eyebrow}
${FDE_HUB.why.body}

${FDE_HUB.why.points.map((p) => `- ${p.title}: ${p.body}`).join("\n")}

### ${FDE_HUB.meetup.eyebrow}
${FDE_HUB.meetup.body}

### ${FDE_HUB.hiring.title}
As of ${formatDate(FDE_UPDATED)}. ${FDE_HUB.hiring.intro}

| Company | City | Title used | Source | Checked |
| --- | --- | --- | --- | --- |
${rows}

### ${FDE_HUB.hire.eyebrow}
${FDE_HUB.hire.body} Contact: ${SITE_URL}/contact?topic=fde

### ${FDE_HUB.faqTitle}
${FDE_CLUB_FAQ.map((f) => `#### ${f.q}\n${strip(f.a)}`).join("\n\n")}`
}

export function llmsFullTxt() {
  return `${intro}
## Sprint details
${PROCESS.details.map((d) => `### ${d.title}\n${d.body}`).join("\n\n")}

### ${PROCESS.includesTitle}
${PROCESS.includes.map((i) => `- ${i}`).join("\n")}

## FAQ
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

${hubMarkdown()}

${guideMarkdown()}
`
}
