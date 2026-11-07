import Link from "next/link"
import { EmployersTable } from "@/components/fde/employers-table"
import { LatestFieldNotes } from "@/components/field-notes/latest-notes"
import { JoinForm } from "@/components/fde/join-form"
import { StructuredData } from "@/components/structured-data"
import { ButtonLink } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckList } from "@/components/ui/check-list"
import { Container } from "@/components/ui/container"
import { Faq } from "@/components/ui/faq"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FDE_CLUB_FAQ, FDE_DEFINITION, FDE_HUB } from "@/lib/content"
import { IMG } from "@/lib/images"
import { fdeHubJsonLd, pageMetadata } from "@/lib/seo"
import { FDE_GUIDE_PATH, FDE_PATH, FDE_UPDATED, formatDate } from "@/lib/site"

const DESCRIPTION =
  "Switzerland's first club for forward deployed engineers: meetups, a newsletter, where FDEs are hired, and how to hire one. Started by Haystack in Geneva."

export const metadata = pageMetadata({
  absoluteTitle: "Forward deployed engineers in Switzerland · FDE Club",
  description: DESCRIPTION,
  path: FDE_PATH,
  keywords: [
    "FDE Club Switzerland",
    "forward deployed engineer Switzerland",
    "FDE Switzerland",
    "forward deployed engineers community Switzerland",
    "FDE Zurich",
    "FDE Geneva",
    "FDE Lausanne",
    "FDE meetup Switzerland",
    "FDE jobs Switzerland",
    "hire a forward deployed engineer",
  ],
})

const HERO_IMG = IMG["speaker-quantum-slide-long-tables"]
const n = (i: number) => String(i + 1).padStart(2, "0")

export default function FdeHubPage() {
  const h = FDE_HUB

  return (
    <>
      <StructuredData data={fdeHubJsonLd(DESCRIPTION, HERO_IMG)} />

      {/* Hero: the name, the one-line descriptor, two ways in, then a wide photo */}
      <Section spacing="tight" labelledBy="fde-title">
        <Container>
          <div className="grid-12 gap-y-6">
            <div className="col-span-12 lg:col-span-8">
              <SectionHeading
                as="h1"
                size="display-xl"
                eyebrow={h.eyebrow}
                title={
                  <>
                    <span className="accent-serif block">{h.accent}</span> {h.title}
                  </>
                }
                titleId="fde-title"
              />
              <p className="enter enter-1 mt-6 max-w-[38rem] text-lead text-ink-soft">{h.lead}</p>
              <div className="enter enter-2 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={h.primary.href} arrow className="w-full sm:w-auto">
                  {h.primary.label}
                </ButtonLink>
                <ButtonLink href={h.secondary.href} variant="secondary" className="w-full sm:w-auto">
                  {h.secondary.label}
                </ButtonLink>
              </div>
            </div>
          </div>
          <Frame
            image={HERO_IMG}
            ratio="16/9"
            ratioLg="21/9"
            priority
            sizes="(min-width:1280px) 1200px, 100vw"
            caption={h.photoCaption}
            label="Fig. 01"
            className="mt-12 lg:mt-16"
          />
        </Container>
      </Section>

      {/* What the club is */}
      <Section spacing="flush-top" labelledBy="club-title">
        <Container className="grid-12 items-start gap-y-12">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeading eyebrow={h.what.eyebrow} title={h.what.title} titleId="club-title" lead={h.what.body} />
            <h3 className="mt-10 font-display text-h3 font-semibold">What members get</h3>
            <CheckList items={h.what.offers} className="mt-5 max-w-prose-tight" />
          </div>
          <Reveal className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-8">
            <Frame
              image={IMG["engineer-presenting-ai-drug-discovery"]}
              ratio="4/5"
              sizes="(min-width:1024px) 34vw, (min-width:640px) 66vw, 100vw"
              caption={h.photoCaption}
            />
          </Reveal>
          <ul className="col-span-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {h.what.topics.map((t, i) => (
              <Reveal as="li" key={t.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="h-full">
                <Card padding="md" className="h-full">
                  <span className="step-n" aria-hidden="true">
                    {n(i)}
                  </span>
                  <h3 className="mt-4 text-h3 font-semibold">{t.title}</h3>
                  <p className="mt-2 text-ink-soft">{t.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The definition, word for word the same as the guide and the JSON-LD */}
      <Section tone="deep" labelledBy="definition-title">
        <Container className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <SectionHeading eyebrow={h.definition.eyebrow} title={h.definition.title} titleId="definition-title" />
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <p className="text-lead text-on-deep">{FDE_DEFINITION}</p>
            <p className="mt-8">
              <ButtonLink href={FDE_GUIDE_PATH} variant="ghost" arrow>
                {h.definition.link}
              </ButtonLink>
            </p>
          </div>
        </Container>
      </Section>

      {/* Why Switzerland: sourced points only (see the guide's sources) */}
      <Section labelledBy="why-title">
        <Container>
          <SectionHeading eyebrow={h.why.eyebrow} title={h.why.title} titleId="why-title" lead={h.why.body} />
          <ul className="mt-[var(--block-gap)] grid gap-10 md:grid-cols-3 md:gap-8">
            {h.why.points.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i as 0 | 1 | 2} className="border-t border-line pt-5">
                <h3 className="text-h3 font-semibold">{p.title}</h3>
                <p className="mt-2 max-w-prose-tight text-ink-soft">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* First meetup: no date or venue until they are confirmed */}
      <Section tone="linen" rule labelledBy="meetup-title">
        <Container className="grid-12 items-center gap-y-10">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeading eyebrow={h.meetup.eyebrow} title={h.meetup.title} titleId="meetup-title" lead={h.meetup.body} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="#join" arrow className="w-full sm:w-auto">
                {h.primary.label}
              </ButtonLink>
              <ButtonLink href="#speak" variant="secondary" className="w-full sm:w-auto">
                {h.meetup.speak}
              </ButtonLink>
            </div>
          </div>
          <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Frame
              image={IMG["presenter-explaining-ai-models-slide"]}
              ratio="4/3"
              sizes="(min-width:1280px) 480px, (min-width:1024px) 38vw, 100vw"
              caption={h.photoCaption}
            />
          </Reveal>
        </Container>
      </Section>

      {/* Where FDEs are hired in Switzerland */}
      <Section id="hiring" labelledBy="hiring-title" className="scroll-mt-20">
        <Container>
          <SectionHeading eyebrow={h.hiring.eyebrow} title={h.hiring.title} titleId="hiring-title">
            <p className="mt-5 max-w-[38rem] text-lead text-ink-soft">
              As of <time dateTime={FDE_UPDATED}>{formatDate(FDE_UPDATED)}</time>. {h.hiring.intro}
            </p>
          </SectionHeading>
          <div className="mt-10">
            <EmployersTable />
          </div>
          <p className="mt-5 max-w-[42rem] text-small text-ink-mute">{h.hiring.note}</p>
        </Container>
      </Section>

      {/* Library: the guide plus outside reading; no invented repos */}
      <Section spacing="flush-top" labelledBy="library-title">
        <Container>
          <SectionHeading eyebrow={h.resources.eyebrow} title={h.resources.title} titleId="library-title" lead={h.resources.body} />
          <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {h.resources.items.map((r) => (
              <li key={r.href}>
                <Card padding="md" className="flex h-full flex-col">
                  <h3 className="text-h3 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-ink-soft">{r.body}</p>
                  <div className="mt-auto pt-5">
                    {r.external ? (
                      <ButtonLink href={r.href} variant="ghost" external>
                        Read it<span className="sr-only">: {r.title} (opens in a new tab)</span>
                      </ButtonLink>
                    ) : (
                      <ButtonLink href={r.href} variant="ghost" arrow>
                        Read the guide
                      </ButtonLink>
                    )}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Latest field notes: up to three posts, not rendered while there are none */}
      <LatestFieldNotes />

      {/* Speak */}
      <Section id="speak" tone="linen" rule labelledBy="speak-title" className="scroll-mt-20">
        <Container className="grid-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow={h.speak.eyebrow} title={h.speak.title} titleId="speak-title" lead={h.speak.body} />
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <ButtonLink href={h.speak.href} arrow className="w-full sm:w-auto">
              {h.speak.cta}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* Hire an FDE: the commercial path, to the contact form with the role prefilled */}
      <Section id="hire" tone="deep" labelledBy="hire-title" className="scroll-mt-20">
        <Container className="grid-12 items-center gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <SectionHeading eyebrow={h.hire.eyebrow} title={h.hire.title} titleId="hire-title" lead={h.hire.body} />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={h.hire.href} arrow className="w-full sm:w-auto">
                {h.hire.cta}
              </ButtonLink>
              <ButtonLink href="/process" variant="secondary" className="w-full sm:w-auto">
                How a search works
              </ButtonLink>
            </div>
          </div>
          <Reveal className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Frame
              image={IMG["classical-vs-quantum-computing-talk"]}
              ratio="1/1"
              sizes="(min-width:1024px) 30vw, 100vw"
              className="hidden lg:block"
            />
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section rule labelledBy="fde-faq-title">
        <Container className="grid-12 items-start gap-y-10">
          <div className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4">
            <SectionHeading eyebrow="FAQ" title={h.faqTitle} titleId="fde-faq-title" />
          </div>
          <Faq items={FDE_CLUB_FAQ} className="col-span-12 lg:col-span-7 lg:col-start-6" />
        </Container>
      </Section>

      {/* Join */}
      <Section id="join" tone="linen" rule labelledBy="join-title" className="scroll-mt-20">
        <Container className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading eyebrow={h.join.eyebrow} title={h.join.title} titleId="join-title" lead={h.join.body} />
            <p className="mt-6 max-w-prose-tight text-small text-ink-mute">
              Hiring rather than joining?{" "}
              <Link href={h.hire.href} className="link">
                Tell us about the role
              </Link>
              .
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Card padding="lg" className="shadow-raise">
              <JoinForm />
            </Card>
          </div>
        </Container>
      </Section>
    </>
  )
}
