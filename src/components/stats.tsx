"use client"

import { motion, useSpring, useTransform } from "framer-motion"

const stats = [
  {
    label: "Offer acceptance",
    value: 92,
    suffix: "%",
  },
  {
    label: "Diverse slates",
    value: 68,
    suffix: "%",
  },
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

type StatTextProps = {
  label: string
  value: number
  suffix?: string
  index: number
}

function StatText({ label, value, suffix, index }: StatTextProps) {
  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20,
  })
  const formatted = useTransform(spring, (latest) => `${Math.round(latest)}${suffix ?? ""}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      className="space-y-2"
      onViewportEnter={() => {
        spring.set(value)
      }}
    >
      <motion.span className="block font-display text-5xl text-primary">{formatted}</motion.span>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/60">{label}</p>
    </motion.div>
  )
}
