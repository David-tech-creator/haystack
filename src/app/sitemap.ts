import type { MetadataRoute } from "next"
import { CONTENT_UPDATED, FDE_GUIDE_PATH, FDE_PATH, FDE_UPDATED, SITE_URL } from "@/lib/site"

/** Each page carries its own updated date: the recruitment pages follow CONTENT_UPDATED, the FDE pages FDE_UPDATED. */
const PAGES: Array<{ path: string; priority: number; updated: string }> = [
  { path: "/", priority: 1, updated: CONTENT_UPDATED },
  { path: FDE_PATH, priority: 0.9, updated: FDE_UPDATED },
  { path: FDE_GUIDE_PATH, priority: 0.8, updated: FDE_UPDATED },
  { path: "/process", priority: 0.8, updated: CONTENT_UPDATED },
  { path: "/about", priority: 0.7, updated: CONTENT_UPDATED },
  { path: "/contact", priority: 0.8, updated: CONTENT_UPDATED },
  { path: "/privacy", priority: 0.2, updated: FDE_UPDATED },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "/" : p.path}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: p.priority,
  }))
}
