import { getFieldNote, getFieldNotes } from "@/lib/field-notes"
import { OG_SIZE, ogImage } from "@/lib/og"

export const alt = "A Field notes post by David Vinkenroye, Haystack"
export const size = OG_SIZE
export const contentType = "image/jpeg"
export const dynamicParams = false

export function generateStaticParams() {
  return getFieldNotes().map((p) => ({ slug: p.slug }))
}

const clip = (t: string, max = 120) => (t.length > max ? `${t.slice(0, max - 3).replace(/\s+\S*$/, "")}...` : t)

export default function Image({ params }: { params: { slug: string } }) {
  const note = getFieldNote(params.slug)
  return ogImage(clip(note?.title ?? "Field notes."), "fde")
}
