import { StaticHaystack } from "@/components/particles"
import { CtaSection, Eyebrow, ready } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { PROCESS, STEPS } from "@/lib/content"
import { pageMetadata, processJsonLd } from "@/lib/seo"

const DESCRIPTION =
  "How a Haystack recruitment sprint runs: scorecards agreed up front, work samples, weekly evidence updates and help with the offer."

export const metadata = pageMetadata({ title: "Process", description: DESCRIPTION, path: "/process" })

export default function ProcessPage() {
  return (
    <>
      <StructuredData data={processJsonLd(DESCRIPTION)} />

      {/* the search line stands on the gold straw */}
      <section
        data-formation="sweep"
        data-sweep="still"
        aria-labelledby="process-title"
        className="fm fm-hero"
        style={ready("sweep", "115vh")}
      >
        <div className="fm-stage">
          <div className="wrap grid items-center gap-10 pt-16 lg:grid-cols-12 lg:pt-0">
            <div className="fm-copy lg:col-span-6" style={{ ["--ready" as string]: 1 }}>
              <Eyebrow>{PROCESS.eyebrow}</Eyebrow>
              <h1 id="process-title" className="mt-5 text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-6xl">
                {PROCESS.title}
              </h1>
              <p className="hero-sub fm-lead mt-6 max-w-xl text-lg leading-relaxed text-primary/80">{PROCESS.intro}</p>
            </div>
            <StaticHaystack className="mx-auto w-full max-w-[16rem] sm:max-w-xs lg:col-span-5 lg:col-start-8" />
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="fm-flow">
        <div className="wrap">
          <h2 id="steps-title" className="text-3xl leading-tight sm:text-4xl">
            Five steps, one role
          </h2>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card p-6">
                <span className="step-n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-primary/80">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="details-title" className="fm-flow pt-0 lg:pt-0">
        <div className="wrap grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <h2 id="details-title" className="text-3xl leading-tight sm:text-4xl">
              Sprint details
            </h2>
            <div className="mt-8 border-t border-line">
              {PROCESS.details.map((d, i) => (
                <details key={d.title} className="qa" open={i === 0}>
                  <summary>{d.title}</summary>
                  <div>
                    <p>{d.body}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
          <aside aria-labelledby="includes-title" className="card h-fit p-7 lg:sticky lg:top-28">
            <h2 id="includes-title" className="text-2xl">
              {PROCESS.includesTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {PROCESS.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <CtaSection eyebrow="Next step" title={PROCESS.cta} secondary={{ label: "About Haystack", href: "/about" }} />
    </>
  )
}
