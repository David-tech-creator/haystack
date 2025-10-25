"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="container relative z-10 grid gap-12 md:grid-cols-[minmax(0,1fr),minmax(0,400px)] md:items-center">
        <div className="space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-navy-200/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-navy-600 shadow-sm dark:bg-navy-800/60 dark:text-wheat-200"
            >
              Signal over noise
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="scan-line text-4xl font-semibold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl dark:text-wheat-100"
            >
              Find the needle. Faster.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.2 }}
              className="max-w-xl text-lg text-muted-foreground"
            >
              <Balancer>
                A sprint-based recruitment partner for AI-native teams. We surface verified signals so you can hire decisive talent in days, not quarters.
              </Balancer>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/contact">Book a sprint</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/roles">See open roles</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              {
                label: "5-day shortlist",
                description: "Speed",
              },
              {
                label: "≤3 interviews → offer",
                description: "Signal",
              },
              {
                label: "90-day replacement",
                description: "Guarantee",
              },
              {
                label: "Intent-rich insights",
                description: "Signals",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-navy-100/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-navy-700/60 dark:bg-navy-900/50">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-2 text-xl font-semibold text-navy-900 dark:text-wheat-50">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="relative h-full rounded-3xl border border-navy-100/60 bg-gradient-to-br from-white via-wheat-50 to-navy-50 p-8 shadow-soft-lg dark:border-navy-700/50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-950"
        >
          <div className="grid gap-6">
            {[
              {
                title: "AI-native search",
                detail: "Market-mapped talent pools, refreshed weekly",
              },
              {
                title: "Human-in-the-loop",
                detail: "Specialist recruiters decoding signal from noise",
              },
              {
                title: "Proprietary scoring",
                detail: "Role-specific benchmarks, calibrated with hiring teams",
              },
            ].map((stat) => (
              <div key={stat.title} className="space-y-1">
                <p className="text-sm uppercase tracking-[0.28em] text-wheat-500">
                  {stat.title}
                </p>
                <p className="text-base text-navy-900 dark:text-wheat-50">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/40 opacity-60 dark:border-white/10" />
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 grid-soft" />
    </section>
  )
}
