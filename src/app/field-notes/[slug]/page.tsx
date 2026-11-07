import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EndBox } from "@/components/field-notes/end-box"
import { NoteCards } from "@/components/field-notes/note-list"
import { StructuredData } from "@/components/structured-data"
import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Section } from "@/components/ui/section"
import { FIELD_NOTES } from "@/lib/content"
import { fieldNotePath, figureSize, getFieldNote, getFieldNotes, type FieldNote } from "@/lib/field-notes"
import { FIELD_NOTES_FEED_LINK, fieldNoteJsonLd, pageMetadata } from "@/lib/seo"
import { AUTHOR, FIELD_NOTES_PATH, SITE, formatDate } from "@/lib/site"

export const dynamicParams = false

export function generateStaticParams() {
  return getFieldNotes().map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getFieldNote(params.slug)
  if (!p) return {}
  return pageMetadata({
    title: p.title,
    description: p.summary || `${p.title}. ${FIELD_NOTES.name} by ${AUTHOR.name}, ${SITE.name}.`,
    path: fieldNotePath(p.slug),
    feed: FIELD_NOTES_FEED_LINK,
    keywords: [FIELD_NOTES.name, AUTHOR.name],
    article: { publishedTime: p.date, modifiedTime: p.updated, authors: [AUTHOR.url] },
  })
}

/**
 * Typography for the post body, tuned to the brand: navy headings in the
 * display face, ink-soft text, gold bullets and quote rule, cream inline code
 * and a deep navy code block (colours in tailwind.config.js).
 */
const PROSE =
  "prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:text-ink prose-h2:mt-14 prose-h2:border-t prose-h2:border-line prose-h2:pt-8 prose-h2:text-h2 prose-h2:font-medium prose-h3:text-h3 prose-h3:font-semibold prose-p:text-ink-soft prose-li:text-ink-soft prose-strong:text-ink prose-a:text-ink prose-blockquote:font-serif prose-blockquote:text-[1.375rem] prose-blockquote:font-normal prose-blockquote:leading-snug prose-img:rounded-md prose-img:border prose-img:border-line prose-pre:rounded-md prose-pre:text-[0.875rem] prose-pre:leading-relaxed"

function Figure({ note, size }: { note: FieldNote; size: { width: number; height: number } | null }) {
  const fig = note.figure!
  const svg = /\.svg(?:[?#]|$)/i.test(fig.src)
  const c = fig.credit
  return (
    <figure className="mt-10">
      <div className={svg ? "overflow-hidden rounded-md border border-line bg-raised" : "frame"}>
        {size ? (
          <Image
            src={fig.src}
            alt={fig.alt}
            width={size.width}
            height={size.height}
            priority
            unoptimized={svg}
            sizes="(min-width:768px) 736px, 100vw"
            className="h-auto w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fig.src} alt={fig.alt} className="h-auto w-full" />
        )}
      </div>
      {c ? (
        <figcaption className="mt-3 text-small text-ink-mute">
          Image:{" "}
          {c.url ? (
            <a href={c.url} target="_blank" rel="noopener noreferrer" className="link">
              {c.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            c.label
          )}
        </figcaption>
      ) : null}
    </figure>
  )
}

export default async function FieldNotePage({ params }: { params: { slug: string } }) {
  const p = getFieldNote(params.slug)
  if (!p) notFound()
  const size = p.figure ? await figureSize(p.figure.src) : null
  const more = getFieldNotes()
    .filter((n) => n.slug !== p.slug)
    .slice(0, 3)
  const f = FIELD_NOTES

  return (
    <>
      <StructuredData data={fieldNoteJsonLd(p, size)} />

      <Section spacing="tight" labelledBy="note-title">
        <Container>
          <article className="mx-auto max-w-[46rem]">
            <nav aria-label="Breadcrumb" className="text-small text-ink-mute">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/" className="link">
                    Home
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li>
                  <Link href={FIELD_NOTES_PATH} className="link">
                    {f.name}
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li aria-current="page" className="max-w-[24ch] truncate sm:max-w-[40ch]">
                  {p.title}
                </li>
              </ol>
            </nav>

            <header className="mt-8">
              <Eyebrow>{f.name}</Eyebrow>
              <h1 id="note-title" className="mt-4 text-display font-medium">
                {p.title}
              </h1>
              <p className="mt-5 text-small text-ink-mute">
                <a href={AUTHOR.url} rel="author" className="link text-ink">
                  {AUTHOR.name}
                </a>
                , {SITE.name}
                <span aria-hidden="true"> · </span>
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                {p.updated !== p.date ? (
                  <>
                    <span aria-hidden="true"> · </span>
                    Updated <time dateTime={p.updated}>{formatDate(p.updated)}</time>
                  </>
                ) : null}
                <span aria-hidden="true"> · </span>
                {p.minutes} min read
              </p>
              {p.summary ? <p className="mt-8 text-lead text-ink">{p.summary}</p> : null}
            </header>

            {p.tldr.length ? (
              <aside aria-labelledby="tldr-title" className="card card-raised mt-10 p-6 sm:p-7">
                <p id="tldr-title" className="text-label font-display font-semibold uppercase text-ink-mute">
                  {f.tldr}
                </p>
                <ul className="mt-4 space-y-3">
                  {p.tldr.map((t, i) => (
                    <li key={i} className="flex gap-3 text-ink">
                      <span aria-hidden="true" className="check-marker check-needle" />
                      {/* Escaped Markdown, rendered by lib/markdown.ts: no raw HTML can reach this. */}
                      <span className="[&_a]:link [&_code]:rounded-xs [&_code]:bg-linen [&_code]:px-1 [&_code]:text-[0.9em]" dangerouslySetInnerHTML={{ __html: t }} />
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}

            {p.figure ? <Figure note={p} size={size} /> : null}

            {/* Escaped Markdown, rendered by lib/markdown.ts: no raw HTML can reach this. */}
            <div className={`${PROSE} mt-10`} dangerouslySetInnerHTML={{ __html: p.html }} />

            {p.sources.length ? (
              <section aria-labelledby="sources-title" className="mt-14 border-t border-line pt-8">
                <h2 id="sources-title" className="font-display text-h3 font-semibold">
                  {f.sources}
                </h2>
                <ol className="mt-6 space-y-3 text-small">
                  {p.sources.map((s, i) => (
                    <li key={i} className="grid grid-cols-[2rem_1fr] text-ink-soft">
                      <span className="step-n">{i + 1}</span>
                      <span>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="link break-words text-ink">
                            {s.title}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        ) : (
                          s.title
                        )}
                        {s.source ? <>, {s.source}</> : null}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </article>
        </Container>
      </Section>

      <Section tone="linen" rule labelledBy="note-next-title">
        <Container>
          <h2 id="note-next-title" className="sr-only">
            FDE Club Switzerland and hiring
          </h2>
          <EndBox />
        </Container>
      </Section>

      {more.length ? (
        <Section labelledBy="more-notes-title">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="more-notes-title" className="text-h2 font-medium">
                {f.more}
              </h2>
              <ButtonLink href={FIELD_NOTES_PATH} variant="ghost" arrow className="self-start sm:self-auto">
                {f.all}
              </ButtonLink>
            </div>
            <NoteCards notes={more} className="mt-10" />
          </Container>
        </Section>
      ) : null}
    </>
  )
}
