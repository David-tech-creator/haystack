import type { Metadata } from "next"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Process",
  description: "How we ship: AI-native production process with Japanese-quality discipline.",
}

const sections = [
  {
    title: "Phase 1 · Business Analysis",
    content:
      "AI agents draft user stories, PRDs, and data models from the discovery transcripts. A senior business analyst reviews, refines, and validates scope — closing ambiguity before a line of code is written. Output: locked PRD & functional specs you sign off on.",
  },
  {
    title: "Phase 2 · Architecture & Design",
    content:
      "AI generates system options, API contracts, and UI/UX mockups. The lead architect selects the stack, finalises the Figma prototype, and writes the architecture decision record. Output: approved tech stack, design system, and architecture document.",
  },
  {
    title: "Phase 3 · AI-Assisted Build",
    content:
      "AI agents generate boilerplate, components, and unit tests. Senior engineers review every PR, refactor where the AI cut corners, and harden the security-sensitive paths by hand. No code reaches main without two human signatures. Output: clean source, unit coverage, code review trail.",
  },
  {
    title: "Phase 4 · Rigorous Testing",
    content:
      "AI writes automated test scripts and predicts edge cases from the spec. The QC team runs exploratory testing, performance benchmarks, and security review. We don’t ship on optimism — we ship on evidence. Output: test report and quality metrics.",
  },
  {
    title: "Phase 5 · Acceptance & Release",
    content:
      "AI generates deployment scripts and release notes. Your team runs UAT against agreed acceptance criteria. We do the go-live with you and stay on for hypercare. Output: shipped product, operational runbooks, support handover.",
  },
  {
    title: "Ongoing · Managed Operations",
    content:
      "Most clients keep us on after release. Managed operations, SRE, performance tuning, and continuous improvement — same team, same quality bar, no re-onboarding tax. Optional 24/7 coverage across our four time zones.",
  },
]

export default function ProcessPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Process</p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-wheat-100">
          Top engineers × AI = superior products.
        </h1>
        <p className="text-lg text-muted-foreground">
          AI agents handle the keystroke-heavy work at every stage. Senior engineers make the judgment calls. The result: speed without slop, quality without bureaucracy.
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {sections.map((section) => (
              <AccordionItem
                key={section.title}
                value={section.title}
                className="rounded-2xl border border-[#e3d7be]/60 bg-[#fef8ec]/92 backdrop-blur dark:border-[#cbbd9e]/30 dark:bg-navy-900/40"
              >
                <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-primary dark:text-wheat-100">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <aside className="space-y-4 rounded-3xl border border-[#e3d7be]/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-[#cbbd9e]/30 dark:bg-navy-900/30">
          <h2 className="text-lg font-semibold text-primary dark:text-wheat-50">How we engage</h2>
          <ul className="space-y-3">
            <li>Fixed-scope projects with milestone billing</li>
            <li>Dedicated squads scalable from 1 to 30 engineers</li>
            <li>Free pilot sprint to prove the engagement</li>
            <li>Same senior lead from kickoff through handover</li>
            <li>ISO/IEC 27001 controls across the production estate</li>
            <li>Optional 24/7 ops coverage across four time zones</li>
          </ul>
        </aside>
      </div>
    </div>
  )
}
