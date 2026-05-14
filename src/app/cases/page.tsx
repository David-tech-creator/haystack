import type { Metadata } from "next"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCaseStudies } from "@/lib/content"

export const metadata: Metadata = {
  title: "Case Studies",
  description: "How enterprises and operators ship faster, cheaper, and with less risk by building with Haystack.",
}

export default async function CasesPage() {
  const cases = await getCaseStudies()

  return (
    <div className="container py-16 sm:py-24">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Case studies</p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-wheat-100">
          Shipped systems, measured outcomes.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A selection of enterprise programs we’ve delivered — with the operational numbers, not the marketing ones.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cases.map(({ meta }) => (
          <Card
            key={meta.slug}
            className="border border-[#e3d7be]/60 bg-[#fef8ec]/85 backdrop-blur dark:border-[#cbbd9e]/30 dark:bg-navy-900/30"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-primary dark:text-wheat-50">
                {meta.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{meta.summary}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-2">
                {meta.impact.map((impact) => (
                  <Badge key={impact} variant="outline">
                    {impact}
                  </Badge>
                ))}
              </div>
              <Link
                href={`/cases/${meta.slug}`}
                className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline dark:text-wheat-100 dark:hover:text-wheat-200"
              >
                Read case study →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
