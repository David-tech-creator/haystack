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
        <p className="text-lg text-muted-foreground">
          Haystack didn’t appear out of nowhere. It grew from years spent working side-by-side with engineers in Switzerland; consulting engagements, product launches, startup experiments, late-night debugging sessions, and the kinds of conversations you only have with people who genuinely care about their craft.
        </p>
        <p className="text-lg text-muted-foreground">
          Switzerland produces an unusual concentration of top-tier engineers. You feel it inside EPFL, ETH Zürich, HSG’s tech incubators, and across the clusters around Lausanne and Zürich: strong math foundations, deep engineering rigor, and the discipline that comes from research-driven programs. Those people go on to shape teams in Europe, the US, Asia—everywhere.
        </p>
        <p className="text-lg text-muted-foreground">
          This is our home turf. We are embedded in the networks, labs, and startup circles where the next generation of AI, robotics, distributed systems, and applied deep-tech talent comes from. Being part of that ecosystem gives us a living map of the people who take their work seriously.
        </p>
        <p className="text-lg text-muted-foreground">
          We don’t chase every CV or push people into roles that don’t fit. We look for substance: engineers who take responsibility for what they ship and who can explain how they think.
        </p>
        <ul className="space-y-2 text-lg text-muted-foreground">
          <li>• How they’ve built things, not just what they list.</li>
          <li>• Why they made certain choices and the impact that followed.</li>
          <li>• Whether they’re the person you want next to you when something breaks at 3 AM.</li>
        </ul>
        <p className="text-lg text-muted-foreground">
          That approach saves everyone time, keeps teams focused, and compounds the global network we can activate for every search.
        </p>
      </div>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-wheat-100">
          Principles
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title} className="rounded-3xl border border-navy-100/60 bg-[#fef8ec]/85 p-6 text-sm text-muted-foreground shadow-sm backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-wheat-50">
                {principle.title}
              </h3>
              <p className="mt-3">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
