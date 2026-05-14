"use client"

import { motion, useSpring, useTransform } from "framer-motion"

type Stat = {
  label: string
  value?: number
  suffix?: string
  display?: string
}

const stats: Stat[] = [
  { label: "Senior engineers", value: 130, suffix: "+" },
  { label: "Projects delivered", value: 200, suffix: "+" },
  { label: "Years operating", value: 7 },
  { label: "Security standard", display: "ISO/IEC 27001" },
]

export function Stats() {
  return (
    <section className="bg-[#fdf9ef] py-16">
      <div className="container grid gap-8 text-primary sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatText key={stat.label} index={index} {...stat} />
        ))}
      </div>
    </section>
  )
}

type StatTextProps = Stat & { index: number }

function StatText({ label, value, suffix, display, index }: StatTextProps) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 })
  const formatted = useTransform(spring, (latest) => `${Math.round(latest)}${suffix ?? ""}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      className="space-y-2"
      onViewportEnter={() => {
        if (typeof value === "number") spring.set(value)
      }}
    >
      {display ? (
        <span className="block font-display text-4xl text-primary md:text-5xl">{display}</span>
      ) : (
        <motion.span className="block font-display text-5xl text-primary">{formatted}</motion.span>
      )}
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/60">{label}</p>
    </motion.div>
  )
}
