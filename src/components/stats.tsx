"use client"

import { motion, useSpring, useTransform } from "framer-motion"

const stats = [
  {
    label: "Time-to-shortlist",
    value: 5,
    suffix: " days",
  },
  {
    label: "Interview → offer",
    value: 3,
    suffix: " interviews",
  },
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
    <section className="bg-[#efe4cf] py-18">
      <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatTile key={stat.label} index={index} {...stat} />
        ))}
      </div>
    </section>
  )
}

type StatTileProps = {
  label: string
  value: number
  suffix?: string
  index: number
}

function StatTile({ label, value, suffix, index }: StatTileProps) {
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
      className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-6 shadow-sm"
      onViewportEnter={() => {
        spring.set(value)
      }}
    >
      <motion.span className="font-display text-4xl text-primary">{formatted}</motion.span>
      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary/60">{label}</p>
    </motion.div>
  )
}
