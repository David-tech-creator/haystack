import Link from "next/link"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { CAPTIONS, HOME_FDE } from "@/lib/content"
import { IMG } from "@/lib/images"
import { FDE_PATH } from "@/lib/site"

/** Home band pointing to FDE Club Switzerland: photo, one line, one link. */
export function FdeHomeTeaser() {
  return (
    <Section tone="linen" rule labelledBy="fde-teaser-title">
      <Container className="grid-12 items-center gap-y-10">
        <Reveal className="order-2 col-span-12 lg:order-1 lg:col-span-5">
          <Link href={FDE_PATH} tabIndex={-1} aria-hidden="true" className="block">
            <Frame
              image={IMG["packed-salon-tech-leaders-discussion"]}
              ratio="4/3"
              sizes="(min-width:1280px) 480px, (min-width:1024px) 38vw, 100vw"
              caption={CAPTIONS.event}
            />
          </Link>
        </Reveal>
        <div className="order-1 col-span-12 lg:order-2 lg:col-span-6 lg:col-start-7">
          <SectionHeading eyebrow={HOME_FDE.eyebrow} title={HOME_FDE.title} titleId="fde-teaser-title" lead={HOME_FDE.body} />
          <div className="mt-8">
            <ButtonLink href={FDE_PATH} arrow className="w-full sm:w-auto">
              {HOME_FDE.link}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}
