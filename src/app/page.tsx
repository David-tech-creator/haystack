import Link from "next/link"

import { StaticHaystack, StaticNeedle } from "@/components/particles"
import { CtaSection, Eyebrow, FaqList, ready } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { HERO, INSIDE, LOOK_FOR, SHORTLIST, SPRINT, STEPS, WHAT_WE_DO } from "@/lib/content"
import { homeJsonLd, pageMetadata } from "@/lib/seo"
import { SITE } from "@/lib/site"

export const metadata = pageMetadata({ absoluteTitle: SITE.title, description: SITE.description, path: "/" })

export default function HomePage() {
  return (
    <>
      <StructuredData data={homeJsonLd()} />

      {/* 1. The haystack: the logo mark, rebuilt from falling straw */}
      <section data-formation="haystack" aria-labelledby="hero-title" className="fm fm-hero" style={ready("haystack", "150vh")}>
        <div className="fm-stage">
          <div className="wrap grid items-center gap-10 pt-16 lg:grid-cols-12 lg:pt-0">
            {/* the hero copy never waits for the field: it is the first thing painted */}
            <div className="fm-copy lg:col-span-7 xl:col-span-6" style={{ ["--ready" as string]: 1 }}>
              <Eyebrow>{HERO.eyebrow}</Eyebrow>
              <h1 id="hero-title" className="mt-5 text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
                <span className="needle-line">{HERO.accent}</span> {HERO.title}
              </h1>
              <p className="hero-sub mt-6 max-w-xl text-lg leading-relaxed text-primary/80">{HERO.sub}</p>
              <div className="hero-ctas mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link href={HERO.primary.href} className="btn-solid">
                  {HERO.primary.label}
                </Link>
                <Link href={HERO.secondary.href} className="btn-outline">
                  {HERO.secondary.label}
                </Link>
              </div>
            </div>
            <StaticHaystack className="mx-auto w-full max-w-[18rem] sm:max-w-sm lg:col-span-5 lg:max-w-md" />
          </div>
        </div>
      </section>

      {/* 1b. What we do: the stack holds */}
      <section data-formation="haystack" aria-labelledby="what-title" className="fm" style={ready("haystack", "120vh")}>
        <div className="fm-stage">
          <div className="wrap">
            <div className="fm-copy max-w-xl">
              <Eyebrow>{WHAT_WE_DO.eyebrow}</Eyebrow>
              <h2 id="what-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {WHAT_WE_DO.title}
              </h2>
              <p className="fm-lead mt-5 text-lg leading-relaxed text-primary/80">{WHAT_WE_DO.body}</p>
              <div className="card mt-7 p-6">
                <h3 className="text-xl">{WHAT_WE_DO.card.title}</h3>
                <p className="mt-2 text-primary/80">{WHAT_WE_DO.card.body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The sweep: a search line walks the five steps */}
      <section data-formation="sweep" aria-labelledby="sprint-title" className="fm" style={ready("sweep", "340vh")}>
        <div className="fm-stage">
          <div className="wrap">
            <div className="fm-copy sweep-copy">
              <Eyebrow>{SPRINT.eyebrow}</Eyebrow>
              <h2 id="sprint-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {SPRINT.title}
              </h2>
              <p className="fm-lead fm-hide-short mt-5 max-w-xl text-lg leading-relaxed text-primary/80">{SPRINT.intro}</p>
              <ol className="steps mt-8">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="step">
                    <div className="flex items-center gap-3">
                      <span className="step-n" aria-hidden="true">
                        {i + 1}
                      </span>
                      <h3 className="step-title text-xl">{s.title}</h3>
                    </div>
                    <div className="step-body">
                      <p className="pt-3 leading-relaxed text-primary/80 [html[data-particles=on]_&]:pl-12">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The needle: the gold straw comes out of the pile */}
      <section data-formation="needle" aria-labelledby="look-title" className="fm" style={ready("needle", "160vh")}>
        <div className="fm-stage">
          <div className="wrap grid items-center gap-10 lg:grid-cols-12">
            <div className="fm-copy lg:col-span-6">
              <Eyebrow>{LOOK_FOR.eyebrow}</Eyebrow>
              <h2 id="look-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {LOOK_FOR.title}
              </h2>
              <p className="fm-lead mt-5 text-lg leading-relaxed text-primary/80">{LOOK_FOR.body}</p>
              <ul className="mt-6 space-y-3">
                {LOOK_FOR.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-gold" />
                    <span className="text-primary/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <StaticNeedle className="mx-auto w-full max-w-xs lg:col-span-5 lg:col-start-8 lg:max-w-sm" />
          </div>
        </div>
      </section>

      {/* 4. The thread: a running stitch across the dark section */}
      <section data-formation="thread" data-ink="dark" aria-labelledby="inside-title" className="band-dark fm-flow">
        <div className="wrap">
          <div className="max-w-2xl">
            <Eyebrow>{INSIDE.eyebrow}</Eyebrow>
            <h2 id="inside-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
              <span className="inline rounded-2xl bg-gold-pill px-3 leading-[1.5] text-primary [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                {INSIDE.title}
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/85">{INSIDE.body}</p>
          </div>
          <div aria-hidden="true" className="thread-gap" />
          <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
            <ul className="grid gap-5 sm:grid-cols-2">
              {INSIDE.tools.map((t) => (
                <li key={t.name} className="rounded-3xl border border-white/10 bg-[#161d36]/90 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-muted">{t.role}</p>
                  <h3 className="mt-2 text-2xl">{t.name}</h3>
                  <p className="mt-3 leading-relaxed text-paper/80">{t.body}</p>
                  <a
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-gold-pill underline decoration-gold-pill/40 underline-offset-4 hover:decoration-gold-pill"
                  >
                    Visit {t.name}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="grid content-start gap-5">
              {INSIDE.side.map((s) => (
                <div key={s.title} className="rounded-3xl border border-gold-pill/25 bg-[#1a2337]/90 p-6">
                  <h3 className="text-xl text-gold-pill">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-paper/80">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. The stitch: the thread sews around the three parts of a shortlist note */}
      <section
        data-formation="stitch"
        data-outline-target={SHORTLIST.cards.map((c) => c.id).join(",")}
        aria-labelledby="shortlist-title"
        className="fm-flow"
      >
        <div className="wrap">
          <div className="max-w-2xl">
            <Eyebrow>{SHORTLIST.eyebrow}</Eyebrow>
            <h2 id="shortlist-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {SHORTLIST.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-primary/80">{SHORTLIST.intro}</p>
          </div>
          <ol className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-12">
            {SHORTLIST.cards.map((c, i) => (
              <li key={c.id} id={c.id} className="card stitch-target p-7 lg:p-8">
                <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-ink">Question {i + 1}</p>
                <h3 className="mt-3 text-2xl">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-primary/80">{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Loose: the thread rolls into a ball while you read the FAQ */}
      <section data-formation="loose" aria-labelledby="faq-title" className="fm-flow faq-window">
        <div className="wrap">
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="mt-5 text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Questions we hear a lot
            </h2>
            <div className="mt-10">
              <FaqList />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact: a stitched outline, a knot, the needle parked */}
      <CtaSection />
    </>
  )
}
