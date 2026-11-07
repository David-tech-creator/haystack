/**
 * Which photos each page shows, first one = the page's primary image.
 * Read by the image sitemap (/image-sitemap.xml) and by primaryImageOfPage in
 * the JSON-LD. When a Frame on a page changes, change it here too.
 */
import { IMG } from "./images"
import { FDE_GUIDE_PATH, FDE_PATH } from "./site"

type PhotoId = keyof typeof IMG

const CTA: PhotoId = "candidate-and-manager-coffee"

export const PAGE_IMAGES: Record<string, readonly PhotoId[]> = {
  "/": [
    "tech-team-whiteboard-lake-geneva",
    "hiring-brief-notebook-geneva",
    "team-planning-wall-sticky-notes",
    "pair-programming-explaining-code",
    "small-team-studio-office-tools",
    "hiring-manager-reading-shortlist",
    "engineers-gathered-around-laptop",
    CTA,
  ],
  [FDE_PATH]: [
    "engineer-with-specialist-pharma-lab",
    "engineer-demo-bank-operations-team",
    "engineer-with-underwriter-open-office",
    "engineer-with-operator-factory-floor",
  ],
  [FDE_GUIDE_PATH]: ["team-around-laptop-logistics-office"],
  "/process": ["engineer-work-sample-home-desk", CTA],
  "/about": ["engineers-campus-terrace-conversation", "robotics-engineer-lab-smiling", CTA],
  "/contact": ["phone-call-window-lake-geneva"],
}

/** The page's primary photo (the first one listed). */
export const primaryImage = (path: string) => IMG[PAGE_IMAGES[path][0]]
