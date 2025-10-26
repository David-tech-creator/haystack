"use client"

import { motion } from "framer-motion"

const tools = [
  {
    name: "Superhuman",
    headline: "Inbox velocity",
    description:
      "Every candidate thread gets handled in real-time with snippets, reminders, and AI triage. No drift, no ghosting.",
    url: "https://superhuman.com/",
  },
  {
    name: "Juicebox.ai",
    headline: "AI-native sourcing",
    description:
      "Purpose-built search tuned to AI talent signals, with conversation-ready summaries for hiring managers.",
    url: "https://juicebox.ai/",
  },
  {
    name: "Spott",
    headline: "ATS built for AI teams",
    description:
      "YC-backed ATS + CRM that unifies pipeline, experiments, and candidate intelligence in one workspace.",
    url: "https://spott.io/",
  },
]

const advisors = [
  "Staffing leads from European unicorns",
  "Heads of AI at venture-backed scale-ups",
  "Specialists leading technical interviews and use-case design",
]

const differentiators = [
  "Proprietary signal library that scores intent, velocity, and hands-on depth",
  "Dedicated research pod feeding market intel into every sprint",
  "Async talent briefings so hiring teams make decisions in hours, not weeks",
]

export function InsightStack() {
  return (
    <section className="bg-[#10162a] py-24 text-[#fefbf4]">
      <div className="container grid gap-16 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#cbbd9e]/80">Inside Haystack</p>
          <h2 className="inline-block rounded-full bg-[#f6d891] px-5 py-2 font-display text-3xl leading-tight text-[#1f2640] shadow-[0_12px_30px_rgba(15,18,30,0.45)] md:text-4xl">
            AI-native stack, human judgment.
          </h2>
          <p className="max-w-xl text-base text-[#f8f0d9]/80">
            We pair senior operators with an automation-first toolkit so every sprint moves with conviction. Here’s the
            operating system that keeps us days ahead.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">{tool.name}</p>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#f6d891] underline"
                  >
                    Learn
                  </a>
                </div>
                <h3 className="mt-3 font-display text-xl text-white">{tool.headline}</h3>
                <p className="mt-3 text-sm text-[#f8f0d9]/80">{tool.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Advisor Bench</p>
            <h3 className="mt-3 font-display text-xl text-white">Technical signal review</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              Senior advisors embedded in Europe’s top AI startups and scale-ups evaluate our recommendations, join
              technical interviews, and stress-test use cases before they reach your panel.
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
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Why it matters</p>
            <h3 className="mt-3 font-display text-2xl text-white">Better signals, faster decisions.</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              AI-native infrastructure means less time on admin and more time aligning on conviction. Our internal kitchen
              keeps data flowing so your team only sees high-intent, technically vetted finalists.
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

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.25em] text-[#cbbd9e]/80">Beyond the stack</p>
            <h3 className="mt-3 font-display text-2xl text-white">What’s next</h3>
            <p className="mt-3 text-sm text-[#f8f0d9]/80">
              We continuously test emerging copilots, async code reviewers, and candidate-supplied demos to keep raising
              the bar. If there’s a tool that compresses time to evidence, it lives in our kitchen before it hits yours.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


