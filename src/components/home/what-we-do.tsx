import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { CAPTIONS, WHAT_WE_DO } from "@/lib/content"
import { IMG } from "@/lib/images"

export function WhatWeDo() {
  return (
    <Section labelledBy="what-title">
      <Container className="grid-12 items-center gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <SectionHeading index="01" eyebrow={WHAT_WE_DO.eyebrow} title={WHAT_WE_DO.title} titleId="what-title">
            <p className="mt-5 max-w-prose-tight text-ink-soft">{WHAT_WE_DO.body}</p>
          </SectionHeading>
          <Card stitch padding="md" className="mt-8 max-w-prose-tight">
            <h3 className="text-h3 font-semibold">{WHAT_WE_DO.card.title}</h3>
            <p className="mt-2 text-ink-soft">{WHAT_WE_DO.card.body}</p>
          </Card>
        </div>
        <Reveal className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Frame
            image={IMG["straw-sorted"]}
            ratio="3/2"
            sizes="(min-width:1280px) 580px, (min-width:1024px) 46vw, 100vw"
            caption={CAPTIONS.sorted}
            label="Fig. 02"
          />
        </Reveal>
      </Container>
    </Section>
  )
}
