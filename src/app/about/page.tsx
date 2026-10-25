import { CtaSection } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { Card } from "@/components/ui/card"
import { CheckList } from "@/components/ui/check-list"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { ABOUT, CAPTIONS, LOOK_FOR } from "@/lib/content"
import { IMG } from "@/lib/images"
import { aboutJsonLd, pageMetadata } from "@/lib/seo"

const DESCRIPTION =
  "Haystack is a small recruitment agency in Geneva with Swiss engineering roots and a simple rule: evidence over volume."

export const metadata = pageMetadata({ title: "About", description: DESCRIPTION, path: "/about" })

const n = (i: number) => String(i + 1).padStart(2, "0")

export default function AboutPage() {
  return (
    <>
      <StructuredData data={aboutJsonLd(DESCRIPTION)} />

      {/* Hero: text first, then the wide Geneva still life */}
      <Section spacing="tight" labelledBy="about-title">
        <Container>
          <div className="grid-12 gap-y-6">
            <SectionHeading
              as="h1"
              size="display"
              eyebrow={ABOUT.eyebrow}
              title={ABOUT.title}
              titleId="about-title"
              lead={ABOUT.intro}
              className="col-span-12 lg:col-span-7"
            >
              <p className="enter enter-1 mt-5 max-w-prose-tight text-ink-soft">{ABOUT.story}</p>
            </SectionHeading>
          </div>
          <Frame
            image={IMG["geneva-light"]}
            ratio="16/9"
            ratioLg="21/9"
            priority
            sizes="(min-width:1280px) 1200px, 100vw"
            caption={CAPTIONS.light}
            label="Fig. 01"
            className="mt-12 lg:mt-16"
          />
        </Container>
      </Section>

      {/* Foundations: three text blocks under hairlines */}
      <Section spacing="flush-top" labelledBy="foundations-title">
        <Container>
          <SectionHeading title={ABOUT.foundationsTitle} titleId="foundations-title" />
          <ul className="mt-[var(--block-gap)] grid gap-10 md:grid-cols-3 md:gap-8">
            {ABOUT.foundations.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i as 0 | 1 | 2} className="border-t border-line pt-5">
                <span className="step-n" aria-hidden="true">
                  {n(i)}
                </span>
                <h3 className="mt-4 text-h3">{f.title}</h3>
                <p className="mt-2 max-w-prose-tight text-ink-soft">{f.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Evaluate: the sorted straw grid beside how we read a profile */}
      <Section tone="linen" labelledBy="evaluate-title">
        <Container className="grid-12 items-center gap-y-12">
          <Reveal className="order-2 col-span-12 sm:col-span-8 sm:col-start-3 lg:order-1 lg:col-span-5 lg:col-start-1">
            <Frame
              image={IMG["straw-grid"]}
              ratio="4/5"
              sizes="(min-width:1024px) 34vw, (min-width:640px) 66vw, 100vw"
            />
          </Reveal>
          <div className="order-1 col-span-12 lg:order-2 lg:col-span-6 lg:col-start-7">
            <SectionHeading title={ABOUT.evaluate.title} titleId="evaluate-title" lead={ABOUT.evaluate.body} />
            <CheckList items={LOOK_FOR.list} marker="needle" className="mt-8 max-w-prose-tight" />
            <p className="mt-8 max-w-prose-tight border-t border-line-strong pt-6 text-ink-soft">
              {ABOUT.evaluate.closing}
            </p>
          </div>
        </Container>
      </Section>

      {/* Principles: the one dark band on this page */}
      <Section tone="deep" labelledBy="principles-title">
        <Container>
          <SectionHeading title={ABOUT.principlesTitle} titleId="principles-title" />
          <ul className="mt-[var(--block-gap)] grid gap-5 md:grid-cols-3 md:gap-6">
            {ABOUT.principles.map((p, i) => (
              <Card as="li" tone="deep" padding="lg" key={p.title} className="h-full">
                <span className="step-n" aria-hidden="true">
                  {n(i)}
                </span>
                <h3 className="mt-5 text-h3">{p.title}</h3>
                <p className="mt-3 text-on-deep-soft">{p.body}</p>
              </Card>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaSection />
    </>
  )
}
