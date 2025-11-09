import type { Metadata } from "next"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Process",
  description: "Our sprint-based recruitment process for AI and data teams.",
}

const sections = [
  {
    title: "SLA",
    content:
      "Five business days to first shortlist, weekly signal update thereafter. Intake on Monday, shortlist by Friday, offers by day 21.",
  },
  {
    title: "Scorecards",
    content:
      "Every sprint begins with co-created scorecards. We benchmark technical depth, product intuition, velocity, and collaboration signals aligned to your team.",
  },
  {
    title: "Work-sample philosophy",
    content:
      "We lean into async work samples that mirror real-world scenarios. Candidates receive context, deliver on their own time, and gain mutual alignment before the first interview.",
  },
  {
    title: "Weekly signal reports",
    content:
      "You will receive dashboards summarizing candidate pipeline, signal strengths, risk alerts, and recommended next actions. No inbox chaos, just clarity.",
  },
]

export default function ProcessPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Process</p>
        <h1 className="text-4xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Predictable hiring sprints
        </h1>
        <p className="text-lg text-muted-foreground">
          Haystack compresses sourcing, screening, and closing into a signal-first sprint. Here’s what to expect when we partner together.
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section) => (
              <AccordionItem key={section.title} value={section.title} className="rounded-2xl border border-navy-100/60 bg-[#fef8ec]/92 backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40">
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-navy-900 dark:text-wheat-100">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside className="space-y-4 rounded-3xl border border-navy-100/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/30">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-wheat-50">Sprint highlights</h2>
          <ul className="space-y-3">
            <li>Dedicated talent partner & market mapper</li>
            <li>Role-based scorecards with leveling guidance</li>
            <li>Weekly debrief sync & signal dosage</li>
            <li>Offer support, references, and close strategy</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
