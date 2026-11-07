import type { Metadata } from "next"
import { HomeHero } from "@/components/home/hero"
import { LookFor } from "@/components/home/look-for"
import { StepsScroll } from "@/components/scroll/steps"

/** Private preview: the "steps" scroll animation in a slice of the home page. Not in the sitemap or nav. */
export const metadata: Metadata = {
  title: "Lab: steps",
  robots: { index: false, follow: false },
}

export default function StepsLabPage() {
  return (
    <>
      <HomeHero />
      <StepsScroll />
      <LookFor />
    </>
  )
}
