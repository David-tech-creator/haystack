"use client"

import { motion } from "framer-motion"

const tools = [
  {
    name: "Coding agents",
    headline: "AI-pair on every PR",
    description:
      "Production-grade LLM coding assistants generate boilerplate, components, and tests. Senior engineers review, refactor, and harden — no code reaches main without two human signatures.",
  },
  {
    name: "Automated QC",
    headline: "Test scripts written for you",
    description:
      "AI predicts edge cases from the spec and authors automated test scripts. QC engineers run exploratory, performance, and security testing on top — evidence-based releases, every time.",
  },
  {
    name: "Architecture copilots",
    headline: "Design before code",
    description:
      "System options, API contracts, and UI mockups generated upfront so the architecture is settled before a single line of production code ships.",
  },
  {
    name: "Ops automation",
    headline: "Runbooks that run themselves",
    description:
      "Generated deployment scripts, observability wiring, and incident runbooks. The handover document is a system, not a PDF.",
  },
]

const advisors = [
  "Lead engineers from enterprise-grade AI deployments across regulated sectors",
  "Architects with production track records in fintech, manufacturing, and healthcare",
  "Specialists in LLM safety, RAG architectures, and on-premise AI for sensitive data",
]

const differentiators = [
  "AI agents embedded at every production stage — not bolted on as a marketing layer",
  "Senior engineering review on every commit, every architecture decision, every release",
  "ISO/IEC 27001 controls across the production estate, audit-grade by default",
]

export function InsightStack() {
  return (
    <section className="bg-[#10162a] py-24 text-[#fefbf4]">
      <div className="container grid gap-16 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#cbbd9e]/80">Inside Haystack</p>
          <h2 className="inline-block rounded-full bg-[#f6d891] px-5 py-2 font-display text-3xl leading-tight text-primary shadow-[0_12px_30px_rgba(15,18,30,0.45)] md:text-4xl">
            AI-native production. Human judgment.
          </h2>
          <p className="max-w-xl text-base text-[#f8f0d9]/80">
            AI agents do the keystroke-heavy work. Senior engineers do the thinking. Here’s the production system that lets us move with conviction.
          </p>

          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-[#fefbf4]/10 p-6 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">{tool.name}</p>
                <h3 className="mt-3 font-display text-xl text-white">{tool.headline}</h3>
                <p className="mt-3 text-sm text-[#f8f0d9]/80">{tool.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#fefbf4]/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Senior advisors</p>
            <h3 className="mt-3 font-display text-xl text-white">Architecture review on the hard problems</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              For systems that can’t be wrong — regulated data, on-premise AI, mission-critical operations — senior advisors join the architecture review before code is written and stress-test the production design before launch.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#f8f0d9]/70">
              {advisors.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-[#f6d891]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-[#fefbf4]/10 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Why it matters</p>
            <h3 className="mt-3 font-display text-2xl text-white">Speed without slop. Quality without bureaucracy.</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              Most agencies pick one: fast and rough, or slow and polished. We use AI to remove the floor on velocity and keep senior engineering judgment as the ceiling on quality. The two compound.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#f8f0d9]/75">
              {differentiators.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex size-2 rounded-full bg-[#f6d891]" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#fefbf4]/10 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Beyond the stack</p>
            <h3 className="mt-3 font-display text-2xl text-white">What’s next</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              We continuously evaluate emerging coding agents, autonomous QC pipelines, and on-prem LLM tooling. If something compresses the time-to-shipped without compromising the quality bar, it lives in our kitchen before it touches yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
