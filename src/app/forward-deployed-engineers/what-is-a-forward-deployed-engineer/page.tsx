import Link from "next/link"
import { Cited } from "@/components/fde/cite"
import { StructuredData } from "@/components/structured-data"
import { ButtonLink } from "@/components/ui/button"
import { CheckList } from "@/components/ui/check-list"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Faq } from "@/components/ui/faq"
import { Frame } from "@/components/ui/frame"
import { Section } from "@/components/ui/section"
import { FDE_DEFINITION, FDE_GUIDE, FDE_GUIDE_FAQ, FDE_SOURCES } from "@/lib/content"
import { IMG } from "@/lib/images"
import { fdeGuideJsonLd, pageMetadata } from "@/lib/seo"
import { FDE_GUIDE_PATH, FDE_PATH, FDE_UPDATED, formatDate } from "@/lib/site"

const DESCRIPTION =
  "What a forward deployed engineer (FDE) does, where the title comes from, how it differs from solutions engineering, and where FDEs are hired in Switzerland."

export const metadata = pageMetadata({
  absoluteTitle: "What is a forward deployed engineer? FDE guide · Haystack",
  description: DESCRIPTION,
  path: FDE_GUIDE_PATH,
  keywords: [
    "what is a forward deployed engineer",
    "forward deployed engineer meaning",
    "FDE meaning",
    "forward deployed engineer role",
    "forward deployed engineer vs solutions engineer",
    "forward deployed software engineer",
    "FDSE",
    "how to become a forward deployed engineer",
    "forward deployed engineer skills",
    "forward deployed engineer Switzerland",
  ],
  article: { publishedTime: FDE_GUIDE.published, modifiedTime: FDE_UPDATED },
})

const PHOTO = IMG["speaker-no-ai-without-ia-slide"]
const g = FDE_GUIDE
const [origin, dayToDay, skills, whyNow, switzerland, become] = g.sections

// The definition, with "forward deployed engineer (FDE)" in bold once.
const TERM = "forward deployed engineer (FDE)"
const [defBefore, defAfter] = FDE_DEFINITION.split(TERM)

const TOC = [
  origin,
  dayToDay,
  { id: g.compare.id, title: g.compare.title },
  skills,
  whyNow,
  switzerland,
  become,
  { id: "faq", title: g.faqTitle },
  { id: "sources", title: g.sourcesTitle },
]

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-16 scroll-mt-24 border-t border-line pt-8 font-display text-h2 font-medium">
      {children}
    </h2>
  )
}

function Paras({ paras }: { paras?: readonly string[] }) {
  return (
    <>
      {paras?.map((p) => (
        <p key={p.slice(0, 40)} className="mt-5 max-w-prose-tight text-ink-soft">
          <Cited text={p} />
        </p>
      ))}
    </>
  )
}

export default function FdeGuidePage() {
  return (
    <>
      <StructuredData data={fdeGuideJsonLd(DESCRIPTION, PHOTO)} />

      <Section spacing="tight" labelledBy="guide-title">
        <Container className="grid-12 gap-y-10">
          <article className="col-span-12 lg:col-span-8">
            <nav aria-label="Breadcrumb" className="text-small text-ink-mute">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/" className="link">
                    Home
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li>
                  <Link href={FDE_PATH} className="link">
                    FDE Club Switzerland
                  </Link>
                  <span aria-hidden="true"> /</span>
                </li>
                <li aria-current="page">Guide</li>
              </ol>
            </nav>

            <header className="mt-8">
              <Eyebrow>{g.eyebrow}</Eyebrow>
              <h1 id="guide-title" className="mt-4 text-display font-medium">
                {g.title}
              </h1>
              <p className="mt-5 text-small text-ink-mute">
                {g.byline} · Updated <time dateTime={FDE_UPDATED}>{formatDate(FDE_UPDATED)}</time>
              </p>
            </header>

            {/* Answer first: the canonical definition, word for word */}
            <p className="mt-8 max-w-[40rem] text-lead text-ink">
              {defBefore}
              <strong className="font-semibold">{TERM}</strong>
              {defAfter}
            </p>

            <Frame
              image={PHOTO}
              ratio="16/9"
              priority
              sizes="(min-width:1280px) 780px, (min-width:1024px) 64vw, 100vw"
              caption={g.photoCaption}
              label="Fig. 01"
              className="mt-10"
            />

            <H2 id={origin.id}>{origin.title}</H2>
            <Paras paras={origin.paras} />

            <H2 id={dayToDay.id}>{dayToDay.title}</H2>
            <p className="mt-5 max-w-prose-tight text-ink-soft">{dayToDay.intro}</p>
            <ul className="mt-5 max-w-prose-tight space-y-3">
              {dayToDay.list?.map((item) => (
                <li key={item} className="flex gap-3 text-ink">
                  <span aria-hidden="true" className="check-marker check-needle" />
                  <span>
                    <Cited text={item} />
                  </span>
                </li>
              ))}
            </ul>
            {dayToDay.after ? (
              <p className="mt-5 max-w-prose-tight text-ink-soft">
                <Cited text={dayToDay.after} />
              </p>
            ) : null}

            <H2 id={g.compare.id}>{g.compare.title}</H2>
            <p className="mt-5 max-w-prose-tight text-ink-soft">
              <Cited text={g.compare.intro} />
            </p>
            <div
              role="region"
              aria-labelledby={g.compare.id}
              tabIndex={0}
              className="relative -mx-4 mt-8 overflow-x-auto border-y border-line bg-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink sm:mx-0 sm:rounded-md sm:border"
            >
              <table className="w-full min-w-[46rem] border-collapse text-left text-small">
                <caption className="sr-only">{g.compare.caption}</caption>
                <thead className="bg-linen">
                  <tr>
                    {g.compare.columns.map((c, i) => (
                      <th
                        key={c || "row"}
                        scope="col"
                        className="px-4 py-4 align-bottom font-display text-body font-semibold text-ink"
                      >
                        {i === 0 ? <span className="sr-only">Aspect</span> : c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.compare.rows.map(([label, ...cells]) => (
                    <tr key={label} className="border-t border-line align-top">
                      <th scope="row" className="px-4 py-4 font-display font-semibold text-ink">
                        {label}
                      </th>
                      {cells.map((c, i) => (
                        <td key={i} className={i === 0 ? "px-4 py-4 text-ink" : "px-4 py-4 text-ink-soft"}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 max-w-prose-tight text-small text-ink-mute">
              <Cited text={g.compare.note} />
            </p>

            <H2 id={skills.id}>{skills.title}</H2>
            <p className="mt-5 max-w-prose-tight text-ink-soft">
              <Cited text={skills.intro ?? ""} />
            </p>
            <ul className="mt-5 max-w-prose-tight space-y-3">
              {skills.list?.map((item) => (
                <li key={item} className="flex gap-3 text-ink">
                  <span aria-hidden="true" className="check-marker check-needle" />
                  <span>
                    <Cited text={item} />
                  </span>
                </li>
              ))}
            </ul>

            <H2 id={whyNow.id}>{whyNow.title}</H2>
            <Paras paras={whyNow.paras} />

            <H2 id={switzerland.id}>{switzerland.title}</H2>
            <Paras paras={switzerland.paras} />
            <p className="mt-6">
              <ButtonLink href={`${FDE_PATH}#hiring`} variant="ghost" arrow>
                {switzerland.link}
              </ButtonLink>
            </p>

            <H2 id={become.id}>{become.title}</H2>
            <Paras paras={become.paras} />

            <H2 id="faq">{g.faqTitle}</H2>
            <Faq items={FDE_GUIDE_FAQ} className="mt-6" />

            <H2 id="sources">{g.sourcesTitle}</H2>
            <ol className="mt-6 space-y-3 text-small">
              {FDE_SOURCES.map((s) => (
                <li key={s.n} id={`source-${s.n}`} className="grid scroll-mt-24 grid-cols-[2rem_1fr] text-ink-soft">
                  <span className="step-n">{s.n}</span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link break-words">
                    {s.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </article>

          {/* On this page (lg+), sticky beside the article */}
          <aside className="col-span-12 hidden lg:col-span-3 lg:col-start-10 lg:block">
            <nav aria-label="On this page" className="sticky top-[calc(var(--header-h)+2rem)]">
              <p className="text-label font-display font-semibold uppercase text-ink-mute">On this page</p>
              <ul className="mt-4 space-y-2 border-l border-line pl-4 text-small">
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-ink-soft hover:text-ink">
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </Container>
      </Section>

      {/* Next: the club and the hiring path. No closing slogan. */}
      <Section tone="linen" rule labelledBy="guide-next-title">
        <Container className="grid-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow>{g.next.title}</Eyebrow>
            <h2 id="guide-next-title" className="mt-4 max-w-[22ch] text-h2 font-medium">
              {g.next.heading}
            </h2>
            <p className="mt-5 max-w-[34rem] text-lead text-ink-soft">{g.next.body}</p>
          </div>
          <div className="col-span-12 flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <ButtonLink href={g.next.join.href} arrow className="w-full sm:w-auto">
              {g.next.join.label}
            </ButtonLink>
            <ButtonLink href={g.next.hire.href} variant="secondary" className="w-full sm:w-auto">
              {g.next.hire.label}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
