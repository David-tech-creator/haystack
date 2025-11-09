import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { getCaseStudies, getCaseStudyBySlug, type TocItem } from "@/lib/content"

function TableOfContents({ toc }: { toc: TocItem[] }) {
  if (!toc.length) return null
  return (
    <nav className="rounded-2xl border border-navy-100/60 bg-[#fef8ec]/75 p-4 text-sm shadow-sm backdrop-blur dark:border-navy-700/60 dark:bg-navy-900/30">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">On this page</p>
      <ul className="mt-3 space-y-2">
        {toc.map((item) => (
          <li key={item.slug} className={item.depth > 2 ? "pl-4 text-xs" : undefined}>
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
  const cases = await getCaseStudies()
  return cases.map(({ meta }) => ({ slug: meta.slug }))
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const entry = await getCaseStudyBySlug(params.slug).catch(() => null)
  if (!entry) {
    notFound()
  }

  const { meta, content, toc } = entry

  return (
    <article className="container grid gap-10 py-16 sm:py-24 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Case study</p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary">
          {meta.title}
        </h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">{content}</div>
      </div>
      <aside className="space-y-4">
        <TableOfContents toc={toc} />
        <div className="rounded-3xl border border-navy-100/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40">
          <h2 className="text-lg font-semibold text-primary">Impact</h2>
          <ul className="mt-3 space-y-2">
            {meta.impact.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Badge variant="outline">{item}</Badge>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-navy-800 px-6 text-sm font-semibold text-wheat-100 shadow-soft-lg transition hover:bg-navy-700"
          >
            Start a sprint
          </Link>
        </div>
      </aside>
    </article>
  )
}
