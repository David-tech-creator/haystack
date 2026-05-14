import type { Metadata } from "next"

const foundations = [
  {
    title: "Geneva-anchored",
    description:
      "Headquartered in Switzerland. Engagement governance, contracting, and client relationships operate to the standard our European and US enterprise clients expect.",
  },
  {
    title: "Japanese-quality engineering",
    description:
      "Our delivery discipline is shaped by Japan’s most demanding market — specification-first, defect-averse, documentation-complete. ISO/IEC 27001 certified across the production estate.",
  },
  {
    title: "AI-native production",
    description:
      "AI agents handle the keystroke-heavy work at every stage of the build. Senior engineers make the judgment calls. Velocity without slop.",
  },
]

const values = [
  {
    title: "Quality & Speed",
    description: "We move fast without leaving defects behind. Every shipped deliverable carries a quality signature.",
  },
  {
    title: "Integrity & Transparency",
    description: "Honest readouts, clear contracts, real numbers. No padded estimates, no surprise invoices.",
  },
  {
    title: "Innovation & Courage",
    description: "We propose what we’d build for ourselves — not the safest option, the right one.",
  },
  {
    title: "Customer-Centricity",
    description: "Deep understanding of your business comes before code. We embed, we listen, then we ship.",
  },
  {
    title: "Respect & Collaboration",
    description: "Senior engineers who treat your team as peers. No layered account managers, no agency theatre.",
  },
]

const milestones = [
  { year: "2019", note: "Engineering practice founded in Ho Chi Minh City." },
  { year: "2024", note: "Tokyo office opens. Hanoi office opens. Japanese-quality program formalised." },
  { year: "2025", note: "Melbourne office opens. Cross 130+ engineers." },
  { year: "2026", note: "Geneva HQ, Silicon Valley presence. 200+ projects delivered." },
]

export const metadata: Metadata = {
  title: "About",
  description: "Haystack is a Geneva-anchored AI software agency. Japanese-quality engineering, AI-native production, delivery teams across Asia-Pacific.",
}

export default function AboutPage() {
  return (
    <div className="space-y-20 bg-[#f6f0e2] py-16 sm:py-24">
      <div className="container">
        <div className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:p-14">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/50">About Haystack</p>
            <h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">Software, shipped with conviction.</h1>
            <p className="text-lg text-primary/70">
              Haystack is an AI-native software agency. We design, build, and operate the systems modern enterprises and venture-backed startups can’t afford to get wrong — from custom platforms and AI agents to end-to-end digital transformation programs.
            </p>
            <p className="text-lg text-primary/70">
              Geneva governance. Japanese-quality engineering discipline. Senior delivery teams across Ho Chi Minh City, Hanoi, Tokyo, and Melbourne. Expanding to Silicon Valley by 2026.
            </p>
          </div>
        </div>
      </div>

      <section className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {foundations.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#e3d7be]/60 bg-[#fef8ec] p-6 text-sm text-primary/75 shadow-sm"
            >
              <h3 className="font-display text-xl text-primary">{item.title}</h3>
              <p className="mt-3 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="grid gap-10 rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)] md:p-14">
          <div className="space-y-4 text-lg text-primary/75">
            <h2 className="font-display text-2xl text-primary">The internal kitchen</h2>
            <p>
              Every great agency has an internal kitchen. Ours is an exclusive engineering partnership across Asia-Pacific — 130+ senior engineers, ISO/IEC 27001 certified, recruited directly from Vietnam’s top computer science programs and trained in Japanese-quality delivery practice.
            </p>
            <p>
              Average labour costs are a fraction of saturated EU and US hubs without the quality compromise that usually comes with it. Our engineers stay for years, not months. Most projects keep the same lead engineer from kickoff through handover.
            </p>
            <p className="text-sm italic text-primary/60">
              200+ projects delivered. 130+ engineers. 7 years operating without a single security incident.
            </p>
          </div>
          <ul className="space-y-3 rounded-2xl border border-[#e3d7be]/70 bg-[#fef8ec] p-6 text-sm text-primary/80">
            {[
              "Ho Chi Minh City — primary engineering hub, founded 2019",
              "Hanoi — second engineering hub, opened 2024",
              "Tokyo — client liaison and Japanese-quality program, opened 2024",
              "Melbourne — APAC client relations, opened 2025",
              "Geneva — agency HQ, engagement governance, EU/UK clients",
              "Silicon Valley — US client relations, opening 2026",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-1 inline-flex size-2 rounded-full bg-[#f4ca64]" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container">
        <div className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:p-14">
          <h2 className="font-display text-2xl text-primary">Journey</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.year} className="rounded-2xl border border-[#e3d7be]/60 bg-[#fef8ec] p-6 text-sm text-primary/80">
                <p className="font-display text-3xl text-primary">{m.year}</p>
                <p className="mt-2 leading-relaxed">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="font-display text-2xl text-primary">Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-[#e3d7be]/60 bg-[#fef8ec] p-6 text-sm text-primary/75 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-primary">{value.title}</h3>
              <p className="mt-3 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
