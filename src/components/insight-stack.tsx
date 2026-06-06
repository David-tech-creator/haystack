"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"

const tools = [
  {
    index: "01",
    name: "Coding agents",
    headline: "AI-pair on every PR",
    description:
      "Production-grade LLM coding assistants generate boilerplate, components, and tests. Senior engineers review, refactor, and harden — no code reaches main without two human signatures.",
  },
  {
    index: "02",
    name: "Automated QC",
    headline: "Test scripts written for you",
    description:
      "AI predicts edge cases from the spec and authors automated test scripts. QC engineers run exploratory, performance, and security testing on top — evidence-based releases, every time.",
  },
  {
    index: "03",
    name: "Architecture copilots",
    headline: "Design before code",
    description:
      "System options, API contracts, and UI mockups generated upfront so the architecture is settled before a single line of production code ships.",
  },
  {
    index: "04",
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

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
}

export function InsightStack() {
  const reduce = useReducedMotion()
  const motionInitial = reduce ? false : "hidden"

  return (
    <section className="relative overflow-hidden bg-[#10162a] py-24 text-[#fefbf4] md:py-28">
      {/* Ambient depth — two blurred orbs drift behind the content */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-32 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-[#f6d891]/[0.08] blur-[120px]"
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-[#4a6fd6]/[0.10] blur-[120px]"
          animate={reduce ? undefined : { x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative">
        {/* Section header — eyebrow badge, headline, sub */}
        <motion.div
          initial={motionInitial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={stagger}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-[#f6d891]/25 bg-[#f6d891]/[0.08] px-3.5 py-1.5"
          >
            <span className="size-1.5 rounded-full bg-[#f6d891]" aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f6d891]">
              Inside Haystack
            </span>
          </motion.div>

          <motion.h2
            variants={rise}
            className="mt-6 font-display text-[2.25rem] leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[3.25rem]"
          >
            AI-native production.{" "}
            <span className="bg-gradient-to-r from-[#f6d891] via-[#f8e6b6] to-[#f6d891] bg-clip-text text-transparent">
              Human judgment.
            </span>
          </motion.h2>

          <motion.p
            variants={rise}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#f8f0d9]/75 md:text-lg"
          >
            AI agents do the keystroke-heavy work. Senior engineers do the thinking. Here’s the production system that lets us move with conviction.
          </motion.p>
        </motion.div>

        {/* Two-column body */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:gap-8">
          {/* Left column: tool grid + advisors */}
          <div className="space-y-6">
            <motion.div
              initial={motionInitial}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="grid gap-4 sm:grid-cols-2"
            >
              {tools.map((tool) => (
                <motion.div
                  key={tool.name}
                  variants={rise}
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors duration-300 hover:border-[#f6d891]/30 hover:bg-white/[0.06]"
                >
                  {/* Hover glow — appears in the top-right corner */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#f6d891]/0 blur-3xl transition-all duration-500 group-hover:bg-[#f6d891]/15"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#f6d891]/70">{tool.index}</span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#f6d891]/30 to-transparent" />
                    </div>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#cbbd9e]/80">
                      {tool.name}
                    </p>
                    <h3 className="mt-2 font-display text-lg leading-snug text-white">
                      {tool.headline}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#f8f0d9]/70">
                      {tool.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#cbbd9e]/80">
                Senior advisors
              </p>
              <h3 className="mt-2 font-display text-lg leading-snug text-white">
                Architecture review on the hard problems
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#f8f0d9]/75">
                For systems that can’t be wrong — regulated data, on-premise AI, mission-critical operations — senior advisors join the architecture review before code is written and stress-test the production design before launch.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#f8f0d9]/70">
                {advisors.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] inline-block size-1.5 shrink-0 rounded-full bg-[#f6d891]" aria-hidden />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right column: differentiators + what's next */}
          <div className="space-y-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur lg:p-8"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#cbbd9e]/80">
                Why it matters
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug text-white md:text-2xl">
                Speed without slop. Quality without bureaucracy.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#f8f0d9]/75">
                Most agencies pick one: fast and rough, or slow and polished. We use AI to remove the floor on velocity and keep senior engineering judgment as the ceiling on quality. The two compound.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-[#f8f0d9]/75">
                {differentiators.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-[7px] inline-block size-1.5 shrink-0 rounded-full bg-[#f6d891]" aria-hidden />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 120, damping: 22, delay: 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur lg:p-8"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#cbbd9e]/80">
                Beyond the stack
              </p>
              <h3 className="mt-2 font-display text-xl leading-snug text-white md:text-2xl">
                What’s next
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#f8f0d9]/75">
                We continuously evaluate emerging coding agents, autonomous QC pipelines, and on-prem LLM tooling. If something compresses the time-to-shipped without compromising the quality bar, we prove it on our own work before it ever touches yours.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
