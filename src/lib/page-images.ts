/**
 * Which photos each page shows, first one = the page's primary image.
 * Read by the image sitemap (/image-sitemap.xml) and by primaryImageOfPage in
 * the JSON-LD. When a Frame on a page changes, change it here too.
 */
import { IMG } from "./images"
import { FDE_GUIDE_PATH, FDE_PATH } from "./site"

type PhotoId = keyof typeof IMG

const CTA: PhotoId = "networking-conversation-evening"

export const PAGE_IMAGES: Record<string, readonly PhotoId[]> = {
  "/": [
    "tech-leaders-panel-discussion-screen",
    "panelists-sharing-a-laugh",
    "speaker-smiling-front-row",
    "close-conversation-engineering-leaders",
    "attentive-audience-sunlit-room",
    "three-people-talking-at-table",
    "packed-salon-tech-leaders-discussion",
    CTA,
  ],
  [FDE_PATH]: [
    "speaker-quantum-slide-long-tables",
    "engineer-presenting-ai-drug-discovery",
    "presenter-explaining-ai-models-slide",
    "classical-vs-quantum-computing-talk",
  ],
  [FDE_GUIDE_PATH]: ["speaker-no-ai-without-ia-slide"],
  "/process": ["networking-under-pendant-lights", CTA],
  "/about": ["speaker-stage-engaged-audience-hall", "host-presenting-community-slide", CTA],
  "/contact": ["two-tech-leaders-laughing"],
}

/** The page's primary photo (the first one listed). */
export const primaryImage = (path: string) => IMG[PAGE_IMAGES[path][0]]
