import { NoteList } from "@/components/field-notes/note-list"
import { StructuredData } from "@/components/structured-data"
import { ButtonLink } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { SectionHeading } from "@/components/ui/section-heading"
import { FIELD_NOTES } from "@/lib/content"
import { getFieldNotes, latestFieldNoteDate } from "@/lib/field-notes"
import { FIELD_NOTES_FEED_LINK, fieldNotesJsonLd, pageMetadata } from "@/lib/seo"
import { CONTENT_UPDATED, FDE_PATH, FIELD_NOTES_FEED, FIELD_NOTES_PATH } from "@/lib/site"

export const metadata = pageMetadata({
  title: FIELD_NOTES.title,
  description: FIELD_NOTES.description,
  path: FIELD_NOTES_PATH,
  feed: FIELD_NOTES_FEED_LINK,
  keywords: [
    "forward deployed engineer blog",
    "forward deployed engineering Switzerland",
    "tech hiring Switzerland",
    "David Vinkenroye",
    "Field notes Haystack",
  ],
})

function RssIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
      <circle cx="3" cy="13" r="1.6" />
      <path d="M1.5 6.5a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6zM1.5 1.5a13 13 0 0 1 13 13h-2a11 11 0 0 0-11-11z" />
    </svg>
  )
}

export default function FieldNotesPage() {
  const notes = getFieldNotes()
  const f = FIELD_NOTES

  return (
    <>
      <StructuredData data={fieldNotesJsonLd(notes, latestFieldNoteDate() ?? CONTENT_UPDATED)} />

      <Section spacing="tight" labelledBy="field-notes-title">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading as="h1" size="display-xl" eyebrow={f.eyebrow} title={f.title} titleId="field-notes-title" lead={f.lead} />
            <a href={FIELD_NOTES_FEED} className="link inline-flex min-h-11 items-center gap-2 self-start text-small text-ink-soft lg:self-auto">
              <RssIcon />
              {f.rss}
            </a>
          </div>

          {notes.length ? (
            <div className="mt-12 lg:mt-16">
              <NoteList notes={notes} />
            </div>
          ) : (
            <Card padding="lg" stitch className="mt-12 lg:mt-16">
              <div className="grid-12 items-end gap-y-8">
                <div className="col-span-12 lg:col-span-7">
                  <h2 className="text-h3 font-semibold">{f.empty.title}</h2>
                  <p className="mt-3 max-w-prose-tight text-ink-soft">{f.empty.body}</p>
                </div>
                <div className="col-span-12 flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
                  <ButtonLink href={`${FDE_PATH}#join`} arrow className="w-full sm:w-auto">
                    {f.empty.join}
                  </ButtonLink>
                  <a href={FIELD_NOTES_FEED} className="btn btn-secondary w-full sm:w-auto">
                    {f.rss}
                  </a>
                </div>
              </div>
            </Card>
          )}
        </Container>
      </Section>
    </>
  )
}
