import type { Metadata } from "next"

import { ContactForm } from "@/components/contact-form"
import { ContactFormAction } from "@/components/contact-form-action"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a sprint with Haystack to hire AI and data talent faster.",
}

export default function ContactPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr),minmax(0,420px)]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Let’s sprint</p>
          <h1 className="text-4xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
            Ready to find the needle?
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your timeline and the talent signals you care about. We respond within one business day with an intake session invite.
          </p>
          <div className="rounded-2xl border border-navy-100/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm dark:border-navy-800/60 dark:bg-navy-900/40">
            <p className="font-semibold text-foreground">What to expect</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Snapshot of current pipelines & market map</li>
              <li>Sprint kickoff with role benchmarking</li>
              <li>Weekly signal reports & shortlist delivery</li>
            </ul>
          </div>
        </div>
        <ContactForm onSubmit={ContactFormAction} />
      </div>
    </div>
  )
}
