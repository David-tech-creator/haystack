import { CtaSection } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { CheckList } from "@/components/ui/check-list"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { StepList } from "@/components/ui/step-list"
import { Stitch } from "@/components/ui/stitch"
import { CAPTIONS, PROCESS, STEPS } from "@/lib/content"
import { IMG } from "@/lib/images"
import { pageMetadata, processJsonLd } from "@/lib/seo"

const DESCRIPTION =
  "How a Haystack recruitment sprint runs: scorecards agreed up front, work samples, weekly evidence updates and help with the offer."

export const metadata = pageMetadata({ title: "Process", description: DESCRIPTION, path: "/process" })

export default function ProcessPage() {
  return (
    <>
      <StructuredData data={processJsonLd(DESCRIPTION)} />

      {/* Hero: the thread runs from the spool into even stitches */}
      <Section spacing="tight" labelledBy="process-title">
        <Container>
          <div className="grid-12 gap-y-10 lg:items-center">
            <SectionHeading
              as="h1"
              size="display"
              eyebrow={PROCESS.eyebrow}
              title={PROCESS.title}
              titleId="process-title"
              lead={PROCESS.intro}
              className="col-span-12 lg:col-span-7"
            />
            <Frame
              image={IMG["spool-stitches"]}
              ratio="4/3"
              ratioLg="1/1"
              priority
              sizes="(min-width:1280px) 480px, (min-width:1024px) 38vw, 100vw"
              caption={CAPTIONS.spool}
              label="Fig. 01"
              className="enter enter-3 col-span-12 lg:col-span-5 lg:col-start-8"
            />
          </div>
          <Stitch className="mt-16 lg:mt-24" />
        </Container>
      </Section>

      {/* Steps */}
      <Section spacing="flush-top" labelledBy="steps-title">
        <Container>
          <SectionHeading title={PROCESS.stepsTitle} titleId="steps-title" />
          <StepList steps={STEPS} variant="grid" className="mt-[var(--block-gap)]" />
        </Container>
      </Section>

      {/* Details: read without clicking */}
      <Section rule labelledBy="details-title">
        <Container className="grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <SectionHeading title={PROCESS.detailsTitle} titleId="details-title" />
            </div>
          </div>
          <dl className="col-span-12 lg:col-span-7 lg:col-start-6">
            {PROCESS.details.map((d) => (
              <Reveal
                key={d.title}
                className="grid gap-2 border-t border-line py-6 last:border-b sm:grid-cols-[1fr_2fr] sm:gap-8 lg:py-8"
              >
                <dt className="font-display text-h3 font-semibold">{d.title}</dt>
                <dd className="max-w-prose-tight text-ink-soft">{d.body}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Includes: the one dark band on this page */}
      <Section tone="deep" labelledBy="includes-title">
        <Container className="grid-12 gap-y-10">
          <SectionHeading
            title={PROCESS.includesTitle}
            titleId="includes-title"
            className="col-span-12 lg:col-span-5"
          />
          <CheckList
            items={PROCESS.includes}
            marker="needle"
            className="col-span-12 space-y-5 text-lead lg:col-span-6 lg:col-start-7 lg:pt-2"
          />
        </Container>
      </Section>

      <CtaSection eyebrow="Next step" title={PROCESS.cta} secondary={{ label: "About Haystack", href: "/about" }} />
    </>
  )
}
