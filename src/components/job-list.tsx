import { JobCard, type JobMeta } from "@/components/job-card"

interface JobListProps {
  jobs: JobMeta[]
}

export function JobList({ jobs }: JobListProps) {
  if (!jobs.length) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-200/60 bg-[#fef8ec]/85 p-8 text-center text-sm text-muted-foreground dark:border-navy-700/60 dark:bg-navy-900/30">
        No roles posted yet. Check back soon.
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.slug} job={job} />
      ))}
    </div>
  )
}
