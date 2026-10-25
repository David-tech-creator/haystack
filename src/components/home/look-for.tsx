import { CheckList } from "@/components/ui/check-list"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { CAPTIONS, LOOK_FOR } from "@/lib/content"
import { IMG } from "@/lib/images"

export function LookFor() {
  return (
    <Section labelledBy="look-title">
      <Container className="grid-12 items-center gap-y-12">
        <Reveal className="order-2 col-span-12 lg:order-1 lg:col-span-6">
          <Frame
            image={IMG["needle-eye"]}
            ratio="1/1"
            sizes="(min-width:1280px) 570px, (min-width:1024px) 44vw, 100vw"
            caption={CAPTIONS.eye}
            label="Fig. 04"
          />
        </Reveal>
        <div className="order-1 col-span-12 lg:order-2 lg:col-span-5 lg:col-start-8">
          <SectionHeading index="03" eyebrow={LOOK_FOR.eyebrow} title={LOOK_FOR.title} titleId="look-title" lead={LOOK_FOR.body} />
          <CheckList items={LOOK_FOR.list} marker="needle" className="mt-8 max-w-prose-tight" />
        </div>
      </Container>
    </Section>
  )
}
