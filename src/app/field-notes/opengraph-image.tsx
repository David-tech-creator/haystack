import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "Field notes by David Vinkenroye, Haystack"
export const size = OG_SIZE
export const contentType = "image/jpeg"

export default function Image() {
  return ogImage("Field notes.", "fde")
}
