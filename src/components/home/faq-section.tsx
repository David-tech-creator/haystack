import { Container } from "@/components/ui/container"
import { Faq } from "@/components/ui/faq"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FAQ, FAQ_SECTION } from "@/lib/content"

export function FaqSection() {
  return (
    <Section rule labelledBy="faq-title">
      <Container className="grid-12 items-start gap-y-10">
        <div className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-4">
          <SectionHeading index="06" eyebrow={FAQ_SECTION.eyebrow} title={FAQ_SECTION.title} titleId="faq-title" />
        </div>
        <Faq items={FAQ} className="col-span-12 lg:col-span-7 lg:col-start-6" />
      </Container>
    </Section>
  )
}
