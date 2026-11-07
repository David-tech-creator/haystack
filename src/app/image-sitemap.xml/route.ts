import { fieldNotePath, getFieldNotes } from "@/lib/field-notes"
import { IMG } from "@/lib/images"
import { PAGE_IMAGES } from "@/lib/page-images"
import { SITE_URL } from "@/lib/site"

/**
 * Image sitemap. Next 14's MetadataRoute.Sitemap has no images field, so this
 * is a plain route. Google reads only image:loc today; the other image tags
 * are deprecated. The page-to-photo map lives in lib/page-images.ts.
 */
export const dynamic = "force-static"

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

export function GET() {
  const urls = Object.entries(PAGE_IMAGES)
    .map(([path, ids]) => {
      const loc = `${SITE_URL}${path === "/" ? "/" : path}`
      const images = Array.from(new Set(ids))
        .map((id) => `    <image:image><image:loc>${esc(`${SITE_URL}${IMG[id].src}`)}</image:loc></image:image>`)
        .join("\n")
      return `  <url>\n    <loc>${esc(loc)}</loc>\n${images}\n  </url>`
    })
    .join("\n")

  // Field notes: each post's figure (a credited photo or a diagram).
  const notes = getFieldNotes()
    .filter((n) => n.figure)
    .map((n) => {
      const src = n.figure!.src.startsWith("/") ? `${SITE_URL}${n.figure!.src}` : n.figure!.src
      return `  <url>\n    <loc>${esc(`${SITE_URL}${fieldNotePath(n.slug)}`)}</loc>\n    <image:image><image:loc>${esc(src)}</image:loc></image:image>\n  </url>`
    })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[urls, ...notes].join("\n")}
</urlset>
`
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
