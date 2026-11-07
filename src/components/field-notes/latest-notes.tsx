import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FIELD_NOTES } from "@/lib/content"
import { getFieldNotes } from "@/lib/field-notes"
import { FIELD_NOTES_PATH } from "@/lib/site"
import { NoteCards } from "./note-list"

/** "Latest field notes" on the FDE hub: up to three posts, and nothing at all while there are none. */
export function LatestFieldNotes() {
  const notes = getFieldNotes().slice(0, 3)
  if (!notes.length) return null
  return (
    <Section spacing="flush-top" labelledBy="field-notes-title">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={FIELD_NOTES.hub.eyebrow} title={FIELD_NOTES.hub.title} titleId="field-notes-title" lead={FIELD_NOTES.lead} />
          <ButtonLink href={FIELD_NOTES_PATH} variant="ghost" arrow className="self-start sm:self-auto">
            {FIELD_NOTES.all}
          </ButtonLink>
        </div>
        <NoteCards notes={notes} className="mt-10" />
      </Container>
    </Section>
  )
}
