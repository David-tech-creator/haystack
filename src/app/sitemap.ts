import type { MetadataRoute } from "next"
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site"

const PAGES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/process", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy", priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED)
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "/" : p.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: p.priority,
  }))
}
