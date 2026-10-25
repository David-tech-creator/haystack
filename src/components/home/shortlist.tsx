import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { CAPTIONS, SHORTLIST } from "@/lib/content"
import { IMG } from "@/lib/images"

export function Shortlist() {
  return (
    <Section labelledBy="shortlist-title">
      <Container>
        <Reveal>
          <Frame
            image={IMG["shortlist-notes"]}
            ratio="16/9"
            ratioLg="21/9"
            position="50% 47%"
            sizes="(min-width:1280px) 1200px, 100vw"
            caption={CAPTIONS.notes}
            label="Fig. 05"
          />
        </Reveal>
        <SectionHeading
          index="05"
          eyebrow={SHORTLIST.eyebrow}
          title={SHORTLIST.title}
          titleId="shortlist-title"
          lead={SHORTLIST.intro}
          className="mt-12 lg:mt-16"
        />
        <ol className="mt-[var(--block-gap)] grid gap-6 lg:grid-cols-3">
          {SHORTLIST.cards.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <Card stitch padding="lg" id={c.id} className="h-full">
                <p className="font-display text-label font-semibold uppercase text-gold-ink">Question {i + 1}</p>
                <h3 className="mt-4 text-h3 font-semibold">{c.title}</h3>
                <p className="mt-3 text-ink-soft">{c.body}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
