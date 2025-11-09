import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getJobBySlug, getJobs, type TocItem } from "@/lib/content"
import { cn } from "@/lib/utils"

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (!toc.length) return null
  return (
    <nav className="rounded-2xl border border-[#e3d7be]/60 bg-[#fef8ec]/75 p-4 text-sm shadow-sm backdrop-blur dark:border-[#cbbd9e]/30 dark:bg-navy-900/30">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">On this page</p>
      <ul className="mt-3 space-y-2">
        {toc.map((item) => (
          <li key={item.slug} className={cn(item.depth > 2 && "pl-4 text-xs")}> 
            <a href={`#${item.slug}`} className="text-muted-foreground hover:text-foreground">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export async function generateStaticParams() {
  const jobs = await getJobs()
  return jobs.map(({ meta }) => ({ slug: meta.slug }))
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug).catch(() => null)

  if (!job) {
    notFound()
  }

  const { meta, content, toc } = job

  return (
    <article className="container grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr),320px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-wheat-100">
            {meta.title}
          </h1>
          <p className="text-sm text-muted-foreground">{meta.location}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{meta.level}</Badge>
            {meta.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          {meta.salaryRange ? (
            <p className="text-sm text-muted-foreground">Compensation: {meta.salaryRange}</p>
          ) : null}
        </div>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          {content}
        </div>
      </div>
      <aside className="sticky top-24 space-y-4">
        <TableOfContents toc={toc} />
        <div className="rounded-2xl border border-[#e3d7be]/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-[#cbbd9e]/30 dark:bg-navy-900/40">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Apply</p>
          <p className="text-base text-foreground">
            Interested? Send your resume and context to our team or use the apply link below.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href={`mailto:hello@haystack.example?subject=Application%20for%20${encodeURIComponent(meta.title)}`}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Apply via email
            </Link>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-full border border-dashed border-[#e3d7be]/80 px-6 text-sm font-semibold text-primary transition hover:border-primary/70 hover:text-primary/80 dark:border-[#cbbd9e]/40 dark:text-wheat-100"
            >
              Apply via webhook (coming soon)
            </Link>
          </div>
        </div>
      </aside>
    </article>
  )
}
