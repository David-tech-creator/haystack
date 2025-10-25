"use client"

import { motion } from "framer-motion"

const placeholders = ["SignalIQ", "TensorMosaic", "Gradient Labs", "Orbit Data", "NovaOps"]

export function Logos() {
  return (
    <section className="container py-16">
      <div className="rounded-3xl border border-[#e3d7be] bg-[#fdf9ef] p-6 shadow-inner">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">
          Teams scaling faster with Haystack
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-5">
          {placeholders.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
              className="flex h-20 items-center justify-center rounded-xl border border-dashed border-[#d2c19d] bg-[#fbf5e9] text-sm font-semibold tracking-wide text-primary/70"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
