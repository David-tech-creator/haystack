import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { NOT_FOUND } from "@/lib/content"
import { IMG } from "@/lib/images"

export default function NotFound() {
  return (
    <Section spacing="tight" labelledBy="nf-title" className="flex min-h-[70svh] items-center">
      <Container className="grid-12 w-full items-center gap-y-12">
        <div className="col-span-12 lg:col-span-6">
          <Eyebrow>{NOT_FOUND.eyebrow}</Eyebrow>
          <h1 id="nf-title" className="mt-4 text-display font-medium">
            {NOT_FOUND.title}
          </h1>
          <p className="mt-5 max-w-[34rem] text-lead text-ink-soft">{NOT_FOUND.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={NOT_FOUND.primary.href} arrow className="w-full sm:w-auto">
              {NOT_FOUND.primary.label}
            </ButtonLink>
            <ButtonLink href={NOT_FOUND.secondary.href} variant="secondary" className="w-full sm:w-auto">
              {NOT_FOUND.secondary.label}
            </ButtonLink>
          </div>
        </div>
        <Frame
          image={IMG["single-straw"]}
          ratio="1/1"
          priority
          sizes="(min-width:1280px) 420px, (min-width:1024px) 34vw, 100vw"
          className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-8"
        />
      </Container>
    </Section>
  )
}
