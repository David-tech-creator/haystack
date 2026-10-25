import { ButtonLink } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Frame } from "@/components/ui/frame"
import { Reveal } from "@/components/ui/reveal"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { INSIDE } from "@/lib/content"
import { IMG } from "@/lib/images"

/** The page's one dark band: the tools we use, and what stays human. */
export function Inside() {
  return (
    <Section tone="deep" labelledBy="inside-title">
      <Container>
        <div className="grid-12 items-center gap-y-12">
          <div className="col-span-12 lg:col-span-6">
            <SectionHeading index="04" eyebrow={INSIDE.eyebrow} title={INSIDE.title} titleId="inside-title" lead={INSIDE.body} />
          </div>
          <Reveal className="col-span-12 lg:col-span-5 lg:col-start-8">
            <Frame image={IMG["tools-still-life"]} ratio="3/2" sizes="(min-width:1280px) 480px, (min-width:1024px) 38vw, 100vw" />
          </Reveal>
        </div>

        <div className="mt-[var(--block-gap)] grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-10">
          <ul className="grid gap-6 sm:grid-cols-2">
            {INSIDE.tools.map((t, i) => (
              <Reveal as="li" key={t.name} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Card tone="deep" className="flex h-full flex-col">
                  <p className="font-display text-label font-semibold uppercase text-gold-light">{t.role}</p>
                  <h3 className="mt-3 text-h3 font-semibold">{t.name}</h3>
                  <p className="mt-3 text-on-deep-soft">{t.body}</p>
                  <div className="mt-auto pt-4">
                    <ButtonLink href={t.href} variant="ghost" external>
                      Visit {t.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </ButtonLink>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>
          <div className="grid content-start gap-8">
            {INSIDE.side.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="border-t border-deep-line pt-6">
                <h3 className="text-h3 font-semibold">
                  <span className="text-gold-light">{s.title}</span>
                </h3>
                <p className="mt-3 text-on-deep-soft">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
