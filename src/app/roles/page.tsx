import { Metadata } from "next"

import { JobList } from "@/components/job-list"
import { getJobs } from "@/lib/content"

export const metadata: Metadata = {
  title: "Roles",
  description: "Explore AI, ML, and data roles available through Haystack.",
}

export default async function RolesPage() {
  const jobs = await getJobs()

  return (
    <div className="container py-16 sm:py-24">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Roles</p>
        <h1 className="text-4xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Open searches we’re sprinting on
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          From ML engineers to analytics leaders, we work on roles where signal beats volume. Browse active mandates or reach out for custom searches.
        </p>
      </div>
      <div className="mt-12">
        <JobList jobs={jobs.map((job) => job.meta)} />
      </div>
    </div>
  )
}
