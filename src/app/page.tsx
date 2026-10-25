import { FaqSection } from "@/components/home/faq-section"
import { HomeHero } from "@/components/home/hero"
import { Inside } from "@/components/home/inside"
import { LookFor } from "@/components/home/look-for"
import { Shortlist } from "@/components/home/shortlist"
import { Sprint } from "@/components/home/sprint"
import { WhatWeDo } from "@/components/home/what-we-do"
import { CtaSection } from "@/components/sections"
import { StructuredData } from "@/components/structured-data"
import { homeJsonLd, pageMetadata } from "@/lib/seo"
import { SITE } from "@/lib/site"

export const metadata = pageMetadata({ absoluteTitle: SITE.title, description: SITE.description, path: "/" })

export default function HomePage() {
  return (
    <>
      <StructuredData data={homeJsonLd()} />
      <HomeHero />
      <WhatWeDo />
      <Sprint />
      <LookFor />
      <Inside />
      <Shortlist />
      <FaqSection />
      <CtaSection />
    </>
  )
}
