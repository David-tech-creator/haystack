import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Haystack · How a Haystack sprint runs."
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage("How a Haystack sprint runs.")
}
