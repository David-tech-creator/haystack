import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "What is a forward deployed engineer? A guide from FDE Club Switzerland, with a photo from a Romandy CTO evening"
export const size = OG_SIZE
export const contentType = "image/jpeg"

export default function Image() {
  return ogImage("What is a forward deployed engineer?", "fde")
}
