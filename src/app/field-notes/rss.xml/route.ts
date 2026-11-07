import { FIELD_NOTES } from "@/lib/content"
import { fieldNotePath, getFieldNotes, type FieldNote } from "@/lib/field-notes"
import { escapeHtml } from "@/lib/markdown"
import { AUTHOR, CONTENT_UPDATED, FIELD_NOTES_FEED, FIELD_NOTES_PATH, SITE, SITE_URL } from "@/lib/site"

/** RSS 2.0 feed of Field notes, built at deploy time. Full text in content:encoded. */
export const dynamic = "force-static"

const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

/** Site paths in post HTML need the host once they are read outside the site. */
const absolute = (html: string) => html.replace(/(src|href)="\/(?!\/)/g, `$1="${SITE_URL}/`)

/** The whole post as the page shows it: TL;DR, figure with credit, body, sources. */
function postHtml(p: FieldNote) {
  const parts: string[] = []
  if (p.tldr.length) parts.push(`<p><strong>${xml(FIELD_NOTES.tldr)}</strong></p>\n<ul>${p.tldr.map((t) => `<li>${t}</li>`).join("")}</ul>`)
  if (p.figure) {
    const c = p.figure.credit
    const credit = c ? `<figcaption>Image: ${c.url ? `<a href="${escapeHtml(c.url)}">${escapeHtml(c.label)}</a>` : escapeHtml(c.label)}</figcaption>` : ""
    parts.push(`<figure><img src="${escapeHtml(p.figure.src)}" alt="${escapeHtml(p.figure.alt)}" />${credit}</figure>`)
  }
  parts.push(p.html)
  if (p.sources.length) {
    const items = p.sources
      .map((s) => `<li>${s.url ? `<a href="${escapeHtml(s.url)}">${escapeHtml(s.title)}</a>` : escapeHtml(s.title)}${s.source ? `, ${escapeHtml(s.source)}` : ""}</li>`)
      .join("")
    parts.push(`<h2>${xml(FIELD_NOTES.sources)}</h2>\n<ul>${items}</ul>`)
  }
  return absolute(parts.join("\n"))
}

const rfc822 = (date: string) => new Date(`${date}T08:00:00Z`).toUTCString()

export function GET() {
  const posts = getFieldNotes().slice(0, 50)
  const updated = posts[0]?.date ?? CONTENT_UPDATED
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}${fieldNotePath(p.slug)}`
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <dc:creator>${xml(AUTHOR.name)}</dc:creator>
      <description>${xml(p.summary)}</description>
      <content:encoded><![CDATA[${postHtml(p).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`
    })
    .join("\n")
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(FIELD_NOTES.name)}, ${xml(SITE.name)}</title>
    <link>${SITE_URL}${FIELD_NOTES_PATH}</link>
    <atom:link href="${SITE_URL}${FIELD_NOTES_FEED}" rel="self" type="application/rss+xml" />
    <description>${xml(FIELD_NOTES.description)}</description>
    <language>en</language>
    <lastBuildDate>${rfc822(updated)}</lastBuildDate>
${items}
  </channel>
</rss>
`
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
