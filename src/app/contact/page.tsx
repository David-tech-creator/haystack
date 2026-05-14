import type { Metadata } from "next"

import { ContactForm } from "@/components/contact-form"
import { ContactFormAction } from "@/components/contact-form-action"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Haystack. AI-native software engineering, delivered with Japanese-quality discipline.",
}

export default function ContactPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr),minmax(0,420px)]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Let&rsquo;s build</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-wheat-100">
            Ready to find the needle?
          </h1>
          <p className="text-lg text-muted-foreground">
            Share the problem you&rsquo;re trying to solve. We respond within one business day with a scoped discovery call &mdash; no decks, no boilerplate, just engineers who&rsquo;ve shipped your kind of system before.
          </p>
          <div className="rounded-2xl border border-[#e3d7be]/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm dark:border-[#cbbd9e]/30 dark:bg-navy-900/40">
            <p className="font-semibold text-foreground">What to expect</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>30-minute discovery call with a senior engineer &mdash; not a sales rep</li>
              <li>Scoped proposal with timeline, team composition, and acceptance criteria</li>
              <li>Pilot sprint available within two weeks of kickoff</li>
            </ul>
          </div>
        </div>
        <ContactForm onSubmit={ContactFormAction} />
      </div>
    </div>
  )
}
