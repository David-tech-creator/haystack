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
            Haystack finds decisive talent step by step.
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
            src="/images/Needle.png"
            alt="Needle in haystack illustration"
            width={880}
            height={660}
            priority
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  )
}
