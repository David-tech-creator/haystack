"use client"

import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const values = [
  {
    title: "Speed",
    headline: "5-day shortlist",
    description:
      "Intake on Monday, calibrated shortlist by Friday. Your hiring team stays focused on the right conversations.",
  },
  {
    title: "Signal",
    headline: "≤3 interviews → offer",
    description:
      "Scorecards and work samples engineered to surface intent and alignment, not volume.",
  },
  {
    title: "Guarantee",
    headline: "90-day replacement",
    description:
      "Confidence for every hire. If it’s not a fit, we re-engage instantly with refreshed signals.",
  },
]

export function ValueCards() {
  return (
    <section className="container py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
          >
            <Card className="h-full border border-[#e3d7be] bg-[#fdf9ef] shadow-sm">
              <CardHeader>
                <p className="text-xs uppercase tracking-[0.25em] text-primary/70">{value.title}</p>
                <CardTitle className="font-display text-2xl text-primary">{value.headline}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-primary/70">{value.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
