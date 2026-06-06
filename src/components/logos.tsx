"use client"

import { motion } from "framer-motion"

const placeholders = ["Enterprise", "Manufacturing", "Healthcare", "Finance", "Logistics"]

export function Logos() {
  return (
    <section className="container py-12 md:py-16">
      <div className="rounded-3xl border border-[#e3d7be] bg-[#fdf9ef] p-6 shadow-inner md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">
          Trusted across regulated enterprises and venture-backed startups
        </p>
        {/* Mobile: small chips in a wrap row. sm+: full-height placeholder grid. */}
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:grid sm:grid-cols-5 sm:gap-4">
          {placeholders.map((name, index) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
              className="inline-flex items-center rounded-full border border-dashed border-[#d2c19d] bg-[#fbf5e9] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary/70 sm:h-20 sm:justify-center sm:rounded-xl sm:px-2 sm:py-0 sm:text-sm"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
