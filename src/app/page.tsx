"use client"

import { Logos } from "@/components/logos"
import { Stats } from "@/components/stats"
import { Testimonials } from "@/components/testimonials"
import { Hero } from "@/components/hero"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Logos />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FinalCTA />
    </div>
  )
}

function HowItWorks() {
  const steps = ["Profile", "Sourcing", "Signals", "Shortlist", "Offer"]

  const descriptions: Record<string, string> = {
    Profile:
      "Clarify your story, priorities, and success signals. We mirror your tone so candidates see the real pitch.",
    Sourcing:
      "Map AI and data talent pools across operators, builders, and emerging leaders. Introduce discreetly where intent is high.",
    Signals:
      "Co-create scorecards, async work samples, and intent screens to filter noise and surface clarity.",
    Shortlist:
      "Deliver calibrated candidates with market intel, readiness notes, and recommendations for next steps.",
    Offer:
      "Guide compensation, references, and onboarding. 90-day replacement included for every sprint.",
  }

  return (
    <section className="relative overflow-hidden bg-[#fdf9ef] py-20">
      <Image
        src="/images/Haystack-logo.png"
        alt="Haystack emblem background"
        width={640}
        height={640}
        className="pointer-events-none absolute -right-32 top-12 hidden opacity-10 lg:block"
        aria-hidden
      />
      <div className="container relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">How it works</p>
          <h2 className="font-display text-3xl text-primary">A sprint that keeps momentum</h2>
          <p className="text-base text-primary/70">
            Every phase compresses time-to-signal. Your team stays focused on meaningful interviews, not pipeline admin.
          </p>
        </div>
      </div>
      <div className="container mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            className="rounded-3xl border border-[#e3d7be] bg-white p-6 text-primary"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/50">
              Step {index + 1}
            </span>
            <h3 className="mt-3 font-display text-xl text-primary">{step}</h3>
            <p className="mt-3 text-sm text-primary/70">{descriptions[step]}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1f2640] py-20 text-[#fefbf4]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f2640] via-[#222b47] to-[#1f2640] opacity-90" aria-hidden />
      <div className="container relative flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e8d8b8]">Next sprint launches Monday</p>
        <h2 className="max-w-2xl font-display text-3xl leading-snug">
          Ready to find decisive AI talent? Book a Haystack sprint today.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#fefbf4] px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary transition hover:bg-[#efe4cf]"
          >
            Book a sprint
          </Link>
          <Link
            href="/process"
            className="inline-flex items-center rounded-full border border-[#fefbf4] px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#fefbf4] transition hover:bg-[#fefbf4]/10"
          >
            See our process
          </Link>
        </div>
      </div>
    </section>
  )
}
