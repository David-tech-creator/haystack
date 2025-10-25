"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    quote:
      "Haystack transformed a noisy search into three signal-rich candidates. Our staff ML hire came together in weeks, not months.",
    name: "Priya Kapoor",
    role: "VP Data, Gradient Labs",
  },
  {
    quote:
      "Weekly signal reports kept the founders aligned. We made a senior analytics hire in 18 days without expanding interview load.",
    name: "Jake Morrison",
    role: "Co-founder, Orbit Data",
  },
  {
    quote:
      "Scorecards and work samples gave us clarity we hadn’t seen in previous searches. We closed two applied scientists back-to-back.",
    name: "Linh Tran",
    role: "Head of People, NovaOps",
  },
]

export function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="container py-20">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">Testimonials</p>
          <h2 className="font-display text-3xl text-primary">Teams that scale with Haystack</h2>
        </div>
      </div>
      <div className="relative mt-10">
        <Carousel
          opts={{ loop: true }}
          setApi={(api) => {
            if (!api) return
            const onSelect = () => setActive(api.selectedScrollSnap())
            onSelect()
            api.on("select", onSelect)
          }}
        >
          <CarouselContent>
            {testimonials.map((item, index) => (
              <CarouselItem key={item.name} className="md:basis-1/2 xl:basis-1/3">
                <motion.blockquote
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.08 }}
                  className="h-full rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-8 text-base leading-relaxed text-primary"
                >
                  “{item.quote}”
                  <footer className="mt-5 text-sm text-primary/60">
                    <strong className="block text-primary">{item.name}</strong>
                    {item.role}
                  </footer>
                </motion.blockquote>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        <div className="mt-6 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <span
              key={`dot-${index}`}
              className="h-2 w-2 rounded-full bg-primary/30 transition-all"
              style={{ opacity: active === index ? 1 : 0.4, transform: active === index ? "scale(1.2)" : "scale(1)" }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
