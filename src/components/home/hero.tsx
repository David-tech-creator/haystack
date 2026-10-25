import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { Stitch } from "@/components/ui/stitch"
import { HERO } from "@/lib/content"
import { IMG } from "@/lib/images"

/**
 * Home hero. The h1 and the hero image are the LCP candidates, so neither is
 * animated (an opacity-0 start would delay LCP); the lead and CTAs settle in
 * once with the CSS-only `.enter` stagger.
 */
export function HomeHero() {
  return (
    <Section spacing="tight" labelledBy="hero-title">
      <Container>
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
            <h1 id="hero-title" className="mt-5 text-display-xl font-medium">
              <span className="accent-serif block">{HERO.accent}</span> {HERO.title}
            </h1>
            <p className="enter enter-1 mt-6 max-w-[34rem] text-lead text-ink-soft">{HERO.sub}</p>
            <div className="enter enter-2 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={HERO.primary.href} arrow className="w-full sm:w-auto">
                {HERO.primary.label}
              </ButtonLink>
              <ButtonLink href={HERO.secondary.href} variant="secondary" className="w-full sm:w-auto">
                {HERO.secondary.label}
              </ButtonLink>
            </div>
          </div>
          <Frame
            image={IMG["hero-needle"]}
            ratio="4/3"
            ratioLg="4/5"
            priority
            position="55% 50%"
            sizes="(min-width:1280px) 480px, (min-width:1024px) 38vw, 100vw"
            caption={HERO.caption}
            label="Fig. 01"
            className="col-span-12 lg:col-span-5 lg:col-start-8"
          />
        </div>
        <Stitch className="mt-16 lg:mt-24" />
      </Container>
    </Section>
  )
}
