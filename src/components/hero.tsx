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
            className="inline-flex items-center rounded-full bg-[#e8d8b8] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2640]"
          >
            Haystack for AI-native teams
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="font-display text-5xl leading-tight text-[#1f2640] lg:text-[3.6rem]"
          >
            <span className="relative inline-block">
              <span className="absolute inset-x-0 bottom-1 h-4 rounded-full bg-[#f4ca64]/80" aria-hidden />
              <span className="relative font-script italic text-[1.05em]">Move the needle.</span>
            </span>{" "}
            Haystack finds decisive talent the moment you need it.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl text-lg text-[#1f2640]/70"
          >
            <Balancer>
              Prepare the future with clear hiring signals and defined ambitions. Haystack delivers calibrated shortlists, weekly intelligence, and a partner who scales with you.
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
              className="inline-flex items-center rounded-full bg-[#1f2640] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#fefbf4] transition hover:bg-[#1f2640]/90"
            >
              Talk to an expert
            </Link>
            <Link
              href="/roles"
              className="inline-flex items-center rounded-full border border-[#1f2640] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#1f2640] transition hover:bg-[#1f2640]/10"
            >
              See open roles
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
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f2640]/70">
              How we partner
            </h2>
            <span className="h-px flex-1 bg-[#e3d7be]" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Recruitment sprints",
                copy:
                  "Swiss-led search programs that surface decisive AI and data talent with signal-rich evidence, not volume.",
              },
              {
                title: "Outsourcing IT services",
                copy:
                  "Project and managed-team capacity across software, data, and infrastructure from specialists who stay aligned.",
              },
              {
                title: "Nearshore delivery hub",
                copy:
                  "Embedded team in Tirana, Albania, multilingual, cloud-certified, and ready to scale when saturated markets can’t.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#e3d7be]/70 bg-[#fef8ec] p-5 text-sm text-[#1f2640]/75"
              >
                <h3 className="font-display text-lg text-[#1f2640]">{item.title}</h3>
                <p className="mt-2 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
