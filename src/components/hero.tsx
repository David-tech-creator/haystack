"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import Balancer from "react-wrap-balancer"

export function Hero() {
  return (
    <section className="relative bg-[#f6f0e2] py-20 lg:py-24">
      <div className="container grid gap-14 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] lg:items-center">
        <div className="space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center rounded-full bg-[#e8d8b8] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary"
          >
            Geneva &middot; Tokyo &middot; HCMC &middot; Melbourne
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="font-display text-5xl leading-tight text-primary lg:text-[3.6rem]"
          >
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-1 h-4 rounded-full bg-[#f4ca64]/80" aria-hidden />
              <span className="relative font-script italic text-[1.05em]">Move the needle.</span>
            </span>{" "}
            We design, build, and ship the software you can&rsquo;t afford to get wrong.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl text-lg text-primary/70"
          >
            <Balancer>
              Haystack is an AI-native software agency. Japanese-quality engineering, AI agents in every production step, senior teams across Asia-Pacific &mdash; delivered with the discipline of an enterprise vendor and the velocity of a startup.
            </Balancer>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:bg-primary/90"
            >
              Start a project
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary transition hover:bg-primary/5"
            >
              Explore solutions
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-white/80 shadow-lg"
        >
          <Image
            src="/Needle.png"
            alt="Needle in haystack illustration"
            width={880}
            height={660}
            priority
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
          className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-6 shadow-sm md:p-8"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
              What we ship
            </h2>
            <span className="h-px flex-1 bg-[#e3d7be]" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Custom systems",
                copy:
                  "Bespoke platforms, web and mobile applications, and integrations — designed for your business, built for the next decade.",
              },
              {
                title: "AI & agents",
                copy:
                  "Production-grade AI agents, RPA, computer-vision, and LLM systems wired into the workflows that actually move revenue.",
              },
              {
                title: "Digital transformation",
                copy:
                  "End-to-end DX programs: replace manual operations with measurable automation across ERP, CRM, and supply chain.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e3d7be]/70 bg-[#fef8ec] p-5 text-sm text-primary/75"
              >
                <h3 className="font-display text-lg text-primary">{item.title}</h3>
                <p className="mt-2 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
