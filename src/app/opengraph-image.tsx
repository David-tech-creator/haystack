import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Haystack · We search the whole haystack."
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage("We search the whole haystack.")
}
