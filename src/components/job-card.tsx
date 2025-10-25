import type { Route } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export type JobMeta = {
  title: string
  slug: string
  location: string
  tags: string[]
  level: string
  salaryRange?: string
  postedAt: string
}

type JobCardProps = {
  job: JobMeta
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="h-full border border-[#e3d7be] bg-[#fdf9ef] shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-primary">{job.title}</CardTitle>
        <p className="text-sm text-primary/60">{job.location}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-primary/70">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-[#d2c19d] text-primary">
            {job.level}
          </Badge>
          {job.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-[#efe4cf] text-primary/80">
              {tag}
            </Badge>
          ))}
        </div>
        {job.salaryRange ? <p>Range: {job.salaryRange}</p> : null}
        <p>Posted {new Date(job.postedAt).toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm">
        <Link
          href={`/jobs/${job.slug}` as Route}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          View role
        </Link>
        <Link
          href={`mailto:hello@haystack.example?subject=Interest%20in%20${encodeURIComponent(job.title)}`}
          className="text-primary/70 underline-offset-4 hover:text-primary hover:underline"
        >
          Apply
        </Link>
      </CardFooter>
    </Card>
  )
}
