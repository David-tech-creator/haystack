import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "FDE Club Switzerland, with a photo from a Romandy CTO evening"
export const size = OG_SIZE
export const contentType = "image/jpeg"

export default function Image() {
  return ogImage("FDE Club Switzerland.", "fde")
}
