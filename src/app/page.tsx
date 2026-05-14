"use client"

import { Hero } from "@/components/hero"
import { InsightStack } from "@/components/insight-stack"
import { Logos } from "@/components/logos"
import { Stats } from "@/components/stats"
import { Testimonials } from "@/components/testimonials"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Logos />
      <ServicePillars />
      <ProductionProcess />
      <InsightStack />
      <Stats />
      <Testimonials />
      <FinalCTA />
    </div>
  )
}

function ServicePillars() {
  const services = [
    {
      title: "System Development",
      copy: "Bespoke platforms, web and mobile applications, and integrations — designed, engineered, and operated to the standard your business depends on.",
    },
    {
      title: "Digital Transformation",
      copy: "Replace manual operations with measurable automation. We re-engineer the workflows that drain your margins.",
    },
    {
      title: "AI, IoT, Cloud & Big Data",
      copy: "Production AI agents, predictive systems, IoT telemetry, and cloud-native data platforms — built to ship, not to demo.",
    },
    {
      title: "Blockchain & Web3",
      copy: "Smart contracts, custody, on-chain settlement, and Web3 applications with security-first architecture.",
    },
    {
      title: "IT Operations",
      copy: "We don’t walk away at launch. Managed operations, SRE, and 24/7 support keep the system running and improving.",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#fdf9ef] py-20">
      <div className="container relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">What we do</p>
          <h2 className="font-display text-3xl text-primary">Five pillars. One delivery team.</h2>
          <p className="text-base text-primary/70">
            Most agencies pick a lane. We cover the full surface area &mdash; from greenfield product engineering to enterprise transformation programs &mdash; with the same senior team and the same quality bar.
          </p>
        </div>
      </div>
      <div className="container mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            className="rounded-3xl border border-[#e3d7be] bg-[#fef8ec] p-6 text-primary"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/50">
              Service 0{index + 1}
            </span>
            <h3 className="mt-3 font-display text-xl text-primary">{service.title}</h3>
            <p className="mt-3 text-sm text-primary/70">{service.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductionProcess() {
  const phases = [
    {
      title: "Business Analysis",
      items: ["AI drafts user stories, PRDs, data models", "Senior BA reviews, refines, validates scope", "Output: locked PRD & specs"],
    },
    {
      title: "Architecture & Design",
      items: ["AI generates system options, API specs, UI mockups", "Architect selects stack, finalizes prototype", "Output: approved tech stack & design"],
    },
    {
      title: "AI-Assisted Build",
      items: ["AI generates boilerplate, components, unit tests", "Engineers code-review, refactor, harden", "Output: clean source & unit coverage"],
    },
    {
      title: "Rigorous Testing",
      items: ["AI writes test scripts, predicts edge cases", "QC team runs exploratory, perf, security", "Output: test report & quality metrics"],
    },
    {
      title: "Acceptance & Release",
      items: ["AI generates deployment scripts & release notes", "Client UAT, final approval, go-live support", "Output: shipped product & ops handover"],
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#f6f0e2] py-20">
      <div className="container relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">How we build</p>
          <h2 className="font-display text-3xl text-primary">Top engineers &times; AI = superior products.</h2>
          <p className="text-base text-primary/70">
            AI agents handle the keystroke-heavy work at every stage. Senior engineers make the judgment calls. The result: speed without the slop, quality without the bureaucracy.
          </p>
        </div>
      </div>
      <div className="container mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
            className="rounded-3xl border border-[#e3d7be] bg-[#fef8ec] p-6 text-primary"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/50">Phase {index + 1}</span>
            <h3 className="mt-3 font-display text-lg text-primary">{phase.title}</h3>
            <ul className="mt-4 space-y-2">
              {phase.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary/70">
                  <span className="mt-1.5 inline-flex size-1.5 rounded-full bg-[#f4ca64]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 text-[#fefbf4]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-[#222b47] to-primary opacity-90" aria-hidden />
      <div className="container relative flex flex-col items-center gap-6 rounded-[2.5rem] border border-white/10 bg-[#fefbf4]/16 px-10 py-12 text-center backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e8d8b8]">Discovery call within one business day</p>
        <h2 className="max-w-2xl font-display text-3xl leading-snug text-[#fefbf4] drop-shadow-[0_12px_28px_rgba(13,18,33,0.55)]">
          Have a product to ship, a system to rebuild, or a workflow to automate? Tell us where it hurts.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-[#fefbf4] px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary transition hover:bg-[#efe4cf]"
          >
            Start a project
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
