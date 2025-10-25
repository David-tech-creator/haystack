import type { Metadata } from "next"

const principles = [
  {
    title: "Signal first",
    description: "We index on quality evidence, not volume. Every candidate is benchmarked against real-world delivery and context." ,
  },
  {
    title: "Transparency",
    description: "We give hiring teams the same visibility we expect internally—clear dashboards, straightforward expectations, honest readouts." ,
  },
  {
    title: "Momentum",
    description: "When teams move fast, hiring has to keep pace. We design sprints that compound and keep talent engaged." ,
  },
]

const team = [
  {
    name: "Asha Menon",
    role: "Founder & CEO",
    bio: "Former Head of Talent at growth-stage ML startup. Built engineering teams across three continents.",
  },
  {
    name: "Noah Ellis",
    role: "Head of Delivery",
    bio: "Ex-technical recruiter at top-tier venture studio. Leads sourcing and signal operations.",
  },
  {
    name: "Vivian Chen",
    role: "Signals Lead",
    bio: "Data scientist turned talent strategist. Designs scorecards and work samples for AI teams.",
  },
]

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team building Haystack and the principles guiding our sprints.",
}

export default function AboutPage() {
  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About Haystack</p>
        <h1 className="text-4xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Why Haystack exists
        </h1>
        <p className="text-lg text-muted-foreground">
          Haystack is an AI-native recruitment firm built for companies shipping machine learning into production. We combine technical recruiting experience with signal-rich tooling to help you close key hires faster.
        </p>
      </div>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Principles
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title} className="rounded-3xl border border-navy-100/60 bg-white/80 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-wheat-50">
                {principle.title}
              </h3>
              <p className="mt-3">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Team
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-3xl border border-navy-100/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-wheat-50">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
              <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
