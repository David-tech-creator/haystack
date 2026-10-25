import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CTA } from "@/lib/content"
import { IMG, type ImageEntry } from "@/lib/images"

/** Closing call to action on every page: linen band, one question, two ways forward. */
export function CtaSection({
  eyebrow = CTA.eyebrow,
  title = CTA.title,
  body,
  secondary = CTA.secondary,
  image = IMG["thread-knot"],
}: {
  eyebrow?: string
  title?: string
  body?: string
  secondary?: { label: string; href: string } | null
  image?: ImageEntry | null
}) {
  return (
    <Section tone="linen" rule labelledBy="cta-title">
      <Container className="grid-12 items-center gap-y-10">
        <div className={image ? "col-span-12 md:col-span-7" : "col-span-12 lg:col-span-8"}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="cta-title" className="mt-4 max-w-[20ch] text-h2 font-medium">
            {title}
          </h2>
          {body ? <p className="mt-5 max-w-[34rem] text-lead text-ink-soft">{body}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={CTA.primary.href} arrow className="w-full sm:w-auto">
              {CTA.primary.label}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="secondary" className="w-full sm:w-auto">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        {image ? (
          <Frame
            image={image}
            ratio="1/1"
            sizes="(min-width:1024px) 28vw, 34vw"
            className="hidden md:col-span-4 md:col-start-9 md:block"
          />
        ) : null}
      </Container>
    </Section>
  )
}
