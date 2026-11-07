import Link from "next/link"
import { FIELD_NOTES } from "@/lib/content"
import { fieldNotePath, type FieldNote } from "@/lib/field-notes"
import { formatDate } from "@/lib/site"
import { cn } from "@/lib/utils"

/** The meta line under a title: date and reading time. */
export function NoteMeta({ note, className }: { note: FieldNote; className?: string }) {
  return (
    <p className={cn("text-small text-ink-mute", className)}>
      <time dateTime={note.date}>{formatDate(note.date)}</time>
      <span aria-hidden="true"> · </span>
      {note.minutes} min read
    </p>
  )
}

/**
 * Posts as rows: date on the left, title and summary on the right. The whole
 * title is the link; no thumbnails, since a figure can be a diagram that does
 * not crop well.
 */
export function NoteList({ notes, headingLevel = "h2" }: { notes: FieldNote[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel
  return (
    <ol className="border-b border-line">
      {notes.map((n) => (
        <li key={n.slug} className="grid-12 gap-y-3 border-t border-line py-8 lg:py-10">
          <NoteMeta note={n} className="col-span-12 lg:col-span-3" />
          <article className="col-span-12 lg:col-span-8 lg:col-start-5">
            <H className="text-h3 font-semibold">
              <Link href={fieldNotePath(n.slug)} className="hover:underline hover:decoration-ink/40 hover:underline-offset-[0.22em]">
                {n.title}
              </Link>
            </H>
            {n.summary ? <p className="mt-3 max-w-prose-tight text-ink-soft">{n.summary}</p> : null}
          </article>
        </li>
      ))}
    </ol>
  )
}

/** Up to three posts as cards, for the FDE hub and the "more" strip under a post. */
export function NoteCards({ notes, className }: { notes: FieldNote[]; className?: string }) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-3 md:gap-6", className)}>
      {notes.map((n) => (
        <li key={n.slug}>
          <Link
            href={fieldNotePath(n.slug)}
            className="card card-raised group flex h-full flex-col p-6 hover:border-line-strong"
          >
            <NoteMeta note={n} />
            <h3 className="mt-3 text-h3 font-semibold group-hover:underline group-hover:decoration-ink/40 group-hover:underline-offset-[0.22em]">
              {n.title}
            </h3>
            {n.summary ? <p className="mt-2 line-clamp-4 text-ink-soft">{n.summary}</p> : null}
            <span className="mt-auto pt-5 text-small font-semibold text-ink">
              {FIELD_NOTES.read}
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
