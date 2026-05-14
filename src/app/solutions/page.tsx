"use client"

import type { Route } from "next"
import Link from "next/link"
import { motion } from "framer-motion"

const platforms = [
  {
    eyebrow: "Enterprise AI platform",
    title: "Unified intelligence layer",
    copy: "Connect every data source in the business into a single operational AI fabric. Real-time dashboards, anomaly detection, forecasting, and prebuilt task apps that automate the work humans shouldn’t be doing.",
    outcome: "Save 10–20 hours/month per knowledge worker. Catch issues before they escalate. Avoid six-figure mistakes.",
  },
  {
    eyebrow: "System integration",
    title: "Smart integration platform",
    copy: "One source of truth across ERP, CRM, accounting, and operational systems. Automated workflows replace email chains. Open architecture scales to whatever you add next.",
    outcome: "Eliminate duplicate entry. Shorten approval cycles. Ready for the next acquisition.",
  },
]

const products = [
  {
    sector: "Operations Automation",
    title: "AI-powered order processing",
    copy: "Read invoices, POs, and emails from PDF or Excel; validate against business rules; push directly into ERP/CRM with full audit trail. Built for high-volume operations.",
    proof: "Global packaging group: 2 min/order, 100% accuracy, 30% staff reallocated to higher-value work.",
  },
  {
    sector: "Customer Engagement",
    title: "Customer 360° & loyalty platform",
    copy: "Consolidate every channel into one customer record. Automated tiering, point accrual, redemption, segmented campaigns, behaviour analytics — all with measurable campaign ROI.",
    proof: "Deployed across fertiliser, dental, and retail. 30–50% reduction in care workload.",
  },
  {
    sector: "Workplace & Food Service",
    title: "Smart canteen platform",
    copy: "Face-recognition pickup, app or kiosk pre-ordering, portion forecasting, and nutrition reporting. Runs offline 24/7 with full kitchen workflow automation.",
    proof: "Vietnam’s leading fertiliser enterprise: 1,000+ employees served, zero queue, zero food waste.",
  },
  {
    sector: "Knowledge & Productivity",
    title: "Internal AI agent assistant",
    copy: "An enterprise-grade retrieval assistant that reads your PDFs, Word docs, Excel files, websites, and technical documentation — and answers internal questions without hallucinating, behind strict access controls.",
    proof: "Cuts manual document search time by 90%. Data stays on your perimeter.",
  },
  {
    sector: "Education & Training",
    title: "Smart training platform",
    copy: "Personalised learning paths driven by AI, 24/7 assistant for learner queries, dashboard tracking real training ROI. For training centres and corporate L&D.",
    proof: "Higher completion rates, lower support staffing, measurable training ROI.",
  },
  {
    sector: "Healthcare",
    title: "Smart dental clinic management",
    copy: "Online booking with SMS/messaging reminders, comprehensive digital patient records, X-ray storage, and recall automation. Patients show up; dentists focus on dentistry.",
    proof: "Reduces no-shows, lookup time down by 90%, better patient experience.",
  },
  {
    sector: "Automotive",
    title: "Dealer & showroom management",
    copy: "Real-time dealer dashboards, centralised order and inventory, smart KPI and alert system. Digitise every part of dealer operations on a single platform.",
    proof: "Higher sales effectiveness, tighter inventory control, data-driven dealer evaluation.",
  },
  {
    sector: "Logistics & Fleet",
    title: "Fleet & driver management",
    copy: "iOS app for drivers, web platform for branch managers. Track vehicle handover, monitor driver location, manage personnel and routes in real time.",
    proof: "Reduces handover errors and dispatch friction across distribution networks.",
  },
  {
    sector: "Manufacturing 4.0",
    title: "Predictive maintenance & diagnostics",
    copy: "IoT-fed vibration and temperature analytics with AI early-warning. Detect failure patterns before they cause downtime. Cross-domain from conveyor belts to production lines.",
    proof: "Lower maintenance cost, fewer unplanned stops, longer asset life.",
  },
  {
    sector: "Workforce",
    title: "Time, attendance & payroll system",
    copy: "Shift management, time tracking with image/voice reporting, automated payroll based on real shifts. For large-scale enterprises that have outgrown spreadsheets.",
    proof: "Accurate, transparent payroll. Fewer disputes, less HR admin.",
  },
  {
    sector: "Agriculture",
    title: "Crop diagnosis & advisory chatbot",
    copy: "Farmers photograph a leaf or root; the AI identifies pests, diseases, and recommends treatment dosage and crop protection. 24/7 technical support on mobile.",
    proof: "Lower input cost, protected yield, mobile-first for field conditions.",
  },
  {
    sector: "Finance",
    title: "AI financial advisor",
    copy: "Combines technical indicators (RSI, MACD), macroeconomic data, and corporate news into evidence-based trade signals. Risk assessment included.",
    proof: "Deep analysis, trend anticipation, portfolio optimisation for modern investors.",
  },
]

export default function SolutionsPage() {
  return (
    <div className="bg-[#f6f0e2] py-16 sm:py-24">
      <div className="container space-y-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/50">Solutions</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">
            Production-ready platforms, hardened on real workloads.
          </h1>
          <p className="text-lg text-primary/70">
            Beyond bespoke engineering, we ship a portfolio of productised platforms — proven across enterprises in operations, healthcare, manufacturing, finance, and beyond. Each is deployable in weeks, customisable in months, and built on the same Japanese-quality stack.
          </p>
        </div>

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">Foundational platforms</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {platforms.map((p, index) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
                className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-8 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-primary/50">{p.eyebrow}</p>
                <h3 className="mt-3 font-display text-2xl text-primary">{p.title}</h3>
                <p className="mt-4 text-base text-primary/75 leading-relaxed">{p.copy}</p>
                <p className="mt-4 text-sm font-semibold text-primary/85">{p.outcome}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/60">Industry solutions</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p, index) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (index % 6) * 0.06 }}
                className="rounded-3xl border border-[#e3d7be]/70 bg-[#fef8ec] p-6 text-primary"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/50">
                  {p.sector}
                </span>
                <h3 className="mt-3 font-display text-xl text-primary">{p.title}</h3>
                <p className="mt-3 text-sm text-primary/70 leading-relaxed">{p.copy}</p>
                <p className="mt-4 text-xs italic text-primary/60">{p.proof}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 text-center shadow-sm md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">Custom builds</p>
          <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl">
            Don’t see what you need?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-primary/70">
            The platforms above are starting points, not endpoints. Most engagements start with a custom system designed for your business, your data, and your buyers — built on the same AI-native production stack.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={"/contact" as Route}
              className="inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:bg-primary/90"
            >
              Start a project
            </Link>
            <Link
              href={"/process" as Route}
              className="inline-flex items-center rounded-full border border-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary transition hover:bg-primary/5"
            >
              See our process
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
