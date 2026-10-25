import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Haystack · Ready to find the needle?"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage("Ready to find the needle?")
}
