import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Haystack · Why Haystack exists."
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage("Why Haystack exists.")
}
