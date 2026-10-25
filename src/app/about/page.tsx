import { StaticNeedle } from "@/components/particles"
import { CtaSection, Eyebrow, ready } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { ABOUT, LOOK_FOR } from "@/lib/content"
import { aboutJsonLd, pageMetadata } from "@/lib/seo"

const DESCRIPTION =
  "Haystack is a small recruitment agency in Geneva with Swiss engineering roots and a simple rule: evidence over volume."

export const metadata = pageMetadata({ title: "About", description: DESCRIPTION, path: "/about" })

export default function AboutPage() {
  return (
    <>
      <StructuredData data={aboutJsonLd(DESCRIPTION)} />

      {/* the needle, already out of the pile */}
      <section
        data-formation="needle"
        data-needle="still"
        aria-labelledby="about-title"
        className="fm fm-hero"
        style={ready("needle", "115vh")}
      >
        <div className="fm-stage">
          <div className="wrap grid items-center gap-10 pt-16 lg:grid-cols-12 lg:pt-0">
            <div className="fm-copy lg:col-span-6" style={{ ["--ready" as string]: 1 }}>
              <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
              <h1 id="about-title" className="mt-5 text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-6xl">
                {ABOUT.title}
              </h1>
              <p className="hero-sub fm-lead mt-6 max-w-xl text-lg leading-relaxed text-primary/80">{ABOUT.intro}</p>
              <p className="fm-hide-short mt-4 max-w-xl leading-relaxed text-primary/80">{ABOUT.story}</p>
            </div>
            <StaticNeedle className="mx-auto w-full max-w-[16rem] sm:max-w-xs lg:col-span-5 lg:col-start-8" />
          </div>
        </div>
      </section>

      <section aria-labelledby="roots-title" className="fm-flow">
        <div className="wrap">
          <h2 id="roots-title" className="text-3xl leading-tight sm:text-4xl">
            Foundations
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {ABOUT.foundations.map((f) => (
              <li key={f.title} className="card p-7">
                <h3 className="text-xl">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-primary/80">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="evaluate-title" className="fm-flow pt-0 lg:pt-0">
        <div className="wrap">
          <div className="max-w-3xl">
          <h2 id="evaluate-title" className="text-3xl leading-tight sm:text-4xl">
            {ABOUT.evaluate.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-primary/80">{ABOUT.evaluate.body}</p>
          <ul className="mt-6 space-y-3">
            {LOOK_FOR.list.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-gold" />
                <span className="text-primary/90">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 leading-relaxed text-primary/80">{ABOUT.evaluate.closing}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="fm-flow pt-0 lg:pt-0">
        <div className="wrap">
          <h2 id="principles-title" className="text-3xl leading-tight sm:text-4xl">
            Principles
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {ABOUT.principles.map((p) => (
              <li key={p.title} className="card p-7">
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-primary/80">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
