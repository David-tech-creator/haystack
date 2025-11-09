import type { Metadata } from "next"

const foundations = [
  {
    title: "Swiss engineering roots",
    description:
      "Years spent alongside Lausanne and Zürich engineering teams—consultancies, product launches, startup labs, and late-night debugging sessions—shaped how we work.",
  },
  {
    title: "Embedded networks",
    description:
      "EPFL, ETH Zürich, HSG incubators, and the clusters across Romandy and Zürich are our home turf. We stay close to the labs, founders, and technologists building what’s next.",
  },
  {
    title: "Global network, unsaturated talent",
    description:
      "Swiss-led relationships follow alumni into leadership roles across Europe, the US, and Asia. While traditional hubs are saturated, our network opens new capacity without the churn.",
  },
]

const principles = [
  {
    title: "Signal first",
    description: "Quality evidence over volume. Every shortlist is benchmarked against hands-on delivery and practical context.",
  },
  {
    title: "Transparency",
    description: "Clients see what we see: clear dashboards, straightforward expectations, honest readouts.",
  },
  {
    title: "Momentum",
    description: "Hiring has to match product velocity. Our sprints compound progress and keep talent engaged.",
  },
]

const evaluation = [
  "How candidates have built things—not just what they list.",
  "Why they made specific technical or product choices.",
  "What impact the work delivered and who relied on it.",
  "Whether you’d want them next to you when something breaks at 3 AM.",
]

export const metadata: Metadata = {
  title: "About",
  description: "Learn how Haystack’s Swiss roots, embedded networks, and signal-first principles support AI-native hiring.",
}

export default function AboutPage() {
  return (
    <div className="space-y-20 bg-[#f6f0e2] py-16 sm:py-24">
      <div className="container">
        <div className="rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:p-14">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#1f2640]/50">About Haystack</p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#1f2640] md:text-5xl">Why Haystack exists</h1>
            <p className="text-lg text-[#1f2640]/70">
              Haystack is an AI-native recruitment partner for teams shipping machine learning into production. We blend
              technical recruiting experience with signal-rich tooling so ambitious companies land decisive hires faster.
            </p>
          </div>
        </div>
      </div>

      <section className="container">
        <div className="grid gap-6 md:grid-cols-3">
          {foundations.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#e3d7be]/60 bg-[#fef8ec] p-6 text-sm text-[#1f2640]/75 shadow-sm"
            >
              <h3 className="font-display text-xl text-[#1f2640]">{item.title}</h3>
              <p className="mt-3 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="grid gap-10 rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)] md:p-14">
          <div className="space-y-4 text-lg text-[#1f2640]/75">
            <h2 className="font-display text-2xl text-[#1f2640]">Outsourcing IT Services + Nearshore Delivery Hub</h2>
            <p>
              We are a Swiss full-service partner for business and technology solutions. Alongside recruitment sprints we
              deliver managed engineering, data, and platform services anchored in our Tirana, Albania hub—built to stay
              close, multilingual, and secure.
            </p>
            <p>
              Traditional nearshore hotspots are crowded, expensive, and prone to turnover. Albania’s ecosystem is scaling
              fast without the saturation: a young workforce, cloud-certified specialists, and incentives that let teams
              grow with discipline instead of churn.
            </p>
            <p>
              Swiss direction, Albanian delivery, global reach—that mix keeps velocity high while giving clients the
              continuity they can’t find in overheated markets.
            </p>
          </div>
          <ul className="space-y-3 rounded-2xl border border-[#e3d7be]/70 bg-[#fef8ec] p-6 text-sm text-[#1f2640]/80">
            {[
              "3,500+ engineering graduates a year and a tech sector growing 12.7% CAGR (2020–2027).",
              "Average labour costs 30–50% below saturated EU hubs, with 85% of professionals certified on AWS, Azure, or GCP.",
              "Tirana is a two-hour flight from major EU capitals, enabling real-time collaboration and low attrition.",
              "Multilingual delivery—Italian, English, German, French—built into every squad.",
              "Government incentives: 15% corporate tax, 0% VAT on exported services, payroll rebates for graduate hires.",
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
        <div className="grid gap-10 rounded-3xl border border-[#e3d7be] bg-[#fefbf4] p-10 shadow-sm md:grid-cols-[minmax(0,1.15fr),minmax(0,0.85fr)] md:p-14">
          <div className="space-y-4 text-lg text-[#1f2640]/75">
            <h2 className="font-display text-2xl text-[#1f2640]">How we evaluate talent</h2>
            <p>
              We don’t chase every CV or push people into roles that don’t fit. We look for substance—engineers who take
              responsibility for what they ship and can explain how they think.
            </p>
            <p>That lens keeps teams focused and compounds the global network we activate for every search.</p>
          </div>
          <ul className="space-y-3 rounded-2xl border border-[#e3d7be]/70 bg-[#fef8ec] p-6 text-sm text-[#1f2640]/80">
            {evaluation.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-1 inline-flex size-2 rounded-full bg-[#f4ca64]" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container space-y-6">
        <h2 className="font-display text-2xl text-[#1f2640]">Principles</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <div
              key={principle.title}
              className="rounded-3xl border border-[#e3d7be]/60 bg-[#fef8ec] p-6 text-sm text-[#1f2640]/75 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#1f2640]">{principle.title}</h3>
              <p className="mt-3 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
