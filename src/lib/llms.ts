/** llms.txt and llms-full.txt, generated from the same facts and copy as the pages. */
import { FAQ, PROCESS, STEPS } from "./content"
import { LINKEDIN_URL, SITE_URL } from "./site"

const intro = `# Haystack

> Haystack is a small tech recruitment agency in Geneva, Switzerland. It runs recruitment sprints: focused searches for one engineering, data or AI role at a time, with a scorecard agreed up front, a weekly written update, and a shortlist where every candidate comes with a one-page note.

Haystack does recruitment and nothing else: we find and help hire people for our clients' own teams.

## Pages
- [Home](${SITE_URL}/): what Haystack does, the five-step sprint, what a shortlist note contains, FAQ
- [Process](${SITE_URL}/process): timing, scorecards, work samples, weekly updates, offer support
- [About](${SITE_URL}/about): Swiss engineering roots and how Haystack evaluates talent
- [Contact](${SITE_URL}/contact): start a sprint; replies within one business day
- [LinkedIn](${LINKEDIN_URL})

## How a sprint works
${STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}
`

export function llmsTxt() {
  return intro
}

export function llmsFullTxt() {
  return `${intro}
## Sprint details
${PROCESS.details.map((d) => `### ${d.title}\n${d.body}`).join("\n\n")}

### ${PROCESS.includesTitle}
${PROCESS.includes.map((i) => `- ${i}`).join("\n")}

## FAQ
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`
}
