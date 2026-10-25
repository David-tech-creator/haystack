import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Haystack · Privacy notice."
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return ogImage("Privacy notice.")
}
