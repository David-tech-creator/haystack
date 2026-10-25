import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { StepList } from "@/components/ui/step-list"
import { CAPTIONS, SPRINT, STEPS } from "@/lib/content"
import { IMG } from "@/lib/images"

export function Sprint() {
  return (
    <Section tone="linen" labelledBy="sprint-title">
      <Container className="grid-12 items-start gap-y-12">
        <div className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4">
          <SectionHeading index="02" eyebrow={SPRINT.eyebrow} title={SPRINT.title} titleId="sprint-title" lead={SPRINT.intro} />
          <Frame
            image={IMG["thread-stitch"]}
            ratio="4/3"
            ratioLg="4/5"
            position="85% 50%"
            sizes="(min-width:1280px) 380px, (min-width:1024px) 30vw, 100vw"
            caption={CAPTIONS.stitch}
            label="Fig. 03"
            className="mt-10"
          />
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <StepList steps={STEPS} variant="rail" />
        </div>
      </Container>
    </Section>
  )
}
