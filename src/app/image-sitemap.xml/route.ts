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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
