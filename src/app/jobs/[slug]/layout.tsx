import type { Metadata } from "next"

import { getJobBySlug } from "@/lib/content"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJobBySlug(params.slug).catch(() => null)

  if (!job) {
    return {
      title: "Job not found",
    }
  }

  return {
    title: job.meta.title,
    description: `${job.meta.title} in ${job.meta.location} at Haystack partner teams.`,
    openGraph: {
      title: job.meta.title,
      description: `${job.meta.title} · ${job.meta.location}`,
      url: `${siteConfig.url}/jobs/${job.meta.slug}`,
    },
  }
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return children
}
